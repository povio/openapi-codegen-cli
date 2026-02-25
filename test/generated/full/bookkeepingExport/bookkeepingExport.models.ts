import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace BookkeepingExportModels {
/** 
 * BookkeepingExportFormatEnumSchema 
 * @type { enum }
 */
export const BookkeepingExportFormatEnumSchema = z.enum(["Bmd", "BmdWithoutCost", "BmdHamburg", "Abra", "Pantheon"]);
export type BookkeepingExportFormatEnum = z.infer<typeof BookkeepingExportFormatEnumSchema>;
export const BookkeepingExportFormatEnum = BookkeepingExportFormatEnumSchema.enum;

/** 
 * CreateBookkeepingExportBatchRequestDtoSchema 
 * @type { object }
 * @property { BookkeepingExportFormatEnum } format  
 * @property { CommonModels.OfficeInvoiceFilterDto } invoiceFilters  
 */
export const CreateBookkeepingExportBatchRequestDtoSchema = z.object({ format: BookkeepingExportFormatEnumSchema.nullish(), invoiceFilters: CommonModels.OfficeInvoiceFilterDtoSchema }).readonly();
export type CreateBookkeepingExportBatchRequestDto = z.infer<typeof CreateBookkeepingExportBatchRequestDtoSchema>;

/** 
 * BookkeepingExportFileTypeEnumSchema 
 * @type { enum }
 */
export const BookkeepingExportFileTypeEnumSchema = z.enum(["Invoices", "BusinessPartners", "Report", "AbraAddressBook", "AbraIssuedInvoices", "AbraIssuedInvoiceItems", "AbraReceivedInvoices", "AbraReceivedInvoiceItems", "PantheonInvoicesOutgoingEur", "PantheonInvoicesOutgoingUsd", "PantheonInvoicesIncomingEur", "PantheonInvoicesIncomingUsd", "PantheonCostCenters"]);
export type BookkeepingExportFileTypeEnum = z.infer<typeof BookkeepingExportFileTypeEnumSchema>;
export const BookkeepingExportFileTypeEnum = BookkeepingExportFileTypeEnumSchema.enum;

/** 
 * BookkeepingExportFileDtoSchema 
 * @type { object }
 * @property { BookkeepingExportFileTypeEnum } variant  
 * @property { string } downloadUrl  
 * @property { string } fileName  
 */
export const BookkeepingExportFileDtoSchema = z.object({ variant: BookkeepingExportFileTypeEnumSchema, downloadUrl: z.string().nullable(), fileName: z.string() }).readonly();
export type BookkeepingExportFileDto = z.infer<typeof BookkeepingExportFileDtoSchema>;

/** 
 * BookkeepingExportBatchStatusEnumSchema 
 * @type { enum }
 */
export const BookkeepingExportBatchStatusEnumSchema = z.enum(["Initializing", "Preparing", "Exported", "Reverted", "Failed"]);
export type BookkeepingExportBatchStatusEnum = z.infer<typeof BookkeepingExportBatchStatusEnumSchema>;
export const BookkeepingExportBatchStatusEnum = BookkeepingExportBatchStatusEnumSchema.enum;

/** 
 * BookkeepingExportBatchSummaryDtoSchema 
 * @type { object }
 * @property { number } totalCount  
 * @property { number } needsReviewCount  
 * @property { number } readyForExportCount  
 * @property { number } excludedCount  
 * @property { object } invoiceNumberRange  
 * @property { string } invoiceNumberRange.from  
 * @property { string } invoiceNumberRange.to  
 * @property { object } dateRange  
 * @property { string } dateRange.from  
 * @property { string } dateRange.to  
 */
export const BookkeepingExportBatchSummaryDtoSchema = z.object({ totalCount: z.number(), needsReviewCount: z.number(), readyForExportCount: z.number(), excludedCount: z.number(), invoiceNumberRange: z.object({ from: z.string(), to: z.string() }).readonly().nullish(), dateRange: z.object({ from: z.iso.datetime({ offset: true }), to: z.iso.datetime({ offset: true }) }).readonly().nullish() }).readonly();
export type BookkeepingExportBatchSummaryDto = z.infer<typeof BookkeepingExportBatchSummaryDtoSchema>;

/** 
 * BookkeepingExportBatchDetailsDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { BookkeepingExportFormatEnum } format  
 * @property { BookkeepingExportBatchStatusEnum } status  
 * @property { number } totalInvoiceCount  
 * @property { number } exportedInvoiceCount  
 * @property { object } createdBy  
 * @property { string } createdBy.id  
 * @property { string } createdBy.fullName  
 * @property { string } createdBy.email  
 * @property { string } createdAt  
 * @property { string } exportedAt  
 * @property { string } revertedAt  
 * @property { object } revertedBy  
 * @property { string } revertedBy.id  
 * @property { string } revertedBy.fullName  
 * @property { string } revertedBy.email  
 * @property { BookkeepingExportBatchSummaryDto } summary  
 * @property { BookkeepingExportFileDto[] } files  
 */
export const BookkeepingExportBatchDetailsDtoSchema = z.object({ id: z.string(), format: BookkeepingExportFormatEnumSchema, status: BookkeepingExportBatchStatusEnumSchema, totalInvoiceCount: z.number(), exportedInvoiceCount: z.number(), createdBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }).readonly(), createdAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish(), revertedAt: z.iso.datetime({ offset: true }).nullish(), revertedBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }).readonly().nullish(), summary: BookkeepingExportBatchSummaryDtoSchema, files: z.array(BookkeepingExportFileDtoSchema).readonly().nullish() }).readonly();
export type BookkeepingExportBatchDetailsDto = z.infer<typeof BookkeepingExportBatchDetailsDtoSchema>;

