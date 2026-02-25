import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DocumentTemplatesModels {
/** 
 * DocumentTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DocumentTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type DocumentTemplateEmployeeDTO = z.infer<typeof DocumentTemplateEmployeeDTOSchema>;

/** 
 * DocumentTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name  
 * @property { boolean } isArchived  
 * @property { string } createdById ID of the employee who created this template 
 * @property { DocumentTemplateEmployeeDTO } createdBy Employee who created this template 
 * @property { string } createdAt  
 * @property { string } updatedById ID of the employee who last updated this template 
 * @property { DocumentTemplateEmployeeDTO } updatedBy Employee who last updated this template 
 * @property { string } updatedAt  
 * @property { CommonModels.TemplateBlocksResponseDTO } blocks  
 */
export const DocumentTemplateResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), isArchived: z.boolean(), createdById: z.string().nullish(), createdBy: DocumentTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DocumentTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), blocks: CommonModels.TemplateBlocksResponseDTOSchema });
export type DocumentTemplateResponseDTO = z.infer<typeof DocumentTemplateResponseDTOSchema>;

/** 
 * TemplateBlocksDTOSchema 
 * @type { object }
 * @property { CommonModels.TitleBlockDTO } titleBlock  
 * @property { CommonModels.ReceiverBlockDTO } receiverBlock  
 * @property { CommonModels.OurInformationBlockDTO } ourInformationBlock  
 * @property { CommonModels.RouteTableBlockDTO } routeTableBlock  
 * @property { CommonModels.CargoTableBlockDTO } cargoTableBlock  
 * @property { CommonModels.CargoSummaryBlockDTO } cargoSummaryBlock  
 * @property { CommonModels.FinanceTableBlockDTO } financeTableBlock  
 * @property { CommonModels.RemarkBlockDTO[] } remarkBlocks  
 * @property { CommonModels.FooterBlockDTO } footerBlock  
 * @property { CommonModels.TermsBlockDTO } termsBlock  
 * @property { CommonModels.CutOffDatesBlockDTO } cutOffDatesBlock  
 */
export const TemplateBlocksDTOSchema = z.object({ titleBlock: CommonModels.TitleBlockDTOSchema.nullable(), receiverBlock: CommonModels.ReceiverBlockDTOSchema.nullable(), ourInformationBlock: CommonModels.OurInformationBlockDTOSchema.nullable(), routeTableBlock: CommonModels.RouteTableBlockDTOSchema.nullable(), cargoTableBlock: CommonModels.CargoTableBlockDTOSchema.nullable(), cargoSummaryBlock: CommonModels.CargoSummaryBlockDTOSchema.nullable(), financeTableBlock: CommonModels.FinanceTableBlockDTOSchema.nullable(), remarkBlocks: z.array(CommonModels.RemarkBlockDTOSchema).nullable(), footerBlock: CommonModels.FooterBlockDTOSchema.nullable(), termsBlock: CommonModels.TermsBlockDTOSchema.nullable(), cutOffDatesBlock: CommonModels.CutOffDatesBlockDTOSchema.nullable() }).partial();
export type TemplateBlocksDTO = z.infer<typeof TemplateBlocksDTOSchema>;

/** 
 * CreateDocumentTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { TemplateBlocksDTO } blocks  
 */
export const CreateDocumentTemplateRequestDTOSchema = z.object({ name: z.string(), blocks: TemplateBlocksDTOSchema.nullish() });
export type CreateDocumentTemplateRequestDTO = z.infer<typeof CreateDocumentTemplateRequestDTOSchema>;

/** 
 * UpdateDocumentTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { boolean } isArchived  
 * @property { TemplateBlocksDTO } blocks  
 */
export const UpdateDocumentTemplateRequestDTOSchema = z.object({ name: z.string().nullable(), isArchived: z.boolean().nullable(), blocks: TemplateBlocksDTOSchema.nullable() }).partial();
export type UpdateDocumentTemplateRequestDTO = z.infer<typeof UpdateDocumentTemplateRequestDTOSchema>;

/** 
 * CreateRemarkBlockRequestDTOSchema 
 * @type { object }
 * @property { CommonModels.EditorContentUpdateDto } content  
 * @property { number } position 1-based position of the remark block. Minimum: `1` 
 * @property { boolean } enabled  
 */
export const CreateRemarkBlockRequestDTOSchema = z.object({ content: CommonModels.EditorContentUpdateDtoSchema, position: z.number().gte(1).nullish(), enabled: z.boolean().nullish() });
export type CreateRemarkBlockRequestDTO = z.infer<typeof CreateRemarkBlockRequestDTOSchema>;

/** 
 * DocumentTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DocumentTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type DocumentTemplateLabelFilterDto = z.infer<typeof DocumentTemplateLabelFilterDtoSchema>;

/** 
 * DocumentTemplateFilterDtoSchema 
 * @type { object }
 * @property { boolean } isArchived  
 * @property { string } search  
 */
export const DocumentTemplateFilterDtoSchema = z.object({ isArchived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type DocumentTemplateFilterDto = z.infer<typeof DocumentTemplateFilterDtoSchema>;

/** 
 * DocumentTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DocumentTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DocumentTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof DocumentTemplatesPaginateLabelsOrderParamEnumSchema>;
export const DocumentTemplatesPaginateLabelsOrderParamEnum = DocumentTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DocumentTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const DocumentTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type DocumentTemplatesPaginateLabelsResponse = z.infer<typeof DocumentTemplatesPaginateLabelsResponseSchema>;

/** 
 * DocumentTemplatesListOrderParamEnumSchema 
 * @type { enum }
 */
export const DocumentTemplatesListOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DocumentTemplatesListOrderParamEnum = z.infer<typeof DocumentTemplatesListOrderParamEnumSchema>;
export const DocumentTemplatesListOrderParamEnum = DocumentTemplatesListOrderParamEnumSchema.enum;

/** 
 * DocumentTemplatesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DocumentTemplateResponseDTO[] } items  
 */
export const DocumentTemplatesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DocumentTemplateResponseDTOSchema).nullable() }).partial().shape });
export type DocumentTemplatesListResponse = z.infer<typeof DocumentTemplatesListResponseSchema>;

}
