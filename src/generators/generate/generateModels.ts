import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { getZodSchemaRefs } from "@/generators/core/zod/getZodSchemaRefs";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData } from "@/generators/types/generate";
import { getModelsImports } from "@/generators/utils/generate/generate.imports.utils";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isEnumZodSchema } from "@/generators/utils/zod-schema.utils";

export function generateModels({ resolver, data, tag }: GenerateTypeParams) {
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
      const schemaObj = resolver.getZodSchemaObj(key);

      const value = {
        code,
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
