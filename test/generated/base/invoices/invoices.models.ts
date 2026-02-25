import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace InvoicesModels {
/** 
 * InvoiceBusinessPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 */
export const InvoiceBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type InvoiceBusinessPartnerResponseDto = z.infer<typeof InvoiceBusinessPartnerResponseDtoSchema>;

/** 
 * InvoiceEmployeeResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvoiceEmployeeResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type InvoiceEmployeeResponseDto = z.infer<typeof InvoiceEmployeeResponseDtoSchema>;

/** 
 * InvoiceRelatedInvoiceResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { string } internalNumber  
 */
export const InvoiceRelatedInvoiceResponseDtoSchema = z.object({ id: z.string(), number: z.string().nullable(), internalNumber: z.string().nullish() });
export type InvoiceRelatedInvoiceResponseDto = z.infer<typeof InvoiceRelatedInvoiceResponseDtoSchema>;

/** 
 * InvoicePreviewDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { CommonModels.InvoiceDirectionEnum } invoiceDirection  
 * @property { CommonModels.InvoiceTypeEnum } invoiceType  
 * @property { string } invoiceNumber  
 * @property { string } issuingDate  
 * @property { number } amount  
 * @property { string } currencyNotation  
 * @property { CommonModels.InvoiceStatusEnum } status  
 * @property { boolean } isExportedToBookkeeping  
 * @property { string } internalNumber  
 * @property { InvoiceBusinessPartnerResponseDto } receiver  
 * @property { InvoiceEmployeeResponseDto } representative  
 * @property { boolean } collective  
 * @property { InvoiceRelatedInvoiceResponseDto } creditNote  
 * @property { InvoiceRelatedInvoiceResponseDto } cancelledInvoice  
 */
export const InvoicePreviewDtoSchema = z.object({ id: z.string(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, invoiceType: CommonModels.InvoiceTypeEnumSchema, invoiceNumber: z.string().nullable(), issuingDate: z.iso.datetime({ offset: true }).nullish(), amount: z.number(), currencyNotation: z.string(), status: CommonModels.InvoiceStatusEnumSchema, isExportedToBookkeeping: z.boolean(), internalNumber: z.string().nullish(), receiver: InvoiceBusinessPartnerResponseDtoSchema.nullish(), representative: InvoiceEmployeeResponseDtoSchema.nullish(), collective: z.boolean(), creditNote: InvoiceRelatedInvoiceResponseDtoSchema.nullish(), cancelledInvoice: InvoiceRelatedInvoiceResponseDtoSchema.nullish() });
export type InvoicePreviewDto = z.infer<typeof InvoicePreviewDtoSchema>;

/** 
 * InvoicePartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label Display label: matchCode when office.usePartnerMatchCodes, else name 
 */
export const InvoicePartnerDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type InvoicePartnerDto = z.infer<typeof InvoicePartnerDtoSchema>;

/** 
 * InvoicePositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { string } transportType  
 * @property { string } ourReference  
 * @property { string } finalDestination  
 * @property { InvoicePartnerDto } shipper  
 * @property { InvoicePartnerDto } consignee  
 * @property { string } vessel  
 * @property { string } emptyPickup  
 * @property { string } loadingAddress  
 * @property { string } portOfLoading  
 * @property { string } portOfDischarge  
 * @property { string } carrierBl  
 * @property { string } houseBillOfLadingNumber  
 * @property { string } masterAWB  
 * @property { string } hawbNumber  
 * @property { string } flightNo  
 * @property { string } pickupAddress  
 * @property { string } originAirport  
 * @property { string } destinationAirport  
 * @property { string } originLocation  
 * @property { string } destinationLocation  
 * @property { string } dateOfDeparture  
 * @property { string } dateOfArrival  
 */
export const InvoicePositionDtoSchema = z.object({ id: z.string(), number: z.string(), transportType: z.string(), ourReference: z.string().nullish(), finalDestination: z.string().nullish(), shipper: InvoicePartnerDtoSchema.nullish(), consignee: InvoicePartnerDtoSchema.nullish(), vessel: z.string().nullish(), emptyPickup: z.string().nullish(), loadingAddress: z.string().nullish(), portOfLoading: z.string().nullish(), portOfDischarge: z.string().nullish(), carrierBl: z.string().nullish(), houseBillOfLadingNumber: z.string().nullish(), masterAWB: z.string().nullish(), hawbNumber: z.string().nullish(), flightNo: z.string().nullish(), pickupAddress: z.string().nullish(), originAirport: z.string().nullish(), destinationAirport: z.string().nullish(), originLocation: z.string().nullish(), destinationLocation: z.string().nullish(), dateOfDeparture: z.iso.datetime({ offset: true }).nullish(), dateOfArrival: z.iso.datetime({ offset: true }).nullish() });
export type InvoicePositionDto = z.infer<typeof InvoicePositionDtoSchema>;

/** 
 * InvoiceChargeTypeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvoiceChargeTypeDtoSchema = z.object({ id: z.string(), name: z.string() });
export type InvoiceChargeTypeDto = z.infer<typeof InvoiceChargeTypeDtoSchema>;

/** 
 * InvoiceVatRuleDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { number } rate  
 */
export const InvoiceVatRuleDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), rate: z.number().nullish() });
export type InvoiceVatRuleDto = z.infer<typeof InvoiceVatRuleDtoSchema>;

/** 
 * InvoiceFinanceLineDtoSchema 
 * @type { object }
 * @property { string } positionChargeItemId  
 * @property { InvoiceChargeTypeDto } chargeType  
 * @property { string } additionalText  
 * @property { number } quantity  
 * @property { number } netAmount  
 * @property { number } grossAmount  
 * @property { number } sumInInvoiceCurrency  
 * @property { number } sumInOfficeCurrency  
 * @property { string } currencyNotation  
 * @property { number } exchangeRate  
 * @property { InvoiceVatRuleDto } vatRule  
 * @property { number } exchangedNetAmount  
 * @property { string } positionNumber  
 * @property { string } positionId  
 * @property { string } outgoingInvoiceId  
 * @property { string } registeredInvoiceId  
 */
export const InvoiceFinanceLineDtoSchema = z.object({ positionChargeItemId: z.string(), chargeType: InvoiceChargeTypeDtoSchema, additionalText: z.string(), quantity: z.number(), netAmount: z.number(), grossAmount: z.number(), sumInInvoiceCurrency: z.number().nullish(), sumInOfficeCurrency: z.number().nullish(), currencyNotation: z.string(), exchangeRate: z.number().nullish(), vatRule: InvoiceVatRuleDtoSchema, exchangedNetAmount: z.number().nullish(), positionNumber: z.string().nullish(), positionId: z.string().nullish(), outgoingInvoiceId: z.string().nullish(), registeredInvoiceId: z.string().nullish() });
export type InvoiceFinanceLineDto = z.infer<typeof InvoiceFinanceLineDtoSchema>;

