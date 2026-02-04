import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getUniqueArray } from "@/generators/utils/array.utils";

export function resolveExtractedEnumZodSchemaTags(resolver: SchemaResolver) {
  resolver.extractedEnumZodSchemaData.forEach((enumData) => {
    const tags = getUniqueArray(enumData.meta.tags);
    enumData.tag = tags.length === 1 ? tags[0] : resolver.options.defaultTag;
  });
}
