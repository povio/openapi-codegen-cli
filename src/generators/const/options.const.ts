import { GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { SCHEMA_SUFFIX } from "./zod.const";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  // Base options
  output: "output",
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [], // TODO: Only works for isolated tags
  includeNamespaces: true,
  configs: {
    [GenerateType.Models]: {
      outputFileNameSuffix: "models",
      namespaceSuffix: "Models",
    },
    [GenerateType.Endpoints]: {
      outputFileNameSuffix: "api",
      namespaceSuffix: "Api",
    },
    [GenerateType.Queries]: {
      outputFileNameSuffix: "queries",
      namespaceSuffix: "Queries",
    },
  },
  // Zod options
  schemaSuffix: SCHEMA_SUFFIX,
  additionalPropertiesDefaultValue: false,
  // Endpoints options
  removeOperationPrefixEndingWith: "Controller_",
};
