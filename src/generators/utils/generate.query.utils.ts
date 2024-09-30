import { Endpoint } from "../types/endpoint";
import { capitalize, snakeToCamel } from "./string.utils";

export const getQueryName = (endpoint: Endpoint) => `use${capitalize(snakeToCamel(endpoint.operationName))}`;
