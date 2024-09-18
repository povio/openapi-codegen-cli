import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { OpenAPISchemaResolver } from "../openapi/openapi-schema-resolver.class";
import { asComponentSchema } from "../openapi/openapi.utils";
import { getZodSchema } from "./zod-schema-extraction.utils";
import { ZodSchemaMetaData } from "./zod-schema.class";

const makeSchema = (schema: OpenAPIV3.SchemaObject) => schema;
const getZodSchemaString = (schema: OpenAPIV3.SchemaObject, meta?: ZodSchemaMetaData | undefined) =>
  getZodSchema({ schema: makeSchema(schema), meta }).toString();

describe("Utils: zod-schema-extraction", () => {
  test("getZodSchemaString", () => {
    expect(getZodSchemaString({ type: "boolean" })).toMatchInlineSnapshot('"z.boolean()"');
    expect(getZodSchemaString({ type: "string" })).toMatchInlineSnapshot('"z.string()"');
    expect(getZodSchemaString({ type: "number" })).toMatchInlineSnapshot('"z.number()"');
    expect(getZodSchemaString({ type: "integer" })).toMatchInlineSnapshot('"z.number()"');
    // expect(getZodSchemaString({ type: "string", format: "date-time" })).toMatchInlineSnapshot('"z.string().datetime()"');
    // expect(getZodSchemaString({ type: "number", nullable: true, minimum: 0 })).toMatchInlineSnapshot('"z.number().nullable().gte(0)"');

    expect(getZodSchemaString({ type: "array", items: { type: "string" } })).toMatchInlineSnapshot(
      '"z.array(z.string())"',
    );
    expect(getZodSchemaString({ type: "object" })).toMatchInlineSnapshot('"z.object({}).partial().passthrough()"');
    expect(getZodSchemaString({ type: "object", properties: { str: { type: "string" } } })).toMatchInlineSnapshot(
      '"z.object({ str: z.string() }).partial().passthrough()"',
    );

    expect(getZodSchemaString({ type: "object", properties: { str: { type: "string" } } })).toMatchInlineSnapshot(
      '"z.object({ str: z.string() }).partial().passthrough()"',
    );

    expect(getZodSchemaString({ type: "object", properties: { nb: { type: "integer" } } })).toMatchInlineSnapshot(
      '"z.object({ nb: z.number().int() }).partial().passthrough()"',
    );

    expect(
      getZodSchemaString({ type: "object", properties: { pa: { type: "number", minimum: 0 } } }),
    ).toMatchInlineSnapshot('"z.object({ pa: z.number().gte(0) }).partial().passthrough()"');

    expect(
      getZodSchemaString({ type: "object", properties: { pa: { type: "number", minimum: 0, maximum: 100 } } }),
    ).toMatchInlineSnapshot('"z.object({ pa: z.number().gte(0).lte(100) }).partial().passthrough()"');

    expect(
      getZodSchemaString({ type: "object", properties: { ml: { type: "string", minLength: 0 } } }),
    ).toMatchInlineSnapshot('"z.object({ ml: z.string().min(0) }).partial().passthrough()"');

    expect(
      getZodSchemaString({ type: "object", properties: { dt: { type: "string", format: "date-time" } } }),
    ).toMatchInlineSnapshot('"z.object({ dt: z.string().datetime({ offset: true }) }).partial().passthrough()"');

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          str: { type: "string" },
          nb: { type: "number" },
          nested: {
            type: "object",
            properties: {
              nested_prop: { type: "boolean" },
            },
          },
        },
      }),
    ).toMatchInlineSnapshot(
      '"z.object({ str: z.string(), nb: z.number(), nested: z.object({ nested_prop: z.boolean() }).partial().passthrough() }).partial().passthrough()"',
    );

    expect(
      getZodSchemaString({
        type: "array",
        items: {
          type: "object",
          properties: {
            str: { type: "string" },
          },
        },
      }),
    ).toMatchInlineSnapshot('"z.array(z.object({ str: z.string() }).partial().passthrough())"');

    expect(
      getZodSchemaString({
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string",
          },
        },
      }),
    ).toMatchInlineSnapshot('"z.array(z.array(z.string()))"');

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          union: { oneOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toMatchInlineSnapshot('"z.object({ union: z.union([z.string(), z.number()]) }).partial().passthrough()"');

    expect(
      getZodSchemaString({
        type: "object",
        oneOf: [
          {
            type: "object",
            required: ["type", "a"],
            properties: {
              type: {
                type: "string",
                enum: ["a"],
              },
              a: {
                type: "string",
              },
            },
          },
          {
            type: "object",
            required: ["type", "b"],
            properties: {
              type: {
                type: "string",
                enum: ["b"],
              },
              b: {
                type: "string",
              },
            },
          },
        ],
        discriminator: { propertyName: "type" },
      }),
    ).toMatchInlineSnapshot(`
    "
            z.discriminatedUnion("type", [z.object({ type: z.literal("a"), a: z.string() }).passthrough(), z.object({ type: z.literal("b"), b: z.string() }).passthrough()])
              "
  `);

    // returns z.discriminatedUnion, when allOf has single object
    expect(
      getZodSchemaString({
        type: "object",
        oneOf: [
          {
            type: "object",
            allOf: [
              {
                type: "object",
                required: ["type", "a"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["a"],
                  },
                  a: {
                    type: "string",
                  },
                },
              },
            ],
          },
          {
            type: "object",
            allOf: [
              {
                type: "object",
                required: ["type", "b"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["b"],
                  },
                  b: {
                    type: "string",
                  },
                },
              },
            ],
          },
        ],
        discriminator: { propertyName: "type" },
      }),
    ).toMatchInlineSnapshot(`
  "
          z.discriminatedUnion("type", [z.object({ type: z.literal("a"), a: z.string() }).passthrough(), z.object({ type: z.literal("b"), b: z.string() }).passthrough()])
            "
  `);

    // returns z.union, when allOf has multiple objects
    expect(
      getZodSchemaString({
        type: "object",
        oneOf: [
          {
            type: "object",
            allOf: [
              {
                type: "object",
                required: ["type", "a"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["a"],
                  },
                  a: {
                    type: "string",
                  },
                },
              },
              {
                type: "object",
                required: ["type", "c"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["c"],
                  },
                  c: {
                    type: "string",
                  },
                },
              },
            ],
          },
          {
            type: "object",
            allOf: [
              {
                type: "object",
                required: ["type", "b"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["b"],
                  },
                  b: {
                    type: "string",
                  },
                },
              },
              {
                type: "object",
                required: ["type", "d"],
                properties: {
                  type: {
                    type: "string",
                    enum: ["d"],
                  },
                  d: {
                    type: "string",
                  },
                },
              },
            ],
          },
        ],
        discriminator: { propertyName: "type" },
      }),
    ).toMatchInlineSnapshot(
      '"z.union([z.object({ type: z.literal("a"), a: z.string() }).passthrough().and(z.object({ type: z.literal("c"), c: z.string() }).passthrough()), z.object({ type: z.literal("b"), b: z.string() }).passthrough().and(z.object({ type: z.literal("d"), d: z.string() }).passthrough())])"',
    );

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          anyOfExample: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toMatchInlineSnapshot('"z.object({ anyOfExample: z.union([z.string(), z.number()]) }).partial().passthrough()"');

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          intersection: { allOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toMatchInlineSnapshot('"z.object({ intersection: z.string().and(z.number()) }).partial().passthrough()"');

    expect(getZodSchemaString({ type: "string", enum: ["aaa", "bbb", "ccc"] })).toMatchInlineSnapshot(
      '"z.enum(["aaa", "bbb", "ccc"])"',
    );
    expect(getZodSchemaString({ type: "number", enum: [1, 2, 3, null] })).toMatchInlineSnapshot(
      '"z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(null)])"',
    );
    expect(getZodSchemaString({ type: "number", enum: [1] })).toMatchInlineSnapshot('"z.literal(1)"');
    expect(getZodSchemaString({ type: "string", enum: ["aString"] })).toMatchInlineSnapshot('"z.literal("aString")"');
  });

  test("getSchemaWithChainableAsZodString", () => {
    expect(getZodSchemaString({ type: "string", nullable: true })).toMatchInlineSnapshot('"z.string()"');
    expect(getZodSchemaString({ type: "string", nullable: false })).toMatchInlineSnapshot('"z.string()"');

    expect(getZodSchemaString({ type: "string", nullable: false }, { isRequired: true })).toMatchInlineSnapshot(
      '"z.string()"',
    );
    expect(getZodSchemaString({ type: "string", nullable: true }, { isRequired: true })).toMatchInlineSnapshot(
      '"z.string()"',
    );
  });

  test("ZodSchema with missing ref", () => {
    expect(() =>
      getZodSchema({
        schema: makeSchema({
          type: "object",
          properties: {
            str: { type: "string" },
            reference: {
              $ref: "Example",
            },
            inline: {
              type: "object",
              properties: {
                nested_prop: { type: "boolean" },
              },
            },
          },
        }),
        resolver: new OpenAPISchemaResolver({ components: { schemas: {} } } as any),
      }),
    ).toThrowErrorMatchingInlineSnapshot("[Error: Schema Example not found]");
  });

  test("ZodSchema with ref", () => {
    const schemas = {
      Example: {
        type: "object",
        properties: {
          exampleProp: { type: "string" },
          another: { type: "number" },
        },
      },
    } as Record<string, OpenAPIV3.SchemaObject>;
    const resolver = new OpenAPISchemaResolver({ components: { schemas } } as any);
    Object.keys(schemas).forEach((key) => resolver.getSchemaByRef(asComponentSchema(key)));

    const code = getZodSchema({
      schema: makeSchema({
        type: "object",
        properties: {
          str: { type: "string" },
          reference: {
            $ref: "#/components/schemas/Example",
          },
          inline: {
            type: "object",
            properties: {
              nested_prop: { type: "boolean" },
            },
          },
        },
      }),
      resolver,
    });
    expect(code.toString()).toMatchInlineSnapshot(
      '"z.object({ str: z.string(), reference: Example, inline: z.object({ nested_prop: z.boolean() }).partial().passthrough() }).partial().passthrough()"',
    );
    expect(code.children).toMatchInlineSnapshot(`
    [
        "z.string()",
        "Example",
        "z.object({ nested_prop: z.boolean() }).partial().passthrough()",
    ]
  `);
  });

  test("ZodSchema with nested refs", () => {
    const schemas = {
      Basic: { type: "object", properties: { prop: { type: "string" }, second: { type: "number" } } },
      WithNested: {
        type: "object",
        properties: { nested: { type: "string" }, nestedRef: { $ref: "#/components/schemas/DeepNested" } },
      },
      ObjectWithArrayOfRef: {
        type: "object",
        properties: {
          exampleProp: { type: "string" },
          another: { type: "number" },
          link: { type: "array", items: { $ref: "#/components/schemas/WithNested" } },
          someReference: { $ref: "#/components/schemas/Basic" },
        },
      },
      DeepNested: { type: "object", properties: { deep: { type: "boolean" } } },
    } as Record<string, OpenAPIV3.SchemaObject>;
    const resolver = new OpenAPISchemaResolver({ components: { schemas } } as any);
    const ctx = {
      zodSchemas: {},
      schemas: {},
    };
    Object.keys(schemas).forEach((key) => resolver.getSchemaByRef(asComponentSchema(key)));

    const code = getZodSchema({
      schema: makeSchema({
        type: "object",
        properties: {
          str: { type: "string" },
          reference: {
            $ref: "#/components/schemas/ObjectWithArrayOfRef",
          },
          inline: {
            type: "object",
            properties: {
              nested_prop: { type: "boolean" },
            },
          },
          another: { $ref: "#components/schemas/WithNested" },
          basic: { $ref: "#/components/schemas/Basic" },
          differentPropSameRef: { $ref: "#/components/schemas/Basic" },
        },
      }),
      resolver,
      ctx,
    });
    expect(code.toString()).toMatchInlineSnapshot(
      '"z.object({ str: z.string(), reference: ObjectWithArrayOfRef, inline: z.object({ nested_prop: z.boolean() }).partial().passthrough(), another: WithNested, basic: Basic, differentPropSameRef: Basic }).partial().passthrough()"',
    );
    expect(code.children).toMatchInlineSnapshot(`
    [
        "z.string()",
        "ObjectWithArrayOfRef",
        "z.object({ nested_prop: z.boolean() }).partial().passthrough()",
        "WithNested",
        "Basic",
        "Basic",
    ]
  `);
    expect(ctx.zodSchemas).toStrictEqual({
      Basic: "z.object({ prop: z.string(), second: z.number() }).partial().passthrough()",
      DeepNested: "z.object({ deep: z.boolean() }).partial().passthrough()",
      ObjectWithArrayOfRef:
        "z.object({ exampleProp: z.string(), another: z.number(), link: z.array(WithNested), someReference: Basic }).partial().passthrough()",
      WithNested: "z.object({ nested: z.string(), nestedRef: DeepNested }).partial().passthrough()",
    });
    expect(ctx.schemas).toStrictEqual({});
  });
});