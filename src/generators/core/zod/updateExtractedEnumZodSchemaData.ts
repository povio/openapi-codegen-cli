import { OpenAPIV3 } from "openapi-types";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getSchemaNameByRef, isReferenceObject } from "src/generators/utils/openapi.utils";
import { capitalize, getMostCommonAdjacentCombinationSplit } from "src/generators/utils/string.utils";
import { getNotAllowedInlineEnumError } from "src/generators/utils/validation.utils";
import { getEnumZodSchemaName } from "src/generators/utils/zod-schema.utils";
import { iterateSchema, OnSchemaCallbackData } from "../openapi/iterateSchema";
import { ExtractedEnumZodSchemaData, SchemaResolver } from "../SchemaResolver.class";
import { getEnumZodSchemaCode } from "./getZodSchema";

export function updateExtractedEnumZodSchemaData({
  schema,
  nameSegments = [],
  includeSelf,
  ...params
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
  schemaRef?: string;
  schemaInfo?: string;
  tags: string[];
  nameSegments?: string[];
  includeSelf?: boolean;
}) {
  if (includeSelf) {
    handleExtractedEnumZodSchemaDataUpdate({ schema, nameSegments, ...params });
  }

  const onSchema = (data: OnSchemaCallbackData<{ nameSegments: string[] }>) => {
    if (data.type === "reference") {
      return true;
    }
    const segments = [...(data.data?.nameSegments ?? [])];
    if (data.type === "property" || data.type === "additionalProperty") {
      segments.push(data.propertyName);
    }
    handleExtractedEnumZodSchemaDataUpdate({ schema: data.schema, nameSegments: [...segments], ...params });
  };

  iterateSchema(schema, { data: { nameSegments }, onSchema });
}

function handleExtractedEnumZodSchemaDataUpdate({
  resolver,
  schema,
  schemaRef,
  schemaInfo,
  tags,
  nameSegments = [],
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
  schemaRef?: string;
  schemaInfo?: string;
  tags: string[];
  nameSegments?: string[];
}) {
  if (!schema || isReferenceObject(schema) || !schema.enum) {
    return;
  }

  const code = getEnumZodSchemaCode(schema);
  const enumZodSchema = resolver.extractedEnumZodSchemaData.find((data) => data.code === code);
  if (enumZodSchema) {
    enumZodSchema.meta.zodSchemaNameSegments.push(nameSegments);
    enumZodSchema.meta.tags.push(...tags);
    enumZodSchema.meta.schemaRefs.push(...(schemaRef ? [schemaRef] : []));
    enumZodSchema.meta.schemas.push(...(schema ? [schema] : []));
  } else {
    resolver.extractedEnumZodSchemaData.push({
      code,
      meta: {
        zodSchemaNameSegments: [nameSegments],
        tags: [...tags],
        schemaRefs: schemaRef ? [schemaRef] : [],
        schemas: schema ? [schema] : [],
      },
    });
  }

  resolver.validationErrors.push(
    getNotAllowedInlineEnumError(
      schemaRef
        ? `schema ${getSchemaNameByRef(schemaRef)} property ${nameSegments[nameSegments.length - 1]}`
        : schemaInfo ?? nameSegments.join("->"),
    ),
  );
}

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

export function resolveExtractedEnumZodSchemaTags(resolver: SchemaResolver) {
  resolver.extractedEnumZodSchemaData.forEach((enumData) => {
    const tags = getUniqueArray(enumData.meta.tags);
    enumData.tag = tags.length === 1 ? tags[0] : resolver.options.defaultTag;
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
