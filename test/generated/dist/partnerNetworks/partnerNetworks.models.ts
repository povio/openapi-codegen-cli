import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PartnerNetworksModels {
  /**
   * PartnerNetworkEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const PartnerNetworkEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type PartnerNetworkEmployeeDTO = z.infer<typeof PartnerNetworkEmployeeDTOSchema>;

  /**
   * PartnerNetworkResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the partner network
   * @property { string } name Name of the partner network
   * @property { boolean } archived Whether the partner network is archived
   * @property { string } createdById
   * @property { PartnerNetworkEmployeeDTO } createdBy
   * @property { string } createdAt
   * @property { string } updatedById
   * @property { PartnerNetworkEmployeeDTO } updatedBy
   * @property { string } updatedAt
   */
  export const PartnerNetworkResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the partner network"),
      name: z.string().describe("Name of the partner network"),
      archived: z.boolean().describe("Whether the partner network is archived"),
      createdById: z.string().nullish(),
      createdBy: PartnerNetworkEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedById: z.string().nullish(),
      updatedBy: PartnerNetworkEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type PartnerNetworkResponseDTO = z.infer<typeof PartnerNetworkResponseDTOSchema>;

  /**
   * PartnerNetworkLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const PartnerNetworkLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type PartnerNetworkLabelFilterDto = z.infer<typeof PartnerNetworkLabelFilterDtoSchema>;

  /**
   * PartnerNetworkPaginationFilterDtoSchema
   * @type { object }
   * @property { string } search Free search
   * @property { boolean } archived
   */
  export const PartnerNetworkPaginationFilterDtoSchema = z
    .object({ search: z.string().describe("Free search"), archived: z.boolean() })
    .readonly();
  export type PartnerNetworkPaginationFilterDto = z.infer<typeof PartnerNetworkPaginationFilterDtoSchema>;

  /**
   * CreatePartnerNetworkRequestDTOSchema
   * @type { object }
   * @property { string } name Name of the partner network
   */
  export const CreatePartnerNetworkRequestDTOSchema = z
    .object({ name: z.string().describe("Name of the partner network") })
    .readonly();
  export type CreatePartnerNetworkRequestDTO = z.infer<typeof CreatePartnerNetworkRequestDTOSchema>;

  /**
   * UpdatePartnerNetworkRequestDTOSchema
   * @type { object }
   * @property { string } name Name of the partner network
   */
  export const UpdatePartnerNetworkRequestDTOSchema = z
    .object({ name: z.string().describe("Name of the partner network") })
    .readonly();
  export type UpdatePartnerNetworkRequestDTO = z.infer<typeof UpdatePartnerNetworkRequestDTOSchema>;

  /**
   * PartnerNetworksPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const PartnerNetworksPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type PartnerNetworksPaginateLabelsOrderParamEnum = z.infer<
    typeof PartnerNetworksPaginateLabelsOrderParamEnumSchema
  >;
  export const PartnerNetworksPaginateLabelsOrderParamEnum = PartnerNetworksPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * PartnerNetworksPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const PartnerNetworksPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PartnerNetworksPaginateLabelsResponse = z.infer<typeof PartnerNetworksPaginateLabelsResponseSchema>;

  /**
   * PartnerNetworksPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const PartnerNetworksPaginateOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type PartnerNetworksPaginateOrderParamEnum = z.infer<typeof PartnerNetworksPaginateOrderParamEnumSchema>;
  export const PartnerNetworksPaginateOrderParamEnum = PartnerNetworksPaginateOrderParamEnumSchema.enum;

  /**
   * PartnerNetworksPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { PartnerNetworkResponseDTO[] } items
   */
  export const PartnerNetworksPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(PartnerNetworkResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PartnerNetworksPaginateResponse = z.infer<typeof PartnerNetworksPaginateResponseSchema>;
}
