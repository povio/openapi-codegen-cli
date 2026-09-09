import { GenerateType, GenerateTypeParams } from "@/generators/types/generate";
import { getNamespaceName } from "@/generators/utils/namespace.utils";

export function generateQueryModules({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const nativeContent = (
    resolver as GenerateTypeParams["resolver"] & { getNativeRenderedShared?: (name: string) => string | undefined }
  ).getNativeRenderedShared?.("queryModules");
  if (nativeContent) return nativeContent;

  const modules: { tag: string; namespace: string }[] = [];

  data.forEach((_, tag) => {
    const endpoints = data.get(tag)?.endpoints;
    if (!endpoints || endpoints.length === 0) {
      return;
    }

    modules.push({
      tag,
      namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    });
  });

  const lines: string[] = [];
  lines.push("export const enum QueryModule {");
  for (const module of modules) {
    lines.push(`   ${module.tag} = "${module.namespace}",`);
  }
  lines.push("}");
  return lines.join("\n");
}
