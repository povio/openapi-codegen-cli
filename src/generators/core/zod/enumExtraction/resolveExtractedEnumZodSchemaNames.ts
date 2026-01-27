import { ExtractedEnumZodSchemaData, SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { capitalize, getMostCommonAdjacentCombinationSplit } from "src/generators/utils/string.utils";
import { getEnumZodSchemaName } from "src/generators/utils/zod-schema.utils";

export function resolveExtractedEnumZodSchemaNames(resolver: SchemaResolver) {
  resolver.extractedEnumZodSchemaData.forEach((enumData) => {
    const lastSegements = enumData.meta.zodSchemaNameSegments.map((arr) => arr[arr.length - 1]).filter(Boolean);
    const mostCommonLastSegment = getMostCommonAdjacentCombinationSplit(lastSegements);
    if (!mostCommonLastSegment) {
      throw new Error(`No common last segment found for enum: ${enumData.code}`);
    }
    enumData.zodSchemaName = getEnumZodSchemaName(
      mostCommonLastSegment,
      resolver.options.enumSuffix,
      resolver.options.schemaSuffix,
    );
  });

  let nameResolutionIterationsCounter = 0;
  while (nameResolutionIterationsCounter < 5) {
    if (allExtractedEnumZodSchemaNamesAreUnique(resolver)) {
      break;
    }
    additionalResolveExtractedEnumZodSchemaName(resolver, nameResolutionIterationsCounter + 2);
    nameResolutionIterationsCounter++;
  }

  if (!allExtractedEnumZodSchemaNamesAreUnique(resolver)) {
    const enumsDuplicateData = resolver.extractedEnumZodSchemaData.filter((enumData) => !isUnique(resolver, enumData));
    enumsDuplicateData.forEach((enumData) => {
      enumData.zodSchemaName = getEnumZodSchemaName(
        enumData.meta.zodSchemaNameSegments[0].map((name) => sanitizeName(capitalize(name))).join(""),
        resolver.options.enumSuffix,
        resolver.options.schemaSuffix,
      );
    });
  }

  if (!allExtractedEnumZodSchemaNamesAreUnique(resolver)) {
    throw new Error("Failed to resolve unique names for enum zod schemas");
  }
}

function allExtractedEnumZodSchemaNamesAreUnique(resolver: SchemaResolver) {
  return resolver.extractedEnumZodSchemaData.every((enumData) => isUnique(resolver, enumData));
}

function additionalResolveExtractedEnumZodSchemaName(resolver: SchemaResolver, index: number) {
  resolver.extractedEnumZodSchemaData.forEach((enumData) => {
    const enumsDataWithSameName = resolver.extractedEnumZodSchemaData.filter(
      ({ zodSchemaName }) => enumData.zodSchemaName === zodSchemaName,
    );
    if (enumsDataWithSameName.length === 1) {
      return;
    }

    suffixWithPreviousSegmentName(enumsDataWithSameName, index);
  });
}

function suffixWithPreviousSegmentName(enumsData: ExtractedEnumZodSchemaData[], index = 2) {
  enumsData.forEach((data) => {
    const precedingLastFragments = data.meta.zodSchemaNameSegments
      .map((arr) => arr[arr.length - index])
      .filter(Boolean);
    if (precedingLastFragments.length === 1) {
      const zodSchemaName = [sanitizeName(capitalize(precedingLastFragments[0])), data.zodSchemaName]
        .filter(Boolean)
        .join("");
      data.zodSchemaName = zodSchemaName;
    } else {
      const secondLastFragmentSplit = getMostCommonAdjacentCombinationSplit(precedingLastFragments);
      const zodSchemaName = [
        secondLastFragmentSplit ? sanitizeName(capitalize(secondLastFragmentSplit)) : "",
        data.zodSchemaName,
      ]
        .filter(Boolean)
        .join("");
      data.zodSchemaName = zodSchemaName;
    }
  });
}

function isUnique(resolver: SchemaResolver, enumData: ExtractedEnumZodSchemaData) {
  return (
    resolver.extractedEnumZodSchemaData.filter(({ zodSchemaName }) => enumData.zodSchemaName === zodSchemaName)
      .length === 1
  );
}

function sanitizeName(name: string) {
  return name.replace(/(Dto|DTO|Response|Request)/g, "");
}
