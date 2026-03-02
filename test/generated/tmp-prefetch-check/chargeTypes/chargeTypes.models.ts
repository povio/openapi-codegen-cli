import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ChargeTypesModels {
/** 
 * ChargeTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.TransportModeEnum[] } transportModes  
 * @property { CommonModels.LanguageEnum } language  
 * @property { string } search  
 */
export const ChargeTypeLabelFilterDtoSchema = z.object({ direction: CommonModels.DirectionEnumSchema.nullable(), transportModes: z.array(CommonModels.TransportModeEnumSchema).nullable(), language: CommonModels.LanguageEnumSchema.nullable(), search: z.string().nullable() }).partial();
export type ChargeTypeLabelFilterDto = z.infer<typeof ChargeTypeLabelFilterDtoSchema>;

/** 
 * ChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { CommonModels.LanguageEnum } language  
 * @property { string } value  
 */
export const ChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type ChargeTypeTranslationDto = z.infer<typeof ChargeTypeTranslationDtoSchema>;

/** 
 * ChargeTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChargeTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ChargeTypeEmployeeDTO = z.infer<typeof ChargeTypeEmployeeDTOSchema>;

/** 
 * ChargeTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { CommonModels.TransportModeEnum[] } modules  
 * @property { CommonModels.DirectionEnum[] } directions  
 * @property { ChargeTypeTranslationDto[] } translations  
 * @property { string } createdById  
 * @property { ChargeTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { ChargeTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const ChargeTypeResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), englishName: z.string(), archived: z.boolean(), description: z.string().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), directions: z.array(CommonModels.DirectionEnumSchema), translations: z.array(ChargeTypeTranslationDtoSchema), createdById: z.string().nullish(), createdBy: ChargeTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ChargeTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ChargeTypeResponseDTO = z.infer<typeof ChargeTypeResponseDTOSchema>;

/** 
 * ChargeTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } search  
 * @property { boolean } archived  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.TransportModeEnum[] } transportModes  
 */
export const ChargeTypePaginationFilterDtoSchema = z.object({ name: z.string().nullable(), search: z.string().nullable(), archived: z.boolean().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), transportModes: z.array(CommonModels.TransportModeEnumSchema).nullable() }).partial();
export type ChargeTypePaginationFilterDto = z.infer<typeof ChargeTypePaginationFilterDtoSchema>;

/** 
 * CreateChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { CommonModels.LanguageEnum } language  
 * @property { string } value  
 */
export const CreateChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type CreateChargeTypeTranslationDto = z.infer<typeof CreateChargeTypeTranslationDtoSchema>;

/** 
 * CreateChargeTypeRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { CommonModels.TransportModeEnum[] } modules  
 * @property { CommonModels.DirectionEnum[] } directions  
 * @property { CreateChargeTypeTranslationDto[] } translations  
 */
export const CreateChargeTypeRequestDTOSchema = z.object({ matchCode: z.string(), englishName: z.string().nullish(), archived: z.boolean().nullish(), description: z.string().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), directions: z.array(CommonModels.DirectionEnumSchema), translations: z.array(CreateChargeTypeTranslationDtoSchema).nullish() });
export type CreateChargeTypeRequestDTO = z.infer<typeof CreateChargeTypeRequestDTOSchema>;

/** 
 * UpdateChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { CommonModels.LanguageEnum } language  
 * @property { string } value  
 */
export const UpdateChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type UpdateChargeTypeTranslationDto = z.infer<typeof UpdateChargeTypeTranslationDtoSchema>;

/** 
 * UpdateChargeTypeRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { CommonModels.TransportModeEnum[] } modules  
 * @property { CommonModels.DirectionEnum[] } directions  
 * @property { UpdateChargeTypeTranslationDto[] } translations  
 */
export const UpdateChargeTypeRequestDTOSchema = z.object({ matchCode: z.string().nullable(), englishName: z.string().nullable(), archived: z.boolean().nullable(), description: z.string().nullable(), modules: z.array(CommonModels.TransportModeEnumSchema).nullable(), directions: z.array(CommonModels.DirectionEnumSchema).nullable(), translations: z.array(UpdateChargeTypeTranslationDtoSchema).nullable() }).partial();
export type UpdateChargeTypeRequestDTO = z.infer<typeof UpdateChargeTypeRequestDTOSchema>;

/** 
 * ChargeTypesFindAllOrderParamEnumSchema 
 * @type { enum }
 */
export const ChargeTypesFindAllOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy", "englishName"]);
export type ChargeTypesFindAllOrderParamEnum = z.infer<typeof ChargeTypesFindAllOrderParamEnumSchema>;
export const ChargeTypesFindAllOrderParamEnum = ChargeTypesFindAllOrderParamEnumSchema.enum;

/** 
 * ChargeTypesFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const ChargeTypesFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ChargeTypesFindAllResponse = z.infer<typeof ChargeTypesFindAllResponseSchema>;

/** 
 * ChargeTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ChargeTypesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy", "englishName"]);
export type ChargeTypesPaginateOrderParamEnum = z.infer<typeof ChargeTypesPaginateOrderParamEnumSchema>;
export const ChargeTypesPaginateOrderParamEnum = ChargeTypesPaginateOrderParamEnumSchema.enum;

/** 
 * ChargeTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChargeTypeResponseDTO[] } items  
 */
export const ChargeTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChargeTypeResponseDTOSchema).nullable() }).partial().shape });
export type ChargeTypesPaginateResponse = z.infer<typeof ChargeTypesPaginateResponseSchema>;

}
