import { ACL_APP_ABILITIES, CASL_ABILITY_BINDING, CASL_ABILITY_IMPORT } from "@/generators/const/acl.const";
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

export function generateAcl({ resolver, data, tag }: GenerateTypeParams) {
  const aclData = getAclData({ resolver, data, tag });
  if (!aclData) {
    return;
  }

  const { hasAdditionalAbilityImports, modelsImports, endpoints } = aclData;

  const caslAbilityTupleImport: Import = {
    bindings: [
      CASL_ABILITY_BINDING.abilityTuple,
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject, CASL_ABILITY_BINDING.subject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
  };

  const lines: string[] = [];
  lines.push(renderImport(caslAbilityTupleImport));
  for (const modelsImport of modelsImports) {
    lines.push(renderImport(modelsImport));
  }
  lines.push("");

  if (resolver.options.tsNamespaces) {
    lines.push(`export namespace ${getNamespaceName({ type: GenerateType.Acl, tag, options: resolver.options })} {`);
  }

  for (const endpoint of endpoints) {
    lines.push(renderAbilityFunction(endpoint));
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
    bindings: [
      CASL_ABILITY_BINDING.pureAbility,
      CASL_ABILITY_BINDING.abilityTuple,
      ...(!appAbilitiesType ? [CASL_ABILITY_BINDING.subjectType] : []),
      ...(hasAdditionalAbilityImports ? [CASL_ABILITY_BINDING.forcedSubject] : []),
    ],
    from: CASL_ABILITY_IMPORT.from,
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
  const names = [
    ...(importData.defaultImport ? [importData.defaultImport] : []),
    ...(importData.bindings ? [`{ ${importData.bindings.join(", ")} }`] : []),
  ].join(", ");
  return `import ${names} from "${importData.from}";`;
}

function renderAbilityFunction(endpoint: Endpoint) {
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
  return lines.join("\n");
}
