import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  /** Eagerly compile non-recursive schemas. Defaults to false to avoid startup work. */
  compileSchemas?: boolean;
  /** Build namespace model schemas on first access instead of at import. Requires tsNamespaces. */
  lazySchemas?: boolean;
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
  /** Component schemas to generate even when no included operation uses them, with their dependencies. */
  includeSchemas: string[];
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
    ACLGenerateOptions {}
