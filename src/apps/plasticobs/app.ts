// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./AppUI";
import { PkceOptions, PkceProperties } from "authentication-pkce";

const Element = createCustomElement({
    component: AppUI,
    appMetadata,
    config: {
        properties: {
            "geonode": {
                geonodeOptions: {
                    geonodeConfig: {
                        baseUrl: import.meta.env.VITE_GEONODE_BASE_URL
                    }
                }
            },
            "authentication-pkce": {
                pkceOptions: {
                    scopes: import.meta.env.VITE_PKCE_CONFIG_SCOPES,
                    pkceConfig: {
                        authorizationUrl: import.meta.env.VITE_PKCE_CONFIG_AUTHORIZATION_URL,
                        clientId: import.meta.env.VITE_PKCE_CONFIG_CLIENT_ID,
                        redirectUrl: import.meta.env.VITE_PKCE_CONFIG_REDIRECT_URL,
                        tokenUrl: import.meta.env.VITE_PKCE_CONFIG_TOKEN_URL,
                        extraAuthorizationParams: import.meta.env
                            .VITE_PKCE_CONFIG_EXTRA_AUTHORIZATION_PARAMS,
                        extraRefreshParams: import.meta.env.VITE_PKCE_CONFIG_EXTRA_REFRESH_PARAMS,
                        storeRefreshToken: import.meta.env.VITE_PKCE_CONFIG_STORE_REFRESH_TOKEN
                    },
                    refreshOptions: {
                        autoRefresh: import.meta.env.VITE_PKCE_REFRESH_OPTIONS_AUTO_REFRESH,
                        interval: import.meta.env.VITE_PKCE_REFRESH_OPTIONS_INTERVAL
                    }
                } satisfies PkceOptions
            }
        }
    }
});

customElements.define("plasticobs-app", Element);
