import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace HsCodesModels {
/** 
 * HsCodeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const HsCodeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type HsCodeEmployeeDTO = z.infer<typeof HsCodeEmployeeDTOSchema>;

/** 
 * HsCodeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the HS Code 
 * @property { string } name Name of the HS Code 
 * @property { string } description Description of the HS Code 
 * @property { string } customArea Custom area associated with the HS Code 
 * @property { boolean } archived Indicates if the HS Code is archived 
 * @property { string } createdById  
 * @property { HsCodeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { HsCodeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const HsCodeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), description: z.string(), customArea: z.string(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: HsCodeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: HsCodeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type HsCodeResponseDTO = z.infer<typeof HsCodeResponseDTOSchema>;

/** 
 * HsCodePaginationFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived Archived status 
 * @property { string } search  
 */
export const HsCodePaginationFilterDtoSchema = z.object({ archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type HsCodePaginationFilterDto = z.infer<typeof HsCodePaginationFilterDtoSchema>;

/** 
 * HsCodeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const HsCodeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type HsCodeLabelFilterDto = z.infer<typeof HsCodeLabelFilterDtoSchema>;

/** 
 * CreateHsCodeRequestDTOSchema 
 * @type { object }
 * @property { string } name Unique name for the HS Code 
 * @property { string } description Description of the HS Code 
 * @property { string } customArea Custom area associated with the HS Code 
 */
export const CreateHsCodeRequestDTOSchema = z.object({ name: z.string(), description: z.string(), customArea: z.string() });
export type CreateHsCodeRequestDTO = z.infer<typeof CreateHsCodeRequestDTOSchema>;

/** 
 * UpdateHsCodeRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name of the HS Code. 
 * @property { string } description Updated description of the HS Code. 
 * @property { string } customArea Updated custom area associated with the HS Code. 
 */
export const UpdateHsCodeRequestDTOSchema = z.object({ name: z.string().nullable(), description: z.string().nullable(), customArea: z.string().nullable() }).partial();
export type UpdateHsCodeRequestDTO = z.infer<typeof UpdateHsCodeRequestDTOSchema>;

/** 
 * HsCodesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const HsCodesPaginateOrderParamEnumSchema = z.enum(["matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type HsCodesPaginateOrderParamEnum = z.infer<typeof HsCodesPaginateOrderParamEnumSchema>;
export const HsCodesPaginateOrderParamEnum = HsCodesPaginateOrderParamEnumSchema.enum;

/** 
 * HsCodesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { HsCodeResponseDTO[] } items  
 */
export const HsCodesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(HsCodeResponseDTOSchema).nullable() }).partial().shape });
export type HsCodesPaginateResponse = z.infer<typeof HsCodesPaginateResponseSchema>;

/** 
 * HsCodesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const HsCodesPaginateLabelsOrderParamEnumSchema = z.enum(["matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type HsCodesPaginateLabelsOrderParamEnum = z.infer<typeof HsCodesPaginateLabelsOrderParamEnumSchema>;
export const HsCodesPaginateLabelsOrderParamEnum = HsCodesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * HsCodesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const HsCodesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type HsCodesPaginateLabelsResponse = z.infer<typeof HsCodesPaginateLabelsResponseSchema>;

}
