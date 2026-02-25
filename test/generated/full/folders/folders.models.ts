import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace FoldersModels {
/** 
 * TargetEntityNameEnumSchema 
 * @type { enum }
 */
export const TargetEntityNameEnumSchema = z.enum(["invoice", "quote"]);
export type TargetEntityNameEnum = z.infer<typeof TargetEntityNameEnumSchema>;
export const TargetEntityNameEnum = TargetEntityNameEnumSchema.enum;

/** 
 * FolderSymlinkResponseDTOSchema 
 * @type { object }
 * @property { string } targetEntityName  
 * @property { string } targetEntityId  
 */
export const FolderSymlinkResponseDTOSchema = z.object({ targetEntityName: TargetEntityNameEnumSchema, targetEntityId: z.string() }).readonly();
export type FolderSymlinkResponseDTO = z.infer<typeof FolderSymlinkResponseDTOSchema>;

/** 
 * FolderTreeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } isSystem  
 * @property { boolean } isSymlink  
 * @property { FolderSymlinkResponseDTO } symlink  
 * @property { FolderTreeResponseDTO[] } folders  
 */
export const FolderTreeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), isSystem: z.boolean(), isSymlink: z.boolean(), symlink: FolderSymlinkResponseDTOSchema.nullable(), get folders() { return z.array(FolderTreeResponseDTOSchema).readonly() } }).readonly();
export type FolderTreeResponseDTO = z.infer<typeof FolderTreeResponseDTOSchema>;

/** 
 * FolderResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } archived  
 * @property { boolean } isSystem  
 * @property { boolean } isSymlink  
 * @property { FolderSymlinkResponseDTO } symlink  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { CommonModels.FolderEmployeeDTO } createdBy  
 * @property { CommonModels.FolderEmployeeDTO } updatedBy  
 * @property { CommonModels.FileResponseDTO[] } files  
 * @property { FolderResponseDTO[] } folders  
 */
export const FolderResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), isSystem: z.boolean(), isSymlink: z.boolean(), symlink: FolderSymlinkResponseDTOSchema.nullable(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: CommonModels.FolderEmployeeDTOSchema, updatedBy: CommonModels.FolderEmployeeDTOSchema, files: z.array(CommonModels.FileResponseDTOSchema).readonly(), get folders() { return z.array(FolderResponseDTOSchema).readonly() } }).readonly();
export type FolderResponseDTO = z.infer<typeof FolderResponseDTOSchema>;

/** 
 * FolderContentFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived When omitted, both archived and unarchived files are returned. 
 */
export const FolderContentFilterDtoSchema = z.object({ archived: z.boolean().describe("When omitted, both archived and unarchived files are returned.") }).readonly();
export type FolderContentFilterDto = z.infer<typeof FolderContentFilterDtoSchema>;

/** 
 * CreateFolderRequestDTOSchema 
 * @type { object }
 * @property { string } parentFolderId  
 * @property { string } name  
 */
export const CreateFolderRequestDTOSchema = z.object({ parentFolderId: z.string(), name: z.string() }).readonly();
export type CreateFolderRequestDTO = z.infer<typeof CreateFolderRequestDTOSchema>;

/** 
 * RenameFolderRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 */
export const RenameFolderRequestDTOSchema = z.object({ name: z.string() }).readonly();
export type RenameFolderRequestDTO = z.infer<typeof RenameFolderRequestDTOSchema>;

/** 
 * MoveFoldersRequestDTOSchema 
 * @type { object }
 * @property { string[] } folderIds Min Items: `1` 
 * @property { string } targetFolderId  
 */
export const MoveFoldersRequestDTOSchema = z.object({ folderIds: z.array(z.string()).readonly().min(1), targetFolderId: z.string() }).readonly();
export type MoveFoldersRequestDTO = z.infer<typeof MoveFoldersRequestDTOSchema>;

/** 
 * GetContentOrderParamSchema 
 * @type { array }
 * @description Order by fields (comma separated with +/- prefix): name, createdAt. Example: `name`
 */
export const GetContentOrderParamSchema = z.array(z.string()).readonly().describe("Order by fields (comma separated with +/- prefix): name, createdAt").nullish();
export type GetContentOrderParam = z.infer<typeof GetContentOrderParamSchema>;

}
