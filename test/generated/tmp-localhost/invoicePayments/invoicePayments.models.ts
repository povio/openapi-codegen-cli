import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace InvoicePaymentsModels {
/** 
 * OfficePaymentTotalAmountsDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currencyNotation  
 */
export const OfficePaymentTotalAmountsDtoSchema = z.object({ amount: z.number(), currencyNotation: z.string() });
export type OfficePaymentTotalAmountsDto = z.infer<typeof OfficePaymentTotalAmountsDtoSchema>;

/** 
 * OfficePaymentListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { OfficePaymentTotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const OfficePaymentListResponseDtoSchema = z.object({ items: z.array(z.string()), totalAmounts: z.array(OfficePaymentTotalAmountsDtoSchema), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type OfficePaymentListResponseDto = z.infer<typeof OfficePaymentListResponseDtoSchema>;

/** 
 * OfficePaymentPreviewInvoiceDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } invoiceNumber  
 * @property { CommonModels.InvoiceDirectionEnum } invoiceDirection  
 * @property { number } grossAmount  
 * @property { CommonModels.InvoiceStatusEnum } status  
 * @property { string } paidOn  
 * @property { string } issuingDate  
 */
export const OfficePaymentPreviewInvoiceDtoSchema = z.object({ id: z.string(), invoiceNumber: z.string(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, grossAmount: z.number(), status: CommonModels.InvoiceStatusEnumSchema, paidOn: z.iso.datetime({ offset: true }).nullable(), issuingDate: z.iso.datetime({ offset: true }).nullable() });
export type OfficePaymentPreviewInvoiceDto = z.infer<typeof OfficePaymentPreviewInvoiceDtoSchema>;

/** 
 * PaymentMethodEnumSchema 
 * @type { enum }
 */
export const PaymentMethodEnumSchema = z.enum(["BankTransfer", "Cash", "DirectDebit", "Other"]);
export type PaymentMethodEnum = z.infer<typeof PaymentMethodEnumSchema>;
export const PaymentMethodEnum = PaymentMethodEnumSchema.enum;

/** 
 * OfficePaymentPreviewCreatedByDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const OfficePaymentPreviewCreatedByDtoSchema = z.object({ id: z.string(), name: z.string() });
export type OfficePaymentPreviewCreatedByDto = z.infer<typeof OfficePaymentPreviewCreatedByDtoSchema>;

/** 
 * OfficePaymentBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label Display label: matchCode when office.usePartnerMatchCodes, else name 
 */
export const OfficePaymentBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type OfficePaymentBusinessPartnerDto = z.infer<typeof OfficePaymentBusinessPartnerDtoSchema>;

/** 
 * OfficePaymentPreviewDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } amount  
 * @property { string } positionNumber  
 * @property { string } currencyNotation  
 * @property { string } paymentDate  
 * @property { PaymentMethodEnum } paymentMethod  
 * @property { string } comment  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { OfficePaymentPreviewCreatedByDto } createdBy  
 * @property { OfficePaymentPreviewInvoiceDto } invoice  
 * @property { OfficePaymentBusinessPartnerDto } businessPartner  
 */
export const OfficePaymentPreviewDtoSchema = z.object({ id: z.string(), amount: z.number(), positionNumber: z.string(), currencyNotation: z.string(), paymentDate: z.iso.datetime({ offset: true }), paymentMethod: PaymentMethodEnumSchema, comment: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: OfficePaymentPreviewCreatedByDtoSchema, invoice: OfficePaymentPreviewInvoiceDtoSchema, businessPartner: OfficePaymentBusinessPartnerDtoSchema.nullish() });
export type OfficePaymentPreviewDto = z.infer<typeof OfficePaymentPreviewDtoSchema>;

/** 
 * OfficeInvoicePaymentFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by invoice number 
 * @property { CommonModels.DateRangeDto } paymentDate Filter by payment date range 
 * @property { CommonModels.DateRangeDto } invoiceIssuingDate Filter by invoice issuing date range 
 * @property { CommonModels.InvoiceDirectionEnum[] } invoiceDirection Filter by invoice direction 
 * @property { string[] } createdBy Filter by created by employee IDs (array of UUIDs) 
 * @property { string[] } businessPartner Filter by invoice customer/business partner (array of UUIDs) 
 */
export const OfficeInvoicePaymentFilterDtoSchema = z.object({ search: z.string().nullable(), paymentDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceIssuingDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).nullable(), createdBy: z.array(z.string()).nullable(), businessPartner: z.array(z.string()).nullable() }).partial();
export type OfficeInvoicePaymentFilterDto = z.infer<typeof OfficeInvoicePaymentFilterDtoSchema>;

/** 
 * BulkCreatePaymentBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } name Business partner name 
 * @property { string } paymentDate Payment date applied to the partner invoices 
 */
export const BulkCreatePaymentBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string(), paymentDate: z.iso.datetime({ offset: true }) });
export type BulkCreatePaymentBusinessPartnerDto = z.infer<typeof BulkCreatePaymentBusinessPartnerDtoSchema>;

