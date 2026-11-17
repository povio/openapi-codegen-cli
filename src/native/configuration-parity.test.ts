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
    expect(layouts).toHaveLength(128);
    expect(layouts.filter((s) => s.invalid)).toHaveLength(56);
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

test("every namespace and model layout renders fully native", () => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const source = readParityFixture(parityFixtures[0]);
  for (const tsNamespaces of [true, false]) {
    for (const modelsInCommon of [true, false]) {
      expect(
        renderParityCase(source, { name: "full", options: { tsNamespaces, modelsInCommon } }, "native").route,
      ).toBe("full-native");
    }
  }
});

// Unsplit output renders the natively extracted data with the TypeScript generators, whose
// resolver calls (circular explicit types, recursive tuples, ...) the native resolver must support.
test.each([false, true])("unsplit regressions render through the hybrid route (allReadonly=%s)", (allReadonly) => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const source = readParityFixture(parityFixtures.find((fixture) => fixture.name === "renderer-regressions")!);
  for (const lazySchemas of [false, true]) {
    const scenario = { name: "unsplit", options: { splitByTags: false, tsNamespaces: true, lazySchemas, allReadonly } };
    const expected = renderParityCase(source, scenario, "js");
    const actual = renderParityCase(source, scenario, "native");
    expect(actual.route).toBe("hybrid-native");
    const contents = (files: typeof actual.files) => Object.fromEntries(files.map((f) => [f.fileName, f.content]));
    expect(contents(actual.files)).toEqual(contents(expected.files));
    expect(contents(actual.files)["generated/common/common.models.ts"]).toContain("LiteralTreeDtoSchema");
  }
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
  const scenario = parityScenarios.find((entry) => entry.name === `layout-${modelsOnly ? "0010111" : "0000111"}`)!;
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

// A string property with a stray `items` object must not pull the unreferenced `AuditQueryDto.order`
// enum (same values as the stray item's inline enum) into the Payments models. A component enum
// sharing an extracted enum's name keeps that enum's tag and is still emitted where it is used.
// (The collision is added here rather than to the fixture: with eager `modelsInModules` both
// renderers emit the pulled-in enum after its use, which the fixture's typecheck rejects.)
test.each([
  { name: "default", options: {} },
  {
    name: "modules",
    options: { modelsInModules: true, tsNamespaces: true, lazySchemas: true, replaceOptionalWithNullish: true },
  },
])("stray items and colliding enum names render identically ($name)", (scenario) => {
  const document = parse(readParityFixture(parityFixtures.find((fixture) => fixture.name === "renderer-regressions")!));
  // The unreferenced `BatchDto.incoterms` inline enum is extracted under the component enum's name.
  document.paths["/routes"] = {
    get: {
      operationId: "RoutesController_get",
      tags: ["Routes"],
      responses: {
        "200": {
          description: "Route point",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoutePointDto" } } },
        },
      },
    },
  };
  Object.assign(document.components.schemas, {
    IncotermsEnum: { type: "string", enum: ["EXW", "DDP"] },
    RoutePointDto: {
      type: "object",
      properties: { incoterm: { nullable: true, allOf: [{ $ref: "#/components/schemas/IncotermsEnum" }] } },
    },
    BatchDto: { type: "object", properties: { incoterms: { type: "string", enum: ["DDP"] } } },
  });
  const source = stringify(document);
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
  const expected = renderParityCase(source, scenario, "js");
  const actual = renderParityCase(source, scenario, "native");
  expect(actual.route).toBe("full-native");
  const file = (files: typeof actual.files, suffix: string) => files.find((f) => f.fileName.endsWith(suffix))!.content;
  for (const files of [expected.files, actual.files]) {
    const payments = file(files, "payments.models.ts");
    expect(payments).not.toContain("OrderEnum");
    expect(payments).not.toContain("CommonModels");
    expect(payments).toContain("multipleOf(0.000001)");
    expect(payments).toContain("gt(1e-7)");
    const routes = file(files, "routes.models.ts");
    expect(routes).toContain(
      scenario.name === "modules" ? "IncotermsEnumSchema()" : "CommonModels.IncotermsEnumSchema",
    );
  }
  const contents = (files: typeof actual.files) => Object.fromEntries(files.map((f) => [f.fileName, f.content]));
  expect(contents(actual.files)).toEqual(contents(expected.files));
});
