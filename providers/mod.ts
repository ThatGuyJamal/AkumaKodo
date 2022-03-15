import {AkumaKodoLogger} from "../internal/logger.ts";
import {AkumaCreateBotOptions} from "../core/interfaces/Client.ts";
/**
 * Base provider class for all providers.
 */
export abstract class AkumaKodoProvider {
  protected model: BaseProviderModel;
  protected logger: AkumaKodoLogger;
  protected constructor(options: ProviderOptions, model: BaseProviderModel, config: AkumaCreateBotOptions) {
    this.logger = new AkumaKodoLogger(config);
    if (options.provider === "mongodb") {
      if (!options.mongodb_connection_url) {
        throw new Error("MongoDB connection URL is required.");
      }
      this.model = model;
      this.logger.create("info", "Provider", "MongoDB provider loaded!");
    } else if (options.provider === "postgres") {
      this.model = model;
      this.logger.create("info", "Provider", "PostgreSQL provider loaded!");
    } else if (options.provider === "mysql") {
      this.model = model;
      this.logger.create("info", "Provider", "MySQL provider loaded!");
    } else {
      throw new Error("Invalid provider type! Please use one of the following: mongodb, postgres, mysql");
    }
  }
}

export interface ProviderOptions {
  provider: "mongodb" | "postgres" | "mysql";
  // deno-lint-ignore no-explicit-any
  model: any;
  mongodb_connection_url?: string;
}

export interface BaseProviderModel {
  type?: "mongodb" | "postgres" | "mysql";
}
