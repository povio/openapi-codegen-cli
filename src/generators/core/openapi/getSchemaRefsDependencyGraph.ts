import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "src/generators/utils/openapi.utils";

export function getSchemaRefsDependencyGraph({
  schema,
  fromRef,
  getSchemaByRef,
  visitedRefs = {},
  refsDependencyGraph = {},
}: {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  fromRef: string;
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  visitedRefs?: Record<string, boolean>;
  refsDependencyGraph?: Record<string, Set<string>>;
}) {
  visit({ schema, fromRef, getSchemaByRef, visitedRefs, refsDependencyGraph });

  return { visitedRefs, refsDependencyGraph };
}

function visit({
  schema,
  fromRef,
  getSchemaByRef,
  visitedRefs,
  refsDependencyGraph,
}: {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  fromRef: string;
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  visitedRefs: Record<string, boolean>;
  refsDependencyGraph: Record<string, Set<string>>;
}) {
  if (!schema) {
    return;
  }

  const params = { fromRef, getSchemaByRef, visitedRefs, refsDependencyGraph };

  if (isReferenceObject(schema)) {
    if (!refsDependencyGraph[fromRef]) {
      refsDependencyGraph[fromRef] = new Set();
    }
    refsDependencyGraph[fromRef].add(schema.$ref);
    if (visitedRefs[schema.$ref]) {
      return;
    }
    visitedRefs[fromRef] = true;
    visit({ ...params, schema: getSchemaByRef(schema.$ref), fromRef: schema.$ref });
    return;
  }

  const props = ["allOf", "oneOf", "anyOf"] as const;
  for (const prop of props) {
    if (schema[prop]) {
      for (const item of schema[prop]!) {
        visit({ ...params, schema: item });
      }
    }
  }
  if (props.some((prop) => schema[prop])) {
    return;
  }

  if (schema.type === "array") {
    if (!schema.items) {
      return;
    }
    visit({ ...params, schema: schema.items });
    return;
  }

  if (schema.type === "object" || schema.properties || schema.additionalProperties) {
    if (schema.properties) {
      for (const property in schema.properties) {
        visit({ ...params, schema: schema.properties[property]! });
      }
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      visit({ ...params, schema: schema.additionalProperties });
    }
  }
}
