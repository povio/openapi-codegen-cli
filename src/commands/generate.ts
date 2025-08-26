import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { resolveConfig } from "src/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "src/generators/types/options";
import { writeGenerateFileData } from "src/generators/utils/file.utils";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";
import { loadConfig } from "src/helpers/config.helper";

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
  >
>;

export async function generate({ prettier, verbose, config: configParam, ...params }: GenerateParams) {
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
    logInfo("Generating code...");
  }
  const filesData = generateCodeFromOpenAPIDoc(openApiDoc, config);

  if (verbose) {
    logInfo("Writing files...");
  }
  writeGenerateFileData(filesData);
  if (verbose) {
    logSuccess(`Time: ${Date.now() - start}ms`);
  }

  if (prettier) {
    execPrettier({ output: config.output, verbose });
  }
}

function execPrettier({ output, verbose }: Pick<GenerateParams, "output" | "verbose">) {
  if (verbose) {
    logInfo("Running Prettier...");
  }
  const ignorePathArg = process.env.NODE_ENV === "production" ? "" : "--ignore-path .prettierignore";
  exec(`prettier --write ${output} ${ignorePathArg}`, (error) => {
    if (verbose) {
      if (error) {
        logError(error, "Prettier error");
      } else {
        logSuccess("Prettier finished.");
      }
    }
  });
}
