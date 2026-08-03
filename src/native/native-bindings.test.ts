import { describe, expect, test } from "vitest";
import fs from "node:fs/promises";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getDataFromOpenAPIDoc } from "@/generators/core/getDataFromOpenAPIDoc";
import { resolveConfig } from "@/generators/core/resolveConfig";
import { getZodSchemasFromOpenAPIDoc } from "@/generators/core/zod/getZodSchemasFromOpenAPIDoc";
import { generateModels } from "@/generators/generate/generateModels";
import { generateEndpoints } from "@/generators/generate/generateEndpoints";
import { generateQueries } from "@/generators/generate/generateQueries";
import { generateAcl, generateAppAcl } from "@/generators/generate/generateAcl";
import { generateDomainErrors } from "@/generators/generate/generateDomainErrors";
import { generateQueryModules } from "@/generators/generate/generateQueryModules";

import { getNativeBindings, shouldUseNativeCodegen } from "./native-bindings";

describe("native OpenAPI bindings", () => {
  test("loads in Bun/Node and parses JSON", () => {
    const native = getNativeBindings();
    const result = native.parseOpenapi('{"openapi":"3.0.3","paths":{}}', false);

    expect(native.nativeVersion()).toBe("0.1.0");
    expect(JSON.parse(result.documentJson)).toEqual({ openapi: "3.0.3", paths: {} });
    expect(result.parseMicros).toBeGreaterThanOrEqual(0);
  });

  test("auto-selects a loadable native addon and supports an explicit TypeScript fallback", () => {
    const previous = process.env.OPENAPI_CODEGEN_NATIVE;
    delete process.env.OPENAPI_CODEGEN_NATIVE;
    expect(shouldUseNativeCodegen()).toBe(true);
    process.env.OPENAPI_CODEGEN_NATIVE = "0";
    expect(shouldUseNativeCodegen()).toBe(false);
    if (previous === undefined) delete process.env.OPENAPI_CODEGEN_NATIVE;
    else process.env.OPENAPI_CODEGEN_NATIVE = previous;
  });

  test("parses YAML", () => {
    const result = getNativeBindings().parseOpenapi("openapi: 3.0.3\npaths: {}\n", true);
    expect(JSON.parse(result.documentJson)).toEqual({ openapi: "3.0.3", paths: {} });
  });

  test("matches TypeScript operation names and component ownership", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({ fileConfig: { input: "fixture", output: "output" }, params: {} });
    const resolver = new SchemaResolver(document, options);
    const nativeResult = getNativeBindings().analyzeGeneration(source, false, JSON.stringify(options));
    const nativeNames = JSON.parse(nativeResult.operationNamesJson) as string[];
    const nativeTags = JSON.parse(nativeResult.schemaTagsJson) as Record<string, string[]>;

    expect(nativeNames).toEqual(resolver.getOperationContexts().map(({ operationName }) => operationName));
    for (const name of Object.keys(document.components.schemas)) {
      const tags = nativeTags[`#/components/schemas/${name}`] ?? [];
      const nativeTag = tags.length === 1 ? tags[0] : options.defaultTag;
      expect(nativeTag, name).toBe(resolver.getTagByZodSchemaName(`${name}${options.schemaSuffix}`));
    }
  });

  test.each([true, false])("matches all TypeScript component schemas with extractEnums=%s", async (extractEnums) => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({
      fileConfig: { input: "fixture", output: "output", excludeRedundantZodSchemas: false, extractEnums },
      params: {},
    });
    const schemas = getZodSchemasFromOpenAPIDoc(new SchemaResolver(document, options));
    const expected = { ...schemas.zodSchemas, ...schemas.enumZodSchemas };
    const result = getNativeBindings().compileSchemas(source, false, JSON.stringify(options));

    expect(JSON.parse(result.schemasJson)).toEqual(expected);
  });

  test("matches the complete TypeScript endpoint and schema data", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({ fileConfig: { input: "fixture", output: "output" }, params: {} });
    const expected = getDataFromOpenAPIDoc(document, options);
    const expectedEndpoints = [...expected.data.values()].flatMap(({ endpoints }) => endpoints);
    const expectedSchemas = Object.assign({}, ...[...expected.data.values()].map(({ zodSchemas }) => zodSchemas));
    const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
    const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
      endpoints: unknown[];
      schemas: Record<string, string>;
    };

    expect(actual.endpoints).toEqual(expectedEndpoints);
    expect(actual.schemas).toEqual(expectedSchemas);
  });

  test("matches TypeScript models-in-common proxy rendering", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({
      fileConfig: { input: "fixture", output: "output", modelsInCommon: true },
      params: {},
    });
    const expected = getDataFromOpenAPIDoc(document, options);
    const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
    const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
      renderedModels: Record<string, string>;
    };

    for (const tag of expected.data.keys()) {
      const expectedContent = generateModels({ resolver: expected.resolver, data: expected.data, tag });
      expect(actual.renderedModels[tag], tag).toBe(expectedContent);
    }
  });

  test("matches TypeScript models-in-common endpoint rendering", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: "output",
        modelsInCommon: true,
        restClientImportPath: "@test/app-rest-client",
      },
      params: {},
    });
    const expected = getDataFromOpenAPIDoc(document, options);
    const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
    const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
      renderedEndpoints: Record<string, string>;
    };

    for (const tag of expected.data.keys()) {
      expect(actual.renderedEndpoints[tag], tag).toBe(
        generateEndpoints({ resolver: expected.resolver, data: expected.data, tag }),
      );
    }
  });

  test.each([false, true, { exclude: ["Currencies/updateCurrency"] }])(
    "matches TypeScript query module rendering with mutationScope=%s",
    async (mutationScope) => {
      const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
      const document = JSON.parse(source);
      const options = resolveConfig({
        fileConfig: {
          input: "fixture",
          output: "output",
          modelsInCommon: true,
          restClientImportPath: "@test/app-rest-client",
          workspaceContext: [],
          mutationScope,
        },
        params: {},
      });
      const expected = getDataFromOpenAPIDoc(document, options);
      const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
      const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
        renderedQueries: Record<string, string>;
      };

      for (const [tag, content] of Object.entries(actual.renderedQueries)) {
        expect(content, tag).toBe(generateQueries({ resolver: expected.resolver, data: expected.data, tag }));
      }
      expect(Object.keys(actual.renderedQueries).length).toBeGreaterThan(0);
    },
  );

  test("matches TypeScript ACL module rendering", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({
      fileConfig: { input: "fixture", output: "output", modelsInCommon: true, workspaceContext: [] },
      params: {},
    });
    const expected = getDataFromOpenAPIDoc(document, options);
    const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
    const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
      renderedAcl: Record<string, string>;
    };
    for (const [tag, content] of Object.entries(actual.renderedAcl)) {
      expect(content, tag).toBe(generateAcl({ resolver: expected.resolver, data: expected.data, tag }));
    }
    expect(Object.keys(actual.renderedAcl).length).toBeGreaterThan(0);
  });

  test("matches TypeScript shared-file rendering", async () => {
    const source = await fs.readFile("test/benchmarks/openapi.localhost4000.json", "utf8");
    const document = JSON.parse(source);
    const options = resolveConfig({
      fileConfig: { input: "fixture", output: "output", modelsInCommon: true, workspaceContext: [] },
      params: {},
    });
    const expected = getDataFromOpenAPIDoc(document, options);
    const result = getNativeBindings().compileData(source, false, JSON.stringify(options));
    const actual = JSON.parse(Buffer.from(result.dataJson).toString("utf8")) as {
      renderedShared: Record<string, string>;
    };

    expect(actual.renderedShared.queryModules).toBe(
      generateQueryModules({ resolver: expected.resolver, data: expected.data }),
    );
    expect(actual.renderedShared.domainErrors).toBe(
      generateDomainErrors({ resolver: expected.resolver, data: expected.data }),
    );
    expect(actual.renderedShared.appAcl).toBe(generateAppAcl({ resolver: expected.resolver, data: expected.data }));
  });
});
