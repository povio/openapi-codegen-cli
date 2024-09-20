import { OpenAPIV3 } from "openapi-types";
import { printEndpointsToFile, printZodSchemasToFile } from "./print";
import { GenerateOptions } from "./types/options";
import { getEndpointsFromOpenAPIDoc } from "./utils/endpoint/endpoints-extraction.utils";
import { OpenAPISchemaResolver } from "./utils/openapi/openapi-schema-resolver.class";
import {
  getZodSchemasFromOpenAPIDocSchemas,
  sortZodSchemasByTopology,
  wrapCircularZodSchemasWithLazy,
} from "./utils/zod/zod-schemas.utils";

const DEFAULT_GENERATE_OPTIONS = { schemaSuffix: "Schema" };

export async function generateCodeFromOpenAPIDoc({
  openApiDoc,
  output,
  options = DEFAULT_GENERATE_OPTIONS,
}: {
  openApiDoc: OpenAPIV3.Document;
  output: string;
  options?: GenerateOptions;
}) {
  const generateOptions = { ...DEFAULT_GENERATE_OPTIONS, ...options };
  const { zodSchemas, endpoints } = getEntitiesFromOpenAPIDoc({ openApiDoc, options: generateOptions });

  await printZodSchemasToFile({ zodSchemas, output, options: generateOptions });
  await printEndpointsToFile({ endpoints, output, options: generateOptions });
}

function getEntitiesFromOpenAPIDoc({
  openApiDoc,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  options: GenerateOptions;
}) {
  const resolver = new OpenAPISchemaResolver(openApiDoc, options.schemaSuffix);

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
  zodSchemas = wrapCircularZodSchemasWithLazy({ resolver, zodSchemas, options });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas });

  return { zodSchemas, endpoints };
}
