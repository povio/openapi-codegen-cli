import { ACL_APP_ABILITIES, CASL_ABILITY_BINDING, CASL_ABILITY_IMPORT } from "@/generators/const/acl.const";
import { PACKAGE_IMPORT_PATH } from "@/generators/const/package.const";
import { Endpoint } from "@/generators/types/endpoint";
import { GenerateType, GenerateTypeParams, Import } from "@/generators/types/generate";
import {
  getAbilityAction,
  getAbilityConditionsTypes,
  getAbilityDescription,
  getAbilityFunctionName,
  getAbilitySubject,
  getAbilitySubjectTypes,
  getAclData,
  getAppAbilitiesType,
  hasAbilityConditions,
} from "@/generators/utils/generate/generate.acl.utils";
import { getInfiniteQueryName, getQueryName } from "@/generators/utils/generate/generate.query.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { capitalize } from "@/generators/utils/string.utils";

export function generateAcl({ resolver, data, tag }: GenerateTypeParams) {
  const aclData = getAclData({ resolver, data, tag });
  if (!aclData) {
    return;
  }

  const { hasAdditionalAbilityImports, modelsImports, endpoints } = aclData;
  const hasWorkspaceContext = endpoints.some((endpoint) => getWorkspaceConditionNames(resolver, endpoint).length > 0);

  const caslAbilityTupleImport: Import = {
    bindings: [
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject, CASL_ABILITY_BINDING.subject] : []),
    ],
    typeBindings: [CASL_ABILITY_BINDING.abilityTuple],
    from: CASL_ABILITY_IMPORT.from,
  };
  const workspaceContextImport: Import = {
    bindings: ["useWorkspaceContext"],
    from: PACKAGE_IMPORT_PATH,
  };

  const lines: string[] = [];
  lines.push(renderImport(caslAbilityTupleImport));
  if (hasWorkspaceContext) {
    lines.push(renderImport(workspaceContextImport));
  }
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  lines.push("");

  if (resolver.options.tsNamespaces) {
    lines.push(`export namespace ${getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options })} {`);
  }

  for (const endpoint of endpoints) {
    lines.push(renderAbilityFunction({ resolver, endpoint }));
    lines.push("");
  }

  if (resolver.options.tsNamespaces) {
    lines.push("}");
  }

  return lines.join("\n").trimEnd() + "\n";
}

