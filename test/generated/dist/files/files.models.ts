import { z } from "zod";

export namespace FilesModels {
  /**
   * CreateFileRequestDTOSchema
   * @type { object }
   * @property { string } name
   * @property { string } mimeType
   * @property { number } fileSize Minimum: `0`
   */
  export const CreateFileRequestDTOSchema = z
    .object({ name: z.string(), mimeType: z.string(), fileSize: z.number().gte(0) })
    .readonly();
  export type CreateFileRequestDTO = z.infer<typeof CreateFileRequestDTOSchema>;

  /**
   * FileUploadResponseDTOSchema
   * @type { object }
   * @property { string } fileId
   * @property { string } method
   * @property { string } url
   */
  export const FileUploadResponseDTOSchema = z
    .object({ fileId: z.string(), method: z.string(), url: z.string() })
    .readonly();
  export type FileUploadResponseDTO = z.infer<typeof FileUploadResponseDTOSchema>;

  /**
   * GetFilesEmlRequestDTOSchema
   * @type { object }
   * @property { string[] } ids Min Items: `1`
   */
  export const GetFilesEmlRequestDTOSchema = z.object({ ids: z.array(z.string()).readonly().min(1) }).readonly();
  export type GetFilesEmlRequestDTO = z.infer<typeof GetFilesEmlRequestDTOSchema>;

  /**
   * RenameFileRequestDTOSchema
   * @type { object }
   * @property { string } name
   */
  export const RenameFileRequestDTOSchema = z.object({ name: z.string() }).readonly();
  export type RenameFileRequestDTO = z.infer<typeof RenameFileRequestDTOSchema>;

  /**
   * MoveFilesRequestDTOSchema
   * @type { object }
   * @property { string[] } fileIds Min Items: `1`
   * @property { string } targetFolderId
   */
  export const MoveFilesRequestDTOSchema = z
    .object({ fileIds: z.array(z.string()).readonly().min(1), targetFolderId: z.string() })
    .readonly();
  export type MoveFilesRequestDTO = z.infer<typeof MoveFilesRequestDTOSchema>;

  /**
   * SetFilesArchivedRequestDTOSchema
   * @type { object }
   * @property { string[] } ids Min Items: `1`
   */
  export const SetFilesArchivedRequestDTOSchema = z.object({ ids: z.array(z.string()).readonly().min(1) }).readonly();
  export type SetFilesArchivedRequestDTO = z.infer<typeof SetFilesArchivedRequestDTOSchema>;
}
