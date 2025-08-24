import { BrandEnum } from "src/generators/const/brands.const";
import { ZOD_EXTENDED } from "src/generators/const/deps.const";
import { ZOD_IMPORT } from "src/generators/const/zod.const";
import { iterateSchema, OnSchemaCallbackData } from "src/generators/core/openapi/iterateSchema";
import { getZodSchemaRefs } from "src/generators/core/zod/getZodSchemaRefs";
import { GenerateType, GenerateTypeParams, GenerateZodSchemaData, Import } from "src/generators/types/generate";
import { matchesBrand } from "src/generators/utils/brand.utils";
import { getModelsImports } from "src/generators/utils/generate/generate.imports.utils";
import { getNamespaceName, getZodExtendedImportPath } from "src/generators/utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { isSchemaObject } from "src/generators/utils/openapi-schema.utils";
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

      let hasBrand = false;
      if (schemaObj && isSchemaObject(schemaObj)) {
        const onSchema = (data: OnSchemaCallbackData<never>) => {
          if (data.type === "reference") {
            return true;
          }
          Object.values(BrandEnum).forEach((brand) => {
            if (
              (data.schema && isSchemaObject(data.schema) && matchesBrand(data.schema, brand)) ||
              (data.parentSchema && isSchemaObject(data.parentSchema) && matchesBrand(data.parentSchema, brand))
            ) {
              hasBrand = true;
            }
          });
        };
        iterateSchema(schemaObj, { onSchema });
      }

      const value = {
        code,
        isCircular: !!ref && resolver.isSchemaCircular(ref),
        isEnum: isEnumZodSchema(code),
        schemaObj,
        hasBrand,
      };

      return { ...acc, [key]: value };
    },
    {},
  );

  const hasZodExtendedImport =
    resolver.options.branded && Object.values(zodSchemasData).some((zodSchema) => zodSchema.hasBrand);
  const zodExtendedImport: Import = {
    bindings: [ZOD_EXTENDED.namespace],
    from: getZodExtendedImportPath(resolver.options),
  };

  const hbsTemplate = getHbsTemplateDelegate(resolver, "models");

  return hbsTemplate({
    zodImport: ZOD_IMPORT,
    hasZodExtendedImport,
    zodExtendedImport,
    modelsImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Models, tag, options: resolver.options }),
    tag,
    zodSchemasData,
  });
}
