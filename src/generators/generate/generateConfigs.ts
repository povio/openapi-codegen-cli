import { BUILDERS_UTILS } from "@/generators/const/deps.const";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { BuilderConfig, DynamicColumnsConfig, DynamicInputsConfig } from "@/generators/types/builder-config";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import { getBuilderConfigs } from "@/generators/utils/generate/generate.configs.utils";
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

  const lines: string[] = [];
  if (hasZodImport) {
    lines.push(renderImport(ZOD_IMPORT));
  }
  if (hasDynamicInputsImport) {
    lines.push(renderImport(dynamicInputsImport));
  }
  if (hasDynamicColumnsImport) {
    lines.push(renderImport(dynamicColumnsImport));
  }
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  for (const queriesImport of queriesImports) {
    lines.push(renderImport(queriesImport));
  }
  for (const aclImport of aclImports) {
    lines.push(renderImport(aclImport));
  }
  lines.push("");

  if (resolver.options.tsNamespaces) {
    lines.push(
      `export namespace ${getNamespaceName({ type: GenerateType.Configs, tag, options: resolver.options })} {`,
    );
  }

  for (const config of configs) {
    lines.push(renderBuilderConfig(config));
    lines.push("");
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderImport(importData: Import) {
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
}

function renderInputsConfig(inputsConfig: DynamicInputsConfig) {
  const lines: string[] = [];
  lines.push("{");
  lines.push(`  schema: ${inputsConfig.schema},`);
  lines.push("  options: {");
  lines.push("    inputs: {");
  for (const key of Object.keys(inputsConfig.options.inputs)) {
    lines.push(`      ${key}: true,`);
  }
  lines.push("    },");
  lines.push("  },");
  lines.push("}");
  return lines.join("\n");
}

function renderColumnsConfig(columnsConfig: DynamicColumnsConfig) {
  const lines: string[] = [];
  lines.push("{");
  lines.push(`  schema: ${columnsConfig.schema},`);
  lines.push("  options: {");
  lines.push("    columns: {");
  for (const key of Object.keys(columnsConfig.options.columns)) {
    lines.push(`      ${key}: true,`);
  }
  lines.push("    },");
  if (columnsConfig.options.sortable) {
    lines.push(`    sortable: ${columnsConfig.options.sortable},`);
  }
  lines.push("  },");
  lines.push("}");
  return lines.join("\n");
}

function renderBuilderConfig(config: BuilderConfig) {
  const lines: string[] = [];
  lines.push(`export const ${config.name} = {`);
  lines.push("    meta: {");
  lines.push(`        title: "${config.title}",`);
  lines.push("    },");
  lines.push("    readAll: {");
  if (config.readAll.acl) {
    lines.push(`        acl: ${config.readAll.acl},`);
  }
  lines.push(`        schema: ${config.readAll.columns.schema},`);
  lines.push(`        paginated: ${config.readAll.paginated},`);
  if (config.readAll.infinite) {
    lines.push(`        infinite: ${config.readAll.infinite},`);
  }
  if (config.readAll.filters) {
    lines.push("        filters: {");
    lines.push(`            schema: ${config.readAll.filters.schema},`);
    lines.push(
      `            filterDefs: ${BUILDERS_UTILS.dynamicInputs}(${renderInputsConfig(config.readAll.filters)})`,
    );
    lines.push("        },");
  }
  lines.push(`        columns: ${BUILDERS_UTILS.dynamicColumns}(${renderColumnsConfig(config.readAll.columns)}),`);
  lines.push("    },");

  if (config.read) {
    lines.push("    read: {");
    if (config.read.acl) {
      lines.push(`        acl: ${config.read.acl},`);
    }
    lines.push(`        schema: ${config.read.schema},`);
    lines.push(`        query: ${config.read.query},`);
    lines.push("    },");
  }

  if (config.create) {
    lines.push("    create: {");
    if (config.create.acl) {
      lines.push(`        acl: ${config.create.acl},`);
    }
    if (config.create.inputDefs) {
      lines.push(`        schema: ${config.create.inputDefs.schema},`);
    }
    lines.push(`        mutation: ${config.create.mutation},`);
    if (config.create.inputDefs) {
      lines.push(`        inputDefs: ${BUILDERS_UTILS.dynamicInputs}(${renderInputsConfig(config.create.inputDefs)})`);
    }
    lines.push("    },");
  }

  if (config.update) {
    lines.push("    update: {");
    if (config.update.acl) {
      lines.push(`        acl: ${config.update.acl},`);
    }
    if (config.update.inputDefs) {
      lines.push(`        schema: ${config.update.inputDefs.schema},`);
    }
    lines.push(`        mutation: ${config.update.mutation},`);
    if (config.update.inputDefs) {
      lines.push(`        inputDefs: ${BUILDERS_UTILS.dynamicInputs}(${renderInputsConfig(config.update.inputDefs)})`);
    }
    lines.push("    },");
  }

  if (config.delete) {
    lines.push("    delete: {");
    if (config.delete.acl) {
      lines.push(`        acl: ${config.delete.acl},`);
    }
    lines.push(`        mutation: ${config.delete.mutation},`);
    lines.push("    },");
  }

  lines.push("};");
  return lines.join("\n");
}
