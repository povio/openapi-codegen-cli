import { OpenAPIV3 } from "openapi-types";
import { GenerateType } from "./generate";

interface ZodGenerateOptions {
  schemaSuffix: string;
  enumSuffix: string;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  strictObjects?: boolean;
  additionalPropertiesDefaultValue?: boolean | OpenAPIV3.SchemaObject;
  extractEnums?: boolean;
}

interface EndpointsGenerateOptions {
  withDeprecatedEndpoints?: boolean;
  removeOperationPrefixEndingWith?: string;
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
  includeNamespaces: boolean;
  importPath: "ts" | "relative" | "absolute";
  configs: Record<GenerateType, GenerateConfig>;
}

export type GenerateOptions = BaseGenerateOptions & ZodGenerateOptions & EndpointsGenerateOptions;
