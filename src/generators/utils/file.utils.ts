import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { GenerateFileData, GenerateFileFormatter } from "@/generators/types/generate";

function readFileSync(filePath: string) {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), filePath),
    path.resolve(moduleDir, "../../../", filePath),
    path.resolve(moduleDir, "../", filePath),
  ];

  for (const candidatePath of candidates) {
    if (fs.existsSync(candidatePath)) {
      return fs.readFileSync(candidatePath, "utf-8");
    }
  }

  throw new Error(`Cannot read file: ${filePath}`);
}

export function readAssetSync(fileName: string) {
  const assetPath = `src/assets/${fileName}`;
  return readFileSync(assetPath);
}

export function getOutputFileName({ output, fileName }: { output: string; fileName: string }) {
  return `${output}/${fileName}`;
}

type WriteGenerateFileDataOptions = {
  formatGeneratedFile?: GenerateFileFormatter;
};

function hashString(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function writeFileWithDirSync(file: string, data: string) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(file)) {
    const existingData = fs.readFileSync(file, "utf-8");
    const existingHash = hashString(existingData);
    const nextHash = hashString(data);
    if (existingHash === nextHash && existingData === data) {
      return;
    }
  }

  fs.writeFileSync(file, data, "utf-8");
}

async function writeFile({ fileName, content }: GenerateFileData, options?: WriteGenerateFileDataOptions) {
  const formattedContent = options?.formatGeneratedFile
    ? await options.formatGeneratedFile({ fileName, content })
    : content;

  writeFileWithDirSync(fileName, formattedContent);
}

export async function writeGenerateFileData(filesData: GenerateFileData[], options?: WriteGenerateFileDataOptions) {
  for (const file of filesData) {
    await writeFile(file, options);
  }
}
