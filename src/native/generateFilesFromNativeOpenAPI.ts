import path from "path";

import { GenerateFileData } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";

import { generateNativeFiles } from "./native-bindings";

/** How the native writer handles files beyond the generate options. */
export type NativeWriteOptions = {
  /** Content hashes of the previous run's files by absolute name, when generating incrementally. */
  previous: Record<string, string> | null;
  /** Identifies post-processing (the formatter); part of every content hash. */
  salt: string;
  /** Write changed files natively. Otherwise they are returned to be formatted and written. */
  write: boolean;
  /** The output directory did not exist, so nothing needs comparing with disk. */
  skipExistingCheck: boolean;
};

export type NativeOutputFiles = {
  /** Every generated file name, in generation order. */
  names: string[];
  hashes: string[];
  /** Changed files left to format and write (when not written natively). */
  changed: GenerateFileData[];
  written: number;
};

/**
 * Generates the output files natively: compile, render, name, trim, and (with `write`) write the
 * changed files, so rendered contents only reach JavaScript when they still need formatting.
 * Returns undefined when the options need the TypeScript renderer.
 */
export function generateNativeOutputFiles(
  source: string,
  yaml: boolean,
  options: GenerateOptions,
  write: NativeWriteOptions,
): NativeOutputFiles | undefined {
  if (options.standalone && options.importPath === "ts") {
    options = { ...options, importPath: "relative" };
  }
  if (!supportsCompleteNativeRender(options)) {
    if (process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE === "1") {
      throw new Error("The selected options are not supported by the full native renderer");
    }
    return undefined;
  }
  const result = generateNativeFiles(
    source,
    yaml,
    JSON.stringify({ ...options, nativeCompact: true }),
    JSON.stringify({ ...write, outputAbsolute: path.resolve(options.output) }),
  );
  if (!result.complete) {
    if (process.env.OPENAPI_CODEGEN_REQUIRE_FULL_NATIVE === "1") {
      throw new Error("The selected options are not supported by the full native renderer");
    }
    return undefined;
  }
  return {
    names: result.names,
    hashes: result.hashes,
    changed: result.changedNames.map((fileName, index) => ({ fileName, content: result.changedContents[index] })),
    written: result.written,
  };
}

/** Every generated file with its content, without writing anything. */
export function generateFilesFromNativeOpenAPI(
  source: string,
  yaml: boolean,
  options: GenerateOptions,
): GenerateFileData[] | undefined {
  return generateNativeOutputFiles(source, yaml, options, {
    previous: null,
    salt: "",
    write: false,
    skipExistingCheck: true,
  })?.changed;
}

export function supportsCompleteNativeRender(options: GenerateOptions) {
  return options.splitByTags && !options.inlineEndpoints && (options.workspaceContext?.length ?? 0) === 0;
}
