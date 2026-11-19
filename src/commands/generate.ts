import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { runGenerate } from "@/generators/run/generate.runner";
import { GenerateOptions } from "@/generators/types/options";
import { logError, logInfo, logSuccess } from "@/helpers/cli.helper";
import { loadConfig, resolveConfigPath } from "@/helpers/config.helper";
import { Profiler } from "@/helpers/profile.helper";

export type GenerateParams = {
  config?: string;
  includeTags?: string;
  excludeTags?: string;
  inlineEndpointsExcludeModules?: string;
  workspaceContext?: string;
  prettier?: boolean;
  verbose?: boolean;
  /** Keep running and regenerate whenever the input spec or the config file changes. */
  watch?: boolean;
} & Partial<
  Pick<
    GenerateOptions,
    | "input"
    | "output"
    | "clearOutput"
    | "incremental"
    | "tsNamespaces"
    | "tsPath"
    | "splitByTags"
    | "defaultTag"
    | "removeOperationPrefixEndingWith"
    | "importPath"
    | "extractEnums"
    | "modelsInCommon"
    | "restClient"
    | "acl"
    | "checkAcl"
    | "standalone"
    | "baseUrl"
    | "replaceOptionalWithNullish"
    | "infiniteQueries"
    | "axiosRequestConfig"
    | "mutationEffects"
    | "mutationScope"
    | "parseRequestParams"
    | "inlineEndpoints"
    | "modelsOnly"
  >
>;

export async function generate({ prettier, verbose, watch, config: configParam, ...params }: GenerateParams) {
  const config = await generateOnce({ prettier, verbose, config: configParam, ...params });
  if (watch) {
    await watchAndGenerate(config.input, configParam, () =>
      generateOnce({ prettier, verbose: true, quiet: !verbose, config: configParam, ...params }),
    );
  }
}

async function generateOnce({
  prettier,
  verbose,
  quiet = false,
  config: configParam,
  ...params
}: GenerateParams & { quiet?: boolean }) {
  const start = Date.now();
  const profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1");

  const fileConfig = await profiler.runAsync("config.load", async () => await loadConfig(configParam));
  if (verbose && !quiet) {
    logInfo("Generating code...");
  }
  const result = await runGenerate({ fileConfig, params, profiler });
  const config = result.config;

  if (verbose) {
    if (result.skipped) {
      logInfo(quiet ? `Unchanged (${Date.now() - start}ms)` : "OpenAPI and config unchanged. Skipping generation.");
    } else if (quiet) {
      logSuccess(`Generated ${result.stats.generatedFilesCount} files in ${Date.now() - start}ms`);
    }
  }
  if (verbose && !quiet) {
    logSuccess(`Time: ${Date.now() - start}ms`);
    if (profiler.enabled) {
      logInfo("Profile breakdown:");
      profiler.formatLines().forEach((line) => logInfo(`  ${line}`));
    }
  }

  if (prettier) {
    execPrettier({ output: config.output, verbose });
  }
  return config;
}

/** Size and modification time of each file, to tell whether any changed. */
function fileState(files: string[]) {
  return files
    .map((file) => {
      try {
        const { size, mtimeMs } = fs.statSync(file);
        return `${size}:${mtimeMs}`;
      } catch {
        return "missing";
      }
    })
    .join("|");
}

/** Waits until the files stop changing (at most two seconds). */
async function settled(files: string[]) {
  let previous = fileState(files);
  for (let attempt = 0; attempt < 100; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const current = fileState(files);
    if (current === previous) return current;
    previous = current;
  }
  return previous;
}

/**
 * Regenerates whenever the input spec or the config file changes, in this process, so repeated
 * runs skip process startup. Watches the parent directories, so files replaced by a rename (as many
 * editors and generators write them) are seen too. Runs never overlap; changes during a run queue
 * exactly one more.
 */
async function watchAndGenerate(input: string, configParam: string | undefined, run: () => Promise<unknown>) {
  if (/^https?:\/\//i.test(input)) {
    throw new Error("--watch needs a local input file; the input is a URL");
  }
  const watched = [path.resolve(input), resolveConfigPath(configParam)].filter(
    (file): file is string => file !== undefined,
  );
  let running = false;
  let pending = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (running) {
        pending = true;
        return;
      }
      running = true;
      do {
        pending = false;
        const before = fileState(watched);
        try {
          await run();
        } catch (error) {
          // A spec read while still being written fails to parse; once it is complete, run again
          // instead of reporting the half-written state.
          if ((await settled(watched)) !== before) {
            pending = true;
            continue;
          }
          logError(error instanceof Error ? error : String(error));
        }
      } while (pending);
      running = false;
    }, 10);
  };
  for (const directory of new Set(watched.map((file) => path.dirname(file)))) {
    const names = new Set(
      watched.filter((file) => path.dirname(file) === directory).map((file) => path.basename(file)),
    );
    fs.watch(directory, (_event, fileName) => {
      if (fileName && names.has(path.basename(fileName.toString()))) trigger();
    });
  }
  logInfo(`Watching ${watched.map((file) => path.relative(process.cwd(), file) || file).join(", ")} for changes...`);
  await new Promise<never>(() => {});
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
