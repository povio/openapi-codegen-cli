import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "src/generators/utils/openapi-schema.utils";
import { match } from "ts-pattern";
import { COMPOSITE_KEYWORDS } from "src/generators/const/openapi.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType } from "src/generators/types/generate";
import { TsMetaType, TsObjectMetaType, TsProperty, TsType, TsTypeBase } from "src/generators/types/metadata";
import { PrimitiveType } from "src/generators/types/openapi";
import { getTagImportPath } from "./generate/generate.utils";
import { getImportedZodSchemaInferedTypeName } from "./generate/generate.zod.utils";
import { isPrimitiveType } from "./openapi.utils";
import { isNamedZodSchema } from "./zod-schema.utils";

export function primitiveTypeToTsType(type: PrimitiveType): string {
  return match(type)
    .with("string", () => "string")
    .with("number", () => "number")
    .with("integer", () => "number")
    .with("boolean", () => "boolean")
    .exhaustive();
}

export function getTsTypeBase({
  zodSchemaName,
  schema,
  resolver,
}: {
  zodSchemaName?: string;
  schema?: OpenAPIV3.SchemaObject;
  resolver: SchemaResolver;
}): TsTypeBase {
  let type = "void";
  let tag: string | undefined;
  if (zodSchemaName && isNamedZodSchema(zodSchemaName)) {
    type = getImportedZodSchemaInferedTypeName(resolver, zodSchemaName);
    tag = resolver.getTagByZodSchemaName(zodSchemaName);
  } else if (schema?.type && isPrimitiveType(schema?.type)) {
    type = primitiveTypeToTsType(schema?.type);
  }

  const splitType = type.split(".");
  return {
    type: splitType[splitType.length - 1],
    ...(splitType.length > 1 ? { namespace: splitType[0] } : {}),
    ...(tag
      ? {
          importPath: getTagImportPath({
            type: GenerateType.Models,
            tag,
            includeTagDir: true,
            options: resolver.options,
          }),
        }
      : {}),
  };
}

export function getSchemaTsMetaType({
  schema,
  isCircular,
  parentTypes,
  resolver,
}: {
  schema?: OpenAPIV3.SchemaObject;
  isCircular?: boolean;
  parentTypes: TsTypeBase[];
  resolver: SchemaResolver;
}): TsMetaType {
  if (!schema) {
    return { metaType: "primitive" };
  }

  for (const compositeKeyword of COMPOSITE_KEYWORDS) {
    const compositeObjs = schema[compositeKeyword] as (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[];
    if (!compositeObjs) {
      continue;
    }
    if (compositeObjs.length > 1) {
      const metaTypes = compositeObjs.map((compositeObj) => {
        const compositeSchema = resolver.resolveObject(compositeObj);
        return getSchemaTsMetaType({ schema: compositeSchema, parentTypes, resolver });
      });
      if (metaTypes.every(({ metaType }) => metaType === "object")) {
        return {
          metaType: "object",
          objectProperties: (metaTypes as TsObjectMetaType[]).reduce((acc, { objectProperties }) => {
            const objectPropertyNames = new Set(objectProperties.map(({ name }) => name));
            return [...acc.filter(({ name }) => !objectPropertyNames.has(name)), ...objectProperties];
          }, [] as TsProperty[]),
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
    const arrayType = getArraySchemaTsType({
      arraySchema: schema as OpenAPIV3.ArraySchemaObject,
      resolver,
      parentTypes,
    });
    return { metaType: "array", arrayType };
  } else if ((schema.type === "object" || schema.properties) && isCircular) {
    return { metaType: "object", objectProperties: [], isCircular: true };
  } else if (schema.type === "object" || schema.properties) {
    const objectProperties = getSchemaTsProperties({ schema, parentTypes, resolver });
    return { metaType: "object", objectProperties };
  }

  return { metaType: "primitive" };
}

function getArraySchemaTsType({
  arraySchema,
  parentTypes,
  resolver,
}: {
  arraySchema: OpenAPIV3.ArraySchemaObject;
  parentTypes: TsTypeBase[];
  resolver: SchemaResolver;
}): TsType {
  let zodSchemaName: string | undefined;
  let schema: OpenAPIV3.SchemaObject | undefined;
  if (isReferenceObject(arraySchema.items)) {
    const ref = arraySchema.items.$ref;
    zodSchemaName = resolver.getZodSchemaNameByRef(ref);
    schema = resolver.getSchemaByRef(ref);
  } else {
    schema = arraySchema.items as OpenAPIV3.SchemaObject;
  }

  const tsType = getTsTypeBase({ zodSchemaName, schema, resolver });
  const isCircular = getIsCircular(tsType, parentTypes);
  const tsMetaType = getSchemaTsMetaType({
    schema,
    isCircular,
    parentTypes: [...parentTypes, tsType],
    resolver,
  });
  return { ...tsType, ...tsMetaType };
}

function getSchemaTsProperties({
  schema,
  parentTypes,
  resolver,
}: {
  schema?: OpenAPIV3.SchemaObject | undefined;
  parentTypes: TsTypeBase[];
  resolver: SchemaResolver;
}): TsProperty[] {
  return Object.entries(schema?.properties ?? {}).map(([name, property]) => {
    const isRequired = schema?.required?.includes(name) ?? false;

    if (isReferenceObject(property)) {
      const zodSchemaName = resolver.getZodSchemaNameByRef(property.$ref);
      const schema = resolver.getSchemaByRef(property.$ref);
      const tsType = getTsTypeBase({ zodSchemaName, schema, resolver });
      const isCircular = getIsCircular(tsType, parentTypes);
      const tsMetaType = getSchemaTsMetaType({
        schema,
        isCircular,
        parentTypes: [...parentTypes, tsType],
        resolver,
      });
      return { name, isRequired, ...tsType, ...tsMetaType };
    } else if (property.type === "array") {
      const arrayType = getArraySchemaTsType({
        arraySchema: property as OpenAPIV3.ArraySchemaObject,
        parentTypes,
        resolver,
      });
      return { name, isRequired, type: "array", metaType: "array", arrayType };
    } else if (isPrimitiveType(property.type)) {
      return { name, isRequired, type: primitiveTypeToTsType(property.type), metaType: "primitive" };
    }

    return { name, isRequired, type: "void", metaType: "primitive" };
  });
}

function getIsCircular(tsType: TsTypeBase, parentTypes: TsTypeBase[]) {
  return parentTypes.findIndex(({ type, namespace }) => type === tsType.type && namespace === tsType.namespace) > -1;
}
