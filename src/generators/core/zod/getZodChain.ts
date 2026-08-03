import { OpenAPIV3 } from "openapi-types";

import { GenerateOptions } from "@/generators/types/options";
import { escapeControlCharacters, unwrapQuotesIfNeeded } from "@/generators/utils/openapi.utils";

import { ZodSchemaMetaData } from "./ZodSchema.class";

const zodChainCache = new WeakMap<GenerateOptions, WeakMap<OpenAPIV3.SchemaObject, Map<string, string>>>();

export function getZodChain({
  schema,
  meta,
  options,
}: {
  schema: OpenAPIV3.SchemaObject;
  meta?: ZodSchemaMetaData;
  options: GenerateOptions;
}) {
  let optionsCache = zodChainCache.get(options);
  if (!optionsCache) {
    optionsCache = new WeakMap();
    zodChainCache.set(options, optionsCache);
  }
  let schemaCache = optionsCache.get(schema);
  if (!schemaCache) {
    schemaCache = new Map();
    optionsCache.set(schema, schemaCache);
  }
  const cacheKey = `${Boolean(meta?.isRequired)}|${Boolean(meta?.isParentPartial)}`;
  const cached = schemaCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const chains: string[] = [];

  if (schema.type === "string") {
    chains.push(getZodChainableStringValidations(schema));
  } else if (schema.type === "number" || schema.type === "integer") {
    chains.push(getZodChainableNumberValidations(schema));
  } else if (schema.type === "array") {
    chains.push(getZodChainableArrayValidations(schema));
  }

  if (typeof schema.description === "string" && schema.description !== "" && options.withDescription) {
    chains.push(`describe(${JSON.stringify(schema.description)})`);
  }

  const output = chains
    .concat(
      getZodChainablePresence({ schema, meta, options }),
      options.withDefaultValues !== false ? getZodChainableDefault(schema) : [],
    )
    .filter(Boolean)
    .join(".");

  const chain = output ? `.${output}` : "";
  schemaCache.set(cacheKey, chain);
  return chain;
}

function getZodChainablePresence({
  schema,
  meta,
  options,
}: {
  schema: OpenAPIV3.SchemaObject;
  meta?: ZodSchemaMetaData;
  options: GenerateOptions;
}) {
  if (schema.nullable && !meta?.isRequired) {
    return "nullish()";
  }

  if (schema.nullable || (options.replaceOptionalWithNullish && meta?.isParentPartial)) {
    return "nullable()";
  }

  if (!meta?.isRequired) {
    return options.replaceOptionalWithNullish ? "nullish()" : "optional()";
  }

  return "";
}

function getZodChainableDefault(schema: OpenAPIV3.SchemaObject) {
  if (schema.default !== undefined) {
    const value =
      schema.type === "number" || schema.type === "integer"
        ? unwrapQuotesIfNeeded(schema.default)
        : JSON.stringify(schema.default);
    return `default(${value})`;
  }

  return "";
}

function getZodChainableStringValidations(schema: OpenAPIV3.SchemaObject) {
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

  return validations.join(".");
}

function formatPatternIfNeeded(pattern: string) {
  if (pattern.startsWith("/") && pattern.endsWith("/")) {
    pattern = pattern.slice(1, -1);
  }

  pattern = escapeControlCharacters(pattern);

  return `/${pattern}/`;
}

function getZodChainableNumberValidations(schema: OpenAPIV3.SchemaObject) {
  const validations: string[] = [];

  // none of the chains are valid for enums
  if (schema.enum) {
    return "";
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
}

function getZodChainableArrayValidations(schema: OpenAPIV3.SchemaObject) {
  const validations: string[] = [];

  if (schema.minItems) {
    validations.push(`min(${schema.minItems})`);
  }

  if (schema.maxItems) {
    validations.push(`max(${schema.maxItems})`);
  }

  return validations.join(".");
}
