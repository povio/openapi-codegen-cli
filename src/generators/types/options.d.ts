import { OpenAPIV3 } from "openapi-types";

export type ZodSchemasGenerateOptions = {
  schemaSuffix: string;
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  withDescription?: boolean;
  allReadonly?: boolean;
  strictObjects?: boolean;
  additionalPropertiesDefaultValue?: boolean | OpenAPIV3.SchemaObject;
};

export type EndpointsGenerateOptions = {
  withDeprecatedEndpoints?: boolean;
};

type GenerateConfig = {
  outputFileNameSuffix: string;
};

type BaseGenerateOptions = {
  splitByTags: boolean;
  defaultTag: string;
  excludeTags: string[];
  modelsConfig: GenerateConfig;
  endpointsConfig: GenerateConfig;
  queriesConfig: GenerateConfig;
};

export type GenerateOptions = BaseGenerateOptions & ZodSchemasGenerateOptions & EndpointsGenerateOptions;
