import { GenerateType, GenerateTypeParams } from "../types/generate";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";

export function generateInvalidateQueries({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const modules: { tag: string; namespace: string }[] = [];

  data.forEach((_, tag) => {
    const excludedTag = resolver.options.excludeTags.find(
      (excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase(),
    );
    if (excludedTag) {
      return;
    }

    const endpoints = data.get(tag)?.endpoints;
    if (!endpoints || endpoints.length === 0) {
      return;
    }

    modules.push({
      tag,
      namespace: getNamespaceName({ type: GenerateType.Queries, tag, options: resolver.options }),
    });
  });

  const hbsTemplate = getHbsTemplateDelegate(resolver, "invalidate-queries");

  return hbsTemplate({ modules });
}
