import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { GenerateType } from "../types/generate";
import { TsFieldDescriptor } from "../types/metadata";
import { PrimitiveType } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { getNamespaceName, getTagFileName } from "./generate/generate.utils";
import { getSchemaNameByRef, isPrimitiveType, isReferenceObject } from "./openapi.utils";

export function primitiveTypeToTsType(type: PrimitiveType): string {
  return match(type)
    .with("string", () => "string")
    .with("number", () => "number")
    .with("integer", () => "number")
    .with("boolean", () => "boolean")
    .exhaustive();
}

export function getSchemaTsProperties({
  schema,
  resolver,
  options,
}: {
  schema: OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsFieldDescriptor[] {
  return Object.entries(schema.properties ?? {}).map(([name, obj]) => ({
    name,
    required: schema.required?.includes(name) || false,
    ...getTsFieldType({ obj, resolver, options }),
  }));
}

const getTsFieldType = ({
  obj,
  resolver,
  options,
}: {
  obj: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): Pick<TsFieldDescriptor, "type" | "namespace" | "filePath"> => {
  if (isReferenceObject(obj)) {
    const schemaName = getSchemaNameByRef(obj.$ref);
    const tag = resolver.getTagByZodSchemaName(resolver.getZodSchemaNameByRef(obj.$ref));
    return {
      type: schemaName,
      namespace: getNamespaceName({ type: GenerateType.Models, tag, options }),
      filePath: getTagFileName({ type: GenerateType.Models, tag, includeTagDir: true, options }),
    };
  }
  if (obj.type === "array") {
    const itemsFieldType = getTsFieldType({ obj: obj.items as OpenAPIV3.SchemaObject, resolver, options });
    return { ...itemsFieldType, type: `${itemsFieldType.type}[]` };
  } else if (isPrimitiveType(obj.type)) {
    return { type: primitiveTypeToTsType(obj.type) };
  } else {
    return { type: "string" };
  }
};
