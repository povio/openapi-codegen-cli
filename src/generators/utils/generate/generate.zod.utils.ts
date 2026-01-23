import { OpenAPIV3 } from "openapi-types";
import { COMPOSITE_KEYWORDS } from "src/generators/const/openapi.const";
import { VOID_SCHEMA } from "src/generators/const/zod.const";
import { iterateSchema, OnSchemaCallbackData } from "src/generators/core/openapi/iterateSchema";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType, GenerateZodSchemaData } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getNamespaceName } from "src/generators/utils/namespace.utils";
import { isArraySchemaObject, isReferenceObject } from "src/generators/utils/openapi-schema.utils";
import { removeSuffix } from "src/generators/utils/string.utils";
import { isNamedZodSchema } from "src/generators/utils/zod-schema.utils";

import { getSchemaDescriptions } from "./generate.openapi.utils";

export const getZodSchemaInferedTypeName = (zodSchemaName: string, options: GenerateOptions) =>
  removeSuffix(zodSchemaName, options.schemaSuffix);

export const getImportedZodSchemaName = (resolver: SchemaResolver, zodSchemaName: string) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName;
  }

  const namespacePrefix = resolver.options.tsNamespaces
    ? `${getNamespaceName({ type: GenerateType.Models, tag: resolver.getTagByZodSchemaName(zodSchemaName), options: resolver.options })}.`
    : "";
  return `${namespacePrefix}${zodSchemaName}`;
};

export const getImportedZodSchemaInferedTypeName = (
  resolver: SchemaResolver,
  zodSchemaName: string,
  currentTag?: string,
) => {
  if (!isNamedZodSchema(zodSchemaName)) {
    return zodSchemaName === VOID_SCHEMA ? "void" : zodSchemaName;
  }

  const tag = resolver.getTagByZodSchemaName(zodSchemaName);
  const namespacePrefix =
    resolver.options.tsNamespaces && tag !== currentTag
      ? `${getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options })}.`
      : "";
  return `${namespacePrefix}${getZodSchemaInferedTypeName(zodSchemaName, resolver.options)}`;
};

export function getZodSchemaType(data: GenerateZodSchemaData) {
  return data.isEnum ? "enum" : (data.schemaObj?.type ?? "object");
}

export function getZodSchemaDescription(data: GenerateZodSchemaData) {
  if (!data.schemaObj) {
    return;
  }
  return [data.schemaObj.description, ...getSchemaDescriptions(data.schemaObj)].filter(Boolean).join(". ");
}

function getType(resolver: SchemaResolver, schemaObj: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, tag: string) {
  if (isReferenceObject(schemaObj)) {
    const zodSchemaName = resolver.getZodSchemaNameByRef(schemaObj.$ref);
    return zodSchemaName ? getImportedZodSchemaInferedTypeName(resolver, zodSchemaName, tag) : undefined;
  }
  if (isArraySchemaObject(schemaObj)) {
    if (!isReferenceObject(schemaObj.items)) {
      return `${schemaObj.items?.type ?? "unknown"}[]`;
    }
    const zodSchemaName = resolver.getZodSchemaNameByRef(schemaObj.items.$ref);
    return zodSchemaName ? `${getImportedZodSchemaInferedTypeName(resolver, zodSchemaName, tag)}[]` : undefined;
  }
  if (COMPOSITE_KEYWORDS.some((prop) => prop in schemaObj && schemaObj[prop])) {
    const schemaObjs = schemaObj.allOf ?? schemaObj.anyOf ?? schemaObj.oneOf ?? [];
    if (schemaObjs.length > 0) {
      return getType(resolver, schemaObjs[0], tag);
    }
  }
  return schemaObj.type;
}

export function getZodSchemaPropertyDescriptions(resolver: SchemaResolver, data: GenerateZodSchemaData, tag: string) {
  if (!data.schemaObj) {
    return [];
  }

  const ARRAY_INDEX = "[0]";
  const ADDITIONAL_PROPERTIES_KEY = "[key]";
  const properties: Record<string, { type: string; description: string }> = {};

  const onSchema = (schemaData: OnSchemaCallbackData<{ pathSegments: string[] }>) => {
    if (schemaData.type === "reference") {
      return true;
    }
    if (schemaData.type === "composite") {
      return;
    }

    const segments = [...(schemaData.data?.pathSegments ?? [])];
    if (schemaData.type === "array") {
      segments.push(ARRAY_INDEX);
    } else if (schemaData.type === "property") {
      segments.push(schemaData.propertyName);
    } else if (schemaData.type === "additionalProperties") {
      segments.push(ADDITIONAL_PROPERTIES_KEY);
    }

    if (schemaData.schema && segments[segments.length - 1] !== ARRAY_INDEX) {
      const resolvedSchema = resolver.resolveObject(schemaData.schema);
      const schemaDescriptions = [resolvedSchema.description, ...getSchemaDescriptions(resolvedSchema)].filter(Boolean);
      const propertyKey = segments.join(".");
      if (!(properties[propertyKey] && "type" in schemaData.schema && schemaData.schema.type === "object")) {
        delete properties[propertyKey];
        properties[propertyKey] = {
          type: getType(resolver, schemaData.schema, tag) ?? "unknown",
          description: schemaDescriptions.join(". "),
        };
      }
    }

    iterateSchema(schemaData.schema, { data: { pathSegments: [...segments] }, onSchema });
    return true;
  };

  if ("allOf" in data.schemaObj && data.schemaObj.allOf) {
    data.schemaObj.allOf.forEach((schemaObj) => {
      if (isReferenceObject(schemaObj)) {
        const resolvedSchemaObj = resolver.resolveObject(schemaObj);
        iterateSchema(resolvedSchemaObj, { data: { pathSegments: [] }, onSchema });
      }
    });
  }

  iterateSchema(data.schemaObj, { data: { pathSegments: [] }, onSchema });

  return properties;
}
