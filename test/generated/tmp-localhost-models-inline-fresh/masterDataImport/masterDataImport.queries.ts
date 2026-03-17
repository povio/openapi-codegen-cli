import axios, {  } from "axios";
import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, UseQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { MasterDataImportAcl } from "./masterDataImport.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { MasterDataImportModels } from "./masterDataImport.models";

export namespace MasterDataImportQueries {
const upload = (officeId: string, data: MasterDataImportModels.MasterDataImportUploadRequestDto) => {
  return AppRestClient.post(
    { resSchema: MasterDataImportModels.MasterDataImportUploadResponseDtoSchema },
    `/offices/${officeId}/master-data/upload`,
    ZodExtended.parse(MasterDataImportModels.MasterDataImportUploadRequestDtoSchema, data),
    
  );
};

const postOfficesMasterDataImportByOfficeId = (officeId: string, data: MasterDataImportModels.MasterDataImportRequestDto) => {
  return AppRestClient.post(
    { resSchema: MasterDataImportModels.MasterDataImportResponseDtoSchema },
    `/offices/${officeId}/master-data/import`,
    ZodExtended.parse(MasterDataImportModels.MasterDataImportRequestDtoSchema, data),
    
  );
};

const getImportStatus = (jobId: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: MasterDataImportModels.ImportStatusResponseDtoSchema },
    `/offices/${officeId}/master-data/import/${jobId}/status`,
    
  );
};


export const moduleName = QueryModule.MasterDataImport;

export const keys = {
    all: [moduleName] as const,
    getImportStatus: (jobId: string, officeId: string) => [...keys.all, "/offices/:officeId/master-data/import/:jobId/status", jobId, officeId] as const,
};

/** 
 * Mutation `useUpload`
 * @summary Create upload instructions for master data import file
 * @permission Requires `canUseUpload` ability 
 * @param { string } officeId Path parameter
 * @param { MasterDataImportModels.MasterDataImportUploadRequestDto } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<MasterDataImportModels.MasterDataImportUploadResponseDto> } 
 * @statusCodes [201, 401]
 */
export const useUpload = (options?: AppMutationOptions<typeof upload, { officeId: string, data: MasterDataImportModels.MasterDataImportUploadRequestDto, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, data, file, abortController, onUploadProgress }) => { 
      checkAcl(MasterDataImportAcl.canUseUpload({ officeId } ));
      const uploadInstructions = await upload(officeId, data);
      
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
    onError: options?.onError ?? queryConfig.onError,
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
 * @param { string } officeId Path parameter
 * @param { MasterDataImportModels.MasterDataImportRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<MasterDataImportModels.MasterDataImportResponseDto> } 
 * @statusCodes [201, 401]
 */
export const usePostOfficesMasterDataImportByOfficeId = (options?: AppMutationOptions<typeof postOfficesMasterDataImportByOfficeId, { officeId: string, data: MasterDataImportModels.MasterDataImportRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => { 
      checkAcl(MasterDataImportAcl.canUsePostOfficesMasterDataImportByOfficeId({ officeId } ));
      return postOfficesMasterDataImportByOfficeId(officeId, data)
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
 * Query `useGetImportStatus`
 * @summary Get import job status
 * @permission Requires `canUseGetImportStatus` ability 
 * @param { string } jobId Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<MasterDataImportModels.ImportStatusResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetImportStatus = <TData>({ jobId, officeId }: { jobId: string, officeId: string }, options?: AppQueryOptions<typeof getImportStatus, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.getImportStatus(jobId, officeId),
    queryFn: () => { 
    checkAcl(MasterDataImportAcl.canUseGetImportStatus({ officeId } ));
    return getImportStatus(jobId, officeId) },
    ...options,
  });
};

}
