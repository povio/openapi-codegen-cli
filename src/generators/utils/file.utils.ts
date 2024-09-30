import fs from "fs";
import path from "path";
import { decapitalize } from "./string.utils";

export function readHbsTemplateSync(fileName: string) {
  return fs.readFileSync(`src/generators/templates/${fileName}.hbs`, "utf-8");
}

export function getTagFileName(tag: string, fileNameSuffix: string, includeTagDir = true) {
  if (!tag) {
    return fileNameSuffix;
  }
  return `${includeTagDir ? `${decapitalize(tag)}/` : ""}${decapitalize(tag)}.${fileNameSuffix}`;
}

export function writeTsFileSync({ output, fileName, data }: { output: string; fileName: string; data: string }) {
  writeFileWithDirSync(`${output}/${fileName}.ts`, data);
}

function writeFileWithDirSync(file: string, data: string) {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(file, data, "utf-8");
}
