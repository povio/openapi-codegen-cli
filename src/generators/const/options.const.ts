import { GenerateType } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
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
  tsPath: "@/data",
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
    [GenerateType.Configs]: {
      outputFileNameSuffix: "configs",
      namespaceSuffix: "Configs",
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
  restClientImportPath: "@/util/rest/clients/app-rest-client",
  errorHandlingImportPath: "@/util/vendor/error-handling",
  removeOperationPrefixEndingWith: "Controller_",
  parseRequestParams: true,
  // Queries options
  queryTypesImportPath: "@/types/react-query",
  axiosRequestConfig: false,
  mutationEffects: true,
  // Infinite queries options
  infiniteQueries: false,
  infiniteQueryParamNames: {
    page: "page",
  },
  infiniteQueryResponseParamNames: {
    page: "page",
    totalItems: "totalItems",
    limit: "limit",
  },
  // ACL options
  acl: true,
  checkAcl: true,
  abilityContextImportPath: "@/data/acl/ability.context",
  abilityContextGenericAppAbilities: false,
  // Builder Configs options
  builderConfigs: false,
  filterParamName: "filter",
  dataResponseParamNames: ["data", "items"],
  dynamicInputsImportPath: "@povio/ui",
  dynamicColumnsImportPath: "@povio/ui",
};
