import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace TerminalsModels {
  /**
   * TerminalTypeSchema
   * @type { enum }
   */
  export const TerminalTypeSchema = z.enum(["port", "airport"]);
  export type TerminalType = z.infer<typeof TerminalTypeSchema>;
  export const TerminalType = TerminalTypeSchema.enum;

  /**
   * CreateTerminalRequestDTOSchema
   * @type { object }
   * @property { string } matchCode Unique identifier code for the terminal
   * @property { string } shortName Optional short name for the terminal
   * @property { string } name Full name of the terminal
   * @property { TerminalType } type Type of the terminal
   * @property { string } portId ID of associated port, required if type is port
   * @property { string } airportId ID of associated airport, required if type is airport
   * @property { string } street Street address
   * @property { string } secondaryStreet Secondary street
   * @property { string } zip ZIP / Postal code
   * @property { string } district District
   * @property { string } cityId City id
   * @property { string } countryId Country id
   * @property { string } additionalInformation Additional information
   */
  export const CreateTerminalRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Unique identifier code for the terminal"),
      shortName: z.string().describe("Optional short name for the terminal").nullish(),
      name: z.string().describe("Full name of the terminal"),
      type: TerminalTypeSchema.describe("Type of the terminal"),
      portId: z.string().describe("ID of associated port, required if type is port").nullish(),
      airportId: z.string().describe("ID of associated airport, required if type is airport").nullish(),
      street: z.string().describe("Street address"),
      secondaryStreet: z.string().describe("Secondary street").nullish(),
      zip: z.string().describe("ZIP / Postal code"),
      district: z.string().describe("District").nullish(),
      cityId: z.string().describe("City id"),
      countryId: z.string().describe("Country id"),
      additionalInformation: z.string().describe("Additional information").nullish(),
    })
    .readonly();
  export type CreateTerminalRequestDTO = z.infer<typeof CreateTerminalRequestDTOSchema>;

  /**
   * TerminalCityDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const TerminalCityDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type TerminalCityDto = z.infer<typeof TerminalCityDtoSchema>;

  /**
   * TerminalCountryDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } isoCode2
   * @property { string } isoCode3
   */
  export const TerminalCountryDtoSchema = z
    .object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() })
    .readonly();
  export type TerminalCountryDto = z.infer<typeof TerminalCountryDtoSchema>;

  /**
   * TerminalAddressDTOSchema
   * @type { object }
   * @property { string } street Street address
   * @property { string } secondaryStreet Secondary street
   * @property { string } zip ZIP/Postal code
   * @property { TerminalCityDto } city
   * @property { string } district District name
   * @property { TerminalCountryDto } country
   */
  export const TerminalAddressDTOSchema = z
    .object({
      street: z.string().describe("Street address"),
      secondaryStreet: z.string().describe("Secondary street").nullish(),
      zip: z.string().describe("ZIP/Postal code"),
      city: TerminalCityDtoSchema.nullish(),
      district: z.string().describe("District name").nullish(),
      country: TerminalCountryDtoSchema.nullish(),
    })
    .readonly();
  export type TerminalAddressDTO = z.infer<typeof TerminalAddressDTOSchema>;

  /**
   * AirportReferenceDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the airport
   * @property { string } name Name of the airport
   */
  export const AirportReferenceDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the airport"),
      name: z.string().describe("Name of the airport"),
    })
    .readonly();
  export type AirportReferenceDTO = z.infer<typeof AirportReferenceDTOSchema>;

  /**
   * PortReferenceDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the port
   * @property { string } name Name of the port
   */
  export const PortReferenceDTOSchema = z
    .object({ id: z.string().describe("Unique identifier of the port"), name: z.string().describe("Name of the port") })
    .readonly();
  export type PortReferenceDTO = z.infer<typeof PortReferenceDTOSchema>;

  /**
   * TerminalEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const TerminalEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type TerminalEmployeeDTO = z.infer<typeof TerminalEmployeeDTOSchema>;

  /**
   * TerminalResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the terminal
   * @property { string } matchCode Match code for the terminal
   * @property { string } name Name of the terminal
   * @property { TerminalType } type Type of the terminal
   * @property { AirportReferenceDTO } airport Associated airport information if terminal type is airport
   * @property { PortReferenceDTO } port Associated port information if terminal type is port
   * @property { boolean } archived Archived status of the terminal
   * @property { string } shortName Short name of the terminal
   * @property { TerminalAddressDTO } address Address of the terminal
   * @property { string } additionalInformation Additional information
   * @property { string } createdById
   * @property { TerminalEmployeeDTO } createdBy
   * @property { string } createdAt
   * @property { string } updatedById
   * @property { TerminalEmployeeDTO } updatedBy
   * @property { string } updatedAt
   */
  export const TerminalResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the terminal"),
      matchCode: z.string().describe("Match code for the terminal"),
      name: z.string().describe("Name of the terminal"),
      type: TerminalTypeSchema.describe("Type of the terminal").nullish(),
      airport: AirportReferenceDTOSchema.describe(
        "Associated airport information if terminal type is airport",
      ).nullish(),
      port: PortReferenceDTOSchema.describe("Associated port information if terminal type is port").nullish(),
      archived: z.boolean().describe("Archived status of the terminal"),
      shortName: z.string().describe("Short name of the terminal").nullish(),
      address: TerminalAddressDTOSchema.describe("Address of the terminal").nullish(),
      additionalInformation: z.string().describe("Additional information").nullish(),
      createdById: z.string().nullish(),
      createdBy: TerminalEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedById: z.string().nullish(),
      updatedBy: TerminalEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type TerminalResponseDTO = z.infer<typeof TerminalResponseDTOSchema>;

  /**
   * UpdateTerminalRequestDTOSchema
   * @type { object }
   * @property { string } matchCode Updated match code for the terminal
   * @property { string } shortName Updated short name
   * @property { string } name Updated name
   * @property { TerminalType } type Type of the terminal
   * @property { string } portId ID of associated port, required if type is port
   * @property { string } airportId ID of associated airport, required if type is airport
   * @property { string } street Street address
   * @property { string } secondaryStreet Secondary street
   * @property { string } zip ZIP / Postal code
   * @property { string } district District
   * @property { string } cityId City id
   * @property { string } countryId Country id
   * @property { string } additionalInformation Additional information
   */
  export const UpdateTerminalRequestDTOSchema = z
    .object({
      matchCode: z.string().describe("Updated match code for the terminal"),
      shortName: z.string().describe("Updated short name"),
      name: z.string().describe("Updated name"),
      type: TerminalTypeSchema.describe("Type of the terminal"),
      portId: z.string().describe("ID of associated port, required if type is port"),
      airportId: z.string().describe("ID of associated airport, required if type is airport"),
      street: z.string().describe("Street address"),
      secondaryStreet: z.string().describe("Secondary street"),
      zip: z.string().describe("ZIP / Postal code"),
      district: z.string().describe("District"),
      cityId: z.string().describe("City id"),
      countryId: z.string().describe("Country id"),
      additionalInformation: z.string().describe("Additional information"),
    })
    .readonly();
  export type UpdateTerminalRequestDTO = z.infer<typeof UpdateTerminalRequestDTOSchema>;

  /**
   * TerminalPaginationFilterDtoSchema
   * @type { object }
   * @property { string } search Search term to filter terminals by matchCode, shortName, or name
   * @property { boolean } archived
   * @property { string } type
   */
  export const TerminalPaginationFilterDtoSchema = z
    .object({
      search: z.string().describe("Search term to filter terminals by matchCode, shortName, or name"),
      archived: z.boolean(),
      type: TerminalTypeSchema,
    })
    .readonly();
  export type TerminalPaginationFilterDto = z.infer<typeof TerminalPaginationFilterDtoSchema>;

  /**
   * TerminalLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const TerminalLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type TerminalLabelFilterDto = z.infer<typeof TerminalLabelFilterDtoSchema>;

  /**
   * TerminalsPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const TerminalsPaginateOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type TerminalsPaginateOrderParamEnum = z.infer<typeof TerminalsPaginateOrderParamEnumSchema>;
  export const TerminalsPaginateOrderParamEnum = TerminalsPaginateOrderParamEnumSchema.enum;

  /**
   * TerminalsPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { TerminalResponseDTO[] } items
   */
  export const TerminalsPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(TerminalResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type TerminalsPaginateResponse = z.infer<typeof TerminalsPaginateResponseSchema>;

  /**
   * TerminalsPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const TerminalsPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "matchCode",
    "shortName",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type TerminalsPaginateLabelsOrderParamEnum = z.infer<typeof TerminalsPaginateLabelsOrderParamEnumSchema>;
  export const TerminalsPaginateLabelsOrderParamEnum = TerminalsPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * TerminalsPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const TerminalsPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type TerminalsPaginateLabelsResponse = z.infer<typeof TerminalsPaginateLabelsResponseSchema>;
}
