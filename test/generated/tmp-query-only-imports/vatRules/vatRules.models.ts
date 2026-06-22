import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace VatRulesModels {
/** 
 * VatRuleTypeEnumSchema 
 * @type { enum }
 */
export const VatRuleTypeEnumSchema = z.enum(["Outgoing", "Incoming"]);
export type VatRuleTypeEnum = z.infer<typeof VatRuleTypeEnumSchema>;
export const VatRuleTypeEnum = VatRuleTypeEnumSchema.enum;

/** 
 * VatRuleFilterDtoSchema 
 * @type { object }
 * @property { string } matchcode Matchcode to filter by 
 * @property { string } name Name to filter by 
 * @property { VatRuleTypeEnum } type  
 * @property { string } officeId Office ID to filter by 
 * @property { boolean } archived Filter by archived status 
 * @property { string } search Search to filter by 
 */
export const VatRuleFilterDtoSchema = z.object({ matchcode: z.string().nullable(), name: z.string().nullable(), type: VatRuleTypeEnumSchema.nullable(), officeId: z.string().nullable(), archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type VatRuleFilterDto = z.infer<typeof VatRuleFilterDtoSchema>;

/** 
 * VatRuleEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const VatRuleEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type VatRuleEmployeeDTO = z.infer<typeof VatRuleEmployeeDTOSchema>;

/** 
 * VatRuleOfficeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const VatRuleOfficeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type VatRuleOfficeDTO = z.infer<typeof VatRuleOfficeDTOSchema>;

/** 
 * VatRuleResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchcode  
 * @property { string } name  
 * @property { number } vatPercentage  
 * @property { number } vatNumber VAT rule reference number 
 * @property { boolean } noTax  
 * @property { VatRuleTypeEnum } type  
 * @property { boolean } archived  
 * @property { boolean } isReverseCharge  
 * @property { string } createdById  
 * @property { VatRuleEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { VatRuleEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 * @property { string } officeId  
 * @property { VatRuleOfficeDTO } office  
 * @property { string } bookkeepingId  
 * @property { string } bookkeepingTargetAccountNumber  
 */
export const VatRuleResponseDTOSchema = z.object({ id: z.string(), matchcode: z.string(), name: z.string(), vatPercentage: z.number(), vatNumber: z.number().nullish(), noTax: z.boolean().nullish(), type: VatRuleTypeEnumSchema, archived: z.boolean(), isReverseCharge: z.boolean(), createdById: z.string().nullish(), createdBy: VatRuleEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: VatRuleEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), officeId: z.string(), office: VatRuleOfficeDTOSchema.nullish(), bookkeepingId: z.string().nullish(), bookkeepingTargetAccountNumber: z.string().nullish() });
export type VatRuleResponseDTO = z.infer<typeof VatRuleResponseDTOSchema>;

/** 
 * CreateVatRuleRequestDTOSchema 
 * @type { object }
 * @property { string } matchcode Unique matchcode for the VAT rule 
 * @property { string } name Name of the VAT rule 
 * @property { boolean } noTax  
 * @property { number } vatPercentage VAT percentage (0-100). Minimum: `0`. Maximum: `100` 
 * @property { number } vatNumber VAT rule reference number 
 * @property { VatRuleTypeEnum } type Type of VAT rule 
 * @property { string } officeId Office ID 
 * @property { boolean } isReverseCharge Is reverse charge VAT rule 
 * @property { string } bookkeepingId Bookkeeping ID 
 * @property { string } bookkeepingTargetAccountNumber Bookkeeping target account number 
 */
export const CreateVatRuleRequestDTOSchema = z.object({ matchcode: z.string(), name: z.string(), noTax: z.boolean().nullish(), vatPercentage: z.number().gte(0).lte(100), vatNumber: z.number().nullish(), type: VatRuleTypeEnumSchema, officeId: z.string(), isReverseCharge: z.boolean().nullish(), bookkeepingId: z.string().nullish(), bookkeepingTargetAccountNumber: z.string().nullish() });
export type CreateVatRuleRequestDTO = z.infer<typeof CreateVatRuleRequestDTOSchema>;

/** 
 * UpdateVatRuleRequestDTOSchema 
 * @type { object }
 * @property { string } matchcode Unique matchcode for the VAT rule 
 * @property { string } name Name of the VAT rule 
 * @property { boolean } noTax  
 * @property { number } vatPercentage VAT percentage (0-100). Minimum: `0`. Maximum: `100` 
 * @property { number } vatNumber VAT rule reference number. Minimum: `0` 
 * @property { VatRuleTypeEnum } type Type of VAT rule 
 * @property { string } officeId Office ID 
 * @property { boolean } isReverseCharge Is reverse charge VAT rule 
 * @property { string } bookkeepingId Bookkeeping ID 
 * @property { string } bookkeepingTargetAccountNumber Bookkeeping target account number 
 */
export const UpdateVatRuleRequestDTOSchema = z.object({ matchcode: z.string().nullable(), name: z.string().nullable(), noTax: z.boolean().nullable(), vatPercentage: z.number().gte(0).lte(100).nullable(), vatNumber: z.number().gte(0).nullable(), type: VatRuleTypeEnumSchema.nullable(), officeId: z.string().nullable(), isReverseCharge: z.boolean().nullable(), bookkeepingId: z.string().nullable(), bookkeepingTargetAccountNumber: z.string().nullable() }).partial();
export type UpdateVatRuleRequestDTO = z.infer<typeof UpdateVatRuleRequestDTOSchema>;

/** 
 * VatRulesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const VatRulesPaginateLabelsOrderParamEnumSchema = z.enum(["matchcode", "name", "type", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type VatRulesPaginateLabelsOrderParamEnum = z.infer<typeof VatRulesPaginateLabelsOrderParamEnumSchema>;
export const VatRulesPaginateLabelsOrderParamEnum = VatRulesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * VatRulesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const VatRulesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type VatRulesPaginateLabelsResponse = z.infer<typeof VatRulesPaginateLabelsResponseSchema>;

/** 
 * VatRulesListOrderParamEnumSchema 
 * @type { enum }
 */
export const VatRulesListOrderParamEnumSchema = z.enum(["matchcode", "name", "type", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type VatRulesListOrderParamEnum = z.infer<typeof VatRulesListOrderParamEnumSchema>;
export const VatRulesListOrderParamEnum = VatRulesListOrderParamEnumSchema.enum;

/** 
 * VatRulesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { VatRuleResponseDTO[] } items  
 */
export const VatRulesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(VatRuleResponseDTOSchema).nullable() }).partial().shape });
export type VatRulesListResponse = z.infer<typeof VatRulesListResponseSchema>;

}
