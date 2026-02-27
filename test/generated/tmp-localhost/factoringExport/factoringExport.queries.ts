import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { FactoringExportAcl } from "./factoringExport.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FactoringExportModels } from "./factoringExport.models";
import { FactoringExportApi } from "./factoringExport.api";

export namespace FactoringExportQueries {
export const moduleName = QueryModule.FactoringExport;

export const keys = {
    all: [moduleName] as const,
    getBatch: (batchId: string, officeId: string) => [...keys.all, "/offices/:officeId/factoring-exports/:batchId", batchId, officeId] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Generate factoring export files for Raiffeisen Factor Bank
 * @permission Requires `canUseCreate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { FactoringExportModels.CreateFactoringExportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FactoringExportModels.FactoringExportBatchResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useCreate = (options?: AppMutationOptions<typeof FactoringExportApi.create, { officeId: string, data: FactoringExportModels.CreateFactoringExportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(FactoringExportAcl.canUseCreate({ officeId } ));
      return FactoringExportApi.create(officeId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetBatch`
 * @summary Get factoring export batch status
 * @permission Requires `canUseGetBatch` ability 
 * @param { string } object.batchId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FactoringExportModels.FactoringExportBatchResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetBatch = <TData>({ batchId, officeId }: { batchId: string, officeId: string }, options?: AppQueryOptions<typeof FactoringExportApi.getBatch, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getBatch(batchId, officeId),
    queryFn: () => { 
    checkAcl(FactoringExportAcl.canUseGetBatch({ officeId } ));
    return FactoringExportApi.getBatch(batchId, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
