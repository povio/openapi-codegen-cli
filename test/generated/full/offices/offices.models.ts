import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace OfficesModels {
/** 
 * OfficeCurrencyResponseDtoSchema 
 * @type { object }
 * @property { string } isoCode  
 * @property { string } name  
 */
export const OfficeCurrencyResponseDtoSchema = z.object({ isoCode: z.string(), name: z.string() }).readonly();
export type OfficeCurrencyResponseDto = z.infer<typeof OfficeCurrencyResponseDtoSchema>;

/** 
 * OfficeBankAccountCurrencyMappingResponseDtoSchema 
 * @type { object }
 * @property { string } currency  
 * @property { string } bankAccountId  
 * @property { string } bankAccountName  
 */
export const OfficeBankAccountCurrencyMappingResponseDtoSchema = z.object({ currency: z.string(), bankAccountId: z.string(), bankAccountName: z.string() }).readonly();
export type OfficeBankAccountCurrencyMappingResponseDto = z.infer<typeof OfficeBankAccountCurrencyMappingResponseDtoSchema>;

/** 
 * OfficeBookkeepingResponseDtoSchema 
 * @type { object }
 * @property { string } generalLedgerSystem  
 * @property { OfficeCurrencyResponseDto } defaultCurrency  
 * @property { OfficeCurrencyResponseDto[] } availableCurrencies  
 * @property { boolean } showPaymentInstructions  
 * @property { boolean } showCompanyRegistrationNumber  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { boolean } reportInvoicesToHungarianTaxAuthority  
 * @property { OfficeBankAccountCurrencyMappingResponseDto[] } bankAccountCurrencyMapping  
 * @property { string } costCenterId  
 * @property { string } minimumOutgoingInvoiceDate  
 * @property { string } minimumOutgoingInvoiceServiceDate  
 * @property { string } minimumIncomingInvoiceDate  
 * @property { string } minimumIncomingInvoiceServiceDate  
 * @property { boolean } factoringReportingEnabled  
 */
export const OfficeBookkeepingResponseDtoSchema = z.object({ generalLedgerSystem: z.string(), defaultCurrency: OfficeCurrencyResponseDtoSchema.nullish(), availableCurrencies: z.array(OfficeCurrencyResponseDtoSchema).readonly(), showPaymentInstructions: z.boolean(), showCompanyRegistrationNumber: z.boolean(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), reportInvoicesToHungarianTaxAuthority: z.boolean(), bankAccountCurrencyMapping: z.array(OfficeBankAccountCurrencyMappingResponseDtoSchema).readonly(), costCenterId: z.string().nullish(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), factoringReportingEnabled: z.boolean() }).readonly();
export type OfficeBookkeepingResponseDto = z.infer<typeof OfficeBookkeepingResponseDtoSchema>;

/** 
 * OfficeDocumentPartEnumSchema 
 * @type { enum }
 */
export const OfficeDocumentPartEnumSchema = z.enum(["DocumentFooter", "DocumentHeader", "GeneralTermsAndConditions", "BLTermsAndConditions", "FinanceDocumentFooter"]);
export type OfficeDocumentPartEnum = z.infer<typeof OfficeDocumentPartEnumSchema>;
export const OfficeDocumentPartEnum = OfficeDocumentPartEnumSchema.enum;

/** 
 * OfficeDocumentSettingsResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } mediaUrl  
 * @property { CommonModels.LanguageEnum } language  
 * @property { OfficeDocumentPartEnum } documentPart  
 */
export const OfficeDocumentSettingsResponseDtoSchema = z.object({ id: z.string(), mediaUrl: z.string(), language: CommonModels.LanguageEnumSchema, documentPart: OfficeDocumentPartEnumSchema }).readonly();
export type OfficeDocumentSettingsResponseDto = z.infer<typeof OfficeDocumentSettingsResponseDtoSchema>;

/** 
 * AddressResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the address 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } city City name 
 * @property { string } district District 
 * @property { string } isoCode2 2 letter country code 
 * @property { string } country Country name 
 * @property { string } isoCode3 3 letter country code 
 */
export const AddressResponseDTOSchema = z.object({ id: z.string().describe("ID of the address"), street: z.string().describe("Street address"), secondaryStreet: z.string().describe("Secondary street address"), zip: z.string().describe("ZIP/Postal code"), city: z.string().describe("City name"), district: z.string().describe("District"), isoCode2: z.string().describe("2 letter country code"), country: z.string().describe("Country name"), isoCode3: z.string().describe("3 letter country code") }).readonly();
export type AddressResponseDTO = z.infer<typeof AddressResponseDTOSchema>;

/** 
 * OfficeRepresentingBusinessPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string[] } types  
 * @property { string[] } email  
 * @property { string[] } phone  
 * @property { string } addressId  
 * @property { AddressResponseDTO } address  
 */
export const OfficeRepresentingBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string(), types: z.array(z.string()).readonly(), email: z.array(z.string()).readonly().nullish(), phone: z.array(z.string()).readonly().nullish(), addressId: z.string().nullish(), address: AddressResponseDTOSchema.nullish() }).readonly();
export type OfficeRepresentingBusinessPartnerResponseDto = z.infer<typeof OfficeRepresentingBusinessPartnerResponseDtoSchema>;

