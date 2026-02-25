import { z } from "zod";

export namespace AirPositionsModels {
  /**
   * AirPositionCustomsStatusTypeEnumSchema
   * @type { enum }
   */
  export const AirPositionCustomsStatusTypeEnumSchema = z.enum(["Other", "X", "C", "TD", "T1"]);
  export type AirPositionCustomsStatusTypeEnum = z.infer<typeof AirPositionCustomsStatusTypeEnumSchema>;
  export const AirPositionCustomsStatusTypeEnum = AirPositionCustomsStatusTypeEnumSchema.enum;

  /**
   * AirPositionResponseDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } hawbNumber
   * @property { string } mawbNumber
   * @property { string } airlineDeadline
   * @property { string } customsStatus
   * @property { AirPositionCustomsStatusTypeEnum } customsStatusType
   * @property { boolean } hawbRequired
   * @property { boolean } mawbRequired
   * @property { string } mrnT1Number
   * @property { boolean } isCourier
   * @property { string } deliveryToConsignee
   * @property { string } createdAt
   * @property { string } updatedAt
   */
  export const AirPositionResponseDTOSchema = z
    .object({
      id: z.string(),
      hawbNumber: z.string().nullish(),
      mawbNumber: z.string().nullish(),
      airlineDeadline: z.iso.datetime({ offset: true }).nullish(),
      customsStatus: z.string().nullish(),
      customsStatusType: AirPositionCustomsStatusTypeEnumSchema.nullish(),
      hawbRequired: z.boolean(),
      mawbRequired: z.boolean(),
      mrnT1Number: z.string().nullish(),
      isCourier: z.boolean().nullish(),
      deliveryToConsignee: z.iso.datetime({ offset: true }).nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type AirPositionResponseDTO = z.infer<typeof AirPositionResponseDTOSchema>;

  /**
   * UpdateAirPositionRequestDTOSchema
   * @type { object }
   * @property { string } hawbNumber
   * @property { string } mawbNumber
   * @property { string } airlineDeadline
   * @property { string } customsStatus
   * @property { AirPositionCustomsStatusTypeEnum } customsStatusType
   * @property { string } mrnT1Number
   * @property { boolean } hawbRequired
   * @property { boolean } mawbRequired
   * @property { boolean } isCourier
   * @property { string } deliveryToConsignee
   */
  export const UpdateAirPositionRequestDTOSchema = z
    .object({
      hawbNumber: z.string(),
      mawbNumber: z.string(),
      airlineDeadline: z.iso.datetime({ offset: true }),
      customsStatus: z.string(),
      customsStatusType: AirPositionCustomsStatusTypeEnumSchema,
      mrnT1Number: z.string(),
      hawbRequired: z.boolean(),
      mawbRequired: z.boolean(),
      isCourier: z.boolean(),
      deliveryToConsignee: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type UpdateAirPositionRequestDTO = z.infer<typeof UpdateAirPositionRequestDTOSchema>;
}
