import { parse, stringify } from "yaml";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { parityScenarios, optionCases, lifecycleOptions } from "../../scripts/renderer-parity-configs";
import { parityFixtures, readParityFixture, renderParityCase } from "../../scripts/renderer-parity-cases";
import { getNativeBindings } from "./native-bindings";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("configuration coverage inventory", () => {
  test("covers every layout combination without duplicate cases", () => {
    const layouts = parityScenarios.filter((s) => s.name.startsWith("layout-"));
    expect(layouts).toHaveLength(64);
    expect(layouts.filter((s) => s.invalid)).toHaveLength(16);
    expect(new Set(parityScenarios.map((s) => s.name)).size).toBe(parityScenarios.length);
    expect(Object.keys(optionCases).length).toBeGreaterThan(40);
    expect(lifecycleOptions).toEqual(["input", "output", "clearOutput", "incremental"]);
  });
});

for (const fixture of parityFixtures) {
  const source = readParityFixture(fixture);
  describe(`all renderer configurations: ${fixture.name}`, () => {
    test.each(parityScenarios)("$name", (scenario) => {
      vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
      const binding = vi.spyOn(getNativeBindings(), "compileData");
      const expected = renderParityCase(source, scenario, "js");
      expect(binding).not.toHaveBeenCalled();
      const actual = renderParityCase(source, scenario, "native");
      if (scenario.invalid) {
        expect(actual.route).toBe("rejected");
        expect(binding).not.toHaveBeenCalled();
      } else {
        expect(binding).toHaveBeenCalled();
      }
      const contents = (files: typeof actual.files) => Object.fromEntries(files.map((f) => [f.fileName, f.content]));
      expect(contents(actual.files)).toEqual(contents(expected.files));
    });
  });
}

test("canonical layouts retain full native rendering and local namespaces use native hybrid", () => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const source = readParityFixture(parityFixtures[0]);
  for (const [tsNamespaces, modelsInCommon] of [
    [true, true],
    [false, false],
  ]) {
    expect(renderParityCase(source, { name: "full", options: { tsNamespaces, modelsInCommon } }, "native").route).toBe(
      "full-native",
    );
  }
  expect(
    renderParityCase(source, { name: "hybrid", options: { tsNamespaces: true, modelsInCommon: false } }, "native")
      .route,
  ).toBe("hybrid-native");
});

test("mutation scope include/exclude examples exercise the selected path mutation", () => {
  const source = readFileSync("test/configuration.yaml", "utf8");
  for (const renderer of ["js", "native"] as const) {
    vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
    const query = (mutationScope: { include: string[] } | { exclude: string[] }) =>
      renderParityCase(
        source,
        { name: "scope", options: { modelsInCommon: true, mutationScope } },
        renderer,
      ).files.find((f) => f.fileName.endsWith("items.queries.ts"))!.content;
    expect(query({ include: ["Items/update"] })).toContain("export const useUpdate = ({ officeId, id }");
    expect(query({ exclude: ["Items/update"] })).toContain("export const useUpdate = (options?");
  }
});

test("described response schema uses its owning model namespace", () => {
  const source = readFileSync("test/configuration.yaml", "utf8");
  for (const renderer of ["js", "native"] as const) {
    vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
    const api = renderParityCase(
      source,
      { name: "description-owner", options: { modelsInCommon: false, withDescription: true } },
      renderer,
    ).files.find((f) => f.fileName.endsWith("items.api.ts"))!.content;
    expect(api).toContain("ItemsModels.ItemSchema.describe(");
    expect(api).not.toContain("CommonModels.ItemSchema.describe(");
  }
});

test("model owner resolution preserves model-like text inside endpoint URLs", () => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const source = readFileSync("test/petstore.yaml", "utf8").replace(
    "/activity/email:",
    "/EmailAdminModels.BaseLogLevelEnumSchema:",
  );
  expect(source).toContain("/EmailAdminModels.BaseLogLevelEnumSchema:");
  const scenario = { name: "literal-owner", options: { modelsInCommon: false } };
  const expected = renderParityCase(source, scenario, "js");
  const actual = renderParityCase(source, scenario, "native");
  const api = (files: typeof actual.files) => files.find((f) => f.fileName.endsWith("emailAdmin.api.ts"))!.content;
  expect(api(expected.files)).toContain("/EmailAdminModels.BaseLogLevelEnumSchema");
  expect(api(actual.files)).toBe(api(expected.files));
});

test("model owner resolution preserves model-like text inside validation regexes", () => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const document = parse(readFileSync("test/petstore.yaml", "utf8"));
  document.paths["/activity/email"].get.parameters = [
    { name: "filter", in: "query", schema: { type: "string", pattern: "EmailAdminModels.BaseLogLevelEnumSchema" } },
  ];
  const source = stringify(document);
  const scenario = { name: "regex-owner", options: { modelsInCommon: false } };
  const expected = renderParityCase(source, scenario, "js");
  const actual = renderParityCase(source, scenario, "native");
  const api = (files: typeof actual.files) => files.find((f) => f.fileName.endsWith("emailAdmin.api.ts"))!.content;
  expect(api(expected.files)).toContain(".regex(/EmailAdminModels.BaseLogLevelEnumSchema/)");
  expect(api(actual.files)).toBe(api(expected.files));
});

test.each([false, true])("Petstore empty shared model scenario is active with modelsOnly=%s", (modelsOnly) => {
  const source = readParityFixture(parityFixtures.find((fixture) => fixture.name === "petstore-health")!);
  const scenario = parityScenarios.find((entry) => entry.name === `layout-${modelsOnly ? "010111" : "000111"}`)!;
  expect(scenario).toBeDefined();
  for (const renderer of ["js", "native"] as const) {
    vi.stubEnv("OPENAPI_CODEGEN_NATIVE", renderer === "native" ? "1" : "0");
    const result = renderParityCase(source, scenario, renderer);
    expect(result.route).toBe(renderer === "native" ? "full-native" : "js");
    expect(result.files.some((file) => file.fileName.endsWith("common.models.ts"))).toBe(false);
    if (modelsOnly) {
      expect(result.files.every((file) => file.fileName.endsWith(".models.ts"))).toBe(true);
    } else {
      expect(result.files.find((file) => file.fileName.endsWith("health.api.ts"))?.content).toContain("/health");
    }
  }
});