/** 
 * InvoiceConfigDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl  
 * @property { string } headerImageUrl  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { CommonModels.LocaleEnum } locale  
 */
export const InvoiceConfigDtoSchema = z.object({ footerImageUrl: z.string().nullish(), headerImageUrl: z.string().nullish(), showWatermarkOnDocuments: z.boolean(), locale: CommonModels.LocaleEnumSchema.nullish() });
export type InvoiceConfigDto = z.infer<typeof InvoiceConfigDtoSchema>;

/** 
 * InvoiceCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 * @property { string } address  
 * @property { string } vatNumber  
 * @property { string } reference  
 * @property { string } contact  
 * @property { string } partnerRegistrationNumber  
 */
export const InvoiceCustomerDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string().nullish(), label: z.string().nullish(), address: z.string().nullish(), vatNumber: z.string(), reference: z.string().nullish(), contact: z.string().nullish(), partnerRegistrationNumber: z.string().nullish() });
export type InvoiceCustomerDto = z.infer<typeof InvoiceCustomerDtoSchema>;

/** 
 * InvoiceOfficeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvoiceOfficeDtoSchema = z.object({ id: z.string(), name: z.string() });
export type InvoiceOfficeDto = z.infer<typeof InvoiceOfficeDtoSchema>;

/** 
 * InvoiceSalesRepDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } phoneNumber  
 */
export const InvoiceSalesRepDtoSchema = z.object({ id: z.string(), name: z.string(), phoneNumber: z.string().nullish() });
export type InvoiceSalesRepDto = z.infer<typeof InvoiceSalesRepDtoSchema>;

/** 
 * InvoiceServiceRecipientDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } address  
 * @property { string } vatNumber  
 * @property { string } partnerRegistrationNumber  
 */
export const InvoiceServiceRecipientDtoSchema = z.object({ id: z.string(), name: z.string(), address: z.string().nullish(), vatNumber: z.string(), partnerRegistrationNumber: z.string().nullish() });
export type InvoiceServiceRecipientDto = z.infer<typeof InvoiceServiceRecipientDtoSchema>;

/** 
 * InvoiceBankAccountDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } displayValue  
 * @property { string } iban  
 * @property { string } bankName  
 * @property { string } swiftBic  
 * @property { string } name  
 * @property { boolean } useFooterOnInvoice  
 * @property { object } footer  
 * @property { string } footer.mediaUrl  
 */
export const InvoiceBankAccountDtoSchema = z.object({ id: z.string(), displayValue: z.string(), iban: z.string(), bankName: z.string(), swiftBic: z.string(), name: z.string(), useFooterOnInvoice: z.boolean(), footer: z.object({ mediaUrl: z.string() }).nullish() });
export type InvoiceBankAccountDto = z.infer<typeof InvoiceBankAccountDtoSchema>;

/** 
 * InvoiceRemarksDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const InvoiceRemarksDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type InvoiceRemarksDto = z.infer<typeof InvoiceRemarksDtoSchema>;

/** 
 * InvoiceVatLineDtoSchema 
 * @type { object }
 * @property { string } vatRuleId ID of the VAT rule 
 * @property { string } name Name of the VAT rule 
 * @property { string } printNumber Reference numerical string for vat rules 
 * @property { string } matchCode Match code of the VAT rule 
 * @property { number } vatPercentage The actual VAT rate (e.g., 19 for 19%) 
 * @property { number } netAmount Sum of net amounts from financeLines using this vatRuleId 
 * @property { number } vatAmount Calculated total VAT for this rate (netAmount * vatPercentage / 100) 
 * @property { number } grossAmount Sum of netAmount + vatAmount for this rate 
 * @property { number } vatAmountInOfficeCurrency  
 * @property { number } netAmountInOfficeCurrency  
 * @property { number } grossAmountInOfficeCurrency  
 */
export const InvoiceVatLineDtoSchema = z.object({ vatRuleId: z.string(), name: z.string(), printNumber: z.string(), matchCode: z.string(), vatPercentage: z.number(), netAmount: z.number(), vatAmount: z.number(), grossAmount: z.number(), vatAmountInOfficeCurrency: z.number().nullish(), netAmountInOfficeCurrency: z.number().nullish(), grossAmountInOfficeCurrency: z.number().nullish() });
export type InvoiceVatLineDto = z.infer<typeof InvoiceVatLineDtoSchema>;

/** 
 * RelatedInvoiceDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { string } internalNumber  
 */
export const RelatedInvoiceDetailDtoSchema = z.object({ id: z.string(), number: z.string().nullable(), internalNumber: z.string().nullish() });
export type RelatedInvoiceDetailDto = z.infer<typeof RelatedInvoiceDetailDtoSchema>;

/** 
 * InvoiceLanguageEnumSchema 
 * @type { enum }
 */
export const InvoiceLanguageEnumSchema = z.enum(["en", "de", "sl", "hu", "cs"]);
export type InvoiceLanguageEnum = z.infer<typeof InvoiceLanguageEnumSchema>;
export const InvoiceLanguageEnum = InvoiceLanguageEnumSchema.enum;

/** 
 * InvoiceDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } rootFolderId  
 * @property { string } invoiceDirection  
 * @property { string } invoiceType  
 * @property { string } invoiceNumber  
 * @property { string } costCenter  
 * @property { string } status  
 * @property { string } language  
 * @property { boolean } isVatOk  
 * @property { boolean } isInvoiceOk  
 * @property { string } issuingDate  
 * @property { string } receiptDate  
 * @property { string } serviceDate  
 * @property { string } serviceDateUntil  
 * @property { string } dueDate  
 * @property { string } internalNumber  
 * @property { boolean } isExportedToBookkeeping  
 * @property { string } sentAt  
 * @property { string } creditNoteId  
 * @property { string } draftCreditNoteId  
 * @property { string } cancelledInvoiceId  
 * @property { string } uploadedDocumentUrl  
 * @property { InvoiceCustomerDto } customer  
 * @property { string } customerNumber  
 * @property { string } customerNameOverride  
 * @property { string } customerReferenceOverride  
 * @property { string } customerContactOverride  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { InvoicePositionDto } position  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { InvoiceOfficeDto } salesOffice  
 * @property { InvoiceSalesRepDto } salesRep  
 * @property { number } totalNet  
 * @property { number } totalVat  
 * @property { number } totalGross  
 * @property { string } currencyNotation  
 * @property { number } exchangeRate  
 * @property { number } paymentTermDays  
 * @property { CommonModels.OfficePaymentTermsDateType } paymentTermType  
 * @property { InvoiceServiceRecipientDto } serviceRecipient  
 * @property { boolean } showPaymentInstructions  
 * @property { boolean } dunningBlock  
 * @property { boolean } invoiceInReview  
 * @property { string } comments  
 * @property { InvoiceBankAccountDto } bankAccount  
 * @property { InvoiceFinanceLineDto[] } financeLines  
 * @property { InvoiceRemarksDto } remarks  
 * @property { InvoiceVatLineDto[] } vatLines  
 * @property { InvoiceConfigDto } config  
 * @property { RelatedInvoiceDetailDto } creditNote  
 * @property { RelatedInvoiceDetailDto } draftCreditNote  
 * @property { RelatedInvoiceDetailDto } cancelledInvoice  
 * @property { string } officeCurrencyNotation  
 * @property { string } inverseCurrencyNotation  
 * @property { number } inverseExchangeRate  
 * @property { boolean } requiresSpecialTablePresentation  
 * @property { number } paidAmount  
 * @property { number } outstandingAmount  
 * @property { string } paidOn  
 * @property { boolean } isIssued  
 * @property { number } grossAmountInOfficeCurrency  
 * @property { string } createdAt  
 */
