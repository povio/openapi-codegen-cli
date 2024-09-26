import fs from "fs";
import { TEMPLATE_DIR } from "../const/generate.const";

export function readHbsTemplateSync(fileName: string) {
  return fs.readFileSync(`${TEMPLATE_DIR}/${fileName}.hbs`, "utf-8");
}

export function writeTsFileSync({ output, fileName, content }: { output: string; fileName: string; content: string }) {
  fs.writeFileSync(`${output}/${fileName}.ts`, content);
}
