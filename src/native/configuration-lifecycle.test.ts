import { mkdtemp, readFile, rm, stat, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { describe, expect, test } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

const cases = ["js", "native"].flatMap((renderer) =>
  ["yaml", "json"].flatMap((format) => [false, true].map((incremental) => ({ renderer, format, incremental }))),
);

describe("configuration input and output lifecycle", () => {
  test.each(cases)("$renderer / $format / incremental=$incremental", async ({ renderer, format, incremental }) => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "codegen-lifecycle-"));
    const input = path.join(directory, `schema.${format}`);
    const output = path.join(directory, "output");
    const previousNative = process.env.OPENAPI_CODEGEN_NATIVE;
    const previousRequired = process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE;
    process.env.OPENAPI_CODEGEN_NATIVE = renderer === "native" ? "1" : "0";
    process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE = "1";
    const document = (obsolete: boolean) => ({
      openapi: "3.0.3",
      info: { title: "Lifecycle", version: "1" },
      paths: Object.fromEntries(
        (obsolete ? ["records", "obsolete"] : ["records"]).map((tag) => [
          `/${tag}`,
          { get: { operationId: `read${tag}`, tags: [tag], responses: { "204": { description: "OK" } } } },
        ]),
      ),
    });
    const saveInput = async (obsolete: boolean) => {
      const value = document(obsolete);
      await writeFile(input, format === "json" ? JSON.stringify(value) : stringify(value));
    };
    const generate = (clearOutput: boolean) =>
      runGenerate({
        fileConfig: {
          input,
          output,
          incremental,
          clearOutput,
          modelsInCommon: true,
          acl: false,
          mutationEffects: false,
          restClientImportPath: "@test/rest",
        },
      });
    try {
      await saveInput(true);
      const first = await generate(false);
      expect(first.config.input).toBe(input);
      expect(first.config.output).toBe(output);
      expect(first.stats.generatedFilesCount).toBeGreaterThan(0);
      const current = path.join(output, "records/records.api.ts");
      const stale = path.join(output, "obsolete/obsolete.api.ts");
      expect(await readFile(current, "utf8")).toContain("/records");
      expect(await readFile(stale, "utf8")).toContain("/obsolete");
      const userFile = path.join(output, "obsolete/notes.ts");
      await writeFile(userFile, "// User-owned source\n");

      const sentinel = new Date("2001-01-01T00:00:00Z");
      await utimes(current, sentinel, sentinel);
      const unchangedMtime = (await stat(current)).mtimeMs;
      await saveInput(false);
      await generate(false);
      expect(await readFile(stale, "utf8")).toContain("/obsolete");
      // incremental is currently a compatibility option: unchanged writes are skipped
      // for both values. Assert the actual behavior without timers or sleeps.
      expect((await stat(current)).mtimeMs).toBe(unchangedMtime);

      await generate(true);
      await expect(stat(stale)).rejects.toMatchObject({ code: "ENOENT" });
      expect(await readFile(userFile, "utf8")).toBe("// User-owned source\n");
      expect((await stat(current)).mtimeMs).toBe(unchangedMtime);

      await rm(input);
      await expect(generate(true)).rejects.toMatchObject({ code: "ENOENT" });
      expect(await readFile(current, "utf8")).toContain("/records");
      expect(await readFile(userFile, "utf8")).toBe("// User-owned source\n");
    } finally {
      if (previousNative === undefined) delete process.env.OPENAPI_CODEGEN_NATIVE;
      else process.env.OPENAPI_CODEGEN_NATIVE = previousNative;
      if (previousRequired === undefined) delete process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE;
      else process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE = previousRequired;
      await rm(directory, { recursive: true, force: true });
    }
  });
});
