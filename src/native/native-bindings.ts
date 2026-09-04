import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

type NativeBindings = {
  nativeVersion(): string;
  analyzeOpenapi(
    source: string,
    yaml: boolean,
  ): {
    statsJson: string;
    elapsedMicros: number;
  };
  analyzeGeneration(
    source: string,
    yaml: boolean,
    optionsJson: string,
  ): {
    statsJson: string;
    operationNamesJson: string;
    schemaTagsJson: string;
    elapsedMicros: number;
  };
  compileSchemas(
    source: string,
    yaml: boolean,
    optionsJson: string,
  ): {
    schemasJson: string;
    elapsedMicros: number;
  };
  compileEndpoints(
    source: string,
    yaml: boolean,
    optionsJson: string,
  ): {
    endpointsJson: string;
    elapsedMicros: number;
  };
  compileData(
    source: string,
    yaml: boolean,
    optionsJson: string,
  ): {
    data: unknown;
    elapsedMicros: number;
  };
  parseOpenapi(
    source: string,
    yaml: boolean,
  ): {
    documentJson: string;
    parseMicros: number;
  };
};

let bindings: NativeBindings | undefined;
let nativePath: string | undefined;

function getNativePath() {
  if (nativePath) return nativePath;
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const binaryName = `openapi-codegen-native-${process.platform}-${process.arch}.node`;
  const candidates = [path.join(moduleDir, binaryName), path.resolve(moduleDir, "../../dist", binaryName)];
  nativePath = candidates.find(existsSync);
  if (!nativePath) throw new Error("Native OpenAPI codegen module is not built. Run `bun run build:native`.");
  return nativePath;
}

export function hasNativeBindings() {
  try {
    getNativeBindings();
    return true;
  } catch {
    return false;
  }
}

export function shouldUseNativeCodegen() {
  if (process.env.OPENAPI_CODEGEN_NATIVE === "0") return false;
  if (process.env.OPENAPI_CODEGEN_NATIVE === "1") return true;
  return hasNativeBindings();
}

export function getNativeBindings(): NativeBindings {
  if (!bindings) {
    const require = createRequire(import.meta.url);
    const resolvedNativePath = getNativePath();
    if (typeof process.dlopen === "function") {
      const nativeModule = { exports: {} as NativeBindings };
      process.dlopen(nativeModule as unknown as NodeModule, resolvedNativePath);
      bindings = nativeModule.exports;
    } else {
      bindings = require(resolvedNativePath) as NativeBindings;
    }
  }
  return bindings;
}

export function compileNativeData(source: string, yaml: boolean, optionsJson: string) {
  return getNativeBindings().compileData(source, yaml, optionsJson);
}
