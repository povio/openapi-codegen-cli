import fs from "fs";
import path from "path";

import { OpenAPICodegenConfig } from "@/generators/types/config";

import { logError } from "./cli.helper";

const CONFIG_FILE_NAMES = ["openapi-codegen.config.mjs", "openapi-codegen.config.ts"];

export async function loadConfig(configPath?: string): Promise<OpenAPICodegenConfig | null> {
  try {
    if (configPath) {
      return await loadConfigFromPath(configPath);
    }

    for (const fileName of CONFIG_FILE_NAMES) {
      const filePath = path.resolve(process.cwd(), fileName);
      if (fs.existsSync(filePath)) {
        return await loadConfigFromPath(filePath);
      }
    }

    return null;
  } catch (error) {
    logError(`Failed to load configuration: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

async function loadConfigFromPath(filePath: string): Promise<OpenAPICodegenConfig> {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Configuration file not found: ${filePath}`);
  }

  const ext = path.extname(absolutePath).toLowerCase();
  if (ext === ".mjs") {
    return loadMjsConfig(absolutePath);
  }
  if (ext !== ".ts") {
    throw new Error(`Only ESM (.mjs) and TypeScript (.ts) configuration files are supported. Found: ${ext}`);
  }

  return loadModuleConfig(absolutePath, "TypeScript");
}

async function loadMjsConfig(filePath: string): Promise<OpenAPICodegenConfig> {
  return loadModuleConfig(filePath, "ESM");
}

async function loadModuleConfig(filePath: string, format: string): Promise<OpenAPICodegenConfig> {
  const imported = (await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`)) as {
    default?: OpenAPICodegenConfig;
  };
  if (!imported.default) {
    throw new Error(`${format} config must have a default export: ${filePath}`);
  }
  return imported.default;
}

function pathToFileURL(filePath: string) {
  const resolvedPath = path.resolve(filePath);
  const normalizedPath = resolvedPath.replace(/\\/g, "/");
  const hasLeadingSlash = normalizedPath.startsWith("/");
  return {
    href: hasLeadingSlash ? `file://${normalizedPath}` : `file:///${normalizedPath}`,
  };
}
