import { Import } from "../types/import";
import { REST_CLIENT_NAME } from "./endpoints.const";
import { QUERY_HOOKS } from "./query.const";

export const ZOD_IMPORT: Import = {
  bindings: ["z"],
  from: "zod",
};

export const REST_CLIENT_IMPORT: Import = {
  bindings: [REST_CLIENT_NAME],
  from: "@/util/rest/clients/app-rest-client",
};

export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_HOOKS.mutation],
  from: "@tanstack/react-query",
};
