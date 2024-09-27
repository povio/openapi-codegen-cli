import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "./const/generate.const";
import { SchemaResolver } from "./core/SchemaResolver.class";
import { getEndpointsFromOpenAPIDoc } from "./core/endpoints/getEndpointsFromOpenAPIDoc";
import { getZodSchemasFromOpenAPIDoc } from "./core/zod/getZodSchemasFromOpenAPIDoc";
import { sortZodSchemasByTopology } from "./core/zod/sortZodSchemasByTopology";
import { wrapCircularZodSchemas } from "./core/zod/wrapCircularZodSchemas";
import { generateEndpoints } from "./generate/generateEndpoints";
import { generateModels } from "./generate/generateModels";
import { generateQueries } from "./generate/generateQueries";
import { GenerateOptions } from "./types/options";
import { writeTsFileSync } from "./utils/file.utils";

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

  const zodSchemasCode = generateModels({ zodSchemas, options });
  const endpointsCode = generateEndpoints({ endpoints, options });
  const queriesCode = generateQueries({ endpoints, options });

  writeTsFileSync({ output, fileName: options.modelsConfig.outputFileNameSuffix, content: zodSchemasCode });
  writeTsFileSync({ output, fileName: options.endpointsConfig.outputFileNameSuffix, content: endpointsCode });
  writeTsFileSync({ output, fileName: options.queriesConfig.outputFileNameSuffix, content: queriesCode });
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
  zodSchemas = wrapCircularZodSchemas({ resolver, zodSchemas, options });
  zodSchemas = sortZodSchemasByTopology({ resolver, zodSchemas });

  return { zodSchemas, endpoints };
}
