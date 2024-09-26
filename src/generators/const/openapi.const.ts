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
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as Array<OpenAPIV3.HttpMethods>;
export const PRIMITIVE_TYPE_LIST = ["string", "number", "integer", "boolean"];
