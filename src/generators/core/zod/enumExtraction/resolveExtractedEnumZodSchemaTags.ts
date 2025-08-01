import { getUniqueArray } from "src/generators/utils/array.utils";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";

export function resolveExtractedEnumZodSchemaTags(resolver: SchemaResolver) {
  resolver.extractedEnumZodSchemaData.forEach((enumData) => {
    const tags = getUniqueArray(enumData.meta.tags);
    enumData.tag = tags.length === 1 ? tags[0] : resolver.options.defaultTag;
  });
}
