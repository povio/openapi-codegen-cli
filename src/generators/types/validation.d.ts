export type ValidationErrorType =
  | "invalid-schema"
  | "invalid-operation-id"
  | "missing-path-parameter"
  | "not-allowed-inline-enum"
  | "not-allowed-circular-schema";

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}
