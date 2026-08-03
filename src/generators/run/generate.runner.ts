import fs from "fs";
import path from "path";
import { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateFileFormatter } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { removeStaleGeneratedFiles, writeGenerateFileData } from "@/generators/utils/file.utils";
import { Profiler } from "@/helpers/profile.helper";
import { shouldUseNativeCodegen } from "@/native/native-bindings";

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
  params?: Partial<
    Omit<GenerateOptions, "includeTags" | "excludeTags" | "inlineEndpointsExcludeModules" | "workspaceContext"> & {
      includeTags: string;
      excludeTags: string;
      inlineEndpointsExcludeModules: string;
      workspaceContext: string;
    }
  >;
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

  const filesData = profiler.runSync("generate.total", () =>
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
  await profiler.runAsync("files.write", async () => {
    await writeGenerateFileData(filesData, { formatGeneratedFile, skipExistingCheck: !outputExists });
  });
  const stats = getGenerateStats(filesData, config);

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
