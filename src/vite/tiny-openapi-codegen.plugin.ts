import path from "path";

import { createOpenApiCodegenRunner } from "@/plugins/openapi-codegen.runner";
import { createTinyOpenApiSourceRunner, isTinyOpenApiFakeMode, normalizeWatchFolders } from "@/tiny/openapi-source.runner";
import { GenerateOpenApiFile } from "@/tiny/openapi";
import { openApiCodegen, OpenApiCodegenViteConfig } from "@/vite/openapi-codegen.plugin";

import type { Plugin, PluginOption, ResolvedConfig, ViteDevServer } from "vite";

export interface TinyOpenApiCodegenViteOptions {
  apiMode?: string;
  cwd?: string;
  debounceMs?: number;
  env?: NodeJS.ProcessEnv;
  generateOpenApiFile: GenerateOpenApiFile;
  watchFolders: readonly string[];
}

const watchedEvents = new Set(["add", "change", "unlink"]);

function tinyOpenApiCodegenPlugin(
  codegenConfig: OpenApiCodegenViteConfig,
  options: TinyOpenApiCodegenViteOptions,
): Plugin {
  const debounceMs = options.debounceMs ?? 150;
  const codegenRunner = createOpenApiCodegenRunner(codegenConfig);
  let resolvedConfig: ResolvedConfig | undefined;
  let debounceTimer: NodeJS.Timeout | undefined;

  const getRunner = () => {
    const root = resolvedConfig?.root ?? process.cwd();

    return createTinyOpenApiSourceRunner({
      cwd: options.cwd,
      env: options.env,
      generateOpenApiFile: options.generateOpenApiFile,
      input: codegenConfig.input,
      root,
    });
  };

  let runner = getRunner();

  const enqueueGenerate = async () => {
    const root = resolvedConfig?.root ?? process.cwd();

    await runner.enqueueGenerate();
    await codegenRunner.enqueueGenerate(root);
  };

  const scheduleGenerate = (server: ViteDevServer) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      enqueueGenerate().catch((error: unknown) => {
        server.config.logger.error(`[tiny-openapi] ${error instanceof Error ? error.message : String(error)}`);
      });
    }, debounceMs);
  };

  const setupWatcher = (server: ViteDevServer) => {
    const root = resolvedConfig?.root ?? server.config.root;
    const watchFolders = normalizeWatchFolders(root, options.watchFolders);

    server.watcher.add(watchFolders);
    server.watcher.on("all", (event, changedPath) => {
      if (watchedEvents.has(event) && isPathInWatchFolders(changedPath, watchFolders)) {
        scheduleGenerate(server);
      }
    });
  };

  return {
    name: "tiny-openapi-codegen",
    configResolved(config) {
      resolvedConfig = config;
      runner = getRunner();
    },
    async buildStart() {
      await enqueueGenerate();
    },
    async configureServer(server) {
      await enqueueGenerate();
      setupWatcher(server);
    },
  };
}

export function tinyOpenApiCodegen(
  codegenConfig: OpenApiCodegenViteConfig,
  options: TinyOpenApiCodegenViteOptions,
): PluginOption[] {
  if (!isTinyOpenApiFakeMode(options.apiMode)) {
    return [openApiCodegen(codegenConfig)];
  }

  return [tinyOpenApiCodegenPlugin(codegenConfig, options)];
}

function isPathInWatchFolders(changedPath: string, watchFolders: readonly string[]) {
  const resolvedChangedPath = path.resolve(changedPath);

  return watchFolders.some((folder) => {
    const relativePath = path.relative(folder, resolvedChangedPath);

    return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
  });
}
