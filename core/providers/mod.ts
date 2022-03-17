import { AkumaKodoLogger } from "../../internal/logger.ts";
import { AkumaKodoConfigurationInterface } from "../interfaces/Client.ts";
/**
 * Base provider class for all providers.
 */
export abstract class AkumaKodoProvider {
  protected logger: AkumaKodoLogger;
  protected constructor(options: ProviderOptions, config: AkumaKodoConfigurationInterface) {
    this.logger = new AkumaKodoLogger(config);
    if (options.provider === "mongodb") {
      if (!options.mongodb_connection_url) {
        throw new Error("MongoDB connection URL is required with this provider.");
      }
      this.logger.create("info", "Provider", "MongoDB provider loaded!");
    } else if (options.provider === "postgres") {
      this.logger.create("info", "Provider", "PostgreSQL provider loaded!");
    } else if (options.provider === "mysql") {
      this.logger.create("info", "Provider", "MySQL provider loaded!");
    } else {
      throw new Error("Invalid provider type! Please use one of the following: mongodb, postgres, mysql");
    }
  }
}

export interface ProviderOptions {
  provider: "mongodb" | "postgres" | "mysql";
  mongodb_connection_url?: string;
}

export interface BaseProviderModel {
  type?: "mongodb" | "postgres" | "mysql";
}

export { AkumaKodoMongodbProvider } from "./mongodb.ts";
