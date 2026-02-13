import { useCallback, useEffect } from "react";

import { OpenApiQueryConfig } from "@povio/openapi-codegen-cli";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

import { QueryModule } from "./queryModules";
import { broadcastQueryInvalidation, setupCrossTabListener } from "./useCrossTabQueryInvalidation";

export interface MutationEffectsOptions {
  invalidateCurrentModule?: boolean;
  crossTabInvalidation?: boolean;
  invalidationMap?: Record<string, (context: Record<string, string>) => QueryKey[]>;
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

  useEffect(() => {
    if (!config.crossTabInvalidation) return;
    setupCrossTabListener(queryClient);
  }, [queryClient, config.crossTabInvalidation]);

  const runMutationEffects = useCallback(
    async <TData>(data: TData, options: MutationEffectsOptions = {}, updateKeys?: QueryKey[]) => {
      const { invalidateCurrentModule = true, invalidateModules, invalidateKeys, preferUpdate } = options;
      const shouldUpdate = preferUpdate || (preferUpdate === undefined && config.preferUpdate);
      const shouldInvalidateCurrentModule =
        invalidateCurrentModule || (invalidateCurrentModule === undefined && config.invalidateCurrentModule);

      const isQueryKeyEqual = (keyA: QueryKey, keyB: QueryKey) =>
        keyA.length === keyB.length && keyA.every((item, index) => item === keyB[index]);

      const invalidatedQueryKeys: QueryKey[] = [];

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => {
          const isUpdateKey = updateKeys?.some((key) => isQueryKeyEqual(queryKey, key));
          if (shouldUpdate && isUpdateKey) {
            return false;
          }

          const isCurrentModule = shouldInvalidateCurrentModule && queryKey[0] === currentModule;
          const isInvalidateModule = !!invalidateModules && invalidateModules.some((module) => queryKey[0] === module);
          const isInvalidateKey = !!invalidateKeys && invalidateKeys.some((key) => isQueryKeyEqual(queryKey, key));

          const map = config.invalidationMap?.[currentModule]?.(data);
          const isMappedKey = !!map && map.some((key) => isQueryKeyEqual(queryKey, key));

          const shouldInvalidate = isCurrentModule || isInvalidateModule || isInvalidateKey || isMappedKey;

          if (shouldInvalidate && config.crossTabInvalidation) {
            invalidatedQueryKeys.push([...queryKey]);
          }

          return shouldInvalidate;
        },
      });

      if (config.crossTabInvalidation && invalidatedQueryKeys.length > 0) {
        broadcastQueryInvalidation(invalidatedQueryKeys);
      }

      if (shouldUpdate && updateKeys) {
        updateKeys.map((queryKey) => queryClient.setQueryData(queryKey, data));
      }
    },
    [queryClient, currentModule, config.preferUpdate, config.invalidationMap, config.crossTabInvalidation],
  );

  return { runMutationEffects };
}
