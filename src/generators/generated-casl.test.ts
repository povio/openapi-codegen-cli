import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { OpenAPIV3 } from "openapi-types";
import { describe, expect, it } from "vitest";

import { compileNativeData } from "../native/native-bindings";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";

function fixture(withAcl: boolean): OpenAPIV3.Document {
  return {
    openapi: "3.0.3",
    info: { title: "CASL 7", version: "1" },
    paths: {
      "/items/{workspaceId}": {
        get: {
          tags: ["items"],
          operationId: "readItem",
          parameters: [{ name: "workspaceId", in: "path", required: true, schema: { type: "string" } }],
          ...(withAcl
            ? { "x-acl": [{ action: "read", subject: "Item", conditions: { workspaceId: "$params.workspaceId" } }] }
            : {}),
          responses: { "204": { description: "OK" } },
        },
      },
    },
  } as OpenAPIV3.Document;
}

describe("generated CASL 7 ACL", () => {
  it.each([false, true])(
    "compiles and executes generated ACL (withAcl=%s)",
    async (withAcl) => {
      const output = await mkdtemp(join(process.cwd(), ".casl-generated-"));
      try {
        const document = fixture(withAcl);
        const source = JSON.stringify(document);
        const nativeSource = process.env.OPENAPI_CODEGEN_NATIVE === "1" ? { source, yaml: false } : undefined;
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output,
          acl: true,
          checkAcl: false,
          tsNamespaces: false,
          importPath: "relative" as const,
        };
        const files = generateCodeFromOpenAPIDoc(document, options, undefined, nativeSource).filter((file) =>
          /app\.ability\.ts$|\.acl\.ts$/.test(file.fileName),
        );
        const appAbility = files.find((file) => file.fileName.endsWith("app.ability.ts"));
        expect(appAbility).toBeDefined();
        expect(appAbility!.content).not.toContain("PureAbility");
        if (nativeSource && withAcl) {
          const native = compileNativeData(source, false, JSON.stringify(options)).data as {
            renderedShared: Record<string, string>;
          };
          expect(native.renderedShared.appAcl).toContain("AppAbility = Ability<");
          expect(appAbility!.content).toBe(native.renderedShared.appAcl);
        }
        const domainAcl = files.find((file) => file.fileName.endsWith(".acl.ts"));
        expect(Boolean(domainAcl)).toBe(withAcl);
        for (const file of files) {
          await mkdir(dirname(file.fileName), { recursive: true });
          await writeFile(file.fileName, file.content);
        }
        await writeFile(
          join(output, "consumer.ts"),
          `
import { strict as assert } from "node:assert";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { packRules, unpackRules } from "@casl/ability/extra";
import type { AppAbility } from "./acl/app.ability";
${withAcl ? 'import { canUseReadItem } from "./items/items.acl";' : ""}
const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
builder.can("read", "Item", { workspaceId: "mine" });
const ability = builder.build();
ability.update(unpackRules(packRules(ability.rules)));
assert.equal(ability.can("read", "Item"), true);
${withAcl ? "" : 'assert.equal(ability.can("delete", "Item"), false);'}
${
  withAcl
    ? `
assert.equal(ability.can(...canUseReadItem({ workspaceId: "mine" })), true);
assert.equal(ability.can(...canUseReadItem({ workspaceId: "other" })), false);
// @ts-expect-error Generated abilities restrict actions.
const invalid: Parameters<AppAbility["can"]>[0] = "delete";
void invalid;
`
    : ""
}
`,
        );
        await writeFile(
          join(output, "tsconfig.json"),
          JSON.stringify({
            compilerOptions: {
              strict: true,
              noEmit: true,
              target: "ESNext",
              module: "ESNext",
              moduleResolution: "bundler",
              skipLibCheck: true,
              types: ["node"],
            },
            include: ["**/*.ts"],
          }),
        );
        execFileSync("bun", ["run", "tsc", "-p", join(output, "tsconfig.json")], {
          encoding: "utf8",
          stdio: "inherit",
        });
        execFileSync("bun", ["run", join(output, "consumer.ts")], { encoding: "utf8", stdio: "inherit" });
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    30_000,
  );
});
