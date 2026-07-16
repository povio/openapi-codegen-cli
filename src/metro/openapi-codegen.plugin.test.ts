import path from "path";

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import type { MetroConfig } from "./openapi-codegen.plugin";
import { withOpenApiCodegen } from "./openapi-codegen.plugin";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

describe("Metro openapi-codegen plugin", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("middleware", () => {
    test("logs feedback after generation succeeds", async () => {
      const root = path.resolve("/app");
      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      await config.transformer?.getTransformOptions?.("entry");

      expect(console.info).toHaveBeenCalledWith("[openapi-codegen] OpenAPI client generated successfully.");
    });

    test("waits for startup generation before delegating to the wrapped middleware", async () => {
      const root = path.resolve("/app");
      let resolveGenerate: () => void = () => undefined;
      const generatePromise = new Promise<void>((resolve) => {
        resolveGenerate = resolve;
      });

      runGenerateMock.mockImplementationOnce(async () => {
        await generatePromise;
        return undefined as never;
      });

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const innerMiddleware = vi.fn((_req, _res, next: (e?: unknown) => void) => next());
      const wrappedMiddleware = config.server?.enhanceMiddleware?.(innerMiddleware, {});
      if (!wrappedMiddleware) throw new Error("Expected enhanceMiddleware to return a middleware");

      const req = {} as never;
      const res = {} as never;
      const next = vi.fn();

      const requestDone = wrappedMiddleware(req, res, next);

      await Promise.resolve();
      expect(innerMiddleware).not.toHaveBeenCalled();

      resolveGenerate();
      await requestDone;

      expect(innerMiddleware).toHaveBeenCalledWith(req, res, next);
      expect(runGenerateMock).toHaveBeenCalledTimes(1);
    });

    test("does not re-run generation on subsequent requests after startup succeeds", async () => {
      const root = path.resolve("/app");
      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const innerMiddleware = vi.fn((_req, _res, next: (e?: unknown) => void) => next());
      const wrappedMiddleware = config.server?.enhanceMiddleware?.(innerMiddleware, {});
      if (!wrappedMiddleware) throw new Error("Expected enhanceMiddleware to return a middleware");

      const req = {} as never;
      const res = {} as never;
      const next = vi.fn();

      await wrappedMiddleware(req, res, next);
      await wrappedMiddleware(req, res, next);
      await wrappedMiddleware(req, res, next);

      expect(runGenerateMock).toHaveBeenCalledTimes(1);
    });

    test("retries failed startup generation on the next request", async () => {
      const root = path.resolve("/app");
      const firstError = new Error("generation failed");
      runGenerateMock.mockRejectedValueOnce(firstError);

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const innerMiddleware = vi.fn((_req, _res, next: (e?: unknown) => void) => next());
      const wrappedMiddleware = config.server?.enhanceMiddleware?.(innerMiddleware, {});
      if (!wrappedMiddleware) throw new Error("Expected enhanceMiddleware to return a middleware");

      const req = {} as never;
      const res = {} as never;
      const next = vi.fn();

      // First request: generation fails, next(error) is called
      await wrappedMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith(firstError);
      expect(innerMiddleware).not.toHaveBeenCalled();

      next.mockReset();

      // Second request: generation succeeds, middleware proceeds
      await wrappedMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
      expect(innerMiddleware).toHaveBeenCalledWith(req, res, next);

      expect(runGenerateMock).toHaveBeenCalledTimes(2);
    });

    test("concurrent requests during startup share one generation run", async () => {
      const root = path.resolve("/app");
      let resolveGenerate: () => void = () => undefined;
      const generatePromise = new Promise<void>((resolve) => {
        resolveGenerate = resolve;
      });

      runGenerateMock.mockImplementationOnce(async () => {
        await generatePromise;
        return undefined as never;
      });

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const innerMiddleware = vi.fn((_req, _res, next: (e?: unknown) => void) => next());
      const wrappedMiddleware = config.server?.enhanceMiddleware?.(innerMiddleware, {});
      if (!wrappedMiddleware) throw new Error("Expected enhanceMiddleware to return a middleware");

      const req = {} as never;
      const res = {} as never;
      const next = vi.fn();

      const r1 = wrappedMiddleware(req, res, next);
      const r2 = wrappedMiddleware(req, res, next);
      const r3 = wrappedMiddleware(req, res, next);

      resolveGenerate();
      await Promise.all([r1, r2, r3]);

      expect(runGenerateMock).toHaveBeenCalledTimes(1);
      expect(innerMiddleware).toHaveBeenCalledTimes(3);
    });
  });

  describe("getTransformOptions", () => {
    test("waits for startup generation before delegating to the original getTransformOptions", async () => {
      const root = path.resolve("/app");
      const transformOptions = {
        transform: { experimentalImportSupport: false, inlineRequires: true },
      };
      const getTransformOptions = vi.fn(() => transformOptions);
      let resolveGenerate: () => void = () => undefined;
      const generatePromise = new Promise<void>((resolve) => {
        resolveGenerate = resolve;
      });

      runGenerateMock.mockImplementationOnce(async () => {
        await generatePromise;
        return undefined as never;
      });

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root, transformer: { getTransformOptions } } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const wrappedGetTransformOptions = config.transformer?.getTransformOptions;
      if (!wrappedGetTransformOptions) throw new Error("Expected transformer.getTransformOptions wrapper");

      const result = wrappedGetTransformOptions("entry");

      await Promise.resolve();
      expect(getTransformOptions).not.toHaveBeenCalled();

      resolveGenerate();
      await expect(Promise.resolve(result)).resolves.toBe(transformOptions);
      expect(getTransformOptions).toHaveBeenCalledWith("entry");
    });

    test("retries failed startup generation on the next getTransformOptions call", async () => {
      const root = path.resolve("/app");
      const firstError = new Error("generation failed");
      runGenerateMock.mockRejectedValueOnce(firstError);

      const transformOptions = { transform: { experimentalImportSupport: false, inlineRequires: false } };
      const getTransformOptions = vi.fn(() => transformOptions);

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root, transformer: { getTransformOptions } } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const wrappedGetTransformOptions = config.transformer?.getTransformOptions;
      if (!wrappedGetTransformOptions) throw new Error("Expected transformer.getTransformOptions wrapper");

      await expect(wrappedGetTransformOptions("entry")).rejects.toThrow(firstError);
      expect(getTransformOptions).not.toHaveBeenCalled();

      await expect(wrappedGetTransformOptions("entry")).resolves.toBe(transformOptions);
      expect(getTransformOptions).toHaveBeenCalledWith("entry");
      expect(runGenerateMock).toHaveBeenCalledTimes(2);
    });

    test("returns undefined when there is no original getTransformOptions", async () => {
      const root = path.resolve("/app");
      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const wrappedGetTransformOptions = config.transformer?.getTransformOptions;
      if (!wrappedGetTransformOptions) throw new Error("Expected transformer.getTransformOptions wrapper");

      const result = await wrappedGetTransformOptions("entry");
      expect(result).toBeUndefined();
    });

    test("does not re-run generation on subsequent getTransformOptions calls after startup succeeds", async () => {
      const root = path.resolve("/app");
      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const wrappedGetTransformOptions = config.transformer?.getTransformOptions;
      if (!wrappedGetTransformOptions) throw new Error("Expected transformer.getTransformOptions wrapper");

      await wrappedGetTransformOptions("entry1");
      await wrappedGetTransformOptions("entry2");
      await wrappedGetTransformOptions("entry3");

      expect(runGenerateMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("config wrapping", () => {
    test("preserves existing Metro config fields", () => {
      const root = path.resolve("/app");
      const config = withOpenApiCodegen(
        {
          projectRoot: root,
          watchFolders: ["/shared"],
          resolver: { sourceExts: ["ts", "tsx"] },
        },
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      expect(config.watchFolders).toEqual(["/shared"]);
      expect(config.resolver).toEqual({ sourceExts: ["ts", "tsx"] });
    });

    test("chains existing enhanceMiddleware with the codegen wrapper", async () => {
      const root = path.resolve("/app");
      const originalEnhanced = vi.fn((_req: unknown, _res: unknown, next: (e?: unknown) => void) => next());
      const originalEnhanceMiddleware = vi.fn((_m: unknown, _s: unknown) => originalEnhanced);

      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root, server: { enhanceMiddleware: originalEnhanceMiddleware } } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      const innerMiddleware = vi.fn();
      const wrappedMiddleware = config.server?.enhanceMiddleware?.(innerMiddleware as never, {});
      if (!wrappedMiddleware) throw new Error("Expected enhanceMiddleware to return a middleware");

      await wrappedMiddleware({} as never, {} as never, vi.fn());

      expect(originalEnhanceMiddleware).toHaveBeenCalledWith(innerMiddleware, {});
      expect(originalEnhanced).toHaveBeenCalled();
      expect(innerMiddleware).not.toHaveBeenCalled();
    });

    test("accepts a Promise<MetroConfig> and resolves it before wrapping", async () => {
      const root = path.resolve("/app");
      const result = await withOpenApiCodegen(
        Promise.resolve({ projectRoot: root, watchFolders: ["/extra"] } as MetroConfig),
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      expect(result.watchFolders).toEqual(["/extra"]);
      expect(result.transformer?.getTransformOptions).toBeDefined();
    });

    test("does not mutate the input MetroConfig object", () => {
      const root = path.resolve("/app");
      const original = { projectRoot: root };

      withOpenApiCodegen(original, { input: "./openapi.yaml", output: "./src/data" }, { watchOpenApiInput: false });

      expect(original).toEqual({ projectRoot: root });
    });

    test("normalizes paths relative to the resolved root", async () => {
      const root = path.resolve("/app");
      const config: MetroConfig = withOpenApiCodegen(
        { projectRoot: root } as MetroConfig,
        { input: "./openapi.yaml", output: "./src/data" },
        { watchOpenApiInput: false },
      );

      await config.transformer?.getTransformOptions?.("entry");

      expect(runGenerateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          fileConfig: expect.objectContaining({
            input: path.join(root, "openapi.yaml"),
            output: path.join(root, "src/data"),
          }),
        }),
      );
    });
  });
});
