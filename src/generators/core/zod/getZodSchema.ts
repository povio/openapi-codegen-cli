import { OpenAPIV3 } from "openapi-types";
import { ZodSchemasGenerateOptions } from "src/generators/types/options";
import { match } from "ts-pattern";
import { inferRequiredSchema, isArraySchemaObject, isSchemaObject } from "../../utils/openapi-schema.utils";
import { isPrimitiveType, isReferenceObject, wrapWithQuotesIfNeeded } from "../../utils/openapi.utils";
import { GenerateContext } from "../GenerateContext.class";
import { SchemaResolver } from "../SchemaResolver.class";
import { ZodSchema, ZodSchemaMetaData } from "./ZodSchema.class";
import { getZodChain } from "./getZodChain";

/**
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
 * @see https://github.com/colinhacks/zod
 */
export function getZodSchema({
  schema,
  resolver,
  ctx,
  meta: inheritedMeta,
  options,
}: {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  resolver?: SchemaResolver;
  ctx?: GenerateContext;
  meta?: ZodSchemaMetaData;
  options?: ZodSchemasGenerateOptions;
}): ZodSchema {
  if (!schema) {
    throw new Error("Schema is required");
  }

  ctx = ctx ?? new GenerateContext();

  const zodSchema = new ZodSchema(schema, resolver, inheritedMeta);
  const meta = {
    parent: zodSchema.inherit(inheritedMeta?.parent),
    referencedBy: [...zodSchema.meta.referencedBy],
  };
  const params = { resolver, ctx, meta, options };

  const refsPath = zodSchema.meta.referencedBy
    .slice(0, -1)
    .map((prev) => resolver?.getZodSchemaNameByRef(prev.ref!) ?? prev.ref!);

  if (isReferenceObject(schema)) {
    if (!resolver) {
      throw new Error("Resolver is required");
    }

    const zodSchemaName = resolver.getZodSchemaNameByRef(schema.$ref);

    // circular(=recursive) reference
    if (refsPath.length > 1 && refsPath.includes(zodSchemaName)) {
      return zodSchema.assign(ctx.getZodSchemaByName(zodSchema.ref!)!);
    }

    let result = ctx.getZodSchemaByName(schema.$ref);
    if (!result) {
      const actualSchema = resolver.getSchemaByRef(schema.$ref);
      if (!actualSchema) {
        throw new Error(`Schema ${schema.$ref} not found`);
      }

      result = getZodSchema({ ...params, schema: actualSchema }).toString();
    }

    if (ctx.getZodSchemaByName(zodSchemaName)) {
      return zodSchema;
    }

    ctx.setZodSchema(zodSchemaName, result);

    return zodSchema;
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.length === 1) {
      return getZodSchema({ ...params, schema: { ...schema, type: schema.type[0]! } });
    }

    return zodSchema.assign(
      `z.union([${schema.type
        .map((prop) => getZodSchema({ ...params, schema: { ...schema, type: prop } }))
        .join(", ")}])`,
    );
  }

  if (schema.oneOf) {
    if (schema.oneOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.oneOf[0]! });
      return zodSchema.assign(type.toString());
    }

    /* when there are multiple allOf we are unable to use a discriminatedUnion as this library adds an
     *   'z.and' to the schema that it creates which breaks type inference */
    const hasMultipleAllOf = schema.oneOf?.some((obj) => isSchemaObject(obj) && (obj?.allOf || []).length > 1);
    if (schema.discriminator && !hasMultipleAllOf) {
      const propertyName = schema.discriminator.propertyName;

      return zodSchema.assign(`
        z.discriminatedUnion("${propertyName}", [${schema.oneOf
          .map((prop) => getZodSchema({ ...params, schema: prop }))
          .join(", ")}])
          `);
    }

    return zodSchema.assign(
      `z.union([${schema.oneOf.map((prop) => getZodSchema({ ...params, schema: prop })).join(", ")}])`,
    );
  }

  // anyOf = oneOf but with 1 or more = `T extends oneOf ? T | T[] : never`
  if (schema.anyOf) {
    if (schema.anyOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.anyOf[0]! });
      return zodSchema.assign(type.toString());
    }

    const types = schema.anyOf
      .map((prop) => getZodSchema({ ...params, schema: prop }))
      .map((type) => {
        let isObject = true;

        if ("type" in type.schema) {
          if (Array.isArray(type.schema.type)) {
            isObject = false;
          } else {
            const schemaType = type.schema.type?.toLowerCase() as NonNullable<typeof schema.type>;
            isObject = !isPrimitiveType(schemaType);
          }
        }

        return type.toString();
      })
      .join(", ");

    return zodSchema.assign(`z.union([${types}])`);
  }

  if (schema.allOf) {
    if (schema.allOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.allOf[0]! });
      return zodSchema.assign(type.toString());
    }
    const { patchRequiredSchemaInLoop, noRequiredOnlyAllof, composedRequiredSchema } = inferRequiredSchema(schema);

    const types = noRequiredOnlyAllof.map((prop) => {
      const zodSchema = getZodSchema({ ...params, schema: prop });
      resolver && patchRequiredSchemaInLoop(prop, resolver.getSchemaByRef.bind(resolver));
      return zodSchema;
    });

    if (composedRequiredSchema.required.length) {
      types.push(getZodSchema({ ...params, schema: composedRequiredSchema }));
    }
    const first = types.at(0)!;
    const rest = types
      .slice(1)
      .map((type) => `and(${type.toString()})`)
      .join(".");

    return zodSchema.assign(`${first.toString()}.${rest}`);
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType && isPrimitiveType(schemaType)) {
    if (schema.enum) {
      if (schemaType === "string") {
        if (schema.enum.length === 1) {
          const value = schema.enum[0];
          const valueString = value === null ? "null" : `"${value}"`;
          return zodSchema.assign(`z.literal(${valueString})`);
        }

        return zodSchema.assign(
          `z.enum([${schema.enum.map((value) => (value === null ? "null" : `"${value}"`)).join(", ")}])`,
        );
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

  const readonly = options?.allReadonly ? ".readonly()" : "";

  if (isArraySchemaObject(schema)) {
    if (schema.items) {
      return zodSchema.assign(
        `z.array(${getZodSchema({ ...params, schema: schema.items }).toString()}${getZodChain({
          schema: schema.items as OpenAPIV3.SchemaObject,
          meta: { ...meta, isRequired: true },
          options,
        })})${readonly}`,
      );
    }

    return zodSchema.assign(`z.array(z.any())${readonly}`);
  }

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
        `z.record(${(
          getZodSchema({ ...params, schema: schema.additionalProperties }) +
          getZodChain({
            schema: schema.additionalProperties as OpenAPIV3.SchemaObject,
            meta: { ...meta, isRequired: true },
            options,
          })
        ).toString()})`,
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

        const propzodSchema =
          getZodSchema({ ...params, schema: propSchema, meta: propMetadata }) +
          getZodChain({ schema: propActualSchema as OpenAPIV3.SchemaObject, meta: propMetadata, options });

        return [prop, propzodSchema.toString()];
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
