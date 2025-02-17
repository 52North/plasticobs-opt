// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useIntl, useService } from "open-pioneer:react-hooks";
import { Component, FC, useEffect, useMemo, useState } from "react";
import { GeoNodeUserService, TokenInfo } from "geonode/api";
import { AuthService, useAuthState } from "@open-pioneer/authentication";
import { Box, Button } from "@open-pioneer/chakra-integration";

export const UserInfo: FC = () => {
    const intl = useIntl();
    const authService = useService<AuthService>("authentication.AuthService");
    const loginBehaviour = authService.getLoginBehavior();
    const authState = useAuthState(authService);
    const doLogout = () => authService.logout();

    if (authState.kind === "authenticated") {
        // TODO return userInfo component
        return <Button onClick={doLogout}>Logout</Button>;
    } else {
        // TODO return login button
        if (loginBehaviour.kind == "effect") {
            return <Button onClick={loginBehaviour.login}>Login to show protected content</Button>;
        } else {
            return <loginBehaviour.Fallback />;
        }
    }
};
