import { OpenAPIV3 } from "openapi-types";

import {
  UNKNOWN_SCHEMA,
  BLOB_SCHEMA,
  DATETIME_SCHEMA,
  EMAIL_SCHEMA,
  ENUM_SCHEMA,
  INT_SCHEMA,
  NUMBER_SCHEMA,
  STRING_SCHEMA,
  URL_SCHEMA,
  UUID_SCHEMA,
} from "@/generators/const/zod.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { GenerateType } from "@/generators/types/generate";
import { getNamespaceName } from "@/generators/utils/namespace.utils";
import {
  getTupleSchemaParts,
  inferRequiredSchema,
  isArraySchemaObject,
  isReferenceObject,
  isSchemaObject,
} from "@/generators/utils/openapi-schema.utils";
import { isPrimitiveType, wrapWithQuotesIfNeeded } from "@/generators/utils/openapi.utils";

import { getZodChain } from "./getZodChain";
import { getSchemaRefs } from "./getZodSchemaRefs";
import { getParentRef, ZodSchema, ZodSchemaMetaData } from "./ZodSchema.class";

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

  // Whether a member schema of this object (property or additional properties) or tuple references
  // the schema being declared, so it must be deferred with `z.lazy` to avoid reading the declaration
  // while it is initialized.
  const parentRef = getParentRef(inheritedMeta);
  const isCircularMember = (
    memberSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    memberZodSchema: ZodSchema,
  ) => {
    if (!parentRef) {
      return false;
    }
    const refs = [
      ...(isReferenceObject(memberSchema) ? [memberSchema.$ref] : []),
      ...getSchemaRefs(memberZodSchema, { skipObjectSchema: true }),
    ];
    return refs.some((ref) => resolver.dependencyGraph.deepDependencyGraph[ref]?.has(parentRef));
  };

  if (isArraySchemaObject(schema)) {
    const tuple = getTupleSchemaParts(schema);
    if (tuple) {
      // Like object properties, a referenced member gets the referenced schema's chain
      // (validation, nullability, default): the exported component schema omits its own chain.
      const getMemberSchema = (member: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject) => {
        const memberZodSchema = getZodSchema({ ...params, schema: member });
        const code = memberZodSchema.getCodeString(tag, resolver.options);
        // The chain is applied to the deferred member: checks clone a `z.lazy` schema, and a clone
        // created inside the declaration's own getter would recreate the declaration endlessly.
        return (
          (isCircularMember(member, memberZodSchema) ? `z.lazy(() => ${code})` : code) +
          getZodChain({
            schema: getTupleMemberSchemaObject(member, resolver),
            meta: { ...meta, isRequired: true },
            options: resolver.options,
          })
        );
      };
      const items = tuple.items.map(
        (item, index) => getMemberSchema(item) + (index >= (schema.minItems ?? 0) ? ".optional()" : ""),
      );
      const restSchema = typeof tuple.rest === "object" ? getMemberSchema(tuple.rest) : UNKNOWN_SCHEMA;
      const rest = tuple.rest === false ? "" : `.rest(${restSchema})`;
      return zodSchema.assign(`z.tuple([${items.join(", ")}])${rest}${readonly}`);
    }
    if (schema.items && typeof schema.items === "object") {
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

    return zodSchema.assign(`z.array(${UNKNOWN_SCHEMA})${readonly}`);
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

        return [prop, propZodSchema, isCircularMember(propSchema, zodSchema)];
      });

      properties = `{ ${propsMap
        .map(([prop, propSchema, isCircular]) =>
          isCircular
            ? `${wrapWithQuotesIfNeeded(prop!)}: z.lazy(() => ${propSchema})`
            : `${wrapWithQuotesIfNeeded(prop!)}: ${propSchema}`,
        )
        .join(", ")} }`;
    }

    let additionalPropsSchema = "";
    if (schema.additionalProperties) {
      let additionalPropsZodSchema: string = UNKNOWN_SCHEMA;
      if (typeof schema.additionalProperties === "object" && Object.keys(schema.additionalProperties).length > 0) {
        const additionalProperties = schema.additionalProperties;
        const additionalZodSchema = getZodSchema({ ...params, schema: additionalProperties });
        additionalPropsZodSchema =
          additionalZodSchema.getCodeString(tag, resolver.options) +
          getZodChain({
            schema: additionalProperties as OpenAPIV3.SchemaObject,
            meta: { ...meta, isRequired: true },
            options: resolver.options,
          });
        if (isCircularMember(additionalProperties, additionalZodSchema)) {
          additionalPropsZodSchema = `z.lazy(() => ${additionalPropsZodSchema})`;
        }
      }
      additionalPropsSchema = `.catchall(${additionalPropsZodSchema})`;
    }

    const partial = isPartial ? ".partial()" : "";
    const zodObject = `z.object(${properties})${partial}${additionalPropsSchema}${readonly}`;

    return zodSchema.assign(zodObject);
  }

  if ((schemaType as unknown) === "any") {
    return zodSchema.assign(UNKNOWN_SCHEMA);
  }

  if ((schemaType as unknown) === "null") {
    return zodSchema.assign("z.null()");
  }

  if (!schemaType) {
    return zodSchema.assign("z.unknown()");
  }

  throw new Error(`Unsupported schema type: ${schemaType}`);
}

