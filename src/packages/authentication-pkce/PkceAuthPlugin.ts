// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import {
    AuthPlugin,
    AuthState,
    AuthStateAuthenticated,
    LoginBehavior
} from "@open-pioneer/authentication";
import { Resource, createLogger, destroyResource } from "@open-pioneer/core";
import { NotificationService } from "@open-pioneer/notifier";
import {
    PackageIntl,
    Service,
    ServiceOptions,
    type DECLARE_SERVICE_INTERFACE
} from "@open-pioneer/runtime";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AccessContext, OAuth2AuthCodePkceClient } from "oauth2-pkce";
import { PkceOptions, PkceProperties } from "./api";

const LOG = createLogger("authentication-pkce:PkceAuthPlugin");

interface References {
    notifier: NotificationService;
}

export class PkceAuthPluginImpl implements Service, AuthPlugin {
    declare [DECLARE_SERVICE_INTERFACE]: "authentication-pkce.AuthPlugin";

    #notifier: NotificationService;
    #intl: PackageIntl;
    #pkceOptions: PkceOptions;
    #oauthClient: OAuth2AuthCodePkceClient;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #timerId: any;
    #watcher: Resource | undefined;

    #state = reactive<AuthState>({
        kind: "pending"
    });

    constructor(options: ServiceOptions<References>) {
        this.#notifier = options.references.notifier;
        this.#intl = options.intl;

        try {
            this.#pkceOptions = getPkceConfig(options.properties);
        } catch (e) {
            throw new Error("Invalid pkce configuration!", { cause: e });
        }

        try {
            const config = this.#pkceOptions.pkceConfig;
            this.#oauthClient = new OAuth2AuthCodePkceClient(config);
        } catch (e) {
            throw new Error("Failed to construct pkce client!", { cause: e });
        }

        const oauthClient = this.#oauthClient;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const patchedClient = oauthClient as any;
        patchedClient.ready.then(() => {
            if (oauthClient.isAuthorized()) {
                if (oauthClient.isAccessTokenExpired()) {
                    oauthClient
                        .exchangeRefreshTokenForAccessToken()
                        .then((ctx) => this.#restoreState(ctx));
                } else {
                    oauthClient.getTokens().then((ctx) => this.#restoreState(ctx));
                }
            } else if (oauthClient.isReturningFromAuthServer()) {
                this.#receiveCode().then(() => {
                    delete patchedClient.state.authorizationCode;
                    delete patchedClient.state.codeChallenge;
                    delete patchedClient.state.codeVerifier;
                    delete patchedClient.state.code;
                });
            } else {
                this.#startCodeFlow();
            }
        });
    }

    destroy() {
        clearInterval(this.#timerId);
        this.#watcher = destroyResource(this.#watcher);
        this.#timerId = undefined;
    }

    getAuthState(): AuthState {
        return this.#state.value;
    }

    getLoginBehavior(): LoginBehavior {
        const doLogin = async () => {
            this.#startCodeFlow();
        };
        return {
            kind: "effect",
            login: doLogin
        };
    }

    logout(): Promise<void> | void {
        return this.#oauthClient.reset();
    }

    async #startCodeFlow() {
        await this.#oauthClient.requestAuthorizationCode().catch((e) => {
            this.#updateState({
                kind: "error",
                error: e
            });
            this.#notifier.notify({
                level: "error",
                title: this.#intl.formatMessage({
                    id: "loginFailed.title"
                }),
                message: this.#intl.formatMessage({
                    id: "loginFailed.message"
                })
            });
            LOG.error("Failed to check if user is authenticated", e);
        });
    }

    async #receiveCode() {
        return this.#oauthClient
            .receiveCode()
            .then(async () => {
                const client = this.#oauthClient;
                const tokens = await client.getTokens();
                const isAuthorized = client.isAuthorized();
                if (isAuthorized) {
                    this.#restoreState(tokens);
                }
            })
            .catch((e) => {
                const error = typeof e === "string" ? new Error(e) : e;
                throw new Error("Failed to initialize PKCE session", { cause: error });
            });
    }

    #restoreState(tokens: AccessContext) {
        const pkceOptions = this.#pkceOptions;
        const refreshOptions = pkceOptions.refreshOptions;

        const idToken = jwtDecode<JwtPayload>(tokens.idToken!);
        const authState: AuthStateAuthenticated = {
            kind: "authenticated",
            sessionInfo: {
                userId: idToken.sub ?? "undefined"
                // userName: this.#keycloak.idTokenParsed?.preferred_username,
                // attributes: {
                //     keycloak: this.#keycloak,
                //     familyName: this.#keycloak.idTokenParsed?.family_name,
                //     givenName: this.#keycloak.idTokenParsed?.given_name,
                //     userName: this.#keycloak.idTokenParsed?.preferred_username
                // }
            }
        };
        this.#updateState(authState);
        LOG.debug(`User ${authState.sessionInfo.userId} is authenticated`);

        if (refreshOptions.autoRefresh) {
            LOG.debug("Starting auto-refresh", refreshOptions);
            this.__refresh(refreshOptions.interval);
        }
    }

    #updateState(newState: AuthState) {
        this.#state.value = newState;
    }

    private __refresh(interval: number) {
        clearInterval(this.#timerId);
        this.#timerId = setInterval(() => {
            this.#oauthClient
                .exchangeRefreshTokenForAccessToken()
                .then((ctx) => {
                    this.#restoreState(ctx);
                })
                .catch((e) => {
                    LOG.error("Failed to refresh token", e);
                    this.#updateState({
                        kind: "not-authenticated"
                    });
                    this.destroy();
                });
        }, interval);
    }
}

function getPkceConfig(properties: Partial<PkceProperties>): PkceOptions {
    const { pkceOptions } = properties;
    const { scopes, pkceConfig, refreshOptions } = pkceOptions!;
    return {
        pkceConfig: { ...pkceConfig, storeRefreshToken: true },
        scopes: Array.isArray(scopes) ? scopes : (scopes?.split(",") ?? ["openid"]),
        refreshOptions
    };
}
