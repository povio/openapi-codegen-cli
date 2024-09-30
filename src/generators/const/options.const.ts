import { GenerateOptions } from "../types/options";
import { SCHEMA_SUFFIX } from "./zod.const";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  schemaSuffix: SCHEMA_SUFFIX,
  additionalPropertiesDefaultValue: false,
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [],
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