/** The schema a tuple member's chain is built from: the referenced schema for a `$ref` member. */
export function getTupleMemberSchemaObject(
  member: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  resolver: SchemaResolver,
): OpenAPIV3.SchemaObject {
  if (!isReferenceObject(member)) {
    return member;
  }
  // `resolveObject` is also implemented by the native-extraction resolver (hybrid rendering).
  const resolved = resolver.resolveObject<OpenAPIV3.SchemaObject | undefined>(member);
  if (!resolved) {
    throw new Error(`Schema ${member.$ref} not found`);
  }
  return resolved;
}

type GetPartialZodSchemaParams = GetZodSchemaParams & { zodSchema: ZodSchema };

function getReferenceZodSchema({ schema, zodSchema, resolver, meta, tag }: GetPartialZodSchemaParams) {
  if (!isReferenceObject(schema)) {
    return;
  }

  const zodSchemaName = resolver.getZodSchemaNameByRef(schema.$ref);
  // A cycle can only exist when there are at least two ancestors. Most endpoint
  // references are roots, so avoid allocating and resolving an empty ancestry path.
  if (zodSchema.meta.referencedBy.length > 2) {
    const refsPath = zodSchema.meta.referencedBy
      .slice(0, -1)
      .map((prev) => (prev.ref ? (resolver.getZodSchemaNameByRef(prev.ref) ?? prev.ref) : undefined))
      .filter(Boolean);
    if (refsPath.length > 1 && refsPath.includes(zodSchemaName)) {
      return zodSchema.assign(resolver.getCodeByZodSchemaName(zodSchema.ref!)!);
    }
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

  // A `null` member makes the schema of the other members nullable (`type: ["object", "null"]`);
  // its other keywords (`properties`, `items`, ...) only describe the non-null members.
  const types = schema.type.filter((type) => (type as string) !== "null");
  const nullable = types.length < schema.type.length ? ".nullable()" : "";
  if (types.length === 0) {
    return zodSchema.assign("z.null()");
  }
  const codes = types.map((type) =>
    getZodSchema({ schema: { ...schema, type }, resolver, meta, tag }).getCodeString(tag, resolver.options),
  );
  return zodSchema.assign(`${codes.length === 1 ? codes[0] : `z.union([${codes.join(", ")}])`}${nullable}`);
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
    .map((type) => `...${getObjectShapeCode(type.getCodeString(tag, resolver.options), resolver.options.allReadonly)}`)
    .join(", ");
  const readonly = resolver.options.allReadonly ? ".readonly()" : "";

  return zodSchema.assign(
    `z.object({ ...${getObjectShapeCode(first.getCodeString(tag, resolver.options), resolver.options.allReadonly)}, ${rest} })${readonly}`,
  );
}

const READONLY_SUFFIX = ".readonly()";

/**
 * The `shape` of an allOf member object schema. With `allReadonly` object schemas are wrapped in
 * `.readonly()`, which has no `shape`: inline members are merged before being made readonly, and
 * referenced members are unwrapped. The merged object is made readonly instead.
 * Mirrored by `object_shape_code` in native/src/zod.rs.
 */
function getObjectShapeCode(code: string, allReadonly: boolean | undefined) {
  if (!allReadonly) {
    return `${code}.shape`;
  }
  return code.endsWith(READONLY_SUFFIX) ? `${code.slice(0, -READONLY_SUFFIX.length)}.shape` : `${code}.unwrap().shape`;
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

    if (schemaType === "integer") {
      return zodSchema.assign(schema.type === "integer" ? INT_SCHEMA : NUMBER_SCHEMA);
    }
    if (schemaType === "string") {
      let stringSchema = STRING_SCHEMA;
      switch (schema.format) {
        case "binary":
          stringSchema = BLOB_SCHEMA;
          break;
        case "email":
          stringSchema = EMAIL_SCHEMA;
          break;
        case "hostname":
        case "uri":
          stringSchema = URL_SCHEMA;
          break;
        case "uuid":
          stringSchema = UUID_SCHEMA;
          break;
        case "date-time":
          stringSchema = DATETIME_SCHEMA;
          break;
      }
      return zodSchema.assign(stringSchema);
    }
    return zodSchema.assign(`z.${schemaType}()`);
  }
}

function getEnumZodSchema({ resolver, schema, zodSchema, meta, tag }: GetPartialZodSchemaParams) {
  if (!isSchemaObject(schema)) {
    return;
  }

  const code = getEnumZodSchemaCode(schema);
  // A singleton can match an enum owned by another module without an OpenAPI
  // reference to bring that declaration into the local models. Keep the value
  // inline; named enum exports and explicit $refs are still generated normally.
  if (!resolver.options.extractEnums || (resolver.options.modelsInModules && schema.enum?.length === 1)) {
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
  const values = schema.enum?.filter((value) => value !== null) ?? [];
  return `${ENUM_SCHEMA}([${values.map(toStringLiteral).join(", ")}])`;
}

export function getEnumZodSchemaCodeFromEnumNames(enumNames: string[]) {
  return `${ENUM_SCHEMA}([${enumNames.map(toStringLiteral).join(", ")}])`;
}

/** A double-quoted, escaped TypeScript string literal of the value's text (matches the native renderer). */
function toStringLiteral(value: unknown) {
  return JSON.stringify(typeof value === "string" ? value : String(value));
}
