import { GenerateType, GenerateTypeParams } from "src/generators/types/generate";
import { getHbsTemplateDelegate } from "src/generators/utils/hbs/hbs-template.utils";
import { getNamespaceName } from "src/generators/utils/namespace.utils";

export function generateQueryModules({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
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

  const hbsTemplate = getHbsTemplateDelegate(resolver, "query-modules");

  return hbsTemplate({ modules });
}
