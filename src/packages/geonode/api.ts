// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { DeclaredService } from "@open-pioneer/runtime";

export interface GeoNodeProperties {
    geonodeOptions: GeoNodeOptions;
}

export interface GeoNodeOptions {
    geonodeConfig: GeoNodeConfig;
}

export interface GeoNodeConfig {
    baseUrl: string | URL;
}

export interface TokenInfo {
    client_id: string;
    user_id: number;
    username: string;
    issued_to: string;
    access_token: string;
    email: string;
    verified_email: string;
    access_type: string;
    expires_in: number;
}

export interface GeoNodeUserService extends DeclaredService<"geonode.UserService"> {
    getUserInfo(): Promise<Response>;
    getTokenInfo(): Promise<TokenInfo>;
}
