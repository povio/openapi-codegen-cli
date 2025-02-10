import fs from "fs";
import path from "path";
import { GenerateFileData } from "../types/generate";

export function readHbsTemplateSync(fileName: string) {
  const templatePath = `src/generators/templates/${fileName}.hbs`;

  if (process.env.NODE_ENV === "production") {
    return fs.readFileSync(path.join(__dirname, `../${templatePath}`), "utf-8");
  }

  return fs.readFileSync(templatePath, "utf-8");
}

export function getOutputFileName({ output, fileName }: { output: string; fileName: string }) {
  return `${output}/${fileName}.ts`;
}

export function writeTsFileSync({ fileName, content }: GenerateFileData) {
  writeFileWithDirSync(fileName, content);
}

function writeFileWithDirSync(file: string, data: string) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(file, data, "utf-8");
}

export function writeGeneratesFileData(filesData: GenerateFileData[]) {
  filesData.forEach(writeTsFileSync);
}
