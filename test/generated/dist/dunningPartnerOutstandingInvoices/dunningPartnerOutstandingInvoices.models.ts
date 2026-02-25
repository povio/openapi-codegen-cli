import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningPartnerOutstandingInvoicesModels {
  /**
   * PartnerOutstandingInvoiceSummaryFilterDtoSchema
   * @type { object }
   * @property { string } search Search string (partner name)
   * @property { number } daysOverdueMin Minimum days overdue
   * @property { string } partnerId Partner ID
   * @property { number } outstandingAmountMin Minimum outstanding amount
   * @property { string } currency Currency
   * @property { string } dunningSystemId Dunning system ID
   * @property { CommonModels.DateRangeDto } lastDunningDate Last dunning date range
   */
  export const PartnerOutstandingInvoiceSummaryFilterDtoSchema = z
    .object({
      search: z.string().describe("Search string (partner name)"),
      daysOverdueMin: z.number().describe("Minimum days overdue"),
      partnerId: z.string().describe("Partner ID"),
      outstandingAmountMin: z.number().describe("Minimum outstanding amount"),
      currency: z.string().describe("Currency"),
      dunningSystemId: z.string().describe("Dunning system ID"),
      lastDunningDate: CommonModels.DateRangeDtoSchema.describe("Last dunning date range"),
    })
    .readonly();
  export type PartnerOutstandingInvoiceSummaryFilterDto = z.infer<
    typeof PartnerOutstandingInvoiceSummaryFilterDtoSchema
  >;

  /**
   * PartnerOutstandingInvoiceSummaryResponseDtoSchema
   * @type { object }
   * @property { string } partnerId Business partner ID
   * @property { string } partnerName Business partner name
   * @property { string } partnerCountry Business partner country
   * @property { string } dunningSystemId Dunning system ID
   * @property { string } dunningSystemName Dunning system name
   * @property { number } invoiceCount Number of outstanding invoices
   * @property { number } daysOverdue Maximum days overdue across all partner invoices
   * @property { number } outstandingAmount Total outstanding amount
   * @property { string } currencyNotation Currency of partner invoices
   * @property { string } lastDunningDate Date of the most recent issued dunning document
   */
  export const PartnerOutstandingInvoiceSummaryResponseDtoSchema = z
    .object({
      partnerId: z.string().describe("Business partner ID"),
      partnerName: z.string().describe("Business partner name"),
      partnerCountry: z.string().describe("Business partner country").nullish(),
      dunningSystemId: z.string().describe("Dunning system ID"),
      dunningSystemName: z.string().describe("Dunning system name"),
      invoiceCount: z.number().describe("Number of outstanding invoices"),
      daysOverdue: z.number().describe("Maximum days overdue across all partner invoices").nullish(),
      outstandingAmount: z.number().describe("Total outstanding amount"),
      currencyNotation: z.string().describe("Currency of partner invoices"),
      lastDunningDate: z.iso
        .datetime({ offset: true })
        .describe("Date of the most recent issued dunning document")
        .nullish(),
    })
    .readonly();
  export type PartnerOutstandingInvoiceSummaryResponseDto = z.infer<
    typeof PartnerOutstandingInvoiceSummaryResponseDtoSchema
  >;

  /**
   * PartnerOutstandingInvoiceResponseDtoSchema
   * @type { object }
   * @property { string } invoiceId Invoice ID
   * @property { string } invoiceNumber Invoice number
   * @property { string } invoiceDate Invoice date
   * @property { number } invoiceAmount Invoice amount
   * @property { number } owedAmount Owed amount
   * @property { string } currencyNotation Currency notation
   * @property { number } daysOverdue Days overdue
   * @property { string } dueDate Due date
   * @property { boolean } invoiceInReview
   * @property { boolean } dunningBlock
   */
  export const PartnerOutstandingInvoiceResponseDtoSchema = z
    .object({
      invoiceId: z.string().describe("Invoice ID"),
      invoiceNumber: z.string().describe("Invoice number").nullish(),
      invoiceDate: z.iso.datetime({ offset: true }).describe("Invoice date").nullish(),
      invoiceAmount: z.number().describe("Invoice amount"),
      owedAmount: z.number().describe("Owed amount"),
      currencyNotation: z.string().describe("Currency notation"),
      daysOverdue: z.number().describe("Days overdue").nullish(),
      dueDate: z.iso.datetime({ offset: true }).describe("Due date").nullish(),
      invoiceInReview: z.boolean().nullish(),
      dunningBlock: z.boolean().nullish(),
    })
    .readonly();
  export type PartnerOutstandingInvoiceResponseDto = z.infer<typeof PartnerOutstandingInvoiceResponseDtoSchema>;

  /**
   * PartnerOutstandingInvoiceFilterDtoSchema
   * @type { object }
   * @property { string } partnerId Partner ID to filter by
   * @property { string } currency Invoice currency notation to filter by
   */
  export const PartnerOutstandingInvoiceFilterDtoSchema = z
    .object({
      partnerId: z.string().describe("Partner ID to filter by"),
      currency: z.string().describe("Invoice currency notation to filter by"),
    })
    .readonly();
  export type PartnerOutstandingInvoiceFilterDto = z.infer<typeof PartnerOutstandingInvoiceFilterDtoSchema>;

  /**
   * RecommendedDunningLevelsRequestDtoSchema
   * @type { object }
   * @property { string[] } invoiceIds Invoice IDs used to calculate the recommended dunning level. Min Items: `1`. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const RecommendedDunningLevelsRequestDtoSchema = z
    .object({
      invoiceIds: z
        .array(z.string())
        .readonly()
        .min(1)
        .describe("Invoice IDs used to calculate the recommended dunning level"),
    })
    .readonly();
  export type RecommendedDunningLevelsRequestDto = z.infer<typeof RecommendedDunningLevelsRequestDtoSchema>;

  /**
   * RecommendedLabelResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } label
   * @property { boolean } isRecommended
   */
  export const RecommendedLabelResponseDtoSchema = z
    .object({ id: z.string(), label: z.string(), isRecommended: z.boolean() })
    .readonly();
  export type RecommendedLabelResponseDto = z.infer<typeof RecommendedLabelResponseDtoSchema>;

  /**
   * ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema
   * @type { enum }
   */
  export const ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema = z.enum([
    "outstandingAmount",
    "daysOverdue",
    "lastDunningDate",
    "invoiceCount",
    "partnerCountry",
    "partnerName",
    "dunningSystemName",
  ]);
  export type ListPartnerOutstandingInvoiceSummariesOrderParamEnum = z.infer<
    typeof ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema
  >;
  export const ListPartnerOutstandingInvoiceSummariesOrderParamEnum =
    ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema.enum;

  /**
   * ListPartnerOutstandingInvoiceSummariesResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { PartnerOutstandingInvoiceSummaryResponseDto[] } items
   */
  export const ListPartnerOutstandingInvoiceSummariesResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(PartnerOutstandingInvoiceSummaryResponseDtoSchema).readonly() }).readonly().shape,
  });
  export type ListPartnerOutstandingInvoiceSummariesResponse = z.infer<
    typeof ListPartnerOutstandingInvoiceSummariesResponseSchema
  >;

  /**
   * ListPartnerOutstandingInvoicesOrderParamEnumSchema
   * @type { enum }
   */
  export const ListPartnerOutstandingInvoicesOrderParamEnumSchema = z.enum(["dueDate", "invoiceDate", "owedAmount"]);
  export type ListPartnerOutstandingInvoicesOrderParamEnum = z.infer<
    typeof ListPartnerOutstandingInvoicesOrderParamEnumSchema
  >;
  export const ListPartnerOutstandingInvoicesOrderParamEnum = ListPartnerOutstandingInvoicesOrderParamEnumSchema.enum;

  /**
   * ListPartnerOutstandingInvoicesResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { PartnerOutstandingInvoiceResponseDto[] } items
   */
  export const ListPartnerOutstandingInvoicesResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(PartnerOutstandingInvoiceResponseDtoSchema).readonly() }).readonly().shape,
  });
  export type ListPartnerOutstandingInvoicesResponse = z.infer<typeof ListPartnerOutstandingInvoicesResponseSchema>;

  /**
   * ListRecommendedDunningLevelsResponseSchema
   * @type { array }
   */
  export const ListRecommendedDunningLevelsResponseSchema = z.array(RecommendedLabelResponseDtoSchema).readonly();
  export type ListRecommendedDunningLevelsResponse = z.infer<typeof ListRecommendedDunningLevelsResponseSchema>;
}
