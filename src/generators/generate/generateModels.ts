import { ZOD_IMPORT } from "src/generators/const/zod.const";
import { getZodSchemaRefs } from "src/generators/core/zod/getZodSchemaRefs";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData } from "src/generators/types/generate";
import { getModelsImports } from "src/generators/utils/generate/generate.imports.utils";
import { getNamespaceName } from "src/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { isEnumZodSchema } from "src/generators/utils/zod-schema.utils";

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

  const zodSchemasData: Record<string, GenerateZodSchemaData> = Object.entries(zodSchemas).reduce(
    (acc, [key, code]) => {
      const ref = resolver.getRefByZodSchemaName(key);
      const schemaObj = resolver.getZodSchemaObj(key);

      const value = {
        code,
        isCircular: !!ref && resolver.isSchemaCircular(ref),
        isEnum: isEnumZodSchema(code),
        schemaObj,
      };

      return { ...acc, [key]: value };
    },
    {},
  );

  const hbsTemplate = getHbsTemplateDelegate(resolver, "models");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options }),
    tag,
    zodSchemasData,
  });
}
