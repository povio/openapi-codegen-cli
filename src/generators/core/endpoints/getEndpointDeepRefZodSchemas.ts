import { DEFAULT_HEADERS } from "src/generators/const/endpoints.const";
import { Endpoint } from "src/generators/types/endpoint";
import { isNamedZodSchema } from "src/generators/utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getSchemaRefsDependencyGraph } from "../openapi/getSchemaRefsDependencyGraph";

export function getEndpointDeepRefZodSchemas({ endpoint, resolver }: { endpoint: Endpoint; resolver: SchemaResolver }) {
  const referencedSchemas: string[] = [];

  const endpointSchemaObjects = [
    endpoint.responseObject?.content?.[endpoint.responseFormat ?? DEFAULT_HEADERS.Accept].schema,
    ...endpoint.parameters.map((param) => param.parameterObject?.schema),
    ...endpoint.parameters.map(
      (param) => param.bodyObject?.content[endpoint.requestFormat ?? DEFAULT_HEADERS["Content-Type"]].schema,
    ),
  ];
  endpointSchemaObjects.forEach((schemaObj) => {
    if (!schemaObj) {
      return;
    }
    const ref = schemaObj.toString();
    const schemas =
      getSchemaRefsDependencyGraph({
        schema: schemaObj,
        fromRef: ref,
        getSchemaByRef: resolver.getSchemaByRef.bind(resolver),
      }).refsDependencyGraph[ref] ?? [];
    referencedSchemas.push(...schemas);
  });

  const deepReferencedSchemas: string[] = [];
  referencedSchemas.forEach((ref) => {
    const deepRefs = resolver.dependencyGraph.deepDependencyGraph[ref];
    if (deepRefs) {
      deepReferencedSchemas.push(...deepRefs);
    }
  });

  const deepRefZodSchemas = [...referencedSchemas, ...deepReferencedSchemas]
    .filter(Boolean)
    .map((ref) => resolver.getZodSchemaNameByRef(ref));
  const zodSchemas = [endpoint.response, ...endpoint.parameters.map((param) => param.schema)].filter(
    (schema) => !!schema && isNamedZodSchema(schema),
  );

  return Array.from(new Set([...zodSchemas, ...deepRefZodSchemas]));
}
