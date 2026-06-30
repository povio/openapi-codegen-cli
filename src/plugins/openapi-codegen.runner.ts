import path from "path";

import { runGenerate } from "@/generators/run/generate.runner";
import { OpenAPICodegenConfig } from "@/generators/types/config";
import { GenerateFileFormatter } from "@/generators/types/generate";
import { Profiler } from "@/helpers/profile.helper";

export type OpenApiCodegenPluginConfig = OpenAPICodegenConfig & {
  formatGeneratedFile?: GenerateFileFormatter;
};

export function createOpenApiCodegenRunner(config: OpenApiCodegenPluginConfig) {
  let queue: Promise<void> = Promise.resolve();
  const { formatGeneratedFile, ...fileConfig } = config;

  const enqueueGenerate = (root: string) => {
    const run = queue
      .catch(() => undefined)
      .then(async () => {
        const profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1");
        await runGenerate({
          fileConfig: normalizeOpenApiCodegenPaths(fileConfig, root),
          formatGeneratedFile,
          profiler,
        });
      });

    queue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  };

  return {
    enqueueGenerate,
    getLocalInputPath: (root: string) => getLocalInputPath(config.input, root),
    isLocalInput: isLocalOpenApiInput(config.input),
  };
}

export function normalizeOpenApiCodegenPaths(config: OpenAPICodegenConfig, root: string): OpenAPICodegenConfig {
  const normalized = { ...config };

  if (typeof normalized.output === "string" && !path.isAbsolute(normalized.output)) {
    normalized.output = path.resolve(root, normalized.output);
  }

  if (
    typeof normalized.input === "string" &&
    !path.isAbsolute(normalized.input) &&
    isLocalOpenApiInput(normalized.input)
  ) {
    normalized.input = path.resolve(root, normalized.input);
  }

  return normalized;
}

function getLocalInputPath(input: OpenAPICodegenConfig["input"], root: string) {
  if (!isLocalOpenApiInput(input)) {
    return undefined;
  }

  return path.resolve(root, input);
}

function isLocalOpenApiInput(input: OpenAPICodegenConfig["input"]): input is string {
  return typeof input === "string" && !/^https?:\/\//i.test(input);
}
