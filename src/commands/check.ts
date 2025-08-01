import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";
import { checkOpenAPIDoc } from "src/generators/checkOpenAPIDoc";
import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";
import { GenerateOptions } from "src/generators/types/options";
import { deepMerge } from "src/generators/utils/object.utils";
import { logInfo, logSuccess } from "src/helpers/cli.helper";
import { loadConfig } from "src/helpers/config.helper";

export type CheckParams = {
  config?: string;
  excludeTags?: string;
  verbose?: boolean;
} & Partial<Pick<GenerateOptions, "input" | "splitByTags" | "defaultTag">>;

export async function check({ verbose, ...params }: CheckParams) {
  const start = Date.now();

  if (verbose) {
    logInfo("Resolving config...");
  }
  const fileConfig = await loadConfig(params.config);
  const config = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...params,
    excludeTags: params.excludeTags?.split(","),
  });

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
