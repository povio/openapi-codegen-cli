import Handlebars from "handlebars";
import { GenerateOptions } from "../types/options";
import { readHbsTemplateSync } from "../utils/file.utils";
import { setZodSchemaInferedTypeNameHelper } from "../utils/handlebars.utils";

export function generateZodSchemas({
  zodSchemas,
  options,
}: {
  zodSchemas: Record<string, string>;
  options: GenerateOptions;
}) {
  const template = readHbsTemplateSync("zod-schemas");

  setZodSchemaInferedTypeNameHelper(options);

  const hbsTemplate = Handlebars.compile(template);

  return hbsTemplate({ zodSchemas });
}
