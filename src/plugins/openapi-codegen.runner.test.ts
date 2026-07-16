import path from "path";

import { beforeEach, describe, expect, test, vi } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

import { createOpenApiCodegenRunner, normalizeOpenApiCodegenPaths } from "./openapi-codegen.runner";

vi.mock("@/generators/run/generate.runner", () => ({
  runGenerate: vi.fn(),
}));

const runGenerateMock = vi.mocked(runGenerate);

describe("openapi-codegen runner", () => {
  beforeEach(() => {
    runGenerateMock.mockReset();
    runGenerateMock.mockResolvedValue(undefined as never);
  });

  test("normalizes local input and output paths from the provided root", () => {
    const root = path.resolve("/app");

    expect(normalizeOpenApiCodegenPaths({ input: "./openapi.yaml", output: "./src/data" }, root)).toMatchObject({
      input: path.join(root, "openapi.yaml"),
      output: path.join(root, "src/data"),
    });
  });

  test("does not normalize remote input paths", () => {
    const root = path.resolve("/app");

    expect(
      normalizeOpenApiCodegenPaths({ input: "https://example.com/openapi.json", output: "./src/data" }, root),
    ).toMatchObject({
      input: "https://example.com/openapi.json",
      output: path.join(root, "src/data"),
    });
  });

  test("queues generation and retries after a failed run", async () => {
    const root = path.resolve("/app");
    const runner = createOpenApiCodegenRunner({ input: "./openapi.yaml", output: "./src/data" });
    const firstError = new Error("first run failed");

    runGenerateMock.mockRejectedValueOnce(firstError);

    await expect(runner.enqueueGenerate(root)).rejects.toThrow(firstError);
    await expect(runner.enqueueGenerate(root)).resolves.toBeUndefined();

    expect(runGenerateMock).toHaveBeenCalledTimes(2);
  });

  test("reports each successful generation", async () => {
    const root = path.resolve("/app");
    const onGenerated = vi.fn();
    const runner = createOpenApiCodegenRunner({ input: "./openapi.yaml", output: "./src/data" }, { onGenerated });

    await runner.enqueueGenerate(root);
    await runner.enqueueGenerate(root);

    expect(onGenerated).toHaveBeenCalledTimes(2);
  });
});
