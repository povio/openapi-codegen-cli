import { OpenAPIV3 } from "openapi-types";
import { getSchemaRefsDependencyGraph } from "./getSchemaRefsDependencyGraph";

export function getOpenAPISchemaDependencyGraph(
  schemaRef: string[],
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
) {
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
