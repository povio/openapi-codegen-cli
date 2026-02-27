import { useCallback, useEffect } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { OpenApiQueryConfig, InvalidationMap } from "@povio/openapi-codegen-cli";
import { QueryModule } from "./queryModules";
import { broadcastQueryInvalidation, setupCrossTabListener } from "./useCrossTabQueryInvalidation";

export interface MutationEffectsOptions {
  invalidateCurrentModule?: boolean;
  crossTabInvalidation?: boolean;
  invalidationMap?: InvalidationMap;
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
    async <TData, TVariables>(
      data: TData,
      variables: TVariables,
      options: MutationEffectsOptions = {},
      updateKeys?: QueryKey[],
    ) => {
      const { invalidateCurrentModule, invalidateModules, invalidateKeys, preferUpdate } = options;
      const shouldUpdate = preferUpdate ?? config.preferUpdate ?? false;
      const shouldInvalidateCurrentModule = invalidateCurrentModule ?? config.invalidateCurrentModule ?? true;

      const isQueryKeyEqual = (keyA: QueryKey, keyB: QueryKey) =>
        keyA.length === keyB.length && keyA.every((item, index) => item === keyB[index]);
      const isQueryKeyPrefix = (queryKey: QueryKey, prefixKey: QueryKey) =>
        prefixKey.length <= queryKey.length && prefixKey.every((item, index) => item === queryKey[index]);
      const mappedInvalidationKeys = config.invalidationMap?.[currentModule]?.(data, variables);

      const shouldInvalidateQuery = (queryKey: QueryKey) => {
        const isUpdateKey = updateKeys?.some((key) => isQueryKeyEqual(queryKey, key));
        if (shouldUpdate && isUpdateKey) {
          return false;
        }

        const isCurrentModule = shouldInvalidateCurrentModule && queryKey[0] === currentModule;
        const isInvalidateModule = !!invalidateModules && invalidateModules.some((module) => queryKey[0] === module);
        const isInvalidateKey = !!invalidateKeys && invalidateKeys.some((key) => isQueryKeyPrefix(queryKey, key));
        const isMappedKey =
          !!mappedInvalidationKeys && mappedInvalidationKeys.some((key) => isQueryKeyPrefix(queryKey, key));

        return isCurrentModule || isInvalidateModule || isInvalidateKey || isMappedKey;
      };

      const invalidatedQueryKeys: QueryKey[] = [];

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => {
          const shouldInvalidate = shouldInvalidateQuery(queryKey);

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
    [
      queryClient,
      currentModule,
      config.preferUpdate,
      config.invalidateCurrentModule,
      config.invalidationMap,
      config.crossTabInvalidation,
    ],
  );

  return { runMutationEffects };
}
