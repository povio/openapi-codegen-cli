import { GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { TEMPLATE_IMPORTS } from "./deps.const";
import { ENUM_SUFFIX, SCHEMA_SUFFIX } from "./zod.const";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  // Base options
  input: "",
  output: "output",
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [],
  excludePathRegex: "",
  excludeRedundantZodSchemas: true,
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
  abilityContextImportPath: TEMPLATE_IMPORTS.abilityContext.template,
  // Zod options
  schemaSuffix: SCHEMA_SUFFIX,
  enumSuffix: ENUM_SUFFIX,
  withDefaultValues: true,
  extractEnums: true,
  replaceOptionalWithNullish: false,
  // Endpoints options
  restClientImportPath: TEMPLATE_IMPORTS.appRestClient.template,
  errorHandlingImportPath: TEMPLATE_IMPORTS.errorHandling.template,
  removeOperationPrefixEndingWith: "Controller_",
  parseRequestParams: false,
  checkAcl: false,
  // Queries options
  queryTypesImportPath: TEMPLATE_IMPORTS.queryTypes.template,
  axiosRequestConfig: false,
  infiniteQueries: false,
  mutationEffects: true,
};
