import { OpenAPIV3 } from "openapi-types";
import { iterateSchema, OnSchemaCallbackData } from "./iterateSchema";

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
