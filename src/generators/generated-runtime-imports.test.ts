import { generateFilesFromNativeOpenAPI } from "@/native/generateFilesFromNativeOpenAPI";
import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";

const packageRoot = "@povio/openapi-codegen-cli";
const runtimeSubpaths: Record<string, string> = {
  ErrorHandler: "errors",
  SharedErrorHandler: "errors",
  ApplicationException: "errors",
  DomainErrorRegistry: "errors",
  AbilityContext: "acl",
  useAclCheck: "acl",
  AuthContext: "auth",
  AuthGuard: "auth",
  useMutationEffects: "query",
  OpenApiQueryConfig: "query",
  NativeRestClient: "native",
  RestClient: "axios",
  RestInterceptor: "axios",
  useWorkspaceContext: "config",
  OpenApiWorkspaceContext: "config",
  OpenApiRouter: "config",
  ZodExtended: "zod",
};

function fixture(): OpenAPIV3.Document {
  const operation = {
    tags: ["Items"],
    parameters: [{ name: "workspaceId", in: "path", required: true, schema: { type: "string" } }],
    "x-acl": [{ action: "read", subject: "Item", conditions: { workspaceId: "$params.workspaceId" } }],
    responses: {
      "200": {
        description: "OK",
        content: { "application/json": { schema: { type: "string" } } },
      },
    },
  };
  return {
    openapi: "3.0.3",
    info: { title: "Runtime import regression", version: "1.0.0" },
    paths: {
      "/workspaces/{workspaceId}/items": {
        get: { ...operation, operationId: "getItems" },
        post: { ...operation, operationId: "createItem" },
      },
    },
  } as OpenAPIV3.Document;
}

describe("emitted runtime package imports", () => {
  it.each([
    [packageRoot, `${packageRoot}/query`],
    ["@/custom-query-types", "@/custom-query-types"],
  ])("resolves queryTypesImportPath %s without changing custom modules", (queryTypesImportPath, expected) => {
    const options = {
      ...DEFAULT_GENERATE_OPTIONS,
      queryTypesImportPath,
      modelsInCommon: true,
      tsNamespaces: true,
    };
    const nativeFiles = generateFilesFromNativeOpenAPI(JSON.stringify(fixture()), false, options);
    expect(nativeFiles).toBeDefined();
    for (const files of [generateCodeFromOpenAPIDoc(fixture(), options), nativeFiles!]) {
      const query = files.find((file) => file.fileName.endsWith("items.queries.ts"));
      expect(query?.content).toContain(`from "${expected}";`);
      expect(query?.content).not.toContain(`from "${packageRoot}";`);
    }
  });

  for (const inlineEndpoints of [false, true]) {
    for (const standalone of [false, true]) {
      it(`uses dedicated subpaths (inlineEndpoints=${inlineEndpoints}, standalone=${standalone})`, () => {
        const files = generateCodeFromOpenAPIDoc(fixture(), {
          ...DEFAULT_GENERATE_OPTIONS,
          output: "runtime-import-test",
          inlineEndpoints,
          standalone,
          mutationEffects: true,
          mutationDefaultOnError: true,
          acl: true,
          checkAcl: true,
          workspaceContext: ["workspaceId"],
        });
        const violations: string[] = [];
        const runtimeBindings = new Set<string>();
        for (const file of files) {
          // Generated imports are top-level declarations terminated by semicolons.
          for (const match of file.content.matchAll(/^import\s+(?:(.*?)\s+from\s+)?["']([^"']+)["'];/gms)) {
            const [, clause, from] = match;
            if (from !== packageRoot && !from.startsWith(`${packageRoot}/`)) continue;
            if (clause?.trimStart().startsWith("type ")) continue;
            const named = clause?.match(/\{([^}]+)\}/s)?.[1];
            const bindings = named
              ? named
                  .split(",")
                  .map((binding) => binding.trim())
                  .filter((binding) => binding && !binding.startsWith("type "))
                  .map((binding) => binding.split(/\s+as\s+/)[0])
              : [clause ? "<default or namespace>" : "<side effect>"];
            for (const binding of bindings) {
              runtimeBindings.add(binding);
              const expected = runtimeSubpaths[binding];
              if (from === packageRoot || (expected && from !== `${packageRoot}/${expected}`)) {
                violations.push(
                  `${file.fileName}: ${binding} from ${from}; expected /${expected ?? "<dedicated subpath>"}`,
                );
              }
            }
          }
        }
        // Prove the fixture activates the transport, mutation, ACL and workspace paths.
        expect([...runtimeBindings]).toEqual(
          expect.arrayContaining([
            "RestClient",
            "useMutationEffects",
            "OpenApiQueryConfig",
            "useAclCheck",
            "useWorkspaceContext",
          ]),
        );
        expect(violations).toEqual([]);
      });
    }
  }
});
