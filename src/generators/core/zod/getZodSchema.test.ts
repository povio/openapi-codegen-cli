import { OpenAPIV3 } from "openapi-types";
import { DEFAULT_GENERATE_OPTIONS } from "src/generators/const/options.const";
import { SchemaResolver } from "src/generators/core/SchemaResolver.class";
import { GenerateOptions } from "src/generators/types/options";
import { getSchemaRef } from "src/generators/utils/openapi.utils";
import { describe, expect, test } from "vitest";

import { getZodSchema } from "./getZodSchema";
import { ZodSchemaMetaData } from "./ZodSchema.class";

const generateOptions = {
  ...DEFAULT_GENERATE_OPTIONS,
  schemaSuffix: "",
} as GenerateOptions;

const makeSchema = (schema: OpenAPIV3.SchemaObject) => schema;
const getZodSchemaString = (schema: OpenAPIV3.SchemaObject, meta?: ZodSchemaMetaData | undefined) =>
  getZodSchema({
    schema: makeSchema(schema),
    meta,
    tag: "",
    resolver: new SchemaResolver({} as OpenAPIV3.Document, generateOptions),
  })
    .getCodeString()
    .trim();

describe("getZodSchema", () => {
  test("getZodSchemaString", () => {
    expect(getZodSchemaString({ type: "boolean" })).toStrictEqual("z.boolean()");
    expect(getZodSchemaString({ type: "string" })).toStrictEqual("z.string()");
    expect(getZodSchemaString({ type: "number" })).toStrictEqual("z.number()");
    expect(getZodSchemaString({ type: "integer" })).toStrictEqual("z.int()");

    expect(getZodSchemaString({ type: "array", items: { type: "string" } })).toStrictEqual("z.array(z.string())");
    expect(getZodSchemaString({ type: "object" })).toStrictEqual("z.object({})");
    expect(getZodSchemaString({ type: "object", properties: { str: { type: "string" } } })).toStrictEqual(
      "z.object({ str: z.string() }).partial()",
    );

    expect(getZodSchemaString({ type: "object", properties: { str: { type: "string" } } })).toStrictEqual(
      "z.object({ str: z.string() }).partial()",
    );

    expect(getZodSchemaString({ type: "object", properties: { nb: { type: "integer" } } })).toStrictEqual(
      "z.object({ nb: z.int() }).partial()",
    );

    expect(getZodSchemaString({ type: "object", properties: { pa: { type: "number", minimum: 0 } } })).toStrictEqual(
      "z.object({ pa: z.number().gte(0) }).partial()",
    );

    expect(
      getZodSchemaString({ type: "object", properties: { pa: { type: "number", minimum: 0, maximum: 100 } } }),
    ).toStrictEqual("z.object({ pa: z.number().gte(0).lte(100) }).partial()");

    expect(getZodSchemaString({ type: "object", properties: { ml: { type: "string", minLength: 0 } } })).toStrictEqual(
      "z.object({ ml: z.string().min(0) }).partial()",
    );

    expect(
      getZodSchemaString({ type: "object", properties: { dt: { type: "string", format: "date-time" } } }),
    ).toStrictEqual("z.object({ dt: z.iso.datetime({ offset: true }) }).partial()");

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
    ).toStrictEqual(
      "z.object({ str: z.string(), nb: z.number(), nested: z.object({ nested_prop: z.boolean() }).partial() }).partial()",
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
    ).toStrictEqual("z.array(z.object({ str: z.string() }).partial())");

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
    ).toStrictEqual("z.array(z.array(z.string()))");

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          union: { oneOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toStrictEqual("z.object({ union: z.union([z.string(), z.number()]) }).partial()");

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
    ).toStrictEqual(
      `z.discriminatedUnion("type", [z.object({ type: z.enum(["a"]), a: z.string() }), z.object({ type: z.enum(["b"]), b: z.string() })])`,
    );

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
    ).toStrictEqual(
      `z.discriminatedUnion("type", [z.object({ type: z.enum(["a"]), a: z.string() }), z.object({ type: z.enum(["b"]), b: z.string() })])`,
    );

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
    ).toStrictEqual(
      'z.union([z.object({ ...z.object({ type: z.enum(["a"]), a: z.string() }).shape, ...z.object({ type: z.enum(["c"]), c: z.string() }).shape }), z.object({ ...z.object({ type: z.enum(["b"]), b: z.string() }).shape, ...z.object({ type: z.enum(["d"]), d: z.string() }).shape })])',
    );

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          anyOfExample: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toStrictEqual("z.object({ anyOfExample: z.union([z.string(), z.number()]) }).partial()");

    expect(
      getZodSchemaString({
        type: "object",
        properties: {
          intersection: { allOf: [{ type: "string" }, { type: "number" }] },
        },
      }),
    ).toStrictEqual("z.object({ intersection: z.object({ ...z.string().shape, ...z.number().shape }) }).partial()");

    expect(getZodSchemaString({ type: "string", enum: ["aaa", "bbb", "ccc"] })).toStrictEqual(
      'z.enum(["aaa", "bbb", "ccc"])',
    );
    expect(getZodSchemaString({ type: "number", enum: [1, 2, 3, null] })).toStrictEqual(
      "z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(null)])",
    );
    expect(getZodSchemaString({ type: "number", enum: [1] })).toStrictEqual("z.literal(1)");
    expect(getZodSchemaString({ type: "string", enum: ["aString"] })).toStrictEqual('z.enum(["aString"])');
  });

  test("getSchemaWithChainableAsZodString", () => {
    expect(getZodSchemaString({ type: "string", nullable: true })).toStrictEqual("z.string()");
    expect(getZodSchemaString({ type: "string", nullable: false })).toStrictEqual("z.string()");

    expect(getZodSchemaString({ type: "string", nullable: false }, { isRequired: true })).toStrictEqual("z.string()");
    expect(getZodSchemaString({ type: "string", nullable: true }, { isRequired: true })).toStrictEqual("z.string()");
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
        resolver: new SchemaResolver({ components: { schemas: {} } } as OpenAPIV3.Document, generateOptions),
        tag: "",
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
    const resolver = new SchemaResolver({ components: { schemas } } as OpenAPIV3.Document, generateOptions);
    Object.keys(schemas).forEach((key) => resolver.getSchemaByRef(getSchemaRef(key)));

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
      tag: "",
    });
    expect(code.getCodeString()).toStrictEqual(
      "z.object({ str: z.string(), reference: Example, inline: z.object({ nested_prop: z.boolean() }).partial() }).partial()",
    );
    expect(code.children.map((value) => value.getCodeString())).toStrictEqual([
      "z.string()",
      "Example",
      "z.object({ nested_prop: z.boolean() }).partial()",
    ]);
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
    const resolver = new SchemaResolver({ components: { schemas } } as OpenAPIV3.Document, generateOptions);
    Object.keys(schemas).forEach((key) => resolver.getSchemaByRef(getSchemaRef(key)));

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
      tag: "",
    });
    expect(code.getCodeString()).toStrictEqual(
      "z.object({ str: z.string(), reference: ObjectWithArrayOfRef, inline: z.object({ nested_prop: z.boolean() }).partial(), another: WithNested, basic: Basic, differentPropSameRef: Basic }).partial()",
    );
    expect(code.children.map((value) => value.getCodeString())).toStrictEqual([
      "z.string()",
      "ObjectWithArrayOfRef",
      "z.object({ nested_prop: z.boolean() }).partial()",
      "WithNested",
      "Basic",
      "Basic",
    ]);
    expect(resolver.getZodSchemas()).toStrictEqual({
      Basic: "z.object({ prop: z.string(), second: z.number() }).partial()",
      DeepNested: "z.object({ deep: z.boolean() }).partial()",
      ObjectWithArrayOfRef:
        "z.object({ exampleProp: z.string(), another: z.number(), link: z.array(WithNested), someReference: Basic }).partial()",
      WithNested: "z.object({ nested: z.string(), nestedRef: DeepNested }).partial()",
    });
    expect(resolver["compositeZodSchemaData"]).toStrictEqual([]);
  });
});
