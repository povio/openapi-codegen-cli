import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WarehousesModels {
  /**
   * WarehouseCityDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const WarehouseCityDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type WarehouseCityDto = z.infer<typeof WarehouseCityDtoSchema>;

  /**
   * WarehouseCountryDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } isoCode2
   * @property { string } isoCode3
   */
  export const WarehouseCountryDtoSchema = z
    .object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() })
    .readonly();
  export type WarehouseCountryDto = z.infer<typeof WarehouseCountryDtoSchema>;

  /**
   * WarehouseEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const WarehouseEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type WarehouseEmployeeDTO = z.infer<typeof WarehouseEmployeeDTOSchema>;

  /**
   * WarehouseResponseDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } shortName
   * @property { string } additionalInformation
   * @property { string } matchCode
   * @property { string } street
   * @property { string } secondaryStreet
   * @property { string } zip
   * @property { WarehouseCityDto } city
   * @property { WarehouseCountryDto } country
   * @property { string } district
   * @property { boolean } archived
   * @property { string } createdById
   * @property { WarehouseEmployeeDTO } createdBy
   * @property { string } createdAt
   * @property { string } updatedById
   * @property { WarehouseEmployeeDTO } updatedBy
   * @property { string } updatedAt
   */
  export const WarehouseResponseDTOSchema = z
    .object({
      id: z.string(),
      name: z.string().nullish(),
      shortName: z.string().nullish(),
      additionalInformation: z.string().nullish(),
      matchCode: z.string(),
      street: z.string().nullish(),
      secondaryStreet: z.string().nullish(),
      zip: z.string().nullish(),
      city: WarehouseCityDtoSchema.nullish(),
      country: WarehouseCountryDtoSchema.nullish(),
      district: z.string().nullish(),
      archived: z.boolean(),
      createdById: z.string().nullish(),
      createdBy: WarehouseEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedById: z.string().nullish(),
      updatedBy: WarehouseEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type WarehouseResponseDTO = z.infer<typeof WarehouseResponseDTOSchema>;

  /**
   * CreateWarehouseRequestDTOSchema
   * @type { object }
   * @property { string } name
   * @property { string } shortName
   * @property { string } additionalInformation
   * @property { string } matchCode
   * @property { string } street
   * @property { string } secondaryStreet
   * @property { string } zip
   * @property { string } cityId
   * @property { string } countryId
   * @property { string } district
   */
  export const CreateWarehouseRequestDTOSchema = z
    .object({
      name: z.string().nullish(),
      shortName: z.string().nullish(),
      additionalInformation: z.string().nullish(),
      matchCode: z.string(),
      street: z.string().nullish(),
      secondaryStreet: z.string().nullish(),
      zip: z.string().nullish(),
      cityId: z.string().nullish(),
      countryId: z.string().nullish(),
      district: z.string().nullish(),
    })
    .readonly();
  export type CreateWarehouseRequestDTO = z.infer<typeof CreateWarehouseRequestDTOSchema>;

  /**
   * WarehouseLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const WarehouseLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type WarehouseLabelFilterDto = z.infer<typeof WarehouseLabelFilterDtoSchema>;

  /**
   * WarehouseFilterDtoSchema
   * @type { object }
   * @property { string } search
   * @property { boolean } archived Filter by archived status
   */
  export const WarehouseFilterDtoSchema = z
    .object({ search: z.string(), archived: z.boolean().describe("Filter by archived status") })
    .readonly();
  export type WarehouseFilterDto = z.infer<typeof WarehouseFilterDtoSchema>;

  /**
   * UpdateWarehouseRequestDTOSchema
   * @type { object }
   * @property { string } name
   * @property { string } shortName
   * @property { string } additionalInformation
   * @property { string } matchCode
   * @property { string } street
   * @property { string } secondaryStreet
   * @property { string } zip
   * @property { string } cityId
   * @property { string } countryId
   * @property { string } district
   */
  export const UpdateWarehouseRequestDTOSchema = z
    .object({
      name: z.string(),
      shortName: z.string(),
      additionalInformation: z.string(),
      matchCode: z.string(),
      street: z.string(),
      secondaryStreet: z.string(),
      zip: z.string(),
      cityId: z.string(),
      countryId: z.string(),
      district: z.string(),
    })
    .readonly();
  export type UpdateWarehouseRequestDTO = z.infer<typeof UpdateWarehouseRequestDTOSchema>;

  /**
   * WarehousesPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const WarehousesPaginateOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type WarehousesPaginateOrderParamEnum = z.infer<typeof WarehousesPaginateOrderParamEnumSchema>;
  export const WarehousesPaginateOrderParamEnum = WarehousesPaginateOrderParamEnumSchema.enum;

  /**
   * WarehousesPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { WarehouseResponseDTO[] } items
   */
  export const WarehousesPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(WarehouseResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type WarehousesPaginateResponse = z.infer<typeof WarehousesPaginateResponseSchema>;

  /**
   * WarehousesPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const WarehousesPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type WarehousesPaginateLabelsOrderParamEnum = z.infer<typeof WarehousesPaginateLabelsOrderParamEnumSchema>;
  export const WarehousesPaginateLabelsOrderParamEnum = WarehousesPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * WarehousesPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const WarehousesPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type WarehousesPaginateLabelsResponse = z.infer<typeof WarehousesPaginateLabelsResponseSchema>;
}
