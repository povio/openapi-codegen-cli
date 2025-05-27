import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";
import { GenerateType } from "../types/generate";
import { GenerateOptions } from "../types/options";
import { getOperationName, getOperationsByTag, getUniqueOperationName } from "./operation.utils";

const path = "/auth/provider/local/login";
const method = "post";

const options: GenerateOptions = {
  input: "input",
  output: "output",
  splitByTags: true,
  defaultTag: "Common",
  excludeTags: [""],
  excludePathRegex: "",
  tsNamespaces: true,
  importPath: "ts",
  configs: {
    [GenerateType.Models]: {
      outputFileNameSuffix: "models",
      namespaceSuffix: "Models",
    },
    [GenerateType.Endpoints]: {
      outputFileNameSuffix: "api",
      namespaceSuffix: "Api",
    },
    [GenerateType.Queries]: {
      outputFileNameSuffix: "queries",
      namespaceSuffix: "Queries",
    },
    [GenerateType.Acl]: {
      outputFileNameSuffix: "acl",
      namespaceSuffix: "Acl",
    },
  },
  schemaSuffix: "Schema",
  enumSuffix: "Enum",
  removeOperationPrefixEndingWith: "Controller_",
  standalone: false,
  baseUrl: "",
};

const pathNames = ["/auth/provider/local/login", "/auth/provider/local/register"];

const paths = {
  [pathNames[0]]: {
    post: {
      operationId: "LocalAuthnPasswordController_register",
      parameters: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LocalAuthnPasswordLoginRequestDto",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthnTokenDto",
              },
            },
          },
        },
      },
      summary: "Login with username and password",
      tags: ["Authentication"],
    },
  },
  [pathNames[1]]: {
    post: {
      operationId: "LocalAuthnPasswordRegistrationController_register",
      parameters: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LocalAuthnPasswordRegistrationRequestDto",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthnTokenDto",
              },
            },
          },
        },
      },
      summary: "Register a new auth identity",
      tags: ["Authentication"],
    },
  },
};

const openApiDoc = {
  openapi: "3.0.3",
  info: {
    title: "API",
    description: "",
    version: "0.0.0",
  },
  paths,
} as OpenAPIV3.Document;

describe("Utils: operation", () => {
  describe("getOperationName", () => {
    test("without removing operation prefix", () => {
      const operation = paths[pathNames[0]].post;
      expect(
        getOperationName({
          path,
          method,
          operation,
          options: { ...options, removeOperationPrefixEndingWith: undefined },
          tag: "Authentication",
        }),
      ).toEqual("LocalAuthnPasswordController_register");
    });

    test("without removing operation tag", () => {
      const operation = {
        ...paths[pathNames[0]].post,
        operationId: "LocalAuthnPasswordController_registerAuthentication",
      };
      expect(
        getOperationName({
          path,
          method,
          operation,
          options: { ...options, removeOperationPrefixEndingWith: undefined },
          tag: "Authentication",
          keepOperationTag: true,
        }),
      ).toEqual("LocalAuthnPasswordController_registerAuthentication");
    });

    test("with removing operation tag", () => {
      const operation = {
        ...paths[pathNames[0]].post,
        operationId: "LocalAuthnPasswordController_registerAuthentication",
      };
      expect(
        getOperationName({
          path,
          method,
          operation,
          options: { ...options, removeOperationPrefixEndingWith: undefined },
          tag: "Authentication",
        }),
      ).toEqual("LocalAuthnPasswordController_register");
    });

    test("removes prefix with ending", () => {
      const operation = paths[pathNames[0]].post;
      expect(getOperationName({ path, method, operation, options, tag: "Authentication" })).toEqual("register");
    });

    test("removes prefix ending", () => {
      const operation = paths[pathNames[0]].post;
      expect(
        getOperationName({ path, method, operation, options, tag: "Authentication", keepOperationPrefix: true }),
      ).toEqual("LocalAuthnPasswordRegister");
    });
  });

  describe("getUniqueOperationName", () => {
    test("without removing operation prefix", () => {
      const operation = paths[pathNames[0]].post;
      const operationsByTag = getOperationsByTag(openApiDoc, options);
      expect(
        getUniqueOperationName({
          path,
          method,
          operation,
          operationsByTag,
          options: { ...options, removeOperationPrefixEndingWith: undefined },
        }),
      ).toEqual("LocalAuthnPasswordController_register");
    });

    test("without duplicate", () => {
      const operation = paths[pathNames[0]].post;
      const operationsByTag = getOperationsByTag(
        { ...openApiDoc, paths: { [pathNames[0]]: paths[pathNames[0]] } },
        options,
      );
      expect(
        getUniqueOperationName({
          path,
          method,
          operation,
          operationsByTag,
          options,
        }),
      ).toEqual("register");
    });

    test("without duplicate in same tag", () => {
      const operation = paths[pathNames[0]].post;
      const operationsByTag = getOperationsByTag(
        {
          ...openApiDoc,
          paths: {
            [pathNames[0]]: { ...paths[pathNames[0]], post: { ...paths[pathNames[0]].post, tags: ["Other"] } },
            [pathNames[1]]: paths[pathNames[1]],
          },
        },
        options,
      );
      expect(
        getUniqueOperationName({
          path,
          method,
          operation,
          operationsByTag,
          options,
        }),
      ).toEqual("register");
    });

    test("with duplicate in same tag", () => {
      const operation = paths[pathNames[0]].post;
      const operationsByTag = getOperationsByTag(openApiDoc, options);
      expect(getUniqueOperationName({ path, method, operation, operationsByTag, options })).toEqual(
        "LocalAuthnPasswordRegister",
      );
    });

    test("with duplicate in different tags without splitting by tags", () => {
      const operation = paths[pathNames[0]].post;
      const noSplitOptions = { ...options, splitByTags: false };
      const operationsByTag = getOperationsByTag(
        {
          ...openApiDoc,
          paths: {
            [pathNames[0]]: { ...paths[pathNames[0]], post: { ...paths[pathNames[0]].post, tags: ["Other"] } },
            [pathNames[1]]: paths[pathNames[1]],
          },
        },
        noSplitOptions,
      );
      expect(
        getUniqueOperationName({
          path,
          method,
          operation,
          operationsByTag,
          options: noSplitOptions,
        }),
      ).toEqual("LocalAuthnPasswordRegister");
    });
  });
});
