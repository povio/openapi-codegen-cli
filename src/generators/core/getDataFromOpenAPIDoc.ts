import { OpenAPIV3 } from "openapi-types";
import { Profiler } from "../../helpers/profile.helper";
import { Endpoint } from "../types/endpoint";
import { GenerateData } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getEndpointTag } from "../utils/tag.utils";
import { getEndpointsFromOpenAPIDoc } from "./endpoints/getEndpointsFromOpenAPIDoc";
import { SchemaResolver } from "./SchemaResolver.class";
import { getZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";
import { sortZodSchemasByTopology } from "./zod/sortZodSchemasByTopology";

export function getDataFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions, profiler?: Profiler) {
  const p = profiler ?? new Profiler(false);
  const resolver = p.runSync("data.resolver.init", () => new SchemaResolver(openApiDoc, options, p));

  const endpoints = p.runSync("data.endpoints.extract", () => getEndpointsFromOpenAPIDoc(resolver, p));
  const zodSchemasFromDocSchemas = p.runSync("data.zod.extract", () => getZodSchemasFromOpenAPIDoc(resolver, p));

  let zodSchemas = {
    ...zodSchemasFromDocSchemas.zodSchemas,
    ...resolver.getZodSchemas(),
    ...zodSchemasFromDocSchemas.enumZodSchemas,
  };
  zodSchemas = p.runSync("data.zod.sortTopology", () => sortZodSchemasByTopology(resolver, zodSchemas));
  zodSchemas = { ...resolver.getExtractedEnumZodSchemas(), ...zodSchemas };

  return {
    resolver,
    data: p.runSync("data.splitByTags", () => splitDataByTags({ resolver, endpoints, zodSchemas, options })),
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
    data.set(options.defaultTag, { endpoints, zodSchemas });
    return data;
  }

  endpoints.forEach((endpoint) => {
    const tag = getEndpointTag(endpoint, options);
    getTagElement(tag, data).endpoints.push(endpoint);
  });

  Object.entries(zodSchemas).forEach(([zodSchemaName, zodSchemaCode]) => {
    const tag = options.modelsInCommon ? options.defaultTag : resolver.getTagByZodSchemaName(zodSchemaName);
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
