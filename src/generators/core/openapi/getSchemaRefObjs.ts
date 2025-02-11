import { OpenAPIV3 } from "openapi-types";
import { autocorrectRef, isReferenceObject } from "src/generators/utils/openapi.utils";
import { getInvalidSchemaError } from "src/generators/utils/validation.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { iterateSchema } from "./iterateSchema";

export function getSchemaRefObjs(
  resolver: SchemaResolver,
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined,
  schemaInfo: string,
): OpenAPIV3.ReferenceObject[] {
  const schemaRefObjs: OpenAPIV3.ReferenceObject[] = [];

  iterateSchema(schema, {
    onSchema: (data) => {
      if (data.type === "reference") {
        schemaRefObjs.push(data.schema);
      } else if (isReferenceObject(data.parentSchema)) {
        if (data.type === "property" || data.type === "additionalProperty") {
          resolver.validationErrors.push(getInvalidSchemaError(`${schemaInfo} has both reference and properties`));
        } else if (data.type === "array") {
          resolver.validationErrors.push(getInvalidSchemaError(`${schemaInfo} is both reference and array schema`));
        } else if (data.type === "composite") {
          resolver.validationErrors.push(
            getInvalidSchemaError(`${schemaInfo} has both reference and composite keyword`),
          );
        }
      }
    },
  });

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
