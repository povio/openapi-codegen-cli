import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { GenerateType } from "../types/generate";
import { TsMetaType, TsNestedProperty, TsNestedType, TsObjectMetaType, TsType } from "../types/metadata";
import { PrimitiveType } from "../types/openapi";
import { GenerateOptions } from "../types/options";
import { getTagFileName } from "./generate/generate.utils";
import { getImportedZodSchemaInferedTypeName } from "./generate/generate.zod.utils";
import { isPrimitiveType, isReferenceObject } from "./openapi.utils";
import { isNamedZodSchema } from "./zod-schema.utils";

export function primitiveTypeToTsType(type: PrimitiveType): string {
  return match(type)
    .with("string", () => "string")
    .with("number", () => "number")
    .with("integer", () => "number")
    .with("boolean", () => "boolean")
    .exhaustive();
}

export function getTsType({
  zodSchemaName,
  schema,
  resolver,
  options,
}: {
  zodSchemaName?: string;
  schema?: OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsType {
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

export function getSchemaTsMetaType({
  schema,
  isCircular,
  parentTypes,
  resolver,
  options,
}: {
  schema?: OpenAPIV3.SchemaObject;
  isCircular?: boolean;
  parentTypes: TsType[];
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsMetaType {
  if (!schema) {
    return { metaType: "primitive" };
  }

  const compositeKeywords = ["allOf", "anyOf", "oneOf"] as (keyof OpenAPIV3.SchemaObject)[];
  for (const compositeKeyword of compositeKeywords) {
    const compositeObjs = schema[compositeKeyword] as (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[];
    if (!compositeObjs) {
      continue;
    }
    if (compositeObjs.length > 1) {
      const metaTypes = compositeObjs.map((compositeObj) => {
        const compositeSchema = resolver.resolveObject(compositeObj);
        return getSchemaTsMetaType({ schema: compositeSchema, parentTypes, resolver, options });
      });
      if (metaTypes.every(({ metaType }) => metaType === "object")) {
        return {
          metaType: "object",
          objectProperties: (metaTypes as TsObjectMetaType[]).reduce((acc, { objectProperties }) => {
            const objectPropertyNames = objectProperties.map(({ name }) => name);
            return [...acc.filter(({ name }) => !objectPropertyNames.includes(name)), ...objectProperties];
          }, [] as TsNestedProperty[]),
        };
      } else {
        return {
          metaType: "composite",
          [compositeKeyword]: metaTypes,
        };
      }
    } else {
      schema = resolver.resolveObject(compositeObjs[0]);
    }
  }

  if (schema.type === "array") {
    const arrayType = getArraySchemaTsNestedType({
      arraySchema: schema as OpenAPIV3.ArraySchemaObject,
      resolver,
      options,
      parentTypes,
    });
    return { metaType: "array", arrayType };
  } else if ((schema.type === "object" || schema.properties) && isCircular) {
    return { metaType: "object", objectProperties: [], isCircular: true };
  } else if (schema.type === "object" || schema.properties) {
    const objectProperties = getSchemaTsNestedProperties({ schema, parentTypes, resolver, options });
    return { metaType: "object", objectProperties };
  }

  return { metaType: "primitive" };
}

function getArraySchemaTsNestedType({
  arraySchema,
  parentTypes,
  resolver,
  options,
}: {
  arraySchema: OpenAPIV3.ArraySchemaObject;
  parentTypes: TsType[];
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

  const tsType = getTsType({ zodSchemaName, schema, resolver, options });
  const isCircular = getIsCircular(tsType, parentTypes);
  const tsMetaType = getSchemaTsMetaType({
    schema,
    isCircular,
    parentTypes: [...parentTypes, tsType],
    resolver,
    options,
  });
  return { ...tsType, ...tsMetaType };
}

function getSchemaTsNestedProperties({
  schema,
  parentTypes,
  resolver,
  options,
}: {
  schema?: OpenAPIV3.SchemaObject | undefined;
  parentTypes: TsType[];
  resolver: SchemaResolver;
  options: GenerateOptions;
}): TsNestedProperty[] {
  return Object.entries(schema?.properties ?? {}).map(([name, property]) => {
    const isRequired = schema?.required?.includes(name) ?? false;

    if (isReferenceObject(property)) {
      const zodSchemaName = resolver.getZodSchemaNameByRef(property.$ref);
      const schema = resolver.getSchemaByRef(property.$ref);
      const tsType = getTsType({ zodSchemaName, schema, resolver, options });
      const isCircular = getIsCircular(tsType, parentTypes);
      const tsMetaType = getSchemaTsMetaType({
        schema,
        isCircular,
        parentTypes: [...parentTypes, tsType],
        resolver,
        options,
      });
      return { name, isRequired, ...tsType, ...tsMetaType };
    } else if (property.type === "array") {
      const arrayType = getArraySchemaTsNestedType({
        arraySchema: property as OpenAPIV3.ArraySchemaObject,
        parentTypes,
        resolver,
        options,
      });
      return { name, isRequired, type: "array", metaType: "array", arrayType };
    } else if (isPrimitiveType(property.type)) {
      return { name, isRequired, type: primitiveTypeToTsType(property.type), metaType: "primitive" };
    }

    return { name, isRequired, type: "void", metaType: "primitive" };
  });
}

function getIsCircular(tsType: TsType, parentTypes: TsType[]) {
  return parentTypes.findIndex(({ type, namespace }) => type === tsType.type && namespace === tsType.namespace) > -1;
}
