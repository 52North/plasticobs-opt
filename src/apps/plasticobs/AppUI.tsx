// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, ForceAuth, useAuthState } from "@open-pioneer/authentication";
import { Container, Text, Box } from "@open-pioneer/chakra-integration";
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";
import { useIntl, useService } from "open-pioneer:react-hooks";
import { Notifier } from "@open-pioneer/notifier";
import { UserInfo } from "./ui/UserInfo";
import { useEffect, useState } from "react";
import { GeoNodeUserService, TokenInfo } from "geonode";

export function AppUI() {
    const intl = useIntl();

    const authService = useService<AuthService>("authentication.AuthService");
    const authState = useAuthState(authService);
    const geonode = useService<GeoNodeUserService>("geonode.UserService");
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
    useEffect(() => {
        if (authState.kind === "authenticated") {
            geonode.getTokenInfo().then((obj) => {
                setTokenInfo(obj);
            });
        }
    }, [geonode]);

    return (
        <>
            <Notifier position="bottom-right" />
            <TitledSection
                title={
                    <Box role="region" textAlign="center" py={1}>
                        <SectionHeading size={"md"}>
                            PlasticObs+ Litterassessment Client
                        </SectionHeading>
                        <UserInfo />
                    </Box>
                }
            >
                <div>unprotected content</div>

                <ForceAuth
                    errorFallback={(error) => (
                        <div>fallback shown instead of protected content</div>
                    )}
                >
                    <TitledSection
                        title={
                            <SectionHeading size={"md"}>
                                {intl.formatMessage({ id: "heading" })}
                            </SectionHeading>
                        }
                    >
                        <Text pt={5}>{intl.formatMessage({ id: "text" })}</Text>
                        <div>Hello UserInfo</div>
                        <div>Username: {tokenInfo?.username}</div>
                        <div>E-Mail: {tokenInfo?.email}</div>
                        <div>Access Token: {tokenInfo?.access_token}</div>
                        <div>Expires in: {tokenInfo?.expires_in}</div>
                    </TitledSection>
                </ForceAuth>
            </TitledSection>
        </>
    );
}
