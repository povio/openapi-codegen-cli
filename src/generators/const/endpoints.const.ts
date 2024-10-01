import { Import } from "../types/generate";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const REST_CLIENT_NAME = "AppRestClient";

export const REST_CLIENT_IMPORT: Import = {
  bindings: [REST_CLIENT_NAME],
  from: "@/util/rest/clients/app-rest-client",
};
