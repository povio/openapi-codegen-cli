import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ContainerYardsModels {
/** 
 * ContainerYardEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ContainerYardEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ContainerYardEmployeeDTO = z.infer<typeof ContainerYardEmployeeDTOSchema>;

/** 
 * ContainerYardResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchCode Container yard match code 
 * @property { string } shortName Container yard short name 
 * @property { string } name Container yard name 
 * @property { boolean } archived Whether the container yard is archived 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { object } city  
 * @property { string } city.id  
 * @property { string } city.name  
 * @property { object } country  
 * @property { string } country.id  
 * @property { string } country.name  
 * @property { string } country.isoCode2  
 * @property { string } country.isoCode3  
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 * @property { string } createdById  
 * @property { ContainerYardEmployeeDTO } createdBy  
 * @property { string } createdAt Date when the container yard was created 
 * @property { string } updatedById  
 * @property { ContainerYardEmployeeDTO } updatedBy  
 * @property { string } updatedAt Date when the container yard was last updated 
 */
export const ContainerYardResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), shortName: z.string().nullish(), name: z.string(), archived: z.boolean(), street: z.string().nullish(), secondaryStreet: z.string().nullish(), zip: z.string().nullish(), city: z.object({ id: z.string(), name: z.string() }).nullish(), country: z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() }).nullish(), district: z.string().nullish(), additionalInformation: z.string().nullish(), createdById: z.string().nullish(), createdBy: ContainerYardEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ContainerYardEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ContainerYardResponseDTO = z.infer<typeof ContainerYardResponseDTOSchema>;

/** 
 * ContainerYardFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ContainerYardFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ContainerYardFilterDto = z.infer<typeof ContainerYardFilterDtoSchema>;

/** 
 * ContainerYardLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const ContainerYardLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type ContainerYardLabelFilterDto = z.infer<typeof ContainerYardLabelFilterDtoSchema>;

/** 
 * CreateContainerYardRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Match code 
 * @property { string } name Name 
 * @property { string } shortName Short name 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } cityId City ID 
 * @property { string } countryId Country ID 
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 */
export const CreateContainerYardRequestDTOSchema = z.object({ matchCode: z.string(), name: z.string(), shortName: z.string().nullish(), street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), cityId: z.string(), countryId: z.string(), district: z.string().nullish(), additionalInformation: z.string().nullish() });
export type CreateContainerYardRequestDTO = z.infer<typeof CreateContainerYardRequestDTOSchema>;

/** 
 * UpdateContainerYardRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Match code 
 * @property { string } name Name 
 * @property { string } shortName Short name 
 * @property { string } addressId Address ID 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } cityId City ID 
 * @property { string } countryId Country ID 
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 */
export const UpdateContainerYardRequestDTOSchema = z.object({ matchCode: z.string().nullable(), name: z.string().nullable(), shortName: z.string().nullable(), addressId: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), district: z.string().nullable(), additionalInformation: z.string().nullable() }).partial();
export type UpdateContainerYardRequestDTO = z.infer<typeof UpdateContainerYardRequestDTOSchema>;

/** 
 * ContainerYardsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ContainerYardsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ContainerYardsPaginateOrderParamEnum = z.infer<typeof ContainerYardsPaginateOrderParamEnumSchema>;
export const ContainerYardsPaginateOrderParamEnum = ContainerYardsPaginateOrderParamEnumSchema.enum;

/** 
 * ContainerYardsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ContainerYardResponseDTO[] } items  
 */
export const ContainerYardsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ContainerYardResponseDTOSchema).nullable() }).partial().shape });
export type ContainerYardsPaginateResponse = z.infer<typeof ContainerYardsPaginateResponseSchema>;

/** 
 * ContainerYardsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ContainerYardsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ContainerYardsPaginateLabelsOrderParamEnum = z.infer<typeof ContainerYardsPaginateLabelsOrderParamEnumSchema>;
export const ContainerYardsPaginateLabelsOrderParamEnum = ContainerYardsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * ContainerYardsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const ContainerYardsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ContainerYardsPaginateLabelsResponse = z.infer<typeof ContainerYardsPaginateLabelsResponseSchema>;

}
