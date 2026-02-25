import { z } from "zod";

export namespace FactoringMergeModels {
/** 
 * FileMetadataDtoSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType File MIME type 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const FileMetadataDtoSchema = z.object({ fileName: z.string().describe("File name"), mimeType: z.string().describe("File MIME type"), fileSize: z.number().gte(1).describe("File size in bytes") }).readonly();
export type FileMetadataDto = z.infer<typeof FileMetadataDtoSchema>;

/** 
 * PrepareFactoringMergeRequestDtoSchema 
 * @type { object }
 * @property { FileMetadataDto } eurDebtorFile EUR debtor file metadata 
 * @property { FileMetadataDto } eurOperationsFile EUR operations file metadata 
 * @property { FileMetadataDto } eurExistingFactoringFile EUR existing factoring file metadata (optional) 
 * @property { FileMetadataDto } usdDebtorFile USD debtor file metadata 
 * @property { FileMetadataDto } usdOperationsFile USD operations file metadata 
 * @property { FileMetadataDto } usdExistingFactoringFile USD existing factoring file metadata (optional) 
 */
export const PrepareFactoringMergeRequestDtoSchema = z.object({ eurDebtorFile: FileMetadataDtoSchema.describe("EUR debtor file metadata"), eurOperationsFile: FileMetadataDtoSchema.describe("EUR operations file metadata"), eurExistingFactoringFile: FileMetadataDtoSchema.describe("EUR existing factoring file metadata (optional)").nullish(), usdDebtorFile: FileMetadataDtoSchema.describe("USD debtor file metadata"), usdOperationsFile: FileMetadataDtoSchema.describe("USD operations file metadata"), usdExistingFactoringFile: FileMetadataDtoSchema.describe("USD existing factoring file metadata (optional)").nullish() }).readonly();
export type PrepareFactoringMergeRequestDto = z.infer<typeof PrepareFactoringMergeRequestDtoSchema>;

/** 
 * MediaUploadInstructionsDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } method  
 * @property { string } url  
 */
export const MediaUploadInstructionsDtoSchema = z.object({ id: z.string(), method: z.string(), url: z.string() }).readonly();
export type MediaUploadInstructionsDto = z.infer<typeof MediaUploadInstructionsDtoSchema>;

/** 
 * FactoringMergeUploadInstructionsResponseDtoSchema 
 * @type { object }
 * @property { string } batchId  
 * @property { MediaUploadInstructionsDto } eurDebtorFile  
 * @property { MediaUploadInstructionsDto } eurOperationsFile  
 * @property { MediaUploadInstructionsDto } eurExistingFactoringFile  
 * @property { MediaUploadInstructionsDto } usdDebtorFile  
 * @property { MediaUploadInstructionsDto } usdOperationsFile  
 * @property { MediaUploadInstructionsDto } usdExistingFactoringFile  
 */
export const FactoringMergeUploadInstructionsResponseDtoSchema = z.object({ batchId: z.string(), eurDebtorFile: MediaUploadInstructionsDtoSchema, eurOperationsFile: MediaUploadInstructionsDtoSchema, eurExistingFactoringFile: MediaUploadInstructionsDtoSchema.nullish(), usdDebtorFile: MediaUploadInstructionsDtoSchema, usdOperationsFile: MediaUploadInstructionsDtoSchema, usdExistingFactoringFile: MediaUploadInstructionsDtoSchema.nullish() }).readonly();
export type FactoringMergeUploadInstructionsResponseDto = z.infer<typeof FactoringMergeUploadInstructionsResponseDtoSchema>;

/** 
 * FactoringMergeBatchStatusEnumSchema 
 * @type { enum }
 */
export const FactoringMergeBatchStatusEnumSchema = z.enum(["Initializing", "Processing", "Completed", "Failed"]);
export type FactoringMergeBatchStatusEnum = z.infer<typeof FactoringMergeBatchStatusEnumSchema>;
export const FactoringMergeBatchStatusEnum = FactoringMergeBatchStatusEnumSchema.enum;

/** 
 * FactoringMergeBatchResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { FactoringMergeBatchStatusEnum } status  
 * @property { string } eurDebtorFileMediaId  
 * @property { string } eurOperationsFileMediaId  
 * @property { string } eurExistingFactoringFileMediaId  
 * @property { string } usdDebtorFileMediaId  
 * @property { string } usdOperationsFileMediaId  
 * @property { string } usdExistingFactoringFileMediaId  
 * @property { string } eurResultFileMediaId  
 * @property { string } eurResultFileUrl  
 * @property { string } usdResultFileMediaId  
 * @property { string } usdResultFileUrl  
 * @property { string } jobId  
 * @property { string } errorMessage  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } completedAt  
 */
export const FactoringMergeBatchResponseDtoSchema = z.object({ id: z.string(), officeId: z.string(), status: FactoringMergeBatchStatusEnumSchema, eurDebtorFileMediaId: z.string(), eurOperationsFileMediaId: z.string(), eurExistingFactoringFileMediaId: z.string().nullish(), usdDebtorFileMediaId: z.string(), usdOperationsFileMediaId: z.string(), usdExistingFactoringFileMediaId: z.string().nullish(), eurResultFileMediaId: z.string().nullish(), eurResultFileUrl: z.string().nullish(), usdResultFileMediaId: z.string().nullish(), usdResultFileUrl: z.string().nullish(), jobId: z.string().nullish(), errorMessage: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), completedAt: z.iso.datetime({ offset: true }).nullish() }).readonly();
export type FactoringMergeBatchResponseDto = z.infer<typeof FactoringMergeBatchResponseDtoSchema>;

}
