import { Endpoint } from "../types/endpoint";
import { decapitalize, removeSuffix, snakeToCamel } from "./string.utils";

export const getEndpointName = (endpoint: Endpoint) => decapitalize(snakeToCamel(endpoint.operationName));

export const getZodSchemaInferedTypeName = (zodSchemaName: string, suffix: string) =>
  removeSuffix(zodSchemaName, suffix);
