import { OpenAPIV3 } from "openapi-types";
import {
  BLOB_SCHEMA,
  DATETIME_SCHEMA,
  EMAIL_SCHEMA,
  ENUM_SCHEMA,
  INT_SCHEMA,
  NUMBER_SCHEMA,
  STRING_SCHEMA,
  URL_SCHEMA,
  UUID_SCHEMA,
} from "src/generators/const/zod.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateType } from "src/generators/types/generate";
import { getNamespaceName } from "src/generators/utils/generate/generate.utils";
import {
  inferRequiredSchema,
  isArraySchemaObject,
  isReferenceObject,
  isSchemaObject,
} from "src/generators/utils/openapi-schema.utils";
import { isPrimitiveType, wrapWithQuotesIfNeeded } from "src/generators/utils/openapi.utils";
import { match } from "ts-pattern";
import { getParentRef, ZodSchema, ZodSchemaMetaData } from "./ZodSchema.class";
import { getZodChain } from "./getZodChain";
import { getSchemaRefs } from "./getZodSchemaRefs";

type GetZodSchemaParams = {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  resolver: SchemaResolver;
  meta?: ZodSchemaMetaData;
  tag: string;
};

/**
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
 * @see https://github.com/colinhacks/zod
 */
export function getZodSchema({ schema, resolver, meta: inheritedMeta, tag }: GetZodSchemaParams): ZodSchema {
  const zodSchema = new ZodSchema(schema, resolver, inheritedMeta);
  const meta = {
    parent: zodSchema.inherit(inheritedMeta?.parent),
    referencedBy: [...zodSchema.meta.referencedBy],
  };
  const params = { resolver, meta, tag };

  if (isReferenceObject(schema)) {
    return getReferenceZodSchema({ schema, zodSchema, resolver, meta, tag })!;
  }

  const arrayZodSchema = getArrayZodSchema({ schema, zodSchema, resolver, meta, tag });
  if (arrayZodSchema) {
    return arrayZodSchema;
  }

  const oneOfZodSchema = getOneOfZodSchema({ schema, zodSchema, resolver, meta, tag });
  if (oneOfZodSchema) {
    return oneOfZodSchema;
  }

  const anyOfZodSchema = getAnyOfZodSchema({ schema, zodSchema, resolver, meta, tag });
  if (anyOfZodSchema) {
    return anyOfZodSchema;
  }

  const allOfZodSchema = getAllOfZodSchema({ schema, zodSchema, resolver, meta, tag });
  if (allOfZodSchema) {
    return allOfZodSchema;
  }

  const primitiveZodSchema = getPrimitiveZodSchema({ schema, zodSchema, resolver, meta, tag });
  if (primitiveZodSchema) {
    return primitiveZodSchema;
  }

  const readonly = resolver.options.allReadonly ? ".readonly()" : "";

  if (isArraySchemaObject(schema)) {
    if (schema.items) {
      return zodSchema.assign(
        `z.array(${getZodSchema({ ...params, schema: schema.items }).getCodeString(tag, resolver.options)}${getZodChain(
          {
            schema: schema.items as OpenAPIV3.SchemaObject,
            meta: { ...meta, isRequired: true },
            options: resolver.options,
          },
        )})${readonly}`,
      );
    }

    return zodSchema.assign(`z.array(z.any())${readonly}`);
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType === "object" || schema.properties || schema.additionalProperties) {
    const hasRequiredArray = schema.required && schema.required.length > 0;
    const isPartial = resolver.options.withImplicitRequiredProps
      ? false
      : schema.properties && !schema.required?.length;
    let properties = "{}";

    if (schema.properties) {
      const propsMap: [string, string, boolean][] = Object.entries(schema.properties).map(([prop, propSchema]) => {
        const propMetadata = {
          ...meta,
          isRequired: isPartial
            ? true
            : hasRequiredArray
              ? schema.required?.includes(prop)
              : resolver.options.withImplicitRequiredProps,
          name: prop,
          isParentPartial: isPartial,
        } as ZodSchemaMetaData;

        let propActualSchema = propSchema;

        if (isReferenceObject(propSchema) && resolver) {
          propActualSchema = resolver.getSchemaByRef(propSchema.$ref);
          if (!propActualSchema) {
            throw new Error(`Schema ${propSchema.$ref} not found`);
          }
        }

        const zodSchema = getZodSchema({ ...params, schema: propSchema, meta: propMetadata });
        const propZodSchema =
          zodSchema.getCodeString(tag, resolver.options) +
          getZodChain({
            schema: propActualSchema as OpenAPIV3.SchemaObject,
            meta: propMetadata,
            options: resolver.options,
          });

        let isCircular = false;
        const parentRef = getParentRef(inheritedMeta);
        if (parentRef) {
          const refs = [
            ...(isReferenceObject(propSchema) ? [propSchema.$ref] : []),
            ...getSchemaRefs(zodSchema, { skipObjectSchema: true }),
          ];
          isCircular = refs.some((ref) => resolver.dependencyGraph.deepDependencyGraph[ref]?.has(parentRef));
        }

        return [prop, propZodSchema, isCircular];
      });

      properties = `{ ${propsMap
        .map(([prop, propSchema, isCircular]) =>
          isCircular
            ? `get ${wrapWithQuotesIfNeeded(prop!)}() { return ${propSchema} }`
            : `${wrapWithQuotesIfNeeded(prop!)}: ${propSchema}`,
        )
        .join(", ")} }`;
    }

    let additionalPropsSchema = "";
    if (schema.additionalProperties) {
      const additionalPropsZodSchema =
        typeof schema.additionalProperties === "object" && Object.keys(schema.additionalProperties).length > 0
          ? getZodSchema({ ...params, schema: schema.additionalProperties }).getCodeString(tag, resolver.options) +
            getZodChain({
              schema: schema.additionalProperties as OpenAPIV3.SchemaObject,
              meta: { ...meta, isRequired: true },
              options: resolver.options,
            })
          : "z.any()";
      additionalPropsSchema = `.catchall(${additionalPropsZodSchema})`;
    }

    const partial = isPartial ? ".partial()" : "";
    const zodObject = `z.object(${properties})${partial}${additionalPropsSchema}${readonly}`;

    return zodSchema.assign(zodObject);
  }

  if ((schemaType as unknown) === "any") {
    return zodSchema.assign("z.any()");
  }

  if (!schemaType) {
    return zodSchema.assign("z.unknown()");
  }

  throw new Error(`Unsupported schema type: ${schemaType}`);
}

