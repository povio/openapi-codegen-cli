import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { GenerateType } from "../types/generate";
import { TsNestedDataType, TsNestedProperty, TsNestedType, TsProperty, TsType } from "../types/metadata";
import { PrimitiveType } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { getNamespaceName, getTagFileName } from "./generate/generate.utils";
import { getImportedZodSchemaInferedTypeName } from "./generate/generate.zod.utils";
import { getSchemaNameByRef, isPrimitiveType, isReferenceObject } from "./openapi.utils";
import { isNamedZodSchema } from "./zod-schema.utils";

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
}): TsProperty[] {
  return Object.entries(schema.properties ?? {}).map(([name, obj]) => ({
    name,
    isRequired: schema.required?.includes(name) || false,
    ...getObjTsPropertyType({ obj, resolver, options }),
  }));
}

function getObjTsPropertyType({
  obj,
  resolver,
  options,
}: {
  obj: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): Pick<TsProperty, "type" | "namespace" | "filePath"> {
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
    const itemsFieldType = getObjTsPropertyType({ obj: obj.items as OpenAPIV3.SchemaObject, resolver, options });
    return { ...itemsFieldType, type: `${itemsFieldType.type}[]` };
  } else if (isPrimitiveType(obj.type)) {
    return { type: primitiveTypeToTsType(obj.type) };
  }

  return { type: "void" };
}

export function getTypeInfo({
  zodSchemaName,
  schema,
  resolver,
  options,
}: {
  zodSchemaName?: string;
  schema?: OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): Omit<TsType, "isRequired"> {
  let type = "void";
  let tag: string | undefined;
  if (zodSchemaName && isNamedZodSchema(zodSchemaName)) {
    type = getImportedZodSchemaInferedTypeName({ resolver, zodSchemaName, options });
    tag = resolver.getTagByZodSchemaName(zodSchemaName);
  } else if (schema?.type && isPrimitiveType(schema?.type)) {
    type = primitiveTypeToTsType(schema?.type);
  }

  const splitType = type.split(".");
  return {
    type: splitType[splitType.length - 1],
    ...(splitType.length > 1 ? { namespace: splitType[0] } : {}),
    ...(tag ? { filePath: getTagFileName({ type: GenerateType.Models, tag, includeTagDir: true, options }) } : {}),
  };
}

export function getSchemaTsNestedDataType({
  schema,
  resolver,
  options,
}: {
  schema?: OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsNestedDataType {
  const dataType = schema?.type;

  if (dataType === "array") {
    const arrayType = getArraySchemaTsNestedType({
      arraySchema: schema as OpenAPIV3.ArraySchemaObject,
      resolver,
      options,
    });
    return { dataType, arrayType };
  } else if (dataType === "object") {
    const objectProperties = getSchemaTsNestedProperties({ schema, resolver, options });
    return { dataType, objectProperties };
  }

  return { dataType: "primitive" };
}

function getArraySchemaTsNestedType({
  arraySchema,
  resolver,
  options,
}: {
  arraySchema: OpenAPIV3.ArraySchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsNestedType {
  let zodSchemaName: string | undefined;
  let schema: OpenAPIV3.SchemaObject | undefined;
  if (isReferenceObject(arraySchema.items)) {
    const ref = arraySchema.items.$ref;
    zodSchemaName = resolver.getZodSchemaNameByRef(ref);
    schema = resolver.getSchemaByRef(ref);
  } else {
    schema = arraySchema.items as OpenAPIV3.SchemaObject;
  }

  const typeInfo = getTypeInfo({ zodSchemaName, schema, resolver, options });
  const tsNestedDataType = getSchemaTsNestedDataType({ schema, resolver, options });
  return { ...typeInfo, ...tsNestedDataType };
}

function getSchemaTsNestedProperties({
  schema,
  resolver,
  options,
}: {
  schema?: OpenAPIV3.SchemaObject | undefined;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsNestedProperty[] {
  return Object.entries(schema?.properties ?? {}).map(([name, property]) => {
    const isRequired = schema?.required?.includes(name) ?? false;

    if (isReferenceObject(property)) {
      const zodSchemaName = resolver.getZodSchemaNameByRef(property.$ref);
      const schema = resolver.getSchemaByRef(property.$ref);
      const typeInfo = getTypeInfo({ zodSchemaName, schema, resolver, options });
      const tsNestedDataType = getSchemaTsNestedDataType({ schema, resolver, options });
      return { name, isRequired, ...typeInfo, ...tsNestedDataType };
    } else if (property.type === "array") {
      const arrayType = getArraySchemaTsNestedType({
        arraySchema: property as OpenAPIV3.ArraySchemaObject,
        resolver,
        options,
      });
      return { name, isRequired, type: "array", dataType: "array", arrayType };
    } else if (isPrimitiveType(property.type)) {
      return { name, isRequired, type: primitiveTypeToTsType(property.type), dataType: "primitive" };
    }

    return { name, isRequired, type: "void", dataType: "primitive" };
  });
}
