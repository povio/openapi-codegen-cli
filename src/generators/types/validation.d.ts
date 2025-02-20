export type ValidationErrorType =
  | "invalid-schema"
  | "invalid-operation-id"
  | "missing-path-parameter"
  | "not-allowed-inline-enum"
  | "not-allowed-circular-schema"
  | "missing-acl-condition-property";

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}
