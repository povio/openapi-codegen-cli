import { OpenAPIV3 } from "openapi-types";
import { GenerateOptions } from "@/generators/types/options";
import { escapeControlCharacters, unwrapQuotesIfNeeded } from "@/generators/utils/openapi.utils";
import { match } from "ts-pattern";

import { ZodSchemaMetaData } from "./ZodSchema.class";

export function getZodChain({
  schema,
  meta,
  options,
}: {
  schema: OpenAPIV3.SchemaObject;
  meta?: ZodSchemaMetaData;
  options: GenerateOptions;
}) {
  const chains: string[] = [];

  match(schema.type)
    .with("string", () => chains.push(getZodChainableStringValidations(schema)))
    .with("number", "integer", () => chains.push(getZodChainableNumberValidations(schema)))
    .with("array", () => chains.push(getZodChainableArrayValidations(schema)))
    .otherwise(() => void 0);

  if (typeof schema.description === "string" && schema.description !== "" && options.withDescription) {
    if (["\n", "\r", "\r\n"].some((c) => String.prototype.includes.call(schema.description, c))) {
      chains.push(`describe(\`${schema.description}\`)`);
    } else {
      chains.push(`describe("${schema.description}")`);
    }
  }

  const output = chains
    .concat(
      getZodChainablePresence({ schema, meta, options }),
      options.withDefaultValues !== false ? getZodChainableDefault(schema) : [],
    )
    .filter(Boolean)
    .join(".");

  return output ? `.${output}` : "";
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
    const value = match(schema.type)
      .with("number", "integer", () => unwrapQuotesIfNeeded(schema.default))
      .otherwise(() => JSON.stringify(schema.default));
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
