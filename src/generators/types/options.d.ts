import { OpenAPIV3 } from "openapi-types";
import { GenerateConfig } from "./generate";

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

export type GenerateOptions = ZodSchemasGenerateOptions &
  EndpointsGenerateOptions & {
    modelsConfig: GenerateConfig;
    endpointsConfig: GenerateConfig;
    queriesConfig: GenerateConfig;
  };
