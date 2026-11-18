import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

const repoNodeModules = path.resolve(import.meta.dirname, "../../../node_modules");

describe.each(["js", "native"])("formatting with the project's oxfmt config (%s)", (renderer) => {
  let project: string;
  let input: string;
  let output: string;
  let previousNative: string | undefined;

  beforeEach(async () => {
    project = await mkdtemp(path.join(os.tmpdir(), "codegen-format-"));
    // A project boundary, so the search does not pick up configs above the temp directory.
    await mkdir(path.join(project, ".git"));
    await mkdir(path.join(project, "node_modules"));
    await symlink(path.join(repoNodeModules, "oxfmt"), path.join(project, "node_modules/oxfmt"), "dir");
    input = path.join(project, "schema.json");
    output = path.join(project, "src/data");
    await writeFile(
      input,
      JSON.stringify({
        openapi: "3.0.3",
        info: { title: "Format", version: "1" },
        paths: {
          "/records": {
            get: { operationId: "readRecords", tags: ["records"], responses: { "204": { description: "OK" } } },
          },
        },
      }),
    );
    previousNative = process.env.OPENAPI_CODEGEN_NATIVE;
    process.env.OPENAPI_CODEGEN_NATIVE = renderer === "native" ? "1" : "0";
  });

  afterEach(async () => {
    if (previousNative === undefined) delete process.env.OPENAPI_CODEGEN_NATIVE;
    else process.env.OPENAPI_CODEGEN_NATIVE = previousNative;
    await rm(project, { recursive: true, force: true });
  });

  const generate = (format?: boolean) =>
    runGenerate({
      fileConfig: {
        input,
        output,
        format,
        modelsInCommon: true,
        acl: false,
        mutationEffects: false,
        restClientImportPath: "@test/rest",
      },
    });
  const api = () => readFile(path.join(output, "records/records.api.ts"), "utf8");
  const setConfig = (config: object) => writeFile(path.join(project, ".oxfmtrc.json"), JSON.stringify(config));

  test("formats with the nearest .oxfmtrc.json", async () => {
    await setConfig({ singleQuote: true, ignorePatterns: ["dist"] });
    await generate();
    expect(await api()).toContain("from '@test/rest'");
  });

  test("leaves output untouched without a config or with format: false", async () => {
    await generate();
    expect(await api()).toContain('from "@test/rest"');

    await setConfig({ singleQuote: true });
    await generate(false);
    expect(await api()).toContain('from "@test/rest"');
  });

  test("reformats every file when the config changes", async () => {
    await setConfig({ singleQuote: true });
    await generate();
    expect((await generate()).skipped).toBe(true);

    await setConfig({ singleQuote: false });
    expect((await generate()).skipped).toBe(false);
    expect(await api()).toContain('from "@test/rest"');
  });
});
