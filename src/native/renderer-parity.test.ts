import { describe, expect, test } from "vitest";
import { OpenAPIV3 } from "openapi-types";
import fs from "node:fs/promises";
import { parse } from "yaml";

import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";

describe("renderer naming parity", () => {
  test("keeps controller names when multiple operations reduce to a reserved word", () => {
    const document: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: { title: "Controller names", version: "1" },
      paths: Object.fromEntries(
        ["PetSystemAdmin", "PetCustomAdmin"].map((controller) => [
          `/api/admin/${controller.toLowerCase()}/{id}`,
          {
            delete: {
              operationId: `${controller}Controller_delete`,
              tags: ["PetAdmin"],
              parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
              responses: { "204": { description: "Deleted" } },
            },
          },
        ]),
      ),
    };
    const options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: "output",
        modelsInCommon: true,
        restClientImportPath: "@test/app-rest-client",
        acl: false,
        mutationEffects: false,
      },
      params: {},
    });
    const expected = generateCodeFromOpenAPIDoc(document, options);
    const actual = generateFilesFromNativeOpenAPI(JSON.stringify(document), false, options);
    const query = expected.find(({ fileName }) => fileName.endsWith("queries.ts"))!;
    expect(query.content).toContain("export const usePetSystemAdminDelete =");
    expect(actual?.find(({ fileName }) => fileName === query.fileName)).toEqual(query);
  });

  test("does not merge enum metadata from excluded operations", () => {
    const document: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: { title: "Excluded enum metadata", version: "1" },
      paths: {
        "/skip": {
          get: {
            operationId: "skip",
            tags: ["Records"],
            deprecated: true,
            parameters: [{ name: "status", in: "query", schema: { type: "string", enum: ["a", "b"], default: "a" } }],
            responses: { "204": { description: "Skipped" } },
          },
        },
        "/keep": {
          get: {
            operationId: "keep",
            tags: ["Records"],
            responses: {
              "200": {
                description: "Kept",
                content: { "application/json": { schema: { $ref: "#/components/schemas/Thing" } } },
              },
            },
          },
        },
      },
      components: {
        schemas: { Thing: { type: "object", properties: { status: { type: "string", enum: ["a", "b"] } } } },
      },
    };
    const options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: "output",
        modelsInCommon: true,
        acl: false,
        restClientImportPath: "@test/app-rest-client",
      },
      params: {},
    });
    const expected = generateCodeFromOpenAPIDoc(document, options);
    const actual = generateFilesFromNativeOpenAPI(JSON.stringify(document), false, options);
    const common = expected.find(({ fileName }) => fileName.endsWith("common.models.ts"))!;
    expect(common.content).not.toContain("Default:");
    expect(actual?.find(({ fileName }) => fileName === common.fileName)).toEqual(common);
  });

  test.each([true, false])("matches the repository Petstore schema with namespaces=%s", async (tsNamespaces) => {
    const source = await fs.readFile("test/petstore.yaml", "utf8");
    const document = parse(source) as OpenAPIV3.Document;
    const options = resolveConfig({
      fileConfig: {
        input: "fixture",
        output: "output",
        tsNamespaces,
        modelsInCommon: tsNamespaces,
        acl: false,
        restClientImportPath: "@test/app-rest-client",
      },
      params: {},
    });
    const expected = generateCodeFromOpenAPIDoc(document, options);
    const actual = generateFilesFromNativeOpenAPI(source, true, options);
    expect(actual).toBeDefined();
    const sorted = (files: typeof expected) => [...files].sort((a, b) => a.fileName.localeCompare(b.fileName));
    expect(expected.length).toBeGreaterThan(0);
    expect(sorted(actual!)).toEqual(sorted(expected));
    const models = actual!
      .filter(({ fileName }) => fileName.endsWith("models.ts"))
      .map(({ content }) => content)
      .join("\n");
    expect(models).toContain('z.enum(["available", "pending", "sold"])');
    expect(models).toContain(
      'export const OrderStatusEnumSchema = z.compile(z.enum(["placed", "approved", "delivered"]))',
    );
  });

  test.each([
    ["read_items", "ReadItems"],
    ["read__items", "Read_items"],
    ["read___items", "Read_Items"],
    ["read_items_", "ReadItems_"],
    ["_read_items", "ReadItems"],
    ["read_2_items", "Read2Items"],
    ["read-items", "ReadItems"],
  ])("matches JavaScript exports for %s", (operationId, hookName) => {
    const document: OpenAPIV3.Document = {
      openapi: "3.0.3",
      info: { title: "Naming parity", version: "1" },
      paths: {
        "/records": {
          get: {
            operationId,
            tags: ["Records"],
            parameters: [{ name: "page", in: "query", schema: { type: "integer" } }],
            responses: { "200": { description: "OK" } },
          },
          post: {
            operationId: `create${operationId[0].toUpperCase()}${operationId.slice(1)}`,
            tags: ["Records"],
            responses: { "204": { description: "Created" } },
          },
        },
      },
    };
    for (const tsNamespaces of [true, false]) {
      const options = resolveConfig({
        fileConfig: {
          input: "fixture",
          output: "output",
          tsNamespaces,
          modelsInCommon: tsNamespaces,
          removeOperationPrefixEndingWith: "",
          infiniteQueries: true,
          acl: false,
          restClientImportPath: "@test/app-rest-client",
          mutationEffects: false,
        },
        params: {},
      });
      // No nativeSource: this always runs JavaScript extraction and rendering.
      const expected = generateCodeFromOpenAPIDoc(document, options);
      // Call the complete native renderer directly: missing bindings or fallback must fail.
      const actual = generateFilesFromNativeOpenAPI(JSON.stringify(document), false, options);
      expect(actual).toBeDefined();
      for (const suffix of ["api.ts", "queries.ts"]) {
        const expectedFile = expected.find(({ fileName }) => fileName.endsWith(suffix));
        expect(expectedFile).toBeDefined();
        const actualFile = actual!.find(({ fileName }) => fileName === expectedFile!.fileName);
        expect(actualFile, `${operationId}, namespaces=${tsNamespaces}, ${suffix}`).toEqual(expectedFile);
        if (suffix === "queries.ts") {
          expect(actualFile!.content).toContain(`export const use${hookName} =`);
          expect(actualFile!.content).toContain(`export const use${hookName}Infinite =`);
          expect(actualFile!.content).toContain(`export const prefetch${hookName} =`);
          expect(actualFile!.content).toContain(`export const useCreate${hookName} =`);
        }
      }
    }
  });
});
