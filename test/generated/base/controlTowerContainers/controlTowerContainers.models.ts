import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ControlTowerContainersModels {
  /**
   * ContainerListItemDtoSchema
   * @type { object }
   * @property { string } containerNumber
   * @property { string } id
   * @property { string } ets
   * @property { string } eta
   * @property { string } supplierName
   * @property { string } supplierAddress
   * @property { string } lastEvent
   * @property { string } lastEventLocation
   * @property { string } lastEventDate
   * @property { string } journeyFrom
   * @property { string } journeyTo
   * @property { CommonModels.VesselDto } vessel
   */
  export const ContainerListItemDtoSchema = z
    .object({
      containerNumber: z.string().nullable(),
      id: z.string(),
      ets: z.iso.datetime({ offset: true }).nullable(),
      eta: z.iso.datetime({ offset: true }).nullable(),
      supplierName: z.string().nullable(),
      supplierAddress: z.string().nullable(),
      lastEvent: z.string().nullable(),
      lastEventLocation: z.string().nullable(),
      lastEventDate: z.iso.datetime({ offset: true }).nullable(),
      journeyFrom: z.string().nullable(),
      journeyTo: z.string().nullable(),
      vessel: CommonModels.VesselDtoSchema.nullable(),
    })
    .readonly();
  export type ContainerListItemDto = z.infer<typeof ContainerListItemDtoSchema>;

  /**
   * ContainerEventDtoSchema
   * @type { object }
   * @property { CommonModels.VesselDto } vessel
   * @property { string } name
   * @property { string } date
   * @property { boolean } checkedIn
   */
  export const ContainerEventDtoSchema = z
    .object({
      vessel: CommonModels.VesselDtoSchema.nullable(),
      name: z.string(),
      date: z.iso.datetime({ offset: true }).nullable(),
      checkedIn: z.boolean(),
    })
    .readonly();
  export type ContainerEventDto = z.infer<typeof ContainerEventDtoSchema>;

  /**
   * ContainerJourneyDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } country
   * @property { string } terminal
   * @property { boolean } checkedIn
   * @property { ContainerEventDto[] } events
   */
  export const ContainerJourneyDtoSchema = z
    .object({
      id: z.string(),
      country: z.string().nullable(),
      terminal: z.string().nullable(),
      checkedIn: z.boolean(),
      events: z.array(ContainerEventDtoSchema).readonly(),
    })
    .readonly();
  export type ContainerJourneyDto = z.infer<typeof ContainerJourneyDtoSchema>;

  /**
   * PackageNumberDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } type
   * @property { string } description
   */
  export const PackageNumberDtoSchema = z
    .object({ id: z.string(), type: z.string().nullable(), description: z.string() })
    .readonly();
  export type PackageNumberDto = z.infer<typeof PackageNumberDtoSchema>;

  /**
   * ContainerResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } containerNumber
   * @property { string } poNumber
   * @property { string } bookingNumber
   * @property { string } blNumber
   * @property { string } stuffedInContainer
   * @property { string } containerType
   * @property { string } loadType
   * @property { string[] } hsCode
   * @property { number } totalVolume
   * @property { number } totalWeight
   * @property { string } cargoDescription
   * @property { number } noS
   * @property { ContainerJourneyDto[] } journeys
   * @property { PackageNumberDto[] } packages
   * @property { string } bookingId
   * @property { string } destination
   * @property { string[] } files
   * @property { string } ets
   * @property { string } eta
   * @property { string } supplierName
   * @property { string } supplierAddress
   * @property { string } lastEvent
   * @property { string } lastEventLocation
   * @property { string } lastEventDate
   * @property { string } journeyFrom
   * @property { string } journeyTo
   * @property { CommonModels.VesselDto } vessel
   */
  export const ContainerResponseDtoSchema = z
    .object({
      id: z.string(),
      containerNumber: z.string().nullable(),
      poNumber: z.string().nullable(),
      bookingNumber: z.string().nullable(),
      blNumber: z.string().nullable(),
      stuffedInContainer: z.iso.datetime({ offset: true }).nullable(),
      containerType: z.string().nullable(),
      loadType: z.string().nullable(),
      hsCode: z.array(z.string()).readonly().nullable(),
      totalVolume: z.number().nullable(),
      totalWeight: z.number().nullable(),
      cargoDescription: z.string().nullable(),
      noS: z.number().nullable(),
      journeys: z.array(ContainerJourneyDtoSchema).readonly().nullish(),
      packages: z.array(PackageNumberDtoSchema).readonly().nullish(),
      bookingId: z.string().nullable(),
      destination: z.string().nullable(),
      files: z.array(z.string()).readonly().nullable(),
      ets: z.iso.datetime({ offset: true }).nullable(),
      eta: z.iso.datetime({ offset: true }).nullable(),
      supplierName: z.string().nullable(),
      supplierAddress: z.string().nullable(),
      lastEvent: z.string().nullable(),
      lastEventLocation: z.string().nullable(),
      lastEventDate: z.iso.datetime({ offset: true }).nullable(),
      journeyFrom: z.string().nullable(),
      journeyTo: z.string().nullable(),
      vessel: CommonModels.VesselDtoSchema.nullable(),
    })
    .readonly();
  export type ContainerResponseDto = z.infer<typeof ContainerResponseDtoSchema>;

  /**
   * ContainerJourneyResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } number
   * @property { ContainerJourneyDto[] } journeys
   * @property { string[] } packageNumbers
   */
  export const ContainerJourneyResponseDtoSchema = z
    .object({
      id: z.string(),
      number: z.string(),
      journeys: z.array(ContainerJourneyDtoSchema).readonly(),
      packageNumbers: z.array(z.string()).readonly(),
    })
    .readonly();
  export type ContainerJourneyResponseDto = z.infer<typeof ContainerJourneyResponseDtoSchema>;

  /**
   * ContainerFilterDtoSchema
   * @type { object }
   * @property { number[] } companyIds
   * @property { string } search
   */
  export const ContainerFilterDtoSchema = z
    .object({ companyIds: z.array(z.number()).readonly(), search: z.string() })
    .readonly();
  export type ContainerFilterDto = z.infer<typeof ContainerFilterDtoSchema>;

  /**
   * ControlTowerContainersFindAllOrderParamEnumSchema
   * @type { enum }
   */
  export const ControlTowerContainersFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
  export type ControlTowerContainersFindAllOrderParamEnum = z.infer<
    typeof ControlTowerContainersFindAllOrderParamEnumSchema
  >;
  export const ControlTowerContainersFindAllOrderParamEnum = ControlTowerContainersFindAllOrderParamEnumSchema.enum;

  /**
   * ControlTowerContainersFindAllResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { ContainerListItemDto[] } items
   */
  export const ControlTowerContainersFindAllResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(ContainerListItemDtoSchema).readonly() }).readonly().shape,
  });
  export type ControlTowerContainersFindAllResponse = z.infer<typeof ControlTowerContainersFindAllResponseSchema>;
}
