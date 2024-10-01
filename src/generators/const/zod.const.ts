import { Import } from "../types/generate";

export const SCHEMA_SUFFIX = "Schema";
export const BODY_SCHEMA_SUFFIX = "Body";
export const PARAM_SCHEMA_SUFFIX = "Param";
export const RESPONSE_SCHEMA_SUFFIX = "Response";
export const ERROR_RESPONSE_SCHEMA_SUFFIX = "ErrorResponse";

export const VOID_SCHEMA = "z.void()";

export const ZOD_IMPORT: Import = {
  bindings: ["z"],
  from: "zod",
};
