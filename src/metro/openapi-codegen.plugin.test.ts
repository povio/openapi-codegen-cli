import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import { withOpenApiCodegen } from "./openapi-codegen.plugin";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

describe("Metro openapi-codegen plugin", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
  });

  test("waits for generation before delegating to Metro transform options", async () => {
    const root = path.resolve("/app");
    const transformOptions = {
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    };
    const getTransformOptions = vi.fn((..._args: unknown[]) => transformOptions);
    let resolveGenerate: () => void = () => undefined;
    const generatePromise = new Promise<void>((resolve) => {
      resolveGenerate = resolve;
    });

    runGenerateMock.mockImplementationOnce(async () => {
      await generatePromise;
      return undefined as never;
    });

    const config = withOpenApiCodegen(
      {
        projectRoot: root,
        transformer: { getTransformOptions },
      },
      { input: "./openapi.yaml", output: "./src/data" },
      { watchOpenApiInput: false },
    );
    const wrappedGetTransformOptions = config.transformer?.getTransformOptions;
    if (!wrappedGetTransformOptions) {
      throw new Error("Expected Metro getTransformOptions wrapper");
    }

    const result = wrappedGetTransformOptions("entry");

    await Promise.resolve();
    expect(getTransformOptions).not.toHaveBeenCalled();

    resolveGenerate();
    await expect(Promise.resolve(result)).resolves.toBe(transformOptions);

    expect(getTransformOptions).toHaveBeenCalledWith("entry");
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
