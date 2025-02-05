import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "src/generators/types/options";
import { match } from "ts-pattern";
import { inferRequiredSchema, isArraySchemaObject, isSchemaObject } from "../../utils/openapi-schema.utils";
import { isPrimitiveType, isReferenceObject, wrapWithQuotesIfNeeded } from "../../utils/openapi.utils";
import { SchemaResolver } from "../SchemaResolver.class";
import { ZodSchema, ZodSchemaMetaData } from "./ZodSchema.class";
import { getZodChain } from "./getZodChain";

type GetZodSchemaParams = {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  resolver: SchemaResolver;
  meta?: ZodSchemaMetaData;
  tag: string;
  options: GenerateOptions;
};

/**
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
 * @see https://github.com/colinhacks/zod
 */
export function getZodSchema({ schema, resolver, meta: inheritedMeta, tag, options }: GetZodSchemaParams): ZodSchema {
  const zodSchema = new ZodSchema(schema, resolver, inheritedMeta);
  const meta = {
    parent: zodSchema.inherit(inheritedMeta?.parent),
    referencedBy: [...zodSchema.meta.referencedBy],
  };
  const params = { resolver, meta, tag, options };

  if (isReferenceObject(schema)) {
    return getReferenceZodSchema({ schema, zodSchema, resolver, meta, tag, options })!;
  }

  const arrayZodSchema = getArrayZodSchema({ schema, zodSchema, resolver, meta, tag, options });
  if (arrayZodSchema) {
    return arrayZodSchema;
  }

  const oneOfZodSchema = getOneOfZodSchema({ schema, zodSchema, resolver, meta, tag, options });
  if (oneOfZodSchema) {
    return oneOfZodSchema;
  }

  const anyOfZodSchema = getAnyOfZodSchema({ schema, zodSchema, resolver, meta, tag, options });
  if (anyOfZodSchema) {
    return anyOfZodSchema;
  }

  const allOfZodSchema = getAllOfZodSchema({ schema, zodSchema, resolver, meta, tag, options });
  if (allOfZodSchema) {
    return allOfZodSchema;
  }

  const primitiveZodSchema = getPrimitiveZodSchema({ schema, zodSchema, resolver, meta, tag, options });
  if (primitiveZodSchema) {
    return primitiveZodSchema;
  }

  const readonly = options?.allReadonly ? ".readonly()" : "";

  if (isArraySchemaObject(schema)) {
    if (schema.items) {
      return zodSchema.assign(
        `z.array(${getZodSchema({ ...params, schema: schema.items }).getCodeString(tag, options)}${getZodChain({
          schema: schema.items as OpenAPIV3.SchemaObject,
          meta: { ...meta, isRequired: true },
          options,
        })})${readonly}`,
      );
    }

    return zodSchema.assign(`z.array(z.any())${readonly}`);
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType === "object" || schema.properties || schema.additionalProperties) {
    // additional properties default to true if additionalPropertiesDefaultValue not provided
    const additionalPropsDefaultValue =
      options?.additionalPropertiesDefaultValue !== undefined ? options?.additionalPropertiesDefaultValue : true;
    const additionalProps =
      schema.additionalProperties === null || schema.additionalProperties === undefined
        ? additionalPropsDefaultValue
        : schema.additionalProperties;
    const additionalPropsSchema = additionalProps === false ? "" : ".passthrough()";

    if (typeof schema.additionalProperties === "object" && Object.keys(schema.additionalProperties).length > 0) {
      return zodSchema.assign(
        `z.record(${
          getZodSchema({ ...params, schema: schema.additionalProperties }).getCodeString(tag, options) +
          getZodChain({
            schema: schema.additionalProperties as OpenAPIV3.SchemaObject,
            meta: { ...meta, isRequired: true },
            options,
          })
        })`,
      );
    }

    const hasRequiredArray = schema.required && schema.required.length > 0;
    const isPartial = options?.withImplicitRequiredProps ? false : !schema.required?.length;
    let properties = "{}";

    if (schema.properties) {
      const propsMap = Object.entries(schema.properties).map(([prop, propSchema]) => {
        const propMetadata = {
          ...meta,
          isRequired: isPartial
            ? true
            : hasRequiredArray
              ? schema.required?.includes(prop)
              : options?.withImplicitRequiredProps,
          name: prop,
        } as ZodSchemaMetaData;

        let propActualSchema = propSchema;

        if (isReferenceObject(propSchema) && resolver) {
          propActualSchema = resolver.getSchemaByRef(propSchema.$ref);
          if (!propActualSchema) {
            throw new Error(`Schema ${propSchema.$ref} not found`);
          }
        }

        const propZodSchema =
          getZodSchema({ ...params, schema: propSchema, meta: propMetadata }).getCodeString(tag, options) +
          getZodChain({ schema: propActualSchema as OpenAPIV3.SchemaObject, meta: propMetadata, options });

        return [prop, propZodSchema];
      });

      properties =
        "{ " +
        propsMap.map(([prop, propSchema]) => `${wrapWithQuotesIfNeeded(prop!)}: ${propSchema}`).join(", ") +
        " }";
    }

    const partial = isPartial ? ".partial()" : "";
    const strict = options?.strictObjects ? ".strict()" : "";
    return zodSchema.assign(`z.object(${properties})${partial}${strict}${additionalPropsSchema}${readonly}`);
  }

  if (!schemaType) {
    return zodSchema.assign("z.unknown()");
  }

  throw new Error(`Unsupported schema type: ${schemaType}`);
}

