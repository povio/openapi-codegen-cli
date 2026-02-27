import { CommonModels } from "@/data/common/common.models";

export namespace FilesModels {
  export const FileUploadResponseDTOSchema = CommonModels.FileUploadResponseDTOSchema;
  export const CreateFileRequestDTOSchema = CommonModels.CreateFileRequestDTOSchema;
  export const GetFilesEmlRequestDTOSchema = CommonModels.GetFilesEmlRequestDTOSchema;
  export const FileResponseDTOSchema = CommonModels.FileResponseDTOSchema;
  export const RenameFileRequestDTOSchema = CommonModels.RenameFileRequestDTOSchema;
  export const MoveFilesRequestDTOSchema = CommonModels.MoveFilesRequestDTOSchema;
  export const SetFilesArchivedRequestDTOSchema = CommonModels.SetFilesArchivedRequestDTOSchema;
  export const FolderEmployeeDTOSchema = CommonModels.FolderEmployeeDTOSchema;
  export type FileUploadResponseDTO = CommonModels.FileUploadResponseDTO;
  export type CreateFileRequestDTO = CommonModels.CreateFileRequestDTO;
  export type GetFilesEmlRequestDTO = CommonModels.GetFilesEmlRequestDTO;
  export type FileResponseDTO = CommonModels.FileResponseDTO;
  export type RenameFileRequestDTO = CommonModels.RenameFileRequestDTO;
  export type MoveFilesRequestDTO = CommonModels.MoveFilesRequestDTO;
  export type SetFilesArchivedRequestDTO = CommonModels.SetFilesArchivedRequestDTO;
  export type FolderEmployeeDTO = CommonModels.FolderEmployeeDTO;
}
