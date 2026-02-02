/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import fs, { existsSync, rmSync, writeFileSync } from "fs";
import path from "path";

import { OpenAPICodegenConfig } from "src/generators/types/config";

import { logError } from "./cli.helper";

const CONFIG_FILE_NAMES = ["openapi-codegen.config.ts"];

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
  if (ext !== ".ts") {
    throw new Error(`Only TypeScript configuration files are supported. Found: ${ext}`);
  }

  return loadTsConfig(absolutePath);
}

let importFresh: typeof import("import-fresh");
export const loadJsSync = function loadJsSync(filepath: string) {
  if (importFresh === undefined) {
    importFresh = require("import-fresh");
  }
  return importFresh(filepath);
};

let typescript: typeof import("typescript");
async function loadTsConfig(filePath: string): Promise<OpenAPICodegenConfig> {
  if (typescript === undefined) {
    typescript = require("typescript");
  }

  const transpiledFilepath = `${filePath.slice(0, -2)}cjs`;
  try {
    const tsConfig = resolveTsConfig(path.dirname(filePath)) ?? {};
    tsConfig.compilerOptions = Object.assign({}, tsConfig.compilerOptions, {
      module: typescript.ModuleKind.NodeNext,
      moduleResolution: typescript.ModuleResolutionKind.NodeNext,
      target: typescript.ScriptTarget.ES2022,
      noEmit: false,
    });

    const fileContent = fs.readFileSync(filePath, "utf-8");

    const transpiledFileContent = typescript.transpileModule(fileContent, tsConfig).outputText;

    writeFileSync(transpiledFilepath, transpiledFileContent);

    return (loadJsSync(transpiledFilepath) as any).default;
  } catch (error: any) {
    error.message = `TypeScript Error in ${filePath}:\n${error.message}`;
    throw error;
  } finally {
    if (existsSync(transpiledFilepath)) {
      rmSync(transpiledFilepath);
    }
  }
}

function resolveTsConfig(directory: string) {
  const filePath = typescript.findConfigFile(directory, (fileName) => {
    return typescript.sys.fileExists(fileName);
  });

  if (filePath === undefined) {
    return;
  }

  const { config, error } = typescript.readConfigFile(filePath, (path) => typescript.sys.readFile(path));
  if (error) {
    throw new Error(`Error in ${filePath}: ${error.messageText.toString()}`);
  }

  return config;
}
