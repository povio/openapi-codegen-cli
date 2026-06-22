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

  let startupSucceeded = false;
  let inflightGenerate: Promise<void> | undefined;
  let inputWatcher: fs.FSWatcher | undefined;

  const requestStartupGenerate = (): Promise<void> => {
    if (startupSucceeded) {
      return Promise.resolve();
    }

    if (inflightGenerate) {
      return inflightGenerate;
    }

    const attempt = codegen.enqueueGenerate(root).then(
      () => {
        startupSucceeded = true;
        inflightGenerate = undefined;
      },
      (error: unknown) => {
        inflightGenerate = undefined;
        throw error;
      },
    );

    inflightGenerate = attempt;
    return attempt;
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
        startupSucceeded = false;
        requestStartupGenerate().catch(reportGenerateError);
      });
      inputWatcher.on("error", reportWatcherError);
    } catch (error) {
      reportWatcherError(error);
    }
  };

  const wrappedConfig: MetroConfig = {
    ...metroConfig,
    server: {
      ...metroConfig.server,
      enhanceMiddleware(middleware, server) {
        ensureInputWatcher();

        const enhancedMiddleware = originalEnhanceMiddleware
          ? originalEnhanceMiddleware(middleware, server)
          : middleware;

        return async (request, response, next) => {
          try {
            await requestStartupGenerate();
            return await (enhancedMiddleware(request, response, next) as Promise<unknown>);
          } catch (error) {
            next(error);
          }
        };
      },
    },
    transformer: {
      ...metroConfig.transformer,
      async getTransformOptions(...args) {
        await requestStartupGenerate();
        return originalGetTransformOptions ? originalGetTransformOptions(...args) : undefined;
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
