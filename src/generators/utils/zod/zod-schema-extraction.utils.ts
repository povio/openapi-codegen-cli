import { OpenAPIV3 } from "openapi-types";
import { GenerateContext } from "src/generators/types/context";
import { ZodSchemasGenerateOptions } from "src/generators/types/options";
import { match } from "ts-pattern";
import { OpenAPISchemaResolver } from "../openapi/openapi-schema-resolver.class";
import { inferRequiredSchema, isArraySchemaObject, isSchemaObject } from "../openapi/openapi-schema.utils";
import {
  escapeControlCharacters,
  isPrimitiveType,
  isReferenceObject,
  wrapWithQuotesIfNeeded,
} from "../openapi/openapi.utils";
import { ZodSchema, ZodSchemaMetaData } from "./zod-schema.class";

/**
 * @see https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schemaObject
 * @see https://github.com/colinhacks/zod
 */
export function getZodSchema({
  schema: $schema,
  resolver,
  ctx = { zodSchemas: {}, schemas: {} },
  meta: inheritedMeta,
  options,
}: {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  resolver?: OpenAPISchemaResolver;
  ctx?: GenerateContext;
  meta?: ZodSchemaMetaData;
  options?: ZodSchemasGenerateOptions;
}): ZodSchema {
  if (!$schema) {
    throw new Error("Schema is required");
  }

  const schema = $schema;
  const code = new ZodSchema(schema, resolver, inheritedMeta);
  const meta = {
    parent: code.inherit(inheritedMeta?.parent),
    referencedBy: [...code.meta.referencedBy],
  };
  const params = { resolver, ctx, meta, options };

  const refsPath = code.meta.referencedBy
    .slice(0, -1)
    .map((prev) => resolver?.resolveRef(prev.ref!).normalized ?? prev.ref!);

  if (isReferenceObject(schema)) {
    if (!resolver) throw new Error("Resolver is required");

    const schemaName = resolver.resolveRef(schema.$ref)?.normalized;

    // circular(=recursive) reference
    if (refsPath.length > 1 && refsPath.includes(schemaName)) {
      return code.assign(ctx.zodSchemas[code.ref!]!);
    }

    let result = ctx.zodSchemas[schema.$ref];
    if (!result) {
      const actualSchema = resolver.getSchemaByRef(schema.$ref);
      if (!actualSchema) {
        throw new Error(`Schema ${schema.$ref} not found`);
      }

      result = getZodSchema({ ...params, schema: actualSchema }).toString();
    }

    if (ctx.zodSchemas[schemaName]) {
      return code;
    }

    ctx.zodSchemas[schemaName] = result;

    return code;
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.length === 1) {
      return getZodSchema({ ...params, schema: { ...schema, type: schema.type[0]! } });
    }

    return code.assign(
      `z.union([${schema.type
        .map((prop) => getZodSchema({ ...params, schema: { ...schema, type: prop } }))
        .join(", ")}])`,
    );
  }

  if (schema.oneOf) {
    if (schema.oneOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.oneOf[0]! });
      return code.assign(type.toString());
    }

    /* when there are multiple allOf we are unable to use a discriminatedUnion as this library adds an
     *   'z.and' to the schema that it creates which breaks type inference */
    const hasMultipleAllOf = schema.oneOf?.some((obj) => isSchemaObject(obj) && (obj?.allOf || []).length > 1);
    if (schema.discriminator && !hasMultipleAllOf) {
      const propertyName = schema.discriminator.propertyName;

      return code.assign(`
        z.discriminatedUnion("${propertyName}", [${schema.oneOf
          .map((prop) => getZodSchema({ ...params, schema: prop }))
          .join(", ")}])
          `);
    }

    return code.assign(
      `z.union([${schema.oneOf.map((prop) => getZodSchema({ ...params, schema: prop })).join(", ")}])`,
    );
  }

  // anyOf = oneOf but with 1 or more = `T extends oneOf ? T | T[] : never`
  if (schema.anyOf) {
    if (schema.anyOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.anyOf[0]! });
      return code.assign(type.toString());
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

    return code.assign(`z.union([${types}])`);
  }

  if (schema.allOf) {
    if (schema.allOf.length === 1) {
      const type = getZodSchema({ ...params, schema: schema.allOf[0]! });
      return code.assign(type.toString());
    }
    const { patchRequiredSchemaInLoop, noRequiredOnlyAllof, composedRequiredSchema } = inferRequiredSchema(schema);

    const types = noRequiredOnlyAllof.map((prop) => {
      const zodSchema = getZodSchema({ ...params, schema: prop });
      resolver && patchRequiredSchemaInLoop(prop, resolver);
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

    return code.assign(`${first.toString()}.${rest}`);
  }

  const schemaType = schema.type ? (schema.type.toLowerCase() as NonNullable<typeof schema.type>) : undefined;
  if (schemaType && isPrimitiveType(schemaType)) {
    if (schema.enum) {
      if (schemaType === "string") {
        if (schema.enum.length === 1) {
          const value = schema.enum[0];
          const valueString = value === null ? "null" : `"${value}"`;
          return code.assign(`z.literal(${valueString})`);
        }

        return code.assign(
          `z.enum([${schema.enum.map((value) => (value === null ? "null" : `"${value}"`)).join(", ")}])`,
        );
      }

      if (schema.enum.some((e) => typeof e === "string")) {
        return code.assign("z.never()");
      }

      if (schema.enum.length === 1) {
        const value = schema.enum[0];
        return code.assign(`z.literal(${value === null ? "null" : value})`);
      }

      return code.assign(
        `z.union([${schema.enum.map((value) => `z.literal(${value === null ? "null" : value})`).join(", ")}])`,
      );
    }

    return code.assign(
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
      return code.assign(
        `z.array(${getZodSchema({ ...params, schema: schema.items }).toString()}${getZodChain({
          schema: schema.items as OpenAPIV3.SchemaObject,
          meta: { ...meta, isRequired: true },
          options,
        })})${readonly}`,
      );
    }

    return code.assign(`z.array(z.any())${readonly}`);
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
      return code.assign(
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

        const propCode =
          getZodSchema({ ...params, schema: propSchema, meta: propMetadata }) +
          getZodChain({ schema: propActualSchema as OpenAPIV3.SchemaObject, meta: propMetadata, options });

        return [prop, propCode.toString()];
      });

      properties =
        "{ " +
        propsMap.map(([prop, propSchema]) => `${wrapWithQuotesIfNeeded(prop!)}: ${propSchema}`).join(", ") +
        " }";
    }

    const partial = isPartial ? ".partial()" : "";
    const strict = options?.strictObjects ? ".strict()" : "";
    return code.assign(`z.object(${properties})${partial}${strict}${additionalPropsSchema}${readonly}`);
  }

  if (!schemaType) return code.assign("z.unknown()");

  throw new Error(`Unsupported schema type: ${schemaType}`);
}

