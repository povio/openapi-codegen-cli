import { describe, expect, test } from "vitest";
import { invalidVariableNameCharactersToCamel, isValidPropertyName } from "./js.utils";

describe("Utils: js", () => {
  test("isValidPropertyName", () => {
    const validPropertyNames = [
      "myProperty",
      "_private",
      "$value",
      "data123",
      "camelCase",
      "PascalCase",
      "_underscoreStart",
      "$dollarSignStart",
      "property1",
      "name_with_underscores",
    ];
    validPropertyNames.forEach((validPropertyName) => {
      expect(isValidPropertyName(validPropertyName)).toBe(true);
    });

    // Array of invalid property names (without quotes)
    const invalidPropertyNames = [
      "123name", // starts with a number
      "some-name", // contains a hyphen
      "var!", // contains an invalid character
      "@property", // starts with an invalid character
      "my property", // contains a space
      "prop#erty", // contains an invalid character
      "obj.prop!", // dot notation including invalid characters
      "order[createdAt]", // square brackets
    ];
    invalidPropertyNames.forEach((invalidPropertyName) => {
      expect(isValidPropertyName(invalidPropertyName)).toBe(false);
    });
  });

  test("invalidVariableNameCharactersToCamel", () => {
    const validVariableNames = [
      "myVariable",
      "count",
      "username",
      "_privateVar",
      "$dollarVar",
      "_temp123",
      "firstName",
      "totalAmount",
      "isValidUser",
      "x",
      "y",
      "z",
      "camelCase",
      "PascalCase",
      "snake_case",
      "var1",
      "data2Set",
      "temp3Var",
      "_underscoreStart",
      "$dollarSignStart",
    ];
    validVariableNames.forEach((validVariableName) => {
      expect(invalidVariableNameCharactersToCamel(validVariableName)).toEqual(validVariableName);
    });

    expect(invalidVariableNameCharactersToCamel("order[createdAt]")).toEqual("orderCreatedAt");
  });
});
