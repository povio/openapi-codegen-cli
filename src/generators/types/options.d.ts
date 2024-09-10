import { OpenAPIV3 } from "openapi-types";

export type ZodSchemasOptions = {
  withImplicitRequiredProps?: boolean;
  withDefaultValues?: boolean;
  complexityThreshold?: number;
  withDescription?: boolean;
  allReadonly?: boolean;
  strictObjects?: boolean;
  additionalPropertiesDefaultValue?: boolean | OpenAPIV3.SchemaObject;
};

export type EndpointsOptions = {
  withDeprecatedEndpoints?: boolean;
};
