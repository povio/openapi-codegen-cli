import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { generateFilesFromNativeOpenAPI } from "../native/generateFilesFromNativeOpenAPI";

import { DEFAULT_GENERATE_OPTIONS } from "./const/options.const";
import { generateCodeFromOpenAPIDoc } from "./generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "./types/options";

const root = process.cwd();

// Typed against the generated client: `petId` exists on some pet mutations, `username` on some user ones.
// A bare `InvalidationMap` gets the module keys and types through the generated global registration.
const invalidationMap = `
import type { InvalidationMap, MergedMutationVariables } from "@povio/openapi-codegen-cli/query";
import { QueryModule, type QueryModuleMutations } from "./data/queryModules";

export const invalidationMap: InvalidationMap = {
  [QueryModule.pet]: (data, { petId }) => [["pet", petId, data]],
  [QueryModule.user]: (_data, variables) => [["user", variables.username]],
};

export const withModule: InvalidationMap<QueryModule> = invalidationMap;
export const explicitMutations: InvalidationMap<QueryModule, QueryModuleMutations> = invalidationMap;

// Request-body fields only some mutations send are optional too.
declare const nested: MergedMutationVariables<{ data: { projectId: string } } | { id: string; data: { name: string } }>;
export const projectId: string | undefined = nested.data.projectId;

export const unknownVariable: InvalidationMap<QueryModule> = {
  // @ts-expect-error -- no pet mutation has \`nope\`
  [QueryModule.pet]: (_data, { nope }) => [[nope]],
};

export const wrongType: InvalidationMap<QueryModule> = {
  // @ts-expect-error -- \`petId\` is a number
  [QueryModule.pet]: (_data, { petId }) => [[petId?.toUpperCase()]],
};
`;

describe("generated QueryModuleMutations", () => {
  test.each(
    [true, false].flatMap((tsNamespaces) =>
      (["typescript", "native"] as const).map((backend) => ({ tsNamespaces, backend })),
    ),
  )(
    "types invalidation map callbacks ($backend, namespaces: $tsNamespaces)",
    async ({ tsNamespaces, backend }) => {
      const output = await mkdtemp(join(tmpdir(), "invalidation-map-"));
      try {
        const source = await readFile(join(root, "test/petstore.yaml"), "utf8");
        const options: GenerateOptions = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          tsNamespaces,
          importPath: "relative",
        };
        const files =
          backend === "typescript"
            ? generateCodeFromOpenAPIDoc(parse(source), options)
            : generateFilesFromNativeOpenAPI(source, true, options);
        expect(files).toBeDefined();
        for (const file of files ?? []) {
          await mkdir(dirname(file.fileName), { recursive: true });
          await writeFile(file.fileName, file.content);
        }
        await symlink(join(root, "node_modules"), join(output, "node_modules"), "dir");
        await writeFile(join(output, "invalidationMap.ts"), invalidationMap);
        await writeFile(
          join(output, "tsconfig.json"),
          JSON.stringify({
            compilerOptions: {
              strict: true,
              noEmit: true,
              skipLibCheck: true,
              target: "esnext",
              module: "preserve",
              jsx: "react-jsx",
              paths: {
                "@povio/openapi-codegen-cli": [join(root, "src/index.ts")],
                "@povio/openapi-codegen-cli/*": [join(root, "src/*.ts")],
              },
            },
            include: ["**/*.ts"],
            exclude: ["node_modules"],
          }),
        );

        const typecheck = spawnSync("bun", [join(root, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"], {
          cwd: output,
          encoding: "utf8",
        });
        expect(typecheck.status, `${typecheck.stdout}\n${typecheck.stderr}`).toBe(0);
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
