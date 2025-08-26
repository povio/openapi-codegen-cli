import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { TEMPLATE_DATA_TS_PATH, TEMPLATE_IMPORTS } from "./deps.const";
import { ENUM_SUFFIX, SCHEMA_SUFFIX } from "./zod.const";

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  // Base options
  input: "http://localhost:4000/docs-json/",
  output: "output",
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [],
  excludePathRegex: "",
  excludeRedundantZodSchemas: true,
  tsNamespaces: true,
  tsPath: TEMPLATE_DATA_TS_PATH,
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
  restClientImportPath: TEMPLATE_IMPORTS.appRestClient,
  errorHandlingImportPath: TEMPLATE_IMPORTS.errorHandling,
  removeOperationPrefixEndingWith: "Controller_",
  parseRequestParams: true,
  // Queries options
  queryTypesImportPath: TEMPLATE_IMPORTS.queryTypes,
  axiosRequestConfig: false,
  infiniteQueries: false,
  mutationEffects: true,
  // ACL options
  acl: true,
  checkAcl: true,
  abilityContextImportPath: TEMPLATE_IMPORTS.abilityContext,
  abilityContextGenericAppAbilities: false,
};
