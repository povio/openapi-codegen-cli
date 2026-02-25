import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { RoadQuotesAcl } from "./roadQuotes.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { RoadQuotesModels } from "./roadQuotes.models";
import { RoadQuotesApi } from "./roadQuotes.api";

export namespace RoadQuotesQueries {
  export const moduleName = QueryModule.RoadQuotes;

  export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, quoteId: string) =>
      [...keys.all, "/offices/:officeId/quotes/:quoteId/road-quote", officeId, quoteId] as const,
  };

  /**
   * Query `useGet`
   * @summary Get road quote by ID
   * @permission Requires `canUseGet` ability
   * @param { string } object.officeId Path parameter
   * @param { string } object.quoteId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RoadQuotesModels.RoadQuoteResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGet = <TData>(
    { officeId, quoteId }: { officeId: string; quoteId: string },
    options?: AppQueryOptions<typeof RoadQuotesApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(officeId, quoteId),
      queryFn: () => {
        checkAcl(RoadQuotesAcl.canUseGet({ officeId }));
        return RoadQuotesApi.get(officeId, quoteId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update road quote
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.quoteId Path parameter
   * @param { RoadQuotesModels.UpdateRoadQuoteRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<RoadQuotesModels.RoadQuoteResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof RoadQuotesApi.update,
      { officeId: string; quoteId: string; data: RoadQuotesModels.UpdateRoadQuoteRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, quoteId, data }) => {
        checkAcl(RoadQuotesAcl.canUseUpdate({ officeId }));
        return RoadQuotesApi.update(officeId, quoteId, data, config);
      },
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const { officeId, quoteId } = variables;
        const updateKeys = [keys.get(officeId, quoteId)];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
