import fs from "fs";
import path from "path";

export function readHbsTemplateSync(fileName: string) {
  const templatePath = `src/generators/templates/${fileName}.hbs`;

  if (process.env.NODE_ENV === "production") {
    return fs.readFileSync(path.join(__dirname, `../${templatePath}`), "utf-8");
  }

  return fs.readFileSync(templatePath, "utf-8");
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
