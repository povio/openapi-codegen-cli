import { describe, expect, test } from "vitest";
import { OpenAPIV3 } from "openapi-types";
import { z } from "zod";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { SchemaResolver } from "@/generators/core/SchemaResolver.class";
import { getZodSchema } from "./getZodSchema";
import { getZodChain } from "./getZodChain";

const compile = (schema: object) => {
  const typed = schema as OpenAPIV3.SchemaObject;
  const options = DEFAULT_GENERATE_OPTIONS;
  const resolver = new SchemaResolver({} as OpenAPIV3.Document, options);
  const code = getZodSchema({ schema: typed, resolver, tag: "" }).getCodeString();
  const chain = getZodChain({ schema: typed, options, meta: { isRequired: true } });
  return { code: code + chain, schema: new Function("z", `return ${code}${chain}`)(z) as z.ZodType };
};

describe("JSON Schema tuple items", () => {
  test("validates nested fixed-length ACL tuples", () => {
    const { schema } = compile({
      type: "array",
      items: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: [{ type: "string" }, { type: "string" }],
      },
    });
    expect(schema.safeParse([["read", "Firm"]]).success).toBe(true);
    for (const value of [[["read"]], [["read", 2]], [["read", "Firm", "extra"]]]) {
      expect(schema.safeParse(value).success).toBe(false);
    }
  });
  test("allows omitted positions and extra items unless constrained", () => {
    const { schema } = compile({ type: "array", items: [{ type: "string" }, { type: "number" }] });
    for (const value of [[], ["read"], ["read", 2], ["read", 2, true]]) {
      expect(schema.safeParse(value).success).toBe(true);
    }
    expect(schema.safeParse([2]).success).toBe(false);
  });
  test("honors additionalItems schemas and false", () => {
    const base = { type: "array", items: [{ type: "string" }], minItems: 1 };
    const closed = compile({ ...base, additionalItems: false }).schema;
    expect(closed.safeParse(["read"]).success).toBe(true);
    expect(closed.safeParse(["read", 2]).success).toBe(false);
    const typed = compile({ ...base, additionalItems: { type: "number" } }).schema;
    expect(typed.safeParse(["read", 2]).success).toBe(true);
    expect(typed.safeParse(["read", "extra"]).success).toBe(false);
  });
});
