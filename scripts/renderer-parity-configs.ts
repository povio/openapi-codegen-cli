import { DEFAULT_GENERATE_OPTIONS } from "../src/generators/const/options.const";
import type { GenerateOptions } from "../src/generators/types/options";

export type ParityScenario = { name: string; options: Partial<GenerateOptions>; invalid?: string };
const layoutKeys = [
  "splitByTags",
  "tsNamespaces",
  "modelsInCommon",
  "modelsInModules",
  "modelsOnly",
  "treeShakeableNamespaces",
] as const;
type LayoutKey = (typeof layoutKeys)[number];
type LifecycleKey = "input" | "output" | "clearOutput" | "incremental";
type OptionKey = Exclude<keyof GenerateOptions, LayoutKey | LifecycleKey>;
const bool = <K extends OptionKey>(key: K) =>
  [false, true].map((value) => ({ [key]: value }) as Partial<GenerateOptions>);
const configs = DEFAULT_GENERATE_OPTIONS.configs;

// Every renderer option must have representative values; adding an option fails typechecking
// until its coverage is classified. Strings/arrays have unbounded domains, so these are examples.
export const optionCases = {
  defaultTag: [{ defaultTag: "Shared" }],
  includeTags: [{ includeTags: ["pet"] }, { includeTags: ["PET"], excludeTags: ["pet"] }],
  excludeTags: [{ excludeTags: ["pet"] }],
  excludePathRegex: [{ excludePathRegex: "^/pet" }],
  excludeRedundantZodSchemas: bool("excludeRedundantZodSchemas"),
  tsPath: [{ tsPath: "@/openapi" }],
  importPath: ["ts", "relative", "absolute"].map((importPath) => ({ importPath })) as Partial<GenerateOptions>[],
  configs: [
    {
      configs: Object.fromEntries(
        Object.entries(configs).map(([key, value]) => [
          key,
          {
            outputFileNameSuffix: `${value.outputFileNameSuffix}-custom`,
            namespaceSuffix: `${value.namespaceSuffix}Custom`,
          },
        ]),
      ) as GenerateOptions["configs"],
    },
  ],
  baseUrl: [{ baseUrl: "https://example.test/api" }],
  standalone: bool("standalone"),
  schemaSuffix: [{ schemaSuffix: "Validator" }, { schemaSuffix: "" }],
  enumSuffix: [{ enumSuffix: "Kind" }, { enumSuffix: "" }],
  withImplicitRequiredProps: bool("withImplicitRequiredProps"),
  withDefaultValues: bool("withDefaultValues"),
  withDescription: bool("withDescription"),
  allReadonly: bool("allReadonly"),
  extractEnums: bool("extractEnums"),
  replaceOptionalWithNullish: bool("replaceOptionalWithNullish"),
  restClient: [{ restClient: "axios" }, { restClient: "native" }],
  restClientImportPath: [{ restClientImportPath: "" }, { restClientImportPath: "@test/custom-client" }],
  zodImportPath: [{ zodImportPath: "@test/zod" }],
  errorHandlingImportPath: [{ errorHandlingImportPath: "@test/errors" }],
  withDeprecatedEndpoints: bool("withDeprecatedEndpoints"),
  removeOperationPrefixEndingWith: [
    { removeOperationPrefixEndingWith: "" },
    { removeOperationPrefixEndingWith: "Controller_" },
  ],
  parseRequestParams: bool("parseRequestParams"),
  inlineEndpoints: bool("inlineEndpoints"),
  inlineEndpointsExcludeModules: [{ inlineEndpoints: true, inlineEndpointsExcludeModules: ["pet"] }],
  queryTypesImportPath: [{ queryTypesImportPath: "@test/query-types" }],
  mutationEffectsImportPath: [{ mutationEffects: true, mutationEffectsImportPath: "@test/mutation-effects" }],
  axiosRequestConfig: bool("axiosRequestConfig"),
  mutationEffects: bool("mutationEffects"),
  mutationDefaultOnError: bool("mutationDefaultOnError"),
  workspaceContext: [{ workspaceContext: [] }, { workspaceContext: ["officeId"] }],
  prefetchQueries: bool("prefetchQueries"),
  mutationScope: [false, true, { include: ["Items/update"] }, { exclude: ["Items/update"] }].map((mutationScope) => ({
    mutationScope,
  })),
  infiniteQueries: bool("infiniteQueries"),
  infiniteQueryParamNames: [{ infiniteQueries: true, infiniteQueryParamNames: { page: "pageIndex" } }],
  infiniteQueryResponseParamNames: [
    {
      infiniteQueries: true,
      infiniteQueryResponseParamNames: { page: "pageIndex", totalItems: "count", limit: "pageSize" },
    },
  ],
  acl: bool("acl"),
  checkAcl: [false, true].map((checkAcl) => ({ acl: true, checkAcl })),
  abilityContextGenericAppAbilities: [false, true].map((abilityContextGenericAppAbilities) => ({
    acl: true,
    abilityContextGenericAppAbilities,
  })),
  abilityContextImportPath: [{ acl: true, abilityContextImportPath: "@test/ability-context" }],
  aclCheckImportPath: [{ acl: true, aclCheckImportPath: "@test/acl" }],
  builderConfigs: bool("builderConfigs"),
  filterParamName: [{ builderConfigs: true, filterParamName: "filters" }],
  dataResponseParamNames: [{ builderConfigs: true, dataResponseParamNames: ["results"] }],
  dynamicInputsImportPath: [{ builderConfigs: true, dynamicInputsImportPath: "@test/inputs" }],
  dynamicColumnsImportPath: [{ builderConfigs: true, dynamicColumnsImportPath: "@test/columns" }],
} satisfies Record<OptionKey, readonly Partial<GenerateOptions>[]>;

export const lifecycleOptions = [
  "input",
  "output",
  "clearOutput",
  "incremental",
] as const satisfies readonly LifecycleKey[];
export const parityScenarios: ParityScenario[] = [];
for (let bits = 0; bits < 64; bits++) {
  const options = Object.fromEntries(
    layoutKeys.map((key, bit) => [key, Boolean(bits & (1 << bit))]),
  ) as Partial<GenerateOptions>;
  parityScenarios.push({
    name: `layout-${bits.toString(2).padStart(6, "0")}`,
    options,
    ...(options.modelsInCommon && options.modelsInModules
      ? { invalid: "modelsInCommon and modelsInModules cannot both be enabled" }
      : {}),
  });
}
for (const [key, variants] of Object.entries(optionCases)) {
  for (const [index, variant] of variants.entries()) {
    for (const modelsInCommon of [false, true]) {
      parityScenarios.push({
        name: `option-${key}-${index}-${modelsInCommon ? "common" : "local"}`,
        options: { tsNamespaces: true, modelsInCommon, ...variant },
      });
    }
  }
}
// Interacting transport/output choices, beyond one-option-at-a-time variants.
for (const restClient of ["axios", "native"] as const)
  for (const importPath of ["ts", "relative", "absolute"] as const)
    for (const standalone of [false, true]) {
      parityScenarios.push({
        name: `transport-${restClient}-${importPath}-${standalone}`,
        options: { modelsInCommon: true, restClient, importPath, standalone, axiosRequestConfig: true },
      });
    }
