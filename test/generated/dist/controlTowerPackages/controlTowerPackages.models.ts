import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ControlTowerPackagesModels {
  /**
   * PackageListItemDtoSchema
   * @type { object }
   * @property { string } packageNumber
   * @property { string } bookingId
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
  export const PackageListItemDtoSchema = z
    .object({
      packageNumber: z.string(),
      bookingId: z.string(),
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
  export type PackageListItemDto = z.infer<typeof PackageListItemDtoSchema>;

  /**
   * PackageFilterDtoSchema
   * @type { object }
   * @property { string } search Min Length: `1`
   */
  export const PackageFilterDtoSchema = z.object({ search: z.string().min(1) }).readonly();
  export type PackageFilterDto = z.infer<typeof PackageFilterDtoSchema>;

  /**
   * ControlTowerPackagesFindAllOrderParamEnumSchema
   * @type { enum }
   */
  export const ControlTowerPackagesFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
  export type ControlTowerPackagesFindAllOrderParamEnum = z.infer<
    typeof ControlTowerPackagesFindAllOrderParamEnumSchema
  >;
  export const ControlTowerPackagesFindAllOrderParamEnum = ControlTowerPackagesFindAllOrderParamEnumSchema.enum;

  /**
   * ControlTowerPackagesFindAllResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { PackageListItemDto[] } items
   */
  export const ControlTowerPackagesFindAllResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(PackageListItemDtoSchema).readonly() }).readonly().shape,
  });
  export type ControlTowerPackagesFindAllResponse = z.infer<typeof ControlTowerPackagesFindAllResponseSchema>;
}
