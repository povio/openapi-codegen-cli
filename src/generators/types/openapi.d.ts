import { OpenAPIV3 } from "openapi-types";

export type CompositeType = "oneOf" | "anyOf" | "allOf" | "enum" | "array" | "empty-object" | "object" | "record";

export type SingleType = Exclude<OpenAPIV3.SchemaObject["type"], any[] | undefined>;

export type PrimitiveType = "string" | "number" | "integer" | "boolean";
