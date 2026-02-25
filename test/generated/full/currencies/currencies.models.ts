import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CurrenciesModels {
/** 
 * CurrencyEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CurrencyEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type CurrencyEmployeeDTO = z.infer<typeof CurrencyEmployeeDTOSchema>;

/** 
 * CurrencyResponseDtoSchema 
 * @type { object }
 * @property { string } isoCode isoCode of the currency 
 * @property { string } name Name of the currency 
 * @property { string } symbol Symbol of the currency 
 * @property { string } alignment Alignment of the currency 
 * @property { string } createdById ID of the employee who created this currency 
 * @property { CurrencyEmployeeDTO } createdBy Employee who created this currency 
 * @property { string } createdAt Date when the currency was created 
 * @property { string } updatedById ID of the employee who last updated this currency 
 * @property { CurrencyEmployeeDTO } updatedBy Employee who last updated this currency 
 * @property { string } updatedAt Date when the currency was last updated 
 */
export const CurrencyResponseDtoSchema = z.object({ isoCode: z.string().describe("isoCode of the currency"), name: z.string().describe("Name of the currency"), symbol: z.string().describe("Symbol of the currency").nullish(), alignment: z.string().describe("Alignment of the currency").nullish(), createdById: z.string().describe("ID of the employee who created this currency").nullish(), createdBy: CurrencyEmployeeDTOSchema.describe("Employee who created this currency").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Date when the currency was created"), updatedById: z.string().describe("ID of the employee who last updated this currency").nullish(), updatedBy: CurrencyEmployeeDTOSchema.describe("Employee who last updated this currency").nullish(), updatedAt: z.iso.datetime({ offset: true }).describe("Date when the currency was last updated") }).readonly();
export type CurrencyResponseDto = z.infer<typeof CurrencyResponseDtoSchema>;

/** 
 * CurrencyPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string } search  
 */
export const CurrencyPaginationFilterDtoSchema = z.object({ officeId: z.string(), search: z.string() }).readonly();
export type CurrencyPaginationFilterDto = z.infer<typeof CurrencyPaginationFilterDtoSchema>;

/** 
 * CreateCurrencyRequestDTOSchema 
 * @type { object }
 * @property { string } isoCode Unique identifier for the currency 
 * @property { string } name Name of the currency 
 * @property { string } symbol Symbol of the currency 
 * @property { string } alignment Alignment of the currency 
 */
export const CreateCurrencyRequestDTOSchema = z.object({ isoCode: z.string().describe("Unique identifier for the currency"), name: z.string().describe("Name of the currency"), symbol: z.string().describe("Symbol of the currency"), alignment: z.string().describe("Alignment of the currency") }).readonly();
export type CreateCurrencyRequestDTO = z.infer<typeof CreateCurrencyRequestDTOSchema>;

/** 
 * UpdateCurrencyRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the currency 
 */
export const UpdateCurrencyRequestDTOSchema = z.object({ name: z.string().describe("Name of the currency") }).readonly();
export type UpdateCurrencyRequestDTO = z.infer<typeof UpdateCurrencyRequestDTOSchema>;

/** 
 * CurrenciesListOrderParamEnumSchema 
 * @type { enum }
 */
export const CurrenciesListOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CurrenciesListOrderParamEnum = z.infer<typeof CurrenciesListOrderParamEnumSchema>;
export const CurrenciesListOrderParamEnum = CurrenciesListOrderParamEnumSchema.enum;

/** 
 * CurrenciesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CurrencyResponseDto[] } items  
 */
export const CurrenciesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CurrencyResponseDtoSchema).readonly() }).readonly().shape });
export type CurrenciesListResponse = z.infer<typeof CurrenciesListResponseSchema>;

/** 
 * PaginateCurrencyLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCurrencyLabelsOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCurrencyLabelsOrderParamEnum = z.infer<typeof PaginateCurrencyLabelsOrderParamEnumSchema>;
export const PaginateCurrencyLabelsOrderParamEnum = PaginateCurrencyLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateCurrencyLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PaginateCurrencyLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type PaginateCurrencyLabelsResponse = z.infer<typeof PaginateCurrencyLabelsResponseSchema>;

/** 
 * PaginateCurrencyLabelsByOfficeOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCurrencyLabelsByOfficeOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCurrencyLabelsByOfficeOrderParamEnum = z.infer<typeof PaginateCurrencyLabelsByOfficeOrderParamEnumSchema>;
export const PaginateCurrencyLabelsByOfficeOrderParamEnum = PaginateCurrencyLabelsByOfficeOrderParamEnumSchema.enum;

/** 
 * PaginateCurrencyLabelsByOfficeResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PaginateCurrencyLabelsByOfficeResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type PaginateCurrencyLabelsByOfficeResponse = z.infer<typeof PaginateCurrencyLabelsByOfficeResponseSchema>;

}
