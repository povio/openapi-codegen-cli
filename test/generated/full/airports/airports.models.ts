import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace AirportsModels {
/** 
 * AirportEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const AirportEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
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
export const AirportResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the airport"), name: z.string().describe("Name of the airport"), matchCode: z.string().describe("Match code for the airport"), iataCode: z.string().describe("IATA code of the airport"), createdById: z.string().nullish(), createdBy: AirportEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: AirportEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type AirportResponseDTO = z.infer<typeof AirportResponseDTOSchema>;

/** 
 * AirportPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter airports by name, match code or IATA code 
 */
export const AirportPaginationFilterDtoSchema = z.object({ search: z.string().describe("Search term to filter airports by name, match code or IATA code") }).readonly();
export type AirportPaginationFilterDto = z.infer<typeof AirportPaginationFilterDtoSchema>;

/** 
 * AirportLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const AirportLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type AirportLabelFilterDto = z.infer<typeof AirportLabelFilterDtoSchema>;

/** 
 * CreateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const CreateAirportRequestDTOSchema = z.object({ name: z.string().describe("Name of the airport"), matchCode: z.string().describe("Match code for the airport"), iataCode: z.string().describe("IATA code of the airport") }).readonly();
export type CreateAirportRequestDTO = z.infer<typeof CreateAirportRequestDTOSchema>;

/** 
 * UpdateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const UpdateAirportRequestDTOSchema = z.object({ name: z.string().describe("Name of the airport"), matchCode: z.string().describe("Match code for the airport"), iataCode: z.string().describe("IATA code of the airport") }).readonly();
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
export const AirportsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(AirportResponseDTOSchema).readonly() }).readonly().shape });
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
export const AirportsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type AirportsPaginateLabelsResponse = z.infer<typeof AirportsPaginateLabelsResponseSchema>;

}
