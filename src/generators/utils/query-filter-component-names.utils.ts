export function resolveQueryFilterComponentName(
  operationId: string | undefined,
  queryFilterComponentNames: Record<string, string> | undefined,
): string | undefined {
  if (!operationId || !queryFilterComponentNames) {
    return undefined;
  }

  return queryFilterComponentNames[operationId];
}
