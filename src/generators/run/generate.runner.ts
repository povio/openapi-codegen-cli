import path from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateFileFormatter } from "@/generators/types/generate";
import { GenerateOptions } from "@/generators/types/options";
import { removeStaleGeneratedFiles, writeGenerateFileData } from "@/generators/utils/file.utils";
import { Profiler } from "@/helpers/profile.helper";

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
  const openApiDoc = await getOpenApiDoc(config.input, profiler);

  const filesData = profiler.runSync("generate.total", () => generateCodeFromOpenAPIDoc(openApiDoc, config, profiler));
  if (config.clearOutput) {
    profiler.runSync("files.removeStaleGenerated", () => {
      removeStaleGeneratedFiles({ output: config.output, filesData, options: config });
    });
  }
  await profiler.runAsync("files.write", async () => {
    await writeGenerateFileData(filesData, { formatGeneratedFile });
  });
  const stats = getGenerateStats(filesData, config);

  return { skipped: false, config, stats };
}

async function getOpenApiDoc(input: string, profiler: Profiler): Promise<OpenAPIV3.Document> {
  const parsedDoc = (await profiler.runAsync(
    "openapi.parse",
    async () => await SwaggerParser.parse(input),
  )) as OpenAPIV3.Document;
  const hasExternalRefs = profiler.runSync("openapi.detectExternalRefs", () => hasExternalRef(parsedDoc));
  if (!hasExternalRefs) {
    return parsedDoc;
  }

  return (await profiler.runAsync(
    "openapi.bundle",
    async () => await SwaggerParser.bundle(input),
  )) as OpenAPIV3.Document;
}

function hasExternalRef(value: unknown): boolean {
  const stack = [value];
  const visited = new Set<object>();

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    if (
      "$ref" in current &&
      typeof (current as { $ref?: unknown }).$ref === "string" &&
      !(current as { $ref: string }).$ref.startsWith("#/")
    ) {
      return true;
    }

    for (const nested of Object.values(current)) {
      if (nested && typeof nested === "object") {
        stack.push(nested);
      }
    }
  }

  return false;
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
