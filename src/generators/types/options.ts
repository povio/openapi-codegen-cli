import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  schemaSuffix: string;
  enumSuffix: string;
  modelsInCommon?: boolean;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  extractEnums?: boolean;
  replaceOptionalWithNullish?: boolean;
}

interface EndpointsGenerateOptions {
  restClientImportPath: string;
  errorHandlingImportPath?: string;
  withDeprecatedEndpoints?: boolean;
  removeOperationPrefixEndingWith?: string;
  parseRequestParams?: boolean;
  inlineEndpoints?: boolean;
  inlineEndpointsExcludeModules?: string[];
}

interface QueriesGenerateOptions {
  queryTypesImportPath: string;
  axiosRequestConfig?: boolean;
  mutationEffects?: boolean;
  workspaceContext?: boolean;
}

interface InfiniteQueriesGenerateOptions {
  infiniteQueries?: boolean;
  infiniteQueryParamNames: {
    page: string;
  };
  infiniteQueryResponseParamNames: {
    page: string;
    totalItems: string;
    limit: string;
  };
}

interface ACLGenerateOptions {
  acl: boolean;
  checkAcl?: boolean;
  abilityContextGenericAppAbilities: boolean;
  abilityContextImportPath?: string;
}

interface BuilderConfigsGenerateOptions {
  builderConfigs?: boolean;
  filterParamName: string;
  dataResponseParamNames: string[];
  dynamicInputsImportPath: string;
  dynamicColumnsImportPath: string;
}

interface GenerateConfig {
  outputFileNameSuffix: string;
  namespaceSuffix: string;
}

interface BaseGenerateOptions {
  input: string;
  output: string;
  incremental?: boolean;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string[];
  excludePathRegex: string;
  excludeRedundantZodSchemas: boolean;
  tsNamespaces: boolean;
  tsPath: string;
  importPath: "ts" | "relative" | "absolute";
  configs: Record<GenerateType, GenerateConfig>;
  baseUrl: string;
  modelsOnly?: boolean;
  standalone?: boolean;
}

export interface GenerateOptions
  extends
    BaseGenerateOptions,
    ZodGenerateOptions,
    EndpointsGenerateOptions,
    QueriesGenerateOptions,
    InfiniteQueriesGenerateOptions,
    ACLGenerateOptions,
    BuilderConfigsGenerateOptions {}
