import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";

import { renderParityCase } from "../../scripts/renderer-parity-cases";
import { parityScenarios } from "../../scripts/renderer-parity-configs";

const layouts = parityScenarios.filter(({ name, invalid }) => name.startsWith("layout-") && !invalid);

describe("generated model runtime across valid layouts", () => {
  test("covers all 48 supported layout combinations", () => {
    expect(layouts).toHaveLength(48);
  });

  test.each(layouts)("loads and validates models for $name", async (scenario) => {
    const source = await readFile("test/petstore.yaml", "utf8");
    const previous = process.env.OPENAPI_CODEGEN_NATIVE;
    process.env.OPENAPI_CODEGEN_NATIVE = "1";
    let generated;
    try {
      generated = renderParityCase(
        source,
        {
          ...scenario,
          options: { ...scenario.options, importPath: "relative" },
        },
        "native",
      );
    } finally {
      if (previous === undefined) delete process.env.OPENAPI_CODEGEN_NATIVE;
      else process.env.OPENAPI_CODEGEN_NATIVE = previous;
    }
    expect(["full-native", "hybrid-native"]).toContain(generated.route);
    const models = generated.files.filter(({ fileName }) => fileName.endsWith(".models.ts"));
    expect(models.length).toBeGreaterThan(0);
    const directory = await mkdtemp(path.join(os.tmpdir(), "native-layout-runtime-"));
    try {
      await symlink(path.join(process.cwd(), "node_modules"), path.join(directory, "node_modules"), "dir");
      const imports: string[] = [];
      for (const [index, file] of models.entries()) {
        const relative = path.relative("generated", file.fileName);
        expect(relative.startsWith("..")).toBe(false);
        const destination = path.join(directory, relative);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, file.content);
        imports.push(`import * as model${index} from ${JSON.stringify(`./${relative}`)};`);
      }
      await writeFile(
        path.join(directory, "check.ts"),
        `${imports.join("\n")}
const modules = [${models.map((_, index) => `model${index}`).join(",")}];
const candidates = modules.flatMap(module => [module, ...Object.values(module)])
  .filter(value => value && typeof value === "object")
  .map(value => value.EmailActivityAdminResponseSchema).filter(Boolean);
if (!candidates.length) throw new Error("Missing email activity schema export");
for (const schema of candidates) {
  if (schema.parse({ level: "info", label: { text: "ok" } }).level !== "info")
    throw new Error("Expected valid shared log level");
  if (schema.safeParse({ level: "invalid" }).success)
    throw new Error("Expected invalid shared log level rejection");
}
`,
      );
      execFileSync("bun", [path.join(directory, "check.ts")], { stdio: "pipe", timeout: 15_000 });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
