// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    i18n: ["en"],
    services: {
        GeoNodeConfigServiceImpl: {
            provides: ["geonode.ConfigService"]
        },
        GeoNodeTokenInterceptor: {
            provides: ["http.Interceptor"],
            references: {
                authService: "authentication.AuthService",
                configService: "geonode.ConfigService"
            }
        },
        GeoNodeUserServiceImpl: {
            provides: ["geonode.UserService"],
            references: {
                authService: "authentication.AuthService",
                configService: "geonode.ConfigService",
                httpClient: "http.HttpService"
            }
        }
    },
    properties: {
        geonodeOptions: {
            geonodeConfig: null
        }
    }
});
