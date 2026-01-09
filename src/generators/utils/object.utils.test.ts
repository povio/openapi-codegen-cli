import { describe, expect, test } from "vitest";
import { deepMerge } from "./object.utils";

describe("Utils: object", () => {
  describe("deepMerge", () => {
    test("merges simple objects", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge<{ a?: number; b?: number; c?: number }>(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      // Verify original objects are not mutated
      expect(obj1).toEqual({ a: 1, b: 2 });
      expect(obj2).toEqual({ b: 3, c: 4 });
    });

    test("merges nested objects", () => {
      const obj1 = { a: 1, nested: { x: 1, y: 2 } };
      const obj2 = { b: 2, nested: { y: 3, z: 4 } };
      const result = deepMerge<{ a?: number; b?: number; nested?: { x?: number; y?: number; z?: number } }>(obj1, obj2);

      expect(result).toEqual({
        a: 1,
        b: 2,
        nested: { x: 1, y: 3, z: 4 },
      });
    });

    test("concatenates arrays", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const result = deepMerge(arr1, arr2);

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      // Verify original arrays are not mutated
      expect(arr1).toEqual([1, 2, 3]);
      expect(arr2).toEqual([4, 5, 6]);
    });

    test("merges objects with arrays", () => {
      const obj1 = { a: [1, 2], b: { x: 1 } };
      const obj2 = { a: [3, 4], b: { y: 2 } };
      const result = deepMerge<{ a?: number[]; b?: { x?: number; y?: number } }>(obj1, obj2);

      expect(result).toEqual({
        a: [1, 2, 3, 4],
        b: { x: 1, y: 2 },
      });
    });

    test("handles null and undefined values", () => {
      const obj1 = { a: 1, b: null, c: undefined };
      const obj2 = { b: 2, c: 3, d: null, e: undefined };
      const result = deepMerge<{ a?: number; b?: number | null; c?: number; d?: number | null; e?: number }>(
        obj1,
        obj2,
      );

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: null });
    });

    test("handles multiple arguments", () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = deepMerge<{ a?: number; b?: number; c?: number }>(obj1, obj2, obj3);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("later arguments take precedence", () => {
      const obj1 = { a: 1, b: { x: 1, y: 1 } };
      const obj2 = { a: 2, b: { x: 2 } };
      const obj3 = { a: 3, b: { z: 3 } };
      const result = deepMerge<{ a?: number; b?: { x?: number; y?: number; z?: number } }>(obj1, obj2, obj3);

      expect(result).toEqual({ a: 3, b: { x: 2, y: 1, z: 3 } });
    });

    test("handles empty objects and arrays", () => {
      expect(deepMerge<{ a?: number }>({}, { a: 1 })).toEqual({ a: 1 });
      expect(deepMerge<{ a?: number }>({ a: 1 }, {})).toEqual({ a: 1 });
      expect(deepMerge<number[]>([], [1, 2])).toEqual([1, 2]);
      expect(deepMerge<number[]>([1, 2], [])).toEqual([1, 2]);
    });

    test("handles single argument", () => {
      const obj = { a: 1, b: [2, 3] };
      const result = deepMerge<{ a?: number; b?: number[] }>(obj);
      expect(result).toEqual(obj);
      expect(result).toBe(obj); // Should return the same reference for single argument
    });

    test("handles type mismatches by using source value", () => {
      const obj1 = { a: { x: 1 } };
      const obj2 = { a: [1, 2, 3] };
      const result = deepMerge<{ a?: { x?: number } | number[] }>(obj1, obj2);

      expect(result).toEqual({ a: [1, 2, 3] });
    });

    test("handles deeply nested structures", () => {
      const obj1 = {
        level1: {
          level2: {
            level3: {
              data: [1, 2],
              value: "original",
            },
          },
        },
      };

      const obj2 = {
        level1: {
          level2: {
            level3: {
              data: [3, 4],
              newValue: "added",
            },
            newProp: "test",
          },
        },
      };

      const result = deepMerge<{
        level1?: {
          level2?: {
            level3?: { data?: number[]; value?: string; newValue?: string; newProp?: string };
          };
        };
      }>(obj1, obj2);

      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              data: [1, 2, 3, 4],
              value: "original",
              newValue: "added",
            },
            newProp: "test",
          },
        },
      });
    });

    test("preserves object references for non-conflicting properties", () => {
      const sharedObj = { shared: "data" };
      const obj1 = { a: sharedObj, b: 1 };
      const obj2 = { c: 2 };
      const result = deepMerge<{ a?: { shared?: string }; b?: number; c?: number }>(obj1, obj2);

      expect(result.a).not.toBe(sharedObj); // Should be cloned
      expect(result.a).toEqual(sharedObj);
    });

    test("merge configs", () => {
      const configA = {
        input: "http://localhost:4000/docs-json/",
        output: "output",
        splitByTags: true,
        defaultTag: "Common",
        excludeTags: [],
        excludePathRegex: "",
        excludeRedundantZodSchemas: true,
        tsNamespaces: true,
        importPath: "ts",
        configs: {
          models: { outputFileNameSuffix: "models", namespaceSuffix: "Models" },
          endpoints: { outputFileNameSuffix: "api", namespaceSuffix: "Api" },
          queries: { outputFileNameSuffix: "queries", namespaceSuffix: "Queries" },
          acl: { outputFileNameSuffix: "acl", namespaceSuffix: "Acl" },
        },
        acl: true,
        checkAcl: true,
        standalone: false,
        baseUrl: "",
        abilityContextGenericAppAbilities: false,
        schemaSuffix: "Schema",
        enumSuffix: "Enum",
        withDefaultValues: true,
        extractEnums: true,
        replaceOptionalWithNullish: false,
        restClientImportPath: "@/util/rest/clients/app-rest-client",
        removeOperationPrefixEndingWith: "Controller_",
        parseRequestParams: true,
        queryTypesImportPath: "@/types/react-query",
        axiosRequestConfig: false,
        infiniteQueries: false,
        mutationEffects: true,
      };

      const configB = { input: "./test/test.json", output: "./output" };

      const configC = {
        input: undefined,
        output: undefined,
        tsNamespaces: undefined,
        splitByTags: undefined,
        defaultTag: undefined,
        excludeTags: undefined,
        excludePathRegex: undefined,
        excludeRedundantZodSchemas: undefined,
        importPath: undefined,
        extractEnums: undefined,
        removeOperationPrefixEndingWith: undefined,
        acl: undefined,
        checkAcl: undefined,
        standalone: undefined,
        baseUrl: undefined,
        replaceOptionalWithNullish: undefined,
        infiniteQueries: undefined,
        mutationEffects: undefined,
        parseRequestParams: undefined,
        axiosRequestConfig: undefined,
      };

      const result = deepMerge(configA, configB, configC);

      expect(result).toEqual({
        ...configA,
        input: "./test/test.json",
        output: "./output",
      });
    });
  });
});
