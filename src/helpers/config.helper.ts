import fs from "fs";
import path from "path";
import { OpenAPICodegenConfig } from "src/generators/types/config";
import { logError, logInfo } from "./cli.helper";

const CONFIG_FILE_NAMES = ["openapi-codegen.config.ts"];

export async function loadConfig(configPath?: string): Promise<OpenAPICodegenConfig | null> {
  try {
    if (configPath) {
      return await loadConfigFromPath(configPath);
    }

    for (const fileName of CONFIG_FILE_NAMES) {
      const filePath = path.resolve(process.cwd(), fileName);
      if (fs.existsSync(filePath)) {
        logInfo(`Found config file: ${fileName}`);
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
  if (ext !== ".ts") {
    throw new Error(`Only TypeScript configuration files are supported. Found: ${ext}`);
  }

  return loadTsConfig(absolutePath);
}

async function loadTsConfig(filePath: string): Promise<OpenAPICodegenConfig> {
  try {
    const configModule = await import(filePath);

    let config = configModule.default || configModule;
    if (typeof config === "function") {
      config = await config();
    }

    return config;
  } catch (error) {
    throw new Error(
      `Failed to load TypeScript config file ${filePath}: ${error instanceof Error ? error.message : error}`,
    );
  }
}
