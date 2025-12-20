import type { OpenAPIV3 } from "openapi-types";

import { autocorrectRef } from "../../utils/openapi.utils";
import { isReferenceObject } from "../../utils/openapi-schema.utils";
import { getInvalidSchemaError } from "../../utils/validation.utils";
import type { SchemaResolver } from "../SchemaResolver.class";
import type { OnSchemaCallbackData } from "./iterateSchema";
import { iterateSchema } from "./iterateSchema";

export function getSchemaRefObjs(
  resolver: SchemaResolver,
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined,
  schemaInfo: string,
): OpenAPIV3.ReferenceObject[] {
  const schemaRefObjs: OpenAPIV3.ReferenceObject[] = [];

  const onSchema = (data: OnSchemaCallbackData<never>) => {
    if (data.type === "reference") {
      schemaRefObjs.push(data.schema);
    } else if (isReferenceObject(data.parentSchema)) {
      if (data.type === "property") {
        resolver.validationErrors.push(getInvalidSchemaError(`${schemaInfo} has both reference and properties`));
      } else if (data.type === "additionalProperties") {
        resolver.validationErrors.push(
          getInvalidSchemaError(`${schemaInfo} has both reference and additionalProperties`),
        );
      } else if (data.type === "array") {
        resolver.validationErrors.push(getInvalidSchemaError(`${schemaInfo} is both reference and array schema`));
      } else if (data.type === "composite") {
        resolver.validationErrors.push(getInvalidSchemaError(`${schemaInfo} has both reference and composite keyword`));
      }
    }
  };

  iterateSchema(schema, { onSchema });

  return schemaRefObjs;
}

export function getDeepSchemaRefObjs(resolver: SchemaResolver, schemaRefs: OpenAPIV3.ReferenceObject[]) {
  const allRefs = schemaRefs.map((schemaRef) => autocorrectRef(schemaRef.$ref));
  const deepRefs = allRefs.reduce((acc, schemaRef) => {
    const refs = resolver.dependencyGraph.deepDependencyGraph[schemaRef];
    return [...acc, schemaRef, ...Array.from(refs ?? [])];
  }, [] as string[]);
  return deepRefs;
}
