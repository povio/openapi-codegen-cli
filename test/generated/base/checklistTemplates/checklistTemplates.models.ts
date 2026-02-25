import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ChecklistTemplatesModels {
/** 
 * ChecklistTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChecklistTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ChecklistTemplateEmployeeDTO = z.infer<typeof ChecklistTemplateEmployeeDTOSchema>;

/** 
 * ChecklistTemplateItemResponseDTOSchema 
 * @type { object }
 * @property { string } checklistItemId Checklist item id 
 * @property { number } order Order index 
 * @property { string } name Checklist item name 
 */
export const ChecklistTemplateItemResponseDTOSchema = z.object({ checklistItemId: z.string(), order: z.number(), name: z.string().nullish() });
export type ChecklistTemplateItemResponseDTO = z.infer<typeof ChecklistTemplateItemResponseDTOSchema>;

/** 
 * ChecklistTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id Template id 
 * @property { string } name Template name 
 * @property { string } officeId Office id 
 * @property { boolean } archived Is archived 
 * @property { string } archivedAt Archived at 
 * @property { string } createdById ID of the employee who created this template 
 * @property { ChecklistTemplateEmployeeDTO } createdBy Employee who created this template 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this template 
 * @property { ChecklistTemplateEmployeeDTO } updatedBy Employee who last updated this template 
 * @property { string } updatedAt Updated at 
 * @property { ChecklistTemplateItemResponseDTO[] } items Ordered items 
 */
export const ChecklistTemplateResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: ChecklistTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ChecklistTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), items: z.array(ChecklistTemplateItemResponseDTOSchema) });
export type ChecklistTemplateResponseDTO = z.infer<typeof ChecklistTemplateResponseDTOSchema>;

/** 
 * CreateChecklistTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist template name. Min Length: `3`. Max Length: `120` 
 */
export const CreateChecklistTemplateRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type CreateChecklistTemplateRequestDTO = z.infer<typeof CreateChecklistTemplateRequestDTOSchema>;

/** 
 * ChecklistTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const ChecklistTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type ChecklistTemplateLabelFilterDto = z.infer<typeof ChecklistTemplateLabelFilterDtoSchema>;

/** 
 * ChecklistTemplateFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ChecklistTemplateFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ChecklistTemplateFilterDto = z.infer<typeof ChecklistTemplateFilterDtoSchema>;

/** 
 * UpdateChecklistTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist template name. Min Length: `3`. Max Length: `120` 
 * @property { string[] } items Ordered checklist item ids 
 */
export const UpdateChecklistTemplateRequestDTOSchema = z.object({ name: z.string().min(3).max(120), items: z.array(z.uuid()) });
export type UpdateChecklistTemplateRequestDTO = z.infer<typeof UpdateChecklistTemplateRequestDTOSchema>;

/** 
 * ChecklistTemplatesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistTemplatesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistTemplatesPaginateOrderParamEnum = z.infer<typeof ChecklistTemplatesPaginateOrderParamEnumSchema>;
export const ChecklistTemplatesPaginateOrderParamEnum = ChecklistTemplatesPaginateOrderParamEnumSchema.enum;

/** 
 * ChecklistTemplatesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChecklistTemplateResponseDTO[] } items  
 */
export const ChecklistTemplatesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChecklistTemplateResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistTemplatesPaginateResponse = z.infer<typeof ChecklistTemplatesPaginateResponseSchema>;

/** 
 * ChecklistTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof ChecklistTemplatesPaginateLabelsOrderParamEnumSchema>;
export const ChecklistTemplatesPaginateLabelsOrderParamEnum = ChecklistTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * ChecklistTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const ChecklistTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistTemplatesPaginateLabelsResponse = z.infer<typeof ChecklistTemplatesPaginateLabelsResponseSchema>;

}
