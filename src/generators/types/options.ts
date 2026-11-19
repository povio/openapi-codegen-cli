import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  /** Eagerly compile non-recursive schemas. Defaults to false to avoid startup work. */
  compileSchemas?: boolean;
  /** Build namespace model schemas on first access instead of at import. Requires tsNamespaces. */
  lazySchemas?: boolean;
  /** Emit JSDoc comments in generated code. Defaults to false. */
  generateJsDoc?: boolean;
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
    /** Query parameter of page-number paginated GET endpoints. */
    page: string;
    /**
     * String query parameter of cursor paginated GET endpoints (default: "cursor"); takes precedence over `page`.
     * Set to an empty string to disable cursor pagination.
     */
    cursor?: string;
  };
  infiniteQueryResponseParamNames: {
    page: string;
    totalItems: string;
    limit: string;
    /** String response field holding the cursor of the next page of cursor paginated endpoints (default: "nextCursor"). */
    nextCursor?: string;
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
  /**
   * Format generated files with the project's oxfmt config (nearest `.oxfmtrc.json` above the
   * output, also used by `bun fmt`) when `oxfmt` is installed. Defaults to true.
   */
  format?: boolean;
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