/** 
 * OfficePaymentTermsResponseDtoSchema 
 * @type { object }
 * @property { number } days  
 * @property { string } relativeTo  
 */
export const OfficePaymentTermsResponseDtoSchema = z.object({ days: z.number(), relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema }).readonly();
export type OfficePaymentTermsResponseDto = z.infer<typeof OfficePaymentTermsResponseDtoSchema>;

/** 
 * OfficeCountryResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const OfficeCountryResponseDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type OfficeCountryResponseDto = z.infer<typeof OfficeCountryResponseDtoSchema>;

/** 
 * OfficeBankAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } bankName  
 * @property { string } iban  
 * @property { string } swiftBic  
 * @property { boolean } useFooterOnInvoice  
 * @property { object } footer  
 * @property { string } footer.mediaUrl  
 * @property { boolean } isFactoringBank  
 */
export const OfficeBankAccountResponseDtoSchema = z.object({ id: z.string(), name: z.string(), bankName: z.string(), iban: z.string(), swiftBic: z.string(), useFooterOnInvoice: z.boolean(), footer: z.object({ mediaUrl: z.string() }).readonly().nullish(), isFactoringBank: z.boolean() }).readonly();
export type OfficeBankAccountResponseDto = z.infer<typeof OfficeBankAccountResponseDtoSchema>;

/** 
 * OfficeDetailResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } symbol  
 * @property { number } invoicePrefix  
 * @property { number } autoClosePositionsAfterDays  
 * @property { string } defaultLanguage  
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } vatId  
 * @property { string } taxNumber  
 * @property { boolean } restrictPositionInvolvedParties  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { boolean } usePartnerMatchCodes  
 * @property { boolean } restrictFinancePartnersToRelationship  
 * @property { OfficePaymentTermsResponseDto } termsExport  
 * @property { OfficePaymentTermsResponseDto } termsImport  
 * @property { OfficeCountryResponseDto } country  
 * @property { OfficeBankAccountResponseDto[] } bankAccounts  
 * @property { OfficeBookkeepingResponseDto } bookkeeping  
 * @property { OfficeDocumentSettingsResponseDto[] } documentSettings  
 * @property { OfficeRepresentingBusinessPartnerResponseDto } representingBusinessPartner  
 * @property { boolean } hasInttraCredentials  
 */
export const OfficeDetailResponseDtoSchema = z.object({ id: z.string(), name: z.string(), symbol: z.string().nullable(), invoicePrefix: z.number().nullable(), autoClosePositionsAfterDays: z.number().nullish(), defaultLanguage: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullish(), vatId: z.string().nullable(), taxNumber: z.string().nullable(), restrictPositionInvolvedParties: z.boolean(), showWatermarkOnDocuments: z.boolean(), usePartnerMatchCodes: z.boolean(), restrictFinancePartnersToRelationship: z.boolean(), termsExport: OfficePaymentTermsResponseDtoSchema.nullable(), termsImport: OfficePaymentTermsResponseDtoSchema.nullable(), country: OfficeCountryResponseDtoSchema.nullable(), bankAccounts: z.array(OfficeBankAccountResponseDtoSchema).readonly(), bookkeeping: OfficeBookkeepingResponseDtoSchema, documentSettings: z.array(OfficeDocumentSettingsResponseDtoSchema).readonly(), representingBusinessPartner: OfficeRepresentingBusinessPartnerResponseDtoSchema.nullable(), hasInttraCredentials: z.boolean().nullish() }).readonly();
export type OfficeDetailResponseDto = z.infer<typeof OfficeDetailResponseDtoSchema>;