export const InvoiceDetailDtoSchema = z.object({ id: z.string(), rootFolderId: z.string().nullish(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, invoiceType: CommonModels.InvoiceTypeEnumSchema, invoiceNumber: z.string().nullish(), costCenter: z.string().nullish(), status: CommonModels.InvoiceStatusEnumSchema, language: InvoiceLanguageEnumSchema, isVatOk: z.boolean(), isInvoiceOk: z.boolean(), issuingDate: z.iso.datetime({ offset: true }).nullish(), receiptDate: z.iso.datetime({ offset: true }).nullish(), serviceDate: z.iso.datetime({ offset: true }).nullish(), serviceDateUntil: z.iso.datetime({ offset: true }).nullish(), dueDate: z.iso.datetime({ offset: true }).nullish(), internalNumber: z.string().nullish(), isExportedToBookkeeping: z.boolean(), sentAt: z.iso.datetime({ offset: true }).nullish(), creditNoteId: z.string().nullish(), draftCreditNoteId: z.string().nullish(), cancelledInvoiceId: z.string().nullish(), uploadedDocumentUrl: z.string().nullish(), customer: InvoiceCustomerDtoSchema.nullish(), customerNumber: z.string().nullish(), customerNameOverride: z.string().nullish(), customerReferenceOverride: z.string().nullish(), customerContactOverride: z.string().nullish(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), position: InvoicePositionDtoSchema.nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), salesOffice: InvoiceOfficeDtoSchema, salesRep: InvoiceSalesRepDtoSchema, totalNet: z.number(), totalVat: z.number().nullish(), totalGross: z.number(), currencyNotation: z.string(), exchangeRate: z.number().nullish(), paymentTermDays: z.number().nullish(), paymentTermType: CommonModels.OfficePaymentTermsDateTypeSchema.nullish(), serviceRecipient: InvoiceServiceRecipientDtoSchema.nullish(), showPaymentInstructions: z.boolean().nullish(), dunningBlock: z.boolean().nullish(), invoiceInReview: z.boolean().nullish(), comments: z.string().nullish(), bankAccount: InvoiceBankAccountDtoSchema.nullish(), financeLines: z.array(InvoiceFinanceLineDtoSchema), remarks: InvoiceRemarksDtoSchema.nullish(), vatLines: z.array(InvoiceVatLineDtoSchema), config: InvoiceConfigDtoSchema.nullish(), creditNote: RelatedInvoiceDetailDtoSchema.nullish(), draftCreditNote: RelatedInvoiceDetailDtoSchema.nullish(), cancelledInvoice: RelatedInvoiceDetailDtoSchema.nullish(), officeCurrencyNotation: z.string().nullish(), inverseCurrencyNotation: z.string().nullish(), inverseExchangeRate: z.number().nullish(), requiresSpecialTablePresentation: z.boolean().nullish(), paidAmount: z.number(), outstandingAmount: z.number(), paidOn: z.iso.datetime({ offset: true }).nullish(), isIssued: z.boolean(), grossAmountInOfficeCurrency: z.number().nullish(), createdAt: z.iso.datetime({ offset: true }) });
export type InvoiceDetailDto = z.infer<typeof InvoiceDetailDtoSchema>;

/** 
 * TotalAmountsDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currencyNotation  
 */
export const TotalAmountsDtoSchema = z.object({ amount: z.number(), currencyNotation: z.string() });
export type TotalAmountsDto = z.infer<typeof TotalAmountsDtoSchema>;

/** 
 * OfficeInvoiceListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } totalAmountInDefaultCurrency  
 * @property { string } defaultCurrencyNotation  
 * @property { TotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const OfficeInvoiceListResponseDtoSchema = z.object({ items: z.array(z.string()), totalAmountInDefaultCurrency: z.number().nullish(), defaultCurrencyNotation: z.string().nullish(), totalAmounts: z.array(TotalAmountsDtoSchema), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type OfficeInvoiceListResponseDto = z.infer<typeof OfficeInvoiceListResponseDtoSchema>;

/** 
 * InvoicePreviewPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { string } externalSystemId  
 */
export const InvoicePreviewPositionDtoSchema = z.object({ id: z.string(), number: z.string(), externalSystemId: z.string().nullish() });
export type InvoicePreviewPositionDto = z.infer<typeof InvoicePreviewPositionDtoSchema>;

/** 
 * InvoicePreviewReceiverDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 */
export const InvoicePreviewReceiverDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type InvoicePreviewReceiverDto = z.infer<typeof InvoicePreviewReceiverDtoSchema>;

/** 
 * InvoicePreviewReceiverCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvoicePreviewReceiverCountryDtoSchema = z.object({ id: z.string(), name: z.string() });
export type InvoicePreviewReceiverCountryDto = z.infer<typeof InvoicePreviewReceiverCountryDtoSchema>;

/** 
 * InvoicePreviewClerkDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvoicePreviewClerkDtoSchema = z.object({ id: z.string(), name: z.string() });
export type InvoicePreviewClerkDto = z.infer<typeof InvoicePreviewClerkDtoSchema>;

/** 
 * VatRuleLabelResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchCode  
 * @property { string } name  
 */
export const VatRuleLabelResponseDtoSchema = z.object({ id: z.string(), matchCode: z.string(), name: z.string() });
export type VatRuleLabelResponseDto = z.infer<typeof VatRuleLabelResponseDtoSchema>;