type GetPartialZodSchemaParams = GetZodSchemaParams & { zodSchema: ZodSchema };

function getReferenceZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
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
    result = getZodSchema({ schema: actualSchema, resolver, meta, tag, options }).getCodeString(tag, options);
  }

  if (resolver.getCodeByZodSchemaName(zodSchemaName)) {
    return zodSchema;
  }

  resolver.setZodSchema(zodSchemaName, result, tag);

  return zodSchema;
}

function getOneOfZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !schema.oneOf) {
    return;
  }

  if (schema.oneOf.length === 1) {
    const type = getZodSchema({ schema: schema.oneOf[0]!, resolver, meta, tag, options });
    return zodSchema.assign(type.getCodeString(tag, options));
  }

  /* when there are multiple allOf we are unable to use a discriminatedUnion as this library adds an
   *   'z.and' to the schema that it creates which breaks type inference */
  const hasMultipleAllOf = schema.oneOf?.some((obj) => isSchemaObject(obj) && (obj?.allOf || []).length > 1);
  if (schema.discriminator && !hasMultipleAllOf) {
    const propertyName = schema.discriminator.propertyName;

    return zodSchema.assign(`
      z.discriminatedUnion("${propertyName}", [${schema.oneOf
        .map((schema) => getZodSchema({ schema, resolver, meta, tag, options }).getCodeString(tag, options))
        .join(", ")}])
        `);
  }

  return zodSchema.assign(
    `z.union([${schema.oneOf.map((schema) => getZodSchema({ schema, resolver, meta, tag, options }).getCodeString(tag, options)).join(", ")}])`,
  );
}

function getArrayZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !Array.isArray(schema.type)) {
    return;
  }

  if (schema.type.length === 1) {
    return getZodSchema({ schema: { ...schema, type: schema.type[0]! }, resolver, meta, tag, options });
  }

  return zodSchema.assign(
    `z.union([${schema.type
      .map((prop) =>
        getZodSchema({ schema: { ...schema, type: prop }, resolver, meta, tag, options }).getCodeString(tag, options),
      )
      .join(", ")}])`,
  );
}

function getAnyOfZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
  // anyOf = oneOf but with 1 or more = `T extends oneOf ? T | T[] : never`
  if (!isSchemaObject(schema) || !schema.anyOf) {
    return;
  }

  if (schema.anyOf.length === 1) {
    const type = getZodSchema({ schema: schema.anyOf[0]!, resolver, meta, tag, options });
    return zodSchema.assign(type.getCodeString(tag, options));
  }

  const types = schema.anyOf
    .map((schema) => getZodSchema({ schema, resolver, meta, tag, options }))
    .map((type) => type.getCodeString(tag, options))
    .join(", ");

  return zodSchema.assign(`z.union([${types}])`);
}

function getAllOfZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema) || !schema.allOf) {
    return;
  }

  if (schema.allOf.length === 1) {
    const type = getZodSchema({ schema: schema.allOf[0], resolver, meta, tag, options });
    return zodSchema.assign(type.getCodeString(tag, options));
  }

  const { patchRequiredSchemaInLoop, noRequiredOnlyAllof, composedRequiredSchema } = inferRequiredSchema(schema);
  const types = noRequiredOnlyAllof.map((schema) => {
    const type = getZodSchema({ schema, resolver, meta, tag, options });
    resolver && patchRequiredSchemaInLoop(schema, resolver.getSchemaByRef.bind(resolver));
    return type;
  });
  if (composedRequiredSchema.required.length) {
    types.push(getZodSchema({ schema: composedRequiredSchema, resolver, meta, tag, options }));
  }
  const first = types.at(0)!;
  const rest = types
    .slice(1)
    .map((type) => `merge(${type.getCodeString(tag, options)})`)
    .join(".");

  return zodSchema.assign(`${first.getCodeString(tag, options)}.${rest}`);
}

function getPrimitiveZodSchema({ schema, zodSchema, resolver, meta, tag, options }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema)) {
    return;
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType && isPrimitiveType(schemaType)) {
    if (schema.enum) {
      if (schemaType === "string") {
        return getEnumZodSchema({ schema, zodSchema, resolver, meta, tag, options });
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
        .with("integer", () => "z.number()")
        .with("string", () =>
          match(schema.format)
            .with("binary", () => "z.instanceof(File)")
            .otherwise(() => "z.string()"),
        )
        .otherwise((type) => `z.${type}()`),
    );
  }
}

function getEnumZodSchema({ schema, zodSchema }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema)) {
    return;
  }

  return zodSchema.assign(
    `z.enum([${schema.enum?.map((value) => (value === null ? "null" : `"${value}"`)).join(", ")}])`,
  );
}
