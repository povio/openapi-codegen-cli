import axios, {  } from "axios";
import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FilesModels } from "./files.models";

export namespace FilesQueries {
const createUpload = (officeId: string, folderId: string, data: FilesModels.CreateFileRequestDTO) => {
  return AppRestClient.post(
    { resSchema: FilesModels.FileUploadResponseDTOSchema },
    `/offices/${officeId}/folders/${folderId}/files`,
    ZodExtended.parse(FilesModels.CreateFileRequestDTOSchema, data),
    
  );
};

const getEml = (officeId: string, data: FilesModels.GetFilesEmlRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.instanceof(Blob) },
    `/offices/${officeId}/files/eml`,
    ZodExtended.parse(FilesModels.GetFilesEmlRequestDTOSchema, data),
    {
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: "blob",
      rawResponse: true,
    }
  );
};

const rename = (officeId: string, fileId: string, data: FilesModels.RenameFileRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: FilesModels.FileResponseDTOSchema },
    `/offices/${officeId}/files/${fileId}`,
    ZodExtended.parse(FilesModels.RenameFileRequestDTOSchema, data),
    
  );
};

const move = (officeId: string, data: FilesModels.MoveFilesRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/files/move`,
    ZodExtended.parse(FilesModels.MoveFilesRequestDTOSchema, data),
    
  );
};

const copy = (officeId: string, data: FilesModels.MoveFilesRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/files/copy`,
    ZodExtended.parse(FilesModels.MoveFilesRequestDTOSchema, data),
    
  );
};

const archive = (officeId: string, data: FilesModels.SetFilesArchivedRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/files/archive`,
    ZodExtended.parse(FilesModels.SetFilesArchivedRequestDTOSchema, data),
    
  );
};

const unarchive = (officeId: string, data: FilesModels.SetFilesArchivedRequestDTO) => {
  return AppRestClient.post(
    { resSchema: z.void() },
    `/offices/${officeId}/files/unarchive`,
    ZodExtended.parse(FilesModels.SetFilesArchivedRequestDTOSchema, data),
    
  );
};


export const moduleName = QueryModule.Files;



/** 
 * Mutation `useCreateUpload`
 * @summary Create file upload instructions
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.folderId Path parameter
 * @param { FilesModels.CreateFileRequestDTO } mutation.data Body parameter
 * @param { File } mutation.file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FilesModels.FileUploadResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateUpload = (options?: AppMutationOptions<typeof createUpload, { officeId: string, folderId: string, data: FilesModels.CreateFileRequestDTO, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, folderId, data, file, abortController, onUploadProgress }) => { 
      const uploadInstructions = await createUpload(officeId, folderId, data);
      
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
 * Mutation `useGetEml` - recommended when file should not be cached
 * @summary Get files as EML file with attachments
 * @param { string } mutation.officeId Path parameter
 * @param { FilesModels.GetFilesEmlRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetEml = (options?: AppMutationOptions<typeof getEml, { officeId: string, data: FilesModels.GetFilesEmlRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      getEml(officeId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRename`
 * @summary Rename file
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.fileId Path parameter
 * @param { FilesModels.RenameFileRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.FileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useRename = (options?: AppMutationOptions<typeof rename, { officeId: string, fileId: string, data: FilesModels.RenameFileRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, fileId, data }) => 
      rename(officeId, fileId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useMove`
 * @summary Move files
 * @param { string } mutation.officeId Path parameter
 * @param { FilesModels.MoveFilesRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMove = (options?: AppMutationOptions<typeof move, { officeId: string, data: FilesModels.MoveFilesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      move(officeId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCopy`
 * @summary Copy files
 * @param { string } mutation.officeId Path parameter
 * @param { FilesModels.MoveFilesRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useCopy = (options?: AppMutationOptions<typeof copy, { officeId: string, data: FilesModels.MoveFilesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      copy(officeId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive files
 * @param { string } mutation.officeId Path parameter
 * @param { FilesModels.SetFilesArchivedRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof archive, { officeId: string, data: FilesModels.SetFilesArchivedRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      archive(officeId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive files
 * @param { string } mutation.officeId Path parameter
 * @param { FilesModels.SetFilesArchivedRequestDTO } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof unarchive, { officeId: string, data: FilesModels.SetFilesArchivedRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      unarchive(officeId, data)
,
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
