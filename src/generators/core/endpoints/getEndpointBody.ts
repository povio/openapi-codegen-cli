import { OpenAPIV3 } from "openapi-types";
import { EndpointParameter } from "src/generators/types/endpoint";
import { GenerateOptions } from "src/generators/types/options";
import { isParamMediaTypeAllowed, isReferenceObject } from "src/generators/utils/openapi.utils";
import { getBodyZodSchemaName } from "src/generators/utils/zod-schema.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { getZodChain } from "../zod/getZodChain";
import { getZodSchema } from "../zod/getZodSchema";
import { resolveZodSchemaName } from "../zod/resolveZodSchemaName";

export function getEndpointBody({
  resolver,
  operation,
  operationName,
  tag,
  options,
}: {
  resolver: SchemaResolver;
  operation: OpenAPIV3.OperationObject;
  operationName: string;
  tag: string;
  options: GenerateOptions;
}): { endpointParameter: EndpointParameter; requestFormat: string } | undefined {
  const requestBodyObj = (
    isReferenceObject(operation.requestBody)
      ? resolver.getSchemaByRef(operation.requestBody.$ref)
      : operation.requestBody
  ) as OpenAPIV3.RequestBodyObject;

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
    options,
  });

  const schemaObject = isReferenceObject(schema) ? resolver.getSchemaByRef(schema.$ref) : schema;

  const zodSchemaName = resolveZodSchemaName({
    schema: schemaObject,
    zodSchema,
    fallbackName: getBodyZodSchemaName(operationName),
    resolver,
    tag,
    options,
  });

  const zodChain = getZodChain({ schema: schemaObject, meta: zodSchema.meta, options });

  return {
    endpointParameter: {
      name: "body",
      type: "Body",
      description: requestBodyObj.description,
      zodSchema: zodSchemaName + zodChain,
      bodyObject: requestBodyObj,
    },
    requestFormat: matchingMediaType,
  };
}
