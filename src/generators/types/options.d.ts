import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  schemaSuffix: string;
  enumSuffix: string;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  strictObjects?: boolean;
  extractEnums?: boolean;
  replaceOptionalWithNullish?: boolean;
}

interface EndpointsGenerateOptions {
  withDeprecatedEndpoints?: boolean;
  removeOperationPrefixEndingWith?: string;
}

interface QueriesGenerateOptions {
  axiosRequestConfig?: boolean;
  infiniteQueries?: boolean;
  invalidateQueryOptions?: boolean;
}

interface GenerateConfig {
  outputFileNameSuffix: string;
  namespaceSuffix: string;
}

interface BaseGenerateOptions {
  input: string;
  output: string;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string[];
  excludePathRegex: string;
  tsNamespaces: boolean;
  importPath: "ts" | "relative" | "absolute";
  configs: Record<GenerateType, GenerateConfig>;
  standalone: boolean;
  baseUrl: string;
}

export type GenerateOptions = BaseGenerateOptions &
  ZodGenerateOptions &
  EndpointsGenerateOptions &
  QueriesGenerateOptions;
