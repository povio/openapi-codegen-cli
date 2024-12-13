import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { TsFieldDescriptor } from "../types/generate";
import { PrimitiveType } from "../types/openapi";
import { getSchemaNameByRef, isPrimitiveType, isReferenceObject } from "./openapi.utils";

export function primitiveTypeToTsType(type: PrimitiveType): string {
  return match(type)
    .with("string", () => "string")
    .with("number", () => "number")
    .with("integer", () => "number")
    .with("boolean", () => "boolean")
    .exhaustive();
}

export function getSchemaTsProperties(schema: OpenAPIV3.SchemaObject): TsFieldDescriptor[] {
  return Object.entries(schema.properties ?? {}).map(([name, obj]) => ({
    name,
    type: getTsPropertyType(obj),
    required: schema.required?.includes(name) || false,
  }));
}

const getTsPropertyType = (obj: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): string => {
  if (isReferenceObject(obj)) {
    return getSchemaNameByRef(obj.$ref);
  }
  if (obj.type === "array") {
    return `${getTsPropertyType(obj.items as OpenAPIV3.SchemaObject)}[]`;
  } else if (isPrimitiveType(obj.type)) {
    return primitiveTypeToTsType(obj.type);
  } else {
    return "unknown";
  }
};
