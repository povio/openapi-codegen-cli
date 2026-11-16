import { afterEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { renderParityCase } from "../../scripts/renderer-parity-cases";

const oddValues = ['a"b', "c\\d", "line\nbreak", "普通", "x*/y", "\u0001 "];

const document = {
  openapi: "3.1.0",
  info: { title: "Literals", version: "1.0.0" },
  paths: {
    "/literals": {
      get: {
        operationId: "getLiterals",
        tags: ["Literals"],
        summary: "Summary */ closes",
        description: "Description */ closes",
        responses: {
          "200": {
            description: "Response */ closes",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Literals" } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Odd: { type: "string", enum: oddValues },
      Pair: { type: "array", prefixItems: [{ type: "string" }, { type: "integer" }], items: false, minItems: 2 },
      Tagged: { type: "array", prefixItems: [{ $ref: "#/components/schemas/Item" }], items: { type: "boolean" } },
      Open: { type: "array", prefixItems: [{ type: "string" }] },
      Empty: { type: "array", items: false },
      Item: { type: "object", required: ["id"], properties: { id: { type: "string", description: "Id */ closes" } } },
      Literals: {
        type: "object",
        description: "Model */ closes",
        properties: {
          free: { type: "object", additionalProperties: true },
          untyped: { type: "array" },
          inline: { type: "string", enum: ['q"', "r\\"], description: "Inline */ closes" },
          fallback: { type: "string", default: 'd"\\' },
        },
      },
    },
  },
};

afterEach(() => vi.unstubAllEnvs());

const render = (renderer: "js" | "native") => {
  vi.stubEnv("OPENAPI_CODEGEN_NATIVE", renderer === "native" ? "1" : "0");
  const result = renderParityCase(
    JSON.stringify(document),
    {
      name: "literals",
      options: {
        splitByTags: true,
        tsNamespaces: false,
        excludeRedundantZodSchemas: false,
        generateJsDoc: true,
        extractEnums: false,
      },
    },
    renderer,
  );
  expect(result.route).toBe(renderer === "native" ? "full-native" : "js");
  return result.files;
};

// Components no operation uses are rendered in the common models.
const renderModels = (renderer: "js" | "native") =>
  render(renderer)
    .filter((file) => file.fileName.endsWith(".models.ts"))
    .map((file) => file.content)
    .join("\n");

const evaluate = (models: string, name: string, scope: Record<string, z.ZodType> = {}) => {
  const prefix = `export const ${name} = `;
  const declaration = models.split("\n").find((line) => line.startsWith(prefix))!;
  const code = declaration.slice(prefix.length).replace(/;$/, "");
  return new Function("z", ...Object.keys(scope), `return ${code};`)(z, ...Object.values(scope)) as z.ZodType;
};

describe("schema literals and documentation text", () => {
  test("renderers produce identical output", () => {
    expect(render("native")).toEqual(render("js"));
  });

  for (const renderer of ["js", "native"] as const) {
    describe(renderer, () => {
      test("string enum values are escaped string literals", () => {
        const models = renderModels(renderer);
        const odd = evaluate(models, "OddSchema") as z.ZodEnum;
        expect(odd.options).toEqual(oddValues);
        const literals = evaluate(models, "LiteralsSchema");
        expect(literals.parse({ inline: 'q"' })).toEqual({ inline: 'q"', fallback: 'd"\\' });
        expect(literals.safeParse({ inline: "q" }).success).toBe(false);
      });

      test("prefixItems render as tuples", () => {
        const models = renderModels(renderer);
        const pair = evaluate(models, "PairSchema");
        expect(pair.safeParse(["a", 1]).success).toBe(true);
        for (const value of [["a", 1, 2], [1, "a"], [true]]) {
          expect(pair.safeParse(value).success).toBe(false);
        }
        const tagged = evaluate(models, "TaggedSchema", { ItemSchema: evaluate(models, "ItemSchema") });
        expect(tagged.safeParse([{ id: "1" }, true, false]).success).toBe(true);
        expect(tagged.safeParse([{ id: "1" }, "x"]).success).toBe(false);
        expect(evaluate(models, "OpenSchema").safeParse(["a", 1, null]).success).toBe(true);
        expect(evaluate(models, "EmptySchema").safeParse([1]).success).toBe(false);
      });

      test("unknown values are typed unknown, never any", () => {
        const files = render(renderer);
        const models = renderModels(renderer);
        expect(models).toContain("free: z.object({}).catchall(z.unknown())");
        expect(models).toContain("untyped: z.array(z.unknown())");
        expect(models).toContain(".rest(z.unknown())");
        for (const { content } of files) {
          expect(content).not.toMatch(/\bz\.any\(|:\s*any\b|\bas any\b|<any>/);
        }
      });

      test("descriptions cannot end a JSDoc comment early", () => {
        for (const { content } of render(renderer)) {
          // Every block comment must end at its own closing line, so no documentation text survives.
          const code = content.replace(/\/\*[\s\S]*?\*\//g, "");
          expect(code).not.toContain("closes");
        }
        const queries = render(renderer).find((file) => file.fileName.endsWith(".queries.ts"))!.content;
        expect(queries).toContain(" * @summary Summary *\\/ closes");
      });
    });
  }
});
