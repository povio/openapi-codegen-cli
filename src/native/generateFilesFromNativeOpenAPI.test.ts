import { describe, expect, it } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";

import { supportsCompleteNativeRender } from "./generateFilesFromNativeOpenAPI";

describe("supportsCompleteNativeRender", () => {
  const supportedOptions = {
    ...DEFAULT_GENERATE_OPTIONS,
    modelsInCommon: true,
    tsNamespaces: true,
  };

  it("supports the namespace-based common-model renderer", () => {
    expect(supportsCompleteNativeRender(supportedOptions)).toBe(true);
  });

  it("supports namespace-free module-local models", () => {
    expect(supportsCompleteNativeRender({ ...supportedOptions, modelsInCommon: false, tsNamespaces: false })).toBe(
      true,
    );
  });

  it.each([
    ["module-local models with namespaces", { modelsInCommon: false }],
    ["namespace-free common models", { tsNamespaces: false }],
    ["unsplit output", { splitByTags: false }],
    ["inline endpoints", { inlineEndpoints: true }],
    ["builder configs", { builderConfigs: true }],
    ["workspace context", { workspaceContext: ["officeId"] }],
  ])("does not claim full native support for %s", (_name, override) => {
    expect(supportsCompleteNativeRender({ ...supportedOptions, ...override })).toBe(false);
  });
});
