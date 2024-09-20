import fs from "fs";
import Handlebars from "handlebars";
import { GenerateOptions } from "../types/options";
import { getZodSchemaInferedTypeName } from "../utils/zod-schema.utils";

const TEMPLATE_PATH = "src/generators/templates/zod-schemas.hbs";
const OUTPUT_FILENAME = "zod-schemas";

export function printZodSchemasToFile({
  zodSchemas,
  output,
  options,
}: {
  zodSchemas: Record<string, string>;
  output: string;
  options: GenerateOptions;
}) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  setZodSchemaInferedTypeNameHelper(options.schemaSuffix);
  const hbsTemplate = Handlebars.compile(template);

  fs.writeFileSync(`${output}/${OUTPUT_FILENAME}.ts`, hbsTemplate({ zodSchemas }));
}

function setZodSchemaInferedTypeNameHelper(schemaSuffix: string) {
  Handlebars.registerHelper("getZodSchemaInferedTypeName", (zodSchema: string) =>
    getZodSchemaInferedTypeName(zodSchema, schemaSuffix),
  );
}
