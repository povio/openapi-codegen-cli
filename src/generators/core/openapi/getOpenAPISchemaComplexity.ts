import { OpenAPIV3 } from "openapi-types";
import { match } from "ts-pattern";
import { CompositeType, PrimitiveType } from "../../types/openapi";
import { sum } from "../../utils/math.utils";
import { isPrimitiveType, isReferenceObject } from "../../utils/openapi.utils";

export function getOpenAPISchemaComplexity({
  current,
  schema,
}: {
  current: number;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
}): number {
  if (!schema) {
    return current;
  }

  if (isReferenceObject(schema)) {
    return current + 2;
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.length === 1) {
      return (
        complexityByComposite("oneOf") +
        getOpenAPISchemaComplexity({ current, schema: { ...schema, type: schema.type[0] } })
      );
    }

    return (
      current +
      complexityByComposite("oneOf") +
      sum(schema.type.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: { ...schema, type: prop } })))
    );
  }

  if (schema.oneOf) {
    if (schema.oneOf.length === 1) {
      return complexityByComposite("oneOf") + getOpenAPISchemaComplexity({ current, schema: schema.oneOf[0] });
    }

    return (
      current +
      complexityByComposite("oneOf") +
      sum(schema.oneOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
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
      sum(schema.anyOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
    );
  }

  if (schema.allOf) {
    if (schema.allOf.length === 1) {
      return complexityByComposite("allOf") + getOpenAPISchemaComplexity({ current, schema: schema.allOf[0] });
    }

    return (
      current +
      complexityByComposite("allOf") +
      sum(schema.allOf.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
    );
  }

  if (!schema.type) {
    return current;
  }

  if (isPrimitiveType(schema.type)) {
    if (schema.enum) {
      return (
        current +
        complexityByType(schema as OpenAPIV3.SchemaObject & { type: PrimitiveType }) +
        complexityByComposite("enum") +
        sum(schema.enum.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
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
        sum(props.map((prop) => getOpenAPISchemaComplexity({ current: 0, schema: prop })))
      );
    }

    return complexityByComposite("empty-object") + getOpenAPISchemaComplexity({ current, schema: undefined });
  }

  return current;
}

function complexityByType(schema: OpenAPIV3.SchemaObject & { type: PrimitiveType }) {
  return match(schema.type)
    .with("string", "number", "integer", "boolean", () => 1)
    .otherwise(() => 0);
}

function complexityByComposite(type?: CompositeType) {
  return match(type)
    .with("oneOf", () => 2)
    .with("anyOf", () => 3)
    .with("allOf", () => 2)
    .with("enum", "array", "record", "empty-object", () => 1)
    .with("object", () => 2)
    .otherwise(() => 0);
}
