import { BODY_PARAMETER_NAME } from "@/generators/const/endpoints.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { EndpointParameter } from "@/generators/types/endpoint";
import { OperationObject } from "@/generators/types/openapi";
import { isParamMediaTypeAllowed } from "@/generators/utils/openapi.utils";
import { getBodyZodSchemaName, getZodSchemaOperationName } from "@/generators/utils/zod-schema.utils";
import { resolveEndpointZodSchema } from "./resolveEndpointZodSchema";

export function getEndpointBody({
  resolver,
  operation,
  operationName,
  isUniqueOperationName,
  tag,
}: {
  resolver: SchemaResolver;
  operation: OperationObject;
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

  const zodSchema = resolveEndpointZodSchema({
    resolver,
    schema,
    meta: { isRequired: requestBodyObj.required ?? true },
    tag,
    fallbackName: getBodyZodSchemaName(getZodSchemaOperationName(operationName, isUniqueOperationName, tag)),
    composeBeforeResolve: false,
  });

  return {
    endpointParameter: {
      name: BODY_PARAMETER_NAME,
      type: "Body",
      description: requestBodyObj.description,
      zodSchema,
      bodyObject: requestBodyObj,
    },
    requestFormat: matchingMediaType,
  };
}
