import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ContainerYardsModels {
  /**
   * ContainerYardEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const ContainerYardEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
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
  export const ContainerYardResponseDTOSchema = z
    .object({
      id: z.string(),
      matchCode: z.string().describe("Container yard match code"),
      shortName: z.string().describe("Container yard short name").nullish(),
      name: z.string().describe("Container yard name"),
      archived: z.boolean().describe("Whether the container yard is archived"),
      street: z.string().describe("Street address").nullish(),
      secondaryStreet: z.string().describe("Secondary street address").nullish(),
      zip: z.string().describe("ZIP/Postal code").nullish(),
      city: z.object({ id: z.string(), name: z.string() }).readonly().nullish(),
      country: z
        .object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() })
        .readonly()
        .nullish(),
      district: z.string().describe("District").nullish(),
      additionalInformation: z.string().describe("Additional information").nullish(),
      createdById: z.string().nullish(),
      createdBy: ContainerYardEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }).describe("Date when the container yard was created"),
      updatedById: z.string().nullish(),
      updatedBy: ContainerYardEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }).describe("Date when the container yard was last updated"),
    })
    .readonly();
  export type ContainerYardResponseDTO = z.infer<typeof ContainerYardResponseDTOSchema>;

  /**
   * ContainerYardFilterDtoSchema
   * @type { object }
   * @property { string } search
   * @property { boolean } archived
   */
  export const ContainerYardFilterDtoSchema = z.object({ search: z.string(), archived: z.boolean() }).readonly();
  export type ContainerYardFilterDto = z.infer<typeof ContainerYardFilterDtoSchema>;

  /**
   * ContainerYardLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const ContainerYardLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
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
  export const CreateContainerYardRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Match code"),
      name: z.string().describe("Name"),
      shortName: z.string().describe("Short name").nullish(),
      street: z.string().describe("Street address"),
      secondaryStreet: z.string().describe("Secondary street address").nullish(),
      zip: z.string().describe("ZIP/Postal code"),
      cityId: z.string().describe("City ID"),
      countryId: z.string().describe("Country ID"),
      district: z.string().describe("District").nullish(),
      additionalInformation: z.string().describe("Additional information").nullish(),
    })
    .readonly();
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
  export const UpdateContainerYardRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Match code"),
      name: z.string().describe("Name"),
      shortName: z.string().describe("Short name"),
      addressId: z.string().describe("Address ID"),
      street: z.string().describe("Street address"),
      secondaryStreet: z.string().describe("Secondary street address"),
      zip: z.string().describe("ZIP/Postal code"),
      cityId: z.string().describe("City ID"),
      countryId: z.string().describe("Country ID"),
      district: z.string().describe("District"),
      additionalInformation: z.string().describe("Additional information"),
    })
    .readonly();
  export type UpdateContainerYardRequestDTO = z.infer<typeof UpdateContainerYardRequestDTOSchema>;

  /**
   * ContainerYardsPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const ContainerYardsPaginateOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
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
  export const ContainerYardsPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(ContainerYardResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type ContainerYardsPaginateResponse = z.infer<typeof ContainerYardsPaginateResponseSchema>;

  /**
   * ContainerYardsPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const ContainerYardsPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type ContainerYardsPaginateLabelsOrderParamEnum = z.infer<
    typeof ContainerYardsPaginateLabelsOrderParamEnumSchema
  >;
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
  export const ContainerYardsPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type ContainerYardsPaginateLabelsResponse = z.infer<typeof ContainerYardsPaginateLabelsResponseSchema>;
}
