export type ValidationErrorType =
  | "invalid-schema"
  | "invalid-operation-id"
  | "missing-path-parameter"
  | "not-allowed-inline-enum"
  | "not-allowed-circular-schema"
  | "missing-acl-condition-property"
  | "missing-status-code"
  | "invalid-status-code"
  | "multiple-success-status-codes";

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
}
