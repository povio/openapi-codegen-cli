import fs from "fs";
import path from "path";
import { OpenAPIV3 } from "openapi-types";

import { type ConfigParams, resolveConfig } from "@/generators/core/resolveConfig";
import { GenerateFileFormatter } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { removeStaleGeneratedFiles, writeGenerateFileData } from "@/generators/utils/file.utils";
import { Profiler } from "@/helpers/profile.helper";
import { IncrementalCache } from "@/generators/run/incremental-cache";
import { findProjectFormatter } from "@/generators/run/oxfmt-formatter";
import { shouldUseNativeCodegen } from "@/native/native-bindings";
import { generateNativeOutputFiles } from "@/native/generateFilesFromNativeOpenAPI";

type GenerateStats = {
  generatedFilesCount: number;
  generatedModulesCount: number;
};

export async function runGenerate({
  fileConfig,
  params,
  formatGeneratedFile,
  profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1"),
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params?: ConfigParams;
  formatGeneratedFile?: GenerateFileFormatter;
  profiler?: Profiler;
}) {
  const config = profiler.runSync("config.resolve", () => resolveConfig({ fileConfig, params: params ?? {} }));
  const useNative = shouldUseNativeCodegen();
  const isJson = path.extname(new URL(config.input, "file://").pathname).toLowerCase() === ".json";
  const useRawNativeInput = useNative && (isJson || typeof Bun === "undefined");
  let nativeInput = useRawNativeInput
    ? await getRawOpenApiSource(config.input, profiler)
    : await getOpenApiSource(config.input, profiler);
  if (useNative && !useRawNativeInput) {
    const document = "document" in nativeInput ? nativeInput.document : undefined;
    nativeInput = {
      ...nativeInput,
      source: profiler.runSync("openapi.serialize", () => JSON.stringify(document)),
      yaml: false,
    };
  }
  const openApiDoc =
    "document" in nativeInput ? (nativeInput.document as OpenAPIV3.Document) : ({} as OpenAPIV3.Document);
  const outputExists = fs.existsSync(config.output);
  // A plugin's own formatter wins; otherwise format like the project's oxfmt / `bun fmt`.
  const projectFormatter =
    !formatGeneratedFile && config.format
      ? profiler.runSync("format.find", () => findProjectFormatter(config.output))
      : undefined;
  const formatterId = formatGeneratedFile ? "custom" : (projectFormatter?.fingerprint ?? "");
  const cache = config.incremental ? new IncrementalCache(config.output, formatterId) : undefined;
  const cacheKey = cache
    ? profiler.runSync("incremental.key", () =>
        IncrementalCache.key([useNative ? "native" : "js", formatterId, JSON.stringify(config), nativeInput.source]),
      )
    : "";
  const unchangedStats = cache?.unchangedStats(cacheKey);
  if (unchangedStats) {
    return { skipped: true, config, stats: unchangedStats };
  }

  const loadFormatter = async () =>
    formatGeneratedFile ??
    (projectFormatter ? await profiler.runAsync("format.load", () => projectFormatter.load()) : undefined);

  if (useNative) {
    // Rendered files stay native: only names, hashes and files left to format come back.
    const native = profiler.runSync("generate.total", () =>
      generateNativeOutputFiles(nativeInput.source, nativeInput.yaml, config, {
        previous: cache?.previousHashes() ?? null,
        salt: formatterId,
        write: !formatGeneratedFile && !projectFormatter,
        skipExistingCheck: !outputExists,
      }),
    );
    if (native) {
      const generated = native.names.map((fileName) => ({ fileName }));
      if (config.clearOutput) {
        profiler.runSync("files.removeStaleGenerated", () => {
          removeStaleGeneratedFiles({ output: config.output, filesData: generated, options: config });
        });
      }
      if (native.changed.length > 0) {
        const formatter = await loadFormatter();
        await profiler.runAsync("files.write", async () => {
          await writeGenerateFileData(native.changed, {
            formatGeneratedFile: formatter,
            skipExistingCheck: !outputExists,
          });
        });
      }
      const stats = getGenerateStats(generated, config);
      cache?.saveHashes(
        cacheKey,
        native.names.map((fileName, index) => [fileName, native.hashes[index]]),
        stats,
      );
      return { skipped: false, config, stats };
    }
  }

  const { generateCodeFromOpenAPIDoc } = await import("@/generators/generateCodeFromOpenAPIDoc");
  const filesData = await profiler.runAsync("generate.total", async () =>
    generateCodeFromOpenAPIDoc(openApiDoc, config, profiler, {
      source: nativeInput.source,
      yaml: nativeInput.yaml,
    }),
  );
  if (config.clearOutput) {
    profiler.runSync("files.removeStaleGenerated", () => {
      removeStaleGeneratedFiles({ output: config.output, filesData, options: config });
    });
  }
  // Leave files alone whose generated content is unchanged, even if a formatter rewrote them since.
  const changedFiles = cache ? profiler.runSync("incremental.diff", () => cache.changedFiles(filesData)) : filesData;
  const formatter = changedFiles.length > 0 ? await loadFormatter() : formatGeneratedFile;
  await profiler.runAsync("files.write", async () => {
    await writeGenerateFileData(changedFiles, { formatGeneratedFile: formatter, skipExistingCheck: !outputExists });
  });
  const stats = getGenerateStats(filesData, config);
  cache?.save(cacheKey, filesData, stats);

  return { skipped: false, config, stats };
}

