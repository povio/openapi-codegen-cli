import { Import } from "../types/generate";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const BODY_PARAMETER_NAME = "data";

export const AXIOS_REQUEST_CONFIG_NAME = "config";
export const AXIOS_REQUEST_CONFIG_TYPE = "AxiosRequestConfig";
export const AXIOS_IMPORT: Import = {
  bindings: [AXIOS_REQUEST_CONFIG_TYPE],
  from: "axios",
};
