import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "./openapi.utils";

export const getOpenAPISchemaDependencyGraph = (
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) => {
  const visitedsRefs = {} as Record<string, boolean>;
  const refsDependencyGraph = {} as Record<string, Set<string>>;

  const visit = (schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, fromRef: string): void => {
    if (!schema) return;

    if (isReferenceObject(schema)) {
      if (!refsDependencyGraph[fromRef]) {
        refsDependencyGraph[fromRef] = new Set();
      }

      refsDependencyGraph[fromRef]!.add(schema.$ref);

      if (visitedsRefs[schema.$ref]) return;

      visitedsRefs[fromRef] = true;
      visit(getSchemaByRef(schema.$ref), schema.$ref);
      return;
    }

    if (schema.allOf) {
      for (const allOf of schema.allOf) {
        visit(allOf, fromRef);
      }

      return;
    }

    if (schema.oneOf) {
      for (const oneOf of schema.oneOf) {
        visit(oneOf, fromRef);
      }

      return;
    }

    if (schema.anyOf) {
      for (const anyOf of schema.anyOf) {
        visit(anyOf, fromRef);
      }

      return;
    }

    if (schema.type === "array") {
      if (!schema.items) return;
      return void visit(schema.items, fromRef);
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

  const deepDependencyGraph = {} as Record<string, Set<string>>;
  const visitedsDeepRefs = {} as Record<string, boolean>;
  schemaRef.forEach((ref) => {
    const deps = refsDependencyGraph[ref];

    if (!deps) return;
    if (!deepDependencyGraph[ref]) {
      deepDependencyGraph[ref] = new Set();
    }

    const visit = (dep: string) => {
      deepDependencyGraph[ref]!.add(dep);
      if (refsDependencyGraph[dep] && ref !== dep) {
        refsDependencyGraph[dep]!.forEach((transitive) => {
          if (visitedsDeepRefs[ref + "__" + transitive]) return;
          visitedsDeepRefs[ref + "__" + transitive] = true;
          visit(transitive);
        });
      }
    };

    deps.forEach((dep) => visit(dep));
  });

  return { refsDependencyGraph, deepDependencyGraph };
};
