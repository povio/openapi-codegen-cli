import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsModels {
/** 
 * TypeEnumSchema 
 * @type { enum }
 * @description Working document type
 */
export const TypeEnumSchema = z.enum(["export-declaration", "house-bl", "master-bl", "house-awb", "master-awb", "bl-instructions", "ams-instructions", "cmr-form", "fcr-form", "isf-form", "templated-document", "shipping-instructions"]);
export type TypeEnum = z.infer<typeof TypeEnumSchema>;
export const TypeEnum = TypeEnumSchema.enum;

/** 
 * WorkingDocumentCreatedByResponseDTOSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } name Employee name 
 */
export const WorkingDocumentCreatedByResponseDTOSchema = z.object({ id: z.string().describe("Employee ID"), name: z.string().describe("Employee name").nullable() }).readonly();
export type WorkingDocumentCreatedByResponseDTO = z.infer<typeof WorkingDocumentCreatedByResponseDTOSchema>;

/** 
 * WorkingDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId Position ID 
 * @property { string } name Working document name 
 * @property { string } nameSuffix Working document name suffix 
 * @property { string } type Working document type 
 * @property { string } referenceTable Reference table 
 * @property { string } referenceId Reference ID 
 * @property { string } createdById Created by 
 * @property { string } createdAt Created at 
 * @property { WorkingDocumentCreatedByResponseDTO } createdBy Created by 
 */
export const WorkingDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string().describe("Position ID"), name: z.string().describe("Working document name"), nameSuffix: z.string().describe("Working document name suffix").nullish(), type: TypeEnumSchema.describe("Working document type"), referenceTable: z.string().describe("Reference table"), referenceId: z.string().describe("Reference ID"), createdById: z.string().describe("Created by"), createdAt: z.iso.datetime({ offset: true }).describe("Created at"), createdBy: WorkingDocumentCreatedByResponseDTOSchema.describe("Created by") }).readonly();
export type WorkingDocumentResponseDTO = z.infer<typeof WorkingDocumentResponseDTOSchema>;

/** 
 * WorkingDocumentFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { string } type  
 */
export const WorkingDocumentFilterDtoSchema = z.object({ search: z.string(), type: z.string() }).readonly();
export type WorkingDocumentFilterDto = z.infer<typeof WorkingDocumentFilterDtoSchema>;

/** 
 * WorkingDocumentsListOrderParamEnumSchema 
 * @type { enum }
 */
export const WorkingDocumentsListOrderParamEnumSchema = z.enum(["NAME", "TYPE", "CREATED_AT", "UPDATED_AT"]);
export type WorkingDocumentsListOrderParamEnum = z.infer<typeof WorkingDocumentsListOrderParamEnumSchema>;
export const WorkingDocumentsListOrderParamEnum = WorkingDocumentsListOrderParamEnumSchema.enum;

/** 
 * WorkingDocumentsListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { WorkingDocumentResponseDTO[] } items  
 */
export const WorkingDocumentsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(WorkingDocumentResponseDTOSchema).readonly() }).readonly().shape });
export type WorkingDocumentsListResponse = z.infer<typeof WorkingDocumentsListResponseSchema>;

}
