import { ZOD_IMPORT } from "../const/imports.const";
import { GenerateOptions } from "../types/options";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";

export function generateModels({
  zodSchemas,
  options,
}: {
  zodSchemas: Record<string, string>;
  options: GenerateOptions;
}) {
  const hbsTemplate = getHbsTemplateDelegate({ templateName: "models", options });

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    zodSchemas,
  });
}
