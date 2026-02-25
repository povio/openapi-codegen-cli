import SwaggerParser from "@apidevtools/swagger-parser";
import { exec } from "child_process";
import { OpenAPIV3 } from "openapi-types";
import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "@/generators/types/options";
import { writeGenerateFileData } from "@/generators/utils/file.utils";
import { logError, logInfo, logSuccess } from "@/helpers/cli.helper";
import { loadConfig } from "@/helpers/config.helper";
import { Profiler } from "@/helpers/profile.helper";

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

export async function generate({ prettier, verbose, config: configParam, ...params }: GenerateParams) {
  const start = Date.now();
  const profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1");

  if (verbose) {
    logInfo("Resolving config...");
  }
  const fileConfig = await profiler.runAsync("config.load", async () => await loadConfig(configParam));
  const config = profiler.runSync("config.resolve", () => resolveConfig({ fileConfig, params }));

  if (verbose) {
    logInfo("Parsing OpenAPI spec...");
  }
  const openApiDoc = await getOpenApiDoc(config.input, profiler);

  if (verbose) {
    logInfo("Generating code...");
  }
  const filesData = profiler.runSync("generate.total", () => generateCodeFromOpenAPIDoc(openApiDoc, config, profiler));

  if (verbose) {
    logInfo("Writing files...");
  }
  profiler.runSync("files.write", () => writeGenerateFileData(filesData));
  if (verbose) {
    logSuccess(`Time: ${Date.now() - start}ms`);
    if (profiler.enabled) {
      logInfo("Profile breakdown:");
      profiler.formatLines().forEach((line) => logInfo(`  ${line}`));
    }
  }

  if (prettier) {
    execPrettier({ output: config.output, verbose });
  }
}

async function getOpenApiDoc(input: string, profiler: Profiler): Promise<OpenAPIV3.Document> {
  const parsedDoc = (await profiler.runAsync(
    "openapi.parse",
    async () => await SwaggerParser.parse(input),
  )) as OpenAPIV3.Document;
  const hasExternalRefs = profiler.runSync("openapi.detectExternalRefs", () => hasExternalRef(parsedDoc));
  if (!hasExternalRefs) {
    return parsedDoc;
  }

  return (await profiler.runAsync(
    "openapi.bundle",
    async () => await SwaggerParser.bundle(input),
  )) as OpenAPIV3.Document;
}

function hasExternalRef(value: unknown): boolean {
  const stack = [value];
  const visited = new Set<object>();

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    if (
      "$ref" in current &&
      typeof (current as { $ref?: unknown }).$ref === "string" &&
      !(current as { $ref: string }).$ref.startsWith("#/")
    ) {
      return true;
    }

    for (const nested of Object.values(current)) {
      if (nested && typeof nested === "object") {
        stack.push(nested);
      }
    }
  }

  return false;
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
