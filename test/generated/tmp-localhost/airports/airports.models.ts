import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace AirportsModels {
/** 
 * AirportEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const AirportEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type AirportEmployeeDTO = z.infer<typeof AirportEmployeeDTOSchema>;

/** 
 * AirportResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the airport 
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 * @property { string } createdById  
 * @property { AirportEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { AirportEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const AirportResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), iataCode: z.string(), createdById: z.string().nullish(), createdBy: AirportEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: AirportEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type AirportResponseDTO = z.infer<typeof AirportResponseDTOSchema>;

/** 
 * AirportPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter airports by name, match code or IATA code 
 */
export const AirportPaginationFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type AirportPaginationFilterDto = z.infer<typeof AirportPaginationFilterDtoSchema>;

/** 
 * AirportLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const AirportLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type AirportLabelFilterDto = z.infer<typeof AirportLabelFilterDtoSchema>;

/** 
 * CreateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const CreateAirportRequestDTOSchema = z.object({ name: z.string(), matchCode: z.string(), iataCode: z.string() });
export type CreateAirportRequestDTO = z.infer<typeof CreateAirportRequestDTOSchema>;

/** 
 * UpdateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const UpdateAirportRequestDTOSchema = z.object({ name: z.string().nullable(), matchCode: z.string().nullable(), iataCode: z.string().nullable() }).partial();
export type UpdateAirportRequestDTO = z.infer<typeof UpdateAirportRequestDTOSchema>;

/** 
 * AirportsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const AirportsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "iataCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type AirportsPaginateOrderParamEnum = z.infer<typeof AirportsPaginateOrderParamEnumSchema>;
export const AirportsPaginateOrderParamEnum = AirportsPaginateOrderParamEnumSchema.enum;

/** 
 * AirportsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { AirportResponseDTO[] } items  
 */
export const AirportsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(AirportResponseDTOSchema).nullable() }).partial().shape });
export type AirportsPaginateResponse = z.infer<typeof AirportsPaginateResponseSchema>;

/** 
 * AirportsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const AirportsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "iataCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type AirportsPaginateLabelsOrderParamEnum = z.infer<typeof AirportsPaginateLabelsOrderParamEnumSchema>;
export const AirportsPaginateLabelsOrderParamEnum = AirportsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * AirportsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const AirportsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type AirportsPaginateLabelsResponse = z.infer<typeof AirportsPaginateLabelsResponseSchema>;

}
