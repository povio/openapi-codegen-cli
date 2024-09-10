import { OpenAPIV3 } from "openapi-types";
import { EndpointsOptions, ZodSchemasOptions } from "./types/options";
import { getEndpointsFromOpenAPIDoc } from "./utils/endpoint/endpoints-extraction.utils";
import { getOpenAPISchemaResolver } from "./utils/openapi/openapi-schema-resolver.utils";
import {
  getZodSchemasFromOpenAPIDocSchemas,
  sortZodSchemasByTopology,
  wrapCircularZodSchemasWithLazy,
} from "./utils/zod/zod-schemas.utils";

export function generateCodeFromOpenAPIDoc(
  openApiDoc: OpenAPIV3.Document,
  options: ZodSchemasOptions & EndpointsOptions = {},
) {
  const { zodSchemas, endpoints, queries } = getEntitiesFromOpenAPIDoc(openApiDoc, options);

  console.log({ zodSchemas, endpoints, queries });
  // TODO: implement code generation from zodSchemas, endpoints and queries

  return {
    zodSchemas: "",
    endpoints: "",
    queries: "",
  };
}

function getEntitiesFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: ZodSchemasOptions & EndpointsOptions = {}) {
  const docSchemas = openApiDoc.components?.schemas ?? {};

  const resolver = getOpenAPISchemaResolver(openApiDoc);

  const {
    zodSchemas: zodSchemasFromDocPaths,
    dependencyGraph,
    endpoints,
  } = getEndpointsFromOpenAPIDoc({ resolver, openApiDoc, options });
  const zodSchemasFromDocSchemas = getZodSchemasFromOpenAPIDocSchemas({ resolver, docSchemas, options });

  let zodSchemas = { ...zodSchemasFromDocSchemas, ...zodSchemasFromDocPaths };
  zodSchemas = wrapCircularZodSchemasWithLazy({ resolver, zodSchemas, dependencyGraph });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas, dependencyGraph });

  return { zodSchemas, endpoints, queries: [] };
}
