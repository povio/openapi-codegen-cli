import fs from "fs";
import os from "os";
import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { createTinyOpenApiSourceRunner, getLocalInputPath, normalizeWatchFolders } from "./openapi-source.runner";

describe("tiny openapi source runner", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("resolves local input paths from root and ignores remote inputs", () => {
    const root = path.resolve("/app");

    expect(getLocalInputPath("./openapi.json", root)).toBe(path.join(root, "openapi.json"));
    expect(getLocalInputPath("https://example.com/openapi.json", root)).toBeUndefined();
  });

  test("normalizes watch folders from root", () => {
    const root = path.resolve("/app");

    expect(normalizeWatchFolders(root, ["./src/orpc", "/shared"])).toEqual([path.join(root, "src/orpc"), "/shared"]);
  });

  test("calls generateOpenApiFile with the generated local input path", async () => {
    const root = path.resolve("/app");
    const generateOpenApiFile = vi.fn();
    const runner = createTinyOpenApiSourceRunner({
      generateOpenApiFile,
      input: "./openapi.json",
      root,
    });

    await runner.enqueueGenerate();

    expect(generateOpenApiFile).toHaveBeenCalledWith(
      expect.objectContaining({
        argv: ["--output", path.join(root, "openapi.json")],
        cwd: root,
        defaultOutput: path.join(root, "openapi.json"),
      }),
    );
  });

  test("writes the generated spec when generateOpenApiSpec is provided", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-runner-"));
    const runner = createTinyOpenApiSourceRunner({
      generateOpenApiSpec: () => ({ openapi: "3.0.3", paths: {} }),
      input: "./openapi.json",
      root,
    });

    await runner.enqueueGenerate();

    expect(fs.readFileSync(path.join(root, "openapi.json"), "utf8")).toBe(
      `${JSON.stringify({ openapi: "3.0.3", paths: {} }, null, 2)}\n`,
    );
  });

  test("loads generateOpenApiSpec from a module path", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "tiny-openapi-runner-module-"));
    fs.mkdirSync(path.join(root, "scripts"));
    fs.writeFileSync(
      path.join(root, "scripts", "openapi-spec.mjs"),
      "export function generateSpec() { return { openapi: '3.0.3', paths: { '/health': {} } }; }",
    );
    const runner = createTinyOpenApiSourceRunner({
      generateOpenApiSpecModule: {
        path: "./scripts/openapi-spec.mjs",
        exportName: "generateSpec",
      },
      input: "./openapi.json",
      root,
    });

    await runner.enqueueGenerate();

    expect(fs.readFileSync(path.join(root, "openapi.json"), "utf8")).toBe(
      `${JSON.stringify({ openapi: "3.0.3", paths: { "/health": {} } }, null, 2)}\n`,
    );
  });

  test("skips generation for remote OpenAPI input", async () => {
    const generateOpenApiFile = vi.fn();
    const runner = createTinyOpenApiSourceRunner({
      generateOpenApiFile,
      input: "https://example.com/openapi.json",
      root: path.resolve("/app"),
    });

    await runner.enqueueGenerate();

    expect(generateOpenApiFile).not.toHaveBeenCalled();
  });

  test("continues queueing after a failed generation", async () => {
    const generateOpenApiFile = vi.fn().mockRejectedValueOnce(new Error("failed"));
    const runner = createTinyOpenApiSourceRunner({
      generateOpenApiFile,
      input: "./openapi.json",
      root: path.resolve("/app"),
    });

    await expect(runner.enqueueGenerate()).rejects.toThrow("failed");
    await expect(runner.enqueueGenerate()).resolves.toBeUndefined();

    expect(generateOpenApiFile).toHaveBeenCalledTimes(2);
  });
});