/** 
 * BulkCreatePaymentsResponseDtoSchema 
 * @type { object }
 * @property { BulkCreatePaymentBusinessPartnerDto[] } businessPartners List of business partners paid in this bulk operation 
 */
export const BulkCreatePaymentsResponseDtoSchema = z.object({ businessPartners: z.array(BulkCreatePaymentBusinessPartnerDtoSchema) });
export type BulkCreatePaymentsResponseDto = z.infer<typeof BulkCreatePaymentsResponseDtoSchema>;

/** 
 * CalculatePaymentItemDtoSchema 
 * @type { object }
 * @property { string } businessPartnerId  
 * @property { string } businessPartnerName  
 * @property { number } amount  
 * @property { string } currency  
 */
export const CalculatePaymentItemDtoSchema = z.object({ businessPartnerId: z.string(), businessPartnerName: z.string(), amount: z.number(), currency: z.string() });
export type CalculatePaymentItemDto = z.infer<typeof CalculatePaymentItemDtoSchema>;

/** 
 * CalculatePaymentTotalDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currency  
 */
export const CalculatePaymentTotalDtoSchema = z.object({ amount: z.number(), currency: z.string() });
export type CalculatePaymentTotalDto = z.infer<typeof CalculatePaymentTotalDtoSchema>;

/** 
 * CalculatePaymentsResponseDtoSchema 
 * @type { object }
 * @property { CalculatePaymentItemDto[] } payments  
 * @property { CalculatePaymentTotalDto[] } totals  
 */
export const CalculatePaymentsResponseDtoSchema = z.object({ payments: z.array(CalculatePaymentItemDtoSchema), totals: z.array(CalculatePaymentTotalDtoSchema) });
export type CalculatePaymentsResponseDto = z.infer<typeof CalculatePaymentsResponseDtoSchema>;

/** 
 * OfficeInvoicePaymentExportFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by invoice number 
 * @property { CommonModels.DateRangeDto } paymentDate Filter by payment date range 
 * @property { CommonModels.DateRangeDto } invoiceIssuingDate Filter by invoice issuing date range 
 * @property { CommonModels.InvoiceDirectionEnum[] } invoiceDirection Filter by invoice direction 
 * @property { string[] } createdBy Filter by created by employee IDs (array of UUIDs) 
 * @property { string[] } businessPartner Filter by invoice customer/business partner (array of UUIDs) 
 */
export const OfficeInvoicePaymentExportFilterDtoSchema = z.object({ search: z.string().nullable(), paymentDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceIssuingDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).nullable(), createdBy: z.array(z.string()).nullable(), businessPartner: z.array(z.string()).nullable() }).partial();
export type OfficeInvoicePaymentExportFilterDto = z.infer<typeof OfficeInvoicePaymentExportFilterDtoSchema>;

/** 
 * OfficeInvoicePaymentExportColumnSchema 
 * @type { enum }
 */
export const OfficeInvoicePaymentExportColumnSchema = z.enum(["amount", "currency", "paymentDate", "paymentMethod", "comment", "positionNumber", "invoiceNumber", "invoiceDirection", "invoiceStatus", "invoiceIssuingDate", "invoiceGrossAmount", "invoicePaidOn", "businessPartnerName", "createdByName"]);
export type OfficeInvoicePaymentExportColumn = z.infer<typeof OfficeInvoicePaymentExportColumnSchema>;
export const OfficeInvoicePaymentExportColumn = OfficeInvoicePaymentExportColumnSchema.enum;

/** 
 * OfficeInvoicePaymentExportRequestDtoSchema 
 * @type { object }
 * @property { OfficeInvoicePaymentExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { OfficeInvoicePaymentExportFilterDto } filter  
 */
export const OfficeInvoicePaymentExportRequestDtoSchema = z.object({ columns: z.array(OfficeInvoicePaymentExportColumnSchema).min(1).nullable(), order: z.array(z.string()).nullable(), filter: OfficeInvoicePaymentExportFilterDtoSchema.nullable() }).partial();
export type OfficeInvoicePaymentExportRequestDto = z.infer<typeof OfficeInvoicePaymentExportRequestDtoSchema>;

/** 
 * PaymentCreatedByDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PaymentCreatedByDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PaymentCreatedByDto = z.infer<typeof PaymentCreatedByDtoSchema>;

/** 
 * PaymentResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } amount  
 * @property { string } currencyNotation  
 * @property { string } paymentDate  
 * @property { PaymentMethodEnum } paymentMethod  
 * @property { string } bankAccountId  
 * @property { string } bankAccount  
 * @property { string } comment  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { PaymentCreatedByDto } createdBy  
 */
