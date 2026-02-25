import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace RemarkTemplatesModels {
/** 
 * RemarkTemplateLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { CommonModels.EditorContentResponseDto } content Remark template content 
 */
export const RemarkTemplateLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), content: CommonModels.EditorContentResponseDtoSchema });
export type RemarkTemplateLabelResponseDTO = z.infer<typeof RemarkTemplateLabelResponseDTOSchema>;

/** 
 * RemarkTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const RemarkTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type RemarkTemplateEmployeeDTO = z.infer<typeof RemarkTemplateEmployeeDTOSchema>;

/** 
 * OnlyUsedForEnumSchema 
 * @type { enum }
 */
export const OnlyUsedForEnumSchema = z.enum(["transport-order", "export-declaration", "house-bl", "master-bl", "house-awb", "master-awb", "bl-instructions", "ams-instructions", "cmr-form", "fcr-form", "isf-form", "templated-document", "invoice", "quote-document", "shipping-instructions", "position-office-notes", "invoice-body-remarks", "business-partner-office-notes"]);
export type OnlyUsedForEnum = z.infer<typeof OnlyUsedForEnumSchema>;
export const OnlyUsedForEnum = OnlyUsedForEnumSchema.enum;

/** 
 * RemarkTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name Template name 
 * @property { CommonModels.EditorContentResponseDto } content Template content 
 * @property { string[] } onlyUsedFor Restrict template usage to specific document types 
 * @property { boolean } archived  
 * @property { string } createdById  
 * @property { RemarkTemplateEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { RemarkTemplateEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const RemarkTemplateResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), content: CommonModels.EditorContentResponseDtoSchema, onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullish(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: RemarkTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: RemarkTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type RemarkTemplateResponseDTO = z.infer<typeof RemarkTemplateResponseDTOSchema>;

/** 
 * CreateRemarkTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { CommonModels.EditorContentUpdateDto } content Template content 
 * @property { OnlyUsedForEnum[] } onlyUsedFor Restrict template usage to specific document types 
 */
export const CreateRemarkTemplateRequestDTOSchema = z.object({ name: z.string(), content: CommonModels.EditorContentUpdateDtoSchema, onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullish() });
export type CreateRemarkTemplateRequestDTO = z.infer<typeof CreateRemarkTemplateRequestDTOSchema>;

/** 
 * UpdateRemarkTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { CommonModels.EditorContentUpdateDto } content Template content 
 * @property { string[] } onlyUsedFor Restrict template usage to specific document types 
 * @property { boolean } archived Archive status 
 */
export const UpdateRemarkTemplateRequestDTOSchema = z.object({ name: z.string().nullable(), content: CommonModels.EditorContentUpdateDtoSchema.nullable(), onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullable(), archived: z.boolean().nullable() }).partial();
export type UpdateRemarkTemplateRequestDTO = z.infer<typeof UpdateRemarkTemplateRequestDTOSchema>;

/** 
 * RemarkTemplateFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived  
 * @property { string } search  
 * @property { string } onlyUsedFor Filter by document type 
 */
export const RemarkTemplateFilterDtoSchema = z.object({ archived: z.boolean().nullable(), search: z.string().nullable(), onlyUsedFor: OnlyUsedForEnumSchema.nullable() }).partial();
export type RemarkTemplateFilterDto = z.infer<typeof RemarkTemplateFilterDtoSchema>;

/** 
 * RemarkTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const RemarkTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type RemarkTemplateLabelFilterDto = z.infer<typeof RemarkTemplateLabelFilterDtoSchema>;

/** 
 * RemarkTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const RemarkTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type RemarkTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof RemarkTemplatesPaginateLabelsOrderParamEnumSchema>;
export const RemarkTemplatesPaginateLabelsOrderParamEnum = RemarkTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * RemarkTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { RemarkTemplateLabelResponseDTO[] } items  
 */
export const RemarkTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(RemarkTemplateLabelResponseDTOSchema).nullable() }).partial().shape });
export type RemarkTemplatesPaginateLabelsResponse = z.infer<typeof RemarkTemplatesPaginateLabelsResponseSchema>;

/** 
 * RemarkTemplatesListOrderParamEnumSchema 
 * @type { enum }
 */
export const RemarkTemplatesListOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type RemarkTemplatesListOrderParamEnum = z.infer<typeof RemarkTemplatesListOrderParamEnumSchema>;
export const RemarkTemplatesListOrderParamEnum = RemarkTemplatesListOrderParamEnumSchema.enum;

/** 
 * RemarkTemplatesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { RemarkTemplateResponseDTO[] } items  
 */
export const RemarkTemplatesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(RemarkTemplateResponseDTOSchema).nullable() }).partial().shape });
export type RemarkTemplatesListResponse = z.infer<typeof RemarkTemplatesListResponseSchema>;

}
