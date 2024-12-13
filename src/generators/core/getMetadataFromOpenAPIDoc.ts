import { OpenAPIV3 } from "openapi-types";
import { GenerateType } from "../types/generate";
import { GenerateMetadata, ModelMetadata, QueryMetadata } from "../types/metadata";
import { GenerateOptions } from "../types/options";
import { mapEndpointParamsToFunctionParams } from "../utils/generate/generate.endpoints.utils";
import { getQueryName } from "../utils/generate/generate.query.utils";
import { getNamespaceName, getTagFileName } from "../utils/generate/generate.utils";
import { getZodSchemaInferedTypeName } from "../utils/generate/generate.zod.utils";
import { formatTag } from "../utils/openapi.utils";
import { isMutation, isQuery } from "../utils/queries.utils";
import { getSchemaTsProperties } from "../utils/ts.utils";
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
      const generateType = GenerateType.Models;
      const tag = formatTag(dataTag);

      const name = getZodSchemaInferedTypeName(zodSchemaName, options);
      const filePath = getTagFileName({ type: generateType, tag, includeTagDir: true, options });
      const namespace = options.includeNamespaces ? getNamespaceName({ type: generateType, tag, options }) : undefined;

      const ref = resolver.getRefByZodSchemaName(zodSchemaName);
      const openApiSchema = ref
        ? resolver.getSchemaByRef(ref)
        : resolver.getSchemaByDiscriminatorZodSchemaName(zodSchemaName);

      models.push({
        name,
        filePath,
        namespace,
        properties: openApiSchema ? getSchemaTsProperties({ schema: openApiSchema, resolver, options }) : [],
      });
    });

    endpoints.forEach((endpoint) => {
      const generateType = GenerateType.Queries;
      const tag = formatTag(dataTag);

      const name = getQueryName(endpoint);
      const filePath = getTagFileName({ type: generateType, tag, includeTagDir: true, options });
      const namespace = options.includeNamespaces ? getNamespaceName({ type: generateType, tag, options }) : undefined;

      console.log(name, endpoint.method, isQuery(endpoint));
      queries.push({
        name,
        filePath,
        namespace,
        isQuery: isQuery(endpoint),
        isMutation: isMutation(endpoint),
        params: mapEndpointParamsToFunctionParams({ resolver, endpoint, options }).map(
          ({ name, type, required, tag }) => {
            const splitType = type.split(".");
            return {
              name,
              type: splitType[splitType.length - 1],
              namespace: splitType.length > 1 ? splitType[0] : undefined,
              required,
              filePath: tag
                ? getTagFileName({ type: GenerateType.Models, tag, includeTagDir: true, options })
                : undefined,
            };
          },
        ),
      });
    });
  });

  const metadata: GenerateMetadata = { openApiDoc, models, queries };

  return metadata;
}
