import { describe, expect, it } from "vitest";

import { resolveConfig } from "@/generators/core/resolveConfig";

describe("resolveConfig", () => {
  it("disables compilation by default and honors file and CLI overrides", () => {
    expect(resolveConfig({ params: {} }).compileSchemas).toBe(false);
    expect(resolveConfig({ fileConfig: { compileSchemas: true }, params: {} }).compileSchemas).toBe(true);
    expect(
      resolveConfig({ fileConfig: { compileSchemas: true }, params: { compileSchemas: false } }).compileSchemas,
    ).toBe(false);
    expect(
      resolveConfig({ fileConfig: { compileSchemas: false }, params: { compileSchemas: true } }).compileSchemas,
    ).toBe(true);
  });

  it("rejects lazySchemas without tsNamespaces", () => {
    expect(resolveConfig({ params: {} }).lazySchemas).toBe(false);
    expect(resolveConfig({ fileConfig: { lazySchemas: true }, params: {} }).lazySchemas).toBe(true);
    expect(() => resolveConfig({ fileConfig: { lazySchemas: true, tsNamespaces: false }, params: {} })).toThrow(
      "lazySchemas requires tsNamespaces",
    );
  });

  it("normalizes workspaceContext from comma-separated CLI input", () => {
    const config = resolveConfig({
      params: {
        workspaceContext: " officeId,positionId,officeId ,, ",
      },
    });

    expect(config.workspaceContext).toEqual(["officeId", "positionId"]);
  });
});
