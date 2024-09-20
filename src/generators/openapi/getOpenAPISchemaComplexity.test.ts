import { OpenAPIV3 } from "openapi-types";
import { expect, test } from "vitest";
import { getOpenAPISchemaComplexity } from "./getOpenAPISchemaComplexity";

const getComplexity = (schema: OpenAPIV3.SchemaObject) => getOpenAPISchemaComplexity({ schema: schema, current: 0 });

test("getOpenAPISchemaComplexity", async () => {
  expect(getComplexity({ type: "boolean" })).toMatchInlineSnapshot("1");
  expect(getComplexity({ type: "string" })).toMatchInlineSnapshot("1");
  expect(getComplexity({ type: "number" })).toMatchInlineSnapshot("1");
  expect(getComplexity({ type: "integer" })).toMatchInlineSnapshot("1");

  expect(getComplexity({ type: "array", items: { type: "string" } })).toMatchInlineSnapshot("2");

  expect(getComplexity({ type: "object" })).toMatchInlineSnapshot("1");

  expect(getComplexity({ type: "object", additionalProperties: true })).toMatchInlineSnapshot("1");
  expect(getComplexity({ type: "object", additionalProperties: { type: "string" } })).toMatchInlineSnapshot("2");

  expect(
    getComplexity({
      type: "object",
      additionalProperties: { type: "object", properties: { str: { type: "string" } } },
    }),
  ).toMatchInlineSnapshot("4");
  expect(
    getComplexity({
      type: "object",
      additionalProperties: { type: "object", properties: { str: { type: "string" }, nb: { type: "number" } } },
    }),
  ).toMatchInlineSnapshot("5");

  expect(getComplexity({ type: "object", properties: { str: { type: "string" } } })).toMatchInlineSnapshot("3");
  expect(
    getComplexity({ type: "object", properties: { reference: { $ref: "#/components/schemas/Basic" } } }),
  ).toMatchInlineSnapshot("4");
  expect(
    getComplexity({
      type: "object",
      properties: { refArray: { type: "array", items: { $ref: "#/components/schemas/Basic" } } },
    }),
  ).toMatchInlineSnapshot("5");
  expect(
    getComplexity({ type: "object", properties: { str: { type: "string" }, nb: { type: "number" } } }),
  ).toMatchInlineSnapshot("4");

  expect(
    getComplexity({
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
  ).toMatchInlineSnapshot("7");

  expect(
    getComplexity({
      type: "array",
      items: {
        type: "object",
        properties: {
          str: { type: "string" },
        },
      },
    }),
  ).toMatchInlineSnapshot("4");

  expect(
    getComplexity({
      type: "array",
      items: {
        type: "array",
        items: {
          type: "string",
        },
      },
    }),
  ).toMatchInlineSnapshot("3");

  expect(
    getComplexity({
      type: "object",
      properties: {
        union: { oneOf: [{ type: "string" }] },
      },
    }),
  ).toMatchInlineSnapshot("5");
  expect(
    getComplexity({
      type: "object",
      properties: {
        union: { oneOf: [{ type: "string" }, { type: "number" }] },
      },
    }),
  ).toMatchInlineSnapshot("6");

  expect(
    getComplexity({
      type: "object",
      properties: {
        unionOrArrayOfUnion: { anyOf: [{ type: "string" }] },
      },
    }),
  ).toMatchInlineSnapshot("6");
  expect(
    getComplexity({
      type: "object",
      properties: {
        unionOrArrayOfUnion: { anyOf: [{ type: "string" }, { type: "number" }] },
      },
    }),
  ).toMatchInlineSnapshot("7");

  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: { allOf: [{ type: "string" }] },
      },
    }),
  ).toMatchInlineSnapshot("5");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: { allOf: [{ type: "string" }, { type: "number" }] },
      },
    }),
  ).toMatchInlineSnapshot("6");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
        },
      },
    }),
  ).toMatchInlineSnapshot("7");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }, { type: "integer" }],
        },
      },
    }),
  ).toMatchInlineSnapshot("8");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "array", items: { type: "string" } },
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot("9");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "array", items: { type: "string" } },
            { type: "object" },
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot("10");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "array", items: { type: "string" } },
            { type: "object" },
            { type: "object" },
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot("11");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "array", items: { type: "string" } },
            { type: "object" },
            {
              type: "object",
              properties: {
                str: { type: "string" },
              },
            },
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot("13");
  expect(
    getComplexity({
      type: "object",
      properties: {
        intersection: {
          allOf: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "array", items: { type: "string" } },
            { type: "object" },
            {
              type: "object",
              properties: {
                str: { type: "string" },
                nb: { type: "number" },
              },
            },
          ],
        },
      },
    }),
  ).toMatchInlineSnapshot("14");

  expect(getComplexity({ type: "string", enum: ["aaa", "bbb", "ccc"] })).toMatchInlineSnapshot("2");
  expect(getComplexity({ type: "number", enum: [1, 2, 3, null] })).toMatchInlineSnapshot("2");
});
