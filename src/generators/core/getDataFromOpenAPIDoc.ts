import { OpenAPIV3 } from "openapi-types";
import { Endpoint } from "src/generators/types/endpoint";
import { GenerateData } from "src/generators/types/generate";
import { GenerateOptions } from "src/generators/types/options";
import { getEndpointTag } from "src/generators/utils/tag.utils";
import { getEndpointsFromOpenAPIDoc } from "./endpoints/getEndpointsFromOpenAPIDoc";
import { SchemaResolver } from "./SchemaResolver.class";
import { getZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";
import { sortZodSchemasByTopology } from "./zod/sortZodSchemasByTopology";

export function getDataFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const resolver = new SchemaResolver(openApiDoc, options);

  const endpoints = getEndpointsFromOpenAPIDoc(resolver);
  const zodSchemasFromDocSchemas = getZodSchemasFromOpenAPIDoc(resolver);

  let zodSchemas = {
    ...zodSchemasFromDocSchemas.zodSchemas,
    ...resolver.getZodSchemas(),
    ...zodSchemasFromDocSchemas.enumZodSchemas,
  };
  zodSchemas = sortZodSchemasByTopology(resolver, zodSchemas);
  zodSchemas = { ...resolver.getExtractedEnumZodSchemas(), ...zodSchemas };

  return { resolver, data: splitDataByTags({ resolver, endpoints, zodSchemas, options }) };
}

function splitDataByTags({
  resolver,
  endpoints,
  zodSchemas,
  options,
}: {
  resolver: SchemaResolver;
  endpoints: Endpoint[];
  zodSchemas: Record<string, string>;
  options: GenerateOptions;
}) {
  const data: GenerateData = new Map();

  if (!options.splitByTags) {
    data.set(options.defaultTag, { endpoints, zodSchemas });
    return data;
  }

  endpoints.forEach((endpoint) => {
    const tag = getEndpointTag(endpoint, options);
    getTagElement(tag, data).endpoints.push(endpoint);
  });

  Object.entries(zodSchemas).forEach(([zodSchemaName, zodSchemaCode]) => {
    const tag = resolver.getTagByZodSchemaName(zodSchemaName);
    if (tag) {
      getTagElement(tag, data).zodSchemas[zodSchemaName] = zodSchemaCode;
    }
  });

  return data;
}

function getTagElement(tag: string, data: GenerateData) {
  if (!data.has(tag)) {
    data.set(tag, { endpoints: [], zodSchemas: {} });
  }
  return data.get(tag)!;
}
