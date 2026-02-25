import axios, {  } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { MasterDataImportAcl } from "./masterDataImport.acl";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { MasterDataImportModels } from "./masterDataImport.models";
import { MasterDataImportApi } from "./masterDataImport.api";

export namespace MasterDataImportQueries {
export const moduleName = QueryModule.MasterDataImport;

export const keys = {
    all: [moduleName] as const,
    getImportStatus: (jobId: string, officeId: string) => [...keys.all, "/offices/:officeId/master-data/import/:jobId/status", jobId, officeId] as const,
};

/** 
 * Mutation `useUpload`
 * @summary Create upload instructions for master data import file
 * @permission Requires `canUseUpload` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { MasterDataImportModels.MasterDataImportUploadRequestDto } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<MasterDataImportModels.MasterDataImportUploadResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useUpload = (options?: AppMutationOptions<typeof MasterDataImportApi.upload, { officeId: string, data: MasterDataImportModels.MasterDataImportUploadRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(MasterDataImportAcl.canUseUpload({ officeId } ));
      const uploadInstructions = await MasterDataImportApi.upload(officeId, data);
      
      if (file && uploadInstructions.url) {
        const method = (data?.method?.toLowerCase() ?? "put") as "put" | "post";
        let dataToSend: File | FormData = file;
        if (method === "post") {
          dataToSend = new FormData();
          if (uploadInstructions.fields) {
            for (const [key, value] of uploadInstructions.fields) {
              dataToSend.append(key, value);
            }
          }
          dataToSend.append("file", file);
        }
        await axios[method](uploadInstructions.url, dataToSend, {
          headers: {
            "Content-Type": file.type,
          },
          signal: abortController?.signal,
          onUploadProgress: onUploadProgress
          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })
          : undefined,
        });
      }
      
      return uploadInstructions;
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `usePostOfficesMasterDataImportByOfficeId`
 * @summary Start master data import process
 * @permission Requires `canUsePostOfficesMasterDataImportByOfficeId` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { MasterDataImportModels.MasterDataImportRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<MasterDataImportModels.MasterDataImportResponseDto> } 
 * @statusCodes [201, 401]
 */
export const usePostOfficesMasterDataImportByOfficeId = (options?: AppMutationOptions<typeof MasterDataImportApi.postOfficesMasterDataImportByOfficeId, { officeId: string, data: MasterDataImportModels.MasterDataImportRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(MasterDataImportAcl.canUsePostOfficesMasterDataImportByOfficeId({ officeId } ));
      return MasterDataImportApi.postOfficesMasterDataImportByOfficeId(officeId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetImportStatus`
 * @summary Get import job status
 * @permission Requires `canUseGetImportStatus` ability 
 * @param { string } object.jobId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataImportModels.ImportStatusResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetImportStatus = <TData>({ jobId, officeId }: { jobId: string, officeId: string }, options?: AppQueryOptions<typeof MasterDataImportApi.getImportStatus, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getImportStatus(jobId, officeId),
    queryFn: () => { 
    checkAcl(MasterDataImportAcl.canUseGetImportStatus({ officeId } ));
    return MasterDataImportApi.getImportStatus(jobId, officeId) },
    ...options,
  });
};

}
