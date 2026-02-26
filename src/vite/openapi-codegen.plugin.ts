import path from "path";

import { runGenerate } from "@/generators/run/generate.runner";
import { OpenAPICodegenConfig } from "@/generators/types/config";
import { Profiler } from "@/helpers/profile.helper";

import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

export function openApiCodegen(config: OpenAPICodegenConfig): Plugin {
  let resolvedViteConfig: ResolvedConfig | undefined;
  let queue: Promise<void> = Promise.resolve();
  const isLocalInput = typeof config.input === "string" && !/^https?:\/\//i.test(config.input);
  const normalizedConfig = { ...config };

  const enqueueGenerate = () => {
    queue = queue.then(async () => {
      const currentConfig = resolvedViteConfig;
      if (!currentConfig) {
        return;
      }

      const fileConfig = normalizePaths(normalizedConfig, currentConfig.root);
      const profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1");
      await runGenerate({ fileConfig, profiler });
    });
  };

  const setupWatcher = (server: ViteDevServer) => {
    if (!isLocalInput || !config.input) {
      return;
    }

    const openApiPath = path.resolve(server.config.root, config.input);
    server.watcher.add(openApiPath);
    server.watcher.on("change", (changedPath) => {
      if (path.resolve(changedPath) === openApiPath) {
        enqueueGenerate();
      }
    });
  };

  return {
    name: "openapi-codegen",
    configResolved(config) {
      resolvedViteConfig = config;
    },
    buildStart() {
      enqueueGenerate();
    },
    configureServer(server) {
      setupWatcher(server);
    },
  };
}

function normalizePaths(config: OpenAPICodegenConfig, root: string): OpenAPICodegenConfig {
  const normalized = { ...config };

  if (typeof normalized.output === "string" && !path.isAbsolute(normalized.output)) {
    normalized.output = path.resolve(root, normalized.output);
  }

  if (
    typeof normalized.input === "string" &&
    !path.isAbsolute(normalized.input) &&
    !/^https?:\/\//i.test(normalized.input)
  ) {
    normalized.input = path.resolve(root, normalized.input);
  }

  return normalized;
}
