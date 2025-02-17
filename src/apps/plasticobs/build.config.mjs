// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    i18n: ["en"],
    services: {
        GeoNodeLitterAssessmentImpl: {
            provides: ["geonode.dfki-litterassessment"],
            references: {
                httpClient: "http.HttpService",
                configService: "geonode.ConfigService",
                authService: "authentication.AuthService",
                notifier: "notifier.NotificationService"
            }
        }
    },
    properties: {
        geonodeOptions: {
            geonodeConfig: null
        }
    },
    ui: {
        references: ["geonode.UserService", "authentication.AuthService"]
    }
});