/** 
 * OfficeResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } symbol  
 * @property { number } invoicePrefix  
 * @property { number } autoClosePositionsAfterDays  
 * @property { string } defaultLanguage  
 * @property { CommonModels.LocaleEnum } locale  
 * @property { string } vatId  
 * @property { string } taxNumber  
 * @property { OfficePaymentTermsResponseDto } termsExport  
 * @property { OfficePaymentTermsResponseDto } termsImport  
 * @property { boolean } showPaymentInstructions  
 * @property { boolean } showCompanyRegistrationNumber  
 * @property { boolean } restrictPositionInvolvedParties  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { boolean } usePartnerMatchCodes  
 * @property { boolean } restrictFinancePartnersToRelationship  
 * @property { boolean } reportInvoicesToHungarianTaxAuthority  
 * @property { string } costCenterId  
 * @property { string } minimumOutgoingInvoiceDate  
 * @property { string } minimumOutgoingInvoiceServiceDate  
 * @property { string } minimumIncomingInvoiceDate  
 * @property { string } minimumIncomingInvoiceServiceDate  
 * @property { string } countryId  
 * @property { string } defaultCurrencyId  
 * @property { string[] } availableCurrencyIds  
 * @property { string } generalLedgerSystem  
 * @property { string } representingBusinessPartnerId  
 * @property { OfficeRepresentingBusinessPartnerResponseDto } representingBusinessPartner  
 * @property { boolean } factoringReportingEnabled  
 */
export const OfficeResponseDtoSchema = z.object({ id: z.string(), name: z.string(), symbol: z.string().nullable(), invoicePrefix: z.number().nullable(), autoClosePositionsAfterDays: z.number().nullish(), defaultLanguage: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullish(), vatId: z.string().nullable(), taxNumber: z.string().nullable(), termsExport: OfficePaymentTermsResponseDtoSchema.nullable(), termsImport: OfficePaymentTermsResponseDtoSchema.nullable(), showPaymentInstructions: z.boolean(), showCompanyRegistrationNumber: z.boolean(), restrictPositionInvolvedParties: z.boolean(), showWatermarkOnDocuments: z.boolean(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), usePartnerMatchCodes: z.boolean(), restrictFinancePartnersToRelationship: z.boolean(), reportInvoicesToHungarianTaxAuthority: z.boolean(), costCenterId: z.string().nullish(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), countryId: z.string().nullable(), defaultCurrencyId: z.string().nullable(), availableCurrencyIds: z.array(z.string()).readonly().nullable(), generalLedgerSystem: z.string().nullable(), representingBusinessPartnerId: z.string().nullable(), representingBusinessPartner: OfficeRepresentingBusinessPartnerResponseDtoSchema.nullable(), factoringReportingEnabled: z.boolean() }).readonly();
export type OfficeResponseDto = z.infer<typeof OfficeResponseDtoSchema>;

/** 
 * UpdateOfficePaymentTermsRequestSchema 
 * @type { object }
 * @property { number } days  
 * @property { string } relativeTo  
 */
export const UpdateOfficePaymentTermsRequestSchema = z.object({ days: z.number(), relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema }).readonly();
export type UpdateOfficePaymentTermsRequest = z.infer<typeof UpdateOfficePaymentTermsRequestSchema>;

/** 
 * UpdateOfficeBankAccountCurrencyMappingSchema 
 * @type { object }
 * @property { string } currency  
 * @property { string } bankAccountId  
 */
export const UpdateOfficeBankAccountCurrencyMappingSchema = z.object({ currency: z.string(), bankAccountId: z.string() }).readonly();
export type UpdateOfficeBankAccountCurrencyMapping = z.infer<typeof UpdateOfficeBankAccountCurrencyMappingSchema>;

