import fs from "fs";
import os from "os";
import path from "path";

import { describe, expect, test } from "vitest";

import { writeGenerateFileData } from "./file.utils";

describe("Utils: file", () => {
  test("writes formatted content instead of raw generated content", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "openapi-codegen-file-utils-"));
    const filePath = path.join(tempDir, "generated.ts");

    await writeGenerateFileData([{ fileName: filePath, content: "export   const value=1;\n" }], {
      formatGeneratedFile: async ({ content }) => content.replace("export   const value=1;", "export const value = 1;"),
    });

    expect(fs.readFileSync(filePath, "utf-8")).toBe("export const value = 1;\n");
  });

  test("does not rewrite the file when formatted content stays the same", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "openapi-codegen-file-utils-"));
    const filePath = path.join(tempDir, "generated.ts");
    const initialContent = "export const value = 1;\n";

    fs.writeFileSync(filePath, initialContent, "utf-8");
    const beforeStat = fs.statSync(filePath);

    await new Promise((resolve) => setTimeout(resolve, 15));

    await writeGenerateFileData([{ fileName: filePath, content: "export   const value=1;\n" }], {
      formatGeneratedFile: async () => initialContent,
    });

    const afterStat = fs.statSync(filePath);

    expect(fs.readFileSync(filePath, "utf-8")).toBe(initialContent);
    expect(afterStat.mtimeMs).toBe(beforeStat.mtimeMs);
  });
});
