import { exec } from "child_process";
import { runGenerate } from "@/generators/run/generate.runner";
import { GenerateOptions } from "@/generators/types/options";
import { logError, logInfo, logSuccess } from "@/helpers/cli.helper";
import { loadConfig } from "@/helpers/config.helper";
import { Profiler } from "@/helpers/profile.helper";

export type GenerateParams = {
  config?: string;
  excludeTags?: string;
  inlineEndpointsExcludeModules?: string;
  prettier?: boolean;
  verbose?: boolean;
} & Partial<
  Pick<
    GenerateOptions,
    | "input"
    | "output"
    | "incremental"
    | "tsNamespaces"
    | "tsPath"
    | "splitByTags"
    | "defaultTag"
    | "removeOperationPrefixEndingWith"
    | "importPath"
    | "extractEnums"
    | "modelsInCommon"
    | "acl"
    | "checkAcl"
    | "standalone"
    | "baseUrl"
    | "replaceOptionalWithNullish"
    | "infiniteQueries"
    | "axiosRequestConfig"
    | "mutationEffects"
    | "workspaceContext"
    | "parseRequestParams"
    | "inlineEndpoints"
    | "builderConfigs"
    | "modelsOnly"
  >
>;

export async function generate({ prettier, verbose, config: configParam, ...params }: GenerateParams) {
  const start = Date.now();
  const profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1");

  const fileConfig = await profiler.runAsync("config.load", async () => await loadConfig(configParam));
  if (verbose) {
    logInfo("Generating code...");
  }
  const result = await runGenerate({ fileConfig, params, profiler });
  const config = result.config;

  if (result.skipped && verbose) {
    logInfo("OpenAPI and config unchanged. Skipping generation.");
  }
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
