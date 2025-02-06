import { OpenAPIV3 } from "openapi-types";
import { COMPOSITE_KEYWORDS } from "src/generators/const/openapi.const";
import { isReferenceObject } from "src/generators/utils/openapi.utils";

export type OnSchemaCallbackData<TData> = { data?: TData } & (
  | { type: "reference"; schema: OpenAPIV3.ReferenceObject }
  | {
      type: "property" | "additionalProperty";
      parentSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      propertyName: string;
    }
  | {
      type: "composite" | "array";
      parentSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
      schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    }
);

type OnSchemaCallbackType<TData> = (data: OnSchemaCallbackData<TData>) => any;

export function iterateSchema<TData>(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  options: {
    data?: TData;
    onSchema?: OnSchemaCallbackType<TData>;
  },
) {
  if (!schema) {
    return;
  }

  const { data, onSchema } = options;

  if (isReferenceObject(schema) && onSchema?.({ type: "reference", schema, data }) === true) {
    return;
  }

  const schemaObj = schema as OpenAPIV3.SchemaObject;
  if (COMPOSITE_KEYWORDS.some((prop) => prop in schemaObj && schemaObj[prop])) {
    const schemaObjs = schemaObj.allOf ?? schemaObj.anyOf ?? schemaObj.oneOf ?? [];
    for (const compositeObj of schemaObjs) {
      if (onSchema?.({ type: "composite", parentSchema: schema, schema: compositeObj, data }) === true) {
        return;
      }
      iterateSchema(compositeObj, options);
    }
  }

  if (schemaObj.properties) {
    for (const [name, propertyObj] of Object.entries(schemaObj.properties)) {
      if (
        onSchema?.({
          type: "property",
          parentSchema: schema,
          schema: propertyObj,
          data,
          propertyName: name,
        }) === true
      ) {
        return;
      }
      iterateSchema(propertyObj, options);
    }
  }

  if (schemaObj.additionalProperties) {
    for (const [name, additionalPropertyObj] of Object.entries(schemaObj.additionalProperties)) {
      if (
        !(additionalPropertyObj instanceof Object) ||
        onSchema?.({
          type: "additionalProperty",
          parentSchema: schema,
          schema: additionalPropertyObj,
          data,
          propertyName: name,
        }) === true
      ) {
        return;
      }
      iterateSchema(additionalPropertyObj, options);
    }
  }

  if (schemaObj.type === "array") {
    const arrayObj = (schema as OpenAPIV3.ArraySchemaObject).items;
    if (onSchema?.({ type: "array", parentSchema: schema, schema: arrayObj, data }) === true) {
      return;
    }
    iterateSchema(arrayObj, options);
  }
}
