import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { FactoringMergeAcl } from "./factoringMerge.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FactoringMergeModels } from "./factoringMerge.models";
import { FactoringMergeApi } from "./factoringMerge.api";

export namespace FactoringMergeQueries {
export const moduleName = QueryModule.FactoringMerge;

export const keys = {
    all: [moduleName] as const,
    getMergeBatch: (officeId: string, batchId: string) => [...keys.all, "/offices/:officeId/factoring-merge/:batchId", officeId, batchId] as const,
};

/** 
 * Mutation `usePrepareUpload`
 * @summary Prepare upload instructions for MOVE files merge
 * @permission Requires `canUsePrepareUpload` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { FactoringMergeModels.PrepareFactoringMergeRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FactoringMergeModels.FactoringMergeUploadInstructionsResponseDto> } 
 * @statusCodes [201, 401, default]
 */
export const usePrepareUpload = (options?: AppMutationOptions<typeof FactoringMergeApi.prepareUpload, { officeId: string, data: FactoringMergeModels.PrepareFactoringMergeRequestDto }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(FactoringMergeAcl.canUsePrepareUpload({ officeId } ));
      return FactoringMergeApi.prepareUpload(officeId, data, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useProcessMerge`
 * @summary Start processing the merge batch
 * @permission Requires `canUseProcessMerge` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.batchId Path parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FactoringMergeModels.FactoringMergeBatchResponseDto> } 
 * @statusCodes [201, 401, default]
 */
export const useProcessMerge = (options?: AppMutationOptions<typeof FactoringMergeApi.processMerge, { officeId: string, batchId: string }> & MutationEffectsOptions, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, batchId }) => { 
      checkAcl(FactoringMergeAcl.canUseProcessMerge({ officeId } ));
      return FactoringMergeApi.processMerge(officeId, batchId, config)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const { officeId, batchId } = variables;
      const updateKeys = [keys.getMergeBatch(officeId, batchId)];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetMergeBatch`
 * @summary Get merge batch status
 * @permission Requires `canUseGetMergeBatch` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.batchId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<FactoringMergeModels.FactoringMergeBatchResponseDto> } 
 * @statusCodes [200, 401, default]
 */
export const useGetMergeBatch = <TData>({ officeId, batchId }: { officeId: string, batchId: string }, options?: AppQueryOptions<typeof FactoringMergeApi.getMergeBatch, TData>, config?: AxiosRequestConfig) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getMergeBatch(officeId, batchId),
    queryFn: () => { 
    checkAcl(FactoringMergeAcl.canUseGetMergeBatch({ officeId } ));
    return FactoringMergeApi.getMergeBatch(officeId, batchId, config) },
    ...options,
  });
};

}
