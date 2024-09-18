import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "./types/options";
import { getEndpointsFromOpenAPIDoc } from "./utils/endpoint/endpoints-extraction.utils";
import { OpenAPISchemaResolver } from "./utils/openapi/openapi-schema-resolver.class";
import {
  getZodSchemasFromOpenAPIDocSchemas,
  sortZodSchemasByTopology,
  wrapCircularZodSchemasWithLazy,
} from "./utils/zod/zod-schemas.utils";

export function generateCodeFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions = {}) {
  const { zodSchemas, endpoints, queries } = getEntitiesFromOpenAPIDoc(openApiDoc, options);

  console.log({ zodSchemas, endpoints });
  // TODO: implement code generation from zodSchemas, endpoints and queries

  return {
    zodSchemas: "",
    endpoints: "",
    queries: "",
  };
}

function getEntitiesFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions = {}) {
  const resolver = new OpenAPISchemaResolver(openApiDoc);

  const { zodSchemas: zodSchemasFromEndpoints, endpoints } = getEndpointsFromOpenAPIDoc({
    resolver,
    openApiDoc,
    options,
  });
  const zodSchemasFromDocSchemas = getZodSchemasFromOpenAPIDocSchemas({
    resolver,
    docSchemas: openApiDoc.components?.schemas ?? {},
    options,
  });

  let zodSchemas = { ...zodSchemasFromDocSchemas, ...zodSchemasFromEndpoints };
  zodSchemas = wrapCircularZodSchemasWithLazy({ resolver, zodSchemas });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas });

  return { zodSchemas, endpoints, queries: [] };
}