export const PaymentResponseDtoSchema = z.object({ id: z.string(), amount: z.number(), currencyNotation: z.string(), paymentDate: z.iso.datetime({ offset: true }), paymentMethod: PaymentMethodEnumSchema, bankAccountId: z.string().nullish(), bankAccount: z.string().nullish(), comment: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: PaymentCreatedByDtoSchema.nullish() });
export type PaymentResponseDto = z.infer<typeof PaymentResponseDtoSchema>;

/** 
 * PositionInvoicePaymentMethodEnumSchema 
 * @type { enum }
 */
export const PositionInvoicePaymentMethodEnumSchema = z.enum(["BankTransfer", "Cash", "DirectDebit", "Other"]);
export type PositionInvoicePaymentMethodEnum = z.infer<typeof PositionInvoicePaymentMethodEnumSchema>;
export const PositionInvoicePaymentMethodEnum = PositionInvoicePaymentMethodEnumSchema.enum;

/** 
 * CreateInvoicePaymentRequestDtoSchema 
 * @type { object }
 * @property { number } amount Payment amount 
 * @property { string } paymentDate Payment date 
 * @property { PositionInvoicePaymentMethodEnum } paymentMethod Payment method 
 * @property { string } bankAccountId Bank account ID 
 * @property { string } comment Optional comment 
 */
export const CreateInvoicePaymentRequestDtoSchema = z.object({ amount: z.number(), paymentDate: z.iso.datetime({ offset: true }), paymentMethod: PositionInvoicePaymentMethodEnumSchema, bankAccountId: z.string().nullish(), comment: z.string().nullish() });
export type CreateInvoicePaymentRequestDto = z.infer<typeof CreateInvoicePaymentRequestDtoSchema>;

/** 
 * UpdateInvoicePaymentRequestDtoSchema 
 * @type { object }
 * @property { number } amount Payment amount. Minimum: `0.01` 
 * @property { string } paymentDate Payment date 
 * @property { string } paymentMethod Payment method 
 * @property { string } bankAccountId Bank account ID 
 * @property { string } comment Payment comment 
 */
export const UpdateInvoicePaymentRequestDtoSchema = z.object({ amount: z.number().gte(0.01).nullable(), paymentDate: z.iso.datetime({ offset: true }).nullable(), paymentMethod: PaymentMethodEnumSchema.nullable(), bankAccountId: z.string().nullable(), comment: z.string().nullable() }).partial();
export type UpdateInvoicePaymentRequestDto = z.infer<typeof UpdateInvoicePaymentRequestDtoSchema>;

/** 
 * BulkCreatePaymentsRequestDtoSchema 
 * @type { object }
 * @property { string } paymentDate Payment date for all payments 
 * @property { string[] } invoiceIds List of invoice IDs to create payments for. Min Items: `1` 
 * @property { string } comment  
 */
export const BulkCreatePaymentsRequestDtoSchema = z.object({ paymentDate: z.iso.datetime({ offset: true }), invoiceIds: z.array(z.string()).min(1), comment: z.string().nullish() });
export type BulkCreatePaymentsRequestDto = z.infer<typeof BulkCreatePaymentsRequestDtoSchema>;

/** 
 * CalculatePaymentsRequestDtoSchema 
 * @type { object }
 * @property { string[] } invoiceIds Invoice IDs (UUID v4). Min Items: `1`. Max Items: `30` 
 */
export const CalculatePaymentsRequestDtoSchema = z.object({ invoiceIds: z.array(z.string()).min(1).max(30) });
export type CalculatePaymentsRequestDto = z.infer<typeof CalculatePaymentsRequestDtoSchema>;

/** 
 * ListOfficePaymentsOrderParamEnumSchema 
 * @type { enum }
 */
export const ListOfficePaymentsOrderParamEnumSchema = z.enum(["paymentDate", "amount", "paymentMethod", "comment", "createdAt", "updatedAt", "currencyNotation", "createdByName", "invoiceNumber", "invoiceDirection", "invoiceGrossAmount", "invoiceStatus", "invoicePaidOn", "invoiceIssuingDate"]);
export type ListOfficePaymentsOrderParamEnum = z.infer<typeof ListOfficePaymentsOrderParamEnumSchema>;
export const ListOfficePaymentsOrderParamEnum = ListOfficePaymentsOrderParamEnumSchema.enum;

/** 
 * ListOfficePaymentsResponseSchema 
 * @type { object }
 * @property { OfficePaymentTotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { OfficePaymentPreviewDto[] } items  
 */
export const ListOfficePaymentsResponseSchema = z.object({ ...OfficePaymentListResponseDtoSchema.shape, ...z.object({ items: z.array(OfficePaymentPreviewDtoSchema).nullable() }).partial().shape });
export type ListOfficePaymentsResponse = z.infer<typeof ListOfficePaymentsResponseSchema>;

/** 
 * InvoicePaymentsListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PaymentResponseDto[] } items  
 */
export const InvoicePaymentsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PaymentResponseDtoSchema).nullable() }).partial().shape });
export type InvoicePaymentsListResponse = z.infer<typeof InvoicePaymentsListResponseSchema>;

}
