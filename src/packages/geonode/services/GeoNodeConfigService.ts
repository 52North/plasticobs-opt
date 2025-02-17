// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { DeclaredService, Service, ServiceOptions } from "@open-pioneer/runtime";
import { GeoNodeConfig, GeoNodeOptions, GeoNodeProperties } from "../api";

interface Reference {
    // services references
}

export interface GeoNodeConfigService extends DeclaredService<"geonode.ConfigService"> {
    getGeonodeConfig(): GeoNodeConfig;
}

export class GeoNodeConfigServiceImpl implements GeoNodeConfigService {
    #geonodeOptions: GeoNodeOptions;

    constructor(options: ServiceOptions<Reference>) {
        this.#geonodeOptions = getProperties(options.properties);
    }

    getGeonodeConfig(): GeoNodeConfig {
        return this.#geonodeOptions.geonodeConfig;
    }
}

function getProperties(properties: Partial<GeoNodeProperties>): GeoNodeOptions {
    const { geonodeOptions } = properties;

    const { geonodeConfig } = geonodeOptions!;

    return {
        geonodeConfig: {
            baseUrl: new URL(geonodeConfig.baseUrl)
        }
    };
}
