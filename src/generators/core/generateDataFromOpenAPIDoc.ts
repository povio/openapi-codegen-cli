import { OpenAPIV3 } from "openapi-types";
import { Endpoint } from "../types/endpoint";
import { GenerateData } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getEndpointDeepRefZodSchemas } from "./endpoints/getEndpointDeepRefZodSchemas";
import { getEndpointsFromOpenAPIDoc } from "./endpoints/getEndpointsFromOpenAPIDoc";
import { SchemaResolver } from "./SchemaResolver.class";
import { getZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";
import { sortZodSchemasByTopology } from "./zod/sortZodSchemasByTopology";
import { wrapCircularZodSchemas } from "./zod/wrapCircularZodSchemas";

export function generateDataFromOpenAPIDoc({
  openApiDoc,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  options: GenerateOptions;
}) {
  const resolver = new SchemaResolver(openApiDoc, options.schemaSuffix);

  const { endpoints, ctx } = getEndpointsFromOpenAPIDoc({ resolver, openApiDoc, options });
  const zodSchemasFromDocSchemas = getZodSchemasFromOpenAPIDoc({ resolver, openApiDoc, options });

  let zodSchemas = { ...zodSchemasFromDocSchemas, ...ctx.getState().zodSchemas };
  zodSchemas = wrapCircularZodSchemas({ resolver, zodSchemas, options });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas });

  return {
    resolver,
    data: splitDataByTags({ resolver, endpoints, zodSchemas, options }),
  };
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
    data.set("", { endpoints, zodSchemas });
    return data;
  }

  const zodSchemaTags = new Map<string, Set<string>>();
  Object.keys(zodSchemas).forEach((zodSchemaName) => zodSchemaTags.set(zodSchemaName, new Set()));
  endpoints.forEach((endpoint) => {
    const tag = endpoint.tags?.[0] ?? options.defaultTag;

    getTagElement(tag, data).endpoints.push(endpoint);

    const deepRefZodSchemas = getEndpointDeepRefZodSchemas({ endpoint, resolver });
    deepRefZodSchemas.forEach((zodSchema) => zodSchemaTags.get(zodSchema)!.add(tag));
  });

  zodSchemaTags.forEach((tags, zodSchemaName) => {
    const tag = tags.size === 1 ? tags.values().next().value : options.defaultTag;

    getTagElement(tag, data).zodSchemas[zodSchemaName] = zodSchemas[zodSchemaName];
  });

  return data;
}

function getTagElement(tag: string, data: GenerateData) {
  if (!data.has(tag)) {
    data.set(tag, { endpoints: [], zodSchemas: {} });
  }
  return data.get(tag)!;
}