/** 
 * UpdateOfficeRequestSchema 
 * @type { object }
 * @property { string } name Office Name 
 * @property { string } symbol Office Symbol 
 * @property { number } invoicePrefix Office Invoice Prefix 
 * @property { number } autoClosePositionsAfterDays  
 * @property { string } defaultLanguage Office Default Language 
 * @property { string } locale  
 * @property { string } vatId Office Vat Id 
 * @property { string } taxNumber Office Tax Number 
 * @property { UpdateOfficePaymentTermsRequest } termsExport Office Terms Export 
 * @property { UpdateOfficePaymentTermsRequest } termsImport Office Terms Import 
 * @property { boolean } showPaymentInstructions Office Show Payment Instructions 
 * @property { boolean } showCompanyRegistrationNumber  
 * @property { boolean } reportInvoicesToHungarianTaxAuthority  
 * @property { boolean } restrictPositionInvolvedParties  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { boolean } usePartnerMatchCodes  
 * @property { boolean } restrictFinancePartnersToRelationship  
 * @property { string } costCenterId  
 * @property { string } minimumOutgoingInvoiceDate  
 * @property { string } minimumOutgoingInvoiceServiceDate  
 * @property { string } minimumIncomingInvoiceDate  
 * @property { string } minimumIncomingInvoiceServiceDate  
 * @property { string } countryId Office country id 
 * @property { string } defaultCurrencyId Office default currency id 
 * @property { string } representingBusinessPartnerId Representing business partner id 
 * @property { string[] } availableCurrencyIds Office availableCurrencyIds 
 * @property { string } generalLedgerSystem Office general ledger system 
 * @property { boolean } factoringReportingEnabled  
 * @property { UpdateOfficeBankAccountCurrencyMapping[] } bankAccountCurrencyMapping Office bank account currency mapping 
 */
export const UpdateOfficeRequestSchema = z.object({ name: z.string().describe("Office Name"), symbol: z.string().describe("Office Symbol"), invoicePrefix: z.number().describe("Office Invoice Prefix"), autoClosePositionsAfterDays: z.number(), defaultLanguage: z.string().describe("Office Default Language"), locale: CommonModels.LocaleEnumSchema, vatId: z.string().describe("Office Vat Id"), taxNumber: z.string().describe("Office Tax Number"), termsExport: UpdateOfficePaymentTermsRequestSchema.describe("Office Terms Export"), termsImport: UpdateOfficePaymentTermsRequestSchema.describe("Office Terms Import"), showPaymentInstructions: z.boolean().describe("Office Show Payment Instructions"), showCompanyRegistrationNumber: z.boolean(), reportInvoicesToHungarianTaxAuthority: z.boolean(), restrictPositionInvolvedParties: z.boolean(), showWatermarkOnDocuments: z.boolean(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), usePartnerMatchCodes: z.boolean(), restrictFinancePartnersToRelationship: z.boolean(), costCenterId: z.string(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }), countryId: z.string().describe("Office country id"), defaultCurrencyId: z.string().describe("Office default currency id"), representingBusinessPartnerId: z.string().describe("Representing business partner id"), availableCurrencyIds: z.array(z.string()).readonly().describe("Office availableCurrencyIds"), generalLedgerSystem: z.string().describe("Office general ledger system"), factoringReportingEnabled: z.boolean(), bankAccountCurrencyMapping: z.array(UpdateOfficeBankAccountCurrencyMappingSchema).readonly().describe("Office bank account currency mapping") }).readonly();
export type UpdateOfficeRequest = z.infer<typeof UpdateOfficeRequestSchema>;

/** 
 * UploadOfficeDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } fileName File name with extension 
 * @property { string } mimeType MIME type of the file 
 * @property { number } fileSize Size of the file 
 * @property { string } language Language of the document 
 * @property { string } documentPart Part of the document this image represents 
 */
export const UploadOfficeDocumentRequestDtoSchema = z.object({ fileName: z.string().describe("File name with extension"), mimeType: z.string().describe("MIME type of the file"), fileSize: z.number().describe("Size of the file"), language: CommonModels.LanguageEnumSchema.describe("Language of the document"), documentPart: OfficeDocumentPartEnumSchema.describe("Part of the document this image represents") }).readonly();
export type UploadOfficeDocumentRequestDto = z.infer<typeof UploadOfficeDocumentRequestDtoSchema>;

/** 
 * OfficeListItemResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { number } numberOfEmployees  
 */
export const OfficeListItemResponseSchema = z.object({ id: z.string(), name: z.string(), numberOfEmployees: z.number() }).readonly();
export type OfficeListItemResponse = z.infer<typeof OfficeListItemResponseSchema>;

/** 
 * OfficeFilterDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } search  
 */
export const OfficeFilterDtoSchema = z.object({ name: z.string().describe("Name"), search: z.string() }).readonly();
export type OfficeFilterDto = z.infer<typeof OfficeFilterDtoSchema>;

/** 
 * OfficeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const OfficeLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type OfficeLabelFilterDto = z.infer<typeof OfficeLabelFilterDtoSchema>;

/** 
 * CreateOfficeRequestSchema 
 * @type { object }
 * @property { string } name  
 */