export function generateAppAcl({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const { appAbilitiesType, hasAdditionalAbilityImports, modelsImports } = getAppAbilitiesType({ resolver, data });

  const caslAbilityTupleImport: Import = {
    bindings: [],
    typeBindings: [
      CASL_ABILITY_BINDING.pureAbility,
      CASL_ABILITY_BINDING.abilityTuple,
      ...(!appAbilitiesType ? [CASL_ABILITY_BINDING.subjectType] : []),
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
    typeOnly: true,
  };

  const lines: string[] = [];
  lines.push(renderImport(caslAbilityTupleImport));
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  lines.push("");

  if (appAbilitiesType) {
    lines.push(`export type ${ACL_APP_ABILITIES} = `);
    for (const [action, subjects] of Object.entries(appAbilitiesType)) {
      lines.push(`| ${CASL_ABILITY_BINDING.abilityTuple}<"${action}", ${subjects.join(" | ")}>`);
    }
  } else {
    lines.push(
      `export type ${ACL_APP_ABILITIES} = ${CASL_ABILITY_BINDING.abilityTuple}<string, ${CASL_ABILITY_BINDING.subjectType}>;`,
    );
  }
  lines.push("");
  lines.push(`export type AppAbility = PureAbility<${ACL_APP_ABILITIES}>;`);
  return lines.join("\n");
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

function getWorkspaceContextAllowList(workspaceContext: GenerateTypeParams["resolver"]["options"]["workspaceContext"]) {
  return new Set(workspaceContext);
}

function getWorkspaceConditionNames(resolver: GenerateTypeParams["resolver"], endpoint: Endpoint) {
  const allowList = getWorkspaceContextAllowList(resolver.options.workspaceContext);
  return (getAbilityConditionsTypes(endpoint) ?? [])
    .map((condition) => condition.name)
    .filter((name) => allowList.has(name));
}

function renderWorkspaceAclHook({
  resolver,
  endpoint,
}: {
  resolver: GenerateTypeParams["resolver"];
  endpoint: Endpoint;
}) {
  const abilityConditionsTypes = getAbilityConditionsTypes(endpoint) ?? [];
  const workspaceConditionNames = getWorkspaceConditionNames(resolver, endpoint);
  if (workspaceConditionNames.length === 0) {
    return;
  }

  const workspaceConditionNameSet = new Set(workspaceConditionNames);
  const objectRequired = abilityConditionsTypes.some(
    (propertyType) => propertyType.required && !workspaceConditionNameSet.has(propertyType.name),
  );
  const objectParams = abilityConditionsTypes
    .map((propertyType) => {
      const isWorkspaceCondition = workspaceConditionNameSet.has(propertyType.name);
      return `${propertyType.name}${propertyType.required && !isWorkspaceCondition ? "" : "?"}: ${(propertyType.type ?? "") + (propertyType.zodSchemaName ?? "")}, `;
    })
    .join("");
  const contextType = abilityConditionsTypes
    .filter((propertyType) => workspaceConditionNameSet.has(propertyType.name))
    .map((propertyType) => `${propertyType.name}?: ${(propertyType.type ?? "") + (propertyType.zodSchemaName ?? "")}`)
    .join("; ");
  const contextBindings = workspaceConditionNames.map((name) => `${name}: ${name}Workspace`).join(", ");

  const lines: string[] = [];
  lines.push(`export const use${capitalize(getAbilityFunctionName(endpoint))} = (`);
  lines.push(`  object${objectRequired ? "" : "?"}: { ${objectParams} } `);
  lines.push(") => {");
  lines.push(`  const { ${contextBindings} } = useWorkspaceContext<{ ${contextType} }>();`);
  for (const conditionName of workspaceConditionNames) {
    const resolvedName = `normalize${capitalize(conditionName)}`;
    lines.push(`  const ${resolvedName} = object?.${conditionName} ?? ${conditionName}Workspace;`);
    lines.push(`  if (!${resolvedName}) {`);
    lines.push(`    throw Error(\`${capitalize(conditionName)} not provided\`);`);
    lines.push("  }");
  }
  lines.push(
    `  return ${getAbilityFunctionName(endpoint)}({ ...object, ${workspaceConditionNames
      .map((conditionName) => `${conditionName}: normalize${capitalize(conditionName)}`)
      .join(", ")} });`,
  );
  lines.push("};");
  return lines.join("\n");
}

function renderAbilityFunction({
  resolver,
  endpoint,
}: {
  resolver: GenerateTypeParams["resolver"];
  endpoint: Endpoint;
}) {
  const abilityConditionsTypes = getAbilityConditionsTypes(endpoint) ?? [];
  const hasConditions = hasAbilityConditions(endpoint);
  const lines: string[] = [];
  const abilityQuery =
    endpoint.method === "get"
      ? endpoint.mediaDownload
        ? `\`${getQueryName(endpoint)}\` query or \`${getQueryName(endpoint, true)}\` mutation`
        : `\`${getQueryName(endpoint)}\` query`
      : `\`${getQueryName(endpoint)}\` mutation`;
  lines.push("/**");
  lines.push(
    ` * Use for ${abilityQuery} ability. ${hasConditions ? "For global ability, omit the object parameter." : ""}${getAbilityDescription(endpoint) ? "" : ""}`,
  );
  if (getAbilityDescription(endpoint)) {
    lines.push(` * @description ${getAbilityDescription(endpoint)}`);
  }
  if (hasConditions) {
    for (const propertyType of abilityConditionsTypes) {
      lines.push(
        ` * @param { ${(propertyType.type ?? "") + (propertyType.zodSchemaName ?? "")} } object.${propertyType.name} ${propertyType.name} from ${propertyType.info}`,
      );
    }
  }
  lines.push(` * @returns { AbilityTuple } An ability tuple indicating the user's ability to use ${abilityQuery}`);
  lines.push(" */");
  lines.push(`export const ${getAbilityFunctionName(endpoint)} = (`);
  if (hasConditions) {
    lines.push(
      `  object?: { ${abilityConditionsTypes
        .map(
          (propertyType) =>
            `${propertyType.name}${propertyType.required ? "" : "?"}: ${(propertyType.type ?? "") + (propertyType.zodSchemaName ?? "")}, `,
        )
        .join("")} } `,
    );
  }
  lines.push(") => [");
  lines.push(`  "${getAbilityAction(endpoint)}",`);
  lines.push(
    `  ${
      hasConditions
        ? `object ? subject("${getAbilitySubject(endpoint)}", object) : "${getAbilitySubject(endpoint)}"`
        : `"${getAbilitySubject(endpoint)}"`
    }`,
  );
  lines.push(
    `] as ${CASL_ABILITY_BINDING.abilityTuple}<"${getAbilityAction(endpoint)}", ${getAbilitySubjectTypes(endpoint).join(" | ")}>;`,
  );
  const workspaceAclHook = renderWorkspaceAclHook({ resolver, endpoint });
  if (workspaceAclHook) {
    lines.push("");
    lines.push(workspaceAclHook);
  }
  return lines.join("\n");
}
