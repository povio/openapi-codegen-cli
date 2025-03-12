import { ZOD_IMPORT } from "../const/zod.const";
import { getZodSchemaRefs } from "../core/zod/getZodSchemaRefs";
import { GenerateType, GenerateTypeParams } from "../types/generate";
import { getModelsImports } from "../utils/generate/generate.imports.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isEnumZodSchema } from "../utils/zod-schema.utils";

export function generateModels({ resolver, data, tag = "" }: GenerateTypeParams) {
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
  });

  const zodSchemasData = Object.entries(zodSchemas).reduce((acc, [key, code]) => {
    const ref = resolver.getRefByZodSchemaName(key);
    return {
      ...acc,
      [key]: { code, isCircular: !!ref && resolver.isSchemaCircular(ref), isEnum: isEnumZodSchema(code) },
    };
  }, {});

  const hbsTemplate = getHbsTemplateDelegate(resolver, "models");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: resolver.options.includeNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options }),
    zodSchemasData,
  });
}
