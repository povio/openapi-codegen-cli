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
export const MasterDataImportRequestDtoSchema = z.object({ mediaId: z.string(), type: ImportTypeEnumSchema });
export type MasterDataImportRequestDto = z.infer<typeof MasterDataImportRequestDtoSchema>;

/** 
 * ImportResultDtoSchema 
 * @type { object }
 * @property { string } importStatus Import result status 
 * @property { string } downloadUrl S3 presigned URL for result file download 
 * @property { string } expiresAt Download URL expiration time 
 * @property { string } errorCode  
 */
export const ImportResultDtoSchema = z.object({ importStatus: ImportStatusEnumSchema.nullish(), downloadUrl: z.string(), expiresAt: z.iso.datetime({ offset: true }).nullish(), errorCode: z.string().nullish() });
export type ImportResultDto = z.infer<typeof ImportResultDtoSchema>;

/** 
 * ImportStatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Current job status 
 * @property { ImportResultDto } result Import result data when job is completed 
 */
export const ImportStatusResponseDtoSchema = z.object({ status: z.string().nullable(), result: ImportResultDtoSchema.nullish() });
export type ImportStatusResponseDto = z.infer<typeof ImportStatusResponseDtoSchema>;

/** 
 * MasterDataImportUploadRequestDtoSchema 
 * @type { object }
 * @property { string } filename File name 
 * @property { string } contentType Content type of the file 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const MasterDataImportUploadRequestDtoSchema = z.object({ filename: z.string(), contentType: z.string(), fileSize: z.number().gte(1) });
export type MasterDataImportUploadRequestDto = z.infer<typeof MasterDataImportUploadRequestDtoSchema>;

/** 
 * MasterDataImportUploadResponseDtoSchema 
 * @type { object }
 * @property { string } mediaId Media ID for the uploaded file 
 * @property { string } url S3 presigned upload URL 
 */
export const MasterDataImportUploadResponseDtoSchema = z.object({ mediaId: z.string(), url: z.string() });
export type MasterDataImportUploadResponseDto = z.infer<typeof MasterDataImportUploadResponseDtoSchema>;

/** 
 * MasterDataImportResponseDtoSchema 
 * @type { object }
 * @property { string } jobId PG Boss job ID 
 * @property { string } status Initial job status 
 */
export const MasterDataImportResponseDtoSchema = z.object({ jobId: z.string(), status: z.string().nullish() });
export type MasterDataImportResponseDto = z.infer<typeof MasterDataImportResponseDtoSchema>;

}
