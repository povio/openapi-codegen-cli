import { OpenAPIV3 } from "openapi-types";
import { Endpoint, EndpointParameter } from "../types/endpoint";
import { GenerateType } from "../types/generate";
import { GenerateMetadata, ModelMetadata, QueryMetadata, TsNestedDataType } from "../types/metadata";
import { GenerateOptions } from "../types/options";
import { getQueryName } from "../utils/generate/generate.query.utils";
import { getNamespaceName, getTagFileName } from "../utils/generate/generate.utils";
import { invalidVariableNameCharactersToCamel } from "../utils/js.utils";
import { isSchemaObject } from "../utils/openapi-schema.utils";
import { formatTag, isMediaTypeAllowed, isParamMediaTypeAllowed, isReferenceObject } from "../utils/openapi.utils";
import { isMutation, isQuery } from "../utils/queries.utils";
import { getSchemaTsNestedDataType, getTypeInfo } from "../utils/ts.utils";
import { getDataFromOpenAPIDoc } from "./getDataFromOpenAPIDoc";
import { SchemaResolver } from "./SchemaResolver.class";

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
      const ref = resolver.getRefByZodSchemaName(zodSchemaName);
      const schema = ref ? resolver.getSchemaByRef(ref) : resolver.getSchemaByDiscriminatorZodSchemaName(zodSchemaName);

      const typeInfo = getTypeInfo({ zodSchemaName, schema, resolver, options });

      let tsNestedDataType: TsNestedDataType | undefined;
      if (schema) {
        tsNestedDataType = getSchemaTsNestedDataType({ schema, resolver, options });
      }

      models.push({ ...typeInfo, dataType: "primitive", ...tsNestedDataType });
    });

    endpoints.forEach((endpoint) => {
      const generateType = GenerateType.Queries;
      const tag = formatTag(dataTag);

      queries.push({
        name: getQueryName(endpoint),
        filePath: getTagFileName({ type: generateType, tag, includeTagDir: true, options }),
        namespace: options.includeNamespaces ? getNamespaceName({ type: generateType, tag, options }) : undefined,
        isQuery: isQuery(endpoint),
        isMutation: isMutation(endpoint),
        params: getQueryMetadataParams({ resolver, endpoint, options }),
        response: getQueryMetadataResponse({ resolver, endpoint, options }),
      });
    });
  });

  const metadata: GenerateMetadata = { openApiDoc, models, queries };

  return metadata;
}

function getQueryMetadataParams({
  resolver,
  endpoint,
  options,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  options: GenerateOptions;
}): QueryMetadata["params"] {
  return endpoint.parameters
    .map((param) => {
      let schema: OpenAPIV3.SchemaObject | undefined;
      if (param.parameterObject?.schema && isSchemaObject(param.parameterObject.schema)) {
        schema = param.parameterObject?.schema as OpenAPIV3.SchemaObject;
      } else if (param.bodyObject) {
        const mediaTypes = Object.keys(param.bodyObject.content ?? {});
        const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
        if (matchingMediaType) {
          const obj = param.bodyObject.content?.[matchingMediaType]?.schema;
          schema = isReferenceObject(obj) ? resolver.getSchemaByRef(obj.$ref) : obj;
        }
      }

      const typeInfo = getTypeInfo({ zodSchemaName: param.zodSchema, schema, resolver, options });

      let tsNestedDataType: TsNestedDataType | undefined;
      if (schema) {
        tsNestedDataType = getSchemaTsNestedDataType({ schema, resolver, options });
      }

      return {
        name: invalidVariableNameCharactersToCamel(param.name),
        isRequired: param.parameterObject?.required ?? true,
        ...typeInfo,
        ...tsNestedDataType,
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
  options,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  options: GenerateOptions;
}): QueryMetadata["response"] {
  let schema: OpenAPIV3.SchemaObject | undefined;
  const matchingMediaType = Object.keys(endpoint.responseObject?.content ?? {}).find(isMediaTypeAllowed);
  if (matchingMediaType) {
    const obj = endpoint.responseObject?.content?.[matchingMediaType]?.schema;
    schema = isReferenceObject(obj) ? resolver.getSchemaByRef(obj.$ref) : obj;
  }

  const typeInfo = getTypeInfo({ zodSchemaName: endpoint.response, schema, resolver, options });

  let tsNestedDataType: TsNestedDataType | undefined;
  if (schema) {
    tsNestedDataType = getSchemaTsNestedDataType({ schema, resolver, options });
  }

  return { ...typeInfo, dataType: "primitive", ...tsNestedDataType };
}