/** 
 * UpdateBookkeepingExportBatchRequestDtoSchema 
 * @type { object }
 * @property { BookkeepingExportFormatEnum } format  
 */
export const UpdateBookkeepingExportBatchRequestDtoSchema = z.object({ format: BookkeepingExportFormatEnumSchema }).readonly();
export type UpdateBookkeepingExportBatchRequestDto = z.infer<typeof UpdateBookkeepingExportBatchRequestDtoSchema>;

/** 
 * BookkeepingExportBatchPreviewDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { BookkeepingExportFormatEnum } format  
 * @property { BookkeepingExportBatchStatusEnum } status  
 * @property { number } totalInvoiceCount  
 * @property { number } exportedInvoiceCount  
 * @property { object } createdBy  
 * @property { string } createdBy.id  
 * @property { string } createdBy.fullName  
 * @property { string } createdBy.email  
 * @property { string } createdAt  
 * @property { string } exportedAt  
 * @property { string } revertedAt  
 * @property { BookkeepingExportFileDto[] } files  
 */
export const BookkeepingExportBatchPreviewDtoSchema = z.object({ id: z.string(), format: BookkeepingExportFormatEnumSchema, status: BookkeepingExportBatchStatusEnumSchema, totalInvoiceCount: z.number(), exportedInvoiceCount: z.number(), createdBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }).readonly(), createdAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish(), revertedAt: z.iso.datetime({ offset: true }).nullish(), files: z.array(BookkeepingExportFileDtoSchema).readonly().nullish() }).readonly();
export type BookkeepingExportBatchPreviewDto = z.infer<typeof BookkeepingExportBatchPreviewDtoSchema>;

/** 
 * DateRangeSchema 
 * @type { object }
 * @property { string } from  
 * @property { string } to  
 */
export const DateRangeSchema = z.object({ from: z.iso.datetime({ offset: true }), to: z.iso.datetime({ offset: true }) }).readonly();
export type DateRange = z.infer<typeof DateRangeSchema>;

/** 
 * BookkeepingExportBatchPreviewFilterDtoSchema 
 * @type { object }
 * @property { DateRange } createdDate  
 * @property { BookkeepingExportBatchStatusEnum[] } status  
 * @property { BookkeepingExportFormatEnum[] } format  
 * @property { string[] } createdBy  
 */
export const BookkeepingExportBatchPreviewFilterDtoSchema = z.object({ createdDate: DateRangeSchema, status: z.array(BookkeepingExportBatchStatusEnumSchema).readonly(), format: z.array(BookkeepingExportFormatEnumSchema).readonly(), createdBy: z.array(z.string()).readonly() }).readonly();
export type BookkeepingExportBatchPreviewFilterDto = z.infer<typeof BookkeepingExportBatchPreviewFilterDtoSchema>;

