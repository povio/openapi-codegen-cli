import { QueryClient } from "@tanstack/react-query";

import { QueriesModule, QueriesModuleKeysAll } from "./queryModules";

export interface InvalidateQueryOptions {
  invalidateCurrentModule?: boolean;
  invalidateModules?: QueriesModule[];
  invalidateKeys?: readonly unknown[][];
}

export async function invalidateQueries(
  queryClient: QueryClient,
  currentModule: QueriesModule,
  options: InvalidateQueryOptions = {},
) {
  const { invalidateCurrentModule, invalidateModules, invalidateKeys } = options;

  if (invalidateCurrentModule && QueriesModuleKeysAll[currentModule]) {
    await queryClient.invalidateQueries({ queryKey: QueriesModuleKeysAll[currentModule] });
  }

  if (invalidateModules) {
    await Promise.all([
      ...invalidateModules.map((module) => queryClient.invalidateQueries({ queryKey: QueriesModuleKeysAll[module] })),
    ]);
  }

  if (invalidateKeys) {
    await Promise.all([...invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))]);
  }
}
