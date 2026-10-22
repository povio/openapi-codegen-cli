import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { OpenAPIV3 } from "openapi-types";
import { afterEach, describe, expect, test, vi } from "vitest";

import sharedEnumMutationScope from "./fixtures/shared-enum-mutation-scope.json";

import { renderParityCase } from "../../scripts/renderer-parity-cases";
import { getNativeBindings } from "../native/native-bindings";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { getDataFromOpenAPIDoc } from "./core/getDataFromOpenAPIDoc";
import { mapEndpointParamsToFunctionParams } from "./utils/generate/generate.endpoints.utils";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";

function fixture(): OpenAPIV3.Document {
  return {
    openapi: "3.0.3",
    info: { title: "Parameter namespaces", version: "1.0.0" },
    paths: {
      "/positions/{id}": {
        get: {
          tags: ["positionTracking"],
          operationId: "getPosition",
          parameters: [
            { name: "id", in: "path", required: true, schema: { $ref: "#/components/schemas/PositionId" } },
            { name: "filter", in: "query", schema: { $ref: "#/components/schemas/PositionFilter" } },
          ],
          responses: { "200": { description: "OK", content: { "application/json": { schema: { type: "string" } } } } },
        },
        post: {
          tags: ["positionTracking"],
          operationId: "updatePosition",
          parameters: [{ name: "id", in: "path", required: true, schema: { $ref: "#/components/schemas/PositionId" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/PositionInput" } } },
          },
          responses: { "204": { description: "Updated" } },
        },
      },
    },
    components: {
      schemas: {
        PositionId: { type: "string", enum: ["primary", "secondary"] },
        PositionFilter: { type: "object", properties: { active: { type: "boolean" } } },
        PositionInput: { type: "object", required: ["name"], properties: { name: { type: "string" } } },
      },
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("generated parameter namespaces", () => {
  test.each(
    [
      { inlineEndpoints: false, modelsInCommon: false, modelsInModules: false },
      { inlineEndpoints: true, modelsInCommon: false, modelsInModules: false },
      { inlineEndpoints: false, modelsInCommon: true, modelsInModules: false },
      { inlineEndpoints: true, modelsInCommon: true, modelsInModules: false },
      { inlineEndpoints: false, modelsInCommon: false, modelsInModules: true },
      { inlineEndpoints: true, modelsInCommon: false, modelsInModules: true },
    ].flatMap((layout) => (["js", "native"] as const).map((renderer) => ({ ...layout, renderer }))),
  )(
    "typechecks shared enum mutation scopes (inlineEndpoints=$inlineEndpoints, modelsInCommon=$modelsInCommon, modelsInModules=$modelsInModules, renderer=$renderer)",
    async ({ inlineEndpoints, modelsInCommon, modelsInModules, renderer }) => {
      const output = await mkdtemp(join(tmpdir(), "parameter-namespaces-"));
      try {
        vi.stubEnv("OPENAPI_CODEGEN_NATIVE", "1");
        const compileData = renderer === "native" ? vi.spyOn(getNativeBindings(), "compileData") : undefined;
        const generated = renderParityCase(
          JSON.stringify(sharedEnumMutationScope),
          {
            name: "shared-enum-scope",
            options: {
              output,
              splitByTags: true,
              modelsInCommon,
              modelsInModules,
              treeShakeableNamespaces: false,
              compileSchemas: false,
              restClient: "native",
              restClientImportPath: "",
              tsNamespaces: true,
              mutationScope: true,
              inlineEndpoints,
              importPath: "relative",
              acl: false,
              checkAcl: false,
              mutationEffects: false,
            },
          },
          renderer,
        );
        const files = generated.files;
        if (renderer === "native") {
          expect(compileData).toHaveBeenCalled();
          expect(["full-native", "hybrid-native"]).toContain(generated.route);
        } else {
          expect(generated.route).toBe("js");
        }
        const queries = files.filter((file) => file.fileName.endsWith(".queries.ts"));
        expect(queries).toHaveLength(2);
        for (const query of queries) {
          const namespace =
            modelsInCommon || modelsInModules
              ? query.fileName.includes("/positionTracking/")
                ? "PositionTrackingModels"
                : "OtherModels"
              : "CommonModels";
          expect(query.content).toContain(`{ provider }: { provider: ${namespace}.Provider }`);
          expect(query.content).toContain(`import { ${namespace} } from`);
          expect(query.content).toMatch(/scope: \{ id: `cancel(?:ProviderTracking)?:\$\{provider\}` \}/);
        }
        await typecheckGeneratedFiles(output, files);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    30_000,
  );
  test("resolves model ownership when modelNamespaceTag is omitted", () => {
    const { resolver, data } = getDataFromOpenAPIDoc(fixture(), {
      ...DEFAULT_GENERATE_OPTIONS,
      splitByTags: true,
      modelsInCommon: false,
      tsNamespaces: true,
    });
    const endpoint = data.get("positionTracking")!.endpoints.find((entry) => entry.operationName === "getPosition")!;
    expect(mapEndpointParamsToFunctionParams(resolver, endpoint).map(({ name, type }) => ({ name, type }))).toEqual([
      { name: "id", type: "PositionTrackingModels.PositionId" },
      { name: "filter", type: "PositionTrackingModels.PositionFilter" },
    ]);
  });
  test.each([false, true])(
    "typechecks module parameters (inlineEndpoints=%s)",
    async (inlineEndpoints) => {
      const output = await mkdtemp(join(tmpdir(), "parameter-namespaces-"));
      try {
        const files = generateCodeFromOpenAPIDoc(fixture(), {
          ...DEFAULT_GENERATE_OPTIONS,
          output,
          splitByTags: true,
          modelsInCommon: false,
          tsNamespaces: true,
          inlineEndpoints,
          importPath: "relative",
          acl: false,
          checkAcl: false,
          mutationEffects: false,
        });
        const queries = files.find((file) => file.fileName.endsWith("/positionTracking/positionTracking.queries.ts"));
        expect(queries).toBeDefined();
        for (const type of ["PositionId", "PositionFilter", "PositionInput"]) {
          expect(queries!.content).toContain(`PositionTrackingModels.${type}`);
        }
        expect(queries!.content).not.toContain("CommonModels.");
        await typecheckGeneratedFiles(output, files);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    30_000,
  );
});

async function typecheckGeneratedFiles(output: string, files: ReturnType<typeof generateCodeFromOpenAPIDoc>) {
  await symlink(join(process.cwd(), "node_modules"), join(output, "node_modules"), "dir");
  for (const file of files) {
    await mkdir(dirname(file.fileName), { recursive: true });
    await writeFile(file.fileName, file.content);
  }
  await writeFile(
    join(output, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        target: "ESNext",
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        experimentalDecorators: true,
        paths: {
          "@povio/openapi-codegen-cli/*": [join(process.cwd(), "src/*")],
          "@/*": [join(process.cwd(), "src/*")],
        },
      },
      include: ["**/*.ts", "**/*.tsx"],
    }),
  );
  let diagnostics = "";
  try {
    execFileSync(join(process.cwd(), "node_modules/.bin/tsc"), ["-p", join(output, "tsconfig.json")], {
      encoding: "utf8",
    });
  } catch (error) {
    diagnostics = String((error as { stdout?: string }).stdout || error);
  }
  expect(diagnostics).toBe("");
}
