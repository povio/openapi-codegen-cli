import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerSearchModels } from "./controlTowerSearch.models";

export namespace ControlTowerSearchQueries {
const search = (data: ControlTowerSearchModels.SearchRequestDto, type?: ControlTowerSearchModels.SearchItemTypeEnum, limit?: number) => {
  return AppRestClient.post(
    { resSchema: ControlTowerSearchModels.SearchResponseDtoSchema },
    `/search`,
    ZodExtended.parse(ControlTowerSearchModels.SearchRequestDtoSchema, data),
    {
      params: {
        type: ZodExtended.parse(ControlTowerSearchModels.SearchItemTypeEnumSchema.optional(), type, { type: "query", name: "type" }),
        limit: ZodExtended.parse(z.number().gte(1).nullish(), limit, { type: "query", name: "limit" }),
      },
    }
  );
};


export const moduleName = QueryModule.ControlTowerSearch;



/** 
 * Mutation `useSearch`
 * @param { ControlTowerSearchModels.SearchRequestDto } data Body parameter
 * @param { ControlTowerSearchModels.SearchItemTypeEnum } type Query parameter
 * @param { number } limit Query parameter. Minimum: `1`
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<ControlTowerSearchModels.SearchResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useSearch = (options?: AppMutationOptions<typeof search, { data: ControlTowerSearchModels.SearchRequestDto, type?: ControlTowerSearchModels.SearchItemTypeEnum, limit?: number }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data, type, limit }) => 
      search(data, type, limit)
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
