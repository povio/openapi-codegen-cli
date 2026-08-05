import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  schemaSuffix: string;
  enumSuffix: string;
  modelsInCommon?: boolean;
  modelsInModules?: boolean;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  extractEnums?: boolean;
  replaceOptionalWithNullish?: boolean;
}

interface EndpointsGenerateOptions {
  restClient: "axios" | "native";
  restClientImportPath: string;
  zodImportPath: string;
  errorHandlingImportPath?: string;
  withDeprecatedEndpoints?: boolean;
  removeOperationPrefixEndingWith?: string;
  parseRequestParams?: boolean;
  inlineEndpoints?: boolean;
  inlineEndpointsExcludeModules?: string[];
}

interface QueriesGenerateOptions {
  queryTypesImportPath: string;
  mutationEffectsImportPath: string;
  axiosRequestConfig?: boolean;
  mutationEffects?: boolean;
  mutationDefaultOnError?: boolean;
  workspaceContext?: string[];
  prefetchQueries?: boolean;
  mutationScope?: boolean | { include: string[] } | { exclude: string[] };
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
  aclCheckImportPath: string;
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
  clearOutput?: boolean;
  incremental?: boolean;
  splitByTags: boolean;
  defaultTag: string;
  includeTags: string[];
  excludeTags: string[];
  excludePathRegex: string;
  excludeRedundantZodSchemas: boolean;
  tsNamespaces: boolean;
  treeShakeableNamespaces?: boolean;
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