/** 
 * OfficeInvoicePreviewDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } invoiceNumber  
 * @property { string } invoiceDirection  
 * @property { string } issuingDate  
 * @property { CommonModels.InvoiceTypeEnum } invoiceType  
 * @property { boolean } collective  
 * @property { string } serviceDate  
 * @property { string } internalNumber  
 * @property { string } reference  
 * @property { number } amount  
 * @property { number } netAmount  
 * @property { number } tax  
 * @property { string } currency  
 * @property { string } dueDate  
 * @property { CommonModels.InvoiceStatusEnum } status  
 * @property { string } payDate  
 * @property { number } paidAmount  
 * @property { InvoicePreviewPositionDto } position  
 * @property { InvoicePreviewReceiverDto } receiver  
 * @property { InvoicePreviewReceiverCountryDto } receiverCountry  
 * @property { InvoicePreviewClerkDto } clerk  
 * @property { boolean } cancelled  
 * @property { boolean } ok  
 * @property { boolean } isExportedToBookkeeping  
 * @property { boolean } dunningBlock  
 * @property { boolean } invoiceInReview  
 * @property { boolean } vatOk  
 * @property { string } comments  
 * @property { string } paymentComment  
 * @property { string } creditorId  
 * @property { string } debtorId  
 * @property { string } hblNumber  
 * @property { string } mblNumber  
 * @property { string } bookingNumber  
 * @property { string } vessel  
 * @property { string } voyage  
 * @property { VatRuleLabelResponseDto[] } vatRules  
 */
export const OfficeInvoicePreviewDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), invoiceNumber: z.string().nullish(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, issuingDate: z.iso.datetime({ offset: true }).nullish(), invoiceType: CommonModels.InvoiceTypeEnumSchema, collective: z.boolean(), serviceDate: z.iso.datetime({ offset: true }).nullish(), internalNumber: z.string().nullish(), reference: z.string().nullish(), amount: z.number(), netAmount: z.number(), tax: z.number(), currency: z.string(), dueDate: z.iso.datetime({ offset: true }).nullish(), status: CommonModels.InvoiceStatusEnumSchema, payDate: z.iso.datetime({ offset: true }).nullish(), paidAmount: z.number().nullish(), position: InvoicePreviewPositionDtoSchema.nullish(), receiver: InvoicePreviewReceiverDtoSchema.nullish(), receiverCountry: InvoicePreviewReceiverCountryDtoSchema.nullish(), clerk: InvoicePreviewClerkDtoSchema.nullish(), cancelled: z.boolean(), ok: z.boolean(), isExportedToBookkeeping: z.boolean(), dunningBlock: z.boolean(), invoiceInReview: z.boolean(), vatOk: z.boolean(), comments: z.string().nullish(), paymentComment: z.string().nullish(), creditorId: z.string().nullish(), debtorId: z.string().nullish(), hblNumber: z.string().nullish(), mblNumber: z.string().nullish(), bookingNumber: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), vatRules: z.array(VatRuleLabelResponseDtoSchema).nullish() });
export type OfficeInvoicePreviewDto = z.infer<typeof OfficeInvoicePreviewDtoSchema>;

/** 
 * InvoiceExportFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { CommonModels.DateRangeDto } issuingDate  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { CommonModels.InvoiceDirectionEnum[] } invoiceDirection  
 * @property { CommonModels.InvoiceTypeEnum[] } invoiceType  
 * @property { CommonModels.BooleanFilterEnum[] } collective  
 * @property { number } amountMin  
 * @property { number } amountMax  
 * @property { string[] } currencyNotation  
 * @property { CommonModels.DateRangeDto } dueDate  
 * @property { CommonModels.InvoiceStatusEnum[] } status  
 * @property { string[] } receiver Filter by invoice receiver/customer ID (UUID) 
 * @property { string } positionNumbersString  
 * @property { string[] } positionNumbers  
 * @property { string } invoiceNumbersString  
 * @property { string[] } invoiceNumbers  
 * @property { CommonModels.BooleanFilterEnum[] } bookkeepingExportStatus  
 * @property { CommonModels.BooleanFilterEnum[] } dunningBlock  
 * @property { CommonModels.BooleanFilterEnum[] } invoiceInReview  
 * @property { CommonModels.BooleanFilterEnum[] } isInvoiceOk  
 * @property { CommonModels.BooleanFilterEnum[] } isVatOk  
 * @property { number } invoiceNumberMin  
 * @property { number } invoiceNumberMax  
 * @property { number } internalNumberMin  
 * @property { number } internalNumberMax  
 */
export const InvoiceExportFilterDtoSchema = z.object({ search: z.string().nullable(), issuingDate: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).nullable(), invoiceType: z.array(CommonModels.InvoiceTypeEnumSchema).nullable(), collective: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), amountMin: z.number().nullable(), amountMax: z.number().nullable(), currencyNotation: z.array(z.string()).nullable(), dueDate: CommonModels.DateRangeDtoSchema.nullable(), status: z.array(CommonModels.InvoiceStatusEnumSchema).nullable(), receiver: z.array(z.string()).nullable(), positionNumbersString: z.string().nullable(), positionNumbers: z.array(z.string()).nullable(), invoiceNumbersString: z.string().nullable(), invoiceNumbers: z.array(z.string()).nullable(), bookkeepingExportStatus: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), dunningBlock: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceInReview: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isInvoiceOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isVatOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceNumberMin: z.number().nullable(), invoiceNumberMax: z.number().nullable(), internalNumberMin: z.number().nullable(), internalNumberMax: z.number().nullable() }).partial();
export type InvoiceExportFilterDto = z.infer<typeof InvoiceExportFilterDtoSchema>;

/** 
 * InvoiceExportColumnSchema 
 * @type { enum }
 */
export const InvoiceExportColumnSchema = z.enum(["invoiceNumber", "invoiceDirection", "issuingDate", "invoiceType", "collective", "serviceDate", "internalNumber", "reference", "totalGross", "totalNet", "totalVat", "currency", "dueDate", "status", "payDate", "paidAmount", "positionNumber", "hblHawb", "mblMawb", "bookingNumber", "vessel", "voyage", "receiverName", "receiverCountry", "clerkName", "cancelled", "ok", "vatOk", "dunningBlock", "invoiceInReview", "exportedToBookkeeping", "comments", "paymentComment", "vatRuleIds", "creditorId", "debtorId", "createdAt"]);
export type InvoiceExportColumn = z.infer<typeof InvoiceExportColumnSchema>;
export const InvoiceExportColumn = InvoiceExportColumnSchema.enum;

/** 
 * InvoiceExportRequestDtoSchema 
 * @type { object }
 * @property { InvoiceExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { InvoiceExportFilterDto } filter  
 */
