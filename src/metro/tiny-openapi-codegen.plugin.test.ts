import fs from "fs";
import os from "os";
import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import type { MetroConfig } from "./openapi-codegen.plugin";
import { tinyOpenApiCodegenMetro } from "./tiny-openapi-codegen.plugin";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

describe("Metro tiny openapi-codegen plugin", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
  });

  test("generates Tiny OpenAPI before running the OpenAPI codegen wrapper", async () => {
    const root = path.resolve("/app");
    const calls: string[] = [];
    const generateOpenApiFile = vi.fn(async () => {
      calls.push("tiny");
    });

    runGenerateMock.mockImplementation(async () => {
      calls.push("codegen");
      return undefined as never;
    });

    const config: MetroConfig = tinyOpenApiCodegenMetro(
      { projectRoot: root } as MetroConfig,
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiFile, watchFolders: [], watchOpenApiInput: false },
    );

    await config.transformer?.getTransformOptions?.("entry");

    expect(calls).toEqual(["tiny", "codegen"]);
    expect(generateOpenApiFile).toHaveBeenCalledWith(
      expect.objectContaining({
        argv: ["--output", path.join(root, "openapi.json")],
        defaultOutput: path.join(root, "openapi.json"),
      }),
    );
  });

  test("accepts generateOpenApiSpec and writes before running codegen", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-metro-"));
    const generateOpenApiSpec = vi.fn(() => ({ openapi: "3.0.3", paths: {} }));

    const config: MetroConfig = tinyOpenApiCodegenMetro(
      { projectRoot: root } as MetroConfig,
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiSpec, watchFolders: [], watchOpenApiInput: false },
    );

    await config.transformer?.getTransformOptions?.("entry");

    expect(generateOpenApiSpec).toHaveBeenCalledTimes(1);
    expect(runGenerateMock).toHaveBeenCalledTimes(1);
  });

  test("accepts generateOpenApiSpecModule and writes before running codegen", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-metro-module-"));
    fs.mkdirSync(path.join(root, "scripts"));
    fs.writeFileSync(
      path.join(root, "scripts", "openapi-spec.mjs"),
      "export function generateTinyOpenApiSpec() { return { openapi: '3.0.3', paths: {} }; }",
    );

    const config: MetroConfig = tinyOpenApiCodegenMetro(
      { projectRoot: root } as MetroConfig,
      { input: "./openapi.json", output: "./src/data" },
      { generateOpenApiSpecModule: "./scripts/openapi-spec.mjs", watchFolders: [], watchOpenApiInput: false },
    );

    await config.transformer?.getTransformOptions?.("entry");

    expect(runGenerateMock).toHaveBeenCalledTimes(1);
  });

  test("uses only the existing codegen wrapper in real API mode", async () => {
    const root = path.resolve("/app");
    const generateOpenApiFile = vi.fn();

    const config: MetroConfig = tinyOpenApiCodegenMetro(
      { projectRoot: root } as MetroConfig,
      { input: "./openapi.json", output: "./src/data" },
      {
        apiMode: "real",
        generateOpenApiFile,
        watchFolders: [],
        watchOpenApiInput: false,
      },
    );

    await config.transformer?.getTransformOptions?.("entry");

    expect(generateOpenApiFile).not.toHaveBeenCalled();
    expect(runGenerateMock).toHaveBeenCalledTimes(1);
  });

  test("regenerates and broadcasts reload when a watched folder changes in fake API mode", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-metro-watch-"));
    const watchedFolder = path.join(root, "packages", "fake-be", "src", "orpc");
    const broadcast = vi.fn();
    const generateOpenApiFile = vi.fn(async () => undefined);
    let watchCallback: ((event: string, filename: string) => void) | undefined;

    fs.mkdirSync(watchedFolder, { recursive: true });

    const watchSpy = vi.spyOn(fs, "watch").mockImplementation(((
      _target: fs.PathLike,
      _options: fs.WatchOptions,
      listener: (event: string, filename: string) => void,
    ) => {
      watchCallback = listener;
      return { on: vi.fn() } as unknown as fs.FSWatcher;
    }) as typeof fs.watch);

    try {
      const config: MetroConfig = tinyOpenApiCodegenMetro(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.json", output: "./src/data" },
        { generateOpenApiFile, watchFolders: ["packages/fake-be/src/orpc"] },
      );

      config.server?.enhanceMiddleware?.(vi.fn(), { messageSocket: { broadcast } });
      await config.transformer?.getTransformOptions?.("entry");

      expect(generateOpenApiFile).toHaveBeenCalledTimes(1);
      expect(runGenerateMock).toHaveBeenCalledTimes(1);

      watchCallback?.("change", "contract.ts");
      await waitForWatcher();

      expect(generateOpenApiFile).toHaveBeenCalledTimes(2);
      expect(runGenerateMock).toHaveBeenCalledTimes(2);
      expect(broadcast).toHaveBeenCalledWith({ type: "reload" });
    } finally {
      watchSpy.mockRestore();
    }
  });
});

async function waitForWatcher() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
