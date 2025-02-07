import { OpenAPIV3 } from "openapi-types";
import { BODY_PARAMETER_NAME } from "src/generators/const/endpoints.const";
import { EndpointParameter } from "src/generators/types/endpoint";
import { isParamMediaTypeAllowed } from "src/generators/utils/openapi.utils";
import { getBodyZodSchemaName, getZodSchemaOperationName } from "src/generators/utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";

export function getEndpointBody({
  resolver,
  operation,
  operationName,
  isUniqueOperationName,
  tag,
}: {
  resolver: SchemaResolver;
  operation: OpenAPIV3.OperationObject;
  operationName: string;
  isUniqueOperationName: boolean;
  tag: string;
}): { endpointParameter: EndpointParameter; requestFormat: string } | undefined {
  const requestBodyObj = resolver.resolveObject(operation.requestBody);
  if (!requestBodyObj) {
    return;
  }

  const mediaTypes = Object.keys(requestBodyObj.content ?? {});
  const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
  if (!matchingMediaType) {
    return;
  }

  const schema = requestBodyObj.content?.[matchingMediaType]?.schema;
  if (!schema) {
    return;
  }

  const zodSchema = getZodSchema({
    schema,
    resolver,
    meta: { isRequired: requestBodyObj.required ?? true },
    tag,
  });

  const schemaObject = resolver.resolveObject(schema);

  const zodSchemaName = resolveZodSchemaName({
    schema: schemaObject,
    zodSchema,
    fallbackName: getBodyZodSchemaName(getZodSchemaOperationName(operationName, isUniqueOperationName, tag)),
    resolver,
    tag,
  });

  const zodChain = getZodChain({ schema: schemaObject, meta: zodSchema.meta, options: resolver.options });

  return {
    endpointParameter: {
      name: BODY_PARAMETER_NAME,
      type: "Body",
      description: requestBodyObj.description,
      zodSchema: zodSchemaName + zodChain,
      bodyObject: requestBodyObj,
    },
    requestFormat: matchingMediaType,
  };
}
