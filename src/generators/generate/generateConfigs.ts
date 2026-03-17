import { ACL_CHECK_HOOK } from "@/generators/const/acl.const";
import { PACKAGE_IMPORT_PATH, ACL_PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import {
  MUTATION_EFFECTS,
  QUERY_MODULE_ENUM,
  QUERY_OPTIONS_TYPES,
  BUILDERS_UTILS,
} from "@/generators/const/deps.const";
import { ZOD_IMPORT } from "@/generators/const/zod.const";
import { BuilderConfig, DynamicColumnsConfig, DynamicInputsConfig } from "@/generators/types/builder-config";
import { Endpoint } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import {
  getImportedEndpointName,
  mapEndpointParamsToFunctionParams,
} from "@/generators/utils/generate/generate.endpoints.utils";
import { getEndpointsImports } from "@/generators/utils/generate/generate.imports.utils";
import { getBuilderConfigs } from "@/generators/utils/generate/generate.configs.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { getQueryModulesImportPath, getQueryTypesImportPath } from "@/generators/utils/generate/generate.utils";
import { getEndpointTag } from "@/generators/utils/tag.utils";
import { capitalize, snakeToCamel } from "@/generators/utils/string.utils";
import { QUERY_HOOKS } from "@/generators/const/queries.const";

export function generateConfigs(generateTypeParams: GenerateTypeParams) {
  const { configs, hasZodImport, modelsImports, aclImports } = getBuilderConfigs(generateTypeParams);
  if (configs.length === 0) {
    return;
  }

  const { resolver, tag } = generateTypeParams;

  const endpoints = configs
    .flatMap((config) => [
      config.create?.mutation,
      config.update?.mutation,
      config.delete?.mutation,
      config.bulkDelete?.mutation,
    ])
    .filter((m): m is Endpoint => typeof m !== "string" && m !== undefined);

  const hasMutation = endpoints.length > 0;
  const hasAclCheck = resolver.options.checkAcl && endpoints.some((e) => e.acl);
  const hasMutationEffects = resolver.options.mutationEffects && hasMutation;
  const hasWorkspaceContext =
    resolver.options.workspaceContext && endpoints.some((e) => resolver.options.workspaceContext); // Simplified check

  const endpointsImports = getEndpointsImports({
    tag,
    endpoints,
    options: resolver.options,
  });

  const queryImport: Import = {
    bindings: [QUERY_HOOKS.mutation],
    from: "@tanstack/react-query",
  };

  const queryTypesImport: Import = {
    bindings: ["OpenApiQueryConfig"],
    typeBindings: [QUERY_OPTIONS_TYPES.mutation],
    from: getQueryTypesImportPath(resolver.options),
  };

  const mutationEffectsImport: Import = {
    bindings: [MUTATION_EFFECTS.hookName],
    typeBindings: [MUTATION_EFFECTS.optionsType],
    from: PACKAGE_IMPORT_PATH,
  };

  const queryModulesImport: Import = {
    bindings: [QUERY_MODULE_ENUM],
    from: getQueryModulesImportPath(resolver.options),
  };

  const aclCheckImport: Import = {
    bindings: [ACL_CHECK_HOOK],
    from: ACL_PACKAGE_IMPORT_PATH,
  };

  const workspaceContextImport: Import = {
    bindings: ["OpenApiWorkspaceContext"],
    from: PACKAGE_IMPORT_PATH,
  };

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
  // Endpoints are needed for inlined mutations
  for (const endpointsImport of endpointsImports) {
    lines.push(renderImport(endpointsImport));
  }

  if (hasMutation) {
    lines.push(renderImport(queryImport));
    lines.push(renderImport(queryTypesImport));
    if (hasMutationEffects) {
      lines.push(renderImport(queryModulesImport));
      lines.push(renderImport(mutationEffectsImport));
    }
    lines.push(renderImport(aclCheckImport));
    if (hasWorkspaceContext) {
      lines.push(renderImport(workspaceContextImport));
    }
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
    lines.push(renderBuilderConfig(config, generateTypeParams));
    lines.push("");
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function renderImport(importData: Import) {
  const namedImports = [
    ...importData.bindings,
    ...(importData.typeBindings ?? []).map((binding) => (importData.typeOnly ? binding : `type ${binding}`)),
  ];
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(namedImports.length > 0 ? [`{ ${namedImports.join(", ")} }`] : []),
  ].join(", ");
  return `import${importData.typeOnly ? " type" : ""} ${names} from "${importData.from}";`;
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

function renderMutationContent(resolver: any, endpoint: Endpoint, tag: string) {
  const hasAclCheck = resolver.options.checkAcl && endpoint.acl;
  const hasMutationEffects = resolver.options.mutationEffects;
  const hasAxiosRequestConfig = resolver.options.axiosRequestConfig;
  const endpointTag = getEndpointTag(endpoint, resolver.options);

  const endpointParams = mapEndpointParamsToFunctionParams(resolver, endpoint, {
    includeFileParam: true,
    modelNamespaceTag: endpointTag,
  });

  const endpointParamsStr = endpointParams.map((p) => `${p.name}${p.required ? "" : "?"}: ${p.type}`).join("; ");

  const destructuredMutationArgs = endpointParams.map((p) => p.name).join(", ");
  const endpointFunction = getImportedEndpointName(endpoint, resolver.options);

  const mutationVariablesType = endpoint.mediaUpload
    ? `{ ${endpointParamsStr}${endpointParamsStr ? "; " : ""}abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }`
    : `{ ${endpointParamsStr} }`;

  const lines: string[] = [];
  lines.push(
    `(options?: AppMutationOptions<typeof ${endpointFunction}, ${mutationVariablesType}>${hasAxiosRequestConfig ? `, config?: AxiosRequestConfig` : ""}) => {`,
  );
  lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();");

  if (hasMutationEffects) {
    lines.push(
      `  const { runMutationEffects } = useMutationEffects<typeof ${QUERY_MODULE_ENUM}.${endpointTag}>({ currentModule: ${QUERY_MODULE_ENUM}.${tag} });`,
    );
  }
  lines.push(`  const { checkAcl } = ${ACL_CHECK_HOOK}();`);
  lines.push("");
  lines.push(`  return ${QUERY_HOOKS.mutation}({`);

  const mutationFnArg = destructuredMutationArgs
    ? `{ ${destructuredMutationArgs}${endpoint.mediaUpload ? `${destructuredMutationArgs ? ", " : ""}abortController, onUploadProgress` : ""} }`
    : "";

  lines.push(`    mutationFn: (${mutationFnArg}) => {`);
  if (hasAclCheck) {
    lines.push(
      `      checkAcl(${getNamespaceName({ type: GenerateType.Acl, tag: endpointTag, options: resolver.options })}.canUse${capitalize(snakeToCamel(endpoint.operationName))}({ ${destructuredMutationArgs} }));`,
    );
  }
  lines.push(
    `      return ${endpointFunction}(${destructuredMutationArgs}${hasAxiosRequestConfig ? `${destructuredMutationArgs ? ", " : ""}config` : ""});`,
  );
  lines.push("    },");
  if (hasMutationEffects) {
    lines.push("    onSuccess: async (...args) => {");
    lines.push("      await runMutationEffects();");
    lines.push("      await options?.onSuccess?.(...args);");
    lines.push("    },");
  }
  lines.push("    ...options,");
  lines.push("  });");
  lines.push("}");
  return lines
    .map((line) => "        " + line)
    .join("\n")
    .trimStart();
}

function renderBuilderConfig(config: BuilderConfig, params: GenerateTypeParams) {
  const { resolver, tag } = params;
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
    if (config.create.schema) {
      lines.push(`        schema: ${config.create.schema},`);
    }
    lines.push(
      `        mutation: ${typeof config.create.mutation === "string" ? config.create.mutation : renderMutationContent(resolver, config.create.mutation, tag)},`,
    );
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
    if (config.update.schema) {
      lines.push(`        schema: ${config.update.schema},`);
    }
    lines.push(
      `        mutation: ${typeof config.update.mutation === "string" ? config.update.mutation : renderMutationContent(resolver, config.update.mutation, tag)},`,
    );
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
    lines.push(
      `        mutation: ${typeof config.delete.mutation === "string" ? config.delete.mutation : renderMutationContent(resolver, config.delete.mutation, tag)},`,
    );
    lines.push("    },");
  }

  if (config.bulkDelete) {
    lines.push("    bulkDelete: {");
    if (config.bulkDelete.acl) {
      lines.push(`        acl: ${config.bulkDelete.acl},`);
    }
    if (config.bulkDelete.schema) {
      lines.push(`        schema: ${config.bulkDelete.schema},`);
    }
    lines.push(
      `        mutation: ${typeof config.bulkDelete.mutation === "string" ? config.bulkDelete.mutation : renderMutationContent(resolver, config.bulkDelete.mutation, tag)},`,
    );
    if (config.bulkDelete.inputDefs) {
      lines.push(
        `        inputDefs: ${BUILDERS_UTILS.dynamicInputs}(${renderInputsConfig(config.bulkDelete.inputDefs)})`,
      );
    }
    lines.push("    },");
  }

  lines.push("};");
  return lines.join("\n");
}
