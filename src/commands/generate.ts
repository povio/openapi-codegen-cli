import { exec } from "child_process";

import { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "@/generators/types/options";
import { writeGenerateFileData } from "@/generators/utils/file.utils";
import { logError, logInfo, logSuccess } from "@/helpers/cli.helper";
import { loadConfig } from "@/helpers/config.helper";
import SwaggerParser from "@apidevtools/swagger-parser";

export type GenerateParams = {
  config?: string;
  excludeTags?: string;
  format?: boolean;
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
    | "baseUrl"
    | "replaceOptionalWithNullish"
    | "infiniteQueries"
    | "axiosRequestConfig"
    | "mutationEffects"
    | "parseRequestParams"
    | "builderConfigs"
  >
>;

export async function generate({ format, verbose, config: configParam, ...params }: GenerateParams) {
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

  if (format) {
    execOxfmt({ output: config.output, verbose });
  }
}

function execOxfmt({ output, verbose }: Pick<GenerateParams, "output" | "verbose">) {
  if (verbose) {
    logInfo("Running Oxfmt...");
  }

  exec(`oxfmt ${output}`, (error) => {
    if (verbose) {
      if (error) {
        logError(error, "Oxfmt error");
      } else {
        logSuccess("Oxfmt finished.");
      }
    }
  });
}
