import { ZOD_IMPORT } from "../const/imports.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { getZodSchemaRefs } from "../core/zod/getZodSchemaRefs";
import { GenerateData } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getModelsImports } from "../utils/generate.imports.utils";
import { getHbsTemplateDelegate } from "../utils/hbs-template.utils";

export function generateModels({
  resolver,
  data,
  tag = "",
  options,
}: {
  resolver: SchemaResolver;
  data: GenerateData;
  tag?: string;
  options: GenerateOptions;
}) {
  const zodSchemas = data.get(tag)?.zodSchemas;
  if (!zodSchemas || Object.keys(zodSchemas).length === 0) {
    return;
  }

  const refZodSchemas = Object.keys(zodSchemas)
    .reduce((acc, zodSchema) => [...acc, ...getZodSchemaRefs({ zodSchema, resolver })], [] as string[])
    .filter((zodSchema) => !zodSchemas.hasOwnProperty(zodSchema));

  const modelsImports = getModelsImports({
    tag,
    data,
    zodSchemas: refZodSchemas,
    options,
  });

  const hbsTemplate = getHbsTemplateDelegate({ templateName: "models", options });

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    modelsImports,
    zodSchemas,
  });
}
