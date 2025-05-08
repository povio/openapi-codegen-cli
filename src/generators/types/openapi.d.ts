import { OpenAPIV3 } from "openapi-types";

export type CompositeType = "oneOf" | "anyOf" | "allOf" | "enum" | "array" | "empty-object" | "object" | "record";

export type SingleType = Exclude<OpenAPIV3.SchemaObject["type"], any[] | undefined>;

export type PrimitiveType = "string" | "number" | "integer" | "boolean";

export interface OperationAclInfo {
  action: string;
  subject: string;
  conditions?: Record<string, string>;
  description?: string;
}

interface OperationObjectAdditions {
  "x-acl"?: OperationAclInfo[];
  "x-media-upload"?: any;
  "x-media-download"?: any;
}

export type OperationObject = OpenAPIV3.OperationObject<OperationObjectAdditions>;
