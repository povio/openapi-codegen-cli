import { OpenAPIV3 } from "openapi-types";
import { describe, expect, test } from "vitest";

import { DEFAULT_GENERATE_OPTIONS } from "@/generators/const/options.const";
import { ExtendedEndpoint } from "@/generators/types/endpoint";

import {
  getPathSegments,
  isBulkDeleteEndpoint,
  isCreateEndpoint,
  isDeleteEndpoint,
  isReadAllEndpoint,
  isReadEndpoint,
  isUpdateEndpoint,
} from "./endpoint.utils";

describe("Utils: endpoint", () => {
  const readAllPath = "/api/resource";
  const readAllEndpoint = {
    method: OpenAPIV3.HttpMethods.GET,
    path: readAllPath,
    pathSegments: getPathSegments(readAllPath),
    parameters: [
      {
        name: "page",
        type: "Query",
      },
    ],
  } as ExtendedEndpoint;

  describe("isReadAllEndpoint", () => {
    test("returns true, when endpoint is a read all endpoint", () => {
      expect(isReadAllEndpoint(readAllEndpoint, DEFAULT_GENERATE_OPTIONS)).toEqual(true);
    });
  });

  describe("isReadEndpoint", () => {
    test("returns true, when endpoint is a read endpoint", () => {
      const path = `${readAllPath}/:id`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.GET,
        path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isReadEndpoint(endpoint, readAllEndpoint)).toEqual(true);
    });

    test("returns false, when endpoint is not a read endpoint", () => {
      const path = `${readAllPath}/:id/remarks`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.GET,
        path: path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isReadEndpoint(endpoint, readAllEndpoint)).toEqual(false);
    });
  });

  describe("isCreateEndpoint", () => {
    test("returns true, when endpoint is a create endpoint", () => {
      const path = `${readAllPath}`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.POST,
        path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isCreateEndpoint(endpoint, readAllEndpoint)).toEqual(true);
    });
  });

  describe("isUpdateEndpoint", () => {
    test("returns true, when endpoint is a update endpoint", () => {
      const path = `${readAllPath}/:id`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.PATCH,
        path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isUpdateEndpoint(endpoint, readAllEndpoint)).toEqual(true);
    });
  });

  describe("isDeleteEndpoint", () => {
    test("returns true, when endpoint is a delete endpoint", () => {
      const path = `${readAllPath}/:id`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.DELETE,
        path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isDeleteEndpoint(endpoint, readAllEndpoint)).toEqual(true);
    });
  });

  describe("isBulkDeleteEndpoint", () => {
    test("returns true, when endpoint is a bulk delete endpoint", () => {
      const path = `${readAllPath}`;
      const endpoint = {
        method: OpenAPIV3.HttpMethods.DELETE,
        path,
        pathSegments: getPathSegments(path),
      } as ExtendedEndpoint;

      expect(isBulkDeleteEndpoint(endpoint, readAllEndpoint)).toEqual(true);
    });
  });
});
