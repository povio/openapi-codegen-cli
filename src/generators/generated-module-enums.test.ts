import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { SchemaResolver } from "./core/SchemaResolver.class";
import { getZodSchema } from "./core/zod/getZodSchema";
import { getNativeBindings } from "../native/native-bindings";
import { getTagFileName } from "./utils/generate/generate.utils";
import { GenerateType } from "./types/generate";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";

function makeDoc(namedEnum: boolean): OpenAPIV3.Document {
  const error = (domainError: boolean): OpenAPIV3.SchemaObject => ({
    type: "object",
    ...(domainError ? { "x-domain-error-domain": "business-partner" } : {}),
    required: ["status", "code", "message"],
    properties: {
      status:
        namedEnum && !domainError
          ? { $ref: "#/components/schemas/ErrorStatusEnum" }
          : { type: "string", enum: ["error"] },
      code: { type: "string", enum: ["BUSINESS_PARTNER_TYPE_REQUIRED"] },
      message: { type: "string" },
    },
  });
  return {
    openapi: "3.0.3",
    info: { title: "Module enum regression", version: "1.0.0" },
    paths: Object.fromEntries(
      ["ABBYY", "businessPartners"].map((tag) => [
        `/${tag}`,
        {
          post: {
            tags: [tag],
            operationId: "create",
            responses: {
              "400": {
                description: "Error",
                content: { "application/json": { schema: error(tag === "businessPartners") } },
              },
            },
          },
        },
      ]),
    ),
    components: {
      schemas: namedEnum
        ? {
            ErrorStatusEnum: { type: "string", enum: ["error"] },
          }
        : {},
    },
  };
}

describe("generated module enum references", () => {
  test.each([
    { modelsInModules: false, values: ["error"] },
    { modelsInModules: true, values: ["error", "success"] },
  ])("preserves enum reuse outside module singletons (%j)", ({ modelsInModules, values }) => {
    const doc = makeDoc(true);
    const schema: OpenAPIV3.SchemaObject = { type: "string", enum: values };
    doc.components!.schemas!.ErrorStatusEnum = schema;
    const options = { ...DEFAULT_GENERATE_OPTIONS, modelsInModules };
    const resolver = new SchemaResolver(doc, options);
    const code = getZodSchema({ schema, resolver, tag: "BusinessPartners" }).getCodeString("BusinessPartners", options);
    expect(code).toContain("ErrorStatusEnumSchema");
    expect(code).not.toContain("z.enum");
  });

  test.each(
    [
      { namedEnum: true, tsNamespaces: true },
      { namedEnum: false, tsNamespaces: true },
      { namedEnum: true, tsNamespaces: false },
      { namedEnum: false, tsNamespaces: false },
    ].flatMap((options) => ["typescript", "native"].map((backend) => ({ ...options, backend }))),
  )(
    "loads and validates a minified bundle ($backend, named: $namedEnum, namespaces: $tsNamespaces)",
    async ({ namedEnum, tsNamespaces, backend }) => {
      const output = await mkdtemp(join(tmpdir(), "module-enums-"));
      try {
        const doc = makeDoc(namedEnum);
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output,
          splitByTags: true,
          modelsInCommon: false,
          modelsInModules: true,
          compileSchemas: false,
          treeShakeableNamespaces: false,
          tsNamespaces,
          modelsOnly: true,
          importPath: "relative" as const,
        };
        const files =
          backend === "typescript"
            ? generateCodeFromOpenAPIDoc(doc, options)
            : Object.entries(
                (
                  getNativeBindings().compileData(JSON.stringify(doc), false, JSON.stringify(options)).data as {
                    renderedModels: Record<string, string>;
                  }
                ).renderedModels,
              ).map(([tag, content]) => ({
                fileName: join(output, getTagFileName({ tag, type: GenerateType.Models, options })),
                content,
              }));
        await symlink(join(process.cwd(), "node_modules"), join(output, "node_modules"), "dir");
        for (const file of files) {
          await mkdir(dirname(file.fileName), { recursive: true });
          await writeFile(file.fileName, file.content);
        }
        const entry = join(output, "entry.ts");
        await writeFile(
          entry,
          tsNamespaces
            ? `
        export { BusinessPartnersModels } from "./businessPartners/businessPartners.models";
        export { ABBYYModels } from "./ABBYY/aBBYY.models";
      `
            : `
        export * as BusinessPartnersModels from "./businessPartners/businessPartners.models";
        export * as ABBYYModels from "./ABBYY/aBBYY.models";
      `,
        );
        execFileSync(
          "bun",
          [
            join(process.cwd(), "node_modules/typescript/bin/tsc"),
            "--noEmit",
            "--skipLibCheck",
            "--strict",
            "--target",
            "esnext",
            "--module",
            "preserve",
            entry,
          ],
          { cwd: output, stdio: "pipe" },
        );
        const bundle = join(output, "bundle.mjs");
        execFileSync("bun", ["build", entry, "--outfile", bundle, "--target", "node", "--minify"], { stdio: "pipe" });
        const { BusinessPartnersModels, ABBYYModels } = await import(/* @vite-ignore */ pathToFileURL(bundle).href);
        const schema = BusinessPartnersModels.BusinessPartnersCreate400ErrorResponseSchema;
        const response = { status: "error", code: "BUSINESS_PARTNER_TYPE_REQUIRED", message: "Required" };
        expect(schema.parse(response)).toEqual(response);
        expect(schema.safeParse({ ...response, status: "success" }).success).toBe(false);
        expect(schema.safeParse({ ...response, code: "OTHER" }).success).toBe(false);
        expect(schema.safeParse({ status: "error" }).success).toBe(false);
        if (namedEnum) {
          expect(ABBYYModels.ErrorStatusEnumSchema.parse("error")).toBe("error");
          expect(ABBYYModels.ErrorStatusEnum).toEqual({ error: "error" });
        } else {
          expect(ABBYYModels.StatusEnumSchema.parse("error")).toBe("error");
          expect(ABBYYModels.StatusEnum).toEqual({ error: "error" });
        }
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
  );
});