export const InvoiceExportRequestDtoSchema = z.object({ columns: z.array(InvoiceExportColumnSchema).min(1).nullable(), order: z.array(z.string()).nullable(), filter: InvoiceExportFilterDtoSchema.nullable() }).partial();
export type InvoiceExportRequestDto = z.infer<typeof InvoiceExportRequestDtoSchema>;

/** 
 * UninvoicedChargeTotalAmountDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currencyNotation  
 */
export const UninvoicedChargeTotalAmountDtoSchema = z.object({ amount: z.number(), currencyNotation: z.string() });
export type UninvoicedChargeTotalAmountDto = z.infer<typeof UninvoicedChargeTotalAmountDtoSchema>;

/** 
 * UninvoicedChargeListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { UninvoicedChargeTotalAmountDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const UninvoicedChargeListResponseDtoSchema = z.object({ items: z.array(z.string()), totalAmounts: z.array(UninvoicedChargeTotalAmountDtoSchema), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type UninvoicedChargeListResponseDto = z.infer<typeof UninvoicedChargeListResponseDtoSchema>;

/** 
 * ReceiverDtoSchema 
 * @type { object }
 * @property { string } id Business Partner ID (Customer or Vendor) 
 * @property { string } name Business Partner name 
 * @property { string } matchCode Business Partner match code 
 * @property { string } label Display label: matchCode when office.usePartnerMatchCodes, else name 
 */
export const ReceiverDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type ReceiverDto = z.infer<typeof ReceiverDtoSchema>;

/** 
 * UninvoicedChargePositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const UninvoicedChargePositionDtoSchema = z.object({ id: z.string(), number: z.string() });
export type UninvoicedChargePositionDto = z.infer<typeof UninvoicedChargePositionDtoSchema>;

/** 
 * UninvoicedChargeChargeTypeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const UninvoicedChargeChargeTypeDtoSchema = z.object({ id: z.string(), name: z.string() });
export type UninvoicedChargeChargeTypeDto = z.infer<typeof UninvoicedChargeChargeTypeDtoSchema>;

/** 
 * UninvoicedChargeVatRuleDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchcode  
 */
export const UninvoicedChargeVatRuleDtoSchema = z.object({ id: z.string(), name: z.string(), matchcode: z.string() });
export type UninvoicedChargeVatRuleDto = z.infer<typeof UninvoicedChargeVatRuleDtoSchema>;

/** 
 * UninvoicedChargeGroupStatusEnumSchema 
 * @type { enum }
 */
export const UninvoicedChargeGroupStatusEnumSchema = z.enum(["ReadyForInvoice", "MissingInformation"]);
export type UninvoicedChargeGroupStatusEnum = z.infer<typeof UninvoicedChargeGroupStatusEnumSchema>;
export const UninvoicedChargeGroupStatusEnum = UninvoicedChargeGroupStatusEnumSchema.enum;

/** 
 * UninvoicedChargeEmployeeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } firstName  
 * @property { string } lastName  
 * @property { string } fullName  
 */
export const UninvoicedChargeEmployeeDtoSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), fullName: z.string() });
export type UninvoicedChargeEmployeeDto = z.infer<typeof UninvoicedChargeEmployeeDtoSchema>;

/** 
 * UninvoicedChargeDtoSchema 
 * @type { object }
 * @property { string } chargeItemId  
 * @property { CommonModels.InvoiceDirectionEnum } invoiceDirection Invoice direction (Incoming or Outgoing) 
 * @property { ReceiverDto } receiver Business Partner receiving the invoice 
 * @property { UninvoicedChargePositionDto } position  
 * @property { UninvoicedChargeChargeTypeDto } chargeType  
 * @property { string } currencyNotation ISO 4217 currency code 
 * @property { number } amount Charge amount in charge currency 
 * @property { number } amountInOfficeCurrency Charge amount in office currency 
 * @property { string } officeCurrency Office currency code 
 * @property { number } exchangeRate  
 * @property { UninvoicedChargeVatRuleDto } vatRule  
 * @property { string } serviceDate  
 * @property { UninvoicedChargeGroupStatusEnum } status Status of charge group 
 * @property { string[] } missingInformation Missing fields required for invoicing this charge 
 * @property { UninvoicedChargeEmployeeDto } employee  
 */
export const UninvoicedChargeDtoSchema = z.object({ chargeItemId: z.string(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, receiver: ReceiverDtoSchema, position: UninvoicedChargePositionDtoSchema, chargeType: UninvoicedChargeChargeTypeDtoSchema.nullish(), currencyNotation: z.string(), amount: z.number(), amountInOfficeCurrency: z.number(), officeCurrency: z.string(), exchangeRate: z.number().nullish(), vatRule: UninvoicedChargeVatRuleDtoSchema.nullish(), serviceDate: z.iso.datetime({ offset: true }).nullish(), status: UninvoicedChargeGroupStatusEnumSchema, missingInformation: z.array(z.string()).nullish(), employee: UninvoicedChargeEmployeeDtoSchema.nullish() });
export type UninvoicedChargeDto = z.infer<typeof UninvoicedChargeDtoSchema>;

/** 
 * UninvoicedChargePaginationDtoSchema 
 * @type { object }
 * @property { string } direction Filter by invoice direction 
 * @property { string } chargeItemId  
 * @property { string } receiverId  
 * @property { string } chargeTypeId  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { string[] } currency  
 * @property { string } vatRuleId  
 */
export const UninvoicedChargePaginationDtoSchema = z.object({ direction: CommonModels.InvoiceDirectionEnumSchema.nullable(), chargeItemId: z.string().nullable(), receiverId: z.string().nullable(), chargeTypeId: z.string().nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), currency: z.array(z.string()).nullable(), vatRuleId: z.string().nullable() }).partial();
export type UninvoicedChargePaginationDto = z.infer<typeof UninvoicedChargePaginationDtoSchema>;

/** 
 * UninvoicedChargesFilterDtoSchema 
 * @type { object }
 * @property { string } direction Filter by invoice direction 
 * @property { string } chargeItemId  
 * @property { string[] } receiverIds  
 * @property { string[] } positionIds  
 * @property { string[] } chargeTypeIds  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { string[] } currencies  
 * @property { string[] } vatRuleIds  
 * @property { string[] } employeeIds  
 */
export const UninvoicedChargesFilterDtoSchema = z.object({ direction: CommonModels.InvoiceDirectionEnumSchema.nullable(), chargeItemId: z.string().nullable(), receiverIds: z.array(z.string()).nullable(), positionIds: z.array(z.string()).nullable(), chargeTypeIds: z.array(z.string()).nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), currencies: z.array(z.string()).nullable(), vatRuleIds: z.array(z.string()).nullable(), employeeIds: z.array(z.string()).nullable() }).partial();
export type UninvoicedChargesFilterDto = z.infer<typeof UninvoicedChargesFilterDtoSchema>;

