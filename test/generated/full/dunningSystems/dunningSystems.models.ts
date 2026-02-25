import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningSystemsModels {
/** 
 * DunningSystemEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningSystemEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type DunningSystemEmployeeDTO = z.infer<typeof DunningSystemEmployeeDTOSchema>;

/** 
 * DunningSystemResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name  
 * @property { boolean } isDefault  
 * @property { boolean } archived  
 * @property { string } archivedAt  
 * @property { string } createdById  
 * @property { DunningSystemEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { DunningSystemEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const DunningSystemResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), isDefault: z.boolean(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: DunningSystemEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DunningSystemEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type DunningSystemResponseDTO = z.infer<typeof DunningSystemResponseDTOSchema>;

/** 
 * DunningSystemLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DunningSystemLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type DunningSystemLabelFilterDto = z.infer<typeof DunningSystemLabelFilterDtoSchema>;

/** 
 * DunningSystemFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 * @property { boolean } isDefault  
 */
export const DunningSystemFilterDtoSchema = z.object({ search: z.string(), archived: z.boolean(), isDefault: z.boolean() }).readonly();
export type DunningSystemFilterDto = z.infer<typeof DunningSystemFilterDtoSchema>;

/** 
 * CreateDunningSystemRequestDTOSchema 
 * @type { object }
 * @property { string } name Dunning system name. Min Length: `3`. Max Length: `100` 
 * @property { boolean } isDefault Is default dunning system 
 */
export const CreateDunningSystemRequestDTOSchema = z.object({ name: z.string().min(3).max(100).describe("Dunning system name"), isDefault: z.boolean().describe("Is default dunning system").nullish() }).readonly();
export type CreateDunningSystemRequestDTO = z.infer<typeof CreateDunningSystemRequestDTOSchema>;

/** 
 * UpdateDunningSystemRequestDTOSchema 
 * @type { object }
 * @property { string } name Dunning system name. Min Length: `3`. Max Length: `100` 
 * @property { boolean } isDefault Is default dunning system 
 */
export const UpdateDunningSystemRequestDTOSchema = z.object({ name: z.string().min(3).max(100).describe("Dunning system name"), isDefault: z.boolean().describe("Is default dunning system") }).readonly();
export type UpdateDunningSystemRequestDTO = z.infer<typeof UpdateDunningSystemRequestDTOSchema>;

/** 
 * DunningSystemsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningSystemsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "isDefault"]);
export type DunningSystemsPaginateLabelsOrderParamEnum = z.infer<typeof DunningSystemsPaginateLabelsOrderParamEnumSchema>;
export const DunningSystemsPaginateLabelsOrderParamEnum = DunningSystemsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DunningSystemsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const DunningSystemsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type DunningSystemsPaginateLabelsResponse = z.infer<typeof DunningSystemsPaginateLabelsResponseSchema>;

/** 
 * DunningSystemsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningSystemsPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "isDefault"]);
export type DunningSystemsPaginateOrderParamEnum = z.infer<typeof DunningSystemsPaginateOrderParamEnumSchema>;
export const DunningSystemsPaginateOrderParamEnum = DunningSystemsPaginateOrderParamEnumSchema.enum;

/** 
 * DunningSystemsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningSystemResponseDTO[] } items  
 */
export const DunningSystemsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningSystemResponseDTOSchema).readonly() }).readonly().shape });
export type DunningSystemsPaginateResponse = z.infer<typeof DunningSystemsPaginateResponseSchema>;

}
