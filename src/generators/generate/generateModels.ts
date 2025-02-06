import { ZOD_IMPORT } from "../const/zod.const";
import { SchemaResolver } from "../core/SchemaResolver.class";
import { getZodSchemaRefs } from "../core/zod/getZodSchemaRefs";
import { GenerateData, GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

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
    .reduce((acc, zodSchema) => [...acc, ...getZodSchemaRefs(resolver, zodSchema)], [] as string[])
    .filter((zodSchema) => !zodSchemas[zodSchema]);

  const modelsImports = getModelsImports({
    resolver,
    tag,
    zodSchemas: refZodSchemas,
    options,
  });

  const zodSchemasData = Object.entries(zodSchemas).reduce((acc, [key, code]) => {
    const ref = resolver.getRefByZodSchemaName(key);
    return { ...acc, [key]: { code, isCircular: !!ref && resolver.isSchemaCircular(ref) } };
  }, {});

  const hbsTemplate = getHbsTemplateDelegate({ resolver, templateName: "models", options });

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: options.includeNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Models, tag, options }),
    zodSchemasData,
  });
}