/** 
 * UninvoicedChargesExportFilterDtoSchema 
 * @type { object }
 * @property { string } direction Filter by invoice direction 
 * @property { string } chargeItemId  
 * @property { string[] } receiverIds  
 * @property { string[] } positionIds  
 * @property { string[] } chargeTypeIds  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { string[] } currencies  
 * @property { string[] } vatRuleIds  
 */
export const UninvoicedChargesExportFilterDtoSchema = z.object({ direction: CommonModels.InvoiceDirectionEnumSchema.nullable(), chargeItemId: z.string().nullable(), receiverIds: z.array(z.string()).nullable(), positionIds: z.array(z.string()).nullable(), chargeTypeIds: z.array(z.string()).nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), currencies: z.array(z.string()).nullable(), vatRuleIds: z.array(z.string()).nullable() }).partial();
export type UninvoicedChargesExportFilterDto = z.infer<typeof UninvoicedChargesExportFilterDtoSchema>;

/** 
 * UninvoicedChargeExportColumnSchema 
 * @type { enum }
 */
export const UninvoicedChargeExportColumnSchema = z.enum(["chargeItemId", "invoiceDirection", "status", "receiverName", "positionNumber", "serviceDate", "employee", "chargeTypeName", "amount", "currency", "exchangeRate", "amountInOfficeCurrency", "officeCurrency", "vatRule"]);
export type UninvoicedChargeExportColumn = z.infer<typeof UninvoicedChargeExportColumnSchema>;
export const UninvoicedChargeExportColumn = UninvoicedChargeExportColumnSchema.enum;

/** 
 * UninvoicedChargesExportRequestDtoSchema 
 * @type { object }
 * @property { UninvoicedChargeExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { UninvoicedChargesExportFilterDto } filter  
 */
export const UninvoicedChargesExportRequestDtoSchema = z.object({ columns: z.array(UninvoicedChargeExportColumnSchema).min(1).nullable(), order: z.array(z.string()).nullable(), filter: UninvoicedChargesExportFilterDtoSchema.nullable() }).partial();
export type UninvoicedChargesExportRequestDto = z.infer<typeof UninvoicedChargesExportRequestDtoSchema>;

/** 
 * CreateDraftInvoiceRequestDtoSchema 
 * @type { object }
 * @property { string[] } chargeItemIds Charge item IDs to include in the invoice. Min Items: `1` 
 * @property { CommonModels.InvoiceTypeEnum } invoiceType Type of invoice 
 * @property { string } customerId Customer ID (required for outgoing invoices) 
 * @property { CommonModels.InvoiceDirectionEnum } direction Invoice direction 
 */
export const CreateDraftInvoiceRequestDtoSchema = z.object({ chargeItemIds: z.array(z.string()).min(1).nullish(), invoiceType: CommonModels.InvoiceTypeEnumSchema, customerId: z.string(), direction: CommonModels.InvoiceDirectionEnumSchema });
export type CreateDraftInvoiceRequestDto = z.infer<typeof CreateDraftInvoiceRequestDtoSchema>;

/** 
 * UpdateInvoiceRemarksDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const UpdateInvoiceRemarksDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type UpdateInvoiceRemarksDto = z.infer<typeof UpdateInvoiceRemarksDtoSchema>;

/** 
 * UpdateInvoiceCustomerDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } reference  
 * @property { string } contact  
 */
export const UpdateInvoiceCustomerDtoSchema = z.object({ name: z.string().nullable(), reference: z.string().nullable(), contact: z.string().nullable() }).partial();
export type UpdateInvoiceCustomerDto = z.infer<typeof UpdateInvoiceCustomerDtoSchema>;

/** 
 * UpdateInvoiceRequestDtoSchema 
 * @type { object }
 * @property { string } issuingDate Invoice date in ISO format 
 * @property { string } receiptDate Receipt date in ISO format 
 * @property { string } serviceDate Service date in ISO format 
 * @property { string } serviceDateUntil Service end date in ISO format 
 * @property { string } dueDate Due date in ISO format 
 * @property { string } invoiceNumber Invoice number 
 * @property { string } internalNumber Internal reference number 
 * @property { number } paymentTermDays Payment term in days 
 * @property { CommonModels.OfficePaymentTermsDateType } paymentTermType  
 * @property { string } serviceRecipientId Service recipient ID 
 * @property { string } bankAccountId Bank account ID 
 * @property { UpdateInvoiceRemarksDto } remarks Additional remarks 
 * @property { InvoiceLanguageEnum } language Invoice language 
 * @property { boolean } showPaymentInstructions  
 * @property { UpdateInvoiceCustomerDto } customer  
 * @property { string } salesRepId  
 * @property { string } currencyNotation  
 * @property { number } exchangeRate Invoice exchange rate 
 */
export const UpdateInvoiceRequestDtoSchema = z.object({ issuingDate: z.iso.datetime({ offset: true }).nullable(), receiptDate: z.iso.datetime({ offset: true }).nullable(), serviceDate: z.iso.datetime({ offset: true }).nullable(), serviceDateUntil: z.iso.datetime({ offset: true }).nullable(), dueDate: z.iso.datetime({ offset: true }).nullable(), invoiceNumber: z.string().nullable(), internalNumber: z.string().nullable(), paymentTermDays: z.number().nullable(), paymentTermType: CommonModels.OfficePaymentTermsDateTypeSchema.nullable(), serviceRecipientId: z.string().nullable(), bankAccountId: z.string().nullable(), remarks: UpdateInvoiceRemarksDtoSchema.nullable(), language: InvoiceLanguageEnumSchema.nullable(), showPaymentInstructions: z.boolean().nullable(), customer: UpdateInvoiceCustomerDtoSchema.nullable(), salesRepId: z.string().nullable(), currencyNotation: z.string().nullable(), exchangeRate: z.number().nullable() }).partial();
export type UpdateInvoiceRequestDto = z.infer<typeof UpdateInvoiceRequestDtoSchema>;

/** 
 * FixInvoiceRemarksDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const FixInvoiceRemarksDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type FixInvoiceRemarksDto = z.infer<typeof FixInvoiceRemarksDtoSchema>;

/** 
 * FixInvoiceCustomerDtoSchema 
 * @type { object }
 * @property { string } reference Customer reference number 
 */
export const FixInvoiceCustomerDtoSchema = z.object({ reference: z.string().nullable() }).partial();
export type FixInvoiceCustomerDto = z.infer<typeof FixInvoiceCustomerDtoSchema>;

