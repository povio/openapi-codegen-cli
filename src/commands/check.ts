import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIV3 } from "openapi-types";
import path from "node:path";

import { checkOpenAPIDoc } from "../generators/checkOpenAPIDoc";
import { resolveConfig } from "../generators/core/resolveConfig";
import type { GenerateOptions } from "../generators/types/options";
import { loadConfig } from "../helpers/config.helper";
import { Logger } from "../helpers/logger";

export type CheckParams = {
  config?: string;
  excludeTags?: string;
  verbose?: boolean;
} & Partial<Pick<GenerateOptions, "input" | "splitByTags" | "defaultTag">>;

export async function check(
  { verbose, config: configParam, excludeTags: excludeTagsParam, ...params }: CheckParams,
  cwd: string,
  logger: Logger = new Logger(false),
) {
  const start = Date.now();

  if (verbose) {
    logger.info("Resolving config...");
  }
  const fileConfig = await loadConfig(configParam, cwd);
  const config = resolveConfig({ fileConfig, params });

  if (verbose) {
    logger.info("Parsing OpenAPI spec...");
  }

  const openApiDoc = (await SwaggerParser.bundle(config.input)) as OpenAPIV3.Document;

  if (verbose) {
    logger.info("Running check...");
  }
  const errorMessages = checkOpenAPIDoc(openApiDoc, config);

  if (errorMessages.length === 0) {
    logger.info(`Time: ${Date.now() - start}ms`);
  } else {
    throw new Error(`Found ${errorMessages.length} issues. Time: ${Date.now() - start}ms`);
  }
}
