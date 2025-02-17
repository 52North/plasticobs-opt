// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { HttpService } from "@open-pioneer/http";
import { DeclaredService, ServiceOptions } from "@open-pioneer/runtime";
import { AuthService } from "@open-pioneer/authentication";
import { NotificationService } from "@open-pioneer/notifier";
import { GeoNodeConfigService } from "geonode/services/GeoNodeConfigService";

interface References {
    httpClient: HttpService;
    authService: AuthService;
    configService: GeoNodeConfigService;
    notifier: NotificationService;
}

export interface GeoNodeLitterAssessment extends DeclaredService<"geonode.dfki-litterassessment"> {
    foo(): void;
}

export class GeoNodeLitterAssessmentImpl implements GeoNodeLitterAssessment {
    #httpClient: HttpService;
    #authService: AuthService;
    #configService: GeoNodeConfigService;

    constructor(options: ServiceOptions<References>) {
        this.#httpClient = options.references.httpClient;
        this.#authService = options.references.authService;
        this.#configService = options.references.configService;
    }

    foo(): void {
        throw new Error("Method not implemented.");
    }
}
