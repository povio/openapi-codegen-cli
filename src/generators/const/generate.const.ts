import { GenerateOptions } from "../types/options";
import { SCHEMA_SUFFIX } from "./zod.const";

export const TEMPLATE_DIR = "src/generators/templates";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  schemaSuffix: SCHEMA_SUFFIX,
  additionalPropertiesDefaultValue: false,
  modelsConfig: {
    outputFileNameSuffix: "models",
  },
  endpointsConfig: {
    outputFileNameSuffix: "api",
  },
  queriesConfig: {
    outputFileNameSuffix: "queries",
  },
};
