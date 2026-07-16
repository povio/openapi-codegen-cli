import fs from "fs";
import path from "path";

import { createOpenApiCodegenRunner } from "@/plugins/openapi-codegen.runner";
import {
  createTinyOpenApiSourceRunner,
  isTinyOpenApiFakeMode,
  normalizeWatchFolders,
} from "@/tiny/openapi-source.runner";
import { GenerateOpenApiFile, GenerateOpenApiSpec } from "@/tiny/openapi";
import { TinyOpenApiSpecModuleConfig } from "@/tiny/openapi-source.runner";
import {
  MetroConfig,
  MetroServer,
  OpenApiCodegenMetroConfig,
  OpenApiCodegenMetroOptions,
  withOpenApiCodegen,
} from "@/metro/openapi-codegen.plugin";

export interface TinyOpenApiCodegenMetroOptions extends OpenApiCodegenMetroOptions {
  apiMode?: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  generateOpenApiFile?: GenerateOpenApiFile;
  generateOpenApiSpec?: GenerateOpenApiSpec;
  generateOpenApiSpecModule?: string | TinyOpenApiSpecModuleConfig;
  watchFolders: readonly string[];
  watchTinyOpenApiInput?: boolean;
}

const watchedEvents = new Set(["change", "rename"]);

export function tinyOpenApiCodegenMetro<TMetroConfig extends MetroConfig>(
  metroConfig: Promise<TMetroConfig>,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: TinyOpenApiCodegenMetroOptions,
): Promise<TMetroConfig>;
export function tinyOpenApiCodegenMetro<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: TinyOpenApiCodegenMetroOptions,
): TMetroConfig;
export function tinyOpenApiCodegenMetro<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig | Promise<TMetroConfig>,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: TinyOpenApiCodegenMetroOptions,
): TMetroConfig | Promise<TMetroConfig> {
  if (isPromiseLike(metroConfig)) {
    return metroConfig.then((resolvedConfig) => withResolvedTinyOpenApiCodegen(resolvedConfig, codegenConfig, options));
  }

  return withResolvedTinyOpenApiCodegen(metroConfig, codegenConfig, options);
}

function withResolvedTinyOpenApiCodegen<TMetroConfig extends MetroConfig>(
  metroConfig: TMetroConfig,
  codegenConfig: OpenApiCodegenMetroConfig,
  options: TinyOpenApiCodegenMetroOptions,
): TMetroConfig {
  if (!isTinyOpenApiFakeMode(options.apiMode)) {
    return withOpenApiCodegen(metroConfig, codegenConfig, options);
  }

  const root = path.resolve(options.root ?? metroConfig.projectRoot ?? process.cwd());
  const sourceRunner = createTinyOpenApiSourceRunner({
    cwd: options.cwd,
    env: options.env,
    generateOpenApiFile: options.generateOpenApiFile,
    generateOpenApiSpec: options.generateOpenApiSpec,
    generateOpenApiSpecModule: options.generateOpenApiSpecModule,
    input: codegenConfig.input,
    root,
  });
  const codegenRunner = createOpenApiCodegenRunner(codegenConfig);
  const originalEnhanceMiddleware = metroConfig.server?.enhanceMiddleware;
  const originalGetTransformOptions = metroConfig.transformer?.getTransformOptions;

  let startupSucceeded = false;
  let inflightGenerate: Promise<void> | undefined;
  let metroServer: MetroServer | undefined;
  let watcherReady = false;
  let watchers: fs.FSWatcher[] = [];

  const requestGenerateAll = (): Promise<void> => {
    if (startupSucceeded) {
      return Promise.resolve();
    }

    if (inflightGenerate) {
      return inflightGenerate;
    }

    const attempt = sourceRunner
      .enqueueGenerate()
      .then(() => codegenRunner.enqueueGenerate(root))
      .then(
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

  const requestSourceChangeGenerate = () => {
    startupSucceeded = false;
    return requestGenerateAll().then(() => {
      notifyMetroReload(metroServer);
    });
  };

  const ensureWatcher = () => {
    if (watcherReady || options.watchTinyOpenApiInput === false) {
      return;
    }

    watcherReady = true;
    watchers = normalizeWatchFolders(root, options.watchFolders).flatMap(watchPath);
  };

  const enhancedConfig: MetroConfig = {
    ...metroConfig,
    server: {
      ...metroConfig.server,
      enhanceMiddleware(middleware, server) {
        metroServer = server;
        ensureWatcher();
        const enhancedMiddleware = originalEnhanceMiddleware
          ? originalEnhanceMiddleware(middleware, server)
          : middleware;

        return async (request, response, next) => {
          try {
            await requestGenerateAll();
            return await enhancedMiddleware(request, response, next);
          } catch (error) {
            next(error);
          }
        };
      },
    },
    transformer: {
      ...metroConfig.transformer,
      async getTransformOptions(...args) {
        await requestGenerateAll();
        return originalGetTransformOptions ? originalGetTransformOptions(...args) : undefined;
      },
    },
  };

  if (options.root || metroConfig.projectRoot) {
    enhancedConfig.projectRoot = root;
  }

  return enhancedConfig as TMetroConfig;

  function watchPath(target: string) {
    try {
      const watcher = fs.watch(
        target,
        { persistent: false, recursive: fs.existsSync(target) && fs.statSync(target).isDirectory() },
        (event) => {
          if (watchedEvents.has(event)) {
            requestSourceChangeGenerate().catch(reportGenerateError);
          }
        },
      );

      watcher.on("error", reportWatcherError);
      return [watcher];
    } catch (error) {
      reportWatcherError(error);
      return [];
    }
  }
}

function isPromiseLike<TValue>(value: TValue | Promise<TValue>): value is Promise<TValue> {
  return typeof (value as Promise<TValue>).then === "function";
}

function reportGenerateError(error: unknown) {
  console.error("[tiny-openapi] Failed to generate OpenAPI spec from Metro config.", error);
}

function reportWatcherError(error: unknown) {
  console.error("[tiny-openapi] Failed to watch OpenAPI inputs from Metro config.", error);
}

function notifyMetroReload(server: MetroServer | undefined) {
  const serverRecord = isRecord(server) ? server : undefined;
  const sockets = [
    serverRecord?.messageSocket,
    serverRecord?._messageSocket,
    serverRecord?.websocketServer,
    serverRecord?._websocketServer,
    serverRecord?.hmrServer,
    serverRecord?._hmrServer,
  ];

  for (const socket of sockets) {
    if (!isRecord(socket)) {
      continue;
    }

    if (typeof socket.broadcast === "function") {
      socket.broadcast({ type: "reload" });
      return;
    }

    if (typeof socket.send === "function") {
      socket.send({ type: "reload" });
      return;
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
