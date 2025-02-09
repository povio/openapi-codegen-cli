import { EndpointParameter } from "../types/endpoint";
import { ValidationError, ValidationErrorType } from "../types/validation";

export function getInvalidSchemaError(schemaInfo: string): ValidationError {
  return { type: "invalid-schema", message: `${schemaInfo} has both reference and composite keyword` };
}

export function getInvalidOperationIdError(operationId: string): ValidationError {
  return { type: "invalid-operation-id", message: `Operation ${operationId}` };
}

export function getMissingPathParameterError(params: EndpointParameter[], path: string): ValidationError {
  return {
    type: "missing-path-parameter",
    message: `Path ${path} is missing [${params.join(", ")}]`,
  };
}

export function getNotAllowedInlineEnumError(info: string): ValidationError {
  return { type: "not-allowed-inline-enum", message: info };
}

export function groupByType(validationErrors: ValidationError[]): Record<ValidationErrorType, string[]> {
  return validationErrors.reduce(
    (acc, err) => ({ ...acc, [err.type]: [...(acc[err.type] ?? []), err.message] }),
    {} as Record<ValidationErrorType, string[]>,
  );
}
