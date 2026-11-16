import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";

import { generateFilesFromNativeOpenAPI } from "./generateFilesFromNativeOpenAPI";

const root = process.cwd();

// Uses the `/exports/...` operations of test/renderer-regressions.yaml (namespaced output).
const check = `
import { ExportsApi } from "./data/exports/exports.api";
import { ExportsQueries } from "./data/exports/exports.queries";
const { note, search, rename } = ExportsApi;
const { useNote, useSearch } = ExportsQueries;

// An optional request body (\`required: false\` or omitted) may be left out.
export const withoutBody = () => note("id", 1);
export const withBody = () => note("id", 1, { text: null, tags: ["a", null] }, "label");
export const undefinedBody = () => note("id", 1, undefined);
export const searchWithoutBody = () => search(1);
// A required body is still required.
// @ts-expect-error -- \`data\` is required
export const missingBody = () => rename("id", undefined, "label", 1, "queued");
export const requiredBody = () => rename("id", "message", "label", 1, "queued");
// An inlined integer \`$ref\` parameter is a number.
// @ts-expect-error -- \`copies\` is a number
export const stringCount = () => note("id", "1");

export const useHooks = () => {
  const mutation = useNote();
  mutation.mutate({ exportId: "id", copies: 1 });
  mutation.mutate({ exportId: "id", copies: 1, data: { text: "t" } });
  useSearch().mutate({ limit: 1 });
};
`;

async function typecheck(output: string, files: { fileName: string; content: string }[]) {
  for (const file of files) {
    await mkdir(dirname(file.fileName), { recursive: true });
    await writeFile(file.fileName, file.content);
  }
  await writeFile(join(output, "check.ts"), check);
  await symlink(join(root, "node_modules"), join(output, "node_modules"), "dir");
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
  return spawnSync(join(root, "node_modules/.bin/tsrs"), ["-p", "tsconfig.json"], { cwd: output, encoding: "utf8" });
}

describe("endpoints of test/renderer-regressions.yaml", () => {
  test.each([true, false])(
    "render optional bodies and inlined $ref parameters identically and typecheck (namespaces=%s)",
    async (tsNamespaces) => {
      const output = await mkdtemp(join(tmpdir(), "endpoint-parity-"));
      try {
        const source = await readFile(join(root, "test/renderer-regressions.yaml"), "utf8");
        const options = {
          ...DEFAULT_GENERATE_OPTIONS,
          output: join(output, "data"),
          tsNamespaces,
          generateJsDoc: true,
          importPath: "relative" as const,
        };
        const expected = generateCodeFromOpenAPIDoc(parse(source), options);
        const actual = generateFilesFromNativeOpenAPI(source, true, options);
        expect(actual).toEqual(expected);

        const content = (suffix: string) => expected.find(({ fileName }) => fileName.endsWith(suffix))!.content;
        const api = content("exports/exports.api.ts");
        const models = tsNamespaces ? "ExportsModels." : "";
        // Optional body: `data?` sorts after required parameters and is validated as optional.
        expect(api).toContain(
          `export const note = (exportId: string, copies: number, data?: ${models}ExportNoteDto, label?: string, ) => {`,
        );
        expect(api).toContain(`ZodExtended.parse(${models}ExportNoteDtoSchema.optional(), data)`);
        expect(api).toContain(`export const search = (limit: number, data?: ${models}SearchBody, ) => {`);
        // A required body stays required.
        expect(api).toContain("export const rename = (exportId: string, data: string,");
        expect(api).toContain("ZodExtended.parse(z.string().min(2), data)");
        // An inlined `$ref` parameter keeps the component's validations.
        expect(api).toContain(
          'label: ZodExtended.parse(z.string().min(2).optional(), label, { type: "query", name: "label" })',
        );
        expect(api).toContain('copies: ZodExtended.parse(z.int().gte(0), copies, { type: "query", name: "copies" })');
        expect(content("exports/exports.queries.ts")).toContain(
          `{ exportId: string, copies: number, data?: ${models}ExportNoteDto, label?: string }`,
        );
        // OpenAPI 3.1 type arrays are documented as unions.
        const exportModels = content("exports/exports.models.ts");
        expect(exportModels).toContain(" * ExportNoteResultSchema\n * @type { string | null }\n");
        expect(exportModels).toContain(
          " * @property { string | null } text\n * @property { (string | null)[] } tags\n",
        );

        // Without namespaces the fixture's `status` query parameter shadows the `status` endpoint.
        if (tsNamespaces) {
          const result = await typecheck(output, expected);
          expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
        }
      } finally {
        await rm(output, { recursive: true, force: true });
      }
    },
    60_000,
  );
});
