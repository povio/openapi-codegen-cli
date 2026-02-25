import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace IntegrationChannelsModels {
  /**
   * IntegrationChannelBusinessPartnerResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const IntegrationChannelBusinessPartnerResponseDtoSchema = z
    .object({ id: z.string(), name: z.string() })
    .readonly();
  export type IntegrationChannelBusinessPartnerResponseDto = z.infer<
    typeof IntegrationChannelBusinessPartnerResponseDtoSchema
  >;

  /**
   * IntegrationChannelEmployeeResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const IntegrationChannelEmployeeResponseDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type IntegrationChannelEmployeeResponseDto = z.infer<typeof IntegrationChannelEmployeeResponseDtoSchema>;

  /**
   * IntegrationChannelResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } officeId
   * @property { string } businessPartnerId
   * @property { IntegrationChannelBusinessPartnerResponseDto } businessPartner
   * @property { string } employeeId
   * @property { string } name
   * @property { boolean } archived
   * @property { string } sftpHost
   * @property { number } sftpPort
   * @property { string } sftpUsername
   * @property { string } inboundPath
   * @property { string } outboundPath
   * @property { number } pollingFrequencyMinutes
   * @property { string } lastPolledAt
   * @property { string } createdAt
   * @property { string } createdById
   * @property { IntegrationChannelEmployeeResponseDto } createdBy
   * @property { string } updatedAt
   * @property { string } updatedById
   * @property { IntegrationChannelEmployeeResponseDto } updatedBy
   */
  export const IntegrationChannelResponseDtoSchema = z
    .object({
      id: z.string(),
      officeId: z.string(),
      businessPartnerId: z.string(),
      businessPartner: IntegrationChannelBusinessPartnerResponseDtoSchema,
      employeeId: z.string(),
      name: z.string(),
      archived: z.boolean(),
      sftpHost: z.string(),
      sftpPort: z.number(),
      sftpUsername: z.string(),
      inboundPath: z.string(),
      outboundPath: z.string(),
      pollingFrequencyMinutes: z.number(),
      lastPolledAt: z.iso.datetime({ offset: true }).nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      createdById: z.string(),
      createdBy: IntegrationChannelEmployeeResponseDtoSchema,
      updatedAt: z.iso.datetime({ offset: true }),
      updatedById: z.string(),
      updatedBy: IntegrationChannelEmployeeResponseDtoSchema,
    })
    .readonly();
  export type IntegrationChannelResponseDto = z.infer<typeof IntegrationChannelResponseDtoSchema>;

  /**
   * IntegrationMessageDirectionEnumSchema
   * @type { enum }
   */
  export const IntegrationMessageDirectionEnumSchema = z.enum(["Inbound", "Outbound"]);
  export type IntegrationMessageDirectionEnum = z.infer<typeof IntegrationMessageDirectionEnumSchema>;
  export const IntegrationMessageDirectionEnum = IntegrationMessageDirectionEnumSchema.enum;

  /**
   * IntegrationMessageFormatEnumSchema
   * @type { enum }
   */
  export const IntegrationMessageFormatEnumSchema = z.enum(["IFTMBF", "IFTMBC"]);
  export type IntegrationMessageFormatEnum = z.infer<typeof IntegrationMessageFormatEnumSchema>;
  export const IntegrationMessageFormatEnum = IntegrationMessageFormatEnumSchema.enum;

  /**
   * IntegrationMessageStatusEnumSchema
   * @type { enum }
   */
  export const IntegrationMessageStatusEnumSchema = z.enum(["Received", "Processed", "Failed", "Sent"]);
  export type IntegrationMessageStatusEnum = z.infer<typeof IntegrationMessageStatusEnumSchema>;
  export const IntegrationMessageStatusEnum = IntegrationMessageStatusEnumSchema.enum;

  /**
   * IntegrationMessageFilterDtoSchema
   * @type { object }
   * @property { IntegrationMessageDirectionEnum } direction
   * @property { IntegrationMessageFormatEnum } format
   * @property { IntegrationMessageStatusEnum } status
   * @property { string } search
   */
  export const IntegrationMessageFilterDtoSchema = z
    .object({
      direction: IntegrationMessageDirectionEnumSchema,
      format: IntegrationMessageFormatEnumSchema,
      status: IntegrationMessageStatusEnumSchema,
      search: z.string(),
    })
    .readonly();
  export type IntegrationMessageFilterDto = z.infer<typeof IntegrationMessageFilterDtoSchema>;

  /**
   * IntegrationChannelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const IntegrationChannelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type IntegrationChannelFilterDto = z.infer<typeof IntegrationChannelFilterDtoSchema>;

  /**
   * CreateIntegrationChannelRequestDtoSchema
   * @type { object }
   * @property { string } businessPartnerId
   * @property { string } employeeId
   * @property { string } name
   * @property { string } sftpHost
   * @property { number } sftpPort Minimum: `1`. Maximum: `65535`
   * @property { string } sftpUsername
   * @property { string } sftpPassword
   * @property { string } inboundPath
   * @property { string } outboundPath
   * @property { number } pollingFrequencyMinutes Minimum: `1`
   */
  export const CreateIntegrationChannelRequestDtoSchema = z
    .object({
      businessPartnerId: z.string(),
      employeeId: z.string(),
      name: z.string(),
      sftpHost: z.string(),
      sftpPort: z.number().gte(1).lte(65535),
      sftpUsername: z.string(),
      sftpPassword: z.string(),
      inboundPath: z.string(),
      outboundPath: z.string(),
      pollingFrequencyMinutes: z.number().gte(1),
    })
    .readonly();
  export type CreateIntegrationChannelRequestDto = z.infer<typeof CreateIntegrationChannelRequestDtoSchema>;

  /**
   * UpdateIntegrationChannelRequestDtoSchema
   * @type { object }
   * @property { string } businessPartnerId
   * @property { string } employeeId
   * @property { string } name
   * @property { string } sftpHost
   * @property { number } sftpPort Minimum: `1`. Maximum: `65535`
   * @property { string } sftpUsername
   * @property { string } sftpPassword
   * @property { string } inboundPath
   * @property { string } outboundPath
   * @property { number } pollingFrequencyMinutes Minimum: `1`
   */
  export const UpdateIntegrationChannelRequestDtoSchema = z
    .object({
      businessPartnerId: z.string(),
      employeeId: z.string(),
      name: z.string(),
      sftpHost: z.string(),
      sftpPort: z.number().gte(1).lte(65535),
      sftpUsername: z.string(),
      sftpPassword: z.string(),
      inboundPath: z.string(),
      outboundPath: z.string(),
      pollingFrequencyMinutes: z.number().gte(1),
    })
    .readonly();
  export type UpdateIntegrationChannelRequestDto = z.infer<typeof UpdateIntegrationChannelRequestDtoSchema>;

  /**
   * TestConnectionResponseDtoSchema
   * @type { object }
   * @property { boolean } success
   */
  export const TestConnectionResponseDtoSchema = z.object({ success: z.boolean() }).readonly();
  export type TestConnectionResponseDto = z.infer<typeof TestConnectionResponseDtoSchema>;

  /**
   * IntegrationMessageResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } integrationChannelId
   * @property { string } positionId
   * @property { string } positionNumber
   * @property { string } direction
   * @property { string } format
   * @property { string } status
   * @property { string } rawContent
   * @property { string } fileName
   * @property { string } errorMessage
   * @property { string } processedAt
   * @property { string } sentAt
   * @property { string } createdAt
   */
  export const IntegrationMessageResponseDtoSchema = z
    .object({
      id: z.string(),
      integrationChannelId: z.string(),
      positionId: z.string().nullish(),
      positionNumber: z.string().nullish(),
      direction: z.string(),
      format: z.string(),
      status: z.string(),
      rawContent: z.string(),
      fileName: z.string(),
      errorMessage: z.string().nullish(),
      processedAt: z.iso.datetime({ offset: true }).nullish(),
      sentAt: z.iso.datetime({ offset: true }).nullish(),
      createdAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type IntegrationMessageResponseDto = z.infer<typeof IntegrationMessageResponseDtoSchema>;

  /**
   * IntegrationChannelsListOrderParamEnumSchema
   * @type { enum }
   */
  export const IntegrationChannelsListOrderParamEnumSchema = z.enum([
    "createdAt",
    "name",
    "businessPartner",
    "lastPolledAt",
  ]);
  export type IntegrationChannelsListOrderParamEnum = z.infer<typeof IntegrationChannelsListOrderParamEnumSchema>;
  export const IntegrationChannelsListOrderParamEnum = IntegrationChannelsListOrderParamEnumSchema.enum;

  /**
   * IntegrationChannelsListResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { IntegrationChannelResponseDto[] } items
   */
  export const IntegrationChannelsListResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(IntegrationChannelResponseDtoSchema).readonly() }).readonly().shape,
  });
  export type IntegrationChannelsListResponse = z.infer<typeof IntegrationChannelsListResponseSchema>;

  /**
   * ListMessagesOrderParamEnumSchema
   * @type { enum }
   */
  export const ListMessagesOrderParamEnumSchema = z.enum(["createdAt", "status", "direction", "format"]);
  export type ListMessagesOrderParamEnum = z.infer<typeof ListMessagesOrderParamEnumSchema>;
  export const ListMessagesOrderParamEnum = ListMessagesOrderParamEnumSchema.enum;

  /**
   * ListMessagesResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { IntegrationMessageResponseDto[] } items
   */
  export const ListMessagesResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(IntegrationMessageResponseDtoSchema).readonly() }).readonly().shape,
  });
  export type ListMessagesResponse = z.infer<typeof ListMessagesResponseSchema>;
}
