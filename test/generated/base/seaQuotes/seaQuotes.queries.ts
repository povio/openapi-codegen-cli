import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { SeaQuotesAcl } from "./seaQuotes.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { SeaQuotesModels } from "./seaQuotes.models";
import { SeaQuotesApi } from "./seaQuotes.api";

export namespace SeaQuotesQueries {
  export const moduleName = QueryModule.SeaQuotes;

  export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, quoteId: string) =>
      [...keys.all, "/offices/:officeId/quotes/:quoteId/sea-quote", officeId, quoteId] as const,
  };

  /**
   * Query `useGet`
   * @summary Get sea quote by ID
   * @permission Requires `canUseGet` ability
   * @param { string } object.officeId Path parameter
   * @param { string } object.quoteId Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<SeaQuotesModels.SeaQuoteResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGet = <TData>(
    { officeId, quoteId }: { officeId: string; quoteId: string },
    options?: AppQueryOptions<typeof SeaQuotesApi.get, TData>,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();

    return useQuery({
      queryKey: keys.get(officeId, quoteId),
      queryFn: () => {
        checkAcl(SeaQuotesAcl.canUseGet({ officeId }));
        return SeaQuotesApi.get(officeId, quoteId, config);
      },
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update sea quote
   * @permission Requires `canUseUpdate` ability
   * @param { string } mutation.officeId Path parameter
   * @param { string } mutation.quoteId Path parameter
   * @param { SeaQuotesModels.UpdateSeaQuoteRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<SeaQuotesModels.SeaQuoteResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof SeaQuotesApi.update,
      { officeId: string; quoteId: string; data: SeaQuotesModels.UpdateSeaQuoteRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { checkAcl } = useAclCheck();
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ officeId, quoteId, data }) => {
        checkAcl(SeaQuotesAcl.canUseUpdate({ officeId }));
        return SeaQuotesApi.update(officeId, quoteId, data, config);
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
