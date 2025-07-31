import fs from "fs";
import path from "path";
import { GenerateFileData } from "src/generators/types/generate";

function readFileSync(filePath: string) {
  if (process.env.NODE_ENV === "production") {
    return fs.readFileSync(path.join(__dirname, `../${filePath}`), "utf-8");
  }

  return fs.readFileSync(filePath, "utf-8");
}

export function readHbsTemplateSync(fileName: string) {
  const templatePath = `src/generators/templates/${fileName}.hbs`;
  return readFileSync(templatePath);
}

export function readAssetSync(fileName: string) {
  const assetPath = `src/assets/${fileName}`;
  return readFileSync(assetPath);
}

export function getOutputFileName({ output, fileName }: { output: string; fileName: string }) {
  return `${output}/${fileName}`;
}

function writeFileWithDirSync(file: string, data: string) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(file, data, "utf-8");
}

function writeFileSync({ fileName, content }: GenerateFileData) {
  writeFileWithDirSync(fileName, content);
}

export function writeGenerateFileData(filesData: GenerateFileData[]) {
  filesData.forEach(writeFileSync);
}
