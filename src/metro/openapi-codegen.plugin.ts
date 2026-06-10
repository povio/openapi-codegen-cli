import fs from "fs";
import path from "path";

import { OpenAPICodegenConfig } from "@/generators/types/config";
import { GenerateFileFormatter } from "@/generators/types/generate";
import { createOpenApiCodegenRunner } from "@/plugins/openapi-codegen.runner";

import type { IncomingMessage, ServerResponse } from "http";

export type OpenApiCodegenMetroConfig = OpenAPICodegenConfig & {
  formatGeneratedFile?: GenerateFileFormatter;
};

export type OpenApiCodegenMetroOptions = {
  root?: string;
  watchOpenApiInput?: boolean;
};

export type MetroNextFunction = (error?: unknown) => void;
export type MetroMiddleware = (request: IncomingMessage, response: ServerResponse, next: MetroNextFunction) => unknown;
export type MetroServer = unknown;

export type MetroConfig = {
  projectRoot?: string;
  server?: {
    enhanceMiddleware?: (middleware: MetroMiddleware, server: MetroServer) => MetroMiddleware;
    [key: string]: unknown;
  };
  transformer?: {
    getTransformOptions?: (...args: unknown[]) => unknown;
    [key: string]: unknown;
  };
  watchFolders?: readonly string[];
  [key: string]: unknown;
};

const DEFAULT_TRANSFORM_OPTIONS = {
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
};

export function withOpenApiCodegen<TMetroConfig extends MetroConfig>(
  metroConfig: Promise<TMetroConfig>,
  codegenConfig: OpenApiCodegenMetroConfig,
  options?: OpenApiCodegenMetroOptions,
): Promise<TMetroConfig>;
export function withOpenApiCodegen<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig,
  codegenConfig: OpenApiCodegenMetroConfig,
  options?: OpenApiCodegenMetroOptions,
): TMetroConfig;
export function withOpenApiCodegen<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig | Promise<TMetroConfig>,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: OpenApiCodegenMetroOptions = {},
): TMetroConfig | Promise<TMetroConfig> {
  if (isPromiseLike(metroConfig)) {
    return metroConfig.then((resolvedConfig) => withResolvedOpenApiCodegen(resolvedConfig, codegenConfig, options));
  }

  return withResolvedOpenApiCodegen(metroConfig, codegenConfig, options);
}

function withResolvedOpenApiCodegen<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: OpenApiCodegenMetroOptions,
): TMetroConfig {
  const root = path.resolve(options.root ?? metroConfig.projectRoot ?? process.cwd());
  const codegen = createOpenApiCodegenRunner(codegenConfig);
  const originalEnhanceMiddleware = metroConfig.server?.enhanceMiddleware;
  const originalGetTransformOptions = metroConfig.transformer?.getTransformOptions;
  let startupRequested = false;
  let pendingGenerate: Promise<void> | undefined;
  let inputWatcher: fs.FSWatcher | undefined;

  const enqueueAndTrack = () => {
    const run = codegen.enqueueGenerate(root);
    const tracked = run.finally(() => {
      if (pendingGenerate === tracked) {
        pendingGenerate = undefined;
      }
    });

    pendingGenerate = tracked;
    return run;
  };

  const ensureStartupGenerate = () => {
    if (startupRequested) {
      return pendingGenerate ?? Promise.resolve();
    }

    startupRequested = true;
    return enqueueAndTrack().catch((error: unknown) => {
      startupRequested = false;
      throw error;
    });
  };

  const ensureInputWatcher = () => {
    if (options.watchOpenApiInput === false || inputWatcher) {
      return;
    }

    const inputPath = codegen.getLocalInputPath(root);
    if (!inputPath) {
      return;
    }

    try {
      inputWatcher = fs.watch(inputPath, { persistent: false }, () => {
        enqueueAndTrack().catch(reportGenerateError);
      });
      inputWatcher.on("error", reportWatcherError);
    } catch (error) {
      reportWatcherError(error);
    }
  };

  void ensureStartupGenerate().catch(reportGenerateError);

  const wrappedConfig: MetroConfig = {
    ...metroConfig,
    server: {
      ...metroConfig.server,
      enhanceMiddleware(middleware, server) {
        void ensureStartupGenerate().catch(reportGenerateError);
        ensureInputWatcher();

        const enhancedMiddleware = originalEnhanceMiddleware
          ? originalEnhanceMiddleware(middleware, server)
          : middleware;

        return async (request, response, next) => {
          try {
            await ensureStartupGenerate();
            return await Promise.resolve(enhancedMiddleware(request, response, next));
          } catch (error) {
            next(error);
          }
        };
      },
    },
    transformer: {
      ...metroConfig.transformer,
      async getTransformOptions(...args) {
        await ensureStartupGenerate();
        return originalGetTransformOptions ? originalGetTransformOptions(...args) : DEFAULT_TRANSFORM_OPTIONS;
      },
    },
  };

  if (options.root || metroConfig.projectRoot) {
    wrappedConfig.projectRoot = root;
  }

  return wrappedConfig as TMetroConfig;
}

function isPromiseLike<TValue>(value: TValue | Promise<TValue>): value is Promise<TValue> {
  return typeof (value as Promise<TValue>).then === "function";
}

function reportGenerateError(error: unknown) {
  console.error("[openapi-codegen] Failed to generate OpenAPI client from Metro config.", error);
}

function reportWatcherError(error: unknown) {
  console.error("[openapi-codegen] Failed to watch OpenAPI input from Metro config.", error);
}
