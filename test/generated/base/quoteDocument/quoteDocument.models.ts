import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteDocumentModels {
  /**
   * QuoteDocumentDataDtoSchema
   * @type { object }
   * @property { CommonModels.RouteTableBlockResponseDto } routeTable
   * @property { CommonModels.CargoTableBlockDto } cargoTable
   * @property { CommonModels.FinanceTableBlockDto } financeTable
   */
  export const QuoteDocumentDataDtoSchema = z
    .object({
      routeTable: CommonModels.RouteTableBlockResponseDtoSchema,
      cargoTable: CommonModels.CargoTableBlockDtoSchema,
      financeTable: CommonModels.FinanceTableBlockDtoSchema,
    })
    .readonly();
  export type QuoteDocumentDataDto = z.infer<typeof QuoteDocumentDataDtoSchema>;

  /**
   * QuoteDocumentConfigDtoSchema
   * @type { object }
   * @property { string } footerImageUrl
   * @property { string } headerImageUrl
   * @property { string } termsAndConditionsImageUrl
   * @property { boolean } showWatermarkOnDocuments
   * @property { CommonModels.LocaleEnum } locale
   */
  export const QuoteDocumentConfigDtoSchema = z
    .object({
      footerImageUrl: z.string().nullish(),
      headerImageUrl: z.string().nullish(),
      termsAndConditionsImageUrl: z.string().nullish(),
      showWatermarkOnDocuments: z.boolean(),
      locale: CommonModels.LocaleEnumSchema.nullish(),
    })
    .readonly();
  export type QuoteDocumentConfigDto = z.infer<typeof QuoteDocumentConfigDtoSchema>;

  /**
   * CustomerDtoSchema
   * @type { object }
   * @property { string } name
   * @property { string } address
   */
  export const CustomerDtoSchema = z.object({ name: z.string(), address: z.string() }).readonly();
  export type CustomerDto = z.infer<typeof CustomerDtoSchema>;

  /**
   * ContactDtoSchema
   * @type { object }
   * @property { string } name
   * @property { string } email
   * @property { string } phone
   * @property { string } date
   * @property { string } validFrom
   * @property { string } validUntil
   */
  export const ContactDtoSchema = z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      date: z.iso.datetime({ offset: true }),
      validFrom: z.iso.datetime({ offset: true }).nullish(),
      validUntil: z.iso.datetime({ offset: true }).nullish(),
    })
    .readonly();
  export type ContactDto = z.infer<typeof ContactDtoSchema>;

  /**
   * QuoteDocumentResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } quoteId
   * @property { string } quoteNumber
   * @property { CommonModels.TransportModeEnum } quoteTransportMode Mode of transport
   * @property { CommonModels.FrequencyEnum } frequency Frequency of the quote
   * @property { string } transitDurationInDays Transit duration in days
   * @property { CustomerDto } customer
   * @property { ContactDto } contact
   * @property { QuoteDocumentDataDto } data
   * @property { boolean } suspendCargoTable
   * @property { boolean } suspendFinanceTable
   * @property { CommonModels.EditorContentResponseDto } bodyRemarks
   * @property { CommonModels.EditorContentResponseDto } footerRemarks
   * @property { boolean } isIssued
   * @property { number } version
   * @property { QuoteDocumentConfigDto } config
   * @property { string } issuedAt
   */
  export const QuoteDocumentResponseDtoSchema = z
    .object({
      id: z.string(),
      quoteId: z.string(),
      quoteNumber: z.string(),
      quoteTransportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport"),
      frequency: CommonModels.FrequencyEnumSchema.describe("Frequency of the quote").nullish(),
      transitDurationInDays: z.string().describe("Transit duration in days").nullish(),
      customer: CustomerDtoSchema,
      contact: ContactDtoSchema,
      data: QuoteDocumentDataDtoSchema.nullish(),
      suspendCargoTable: z.boolean(),
      suspendFinanceTable: z.boolean(),
      bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(),
      footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(),
      isIssued: z.boolean(),
      version: z.number(),
      config: QuoteDocumentConfigDtoSchema.nullish(),
      issuedAt: z.iso.datetime({ offset: true }).nullish(),
    })
    .readonly();
  export type QuoteDocumentResponseDto = z.infer<typeof QuoteDocumentResponseDtoSchema>;

  /**
   * QuoteDocumentDataUpdateDtoSchema
   * @type { object }
   * @property { CommonModels.RouteTableUpdateBlockDto } routeTable
   * @property { CommonModels.CargoTableBlockUpdateDto } cargoTable
   * @property { CommonModels.FinanceTableBlockUpdateDto } financeTable
   */
  export const QuoteDocumentDataUpdateDtoSchema = z
    .object({
      routeTable: CommonModels.RouteTableUpdateBlockDtoSchema,
      cargoTable: CommonModels.CargoTableBlockUpdateDtoSchema,
      financeTable: CommonModels.FinanceTableBlockUpdateDtoSchema,
    })
    .readonly();
  export type QuoteDocumentDataUpdateDto = z.infer<typeof QuoteDocumentDataUpdateDtoSchema>;

  /**
   * CustomerUpdateDtoSchema
   * @type { object }
   * @property { string } name
   * @property { string } address
   */
  export const CustomerUpdateDtoSchema = z.object({ name: z.string(), address: z.string() }).readonly();
  export type CustomerUpdateDto = z.infer<typeof CustomerUpdateDtoSchema>;

  /**
   * ContactUpdateDtoSchema
   * @type { object }
   * @property { string } name
   * @property { string } email
   * @property { string } phone
   * @property { string } date
   */
  export const ContactUpdateDtoSchema = z
    .object({ name: z.string(), email: z.email(), phone: z.string(), date: z.iso.datetime({ offset: true }) })
    .readonly();
  export type ContactUpdateDto = z.infer<typeof ContactUpdateDtoSchema>;

  /**
   * UpdateQuoteDocumentRequestDtoSchema
   * @type { object }
   * @property { CustomerUpdateDto } customer
   * @property { ContactUpdateDto } contact
   * @property { CommonModels.EditorContentUpdateDto } bodyRemarks
   * @property { CommonModels.EditorContentUpdateDto } footerRemarks
   * @property { boolean } suspendCargoTable
   * @property { boolean } suspendFinanceTable
   * @property { QuoteDocumentDataUpdateDto } data
   */
  export const UpdateQuoteDocumentRequestDtoSchema = z
    .object({
      customer: CustomerUpdateDtoSchema,
      contact: ContactUpdateDtoSchema,
      bodyRemarks: CommonModels.EditorContentUpdateDtoSchema,
      footerRemarks: CommonModels.EditorContentUpdateDtoSchema,
      suspendCargoTable: z.boolean(),
      suspendFinanceTable: z.boolean(),
      data: QuoteDocumentDataUpdateDtoSchema,
    })
    .readonly();
  export type UpdateQuoteDocumentRequestDto = z.infer<typeof UpdateQuoteDocumentRequestDtoSchema>;

  /**
   * GenerateQuoteDocumentPreviewRequestDtoSchema
   * @type { object }
   * @property { string } issuedAt
   */
  export const GenerateQuoteDocumentPreviewRequestDtoSchema = z
    .object({ issuedAt: z.iso.datetime({ offset: true }) })
    .readonly();
  export type GenerateQuoteDocumentPreviewRequestDto = z.infer<typeof GenerateQuoteDocumentPreviewRequestDtoSchema>;

  /**
   * GenerateQuoteDocumentRequestDtoSchema
   * @type { object }
   * @property { string } issuedAt
   * @property { string } fileName
   */
  export const GenerateQuoteDocumentRequestDtoSchema = z
    .object({ issuedAt: z.iso.datetime({ offset: true }).nullish(), fileName: z.string() })
    .readonly();
  export type GenerateQuoteDocumentRequestDto = z.infer<typeof GenerateQuoteDocumentRequestDtoSchema>;
}
