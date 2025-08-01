import { Import } from "src/generators/types/generate";

export const SCHEMA_SUFFIX = "Schema";
export const ENUM_SUFFIX = "Enum";
export const BODY_SCHEMA_SUFFIX = "Body";
export const PARAM_SCHEMA_SUFFIX = "Param";
export const RESPONSE_SCHEMA_SUFFIX = "Response";
export const ERROR_RESPONSE_SCHEMA_SUFFIX = "ErrorResponse";

export const VOID_SCHEMA = "z.void()";
export const BLOB_SCHEMA = "z.instanceof(Blob)";
export const ENUM_SCHEMA = "z.enum";
export const STRING_SCHEMA = "z.string()";

export const ZOD_IMPORT: Import = {
  bindings: ["z"],
  from: "zod",
};