/** 
 * FixInvoiceRequestDtoSchema 
 * @type { object }
 * @property { string } currencyNotation Invoice currency (incoming invoices only) 
 * @property { string } issuingDate Update invoice date in ISO format 
 * @property { string } dueDate Update invoice due date in ISO format 
 * @property { number } exchangeRate Invoice exchange rate 
 * @property { number } paymentTermDays Payment term in days 
 * @property { CommonModels.OfficePaymentTermsDateType } paymentTermType  
 * @property { string } receiptDate Update receipt date in ISO format 
 * @property { string } serviceDate Update service date in ISO format 
 * @property { string } serviceDateUntil Update service end date in ISO format 
 * @property { boolean } isVatOk Mark VAT as checked/OK by accounting 
 * @property { boolean } isInvoiceOk Mark overall invoice as checked/OK by accounting 
 * @property { boolean } dunningBlock  
 * @property { boolean } invoiceInReview  
 * @property { string } comments  
 * @property { FixInvoiceRemarksDto } remarks Additional remarks 
 * @property { string } invoiceNumber Invoice number (incoming invoices only) 
 * @property { string } bankAccountId Bank account ID 
 * @property { string } serviceRecipientId Service recipient ID 
 * @property { FixInvoiceCustomerDto } customer Customer reference (incoming invoices only) 
 */
export const FixInvoiceRequestDtoSchema = z.object({ currencyNotation: z.string().nullable(), issuingDate: z.iso.datetime({ offset: true }).nullable(), dueDate: z.iso.datetime({ offset: true }).nullable(), exchangeRate: z.number().nullable(), paymentTermDays: z.number().nullable(), paymentTermType: CommonModels.OfficePaymentTermsDateTypeSchema.nullable(), receiptDate: z.iso.datetime({ offset: true }).nullable(), serviceDate: z.iso.datetime({ offset: true }).nullable(), serviceDateUntil: z.iso.datetime({ offset: true }).nullable(), isVatOk: z.boolean().nullable(), isInvoiceOk: z.boolean().nullable(), dunningBlock: z.boolean().nullable(), invoiceInReview: z.boolean().nullable(), comments: z.string().nullable(), remarks: FixInvoiceRemarksDtoSchema.nullable(), invoiceNumber: z.string().nullable(), bankAccountId: z.string().nullable(), serviceRecipientId: z.string().nullable(), customer: FixInvoiceCustomerDtoSchema.nullable() }).partial();
export type FixInvoiceRequestDto = z.infer<typeof FixInvoiceRequestDtoSchema>;

/** 
 * UpdateIssuedInvoiceChargeRequestDtoSchema 
 * @type { object }
 * @property { string } positionChargeItemId Position charge item ID 
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity. Minimum: `0` 
 * @property { number } amount Amount (must be positive). Minimum: `0.01` 
 * @property { string } vatRuleId VAT rule ID 
 * @property { number } exchangeRate Charge exchange rate (incoming invoices only) 
 * @property { string } currencyNotation  
 */
export const UpdateIssuedInvoiceChargeRequestDtoSchema = z.object({ positionChargeItemId: z.string(), chargeTypeId: z.string().nullish(), additionalText: z.string().nullish(), quantity: z.number().gte(0).nullish(), amount: z.number().gte(0.01).nullish(), vatRuleId: z.string().nullish(), exchangeRate: z.number().nullish(), currencyNotation: z.string().nullish() });
export type UpdateIssuedInvoiceChargeRequestDto = z.infer<typeof UpdateIssuedInvoiceChargeRequestDtoSchema>;

/** 
 * UpdateIssuedInvoiceChargesRequestDtoSchema 
 * @type { object }
 * @property { UpdateIssuedInvoiceChargeRequestDto[] } charges Array of charge updates. Min Items: `1` 
 */
export const UpdateIssuedInvoiceChargesRequestDtoSchema = z.object({ charges: z.array(UpdateIssuedInvoiceChargeRequestDtoSchema).min(1) });
export type UpdateIssuedInvoiceChargesRequestDto = z.infer<typeof UpdateIssuedInvoiceChargesRequestDtoSchema>;

/** 
 * UpdateInvoiceChargeRequestDtoSchema 
 * @type { object }
 * @property { string } positionChargeItemId Position charge item ID 
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity. Minimum: `0` 
 * @property { number } amount Amount (must be positive). Minimum: `0.01` 
 * @property { string } vatRuleId VAT rule ID 
 * @property { number } exchangeRate  
 * @property { string } currencyNotation  
 */
export const UpdateInvoiceChargeRequestDtoSchema = z.object({ positionChargeItemId: z.string(), chargeTypeId: z.string().nullish(), additionalText: z.string().nullish(), quantity: z.number().gte(0).nullish(), amount: z.number().gte(0.01).nullish(), vatRuleId: z.string().nullish(), exchangeRate: z.number().nullish(), currencyNotation: z.string().nullish() });
export type UpdateInvoiceChargeRequestDto = z.infer<typeof UpdateInvoiceChargeRequestDtoSchema>;

/** 
 * UpdateInvoiceChargesRequestDtoSchema 
 * @type { object }
 * @property { UpdateInvoiceChargeRequestDto[] } charges Array of charge updates. Min Items: `1` 
 */
export const UpdateInvoiceChargesRequestDtoSchema = z.object({ charges: z.array(UpdateInvoiceChargeRequestDtoSchema).min(1) });
export type UpdateInvoiceChargesRequestDto = z.infer<typeof UpdateInvoiceChargesRequestDtoSchema>;

/** 
 * InvoiceFilterDtoSchema 
 * @type { object }
 * @property { string[] } status  
 * @property { string } direction  
 * @property { string } receiver Filter by invoice receiver/customer ID (UUID) 
 */
export const InvoiceFilterDtoSchema = z.object({ status: z.array(CommonModels.InvoiceStatusEnumSchema).nullable(), direction: CommonModels.InvoiceDirectionEnumSchema.nullable(), receiver: z.string().nullable() }).partial();
export type InvoiceFilterDto = z.infer<typeof InvoiceFilterDtoSchema>;

/** 
 * ChangeInvoiceCustomerRequestDtoSchema 
 * @type { object }
 * @property { string } newCustomerId  
 */
export const ChangeInvoiceCustomerRequestDtoSchema = z.object({ newCustomerId: z.uuid() });
export type ChangeInvoiceCustomerRequestDto = z.infer<typeof ChangeInvoiceCustomerRequestDtoSchema>;

