import { Endpoint } from "@/generators/types/endpoint";
import { OperationObject } from "@/generators/types/openapi";
import { GenerateOptions } from "@/generators/types/options";

import { nonWordCharactersToCamel } from "./string.utils";

const formattedTagCache = new Map<string, string>();
const tagFilterCache = new WeakMap<GenerateOptions, { include: Set<string>; exclude: Set<string> }>();

export function formatTag(tag: string) {
  let formattedTag = formattedTagCache.get(tag);
  if (formattedTag === undefined) {
    formattedTag = nonWordCharactersToCamel(tag);
    formattedTagCache.set(tag, formattedTag);
  }
  return formattedTag;
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
  let filters = tagFilterCache.get(options);
  if (!filters) {
    filters = {
      include: new Set(options.includeTags.map((includeTag) => formatTag(includeTag).toLowerCase())),
      exclude: new Set(options.excludeTags.map((excludeTag) => formatTag(excludeTag).toLowerCase())),
    };
    tagFilterCache.set(options, filters);
  }
  if (filters.include.has(normalizedTag)) {
    return true;
  }
  if (filters.exclude.has(normalizedTag)) {
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
