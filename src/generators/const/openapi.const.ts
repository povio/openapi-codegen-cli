import { OpenAPIV3 } from "openapi-types";

export const COMPLEXITY_THRESHOLD = 2;
export const ALLOWED_PARAM_MEDIA_TYPES = [
  "application/octet-stream",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
  "*/*",
];
export const ALLOWED_PATH_IN = ["query", "header", "path"] as Array<OpenAPIV3.ParameterObject["in"]>;
export const ALLOWED_METHODS = [
  OpenAPIV3.HttpMethods.GET,
  OpenAPIV3.HttpMethods.PUT,
  OpenAPIV3.HttpMethods.POST,
  OpenAPIV3.HttpMethods.DELETE,
  OpenAPIV3.HttpMethods.OPTIONS,
  OpenAPIV3.HttpMethods.HEAD,
  OpenAPIV3.HttpMethods.PATCH,
  OpenAPIV3.HttpMethods.TRACE,
] as Array<OpenAPIV3.HttpMethods>;
export const PRIMITIVE_TYPE_LIST = ["string", "number", "integer", "boolean"];
export const COMPOSITE_KEYWORDS = ["allOf", "anyOf", "oneOf"] as (keyof OpenAPIV3.SchemaObject)[];
