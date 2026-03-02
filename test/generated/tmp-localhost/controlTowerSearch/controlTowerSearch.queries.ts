import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerSearchModels } from "./controlTowerSearch.models";
import { ControlTowerSearchApi } from "./controlTowerSearch.api";

export namespace ControlTowerSearchQueries {
export const moduleName = QueryModule.ControlTowerSearch;



/** 
 * Mutation `useSearch`
 * @param { ControlTowerSearchModels.SearchRequestDto } mutation.data Body parameter
 * @param { ControlTowerSearchModels.SearchItemTypeEnum } mutation.type Query parameter
 * @param { number } mutation.limit Query parameter. Minimum: `1`
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerSearchModels.SearchResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useSearch = (options?: AppMutationOptions<typeof ControlTowerSearchApi.search, { data: ControlTowerSearchModels.SearchRequestDto, type?: ControlTowerSearchModels.SearchItemTypeEnum, limit?: number }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data, type, limit }) => 
      ControlTowerSearchApi.search(data, type, limit)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
