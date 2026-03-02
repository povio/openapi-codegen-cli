import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { FactoringExportAcl } from "./factoringExport.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FactoringExportModels } from "./factoringExport.models";

export namespace FactoringExportQueries {
const create = (officeId: string, data: FactoringExportModels.CreateFactoringExportRequestDto) => {
  return AppRestClient.post(
    { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
    `/offices/${officeId}/factoring-exports`,
    ZodExtended.parse(FactoringExportModels.CreateFactoringExportRequestDtoSchema, data),
    
  );
};

const getBatch = (batchId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: FactoringExportModels.FactoringExportBatchResponseDtoSchema },
    `/offices/${officeId}/factoring-exports/${batchId}`,
    
  );
};


export const moduleName = QueryModule.FactoringExport;

export const keys = {
    all: [moduleName] as const,
    getBatch: (batchId: string, officeId: string) => [...keys.all, "/offices/:officeId/factoring-exports/:batchId", batchId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Generate factoring export files for Raiffeisen Factor Bank
 * @permission Requires `canUseCreate` ability 
 * @param { string } officeId Path parameter
 * @param { FactoringExportModels.CreateFactoringExportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FactoringExportModels.FactoringExportBatchResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof create, { officeId: string, data: FactoringExportModels.CreateFactoringExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.FactoringExport>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(FactoringExportAcl.canUseCreate({ officeId } ));
      return create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

export const getBatchQueryOptions = ({ batchId, officeId }: { batchId: string, officeId: string }) => ({
  queryKey: keys.getBatch(batchId, officeId),
  queryFn: () => getBatch(batchId, officeId),
});

/** 
 * Query `useGetBatch`
 * @summary Get factoring export batch status
 * @permission Requires `canUseGetBatch` ability 
 * @param { string } batchId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FactoringExportModels.FactoringExportBatchResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetBatch = <TData>({ batchId, officeId }: { batchId: string, officeId: string }, options?: AppQueryOptions<typeof getBatch, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getBatchQueryOptions({ batchId, officeId }),
    queryFn: async () => {
    checkAcl(FactoringExportAcl.canUseGetBatch({ officeId } ));
      return getBatchQueryOptions({ batchId, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGetBatch = (queryClient: QueryClient, { batchId, officeId }: { batchId: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getBatchQueryOptions({ batchId, officeId }), ...options });
};

}
