import { GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { ENUM_SUFFIX, SCHEMA_SUFFIX } from "./zod.const";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  // Base options
  input: "",
  output: "output",
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [], // TODO: Only works for isolated tags
  tsNamespaces: true,
  importPath: "ts",
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
    [GenerateType.Acl]: {
      outputFileNameSuffix: "acl",
      namespaceSuffix: "Acl",
    },
  },
  standalone: false,
  baseUrl: "",
  // Zod options
  schemaSuffix: SCHEMA_SUFFIX,
  enumSuffix: ENUM_SUFFIX,
  withDefaultValues: true,
  extractEnums: true,
  replaceOptionalWithNullish: false,
  // Endpoints options
  removeOperationPrefixEndingWith: "Controller_",
  // Queries options
  axiosRequestConfig: false,
  infiniteQueries: false,
  invalidateQueryOptions: true,
  fileActions: true,
};
