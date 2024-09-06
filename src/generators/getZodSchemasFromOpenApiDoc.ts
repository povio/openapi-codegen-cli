import { OpenAPIV3 } from "openapi-types";
import { getOpenAPISchemaDependencyGraph } from "./utils/openapi/openapi-schema-dependency-graph.utils";
import { getOpenAPISchemaResolver, OpenAPISchemaResolver } from "./utils/openapi/openapi-schema-resolver.utils";
import { asComponentSchema, normalizeString } from "./utils/openapi/openapi.utils";
import { getZodSchema, ZodSchemasOptions } from "./utils/zod/zod-schema.utils";

export function getZodSchemasFromOpenApiDoc(openApiDoc: OpenAPIV3.Document, options: ZodSchemasOptions = {}) {
  const docSchemas = openApiDoc.components?.schemas ?? {};
  const resolver = getOpenAPISchemaResolver(openApiDoc);
  const zodSchemas = getZodSchemasFromDocSchemas({ resolver, docSchemas, options });
  const wrapperZodSchemas = wrapCircularZodSchemasWithLazy({ resolver, docSchemas, zodSchemas });
  return wrapperZodSchemas;
}

const getZodSchemasFromDocSchemas = ({
  resolver,
  docSchemas,
  options,
}: {
  resolver: OpenAPISchemaResolver;
  docSchemas: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
  options: ZodSchemasOptions;
}) => {
  const zodSchemas = {} as Record<string, string>;

  Object.entries(docSchemas).forEach(([name, schema]) => {
    if (!zodSchemas[name]) {
      zodSchemas[name] = getZodSchema({
        schema,
        ctx: { resolver, zodSchemaByName: {}, schemaByName: {} },
        options,
      }).toString();
    }
  });

  return zodSchemas;
};

const wrapCircularZodSchemasWithLazy = ({
  resolver,
  docSchemas,
  zodSchemas,
}: {
  resolver: OpenAPISchemaResolver;
  docSchemas: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
  zodSchemas: Record<string, string>;
}) => {
  const schemas = {} as Record<string, string>;

  const depsGraphs = getOpenAPISchemaDependencyGraph(
    Object.keys(docSchemas).map((name) => asComponentSchema(name)),
    resolver.getSchemaByRef,
  );

  Object.entries(zodSchemas).forEach(([name, code]) => {
    const ref = resolver.resolveSchemaName(name)?.ref;
    const isCircular = ref && depsGraphs.deepDependencyGraph[ref]?.has(ref);
    schemas[normalizeString(name)] = isCircular ? `z.lazy(() => ${code})` : code;
  });

  return schemas;
};
