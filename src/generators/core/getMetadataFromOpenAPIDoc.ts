import { OpenAPIV3 } from "openapi-types";
import { GenerateType } from "../types/generate";
import { GenerateMetadata, ModelMetadata, QueryMetadata } from "../types/metadata";
import { GenerateOptions } from "../types/options";
import { getQueryName } from "../utils/generate/generate.query.utils";
import { getNamespaceName, getTagFileName } from "../utils/generate/generate.utils";
import { getZodSchemaInferedTypeName } from "../utils/generate/generate.zod.utils";
import { formatTag } from "../utils/openapi.utils";
import { getDataFromOpenAPIDoc } from "./getDataFromOpenAPIDoc";

export async function getMetadataFromOpenAPIDoc({
  openApiDoc,
  options,
}: {
  openApiDoc: OpenAPIV3.Document;
  options: GenerateOptions;
}) {
  const { resolver, data } = await getDataFromOpenAPIDoc({ openApiDoc, options });

  const models: ModelMetadata[] = [];
  const queries: QueryMetadata[] = [];

  data.forEach(({ endpoints, zodSchemas }, dataTag) => {
    const excludedTagIndex = options.excludeTags?.findIndex(
      (excludeTag) => excludeTag.toLocaleLowerCase() === dataTag.toLocaleLowerCase(),
    );
    const isExcludedTag = excludedTagIndex !== -1;
    if (isExcludedTag) {
      return;
    }

    Object.keys(zodSchemas).forEach((zodSchemaName) => {
      const type = GenerateType.Models;
      const tag = formatTag(dataTag);

      const name = getZodSchemaInferedTypeName(zodSchemaName, options);
      const filePath = getTagFileName({ type, tag, includeTagDir: true, options });
      const namespace = options.includeNamespaces ? getNamespaceName({ type, tag, options }) : undefined;

      const ref = resolver.getRefByZodSchemaName(zodSchemaName);
      const openApiSchema = ref
        ? resolver.getSchemaByRef(ref)
        : resolver.getSchemaByDiscriminatorZodSchemaName(zodSchemaName);

      models.push({ name, zodSchemaName, filePath, namespace, openApiSchema });
    });

    endpoints.forEach((endpoint) => {
      const type = GenerateType.Queries;
      const tag = formatTag(dataTag);

      const name = getQueryName(endpoint);
      const filePath = getTagFileName({ type, tag, includeTagDir: true, options });
      const namespace = options.includeNamespaces ? getNamespaceName({ type, tag, options }) : undefined;

      queries.push({ name, filePath, namespace });
    });
  });

  const metadata: GenerateMetadata = { openApiDoc, models, queries };

  return metadata;
}
