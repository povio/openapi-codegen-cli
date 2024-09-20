import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "../utils/openapi.utils";

export const getOpenAPISchemaDependencyGraph = (
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) => {
  const refsDependencyGraph = getRefsDependencyGraph(schemaRef, getSchemaByRef);
  const deepDependencyGraph = getDeepDependencyGraph(schemaRef, refsDependencyGraph);

  return { refsDependencyGraph, deepDependencyGraph };
};

function getRefsDependencyGraph(
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) {
  const visitedsRefs = {} as Record<string, boolean>;
  const refsDependencyGraph = {} as Record<string, Set<string>>;

  const visit = (schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, fromRef: string): void => {
    if (!schema) {
      return;
    }

    if (isReferenceObject(schema)) {
      if (!refsDependencyGraph[fromRef]) {
        refsDependencyGraph[fromRef] = new Set();
      }
      refsDependencyGraph[fromRef].add(schema.$ref);
      if (visitedsRefs[schema.$ref]) {
        return;
      }
      visitedsRefs[fromRef] = true;
      visit(getSchemaByRef(schema.$ref), schema.$ref);
      return;
    }

    const props = ["allOf", "oneOf", "anyOf"] as const;
    for (const prop of props) {
      if (schema[prop]) {
        for (const item of schema[prop]!) {
          visit(item, fromRef);
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
      visit(schema.items, fromRef);
      return;
    }

    if (schema.type === "object" || schema.properties || schema.additionalProperties) {
      if (schema.properties) {
        for (const property in schema.properties) {
          visit(schema.properties[property]!, fromRef);
        }
      }
      if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        visit(schema.additionalProperties, fromRef);
      }
    }
  };

  schemaRef.forEach((ref) => visit(getSchemaByRef(ref), ref));

  return refsDependencyGraph;
}

function getDeepDependencyGraph(schemaRef: string[], refsDependencyGraph: Record<string, Set<string>>) {
  const visitedDeepRefs = {} as Record<string, boolean>;
  const deepDependencyGraph = {} as Record<string, Set<string>>;

  const visit = (dep: string, ref: string) => {
    deepDependencyGraph[ref]!.add(dep);
    if (refsDependencyGraph[dep] && ref !== dep) {
      refsDependencyGraph[dep]!.forEach((transitive) => {
        const refName = `${ref}__${transitive}`;
        if (visitedDeepRefs[refName]) {
          return;
        }
        visitedDeepRefs[refName] = true;
        visit(transitive, ref);
      });
    }
  };

  schemaRef.forEach((ref) => {
    const deps = refsDependencyGraph[ref];
    if (!deps) {
      return;
    }
    if (!deepDependencyGraph[ref]) {
      deepDependencyGraph[ref] = new Set();
    }
    deps.forEach((dep) => visit(dep, ref));
  });

  return deepDependencyGraph;
}
