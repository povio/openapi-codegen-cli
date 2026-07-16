import fs from "fs";
import os from "os";
import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import { tinyOpenApiCodegen } from "./tiny-openapi-codegen.plugin";

import type { Plugin, ResolvedConfig } from "vite";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

describe("Vite tiny openapi-codegen plugin", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
  });

  test("generates Tiny OpenAPI and immediately runs OpenAPI codegen in one plugin", async () => {
    const root = path.resolve("/app");
    const calls: string[] = [];
    const generateOpenApiFile = vi.fn(async () => {
      calls.push("tiny");
    });

    runGenerateMock.mockImplementation(async () => {
      calls.push("codegen");
      return undefined as never;
    });

    const [plugin] = tinyOpenApiCodegen(
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiFile, watchFolders: [] },
    ) as Plugin[];

    await callHook(plugin.configResolved, { root } as ResolvedConfig);
    await callHook(plugin.buildStart, {} as never);

    expect(calls).toEqual(["tiny", "codegen"]);
    expect(generateOpenApiFile).toHaveBeenCalledWith(
      expect.objectContaining({
        argv: ["--output", path.join(root, "openapi.json")],
        defaultOutput: path.join(root, "openapi.json"),
      }),
    );
    expect(runGenerateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fileConfig: expect.objectContaining({
          input: path.join(root, "openapi.json"),
          output: path.join(root, "src/data"),
        }),
      }),
    );
  });

  test("accepts generateOpenApiSpec and writes the configured local input file", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-vite-"));
    const generateOpenApiSpec = vi.fn(() => ({ openapi: "3.0.3", paths: {} }));

    const [plugin] = tinyOpenApiCodegen(
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiSpec, watchFolders: [] },
    ) as Plugin[];

    await callHook(plugin.configResolved, { root } as ResolvedConfig);
    await callHook(plugin.buildStart, {} as never);

    expect(generateOpenApiSpec).toHaveBeenCalledTimes(1);
    expect(runGenerateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fileConfig: expect.objectContaining({
          input: path.join(root, "openapi.json"),
        }),
      }),
    );
  });

  test("accepts generateOpenApiSpecModule and writes the configured local input file", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-vite-module-"));
    fs.mkdirSync(path.join(root, "scripts"));
    fs.writeFileSync(
      path.join(root, "scripts", "openapi-spec.mjs"),
      "export function generateTinyOpenApiSpec() { return { openapi: '3.0.3', paths: {} }; }",
    );

    const [plugin] = tinyOpenApiCodegen(
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiSpecModule: "./scripts/openapi-spec.mjs", watchFolders: [] },
    ) as Plugin[];

    await callHook(plugin.configResolved, { root } as ResolvedConfig);
    await callHook(plugin.buildStart, {} as never);

    expect(runGenerateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fileConfig: expect.objectContaining({
          input: path.join(root, "openapi.json"),
        }),
      }),
    );
  });

  test("regenerates and reloads when a file inside a watched folder changes in fake API mode", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-vite-fake-watch-"));
    const fakeBePath = path.join(root, "packages", "fake-be", "src", "orpc", "api", "contract.ts");
    const callbacks: Array<(event: string, changedPath: string) => void> = [];
    const generateOpenApiFile = vi.fn(async () => undefined);
    const send = vi.fn();

    fs.mkdirSync(path.dirname(fakeBePath), { recursive: true });
    fs.writeFileSync(fakeBePath, "export const contract = {};\n");

    const [plugin] = tinyOpenApiCodegen(
      { input: "./openapi.json", output: "./src/data" },
      {
        debounceMs: 0,
        generateOpenApiFile,
        watchFolders: ["packages/fake-be/src/orpc"],
      },
    ) as Plugin[];

    await callHook(plugin.configResolved, { root } as ResolvedConfig);
    await callHook(plugin.configureServer, {
      config: {
        logger: {
          error: vi.fn(),
        },
        root,
      },
      watcher: {
        add: vi.fn(),
        on: vi.fn((event: string, callback: (event: string, changedPath: string) => void) => {
          if (event === "all") {
            callbacks.push(callback);
          }
        }),
      },
      ws: {
        send,
      },
    } as never);

    expect(generateOpenApiFile).toHaveBeenCalledTimes(1);
    expect(runGenerateMock).toHaveBeenCalledTimes(1);

    callbacks[0]?.("change", fakeBePath);
    await waitForRestart();

    expect(generateOpenApiFile).toHaveBeenCalledTimes(2);
    expect(runGenerateMock).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith({ type: "full-reload" });
  });
});

async function callHook<THook extends (...args: never[]) => unknown>(
  hook: THook | { handler: THook } | undefined,
  ...args: Parameters<THook>
) {
  if (!hook) {
    return;
  }

  const handler = typeof hook === "function" ? hook : hook.handler;

  await handler(...args);
}

async function waitForRestart() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
