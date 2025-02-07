import { OpenAPIV3 } from "openapi-types";
import { iterateSchema, OnSchemaCallbackData } from "./iterateSchema";

export interface DependencyGraph {
  refsDependencyGraph: Record<string, Set<string>>;
  deepDependencyGraph: Record<string, Set<string>>;
}

export function getOpenAPISchemaDependencyGraph(
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): DependencyGraph {
  const refsDependencyGraph = getRefsDependencyGraph(schemaRef, getSchemaByRef);
  const deepDependencyGraph = getDeepRefsDependencyGraph(schemaRef, refsDependencyGraph);

  return { refsDependencyGraph, deepDependencyGraph };
}

function getRefsDependencyGraph(
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) {
  const visitedRefs = {} as Record<string, boolean>;
  const refsDependencyGraph = {} as Record<string, Set<string>>;

  schemaRef.forEach((ref) =>
    getSchemaRefsDependencyGraph({
      schema: getSchemaByRef(ref),
      fromRef: ref,
      getSchemaByRef,
      visitedRefs,
      refsDependencyGraph,
    }),
  );

  return refsDependencyGraph;
}

function getDeepRefsDependencyGraph(schemaRef: string[], refsDependencyGraph: Record<string, Set<string>>) {
  const visitedDeepRefs = {} as Record<string, boolean>;
  const deepDependencyGraph = {} as Record<string, Set<string>>;

  const visit = (dep: string, ref: string) => {
    deepDependencyGraph[ref].add(dep);
    if (refsDependencyGraph[dep] && ref !== dep) {
      refsDependencyGraph[dep].forEach((transitive) => {
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

function getSchemaRefsDependencyGraph({
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
  const onSchema = (callbackData: OnSchemaCallbackData<{ fromRef: string }>) => {
    if (callbackData.type !== "reference" || !callbackData.data) {
      return;
    }
    const { schema, data } = callbackData;
    if (!refsDependencyGraph[data.fromRef]) {
      refsDependencyGraph[data.fromRef] = new Set();
    }
    refsDependencyGraph[data.fromRef].add(schema.$ref);
    if (visitedRefs[schema.$ref]) {
      return true;
    }
    visitedRefs[data.fromRef] = true;
    iterateSchema(getSchemaByRef(schema.$ref), { data: { fromRef: schema.$ref }, onSchema });
  };

  iterateSchema(schema, { data: { fromRef }, onSchema });

  return { visitedRefs, refsDependencyGraph };
}
