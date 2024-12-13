import { Import } from "../types/generate";

export const DATA_FILE_PATH = "src/data";
export const DATA_TS_PATH = "@/data";

export const REST_CLIENT_NAME = "AppRestClient";
export const REST_CLIENT_IMPORT: Import = {
  bindings: [REST_CLIENT_NAME],
  from: "@/util/rest/clients/app-rest-client",
};

export const QUERY_OPTIONS_TYPES = {
  query: "AppQueryOptions",
  mutation: "AppMutationOptions",
};
export const QUERY_TYPES_IMPORT: Import = {
  bindings: [QUERY_OPTIONS_TYPES.query, QUERY_OPTIONS_TYPES.mutation],
  from: "@/types/react-query",
};
