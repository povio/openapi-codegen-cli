import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CargoTypesModels {
/** 
 * CargoTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CargoTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type CargoTypeEmployeeDTO = z.infer<typeof CargoTypeEmployeeDTOSchema>;

/** 
 * CargoTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the cargo type 
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { CommonModels.TransportModeEnum[] } modules Transport modules applicable to the cargo type 
 * @property { boolean } archived Indicates if the cargo type is archived 
 * @property { string } createdById  
 * @property { CargoTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CargoTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CargoTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), shortName: z.string().nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), unit: z.string(), emptyWeight: z.number().nullish(), containerIsoCode: z.string().nullish(), isContainer: z.boolean().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), archived: z.boolean(), createdById: z.string().nullish(), createdBy: CargoTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CargoTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type CargoTypeResponseDTO = z.infer<typeof CargoTypeResponseDTOSchema>;

/** 
 * TransportModuleEnumSchema 
 * @type { enum }
 */
export const TransportModuleEnumSchema = z.enum(["Air", "Sea", "Road"]);
export type TransportModuleEnum = z.infer<typeof TransportModuleEnumSchema>;
export const TransportModuleEnum = TransportModuleEnumSchema.enum;

/** 
 * CargoTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { TransportModuleEnum } module  
 * @property { boolean } archived Archived status filter 
 * @property { string } search  
 */
export const CargoTypePaginationFilterDtoSchema = z.object({ module: TransportModuleEnumSchema.nullable(), archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type CargoTypePaginationFilterDto = z.infer<typeof CargoTypePaginationFilterDtoSchema>;

/** 
 * CreateCargoTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { string } unit Measurement unit for dimensions 
 * @property { CommonModels.TransportModeEnum[] } modules Transport modes applicable to the cargo type 
 */
export const CreateCargoTypeRequestDTOSchema = z.object({ name: z.string(), shortName: z.string().nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), emptyWeight: z.number().nullish(), containerIsoCode: z.string().nullish(), isContainer: z.boolean().nullish(), unit: z.string(), modules: z.array(CommonModels.TransportModeEnumSchema) });
export type CreateCargoTypeRequestDTO = z.infer<typeof CreateCargoTypeRequestDTOSchema>;

/** 
 * UpdateCargoTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { string } unit Measurement unit for dimensions 
 * @property { CommonModels.TransportModeEnum[] } modules Transport modules applicable to the cargo type 
 */
export const UpdateCargoTypeRequestDTOSchema = z.object({ name: z.string().nullable(), shortName: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), emptyWeight: z.number().nullable(), containerIsoCode: z.string().nullable(), isContainer: z.boolean().nullable(), unit: z.string().nullable(), modules: z.array(CommonModels.TransportModeEnumSchema).nullable() }).partial();
export type UpdateCargoTypeRequestDTO = z.infer<typeof UpdateCargoTypeRequestDTOSchema>;

/** 
 * CargoTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CargoTypeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type CargoTypeLabelFilterDto = z.infer<typeof CargoTypeLabelFilterDtoSchema>;

/** 
 * CargoTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CargoTypesPaginateOrderParamEnumSchema = z.enum(["matchcode", "description", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type CargoTypesPaginateOrderParamEnum = z.infer<typeof CargoTypesPaginateOrderParamEnumSchema>;
export const CargoTypesPaginateOrderParamEnum = CargoTypesPaginateOrderParamEnumSchema.enum;

/** 
 * CargoTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CargoTypeResponseDTO[] } items  
 */
export const CargoTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CargoTypeResponseDTOSchema).nullable() }).partial().shape });
export type CargoTypesPaginateResponse = z.infer<typeof CargoTypesPaginateResponseSchema>;

/** 
 * CargoTypesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const CargoTypesPaginateLabelsOrderParamEnumSchema = z.enum(["matchcode", "description", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type CargoTypesPaginateLabelsOrderParamEnum = z.infer<typeof CargoTypesPaginateLabelsOrderParamEnumSchema>;
export const CargoTypesPaginateLabelsOrderParamEnum = CargoTypesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * CargoTypesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const CargoTypesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type CargoTypesPaginateLabelsResponse = z.infer<typeof CargoTypesPaginateLabelsResponseSchema>;

}
