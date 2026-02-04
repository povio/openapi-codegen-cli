import { Import } from "@/generators/types/generate";

export const SCHEMA_SUFFIX = "Schema";
export const ENUM_SUFFIX = "Enum";
export const BODY_SCHEMA_SUFFIX = "Body";
export const PARAM_SCHEMA_SUFFIX = "Param";
export const RESPONSE_SCHEMA_SUFFIX = "Response";
export const ERROR_RESPONSE_SCHEMA_SUFFIX = "ErrorResponse";

export const VOID_SCHEMA = "z.void()";
export const ANY_SCHEMA = "z.any()";
export const BLOB_SCHEMA = "z.instanceof(Blob)";
export const ENUM_SCHEMA = "z.enum";
export const INT_SCHEMA = "z.int()";
export const NUMBER_SCHEMA = "z.number()";
export const STRING_SCHEMA = "z.string()";
export const EMAIL_SCHEMA = "z.email()";
export const URL_SCHEMA = "z.url()";
export const UUID_SCHEMA = "z.uuid()";
export const DATETIME_SCHEMA = "z.iso.datetime({ offset: true })";

export const ZOD_IMPORT: Import = {
  bindings: ["z"],
  from: "zod",
};
