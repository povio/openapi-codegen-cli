import { afterEach, describe, expect, test, vi } from "vitest";
import { renderParityCase } from "../../scripts/renderer-parity-cases";

const cases = [
  {
    name: "escaped URL",
    pattern: String.raw`^https?:\/\/.+$`,
    valid: "https://example.com",
    invalid: "https:example.com",
  },
  { name: "unescaped URL", pattern: "^https?://.+$", valid: "http://example.com", invalid: "http:example.com" },
  { name: "even backslashes", pattern: String.raw`^\\/end$`, valid: String.raw`\/end`, invalid: "/end" },
  { name: "odd backslashes", pattern: String.raw`^\\\/end$`, valid: String.raw`\/end`, invalid: "/end" },
  { name: "leading slash", pattern: "/start", valid: "/start", invalid: "start" },
  { name: "trailing slash", pattern: "end/", valid: "end/", invalid: "end" },
  { name: "wrapped pattern", pattern: "/^hello$/", valid: "hello", invalid: "/hello/" },
  { name: "one wrapper pair", pattern: "//hello//", valid: "/hello/", invalid: "hello" },
  { name: "control characters", pattern: "^a\t/\n\r$", valid: "a\t/\n\r", invalid: "a/" },
];

afterEach(() => vi.unstubAllEnvs());

for (const renderer of ["js", "native"] as const) {
  describe(`${renderer} pattern literals`, () => {
    test.each(cases)("$name", ({ pattern, valid, invalid }) => {
      vi.stubEnv("OPENAPI_CODEGEN_NATIVE", renderer === "native" ? "1" : "0");
      const source = JSON.stringify({
        openapi: "3.0.3",
        info: { title: "Patterns", version: "1.0.0" },
        paths: {},
        components: {
          schemas: {
            Pattern: { type: "object", properties: { value: { type: "string", pattern } }, required: ["value"] },
          },
        },
      });
      const result = renderParityCase(
        source,
        {
          name: "patterns",
          options: { modelsOnly: true, splitByTags: true, tsNamespaces: false, excludeRedundantZodSchemas: false },
        },
        renderer,
      );
      expect(result.route).toBe(renderer === "native" ? "full-native" : "js");
      const models = result.files.find((file) => file.fileName.endsWith(".models.ts"))!.content;
      const literal = models.match(/\.regex\((\/.*\/)\)/)![1];
      // Parse the actual generated literal, then verify its intended matching behavior.
      const regex = new Function(`return ${literal};`)() as RegExp;
      expect(regex.test(valid)).toBe(true);
      expect(regex.test(invalid)).toBe(false);
    });
  });
}
