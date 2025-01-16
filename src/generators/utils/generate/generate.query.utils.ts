import { Endpoint } from "../../types/endpoint";
import { capitalize, kebabToCamel, snakeToCamel } from "../string.utils";

export const getQueryName = (endpoint: Endpoint) => `use${capitalize(snakeToCamel(endpoint.operationName))}`;

export const getAllQueryKeys = (endpoints: Endpoint[]): { path: string; name: string }[] => {
  const paths = endpoints.map(({ path }) => path);
  const firstPathSegmentRegex = /^\/[^\/]*/g;
  const queryKeys = Array.from(new Set(paths.map((path) => path.match(firstPathSegmentRegex)).flat()));
  const getQueryKeyName = (path: string) =>
    queryKeys.length === 1 ? "all" : `all${capitalize(kebabToCamel(path.replace(/\//g, "") ?? ""))}`;
  return queryKeys
    .filter((path) => path !== null)
    .map((path) => ({ path, name: getQueryKeyName(path ?? "") }) as { path: string; name: string });
};

export const getEndpointPathQueryKeys = (endpoint: Endpoint, endpoints: Endpoint[]) => {
  const queryKeys = getAllQueryKeys(endpoints);
  const queryKey = queryKeys.find(({ path }) => endpoint.path.startsWith(path));
  if (!queryKey) {
    return [endpoint.path];
  }
  const rest = endpoint.path.substring(queryKey.path.length);
  return [`...keys.${queryKey.name}`, ...(rest ? [`"${rest}"`] : [])];
};
