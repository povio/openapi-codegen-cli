import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { FilesModels } from "./files.models";
import { FilesApi } from "./files.api";

export namespace FilesQueries {
export const moduleName = QueryModule.Files;



/** 
 * Mutation `useCreateUpload`
 * @summary Create file upload instructions
 * @param { string } officeId Path parameter
 * @param { string } folderId Path parameter
 * @param { FilesModels.CreateFileRequestDTO } data Body parameter
 * @param { File } file Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FilesModels.FileUploadResponseDTO> } 
 * @statusCodes [201, 401]
 */
export const useCreateUpload = (options?: AppMutationOptions<typeof FilesApi.createUpload, { officeId: string, folderId: string, data: FilesModels.CreateFileRequestDTO, file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: async ({ officeId, folderId, data, file, abortController, onUploadProgress }) => { 
      const uploadInstructions = await FilesApi.createUpload(officeId, folderId, data);
      
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
 * Mutation `useGetEml` - recommended when file should not be cached
 * @summary Get files as EML file with attachments
 * @param { string } officeId Path parameter
 * @param { FilesModels.GetFilesEmlRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGetEml = (options?: AppMutationOptions<typeof FilesApi.getEml, { officeId: string, data: FilesModels.GetFilesEmlRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FilesApi.getEml(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useRename`
 * @summary Rename file
 * @param { string } officeId Path parameter
 * @param { string } fileId Path parameter
 * @param { FilesModels.RenameFileRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<FilesModels.FileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useRename = (options?: AppMutationOptions<typeof FilesApi.rename, { officeId: string, fileId: string, data: FilesModels.RenameFileRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, fileId, data }) => 
      FilesApi.rename(officeId, fileId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useMove`
 * @summary Move files
 * @param { string } officeId Path parameter
 * @param { FilesModels.MoveFilesRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useMove = (options?: AppMutationOptions<typeof FilesApi.move, { officeId: string, data: FilesModels.MoveFilesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FilesApi.move(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCopy`
 * @summary Copy files
 * @param { string } officeId Path parameter
 * @param { FilesModels.MoveFilesRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useCopy = (options?: AppMutationOptions<typeof FilesApi.copy, { officeId: string, data: FilesModels.MoveFilesRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FilesApi.copy(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useArchive`
 * @summary Archive files
 * @param { string } officeId Path parameter
 * @param { FilesModels.SetFilesArchivedRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useArchive = (options?: AppMutationOptions<typeof FilesApi.archive, { officeId: string, data: FilesModels.SetFilesArchivedRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FilesApi.archive(officeId, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useUnarchive`
 * @summary Unarchive files
 * @param { string } officeId Path parameter
 * @param { FilesModels.SetFilesArchivedRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [204, 401]
 */
export const useUnarchive = (options?: AppMutationOptions<typeof FilesApi.unarchive, { officeId: string, data: FilesModels.SetFilesArchivedRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.Files>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, data }) => 
      FilesApi.unarchive(officeId, data)
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
