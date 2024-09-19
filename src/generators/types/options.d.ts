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

export type GenerateOptions = ZodSchemasGenerateOptions & EndpointsGenerateOptions;
