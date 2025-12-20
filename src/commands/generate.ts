import { exec } from "child_process";
import SwaggerParser from "@apidevtools/swagger-parser";
import type { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "../generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "../generators/generateCodeFromOpenAPIDoc";
import type { GenerateOptions } from "../generators/types/options";
import { writeGenerateFileData } from "../generators/utils/file.utils";
import { loadConfig } from "../helpers/config.helper";
import { Logger } from "../helpers/logger";
import path from "path";

export type GenerateParams = {
  config?: string;
  excludeTags?: string;
  prettier?: boolean;
  verbose?: boolean;
} & Partial<
  Pick<
    GenerateOptions,
    | "input"
    | "output"
    | "tsNamespaces"
    | "tsPath"
    | "splitByTags"
    | "defaultTag"
    | "removeOperationPrefixEndingWith"
    | "importPath"
    | "extractEnums"
    | "acl"
    | "checkAcl"
    | "standalone"
    | "baseUrl"
    | "replaceOptionalWithNullish"
    | "infiniteQueries"
    | "axiosRequestConfig"
    | "mutationEffects"
    | "parseRequestParams"
    | "builderConfigs"
  >
>;

export async function generate(
  { prettier, verbose, config: configParam, ...params }: GenerateParams,
  cwd: string,
  logger: Logger = new Logger(false),
) {
  const start = Date.now();

  if (verbose) {
    logger.info("Resolving config...");
  }
  const fileConfig = await loadConfig(configParam, cwd, logger);
  const config = resolveConfig({ fileConfig, params });

  if (verbose) {
    logger.info("Parsing OpenAPI spec...");
  }

  const openApiDoc = (await SwaggerParser.bundle(config.input)) as OpenAPIV3.Document;

  if (verbose) {
    logger.info("Generating code...");
  }
  const filesData = generateCodeFromOpenAPIDoc(openApiDoc, config);

  if (verbose) {
    logger.info("Writing files...");
  }
  writeGenerateFileData(filesData);
  if (verbose) {
    logger.info(`Time: ${Date.now() - start}ms`);
  }

  if (prettier) {
    execPrettier({ output: config.output, verbose }, logger);
  }
}

function execPrettier(
  { output, verbose }: Pick<GenerateParams, "output" | "verbose">,
  logger: Logger = new Logger(false),
) {
  if (verbose) {
    logger.info("Running Prettier...");
  }
  const ignorePathArg = process.env.NODE_ENV === "production" ? "" : "--ignore-path .prettierignore";
  exec(`prettier --write ${output} ${ignorePathArg}`, (error) => {
    if (verbose) {
      if (error) {
        logger.error("Prettier error", error);
      } else {
        logger.info("Prettier finished.");
      }
    }
  });
}
