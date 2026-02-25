import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PortsModels {
/** 
 * PortCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PortCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PortCityDto = z.infer<typeof PortCityDtoSchema>;

/** 
 * PortCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const PortCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type PortCountryDto = z.infer<typeof PortCountryDtoSchema>;

/** 
 * PortAddressDtoSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } zip ZIP/Postal code 
 * @property { PortCityDto } city  
 * @property { string } district District name 
 * @property { PortCountryDto } country  
 */
export const PortAddressDtoSchema = z.object({ street: z.string(), zip: z.string(), city: PortCityDtoSchema.nullish(), district: z.string().nullish(), country: PortCountryDtoSchema.nullish() });
export type PortAddressDto = z.infer<typeof PortAddressDtoSchema>;

/** 
 * PortEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PortEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PortEmployeeDTO = z.infer<typeof PortEmployeeDTOSchema>;

/** 
 * PortResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the port 
 * @property { string } name Name of the port 
 * @property { string } matchCode Match code for the port 
 * @property { PortAddressDto } address Address details of the port 
 * @property { string } createdById  
 * @property { PortEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { PortEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const PortResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), address: PortAddressDtoSchema, createdById: z.string().nullish(), createdBy: PortEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: PortEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type PortResponseDTO = z.infer<typeof PortResponseDTOSchema>;

/** 
 * PortPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter ports by name or match code 
 */
export const PortPaginationFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PortPaginationFilterDto = z.infer<typeof PortPaginationFilterDtoSchema>;

/** 
 * PortLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const PortLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PortLabelFilterDto = z.infer<typeof PortLabelFilterDtoSchema>;

/** 
 * CreatePortRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } street Street address 
 * @property { string } secondaryStreet  
 * @property { string } zip ZIP / Postal code 
 * @property { string } cityId City id 
 * @property { string } countryId Country id 
 * @property { string } district  
 */
export const CreatePortRequestDTOSchema = z.object({ name: z.string(), matchCode: z.string(), street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), cityId: z.string(), countryId: z.string(), district: z.string().nullish() });
export type CreatePortRequestDTO = z.infer<typeof CreatePortRequestDTOSchema>;

/** 
 * UpdatePortRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name 
 * @property { string } matchCode Updated match code 
 * @property { string } street Updated street address 
 * @property { string } secondaryStreet Updated secondary street 
 * @property { string } zip Updated ZIP/Postal code 
 * @property { string } cityId Updated city id 
 * @property { string } countryId Updated country id 
 * @property { string } district  
 */
export const UpdatePortRequestDTOSchema = z.object({ name: z.string().nullable(), matchCode: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), district: z.string().nullable() }).partial();
export type UpdatePortRequestDTO = z.infer<typeof UpdatePortRequestDTOSchema>;

/** 
 * PortsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PortsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PortsPaginateOrderParamEnum = z.infer<typeof PortsPaginateOrderParamEnumSchema>;
export const PortsPaginateOrderParamEnum = PortsPaginateOrderParamEnumSchema.enum;

/** 
 * PortsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PortResponseDTO[] } items  
 */
export const PortsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PortResponseDTOSchema).nullable() }).partial().shape });
export type PortsPaginateResponse = z.infer<typeof PortsPaginateResponseSchema>;

/** 
 * PortsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PortsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PortsPaginateLabelsOrderParamEnum = z.infer<typeof PortsPaginateLabelsOrderParamEnumSchema>;
export const PortsPaginateLabelsOrderParamEnum = PortsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * PortsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PortsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PortsPaginateLabelsResponse = z.infer<typeof PortsPaginateLabelsResponseSchema>;

}