type GetPartialZodSchemaParams = GetZodSchemaParams & { zodSchema: ZodSchema };

function getReferenceZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isReferenceObject(schema)) {
    return;
  }

  const refsPath = zodSchema.meta.referencedBy
    .slice(0, -1)
    .map((prev) => (prev.ref ? resolver.getZodSchemaNameByRef(prev.ref) ?? prev.ref : undefined))
    .filter(Boolean);
  const zodSchemaName = resolver.getZodSchemaNameByRef(schema.$ref);
  if (refsPath.length > 1 && refsPath.includes(zodSchemaName)) {
    return zodSchema.assign(resolver.getCodeByZodSchemaName(zodSchema.ref!)!);
  }

  let result = resolver.getCodeByZodSchemaName(schema.$ref);
  if (!result) {
    const actualSchema = resolver.getSchemaByRef(schema.$ref);
    if (!actualSchema) {
      throw new Error(`Schema ${schema.$ref} not found`);
    }
    result = getZodSchema({ schema: actualSchema, resolver, meta, tag }).getCodeString(tag, resolver.options);
  }

  if (resolver.getCodeByZodSchemaName(zodSchemaName)) {
    return zodSchema;
  }

  resolver.setZodSchema(zodSchemaName, result, tag);

  return zodSchema;
}

function getOneOfZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !schema.oneOf) {
    return;
  }

  if (schema.oneOf.length === 1) {
    const type = getZodSchema({ schema: schema.oneOf[0]!, resolver, meta, tag });
    return zodSchema.assign(type.getCodeString(tag, resolver.options));
  }

  /* when there are multiple allOf we are unable to use a discriminatedUnion as this library adds an
   *   'z.and' to the schema that it creates which breaks type inference */
  const hasMultipleAllOf = schema.oneOf?.some((obj) => isSchemaObject(obj) && (obj?.allOf || []).length > 1);
  if (schema.discriminator && !hasMultipleAllOf) {
    const propertyName = schema.discriminator.propertyName;

    return zodSchema.assign(`
      z.discriminatedUnion("${propertyName}", [${schema.oneOf
        .map((schema) => getZodSchema({ schema, resolver, meta, tag }).getCodeString(tag, resolver.options))
        .join(", ")}])
        `);
  }

  return zodSchema.assign(
    `z.union([${schema.oneOf.map((schema) => getZodSchema({ schema, resolver, meta, tag }).getCodeString(tag, resolver.options)).join(", ")}])`,
  );
}

function getArrayZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !Array.isArray(schema.type)) {
    return;
  }

  if (schema.type.length === 1) {
    return getZodSchema({ schema: { ...schema, type: schema.type[0]! }, resolver, meta, tag });
  }

  return zodSchema.assign(
    `z.union([${schema.type
      .map((prop) =>
        getZodSchema({ schema: { ...schema, type: prop }, resolver, meta, tag }).getCodeString(tag, resolver.options),
      )
      .join(", ")}])`,
  );
}

function getAnyOfZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  // anyOf = oneOf but with 1 or more = `T extends oneOf ? T | T[] : never`
  if (!isSchemaObject(schema) || !schema.anyOf) {
    return;
  }

  if (schema.anyOf.length === 1) {
    const type = getZodSchema({ schema: schema.anyOf[0]!, resolver, meta, tag });
    return zodSchema.assign(type.getCodeString(tag, resolver.options));
  }

  const types = schema.anyOf
    .map((schema) => getZodSchema({ schema, resolver, meta, tag }))
    .map((type) => type.getCodeString(tag, resolver.options))
    .join(", ");

  return zodSchema.assign(`z.union([${types}])`);
}

function getAllOfZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !schema.allOf) {
    return;
  }

  if (schema.allOf.length === 1) {
    const type = getZodSchema({ schema: schema.allOf[0], resolver, meta, tag });
    return zodSchema.assign(type.getCodeString(tag, resolver.options));
  }

  const { patchRequiredSchemaInLoop, noRequiredOnlyAllof, composedRequiredSchema } = inferRequiredSchema(schema);
  const types = noRequiredOnlyAllof.map((schema) => {
    const type = getZodSchema({ schema, resolver, meta, tag });
    if (resolver) {
      patchRequiredSchemaInLoop(schema, resolver.getSchemaByRef.bind(resolver));
    }
    return type;
  });
  if (composedRequiredSchema.required.length) {
    types.push(getZodSchema({ schema: composedRequiredSchema, resolver, meta, tag }));
  }
  const first = types.at(0)!;
  const rest = types
    .slice(1)
    .map((type) => `merge(${type.getCodeString(tag, resolver.options)})`)
    .join(".");

  return zodSchema.assign(`${first.getCodeString(tag, resolver.options)}.${rest}`);
}

function getPrimitiveZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema)) {
    return;
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType && isPrimitiveType(schemaType)) {
    if (schema.enum) {
      if (schemaType === "string") {
        return getEnumZodSchema({ schema, zodSchema, resolver, meta, tag });
      }

      if (schema.enum.some((e) => typeof e === "string")) {
        return zodSchema.assign("z.never()");
      }

      if (schema.enum.length === 1) {
        const value = schema.enum[0];
        return zodSchema.assign(`z.literal(${value === null ? "null" : value})`);
      }

      return zodSchema.assign(
        `z.union([${schema.enum.map((value) => `z.literal(${value === null ? "null" : value})`).join(", ")}])`,
      );
    }

    return zodSchema.assign(
      match(schemaType)
        .with("integer", () =>
          match(schema.type)
            .with("integer", () => INT_SCHEMA)
            .otherwise(() => NUMBER_SCHEMA),
        )
        .with("string", () =>
          match(schema.format)
            .with("binary", () => BLOB_SCHEMA)
            .with("email", () => EMAIL_SCHEMA)
            .with("hostname", "uri", () => URL_SCHEMA)
            .with("uuid", () => UUID_SCHEMA)
            .with("date-time", () => DATETIME_SCHEMA)
            .otherwise(() => STRING_SCHEMA),
        )
        .otherwise((type) => `z.${type}()`),
    );
  }
}

function getEnumZodSchema({ resolver, schema, zodSchema, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema)) {
    return;
  }

  const code = getEnumZodSchemaCode(schema);
  if (!resolver.options.extractEnums) {
    return zodSchema.assign(code);
  }

  const enumZodSchema = resolver.getEnumZodSchemaDataByCode(code);
  if (enumZodSchema) {
    if (zodSchema.meta.parent?.ref === resolver.getRefByZodSchemaName(enumZodSchema.zodSchemaName)) {
      return zodSchema.assign(enumZodSchema.code);
    }

    return new ZodSchema(
      { $ref: resolver.getRefByZodSchemaName(enumZodSchema.zodSchemaName) } as OpenAPIV3.ReferenceObject,
      resolver,
      meta,
    )
      .inherit(zodSchema)
      .assign(code);
  }

  const extractedEnumZodSchema = resolver.getExtractedEnumZodSchemaDataByCode(code);
  if (!extractedEnumZodSchema) {
    return zodSchema.assign(code);
  }

  if (!extractedEnumZodSchema.zodSchemaName || !extractedEnumZodSchema.tag) {
    throw new Error(`Enum zod schema name or tag not resolved for code: ${code}`);
  }

  const namespacePrefix =
    resolver.options.tsNamespaces && extractedEnumZodSchema.tag !== tag
      ? `${getNamespaceName({ type: GenerateType.Models, tag: extractedEnumZodSchema.tag, options: resolver.options })}.`
      : "";

  return zodSchema.assign(`${namespacePrefix}${extractedEnumZodSchema.zodSchemaName}`);
}

export function getEnumZodSchemaCode(schema: OpenAPIV3.SchemaObject) {
  return `${ENUM_SCHEMA}([${schema.enum?.map((value) => (value === null ? "null" : `"${value}"`)).join(", ")}])`;
}

export function getEnumZodSchemaCodeFromEnumNames(enumNames: string[]) {
  return `${ENUM_SCHEMA}([${enumNames.map((value) => `"${value}"`).join(", ")}])`;
}
