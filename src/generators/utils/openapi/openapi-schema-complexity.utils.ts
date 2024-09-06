import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { isPrimitiveType, isReferenceObject, PrimitiveType } from "./openapi.utils";

type CompositeType = "oneOf" | "anyOf" | "allOf" | "enum" | "array" | "empty-object" | "object" | "record";

export function getOpenAPISchemaComplexity({
  current,
  schema,
}: {
  current: number;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
}): number {
  if (!schema) return current;
  if (isReferenceObject(schema)) return current + 2;

  if (Array.isArray(schema.type)) {
    if (schema.type.length === 1) {
      return (
        complexityByComposite("oneOf") +
        getOpenAPISchemaComplexity({ current, schema: { ...schema, type: schema.type[0]! } })
      );
    }

    return (
      current +
      complexityByComposite("oneOf") +
      getSum(schema.type.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: { ...schema, type: prop } })))
    );
  }

  if (schema.oneOf) {
    if (schema.oneOf.length === 1) {
      return complexityByComposite("oneOf") + getOpenAPISchemaComplexity({ current, schema: schema.oneOf[0] });
    }

    return (
      current +
      complexityByComposite("oneOf") +
      getSum(schema.oneOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
    );
  }

  // anyOf = oneOf but with 1 or more = `T extends oneOf ? T | T[] : never`
  if (schema.anyOf) {
    if (schema.anyOf.length === 1) {
      return complexityByComposite("anyOf") + getOpenAPISchemaComplexity({ current, schema: schema.anyOf[0] });
    }

    return (
      current +
      complexityByComposite("anyOf") +
      getSum(schema.anyOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
    );
  }

  if (schema.allOf) {
    if (schema.allOf.length === 1) {
      return complexityByComposite("allOf") + getOpenAPISchemaComplexity({ current, schema: schema.allOf[0] });
    }

    return (
      current +
      complexityByComposite("allOf") +
      getSum(schema.allOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
    );
  }

  if (!schema.type) return current;

  if (isPrimitiveType(schema.type)) {
    if (schema.enum) {
      return (
        current +
        complexityByType(schema as OpenAPIV3.SchemaObject & { type: PrimitiveType }) +
        complexityByComposite("enum") +
        getSum(schema.enum.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
      );
    }

    return current + complexityByType(schema as OpenAPIV3.SchemaObject & { type: PrimitiveType });
  }

  if (schema.type === "array") {
    if (schema.items) {
      return complexityByComposite("array") + getOpenAPISchemaComplexity({ current, schema: schema.items });
    }

    return complexityByComposite("array") + getOpenAPISchemaComplexity({ current, schema: undefined });
  }

  if (schema.type === "object" || schema.properties || schema.additionalProperties) {
    if (schema.additionalProperties) {
      if (schema.additionalProperties === true) {
        return complexityByComposite("record") + getOpenAPISchemaComplexity({ current, schema: undefined });
      }

      return (
        complexityByComposite("record") + getOpenAPISchemaComplexity({ current, schema: schema.additionalProperties })
      );
    }

    if (schema.properties) {
      const props = Object.values(schema.properties);

      return (
        current +
        complexityByComposite("object") +
        getSum(props.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
      );
    }

    return complexityByComposite("empty-object") + getOpenAPISchemaComplexity({ current, schema: undefined });
  }

  return current;
}

const getSum = (arr: number[]) => arr.reduce((acc, item) => acc + item, 0);

const complexityByType = (schema: OpenAPIV3.SchemaObject & { type: PrimitiveType }) => {
  const type = schema.type;
  if (!type) return 0;

  return match(type)
    .with("string", () => 1)
    .with("number", () => 1)
    .with("integer", () => 1)
    .with("boolean", () => 1)
    .otherwise(() => 0);
};

const complexityByComposite = (from?: CompositeType | undefined) => {
  if (!from) return 0;

  return match(from)
    .with("oneOf", () => 2)
    .with("anyOf", () => 3)
    .with("allOf", () => 2)
    .with("enum", () => 1)
    .with("array", () => 1)
    .with("record", () => 1)
    .with("empty-object", () => 1)
    .with("object", () => 2)
    .otherwise(() => 0);
};
