import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { GenerateFileFormatter } from "@/generators/types/generate";

const CONFIG_FILE_NAMES = [".oxfmtrc.json"];
/** Keys of .oxfmtrc.json that select files rather than describe formatting. */
const NON_FORMAT_KEYS = new Set(["$schema", "ignorePatterns", "overrides"]);

type OxfmtModule = {
  format(
    fileName: string,
    sourceText: string,
    options?: Record<string, unknown>,
  ): Promise<{ code: string; errors: { severity: string; message: string }[] }>;
};

export type ProjectFormatter = {
  /** Changes whenever formatted output could change: oxfmt version or config. */
  fingerprint: string;
  load(): Promise<GenerateFileFormatter>;
};

/**
 * Formats generated files the way the project's `oxfmt` (or `bun fmt`, which reads the same
 * config) would, so no separate formatting step is needed. Uses the nearest `.oxfmtrc.json`
 * above the output directory and the `oxfmt` package installed next to it. Returns undefined
 * when the project has no oxfmt config or oxfmt is not installed.
 */
export function findProjectFormatter(output: string): ProjectFormatter | undefined {
  const configPath = findConfig(path.resolve(output));
  if (!configPath) return undefined;
  const require = createRequire(configPath);
  let entry: string;
  let version: string;
  try {
    entry = require.resolve("oxfmt");
    version = (require("oxfmt/package.json") as { version: string }).version;
  } catch {
    console.warn(
      `[openapi-codegen] Found ${configPath} but could not load the oxfmt package, so generated files are not formatted. Install oxfmt or set format: false.`,
    );
    return undefined;
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Record<string, unknown>;
  const options = Object.fromEntries(Object.entries(config).filter(([key]) => !NON_FORMAT_KEYS.has(key)));

  return {
    fingerprint: `oxfmt@${version}:${JSON.stringify(options)}`,
    async load() {
      const oxfmt = (await import(pathToFileURL(entry).href)) as OxfmtModule;
      return async ({ fileName, content }) => {
        const result = await oxfmt.format(fileName, content, options);
        const error = result.errors.find(({ severity }) => severity === "Error");
        if (error) {
          throw new Error(`Could not format ${fileName}: ${error.message}`);
        }
        return result.code;
      };
    },
  };
}

function findConfig(outputPath: string) {
  for (let directory = outputPath; ; directory = path.dirname(directory)) {
    for (const name of CONFIG_FILE_NAMES) {
      const candidate = path.join(directory, name);
      if (fs.existsSync(candidate)) return candidate;
    }
    if (fs.existsSync(path.join(directory, ".git")) || path.dirname(directory) === directory) return undefined;
  }
}
