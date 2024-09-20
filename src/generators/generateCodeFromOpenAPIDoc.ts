import { OpenAPIV3 } from "openapi-types";
import { SchemaResolver } from "./SchemaResolver.class";
import { getEndpointsFromOpenAPIDoc } from "./endpoints/getEndpointsFromOpenAPIDoc";
import { printEndpointsToFile } from "./endpoints/printEndpointsToFile";
import { GenerateOptions } from "./types/options";
import { sortZodSchemasByTopology, wrapCircularZodSchemasWithLazy } from "./utils/zod-schemas.utils";
import { getZodSchemasFromOpenAPIDoc } from "./zod/getZodSchemasFromOpenAPIDoc";
import { printZodSchemasToFile } from "./zod/printZodSchemasToFile";

const DEFAULT_GENERATE_OPTIONS = { schemaSuffix: "Schema" };

export function generateCodeFromOpenAPIDoc({
  openApiDoc,
  output,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  output: string;
  options?: GenerateOptions;
}) {
  options = { ...DEFAULT_GENERATE_OPTIONS, ...options };
  const { zodSchemas, endpoints } = getEntitiesFromOpenAPIDoc({ openApiDoc, options });

  printZodSchemasToFile({ zodSchemas, output, options });
  printEndpointsToFile({ endpoints, output, options });
}

function getEntitiesFromOpenAPIDoc({
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
  zodSchemas = wrapCircularZodSchemasWithLazy({ resolver, zodSchemas, options });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas });

  return { zodSchemas, endpoints };
}
