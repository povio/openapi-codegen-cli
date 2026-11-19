import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { runGenerate } from "@/generators/run/generate.runner";

const document = (paths: string[]) => ({
  openapi: "3.0.3",
  info: { title: "Incremental", version: "1" },
  paths: Object.fromEntries(
    paths.map((tag) => [
      `/${tag}`,
      { get: { operationId: `read${tag}`, tags: [tag], responses: { "204": { description: "OK" } } } },
    ]),
  ),
});

describe.each(["js", "native"])("incremental generation (%s)", (renderer) => {
  let directory: string;
  let input: string;
  let output: string;
  let previousNative: string | undefined;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "codegen-incremental-"));
    input = path.join(directory, "schema.json");
    output = path.join(directory, "output");
    previousNative = process.env.OPENAPI_CODEGEN_NATIVE;
    process.env.OPENAPI_CODEGEN_NATIVE = renderer === "native" ? "1" : "0";
  });

  afterEach(async () => {
    if (previousNative === undefined) delete process.env.OPENAPI_CODEGEN_NATIVE;
    else process.env.OPENAPI_CODEGEN_NATIVE = previousNative;
    await rm(directory, { recursive: true, force: true });
  });

  const generate = (incremental = true) =>
    runGenerate({
      fileConfig: {
        input,
        output,
        incremental,
        modelsInCommon: true,
        acl: false,
        mutationEffects: false,
        restClientImportPath: "@test/rest",
      },
    });
  const records = () => path.join(output, "records/records.api.ts");
  const orders = () => path.join(output, "orders/orders.api.ts");
  const reformat = async (file: string) => {
    const formatted = `// formatted\n${await readFile(file, "utf8")}`;
    await writeFile(file, formatted);
    return formatted;
  };

  test("skips a run whose input and config are unchanged", async () => {
    await writeFile(input, JSON.stringify(document(["records"])));
    const first = await generate();
    expect(first.skipped).toBe(false);
    const formatted = await reformat(records());

    const second = await generate();
    expect(second.skipped).toBe(true);
    expect(second.stats).toEqual(first.stats);
    expect(await readFile(records(), "utf8")).toBe(formatted);
  });

  test("writes only files whose generated content changed", async () => {
    await writeFile(input, JSON.stringify(document(["records"])));
    await generate();
    const formatted = await reformat(records());

    await writeFile(input, JSON.stringify(document(["records", "orders"])));
    const result = await generate();
    expect(result.skipped).toBe(false);
    expect(await readFile(records(), "utf8")).toBe(formatted);
    expect(await readFile(orders(), "utf8")).toContain("/orders");
  });

  test("regenerates deleted files", async () => {
    await writeFile(input, JSON.stringify(document(["records"])));
    await generate();
    await rm(records());

    expect((await generate()).skipped).toBe(false);
    expect(await readFile(records(), "utf8")).toContain("/records");
  });

  test("rewrites everything when incremental is off", async () => {
    await writeFile(input, JSON.stringify(document(["records"])));
    const generated = (await generate(), await readFile(records(), "utf8"));
    await reformat(records());

    expect((await generate(false)).skipped).toBe(false);
    expect(await readFile(records(), "utf8")).toBe(generated);
  });
});
