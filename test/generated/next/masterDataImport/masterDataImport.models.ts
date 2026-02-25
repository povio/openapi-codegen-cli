import { z } from "zod";

export namespace MasterDataImportModels {
/** 
 * ImportStatusEnumSchema 
 * @type { enum }
 * @description Import result status
 */
export const ImportStatusEnumSchema = z.enum(["Success", "Warning", "Error"]);
export type ImportStatusEnum = z.infer<typeof ImportStatusEnumSchema>;
export const ImportStatusEnum = ImportStatusEnumSchema.enum;

/** 
 * ImportTypeEnumSchema 
 * @type { enum }
 */
export const ImportTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "Warehouse"]);
export type ImportTypeEnum = z.infer<typeof ImportTypeEnumSchema>;
export const ImportTypeEnum = ImportTypeEnumSchema.enum;

/** 
 * MasterDataImportRequestDtoSchema 
 * @type { object }
 * @property { string } mediaId Media ID of the uploaded file 
 * @property { ImportTypeEnum } type Type of data to import 
 */
export const MasterDataImportRequestDtoSchema = z.object({ mediaId: z.string().describe("Media ID of the uploaded file"), type: ImportTypeEnumSchema.describe("Type of data to import") }).readonly();
export type MasterDataImportRequestDto = z.infer<typeof MasterDataImportRequestDtoSchema>;

/** 
 * ImportResultDtoSchema 
 * @type { object }
 * @property { string } importStatus Import result status 
 * @property { string } downloadUrl S3 presigned URL for result file download 
 * @property { string } expiresAt Download URL expiration time 
 * @property { string } errorCode  
 */
export const ImportResultDtoSchema = z.object({ importStatus: ImportStatusEnumSchema.describe("Import result status").nullish(), downloadUrl: z.string().describe("S3 presigned URL for result file download"), expiresAt: z.iso.datetime({ offset: true }).describe("Download URL expiration time").nullish(), errorCode: z.string().nullish() }).readonly();
export type ImportResultDto = z.infer<typeof ImportResultDtoSchema>;

/** 
 * ImportStatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Current job status 
 * @property { ImportResultDto } result Import result data when job is completed 
 */
export const ImportStatusResponseDtoSchema = z.object({ status: z.string().describe("Current job status").nullable(), result: ImportResultDtoSchema.describe("Import result data when job is completed").nullish() }).readonly();
export type ImportStatusResponseDto = z.infer<typeof ImportStatusResponseDtoSchema>;

/** 
 * MasterDataImportUploadRequestDtoSchema 
 * @type { object }
 * @property { string } filename File name 
 * @property { string } contentType Content type of the file 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const MasterDataImportUploadRequestDtoSchema = z.object({ filename: z.string().describe("File name"), contentType: z.string().describe("Content type of the file"), fileSize: z.number().gte(1).describe("File size in bytes") }).readonly();
export type MasterDataImportUploadRequestDto = z.infer<typeof MasterDataImportUploadRequestDtoSchema>;

/** 
 * MasterDataImportUploadResponseDtoSchema 
 * @type { object }
 * @property { string } mediaId Media ID for the uploaded file 
 * @property { string } url S3 presigned upload URL 
 */
export const MasterDataImportUploadResponseDtoSchema = z.object({ mediaId: z.string().describe("Media ID for the uploaded file"), url: z.string().describe("S3 presigned upload URL") }).readonly();
export type MasterDataImportUploadResponseDto = z.infer<typeof MasterDataImportUploadResponseDtoSchema>;

/** 
 * MasterDataImportResponseDtoSchema 
 * @type { object }
 * @property { string } jobId PG Boss job ID 
 * @property { string } status Initial job status 
 */
export const MasterDataImportResponseDtoSchema = z.object({ jobId: z.string().describe("PG Boss job ID"), status: z.string().describe("Initial job status").nullish() }).readonly();
export type MasterDataImportResponseDto = z.infer<typeof MasterDataImportResponseDtoSchema>;

}
