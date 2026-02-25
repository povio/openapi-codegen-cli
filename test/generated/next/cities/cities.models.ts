import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CitiesModels {
/** 
 * CityCountryDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the country 
 * @property { string } name Name of the country 
 * @property { string } isoCode2 2 character iso code of the country 
 * @property { string } isoCode3 3 character iso code of the country 
 */
export const CityCountryDtoSchema = z.object({ id: z.string().describe("Unique identifier of the country"), name: z.string().describe("Name of the country"), isoCode2: z.string().describe("2 character iso code of the country"), isoCode3: z.string().describe("3 character iso code of the country") }).readonly();
export type CityCountryDto = z.infer<typeof CityCountryDtoSchema>;

/** 
 * CityEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CityEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type CityEmployeeDTO = z.infer<typeof CityEmployeeDTOSchema>;

/** 
 * CityResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the city 
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { boolean } archived Whether the city is archived 
 * @property { string } countryId Country ID 
 * @property { CityCountryDto } country  
 * @property { string } createdById  
 * @property { CityEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CityEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CityResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the city"), name: z.string().describe("Name of the city"), isoCode: z.string().describe("ISO code of the city").nullish(), stateCode: z.string().describe("State code of the city").nullish(), archived: z.boolean().describe("Whether the city is archived").nullish(), countryId: z.string().describe("Country ID").nullish(), country: CityCountryDtoSchema.nullish(), createdById: z.string().nullish(), createdBy: CityEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CityEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type CityResponseDTO = z.infer<typeof CityResponseDTOSchema>;

/** 
 * CityLabelCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CityLabelCountryDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type CityLabelCountryDto = z.infer<typeof CityLabelCountryDtoSchema>;

/** 
 * CityLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { CityLabelCountryDto } country  
 */
export const CityLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), country: CityLabelCountryDtoSchema.nullish() }).readonly();
export type CityLabelResponseDTO = z.infer<typeof CityLabelResponseDTOSchema>;

/** 
 * CityPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Free search 
 * @property { boolean } archived  
 */
export const CityPaginationFilterDtoSchema = z.object({ search: z.string().describe("Free search"), archived: z.boolean() }).readonly();
export type CityPaginationFilterDto = z.infer<typeof CityPaginationFilterDtoSchema>;

/** 
 * CityLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CityLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type CityLabelFilterDto = z.infer<typeof CityLabelFilterDtoSchema>;

/** 
 * CreateCityRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { string } countryId Country ID 
 */
export const CreateCityRequestDTOSchema = z.object({ name: z.string().describe("Name of the city"), isoCode: z.string().describe("ISO code of the city").nullish(), stateCode: z.string().describe("State code of the city").nullish(), countryId: z.string().describe("Country ID") }).readonly();
export type CreateCityRequestDTO = z.infer<typeof CreateCityRequestDTOSchema>;

/** 
 * UpdateCityRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { string } countryId Country ID 
 */
export const UpdateCityRequestDTOSchema = z.object({ name: z.string().describe("Name of the city"), isoCode: z.string().describe("ISO code of the city"), stateCode: z.string().describe("State code of the city"), countryId: z.string().describe("Country ID") }).readonly();
export type UpdateCityRequestDTO = z.infer<typeof UpdateCityRequestDTOSchema>;

/** 
 * CitiesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CitiesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CitiesPaginateOrderParamEnum = z.infer<typeof CitiesPaginateOrderParamEnumSchema>;
export const CitiesPaginateOrderParamEnum = CitiesPaginateOrderParamEnumSchema.enum;

/** 
 * CitiesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CityResponseDTO[] } items  
 */
export const CitiesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CityResponseDTOSchema).readonly() }).readonly().shape });
export type CitiesPaginateResponse = z.infer<typeof CitiesPaginateResponseSchema>;

/** 
 * ListCityLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ListCityLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ListCityLabelsOrderParamEnum = z.infer<typeof ListCityLabelsOrderParamEnumSchema>;
export const ListCityLabelsOrderParamEnum = ListCityLabelsOrderParamEnumSchema.enum;

/** 
 * ListCityLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CityLabelResponseDTO[] } items  
 */
export const ListCityLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CityLabelResponseDTOSchema).readonly() }).readonly().shape });
export type ListCityLabelsResponse = z.infer<typeof ListCityLabelsResponseSchema>;

}
