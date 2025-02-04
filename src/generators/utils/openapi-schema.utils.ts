import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "./openapi.utils";

export function isSchemaObject(
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): schema is OpenAPIV3.SchemaObject {
  return !isReferenceObject(schema);
}

export function isArraySchemaObject(schema: OpenAPIV3.SchemaObject): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === "array";
}

export function inferRequiredSchema(schema: OpenAPIV3.SchemaObject) {
  if (!schema.allOf) {
    throw new Error("Function inferRequiredSchema is specialized to handle item with required only in an allOf array.");
  }
  const [standaloneRequisites, noRequiredOnlyAllof] = schema.allOf.reduce(
    (acc, cur) => {
      if (isBrokenAllOfItem(cur)) {
        const required = (cur as OpenAPIV3.SchemaObject).required;
        acc[0].push(...(required ?? []));
      } else {
        acc[1].push(cur);
      }
      return acc;
    },
    [[], []] as [string[], (OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject)[]],
  );

  const composedRequiredSchema = {
    properties: standaloneRequisites.reduce(
      (acc, cur) => {
        acc[cur] = {} as OpenAPIV3.SchemaObject;
        return acc;
      },
      {} as { [propertyName: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject },
    ),
    type: "object" as const,
    required: standaloneRequisites,
  };

  return {
    noRequiredOnlyAllof,
    composedRequiredSchema,
    patchRequiredSchemaInLoop: (
      prop: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
      getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject,
    ) => {
      if (isReferenceObject(prop)) {
        const refType = getSchemaByRef(prop.$ref);
        if (refType) {
          composedRequiredSchema.required.forEach((required) => {
            composedRequiredSchema.properties[required] = refType?.properties?.[required] ?? {};
          });
        }
      } else {
        const properties = prop["properties"] ?? {};
        composedRequiredSchema.required.forEach((required) => {
          if (properties[required]) {
            composedRequiredSchema.properties[required] = properties[required] ?? {};
          }
        });
      }
    },
  };
}

const isBrokenAllOfItem = (
  item: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): item is OpenAPIV3.SchemaObject => {
  return (
    !isReferenceObject(item) &&
    !!item.required &&
    !item.type &&
    !item.properties &&
    !item?.allOf &&
    !item?.anyOf &&
    !item.oneOf
  );
};
