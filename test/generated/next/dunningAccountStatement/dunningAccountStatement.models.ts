import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningAccountStatementModels {
/** 
 * AccountStatementPdfPayloadInvoiceDtoSchema 
 * @type { object }
 * @property { string } number  
 * @property { string } issuingDate  
 * @property { string } dueDate  
 * @property { number } dueDays  
 * @property { number } invoiceAmount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 */
export const AccountStatementPdfPayloadInvoiceDtoSchema = z.object({ number: z.string(), issuingDate: z.iso.datetime({ offset: true }), dueDate: z.iso.datetime({ offset: true }), dueDays: z.number(), invoiceAmount: z.number(), outstandingAmount: z.number(), currencyNotation: z.string() });
export type AccountStatementPdfPayloadInvoiceDto = z.infer<typeof AccountStatementPdfPayloadInvoiceDtoSchema>;

/** 
 * AccountStatementInvoicesByCurrencyAndDirectionDtoSchema 
 * @type { object }
 * @property { string } direction  
 * @property { string } currency  
 * @property { AccountStatementPdfPayloadInvoiceDto[] } invoices  
 * @property { number } totalOutstandingAmount  
 */
export const AccountStatementInvoicesByCurrencyAndDirectionDtoSchema = z.object({ direction: CommonModels.InvoiceDirectionEnumSchema, currency: z.string(), invoices: z.array(AccountStatementPdfPayloadInvoiceDtoSchema), totalOutstandingAmount: z.number() });
export type AccountStatementInvoicesByCurrencyAndDirectionDto = z.infer<typeof AccountStatementInvoicesByCurrencyAndDirectionDtoSchema>;

/** 
 * AccountStatementPdfPayloadBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } address  
 * @property { string } referenceNumber  
 */
export const AccountStatementPdfPayloadBusinessPartnerDtoSchema = z.object({ name: z.string(), address: z.string().nullish(), referenceNumber: z.string().nullish() });
export type AccountStatementPdfPayloadBusinessPartnerDto = z.infer<typeof AccountStatementPdfPayloadBusinessPartnerDtoSchema>;

/** 
 * AccountStatementPdfPayloadBankAccountDtoSchema 
 * @type { object }
 * @property { string } displayValue  
 * @property { string } iban  
 * @property { string } bankName  
 * @property { string } swiftBic  
 */
export const AccountStatementPdfPayloadBankAccountDtoSchema = z.object({ displayValue: z.string(), iban: z.string(), bankName: z.string(), swiftBic: z.string() });
export type AccountStatementPdfPayloadBankAccountDto = z.infer<typeof AccountStatementPdfPayloadBankAccountDtoSchema>;

/** 
 * AccountStatementPdfPayloadDTOSchema 
 * @type { object }
 * @property { AccountStatementPdfPayloadBusinessPartnerDto } businessPartner  
 * @property { AccountStatementInvoicesByCurrencyAndDirectionDto[] } invoicesByCurrencyAndDirection  
 * @property { AccountStatementPdfPayloadBankAccountDto } bankAccount  
 * @property { string } employeeName  
 * @property { CommonModels.ConfigBlockDto } config  
 */
export const AccountStatementPdfPayloadDTOSchema = z.object({ businessPartner: AccountStatementPdfPayloadBusinessPartnerDtoSchema, invoicesByCurrencyAndDirection: z.array(AccountStatementInvoicesByCurrencyAndDirectionDtoSchema), bankAccount: AccountStatementPdfPayloadBankAccountDtoSchema, employeeName: z.string().nullable(), config: CommonModels.ConfigBlockDtoSchema });
export type AccountStatementPdfPayloadDTO = z.infer<typeof AccountStatementPdfPayloadDTOSchema>;

/** 
 * OfficeInvoiceListQueryDtoSchema 
 * @type { object }
 * @property { string } order Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber` 
 * @property { CommonModels.OfficeInvoiceFilterDto } filter  
 * @property { number } limit Items per response. Minimum: `1`. Maximum: `100`. Default: `20` 
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 */
export const OfficeInvoiceListQueryDtoSchema = z.object({ order: z.string().nullish(), filter: CommonModels.OfficeInvoiceFilterDtoSchema.nullish(), limit: z.number().gte(1).lte(100).default(20), page: z.number().nullish(), cursor: z.string().nullish() });
export type OfficeInvoiceListQueryDto = z.infer<typeof OfficeInvoiceListQueryDtoSchema>;

/** 
 * GenerateAccountStatementOrderParamEnumSchema 
 * @type { enum }
 */
export const GenerateAccountStatementOrderParamEnumSchema = z.enum(["invoiceNumber", "issuingDate", "invoiceType", "amount", "netAmount", "currencyNotation", "dueDate", "status", "paidOn", "serviceDate", "internalNumber", "positionNumber", "invoiceDirection", "receiver", "receiverCountry", "paidAmount", "totalVat", "dunningBlock", "invoiceInReview", "isInvoiceOk", "isVatOk", "comments", "salesRepName", "isExportedToBookkeeping", "createdAt", "customerReferenceOverride", "externalSystemId"]);
export type GenerateAccountStatementOrderParamEnum = z.infer<typeof GenerateAccountStatementOrderParamEnumSchema>;
export const GenerateAccountStatementOrderParamEnum = GenerateAccountStatementOrderParamEnumSchema.enum;

}
