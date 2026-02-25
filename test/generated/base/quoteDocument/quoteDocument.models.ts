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
export const QuoteDocumentDataDtoSchema = z.object({ routeTable: CommonModels.RouteTableBlockResponseDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockDtoSchema.nullable() }).partial();
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
export const QuoteDocumentConfigDtoSchema = z.object({ footerImageUrl: z.string().nullish(), headerImageUrl: z.string().nullish(), termsAndConditionsImageUrl: z.string().nullish(), showWatermarkOnDocuments: z.boolean(), locale: CommonModels.LocaleEnumSchema.nullish() });
export type QuoteDocumentConfigDto = z.infer<typeof QuoteDocumentConfigDtoSchema>;

/** 
 * CustomerDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } address  
 */
export const CustomerDtoSchema = z.object({ name: z.string(), address: z.string() });
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
export const ContactDtoSchema = z.object({ name: z.string(), email: z.string(), phone: z.string(), date: z.iso.datetime({ offset: true }), validFrom: z.iso.datetime({ offset: true }).nullish(), validUntil: z.iso.datetime({ offset: true }).nullish() });
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
export const QuoteDocumentResponseDtoSchema = z.object({ id: z.string(), quoteId: z.string(), quoteNumber: z.string(), quoteTransportMode: CommonModels.TransportModeEnumSchema, frequency: CommonModels.FrequencyEnumSchema.nullish(), transitDurationInDays: z.string().nullish(), customer: CustomerDtoSchema, contact: ContactDtoSchema, data: QuoteDocumentDataDtoSchema.nullish(), suspendCargoTable: z.boolean(), suspendFinanceTable: z.boolean(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), isIssued: z.boolean(), version: z.number(), config: QuoteDocumentConfigDtoSchema.nullish(), issuedAt: z.iso.datetime({ offset: true }).nullish() });
export type QuoteDocumentResponseDto = z.infer<typeof QuoteDocumentResponseDtoSchema>;

/** 
 * QuoteDocumentDataUpdateDtoSchema 
 * @type { object }
 * @property { CommonModels.RouteTableUpdateBlockDto } routeTable  
 * @property { CommonModels.CargoTableBlockUpdateDto } cargoTable  
 * @property { CommonModels.FinanceTableBlockUpdateDto } financeTable  
 */
export const QuoteDocumentDataUpdateDtoSchema = z.object({ routeTable: CommonModels.RouteTableUpdateBlockDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockUpdateDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockUpdateDtoSchema.nullable() }).partial();
export type QuoteDocumentDataUpdateDto = z.infer<typeof QuoteDocumentDataUpdateDtoSchema>;

/** 
 * CustomerUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } address  
 */
export const CustomerUpdateDtoSchema = z.object({ name: z.string().nullable(), address: z.string().nullable() }).partial();
export type CustomerUpdateDto = z.infer<typeof CustomerUpdateDtoSchema>;

/** 
 * ContactUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } email  
 * @property { string } phone  
 * @property { string } date  
 */
export const ContactUpdateDtoSchema = z.object({ name: z.string().nullable(), email: z.email().nullable(), phone: z.string().nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
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
export const UpdateQuoteDocumentRequestDtoSchema = z.object({ customer: CustomerUpdateDtoSchema.nullable(), contact: ContactUpdateDtoSchema.nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), suspendCargoTable: z.boolean().nullable(), suspendFinanceTable: z.boolean().nullable(), data: QuoteDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateQuoteDocumentRequestDto = z.infer<typeof UpdateQuoteDocumentRequestDtoSchema>;

/** 
 * GenerateQuoteDocumentPreviewRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 */
export const GenerateQuoteDocumentPreviewRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullable() }).partial();
export type GenerateQuoteDocumentPreviewRequestDto = z.infer<typeof GenerateQuoteDocumentPreviewRequestDtoSchema>;

/** 
 * GenerateQuoteDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 * @property { string } fileName  
 */
export const GenerateQuoteDocumentRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullish(), fileName: z.string() });
export type GenerateQuoteDocumentRequestDto = z.infer<typeof GenerateQuoteDocumentRequestDtoSchema>;

}