/** 
 * BookkeepingExportBatchItemStatusEnumSchema 
 * @type { enum }
 */
export const BookkeepingExportBatchItemStatusEnumSchema = z.enum(["Selected", "NeedsReview", "ReadyForExport", "Exported", "Excluded"]);
export type BookkeepingExportBatchItemStatusEnum = z.infer<typeof BookkeepingExportBatchItemStatusEnumSchema>;
export const BookkeepingExportBatchItemStatusEnum = BookkeepingExportBatchItemStatusEnumSchema.enum;

/** 
 * BookkeepingExportItemDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } invoiceId  
 * @property { BookkeepingExportBatchItemStatusEnum } status  
 * @property { boolean } includedInExport  
 * @property { string[] } validationIssues  
 * @property { object } invoice  
 * @property { string } invoice.invoiceNumber  
 * @property { string } invoice.issuingDate  
 * @property { string } invoice.currency  
 * @property { number } invoice.amount  
 * @property { number } invoice.tax  
 * @property { string[] } invoice.vatRules  
 * @property { object } receiver  
 * @property { string } receiver.id  
 * @property { string } receiver.name  
 * @property { string } receiver.matchCode  
 * @property { string } receiver.label  
 * @property { string } receiver.account  
 * @property { string } receiver.contraAccount  
 * @property { string } comments  
 */
export const BookkeepingExportItemDetailDtoSchema = z.object({ id: z.string(), invoiceId: z.string(), status: BookkeepingExportBatchItemStatusEnumSchema, includedInExport: z.boolean(), validationIssues: z.array(z.string()).readonly().nullish(), invoice: z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), currency: z.string(), amount: z.number(), tax: z.number(), vatRules: z.array(z.string()).readonly() }).readonly(), receiver: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), account: z.string(), contraAccount: z.string() }).readonly(), comments: z.string().nullish() }).readonly();
export type BookkeepingExportItemDetailDto = z.infer<typeof BookkeepingExportItemDetailDtoSchema>;

/** 
 * BookkeepingExportItemDetailFilterDtoSchema 
 * @type { object }
 * @property { BookkeepingExportBatchItemStatusEnum[] } status  
 */
export const BookkeepingExportItemDetailFilterDtoSchema = z.object({ status: z.array(BookkeepingExportBatchItemStatusEnumSchema).readonly() }).readonly();
export type BookkeepingExportItemDetailFilterDto = z.infer<typeof BookkeepingExportItemDetailFilterDtoSchema>;

/** 
 * BookkeepingExportVatLineItemDtoSchema 
 * @type { object }
 * @property { string } invoiceId  
 * @property { string } batchId  
 * @property { string } batchItemId  
 * @property { BookkeepingExportBatchItemStatusEnum } status  
 * @property { boolean } includedInExport  
 * @property { string[] } validationIssues  
 * @property { object } invoice  
 * @property { string } invoice.invoiceNumber  
 * @property { string } invoice.issuingDate  
 * @property { string } invoice.currency  
 * @property { number } invoice.amount  
 * @property { number } invoice.tax  
 * @property { string } invoice.comments  
 * @property { object } receiver  
 * @property { string } receiver.id  
 * @property { string } receiver.name  
 * @property { string } receiver.matchCode  
 * @property { string } receiver.label  
 * @property { string } receiver.account  
 * @property { string } receiver.contraAccount  
 * @property { number } vatPercentage  
 * @property { string } vatRule  
 * @property { number } netAmount  
 * @property { number } vatAmount  
 * @property { number } grossAmount  
 * @property { number } vatAmountInOfficeCurrency  
 * @property { number } netAmountInOfficeCurrency  
 * @property { number } grossAmountInOfficeCurrency  
 * @property { string } officeCurrency  
 */
