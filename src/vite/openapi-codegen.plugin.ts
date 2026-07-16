import path from "path";

import { createOpenApiCodegenRunner, OpenApiCodegenPluginConfig } from "@/plugins/openapi-codegen.runner";

import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

export type OpenApiCodegenViteConfig = OpenApiCodegenPluginConfig;

export function openApiCodegen(config: OpenApiCodegenViteConfig): Plugin {
  let resolvedViteConfig: ResolvedConfig | undefined;
  const codegen = createOpenApiCodegenRunner(config, {
    onGenerated() {
      resolvedViteConfig?.logger.info("[openapi-codegen] OpenAPI client generated successfully.");
    },
  });

  const enqueueGenerate = () => {
    const currentConfig = resolvedViteConfig;
    if (!currentConfig) {
      return Promise.resolve();
    }

    return codegen.enqueueGenerate(currentConfig.root);
  };

  const setupWatcher = (server: ViteDevServer) => {
    const openApiPath = codegen.getLocalInputPath(server.config.root);
    if (!openApiPath) {
      return;
    }

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
    async buildStart() {
      await enqueueGenerate();
    },
    async configureServer(server) {
      await enqueueGenerate();
      setupWatcher(server);
    },
  };
}
