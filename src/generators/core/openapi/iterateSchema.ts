import { OpenAPIV3 } from "openapi-types";

import { COMPOSITE_KEYWORDS } from "@/generators/const/openapi.const";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";

export type OnSchemaCallbackData<TData> = { data?: TData } & (
  | { type: "reference"; schema: OpenAPIV3.ReferenceObject }
  | {
      type: "property";
      parentSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      propertyName: string;
    }
  | {
      type: "composite" | "array" | "additionalProperties";
      parentSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    }
);

type OnSchemaCallbackType<TData> = (data: OnSchemaCallbackData<TData>) => unknown;

export function iterateSchema<TData>(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  options: { data?: TData; onSchema: OnSchemaCallbackType<TData> },
) {
  if (!schema) {
    return;
  }

  const { data, onSchema } = options;

  if (isReferenceObject(schema) && onSchema({ type: "reference", schema, data }) === true) {
    return;
  }

  const schemaObj = schema as OpenAPIV3.SchemaObject;
  if (COMPOSITE_KEYWORDS.some((prop) => prop in schemaObj && schemaObj[prop])) {
    const schemaObjs = schemaObj.allOf ?? schemaObj.anyOf ?? schemaObj.oneOf ?? [];
    for (const compositeObj of schemaObjs) {
      if (onSchema?.({ type: "composite", parentSchema: schema, schema: compositeObj, data }) === true) {
        continue;
      }
      iterateSchema(compositeObj, { data, onSchema });
    }
  }

  if (schemaObj.properties) {
    for (const [propertyName, propertyObj] of Object.entries(schemaObj.properties)) {
      if (onSchema({ type: "property", parentSchema: schema, schema: propertyObj, data, propertyName }) === true) {
        continue;
      }
      iterateSchema(propertyObj, options);
    }
  }

  if (schemaObj.additionalProperties && typeof schemaObj.additionalProperties === "object") {
    if (
      onSchema({
        type: "additionalProperties",
        parentSchema: schema,
        schema: schemaObj.additionalProperties as OpenAPIV3.SchemaObject,
        data,
      }) === true
    ) {
      return;
    }
    iterateSchema(schemaObj.additionalProperties as OpenAPIV3.SchemaObject, options);
  }

  if (schemaObj.type === "array") {
    const arrayObj = (schema as OpenAPIV3.ArraySchemaObject).items;
    if (onSchema({ type: "array", parentSchema: schema, schema: arrayObj, data }) === true) {
      return;
    }
    iterateSchema(arrayObj, options);
  }
}
