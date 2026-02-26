import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { GenerateFileData } from "@/generators/types/generate";

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

export function readHbsTemplateSync(templateName: string) {
  const templatePath = `src/generators/templates/${templateName}.hbs`;
  return readFileSync(templatePath);
}

export function getOutputFileName({ output, fileName }: { output: string; fileName: string }) {
  return `${output}/${fileName}`;
}

function writeFileWithDirSync(file: string, data: string) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(file)) {
    const existingData = fs.readFileSync(file, "utf-8");
    if (existingData === data) {
      return;
    }
  }

  fs.writeFileSync(file, data, "utf-8");
}

function writeFileSync({ fileName, content }: GenerateFileData) {
  writeFileWithDirSync(fileName, content);
}

export function writeGenerateFileData(filesData: GenerateFileData[]) {
  filesData.forEach(writeFileSync);
}
