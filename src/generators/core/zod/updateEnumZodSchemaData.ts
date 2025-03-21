import { OpenAPIV3 } from "openapi-types";
import { getUniqueArray } from "src/generators/utils/array.utils";
import { getSchemaNameByRef, isReferenceObject } from "src/generators/utils/openapi.utils";
import { capitalize, getMostCommonAdjacentCombinationSplit } from "src/generators/utils/string.utils";
import { getNotAllowedInlineEnumError } from "src/generators/utils/validation.utils";
import { getEnumZodSchemaName } from "src/generators/utils/zod-schema.utils";
import { iterateSchema, OnSchemaCallbackData } from "../openapi/iterateSchema";
import { EnumZodSchemaData, SchemaResolver } from "../SchemaResolver.class";
import { getEnumZodSchemaCode } from "./getZodSchema";

export function updateEnumZodSchemaData({
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
    handleEnumZodSchemaDataUpdate({ schema, nameSegments, ...params });
  }

  const onSchema = (data: OnSchemaCallbackData<{ nameSegments: string[] }>) => {
    if (data.type === "reference") {
      return true;
    }
    const segments = [...(data.data?.nameSegments ?? [])];
    if (data.type === "property" || data.type === "additionalProperty") {
      segments.push(data.propertyName);
    }
    handleEnumZodSchemaDataUpdate({ schema: data.schema, nameSegments: [...segments], ...params });
  };

  iterateSchema(schema, { data: { nameSegments }, onSchema });
}

function handleEnumZodSchemaDataUpdate({
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
  const enumZodSchema = resolver.enumZodSchemaData.find((data) => data.code === code);
  if (enumZodSchema) {
    enumZodSchema.meta.zodSchemaNameSegments.push(nameSegments);
    enumZodSchema.meta.tags.push(...tags);
    enumZodSchema.meta.schemaRefs.push(...(schemaRef ? [schemaRef] : []));
    enumZodSchema.meta.schemas.push(...(schema ? [schema] : []));
  } else {
    resolver.enumZodSchemaData.push({
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

export function resolveEnumZodSchemaNames(resolver: SchemaResolver) {
  resolver.enumZodSchemaData.forEach((enumData) => {
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
    if (allEnumZodSchemaNamesAreUnique(resolver)) {
      break;
    }
    additionalResolveEnumZodSchemaName(resolver, nameResolutionIterationsCounter + 2);
    nameResolutionIterationsCounter++;
  }

  if (!allEnumZodSchemaNamesAreUnique(resolver)) {
    const enumsDuplicateData = resolver.enumZodSchemaData.filter((enumData) => !isUnique(resolver, enumData));
    enumsDuplicateData.forEach((enumData) => {
      enumData.zodSchemaName = getEnumZodSchemaName(
        enumData.meta.zodSchemaNameSegments[0].map((name) => sanitizeName(capitalize(name))).join(""),
        resolver.options.enumSuffix,
        resolver.options.schemaSuffix,
      );
    });
  }

  if (!allEnumZodSchemaNamesAreUnique(resolver)) {
    throw new Error("Failed to resolve unique names for enum zod schemas");
  }
}

function allEnumZodSchemaNamesAreUnique(resolver: SchemaResolver) {
  return resolver.enumZodSchemaData.every((enumData) => isUnique(resolver, enumData));
}

function additionalResolveEnumZodSchemaName(resolver: SchemaResolver, index: number) {
  resolver.enumZodSchemaData.forEach((enumData) => {
    const enumsDataWithSameName = resolver.enumZodSchemaData.filter(
      ({ zodSchemaName }) => enumData.zodSchemaName === zodSchemaName,
    );
    if (enumsDataWithSameName.length === 1) {
      return;
    }

    suffixWithPreviousSegmentName(enumsDataWithSameName, index);
  });
}

function suffixWithPreviousSegmentName(enumsData: EnumZodSchemaData[], index = 2) {
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

export function resolveEnumZodSchemaTags(resolver: SchemaResolver) {
  resolver.enumZodSchemaData.forEach((enumData) => {
    const tags = getUniqueArray(enumData.meta.tags);
    enumData.tag = tags.length === 1 ? tags[0] : resolver.options.defaultTag;
  });
}

function isUnique(resolver: SchemaResolver, enumData: EnumZodSchemaData) {
  return (
    resolver.enumZodSchemaData.filter(({ zodSchemaName }) => enumData.zodSchemaName === zodSchemaName).length === 1
  );
}

function sanitizeName(name: string) {
  return name.replace(/(Dto|DTO|Response|Request)/g, "");
}
