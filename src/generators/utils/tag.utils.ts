import type { Endpoint } from "../types/endpoint";
import type { OperationObject } from "../types/openapi";
import type { GenerateOptions } from "../types/options";
import { nonWordCharactersToCamel } from "./string.utils";

export function formatTag(tag: string) {
  return nonWordCharactersToCamel(tag);
}

export function getOperationTag(operation: OperationObject, options: GenerateOptions) {
  const tag = operation.tags?.[0];
  return formatTag(tag ?? options.defaultTag);
}

export function getEndpointTag(endpoint: Endpoint, options: GenerateOptions) {
  const tag = options.splitByTags ? endpoint.tags?.[0] : options.defaultTag;
  return formatTag(tag ?? options.defaultTag);
}

export function isTagExcluded(tag: string, options: GenerateOptions) {
  return options.excludeTags.some((excludeTag) => excludeTag.toLowerCase() === tag.toLowerCase());
}
