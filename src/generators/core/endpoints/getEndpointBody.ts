import { BODY_PARAMETER_NAME } from "@/generators/const/endpoints.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodChain } from "@/generators/core/zod/getZodChain";
import { getZodSchema } from "@/generators/core/zod/getZodSchema";
import { resolveZodSchemaName } from "@/generators/core/zod/resolveZodSchemaName";
import { EndpointParameter } from "@/generators/types/endpoint";
import { OperationObject } from "@/generators/types/openapi";
import { isParamMediaTypeAllowed } from "@/generators/utils/openapi.utils";
import { getBodyZodSchemaName, getZodSchemaOperationName, isNamedZodSchema } from "@/generators/utils/zod-schema.utils";

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

  // For named (ref-based) schemas, store just the base name so namespace/import resolution
  // can look it up correctly. The addOptional mechanism in the endpoint-param-parse template
  // re-attaches .optional()/.nullish() at render time. For inline z.* schemas the chain must
  // stay embedded because addOptional is skipped for non-named schemas.
  const resolvedZodSchema = isNamedZodSchema(zodSchemaName) ? zodSchemaName : zodSchemaName + zodChain;

  return {
    endpointParameter: {
      name: BODY_PARAMETER_NAME,
      type: "Body",
      description: requestBodyObj.description,
      zodSchema: resolvedZodSchema,
      bodyObject: requestBodyObj,
    },
    requestFormat: matchingMediaType,
  };
}