type ZodChainArgs = { schema: OpenAPIV3.SchemaObject; meta?: ZodSchemaMetaData; options?: ZodSchemasGenerateOptions };

export const getZodChain = ({ schema, meta, options }: ZodChainArgs) => {
  const chains: string[] = [];

  match(schema.type)
    .with("string", () => chains.push(getZodChainableStringValidations(schema)))
    .with("number", "integer", () => chains.push(getZodChainableNumberValidations(schema)))
    .with("array", () => chains.push(getZodChainableArrayValidations(schema)))
    .otherwise(() => void 0);

  if (typeof schema.description === "string" && schema.description !== "" && options?.withDescription) {
    if (["\n", "\r", "\r\n"].some((c) => String.prototype.includes.call(schema.description, c))) {
      chains.push(`describe(\`${schema.description}\`)`);
    } else {
      chains.push(`describe("${schema.description}")`);
    }
  }

  const output = chains
    .concat(
      getZodChainablePresence(schema, meta),
      options?.withDefaultValues !== false ? getZodChainableDefault(schema) : [],
    )
    .filter(Boolean)
    .join(".");
  return output ? `.${output}` : "";
};

const getZodChainablePresence = (schema: OpenAPIV3.SchemaObject, meta?: ZodSchemaMetaData) => {
  if (schema.nullable && !meta?.isRequired) {
    return "nullish()";
  }

  if (schema.nullable) {
    return "nullable()";
  }

  if (!meta?.isRequired) {
    return "optional()";
  }

  return "";
};

// TODO OA prefixItems -> z.tuple
const unwrapQuotesIfNeeded = (value: string | number) => {
  if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }

  return value;
};

const getZodChainableDefault = (schema: OpenAPIV3.SchemaObject) => {
  if (schema.default !== undefined) {
    const value = match(schema.type)
      .with("number", "integer", () => unwrapQuotesIfNeeded(schema.default))
      .otherwise(() => JSON.stringify(schema.default));
    return `default(${value})`;
  }

  return "";
};

const formatPatternIfNeeded = (pattern: string) => {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    pattern = pattern.slice(1, -1);
  }

  pattern = escapeControlCharacters(pattern);

  return `/${pattern}/`;
};

const getZodChainableStringValidations = (schema: OpenAPIV3.SchemaObject) => {
  const validations: string[] = [];

  if (!schema.enum) {
    if (schema.minLength !== undefined) {
      validations.push(`min(${schema.minLength})`);
    }

    if (schema.maxLength !== undefined) {
      validations.push(`max(${schema.maxLength})`);
    }
  }

  if (schema.pattern) {
    validations.push(`regex(${formatPatternIfNeeded(schema.pattern)})`);
  }

  if (schema.format) {
    const chain = match(schema.format)
      .with("email", () => "email()")
      .with("hostname", () => "url()")
      .with("uri", () => "url()")
      .with("uuid", () => "uuid()")
      .with("date-time", () => "datetime({ offset: true })")
      .otherwise(() => "");

    if (chain) {
      validations.push(chain);
    }
  }

  return validations.join(".");
};

const getZodChainableNumberValidations = (schema: OpenAPIV3.SchemaObject) => {
  const validations: string[] = [];

  // none of the chains are valid for enums
  if (schema.enum) {
    return "";
  }

  if (schema.type === "integer") {
    validations.push("int()");
  }

  if (schema.minimum !== undefined) {
    if (schema.exclusiveMinimum === true) {
      validations.push(`gt(${schema.minimum})`);
    } else {
      validations.push(`gte(${schema.minimum})`);
    }
  } else if (typeof schema.exclusiveMinimum === "number") {
    validations.push(`gt(${schema.exclusiveMinimum})`);
  }

  if (schema.maximum !== undefined) {
    if (schema.exclusiveMaximum === true) {
      validations.push(`lt(${schema.maximum})`);
    } else {
      validations.push(`lte(${schema.maximum})`);
    }
  } else if (typeof schema.exclusiveMaximum === "number") {
    validations.push(`lt(${schema.exclusiveMaximum})`);
  }

  if (schema.multipleOf) {
    validations.push(`multipleOf(${schema.multipleOf})`);
  }

  return validations.join(".");
};

const getZodChainableArrayValidations = (schema: OpenAPIV3.SchemaObject) => {
  const validations: string[] = [];

  if (schema.minItems) {
    validations.push(`min(${schema.minItems})`);
  }

  if (schema.maxItems) {
    validations.push(`max(${schema.maxItems})`);
  }

  return validations.join(".");
};
