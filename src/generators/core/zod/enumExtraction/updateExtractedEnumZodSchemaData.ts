import { OpenAPIV3 } from "openapi-types";
import { iterateSchema, OnSchemaCallbackData } from "@/generators/core/openapi/iterateSchema";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getEnumZodSchemaCode } from "@/generators/core/zod/getZodSchema";
import { isReferenceObject } from "@/generators/utils/openapi-schema.utils";
import { getSchemaNameByRef } from "@/generators/utils/openapi.utils";
import { getNotAllowedInlineEnumError } from "@/generators/utils/validation.utils";

type SchemaInfo = { schemaRef: string; schemaInfo?: string } | { schemaRef?: string; schemaInfo: string };

export function updateExtractedEnumZodSchemaData({
  schema,
  nameSegments = [],
  includeSelf,
  ...params
}: {
  resolver: SchemaResolver;
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
  tags: string[];
  nameSegments?: string[];
  includeSelf?: boolean;
} & SchemaInfo) {
  if (includeSelf) {
    handleExtractedEnumZodSchemaDataUpdate({ schema, nameSegments, ...params });
  }

  const onSchema = (data: OnSchemaCallbackData<{ nameSegments: string[] }>) => {
    if (data.type === "reference") {
      return true;
    }
    const segments = [...(data.data?.nameSegments ?? [])];
    if (data.type === "property") {
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
  tags: string[];
  nameSegments?: string[];
} & SchemaInfo) {
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
        ? `${getSchemaNameByRef(schemaRef)}.${nameSegments[nameSegments.length - 1]}`
        : (schemaInfo ?? nameSegments.join(".")),
    ),
  );
}
