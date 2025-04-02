import { OpenAPIV3 } from "openapi-types";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { GenerateType } from "../types/generate";
import { GenerateMetadata, ModelMetadata, QueryMetadata, TsMetaType } from "../types/metadata";
import { GenerateOptions } from "../types/options";
import { getQueryName } from "../utils/generate/generate.query.utils";
import { getNamespaceName, getTagImportPath } from "../utils/generate/generate.utils";
import { invalidVariableNameCharactersToCamel } from "../utils/js.utils";
import { isMediaTypeAllowed, isParamMediaTypeAllowed } from "../utils/openapi.utils";
import { isMutation, isQuery } from "../utils/queries.utils";
import { formatTag } from "../utils/tag.utils";
import { getSchemaTsMetaType, getTsTypeBase } from "../utils/ts.utils";
import { getDataFromOpenAPIDoc } from "./getDataFromOpenAPIDoc";
import { SchemaResolver } from "./SchemaResolver.class";

export async function getMetadataFromOpenAPIDoc(openApiDoc: OpenAPIV3.Document, options: GenerateOptions) {
  const { resolver, data } = await getDataFromOpenAPIDoc(openApiDoc, options);

  const models: ModelMetadata[] = [];
  const queries: QueryMetadata[] = [];

  data.forEach(({ endpoints, zodSchemas }, dataTag) => {
    const excludedTagIndex = options.excludeTags?.findIndex(
      (excludeTag) => excludeTag.toLowerCase() === dataTag.toLowerCase(),
    );
    const isExcludedTag = excludedTagIndex !== -1;
    if (isExcludedTag) {
      return;
    }

    Object.keys(zodSchemas).forEach((zodSchemaName) => {
      const ref = resolver.getRefByZodSchemaName(zodSchemaName);
      const schema = ref ? resolver.getSchemaByRef(ref) : resolver.getSchemaByCompositeZodSchemaName(zodSchemaName);

      const tsTypeInfo = getTsTypeBase({ zodSchemaName, schema, resolver });

      let tsMetaType: TsMetaType | undefined;
      if (schema) {
        tsMetaType = getSchemaTsMetaType({ schema, parentTypes: [tsTypeInfo], resolver });
      }

      models.push({ ...tsTypeInfo, metaType: "primitive", ...tsMetaType });
    });

    endpoints.forEach((endpoint) => {
      const generateType = GenerateType.Queries;
      const tag = formatTag(dataTag);

      queries.push({
        name: getQueryName(endpoint),
        importPath: getTagImportPath({ type: generateType, tag, includeTagDir: true, options }),
        namespace: options.tsNamespaces ? getNamespaceName({ type: generateType, tag, options }) : undefined,
        isQuery: isQuery(endpoint),
        isMutation: isMutation(endpoint),
        params: getQueryMetadataParams({ resolver, endpoint }),
        response: getQueryMetadataResponse({ resolver, endpoint }),
      });
    });
  });

  const metadata: GenerateMetadata = { openApiDoc, models, queries };

  return metadata;
}

function getQueryMetadataParams({
  resolver,
  endpoint,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
}): QueryMetadata["params"] {
  return endpoint.parameters
    .map((param) => {
      let schema: OpenAPIV3.SchemaObject | undefined;
      if (param.parameterObject?.schema) {
        schema = resolver.resolveObject(param.parameterObject.schema);
      } else if (param.bodyObject) {
        const mediaTypes = Object.keys(param.bodyObject.content ?? {});
        const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
        if (matchingMediaType) {
          schema = resolver.resolveObject(param.bodyObject.content?.[matchingMediaType]?.schema);
        }
      }

      const tsTypeInfo = getTsTypeBase({ zodSchemaName: param.zodSchema, schema, resolver });

      let tsMetaType: TsMetaType | undefined;
      if (schema) {
        tsMetaType = getSchemaTsMetaType({ schema, parentTypes: [tsTypeInfo], resolver });
      }

      return {
        name: invalidVariableNameCharactersToCamel(param.name),
        isRequired: param.parameterObject?.required ?? true,
        ...tsTypeInfo,
        ...tsMetaType,
        paramType: param.type,
      } as QueryMetadata["params"][0] & { paramType: EndpointParameter["type"] };
    })
    .sort((a, b) => {
      if (a.isRequired === b.isRequired) {
        const sortedParamTypes = ["Path", "Body", "Query", "Header"];
        return sortedParamTypes.indexOf(a.paramType) - sortedParamTypes.indexOf(b.paramType);
      }
      return a.isRequired ? -1 : 1;
    })
    .map(({ paramType, ...queryParam }) => queryParam);
}

function getQueryMetadataResponse({
  resolver,
  endpoint,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
}): QueryMetadata["response"] {
  let schema: OpenAPIV3.SchemaObject | undefined;
  const matchingMediaType = Object.keys(endpoint.responseObject?.content ?? {}).find(isMediaTypeAllowed);
  if (matchingMediaType) {
    schema = resolver.resolveObject(endpoint.responseObject?.content?.[matchingMediaType]?.schema);
  }

  const tsTypeInfo = getTsTypeBase({ zodSchemaName: endpoint.response, schema, resolver });

  let tsMetaType: TsMetaType | undefined;
  if (schema) {
    tsMetaType = getSchemaTsMetaType({ schema, parentTypes: [tsTypeInfo], resolver });
  }

  return { ...tsTypeInfo, metaType: "primitive", ...tsMetaType };
}
