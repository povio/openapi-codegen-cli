import { OpenAPIV3 } from "openapi-types";

import { checkOpenAPIDoc } from "@/generators/checkOpenAPIDoc";
import { resolveConfig } from "@/generators/core/resolveConfig";
import { GenerateOptions } from "@/generators/types/options";
import { logInfo, logSuccess } from "@/helpers/cli.helper";
import { loadConfig } from "@/helpers/config.helper";
import SwaggerParser from "@apidevtools/swagger-parser";

export type CheckParams = {
  config?: string;
  excludeTags?: string;
  verbose?: boolean;
} & Partial<Pick<GenerateOptions, "input" | "splitByTags" | "defaultTag">>;

export async function check({ verbose, config: configParam, excludeTags: _excludeTagsParam, ...params }: CheckParams) {
  const start = Date.now();

  if (verbose) {
    logInfo("Resolving config...");
  }
  const fileConfig = await loadConfig(configParam);
  const config = resolveConfig({ fileConfig, params });

  if (verbose) {
    logInfo("Parsing OpenAPI spec...");
  }
  const openApiDoc = (await SwaggerParser.bundle(config.input)) as OpenAPIV3.Document;

  if (verbose) {
    logInfo("Running check...");
  }
  const errorMessages = checkOpenAPIDoc(openApiDoc, config);

  if (errorMessages.length === 0) {
    logSuccess(`Time: ${Date.now() - start}ms`);
  } else {
    throw new Error(`Found ${errorMessages.length} issues. Time: ${Date.now() - start}ms`);
  }
}
