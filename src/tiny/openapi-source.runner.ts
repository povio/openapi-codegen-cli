import path from "path";
import { pathToFileURL } from "url";

import { OpenAPICodegenConfig } from "@/generators/types/config";

import { generateOpenApiFile, GenerateOpenApiFile, GenerateOpenApiSpec } from "./openapi";

export interface TinyOpenApiSpecModuleConfig {
  exportName?: string;
  path: string;
}

export interface TinyOpenApiSourceRunnerConfig {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  generateOpenApiFile?: GenerateOpenApiFile;
  generateOpenApiSpec?: GenerateOpenApiSpec;
  generateOpenApiSpecModule?: string | TinyOpenApiSpecModuleConfig;
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

    const generateOpenApiFileOptions = {
      argv: ["--output", outputPath],
      cwd: config.cwd ?? config.root,
      defaultOutput: outputPath,
      env: config.env ?? process.env,
    };

    if (config.generateOpenApiFile) {
      await config.generateOpenApiFile(generateOpenApiFileOptions);
      return;
    }

    const generateOpenApiSpec = config.generateOpenApiSpec ?? (await loadOpenApiSpecGenerator(config));

    if (!generateOpenApiSpec) {
      throw new Error(
        "Missing Tiny OpenAPI generator. Pass generateOpenApiFile, generateOpenApiSpec, or generateOpenApiSpecModule.",
      );
    }

    await generateOpenApiFile({
      ...generateOpenApiFileOptions,
      generateOpenApiSpec,
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

async function loadOpenApiSpecGenerator(
  config: TinyOpenApiSourceRunnerConfig,
): Promise<GenerateOpenApiSpec | undefined> {
  if (!config.generateOpenApiSpecModule) {
    return undefined;
  }

  const moduleConfig =
    typeof config.generateOpenApiSpecModule === "string"
      ? { path: config.generateOpenApiSpecModule }
      : config.generateOpenApiSpecModule;
  const modulePath = path.isAbsolute(moduleConfig.path)
    ? moduleConfig.path
    : path.resolve(config.root, moduleConfig.path);
  const exportName = moduleConfig.exportName ?? "generateTinyOpenApiSpec";
  const moduleExports = (await import(pathToFileURL(modulePath).href)) as Record<string, unknown>;
  const generateOpenApiSpec = moduleExports[exportName];

  if (typeof generateOpenApiSpec !== "function") {
    throw new Error(`Tiny OpenAPI spec module "${moduleConfig.path}" does not export function "${exportName}".`);
  }

  return generateOpenApiSpec as GenerateOpenApiSpec;
}