export async function getOpenApiDoc(input: string, profiler = new Profiler(false)): Promise<OpenAPIV3.Document> {
  return (await getOpenApiSource(input, profiler)).document;
}

async function getOpenApiSource(input: string, profiler = new Profiler(false)) {
  const raw = await getRawOpenApiSource(input, profiler);
  const { source } = raw;
  const document = await profiler.runAsync("openapi.parse", () => parseOpenApiSource(input, source));
  return { ...raw, document };
}

async function getRawOpenApiSource(input: string, profiler = new Profiler(false)) {
  const source = await profiler.runAsync("openapi.read", () => readOpenApiSource(input));
  const extension = path.extname(new URL(input, "file://").pathname).toLowerCase();
  return { source, yaml: extension !== ".json" };
}

async function readOpenApiSource(input: string) {
  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`Unable to load OpenAPI document: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  return fs.promises.readFile(input, "utf-8");
}

async function parseOpenApiSource(input: string, source: string): Promise<OpenAPIV3.Document> {
  try {
    return JSON.parse(source.charCodeAt(0) === 0xfeff ? source.slice(1) : source) as OpenAPIV3.Document;
  } catch (error) {
    if (path.extname(new URL(input, "file://").pathname).toLowerCase() === ".json") {
      throw error;
    }
    if (typeof Bun !== "undefined") {
      return Bun.YAML.parse(source) as OpenAPIV3.Document;
    }
    const { parse } = await import("yaml");
    return parse(source) as OpenAPIV3.Document;
  }
}

function getGenerateStats(filesData: { fileName: string }[], config: GenerateOptions): GenerateStats {
  const generatedFilesCount = filesData.length;
  if (generatedFilesCount === 0) {
    return { generatedFilesCount, generatedModulesCount: 0 };
  }

  if (!config.splitByTags) {
    return { generatedFilesCount, generatedModulesCount: 1 };
  }

  const moduleSuffixes = new Set(
    Object.values(config.configs)
      .map((generateConfig) => generateConfig.outputFileNameSuffix)
      .filter(Boolean),
  );

  const modules = new Set<string>();
  for (const file of filesData) {
    const relativeFilePath = path.relative(config.output, file.fileName);
    const segments = relativeFilePath.split(path.sep).filter(Boolean);
    if (segments.length < 2) {
      continue;
    }

    const moduleName = segments[0];
    const fileName = segments[segments.length - 1];
    if (!fileName.startsWith(`${moduleName}.`)) {
      continue;
    }

    const suffixWithExt = fileName.slice(moduleName.length + 1);
    const suffix = suffixWithExt.replace(/\.tsx?$/, "");
    if (moduleSuffixes.has(suffix)) {
      modules.add(moduleName);
    }
  }

  return { generatedFilesCount, generatedModulesCount: modules.size };
}
