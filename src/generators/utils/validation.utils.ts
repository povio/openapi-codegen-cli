import { EndpointParameter } from "../types/endpoint";
import { ValidationError, ValidationErrorType } from "../types/validation";

export function getInvalidSchemaError(message: string): ValidationError {
  return { type: "invalid-schema", message };
}

export function getInvalidOperationIdError(operationId: string): ValidationError {
  return { type: "invalid-operation-id", message: `Operation ${operationId}` };
}

export function getMissingPathParameterError(params: EndpointParameter[], path: string): ValidationError {
  return {
    type: "missing-path-parameter",
    message: `Path ${path} is missing [${params.map(({ name }) => name).join(", ")}]`,
  };
}

export function getNotAllowedInlineEnumError(message: string): ValidationError {
  return { type: "not-allowed-inline-enum", message };
}

export function getNotAllowedCircularSchemaError(message: string): ValidationError {
  return { type: "not-allowed-circular-schema", message };
}

export function getMissingAclConditionPropertyError(propertyName: string, operationId: string): ValidationError {
  return {
    type: "missing-acl-condition-property",
    message: `Condition property ${propertyName} is not found in parameters or body in operation ${operationId}`,
  };
}

export function groupByType(validationErrors: ValidationError[]): Record<ValidationErrorType, string[]> {
  return validationErrors.reduce(
    (acc, err) => ({ ...acc, [err.type]: [...(acc[err.type] ?? []), err.message] }),
    {} as Record<ValidationErrorType, string[]>,
  );
}
