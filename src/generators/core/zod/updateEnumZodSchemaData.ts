import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "src/generators/utils/openapi.utils";
import { capitalize, getMostCommonAdjacentCombinationSplit } from "src/generators/utils/string.utils";
import { iterateSchema } from "../openapi/iterateSchema";
import { EnumZodSchemaData, SchemaResolver } from "../SchemaResolver.class";
import { getEnumZodSchemaCode } from "./getZodSchema";

export function updateEnumZodSchemaData({
  resolver,
  schema,
  nameSegments = [],
  tags,
  includeSelf,
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
  tags: string[];
  nameSegments?: string[];
  includeSelf?: boolean;
}) {
  if (includeSelf) {
    handleEnumZodSchemaDataUpdate({ resolver, schema, tags, nameSegments });
  }

  iterateSchema(schema, {
    data: { nameSegments },
    onSchema: (data) => {
      if (data.type === "reference") {
        return true;
      }
      const segments = [...(data.data?.nameSegments ?? [])];
      if (data.type === "property" || data.type === "additionalProperty") {
        segments.push(data.propertyName);
      }
      handleEnumZodSchemaDataUpdate({ resolver, schema: data.schema, tags, nameSegments: [...segments] });
    },
  });
}

function handleEnumZodSchemaDataUpdate({
  resolver,
  schema,
  tags,
  nameSegments = [],
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
  tags: string[];
  nameSegments?: string[];
}) {
  if (!schema || isReferenceObject(schema) || !schema.enum) {
    return;
  }

  const code = getEnumZodSchemaCode(schema);
  const enumZodSchema = resolver.enumZodSchemaData.find((data) => data.code === code);
  if (enumZodSchema) {
    enumZodSchema.zodSchemaNameSegments.push(nameSegments);
    enumZodSchema.tags.push(...tags);
  } else {
    resolver.enumZodSchemaData.push({ code, zodSchemaNameSegments: [nameSegments], tags: [...tags] });
  }
}

export function resolveEnumZodSchemaNames(resolver: SchemaResolver) {
  resolver.enumZodSchemaData.forEach((enumData) => {
    const lastSegements = enumData.zodSchemaNameSegments.map((arr) => arr[arr.length - 1]).filter(Boolean);
    const mostCommonLastSegment = getMostCommonAdjacentCombinationSplit(lastSegements);
    if (!mostCommonLastSegment) {
      throw new Error(`No common last segment found for enum: ${enumData.code}`);
    }
    enumData.name = `${capitalize(mostCommonLastSegment)}Enum`;
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
    throw new Error("Failed to resolve unique names for enum zod schemas");
  }
}

function allEnumZodSchemaNamesAreUnique(resolver: SchemaResolver) {
  return resolver.enumZodSchemaData.every(
    (enumData) => resolver.enumZodSchemaData.filter(({ name }) => enumData.name === name).length == 1,
  );
}

function additionalResolveEnumZodSchemaName(resolver: SchemaResolver, index: number) {
  resolver.enumZodSchemaData.forEach((enumData) => {
    const enumsDataWithSameName = resolver.enumZodSchemaData.filter(({ name }) => enumData.name === name);
    if (enumsDataWithSameName.length === 1) {
      return;
    }

    suffixWithPreviousSegmentName(enumsDataWithSameName, index);
  });
}

function suffixWithPreviousSegmentName(enumsData: EnumZodSchemaData[], index = 2) {
  enumsData.forEach((data) => {
    const precedingLastFragments = data.zodSchemaNameSegments.map((arr) => arr[arr.length - index]).filter(Boolean);
    if (precedingLastFragments.length === 1) {
      data.name = [capitalize(precedingLastFragments[0]), data.name].filter(Boolean).join("");
    } else {
      const secondLastFragmentSplit = getMostCommonAdjacentCombinationSplit(precedingLastFragments);
      data.name = [secondLastFragmentSplit ? capitalize(secondLastFragmentSplit) : "", data.name]
        .filter(Boolean)
        .join("");
    }
  });
}