export const BookkeepingExportVatLineItemDtoSchema = z.object({ invoiceId: z.string(), batchId: z.string(), batchItemId: z.string(), status: BookkeepingExportBatchItemStatusEnumSchema, includedInExport: z.boolean(), validationIssues: z.array(z.string()).readonly().nullish(), invoice: z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), currency: z.string(), amount: z.number(), tax: z.number(), comments: z.string().nullish() }).readonly(), receiver: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), account: z.string(), contraAccount: z.string() }).readonly(), vatPercentage: z.number(), vatRule: z.string(), netAmount: z.number(), vatAmount: z.number(), grossAmount: z.number(), vatAmountInOfficeCurrency: z.number().nullish(), netAmountInOfficeCurrency: z.number().nullish(), grossAmountInOfficeCurrency: z.number().nullish(), officeCurrency: z.string() }).readonly();
export type BookkeepingExportVatLineItemDto = z.infer<typeof BookkeepingExportVatLineItemDtoSchema>;

/** 
 * CreateBookkeepingExportBatchResponseDtoSchema 
 * @type { object }
 * @property { string } batchId  
 */
export const CreateBookkeepingExportBatchResponseDtoSchema = z.object({ batchId: z.string() }).readonly();
export type CreateBookkeepingExportBatchResponseDto = z.infer<typeof CreateBookkeepingExportBatchResponseDtoSchema>;

/** 
 * UpdateBookkeepingExportBatchItemRequestDtoSchema 
 * @type { object }
 * @property { boolean } includedInExport Whether the item should be included in the export 
 * @property { string[] } itemIds Min Items: `0` 
 * @property { boolean } vatOk  
 * @property { boolean } invoiceOk  
 */
export const UpdateBookkeepingExportBatchItemRequestDtoSchema = z.object({ includedInExport: z.boolean().describe("Whether the item should be included in the export").nullish(), itemIds: z.array(z.string()).readonly(), vatOk: z.boolean().nullish(), invoiceOk: z.boolean().nullish() }).readonly();
export type UpdateBookkeepingExportBatchItemRequestDto = z.infer<typeof UpdateBookkeepingExportBatchItemRequestDtoSchema>;

/** 
 * PaginateBatchesOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateBatchesOrderParamEnumSchema = z.enum(["createdAt", "status", "format", "totalInvoiceCount"]);
export type PaginateBatchesOrderParamEnum = z.infer<typeof PaginateBatchesOrderParamEnumSchema>;
export const PaginateBatchesOrderParamEnum = PaginateBatchesOrderParamEnumSchema.enum;

/** 
 * PaginateBatchesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BookkeepingExportBatchPreviewDto[] } items  
 */
export const PaginateBatchesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BookkeepingExportBatchPreviewDtoSchema).readonly() }).readonly().shape });
export type PaginateBatchesResponse = z.infer<typeof PaginateBatchesResponseSchema>;

/** 
 * PaginateBatchItemsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateBatchItemsOrderParamEnumSchema = z.enum(["issuingDate"]);
export type PaginateBatchItemsOrderParamEnum = z.infer<typeof PaginateBatchItemsOrderParamEnumSchema>;
export const PaginateBatchItemsOrderParamEnum = PaginateBatchItemsOrderParamEnumSchema.enum;

/** 
 * PaginateBatchItemsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BookkeepingExportItemDetailDto[] } items  
 */
export const PaginateBatchItemsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BookkeepingExportItemDetailDtoSchema).readonly() }).readonly().shape });
export type PaginateBatchItemsResponse = z.infer<typeof PaginateBatchItemsResponseSchema>;

/** 
 * GetVatLineItemsOrderParamEnumSchema 
 * @type { enum }
 */
export const GetVatLineItemsOrderParamEnumSchema = z.enum(["account", "contraAccount", "issuingDate", "invoiceNumber", "receiver"]);
export type GetVatLineItemsOrderParamEnum = z.infer<typeof GetVatLineItemsOrderParamEnumSchema>;
export const GetVatLineItemsOrderParamEnum = GetVatLineItemsOrderParamEnumSchema.enum;

/** 
 * GetVatLineItemsResponseSchema 
 * @type { array }
 */
export const GetVatLineItemsResponseSchema = z.array(BookkeepingExportVatLineItemDtoSchema).readonly();
export type GetVatLineItemsResponse = z.infer<typeof GetVatLineItemsResponseSchema>;

}
