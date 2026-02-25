import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DepotsModels {
  /**
   * DepotCityDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const DepotCityDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type DepotCityDto = z.infer<typeof DepotCityDtoSchema>;

  /**
   * DepotCountryDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } isoCode2
   * @property { string } isoCode3
   */
  export const DepotCountryDtoSchema = z
    .object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() })
    .readonly();
  export type DepotCountryDto = z.infer<typeof DepotCountryDtoSchema>;

  /**
   * AddressDTOSchema
   * @type { object }
   * @property { string } street Street address
   * @property { string } zip ZIP/Postal code
   * @property { DepotCityDto } city
   * @property { string } district District name
   * @property { DepotCountryDto } country
   */
  export const AddressDTOSchema = z
    .object({
      street: z.string().describe("Street address"),
      zip: z.string().describe("ZIP/Postal code"),
      city: DepotCityDtoSchema.nullish(),
      district: z.string().describe("District name").nullish(),
      country: DepotCountryDtoSchema.nullish(),
    })
    .readonly();
  export type AddressDTO = z.infer<typeof AddressDTOSchema>;

  /**
   * DepotEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const DepotEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type DepotEmployeeDTO = z.infer<typeof DepotEmployeeDTOSchema>;

  /**
   * DepotResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the depot
   * @property { string } matchCode Match code for the depot
   * @property { string } name Name of the depot
   * @property { string } shortName Short name of the depot
   * @property { string } additionalInformation Additional info of the depot
   * @property { AddressDTO } address Address details of the depot
   * @property { boolean } archived
   * @property { string } createdById
   * @property { DepotEmployeeDTO } createdBy
   * @property { string } createdAt
   * @property { string } updatedById
   * @property { DepotEmployeeDTO } updatedBy
   * @property { string } updatedAt
   */
  export const DepotResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the depot"),
      matchCode: z.string().describe("Match code for the depot"),
      name: z.string().describe("Name of the depot"),
      shortName: z.string().describe("Short name of the depot").nullish(),
      additionalInformation: z.string().describe("Additional info of the depot").nullish(),
      address: AddressDTOSchema.describe("Address details of the depot"),
      archived: z.boolean(),
      createdById: z.string().nullish(),
      createdBy: DepotEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedById: z.string().nullish(),
      updatedBy: DepotEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type DepotResponseDTO = z.infer<typeof DepotResponseDTOSchema>;

  /**
   * CreateDepotRequestDTOSchema
   * @type { object }
   * @property { string } matchCode Unique identifier code for the depot
   * @property { string } shortName Optional short name for the depot
   * @property { string } additionalInformation
   * @property { string } name Full name of the depot
   * @property { string } street Street address of the depot
   * @property { string } zip ZIP/Postal code
   * @property { string } district District information
   * @property { string } cityId City id
   * @property { string } countryId Country code
   */
  export const CreateDepotRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Unique identifier code for the depot"),
      shortName: z.string().describe("Optional short name for the depot").nullish(),
      additionalInformation: z.string().nullish(),
      name: z.string().describe("Full name of the depot"),
      street: z.string().describe("Street address of the depot"),
      zip: z.string().describe("ZIP/Postal code"),
      district: z.string().describe("District information").nullish(),
      cityId: z.string().describe("City id"),
      countryId: z.string().describe("Country code"),
    })
    .readonly();
  export type CreateDepotRequestDTO = z.infer<typeof CreateDepotRequestDTOSchema>;

  /**
   * DepotPaginationFilterDtoSchema
   * @type { object }
   * @property { string } search Search term to filter depots by name, matchCode, or shortName
   * @property { boolean } archived
   */
  export const DepotPaginationFilterDtoSchema = z
    .object({
      search: z.string().describe("Search term to filter depots by name, matchCode, or shortName"),
      archived: z.boolean(),
    })
    .readonly();
  export type DepotPaginationFilterDto = z.infer<typeof DepotPaginationFilterDtoSchema>;

  /**
   * DepotLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const DepotLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type DepotLabelFilterDto = z.infer<typeof DepotLabelFilterDtoSchema>;

  /**
   * UpdateDepotRequestDTOSchema
   * @type { object }
   * @property { string } matchCode Updated match code for the depot
   * @property { string } shortName Updated short name
   * @property { string } additionalInformation Updated short name
   * @property { string } name Updated full name
   * @property { string } street Updated street address
   * @property { string } zip Updated ZIP/Postal code
   * @property { string } district Updated district information
   * @property { string } cityId Updated city id
   * @property { string } countryId Updated country code
   */
  export const UpdateDepotRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Updated match code for the depot"),
      shortName: z.string().describe("Updated short name"),
      additionalInformation: z.string().describe("Updated short name"),
      name: z.string().describe("Updated full name"),
      street: z.string().describe("Updated street address"),
      zip: z.string().describe("Updated ZIP/Postal code"),
      district: z.string().describe("Updated district information"),
      cityId: z.string().describe("Updated city id"),
      countryId: z.string().describe("Updated country code"),
    })
    .readonly();
  export type UpdateDepotRequestDTO = z.infer<typeof UpdateDepotRequestDTOSchema>;

  /**
   * DepotsPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const DepotsPaginateOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type DepotsPaginateOrderParamEnum = z.infer<typeof DepotsPaginateOrderParamEnumSchema>;
  export const DepotsPaginateOrderParamEnum = DepotsPaginateOrderParamEnumSchema.enum;

  /**
   * DepotsPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { DepotResponseDTO[] } items
   */
  export const DepotsPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(DepotResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type DepotsPaginateResponse = z.infer<typeof DepotsPaginateResponseSchema>;

  /**
   * DepotsPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const DepotsPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type DepotsPaginateLabelsOrderParamEnum = z.infer<typeof DepotsPaginateLabelsOrderParamEnumSchema>;
  export const DepotsPaginateLabelsOrderParamEnum = DepotsPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * DepotsPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const DepotsPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type DepotsPaginateLabelsResponse = z.infer<typeof DepotsPaginateLabelsResponseSchema>;
}
