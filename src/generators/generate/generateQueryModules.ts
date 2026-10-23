import { GenerateType, GenerateTypeParams } from "@/generators/types/generate";
import { getQueryName } from "@/generators/utils/generate/generate.query.utils";
import { getImportPath } from "@/generators/utils/generate/generate.imports.utils";
import { getQueryTypesImportPath, getTagImportPath } from "@/generators/utils/generate/generate.utils";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import { isMutation } from "@/generators/utils/query.utils";

export function generateQueryModules({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const nativeContent = (
    resolver as GenerateTypeParams["resolver"] & { getNativeRenderedShared?: (name: string) => string | undefined }
  ).getNativeRenderedShared?.("queryModules");
  if (nativeContent) return nativeContent;

  const modules: { tag: string; namespace: string; mutationHooks: string[] }[] = [];

  data.forEach((_, tag) => {
    const endpoints = data.get(tag)?.endpoints;
    if (!endpoints || endpoints.length === 0) {
      return;
    }

    modules.push({
      tag,
      namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
      mutationHooks: endpoints.filter(isMutation).map((endpoint) => getQueryName(endpoint, true)),
    });
  });

  // Each module's mutation `data` and `variables`, for `InvalidationMap<QueryModule, QueryModuleMutations>`.
  const mutationModules = modules.filter((module) => module.mutationHooks.length > 0);
  const lines: string[] = [];
  if (mutationModules.length > 0) {
    lines.push(`import type { MutationEffectsOf } from "${getQueryTypesImportPath(resolver.options)}";`);
    for (const module of mutationModules) {
      const from = `${getImportPath(resolver.options, true)}${getTagImportPath({
        type: GenerateType.Queries,
        tag: module.tag,
        options: resolver.options,
      })}`;
      lines.push(
        resolver.options.tsNamespaces
          ? `import type { ${module.namespace} } from "${from}";`
          : `import type * as ${module.namespace} from "${from}";`,
      );
    }
    lines.push("");
  }
  lines.push("export const enum QueryModule {");
  for (const module of modules) {
    lines.push(`   ${module.tag} = "${module.namespace}",`);
  }
  lines.push("}");
  lines.push("");
  lines.push("export interface QueryModuleMutations {");
  for (const module of mutationModules) {
    const hooks = module.mutationHooks.map((hook) => `typeof ${module.namespace}.${hook}`).join(" | ");
    lines.push(`   [QueryModule.${module.tag}]: MutationEffectsOf<${hooks}>;`);
  }
  lines.push("}");
  lines.push("");
  // Registers the types globally, so a bare `InvalidationMap` is keyed and typed by this client.
  lines.push("declare global {");
  lines.push("   interface OpenApiCodegenQueryModules { queryModule: QueryModule }");
  lines.push("   interface OpenApiCodegenQueryModuleMutations extends QueryModuleMutations {}");
  lines.push("}");
  return lines.join("\n");
}
