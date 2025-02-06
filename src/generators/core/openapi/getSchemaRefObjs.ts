import { OpenAPIV3 } from "openapi-types";
import { autocorrectRef, isReferenceObject } from "src/generators/utils/openapi.utils";
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
        resolver.validationErrorMessages.push(`INVALID SCHEMA: ${schemaInfo} has both reference and composite keyword`);
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
