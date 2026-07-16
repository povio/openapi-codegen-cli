import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import { openApiCodegen } from "./openapi-codegen.plugin";

import type { ResolvedConfig } from "vite";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

type VitePluginHooks = {
  configResolved: (config: ResolvedConfig) => void;
  buildStart: () => Promise<void>;
};

describe("Vite openapi-codegen plugin", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
  });

  test("logs feedback after generation succeeds", async () => {
    const root = path.resolve("/app");
    const logger = { info: vi.fn() };
    const plugin = openApiCodegen({ input: "./openapi.yaml", output: "./src/data" }) as unknown as VitePluginHooks;

    plugin.configResolved({ root, logger } as unknown as ResolvedConfig);
    await plugin.buildStart();

    expect(logger.info).toHaveBeenCalledWith("[openapi-codegen] OpenAPI client generated successfully.");
  });
});