export const CreateOfficeRequestSchema = z.object({ name: z.string() }).readonly();
export type CreateOfficeRequest = z.infer<typeof CreateOfficeRequestSchema>;

/** 
 * DocumentImageUploadInstructionsDtoSchema 
 * @type { object }
 * @property { string } method HTTP method to use for upload 
 * @property { string } url URL to upload the file to 
 * @property { string } documentId ID of the created/updated document setting 
 */
export const DocumentImageUploadInstructionsDtoSchema = z.object({ method: z.string().describe("HTTP method to use for upload"), url: z.string().describe("URL to upload the file to"), documentId: z.string().describe("ID of the created/updated document setting") }).readonly();
export type DocumentImageUploadInstructionsDto = z.infer<typeof DocumentImageUploadInstructionsDtoSchema>;

/** 
 * CreateOfficeBankAccountDtoSchema 
 * @type { object }
 * @property { string } name Bank account name 
 * @property { string } bankName Bank name 
 * @property { string } iban IBAN 
 * @property { string } swiftBic SWIFT/BIC code 
 * @property { boolean } useFooterOnInvoice Use footer on invoice 
 */
export const CreateOfficeBankAccountDtoSchema = z.object({ name: z.string().describe("Bank account name"), bankName: z.string().describe("Bank name"), iban: z.string().describe("IBAN"), swiftBic: z.string().describe("SWIFT/BIC code"), useFooterOnInvoice: z.boolean().describe("Use footer on invoice") }).readonly();
export type CreateOfficeBankAccountDto = z.infer<typeof CreateOfficeBankAccountDtoSchema>;

/** 
 * UpdateOfficeBankAccountDtoSchema 
 * @type { object }
 * @property { string } name Bank account name 
 * @property { string } bankName Bank name 
 * @property { string } iban IBAN 
 * @property { string } swiftBic SWIFT/BIC code 
 * @property { boolean } useFooterOnInvoice Use footer on invoice 
 * @property { boolean } isFactoringBank Is factoring bank 
 */
export const UpdateOfficeBankAccountDtoSchema = z.object({ name: z.string().describe("Bank account name"), bankName: z.string().describe("Bank name"), iban: z.string().describe("IBAN"), swiftBic: z.string().describe("SWIFT/BIC code"), useFooterOnInvoice: z.boolean().describe("Use footer on invoice"), isFactoringBank: z.boolean().describe("Is factoring bank") }).readonly();
export type UpdateOfficeBankAccountDto = z.infer<typeof UpdateOfficeBankAccountDtoSchema>;

/** 
 * UploadOfficeBankAccountFooterRequestDtoSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType File MIME type 
 * @property { number } fileSize Size of the file 
 */
export const UploadOfficeBankAccountFooterRequestDtoSchema = z.object({ fileName: z.string().describe("File name"), mimeType: z.string().describe("File MIME type"), fileSize: z.number().describe("Size of the file") }).readonly();
export type UploadOfficeBankAccountFooterRequestDto = z.infer<typeof UploadOfficeBankAccountFooterRequestDtoSchema>;

/** 
 * OfficesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const OfficesPaginateOrderParamEnumSchema = z.enum(["name"]);
export type OfficesPaginateOrderParamEnum = z.infer<typeof OfficesPaginateOrderParamEnumSchema>;
export const OfficesPaginateOrderParamEnum = OfficesPaginateOrderParamEnumSchema.enum;

/** 
 * OfficesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { OfficeListItemResponse[] } items  
 */
export const OfficesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(OfficeListItemResponseSchema).readonly() }).readonly().shape });
export type OfficesPaginateResponse = z.infer<typeof OfficesPaginateResponseSchema>;

/** 
 * FindAllLabelsResponseSchema 
 * @type { array }
 */
export const FindAllLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema).readonly();
export type FindAllLabelsResponse = z.infer<typeof FindAllLabelsResponseSchema>;

/** 
 * OfficesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const OfficesPaginateLabelsOrderParamEnumSchema = z.enum(["name"]);
export type OfficesPaginateLabelsOrderParamEnum = z.infer<typeof OfficesPaginateLabelsOrderParamEnumSchema>;
export const OfficesPaginateLabelsOrderParamEnum = OfficesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * OfficesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const OfficesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type OfficesPaginateLabelsResponse = z.infer<typeof OfficesPaginateLabelsResponseSchema>;

}
