import { BUILDERS_UTILS } from "@/generators/const/deps.const";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getBuilderConfigs } from "@/generators/utils/generate/generate.configs.utils";
import { getHbsTemplateDelegate } from "@/generators/utils/hbs/hbs-template.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";

export function generateConfigs(generateTypeParams: GenerateTypeParams) {
  const { configs, hasZodImport, modelsImports, queriesImports, aclImports } = getBuilderConfigs(generateTypeParams);
  if (configs.length === 0) {
    return;
  }

  const { resolver, tag } = generateTypeParams;

  const hasDynamicInputsImport = configs.some(
    (config) => config.readAll.filters || config.create?.inputDefs || config.update?.inputDefs, // || config.bulkDelete?.inputDefs,
  );
  const dynamicInputsImport: Import = {
    bindings: [BUILDERS_UTILS.dynamicInputs],
    from: resolver.options.dynamicInputsImportPath,
  };

  const hasDynamicColumnsImport = configs.some((config) => config.readAll.columns);
  const dynamicColumnsImport: Import = {
    bindings: [BUILDERS_UTILS.dynamicColumns],
    from: resolver.options.dynamicColumnsImportPath,
  };

  const hbsTemplate = getHbsTemplateDelegate(resolver, "configs");

  return hbsTemplate({
    hasZodImport,
    zodImport: ZOD_IMPORT,
    hasDynamicInputsImport,
    dynamicInputsImport,
    hasDynamicColumnsImport,
    dynamicColumnsImport,
    modelsImports,
    queriesImports,
    aclImports,
    includeNamespace: resolver.options.tsNamespaces,
    namespace: getNamespaceName({ type: GenerateType.Configs, tag, options: resolver.options }),
    configs,
    dynamicInputs: BUILDERS_UTILS.dynamicInputs,
    dynamicColumns: BUILDERS_UTILS.dynamicColumns,
  });
}
