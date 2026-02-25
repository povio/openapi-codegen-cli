import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CountriesModels {
/** 
 * CountryEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CountryEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type CountryEmployeeDTO = z.infer<typeof CountryEmployeeDTOSchema>;

/** 
 * CountryResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the country 
 * @property { string } name Name of the country 
 * @property { string } isoCode2 ISO 2-letter code 
 * @property { string } isoCode3 ISO 3-letter code 
 * @property { string } currencyNotation Currency notation 
 * @property { string } createdById  
 * @property { CountryEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CountryEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CountryResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the country"), name: z.string().describe("Name of the country"), isoCode2: z.string().describe("ISO 2-letter code"), isoCode3: z.string().describe("ISO 3-letter code"), currencyNotation: z.string().describe("Currency notation"), createdById: z.string().nullish(), createdBy: CountryEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CountryEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type CountryResponseDTO = z.infer<typeof CountryResponseDTOSchema>;

/** 
 * CountryPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CountryPaginationFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type CountryPaginationFilterDto = z.infer<typeof CountryPaginationFilterDtoSchema>;

/** 
 * CountriesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CountriesPaginateOrderParamEnumSchema = z.enum(["name", "isoCode2", "isoCode3", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CountriesPaginateOrderParamEnum = z.infer<typeof CountriesPaginateOrderParamEnumSchema>;
export const CountriesPaginateOrderParamEnum = CountriesPaginateOrderParamEnumSchema.enum;

/** 
 * CountriesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CountryResponseDTO[] } items  
 */
export const CountriesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CountryResponseDTOSchema).readonly() }).readonly().shape });
export type CountriesPaginateResponse = z.infer<typeof CountriesPaginateResponseSchema>;

/** 
 * PaginateCountryLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCountryLabelsOrderParamEnumSchema = z.enum(["name", "isoCode2", "isoCode3", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCountryLabelsOrderParamEnum = z.infer<typeof PaginateCountryLabelsOrderParamEnumSchema>;
export const PaginateCountryLabelsOrderParamEnum = PaginateCountryLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateCountryLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PaginateCountryLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type PaginateCountryLabelsResponse = z.infer<typeof PaginateCountryLabelsResponseSchema>;

}
