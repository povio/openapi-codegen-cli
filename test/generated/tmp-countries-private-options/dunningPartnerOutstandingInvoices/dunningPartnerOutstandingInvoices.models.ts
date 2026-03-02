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
export const PartnerOutstandingInvoiceSummaryFilterDtoSchema = z.object({ search: z.string().nullable(), daysOverdueMin: z.number().nullable(), partnerId: z.string().nullable(), outstandingAmountMin: z.number().nullable(), currency: z.string().nullable(), dunningSystemId: z.string().nullable(), lastDunningDate: CommonModels.DateRangeDtoSchema.nullable() }).partial();
export type PartnerOutstandingInvoiceSummaryFilterDto = z.infer<typeof PartnerOutstandingInvoiceSummaryFilterDtoSchema>;

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
export const PartnerOutstandingInvoiceSummaryResponseDtoSchema = z.object({ partnerId: z.string(), partnerName: z.string(), partnerCountry: z.string().nullish(), dunningSystemId: z.string(), dunningSystemName: z.string(), invoiceCount: z.number(), daysOverdue: z.number().nullish(), outstandingAmount: z.number(), currencyNotation: z.string(), lastDunningDate: z.iso.datetime({ offset: true }).nullish() });
export type PartnerOutstandingInvoiceSummaryResponseDto = z.infer<typeof PartnerOutstandingInvoiceSummaryResponseDtoSchema>;

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
export const PartnerOutstandingInvoiceResponseDtoSchema = z.object({ invoiceId: z.string(), invoiceNumber: z.string().nullish(), invoiceDate: z.iso.datetime({ offset: true }).nullish(), invoiceAmount: z.number(), owedAmount: z.number(), currencyNotation: z.string(), daysOverdue: z.number().nullish(), dueDate: z.iso.datetime({ offset: true }).nullish(), invoiceInReview: z.boolean().nullish(), dunningBlock: z.boolean().nullish() });
export type PartnerOutstandingInvoiceResponseDto = z.infer<typeof PartnerOutstandingInvoiceResponseDtoSchema>;

/** 
 * PartnerOutstandingInvoiceFilterDtoSchema 
 * @type { object }
 * @property { string } partnerId Partner ID to filter by 
 * @property { string } currency Invoice currency notation to filter by 
 */
export const PartnerOutstandingInvoiceFilterDtoSchema = z.object({ partnerId: z.string().nullable(), currency: z.string().nullable() }).partial();
export type PartnerOutstandingInvoiceFilterDto = z.infer<typeof PartnerOutstandingInvoiceFilterDtoSchema>;

/** 
 * RecommendedDunningLevelsRequestDtoSchema 
 * @type { object }
 * @property { string[] } invoiceIds Invoice IDs used to calculate the recommended dunning level. Min Items: `1`. Example: `123e4567-e89b-12d3-a456-426614174000` 
 */
export const RecommendedDunningLevelsRequestDtoSchema = z.object({ invoiceIds: z.array(z.string()).min(1) });
export type RecommendedDunningLevelsRequestDto = z.infer<typeof RecommendedDunningLevelsRequestDtoSchema>;

/** 
 * RecommendedLabelResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { boolean } isRecommended  
 */
export const RecommendedLabelResponseDtoSchema = z.object({ id: z.string(), label: z.string(), isRecommended: z.boolean() });
export type RecommendedLabelResponseDto = z.infer<typeof RecommendedLabelResponseDtoSchema>;

/** 
 * ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema 
 * @type { enum }
 */
export const ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema = z.enum(["outstandingAmount", "daysOverdue", "lastDunningDate", "invoiceCount", "partnerCountry", "partnerName", "dunningSystemName"]);
export type ListPartnerOutstandingInvoiceSummariesOrderParamEnum = z.infer<typeof ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema>;
export const ListPartnerOutstandingInvoiceSummariesOrderParamEnum = ListPartnerOutstandingInvoiceSummariesOrderParamEnumSchema.enum;

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
export const ListPartnerOutstandingInvoiceSummariesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PartnerOutstandingInvoiceSummaryResponseDtoSchema).nullable() }).partial().shape });
export type ListPartnerOutstandingInvoiceSummariesResponse = z.infer<typeof ListPartnerOutstandingInvoiceSummariesResponseSchema>;

/** 
 * ListPartnerOutstandingInvoicesOrderParamEnumSchema 
 * @type { enum }
 */
export const ListPartnerOutstandingInvoicesOrderParamEnumSchema = z.enum(["dueDate", "invoiceDate", "owedAmount"]);
export type ListPartnerOutstandingInvoicesOrderParamEnum = z.infer<typeof ListPartnerOutstandingInvoicesOrderParamEnumSchema>;
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
export const ListPartnerOutstandingInvoicesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PartnerOutstandingInvoiceResponseDtoSchema).nullable() }).partial().shape });
export type ListPartnerOutstandingInvoicesResponse = z.infer<typeof ListPartnerOutstandingInvoicesResponseSchema>;

/** 
 * ListRecommendedDunningLevelsResponseSchema 
 * @type { array }
 */
export const ListRecommendedDunningLevelsResponseSchema = z.array(RecommendedLabelResponseDtoSchema);
export type ListRecommendedDunningLevelsResponse = z.infer<typeof ListRecommendedDunningLevelsResponseSchema>;

}
