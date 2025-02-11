import { ValidationErrorType } from "../types/validation";

export const VALIDATION_ERROR_TYPE_TITLE: Record<ValidationErrorType, string> = {
  "invalid-schema": "Invalid Schemas",
  "invalid-operation-id": "Invalid Operation IDs",
  "missing-path-parameter": "Missing Path Parameters",
  "not-allowed-inline-enum": "Not Allowed Inline Enums",
  "not-allowed-circular-schema": "Not Allowed Circular Schemas",
};
