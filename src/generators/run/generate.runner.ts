import fs from "fs";
import path from "path";

import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3 } from "openapi-types";

import { resolveConfig } from "@/generators/core/resolveConfig";
import { generateCodeFromOpenAPIDoc } from "@/generators/generateCodeFromOpenAPIDoc";
import { GenerateOptions } from "@/generators/types/options";
import { writeGenerateFileData } from "@/generators/utils/file.utils";
import { Profiler } from "@/helpers/profile.helper";

const CACHE_FILE_NAME = ".openapi-codegen-cache.json";

type CacheData = {
  openApiHash: string;
  optionsHash: string;
};

export async function runGenerate({
  fileConfig,
  params,
  profiler = new Profiler(process.env.OPENAPI_CODEGEN_PROFILE === "1"),
}: {
  fileConfig?: Partial<GenerateOptions> | null;
  params?: Partial<
    Omit<GenerateOptions, "excludeTags" | "inlineEndpointsExcludeModules"> & {
      excludeTags: string;
      inlineEndpointsExcludeModules: string;
    }
  >;
  profiler?: Profiler;
}) {
  const config = profiler.runSync("config.resolve", () => resolveConfig({ fileConfig, params: params ?? {} }));
  const openApiDoc = await getOpenApiDoc(config.input, profiler);

  const openApiHash = hashString(stableStringify(openApiDoc));
  const optionsHash = hashString(stableStringify(getCacheableConfig(config)));
  const cacheFilePath = path.resolve(config.output, CACHE_FILE_NAME);

  if (config.incremental) {
    const cached = readCache(cacheFilePath);
    if (cached && cached.openApiHash === openApiHash && cached.optionsHash === optionsHash) {
      return { skipped: true, config };
    }
  }

  const filesData = profiler.runSync("generate.total", () => generateCodeFromOpenAPIDoc(openApiDoc, config, profiler));
  profiler.runSync("files.write", () => writeGenerateFileData(filesData));

  if (config.incremental) {
    writeCache(cacheFilePath, { openApiHash, optionsHash });
  }

  return { skipped: false, config };
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

function getCacheableConfig(config: GenerateOptions) {
  const { output, incremental, ...cacheableConfig } = config;
  void output;
  void incremental;
  return cacheableConfig;
}

function readCache(filePath: string): CacheData | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as CacheData;
  } catch {
    return null;
  }
}

function writeCache(filePath: string, data: CacheData) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

function hashString(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function stableStringify(input: unknown): string {
  if (input === null || typeof input !== "object") {
    return JSON.stringify(input);
  }

  if (Array.isArray(input)) {
    return `[${input.map((item) => stableStringify(item)).join(",")}]`;
  }

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(",")}}`;
}
