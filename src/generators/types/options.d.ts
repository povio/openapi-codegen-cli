import { OpenAPIV3 } from "openapi-types";
import { GenerateType } from "./generate";

type ZodGenerateOptions = {
  schemaSuffix: string;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  strictObjects?: boolean;
  additionalPropertiesDefaultValue?: boolean | OpenAPIV3.SchemaObject;
};

type EndpointsGenerateOptions = {
  withDeprecatedEndpoints?: boolean;
};

type GenerateConfig = {
  outputFileNameSuffix: string;
  namespaceSuffix: string;
};

type BaseGenerateOptions = {
  output: string;
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string[];
  includeNamespaces: boolean;
  configs: Record<GenerateType, GenerateConfig>;
};

export type GenerateOptions = BaseGenerateOptions & ZodGenerateOptions & EndpointsGenerateOptions;
