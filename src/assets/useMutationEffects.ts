import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { OpenApiQueryConfig } from "./queryConfig.context";
import { QueryModule } from "./queryModules";

export interface MutationEffectsOptions {
  invalidateCurrentModule?: boolean;
  invalidateModules?: QueryModule[];
  invalidateKeys?: QueryKey[];
  preferUpdate?: boolean;
}

export interface UseMutationEffectsProps {
  currentModule: QueryModule;
}

export function useMutationEffects({ currentModule }: UseMutationEffectsProps) {
  const queryClient = useQueryClient();
  const config = OpenApiQueryConfig.useConfig();

  const runMutationEffects = useCallback(
    async <TData>(data: TData, options: MutationEffectsOptions = {}, updateKeys?: QueryKey[]) => {
      const { invalidateCurrentModule, invalidateModules, invalidateKeys, preferUpdate } = options;
      const shouldUpdate = preferUpdate || (preferUpdate === undefined && config.preferUpdate);

      const isQueryKeyEqual = (keyA: QueryKey, keyB: QueryKey) =>
        keyA.length === keyB.length && keyA.every((item, index) => item === keyB[index]);

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => {
          const isUpdateKey = updateKeys?.some((key) => isQueryKeyEqual(queryKey, key));
          if (shouldUpdate && isUpdateKey) {
            return false;
          }

          const isCurrentModule = invalidateCurrentModule && queryKey[0] === currentModule;
          const isInvalidateModule = !!invalidateModules && invalidateModules.some((module) => queryKey[0] === module);
          const isInvalidateKey = !!invalidateKeys && invalidateKeys.some((key) => isQueryKeyEqual(queryKey, key));
          return isCurrentModule || isInvalidateModule || isInvalidateKey;
        },
      });

      if (shouldUpdate && updateKeys) {
        updateKeys.map((queryKey) => queryClient.setQueryData(queryKey, data));
      }
    },
    [queryClient, currentModule, config.preferUpdate],
  );

  return { runMutationEffects };
}
