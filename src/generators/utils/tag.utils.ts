import { Endpoint } from "@/generators/types/endpoint";
import { OperationObject } from "@/generators/types/openapi";
import { GenerateOptions } from "@/generators/types/options";

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

export function isTagIncluded(tag: string, options: GenerateOptions) {
  const normalizedTag = formatTag(tag).toLowerCase();
  if (options.includeTags.some((includeTag) => formatTag(includeTag).toLowerCase() === normalizedTag)) {
    return true;
  }
  if (options.excludeTags.some((excludeTag) => formatTag(excludeTag).toLowerCase() === normalizedTag)) {
    return false;
  }
  return options.includeTags.length === 0;
}

export function shouldInlineEndpointsForTag(tag: string, options: GenerateOptions) {
  if (!options.inlineEndpoints) {
    return false;
  }

  const isExcludedModule = (options.inlineEndpointsExcludeModules ?? []).some(
    (moduleName) => formatTag(moduleName).toLowerCase() === tag.toLowerCase(),
  );
  return !isExcludedModule;
}
