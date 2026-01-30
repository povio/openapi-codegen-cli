import { Endpoint } from "src/generators/types/endpoint";
import { OperationObject } from "src/generators/types/openapi";
import { GenerateOptions } from "src/generators/types/options";

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
