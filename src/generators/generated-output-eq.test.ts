import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const BASE_DIR = path.resolve(process.cwd(), "test/generated/base");
const NEXT_DIR = path.resolve(process.cwd(), "test/generated/next");

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function getAllFiles(dir: string, rootDir = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".gitkeep") {
      continue;
    }

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(entryPath, rootDir));
      continue;
    }

    files.push(toPosixPath(path.relative(rootDir, entryPath)));
  }

  return files.sort();
}

async function normalizeContent(filePath: string, content: string) {
  void filePath;
  return content
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n[ \t]*\n+/g, "\n")
    .trim();
}

describe("Generated output parity", () => {
  it("matches between base and next output folders", async () => {
    expect(fs.existsSync(BASE_DIR), `${BASE_DIR} does not exist`).toBe(true);
    expect(fs.existsSync(NEXT_DIR), `${NEXT_DIR} does not exist`).toBe(true);

    const baseFiles = getAllFiles(BASE_DIR);
    const nextFiles = getAllFiles(NEXT_DIR);

    expect(nextFiles).toEqual(baseFiles);

    for (const relativeFilePath of baseFiles) {
      const baseContent = fs.readFileSync(path.join(BASE_DIR, relativeFilePath), "utf-8");
      const nextContent = fs.readFileSync(path.join(NEXT_DIR, relativeFilePath), "utf-8");

      const normalizedBase = await normalizeContent(relativeFilePath, baseContent);
      const normalizedNext = await normalizeContent(relativeFilePath, nextContent);

      expect(normalizedNext).toBe(normalizedBase);
    }
  });
});
