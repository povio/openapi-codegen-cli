import { OpenAPIV3 } from "openapi-types";

import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { AclConditionsPropertyType, Endpoint, EndpointAclInfo } from "@/generators/types/endpoint";
import { OperationAclInfo, OperationObject } from "@/generators/types/openapi";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import { isParamMediaTypeAllowed } from "@/generators/utils/openapi.utils";
import { isQuery } from "@/generators/utils/query.utils";
import { decapitalize } from "@/generators/utils/string.utils";
import { getMissingAclConditionPropertyError } from "@/generators/utils/validation.utils";

export function getEndpointAcl({
  resolver,
  endpoint,
  operation,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  operation: OperationObject;
}): EndpointAclInfo[] | undefined {
  const acl = operation["x-acl"];

  return acl?.map((item) => {
    const conditionsTypes = Object.keys(item.conditions ?? {}).reduce((acc, name) => {
      const propertyType = getEndpointAclConditionPropertyType({ resolver, endpoint, acl, name });
      if (!propertyType) {
        resolver.validationErrors.push(getMissingAclConditionPropertyError(name, operation, endpoint));
        return acc;
      }
      return [...acc, propertyType];
    }, [] as AclConditionsPropertyType[]);

    return { ...item, conditionsTypes };
  });
}

function getEndpointAclConditionPropertyType({
  resolver,
  endpoint,
  acl,
  name,
}: {
  resolver: SchemaResolver;
  endpoint: Endpoint;
  acl: OperationAclInfo[];
  name: string;
}): AclConditionsPropertyType | undefined {
  const conditionPropertyPath = acl[0]?.conditions?.[name];
  if (!conditionPropertyPath) {
    return;
  }

  const pathSplits = conditionPropertyPath.replace(/^\$[^.]*\./, "").split(".");

  let schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined = undefined;
  let required: boolean | undefined = undefined;
  let info: string | undefined = undefined;
  let index = 0;

  const parameter = endpoint.parameters.find(({ name }) => name === pathSplits[index]);
  if (parameter) {
    required = parameter.parameterObject?.required;
    schema = parameter.parameterObject?.schema;
    info = `${parameter.name} ${decapitalize(parameter.type)} parameter`;
    index++;
  } else {
    const bodyParameter = endpoint.parameters.find(({ bodyObject }) => !!bodyObject);
    const mediaTypes = Object.keys(bodyParameter?.bodyObject?.content ?? {});
    const matchingMediaType = mediaTypes.find(isParamMediaTypeAllowed);
    if (matchingMediaType) {
      schema = bodyParameter?.bodyObject?.content?.[matchingMediaType]?.schema;
      info = `${isQuery(endpoint) ? "query" : "mutation"} data`;
    }
  }

  while (schema && index < pathSplits.length) {
    const resolvedSchema = resolver.resolveObject(schema);
    const propertySchema = Object.entries(resolvedSchema.properties ?? {}).find(
      ([key]) => key === pathSplits[index],
    )?.[1] as OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
    schema = propertySchema;
    required = resolvedSchema.required?.includes(pathSplits[index]) ?? false;
    index++;
  }

  if (!schema) {
    return;
  }

  return {
    name,
    type: isReferenceObject(schema) ? undefined : schema.type,
    zodSchemaName: isReferenceObject(schema) ? resolver.getZodSchemaNameByRef(schema.$ref) : undefined,
    required,
    info,
  };
}
