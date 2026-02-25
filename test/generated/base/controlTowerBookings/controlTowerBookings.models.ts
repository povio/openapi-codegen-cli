import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ControlTowerBookingsModels {
  /**
   * BookingListItemDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } bookingNumber
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
  export const BookingListItemDtoSchema = z
    .object({
      id: z.string(),
      bookingNumber: z.string().nullable(),
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
  export type BookingListItemDto = z.infer<typeof BookingListItemDtoSchema>;

  /**
   * BookingContainerDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } containerNumber
   * @property { string } type
   * @property { string } loadType
   * @property { string } stuffedInContainer
   * @property { string[] } hsCode
   * @property { number } noS
   * @property { number } weight
   * @property { string } lastEventLocation
   * @property { string } lastEventName
   * @property { string } lastEventDate
   * @property { string } seals
   */
  export const BookingContainerDtoSchema = z
    .object({
      id: z.string(),
      containerNumber: z.string().nullable(),
      type: z.string().nullable(),
      loadType: z.string().nullable(),
      stuffedInContainer: z.iso.datetime({ offset: true }).nullable(),
      hsCode: z.array(z.string()).readonly().nullable(),
      noS: z.number().nullable(),
      weight: z.number().nullable(),
      lastEventLocation: z.string().nullable(),
      lastEventName: z.string().nullable(),
      lastEventDate: z.iso.datetime({ offset: true }).nullable(),
      seals: z.string().nullable(),
    })
    .readonly();
  export type BookingContainerDto = z.infer<typeof BookingContainerDtoSchema>;

  /**
   * BookingPackageDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } packageNumber
   * @property { string } containerNumber
   * @property { string } type
   * @property { string } description
   * @property { string } lastEvent
   * @property { string } lastEventLocation
   * @property { string } lastEventDate
   */
  export const BookingPackageDtoSchema = z
    .object({
      id: z.string(),
      packageNumber: z.string(),
      containerNumber: z.string().nullable(),
      type: z.string().nullable(),
      description: z.string().nullable(),
      lastEvent: z.string().nullable(),
      lastEventLocation: z.string().nullable(),
      lastEventDate: z.iso.datetime({ offset: true }).nullable(),
    })
    .readonly();
  export type BookingPackageDto = z.infer<typeof BookingPackageDtoSchema>;

  /**
   * BookingResponseDtoSchema
   * @type { object }
   * @property { string } bookingNumber
   * @property { string } ets
   * @property { string } etaPod
   * @property { string } etaFinalDeliveryPlace
   * @property { string } supplierName
   * @property { string } supplierAddress
   * @property { string } destination
   * @property { string } lastEvent
   * @property { string[] } files
   * @property { string } poNumber
   * @property { string } blNumber
   * @property { BookingContainerDto[] } containers
   * @property { BookingPackageDto[] } packages
   * @property { string } journeyFrom
   * @property { string } journeyTo
   * @property { CommonModels.VesselDto } vessel
   * @property { string } id
   */
  export const BookingResponseDtoSchema = z
    .object({
      bookingNumber: z.string().nullable(),
      ets: z.iso.datetime({ offset: true }).nullable(),
      etaPod: z.iso.datetime({ offset: true }).nullable(),
      etaFinalDeliveryPlace: z.iso.datetime({ offset: true }).nullable(),
      supplierName: z.string().nullable(),
      supplierAddress: z.string().nullable(),
      destination: z.string().nullable(),
      lastEvent: z.string().nullable(),
      files: z.array(z.string()).readonly().nullable(),
      poNumber: z.string().nullable(),
      blNumber: z.string().nullable(),
      containers: z.array(BookingContainerDtoSchema).readonly().nullish(),
      packages: z.array(BookingPackageDtoSchema).readonly().nullish(),
      journeyFrom: z.string().nullable(),
      journeyTo: z.string().nullable(),
      vessel: CommonModels.VesselDtoSchema.nullable(),
      id: z.string(),
    })
    .readonly();
  export type BookingResponseDto = z.infer<typeof BookingResponseDtoSchema>;

  /**
   * PackageResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } poNumber
   * @property { string } bookingNumber
   * @property { string } blNumber
   * @property { string } containerNumber
   * @property { string } packageNumber
   * @property { string } description
   * @property { number } netWeight
   * @property { number } grossWeight
   * @property { number } length
   * @property { number } width
   * @property { number } height
   * @property { number } volume
   * @property { string } storageInstruction
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
  export const PackageResponseDtoSchema = z
    .object({
      id: z.string(),
      poNumber: z.string().nullable(),
      bookingNumber: z.string().nullable(),
      blNumber: z.string().nullable(),
      containerNumber: z.string().nullable(),
      packageNumber: z.string().nullable(),
      description: z.string().nullable(),
      netWeight: z.number().nullable(),
      grossWeight: z.number().nullable(),
      length: z.number().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      volume: z.number().nullable(),
      storageInstruction: z.string().nullable(),
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
  export type PackageResponseDto = z.infer<typeof PackageResponseDtoSchema>;

  /**
   * BookingFilterDtoSchema
   * @type { object }
   * @property { string } projectId
   * @property { string } search Min Length: `1`
   * @property { string[] } companyIds
   * @property { string } purchaseOrderId
   */
  export const BookingFilterDtoSchema = z
    .object({
      projectId: z.string(),
      search: z.string().min(1),
      companyIds: z.array(z.string()).readonly(),
      purchaseOrderId: z.string(),
    })
    .readonly();
  export type BookingFilterDto = z.infer<typeof BookingFilterDtoSchema>;

  /**
   * ControlTowerBookingsFindAllOrderParamEnumSchema
   * @type { enum }
   */
  export const ControlTowerBookingsFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
  export type ControlTowerBookingsFindAllOrderParamEnum = z.infer<
    typeof ControlTowerBookingsFindAllOrderParamEnumSchema
  >;
  export const ControlTowerBookingsFindAllOrderParamEnum = ControlTowerBookingsFindAllOrderParamEnumSchema.enum;

  /**
   * ControlTowerBookingsFindAllResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { BookingListItemDto[] } items
   */
  export const ControlTowerBookingsFindAllResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(BookingListItemDtoSchema).readonly() }).readonly().shape,
  });
  export type ControlTowerBookingsFindAllResponse = z.infer<typeof ControlTowerBookingsFindAllResponseSchema>;
}
