import path from "path";

import { OpenAPICodegenConfig } from "@/generators/types/config";

import { GenerateOpenApiFile } from "./openapi";

export interface TinyOpenApiSourceRunnerConfig {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  generateOpenApiFile: GenerateOpenApiFile;
  input: OpenAPICodegenConfig["input"];
  root: string;
}

export function createTinyOpenApiSourceRunner(config: TinyOpenApiSourceRunnerConfig) {
  let queue: Promise<void> = Promise.resolve();

  const getOutputPath = () => getLocalInputPath(config.input, config.root);

  const runGenerate = async () => {
    const outputPath = getOutputPath();
    if (!outputPath) {
      return;
    }

    await config.generateOpenApiFile({
      argv: ["--output", outputPath],
      cwd: config.cwd ?? config.root,
      defaultOutput: outputPath,
      env: config.env ?? process.env,
    });
  };

  const enqueueGenerate = () => {
    const run = queue.catch(() => undefined).then(runGenerate);

    queue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  };

  return {
    enqueueGenerate,
    getOutputPath,
  };
}

export function isTinyOpenApiFakeMode(apiMode = process.env.VITE_PUBLIC_API_MODE ?? process.env.EXPO_PUBLIC_API_MODE) {
  return apiMode !== "real";
}

export function getLocalInputPath(input: OpenAPICodegenConfig["input"], root: string): string | undefined {
  if (typeof input !== "string" || /^https?:\/\//i.test(input)) {
    return undefined;
  }

  return path.resolve(root, input);
}

export function normalizeWatchFolders(root: string, watchFolders: readonly string[] = []): string[] {
  return watchFolders.map((folder) => (path.isAbsolute(folder) ? folder : path.resolve(root, folder)));
}

