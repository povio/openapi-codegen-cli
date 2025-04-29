import { QUERIES_MODULE_NAME } from "../const/queries.const";
import { GenerateType, GenerateTypeParams } from "../types/generate";
import { getEntityImports, mergeImports } from "../utils/generate/generate.imports.utils";
import { getTagKeys, getTagModuleName } from "../utils/generate/generate.query.utils";
import { getNamespaceName } from "../utils/generate/generate.utils";
import { getHbsTemplateDelegate } from "../utils/hbs/hbs-template.utils";
import { isQuery } from "../utils/query.utils";

export function generateQueryModules({ resolver, data }: Omit<GenerateTypeParams, "tag">) {
  const modules: { tag: string; namespace: string; hasKeys: boolean }[] = [];

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
      hasKeys: endpoints.filter(isQuery).length > 0,
    });
  });

  const moduleNameImports = getEntityImports({
    tags: modules.map(({ tag }) => tag),
    entityName: QUERIES_MODULE_NAME,
    getAliasEntityName: getTagModuleName,
    type: GenerateType.Queries,
    sameDir: true,
    options: resolver.options,
  });

  const keysImports = getEntityImports({
    tags: modules.filter(({ hasKeys }) => hasKeys).map(({ tag }) => tag),
    entityName: "keys",
    getAliasEntityName: getTagKeys,
    type: GenerateType.Queries,
    sameDir: true,
    options: resolver.options,
  });

  const imports = mergeImports(resolver.options, moduleNameImports, keysImports);

  const hbsTemplate = getHbsTemplateDelegate(resolver, "query-modules");

  return hbsTemplate({
    imports,
    includeNamespace: resolver.options.tsNamespaces,
    queriesModuleName: QUERIES_MODULE_NAME,
    modules,
  });
}
