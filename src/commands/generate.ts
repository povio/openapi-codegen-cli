import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { TEMPLATE_IMPORTS } from "src/generators/const/deps.const";
import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "src/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "src/generators/types/options";
import { writeGenerateFileData } from "src/generators/utils/file.utils";
import { deepMerge } from "src/generators/utils/object.utils";
import { logError, logInfo, logSuccess } from "src/helpers/cli.helper";
import { loadConfig } from "src/helpers/config.helper";

export type GenerateParams = {
  config?: string;
  excludeTags?: string;
  monorepo?: boolean;
  prettier?: boolean;
  verbose?: boolean;
} & Partial<
  Pick<
    GenerateOptions,
    | "input"
    | "output"
    | "tsNamespaces"
    | "splitByTags"
    | "defaultTag"
    | "removeOperationPrefixEndingWith"
    | "importPath"
    | "extractEnums"
    | "acl"
    | "checkAcl"
    | "standalone"
    | "baseUrl"
    | "branded"
    | "replaceOptionalWithNullish"
    | "infiniteQueries"
    | "axiosRequestConfig"
    | "mutationEffects"
    | "parseRequestParams"
  >
>;

export async function generate({ monorepo, prettier, verbose, ...params }: GenerateParams) {
  const start = Date.now();

  if (verbose) {
    logInfo("Resolving config...");
  }
  const fileConfig = await loadConfig(params.config);
  const template = monorepo ? "monorepoTemplate" : "template";
  const config = deepMerge(DEFAULT_GENERATE_OPTIONS, fileConfig ?? {}, {
    ...params,
    excludeTags: params.excludeTags?.split(","),
    restClientImportPath: TEMPLATE_IMPORTS.appRestClient[template],
    errorHandlingImportPath: TEMPLATE_IMPORTS.errorHandling[template],
    queryTypesImportPath: TEMPLATE_IMPORTS.queryTypes[template],
    abilityContextImportPath: TEMPLATE_IMPORTS.abilityContext[template],
    abilityContextGenericAppAbilities: monorepo,
  });

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
    execPrettier({ output: params.output, verbose });
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