/** 
 * CreateDirectInvoiceChargeRequestDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { string } buyVatRuleId Buy VAT rule ID 
 * @property { string } vendorId Vendor ID 
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { string } sellVatRuleId Sell VAT rule ID 
 * @property { string } customerId Customer ID 
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 */
export const CreateDirectInvoiceChargeRequestDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type CreateDirectInvoiceChargeRequestDto = z.infer<typeof CreateDirectInvoiceChargeRequestDtoSchema>;

/** 
 * UpdateIssuedInvoiceVatRulesRequestDtoSchema 
 * @type { object }
 * @property { string } positionChargeItemId Position charge item ID 
 * @property { string } vatRuleId VAT rule ID 
 */
export const UpdateIssuedInvoiceVatRulesRequestDtoSchema = z.object({ positionChargeItemId: z.string(), vatRuleId: z.string() });
export type UpdateIssuedInvoiceVatRulesRequestDto = z.infer<typeof UpdateIssuedInvoiceVatRulesRequestDtoSchema>;

/** 
 * PrepareUploadRequestDtoSchema 
 * @type { object }
 * @property { string } filename  
 * @property { string } mimeType  
 * @property { number } fileSize  
 */
export const PrepareUploadRequestDtoSchema = z.object({ filename: z.string().nullish(), mimeType: z.string(), fileSize: z.number() });
export type PrepareUploadRequestDto = z.infer<typeof PrepareUploadRequestDtoSchema>;

/** 
 * InvoiceUploadInstructionsDtoSchema 
 * @type { object }
 * @property { string } url Pre-signed URL for the PUT request to storage 
 * @property { string } method HTTP method to use for upload 
 */
export const InvoiceUploadInstructionsDtoSchema = z.object({ url: z.string(), method: z.string() });
export type InvoiceUploadInstructionsDto = z.infer<typeof InvoiceUploadInstructionsDtoSchema>;

/** 
 * GetInvoicesEmlInvoiceIdsParamSchema 
 * @type { array }
 */
export const GetInvoicesEmlInvoiceIdsParamSchema = z.array(z.string()).nullish();
export type GetInvoicesEmlInvoiceIdsParam = z.infer<typeof GetInvoicesEmlInvoiceIdsParamSchema>;

/** 
 * InvoicesFindOrderParamEnumSchema 
 * @type { enum }
 */
export const InvoicesFindOrderParamEnumSchema = z.enum(["status", "createdAt", "serviceDate"]);
export type InvoicesFindOrderParamEnum = z.infer<typeof InvoicesFindOrderParamEnumSchema>;
export const InvoicesFindOrderParamEnum = InvoicesFindOrderParamEnumSchema.enum;

/** 
 * InvoicesFindResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InvoicePreviewDto[] } items  
 */
export const InvoicesFindResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(InvoicePreviewDtoSchema).nullable() }).partial().shape });
export type InvoicesFindResponse = z.infer<typeof InvoicesFindResponseSchema>;

/** 
 * FindByOfficeOrderParamEnumSchema 
 * @type { enum }
 */
export const FindByOfficeOrderParamEnumSchema = z.enum(["invoiceNumber", "issuingDate", "invoiceType", "amount", "netAmount", "currencyNotation", "dueDate", "status", "paidOn", "serviceDate", "internalNumber", "positionNumber", "invoiceDirection", "receiver", "receiverCountry", "paidAmount", "totalVat", "dunningBlock", "invoiceInReview", "isInvoiceOk", "isVatOk", "comments", "salesRepName", "isExportedToBookkeeping", "createdAt", "customerReferenceOverride", "externalSystemId"]);
export type FindByOfficeOrderParamEnum = z.infer<typeof FindByOfficeOrderParamEnumSchema>;
export const FindByOfficeOrderParamEnum = FindByOfficeOrderParamEnumSchema.enum;

/** 
 * FindByOfficeResponseSchema 
 * @type { object }
 * @property { number } totalAmountInDefaultCurrency  
 * @property { string } defaultCurrencyNotation  
 * @property { TotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { OfficeInvoicePreviewDto[] } items  
 */
export const FindByOfficeResponseSchema = z.object({ ...OfficeInvoiceListResponseDtoSchema.shape, ...z.object({ items: z.array(OfficeInvoicePreviewDtoSchema).nullable() }).partial().shape });
export type FindByOfficeResponse = z.infer<typeof FindByOfficeResponseSchema>;

/** 
 * GetUnChargesOrderParamEnumSchema 
 * @type { enum }
 */
export const GetUnChargesOrderParamEnumSchema = z.enum(["chargeItemId", "orderPosition", "serviceDate", "receiverId", "positionNumber", "chargeTypeId", "currency", "vatRuleId"]);
export type GetUnChargesOrderParamEnum = z.infer<typeof GetUnChargesOrderParamEnumSchema>;
export const GetUnChargesOrderParamEnum = GetUnChargesOrderParamEnumSchema.enum;

/** 
 * GetUnChargesResponseSchema 
 * @type { object }
 * @property { UninvoicedChargeTotalAmountDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { UninvoicedChargeDto[] } items  
 */
export const GetUnChargesResponseSchema = z.object({ ...UninvoicedChargeListResponseDtoSchema.shape, ...z.object({ items: z.array(UninvoicedChargeDtoSchema).nullable() }).partial().shape });
export type GetUnChargesResponse = z.infer<typeof GetUnChargesResponseSchema>;

/** 
 * InvoicesListAvailablePartnersForResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.BusinessPartnerLabelResponseDTO[] } items  
 */
export const InvoicesListAvailablePartnersForResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).nullable() }).partial().shape });
export type InvoicesListAvailablePartnersForResponse = z.infer<typeof InvoicesListAvailablePartnersForResponseSchema>;

/** 
 * GetOfficeUnChargesOrderParamEnumSchema 
 * @type { enum }
 */
export const GetOfficeUnChargesOrderParamEnumSchema = z.enum(["chargeItemId", "orderPosition", "serviceDate", "receiverId", "positionNumber", "chargeTypeId", "currency", "vatRuleId"]);
export type GetOfficeUnChargesOrderParamEnum = z.infer<typeof GetOfficeUnChargesOrderParamEnumSchema>;
export const GetOfficeUnChargesOrderParamEnum = GetOfficeUnChargesOrderParamEnumSchema.enum;

/** 
 * GetOfficeUnChargesResponseSchema 
 * @type { object }
 * @property { UninvoicedChargeTotalAmountDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { UninvoicedChargeDto[] } items  
 */
export const GetOfficeUnChargesResponseSchema = z.object({ ...UninvoicedChargeListResponseDtoSchema.shape, ...z.object({ items: z.array(UninvoicedChargeDtoSchema).nullable() }).partial().shape });
export type GetOfficeUnChargesResponse = z.infer<typeof GetOfficeUnChargesResponseSchema>;

}
