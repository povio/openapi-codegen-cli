import { z } from "zod";

export namespace CommonModels {
/** 
 * TypeEnumSchema 
 * @type { enum }
 * @description Working document type
 */
export const TypeEnumSchema = z.enum(["export-declaration", "house-bl", "master-bl", "house-awb", "master-awb", "bl-instructions", "ams-instructions", "cmr-form", "fcr-form", "isf-form", "templated-document", "shipping-instructions"]);
export type TypeEnum = z.infer<typeof TypeEnumSchema>;
export const TypeEnum = TypeEnumSchema.enum;

/** 
 * TargetEntityNameEnumSchema 
 * @type { enum }
 */
export const TargetEntityNameEnumSchema = z.enum(["invoice", "quote"]);
export type TargetEntityNameEnum = z.infer<typeof TargetEntityNameEnumSchema>;
export const TargetEntityNameEnum = TargetEntityNameEnumSchema.enum;

/** 
 * PositionCargoPackageEnumSchema 
 * @type { enum }
 */
export const PositionCargoPackageEnumSchema = z.enum(["Hazardous", "NonStackable", "TemperatureControlled", "OversizedCargo", "DiplomaticCargo"]);
export type PositionCargoPackageEnum = z.infer<typeof PositionCargoPackageEnumSchema>;
export const PositionCargoPackageEnum = PositionCargoPackageEnumSchema.enum;

/** 
 * HazardousSpecialtyEnumSchema 
 * @type { enum }
 */
export const HazardousSpecialtyEnumSchema = z.enum(["Explosives", "FlammableGas", "NonToxicAndFlammableGas", "PoisonGases", "FlammableLiquid", "FlammableSolid", "SpontaneouslyCombustible", "DangerousWhenWet", "Oxidizers", "OrganicPeroxides", "Poison", "InfectiousSubstances", "Radioactive", "Corrosive", "MiscellaneousDangerousSubstances"]);
export type HazardousSpecialtyEnum = z.infer<typeof HazardousSpecialtyEnumSchema>;
export const HazardousSpecialtyEnum = HazardousSpecialtyEnumSchema.enum;

/** 
 * RateOptionsEnumSchema 
 * @type { enum }
 */
export const RateOptionsEnumSchema = z.enum(["AsAgreed", "SpotRate"]);
export type RateOptionsEnum = z.infer<typeof RateOptionsEnumSchema>;
export const RateOptionsEnum = RateOptionsEnumSchema.enum;

/** 
 * RateClassEnumSchema 
 * @type { enum }
 */
export const RateClassEnumSchema = z.enum(["MinimumCharge", "NormalRate", "QuantityRate"]);
export type RateClassEnum = z.infer<typeof RateClassEnumSchema>;
export const RateClassEnum = RateClassEnumSchema.enum;

/** 
 * AccountInformationEnumSchema 
 * @type { enum }
 * @description Account information
 */
export const AccountInformationEnumSchema = z.enum(["FreightCollect", "FreightPrepaid"]);
export type AccountInformationEnum = z.infer<typeof AccountInformationEnumSchema>;
export const AccountInformationEnum = AccountInformationEnumSchema.enum;

/** 
 * EnsDeclarationEnumSchema 
 * @type { enum }
 * @description ENS declaration
 */
export const EnsDeclarationEnumSchema = z.enum(["Carrier", "Self"]);
export type EnsDeclarationEnum = z.infer<typeof EnsDeclarationEnumSchema>;
export const EnsDeclarationEnum = EnsDeclarationEnumSchema.enum;

/** 
 * IssuedHouseBillsEnumSchema 
 * @type { enum }
 * @description Issued house bills
 */
export const IssuedHouseBillsEnumSchema = z.enum(["None", "One", "Multiple"]);
export type IssuedHouseBillsEnum = z.infer<typeof IssuedHouseBillsEnumSchema>;
export const IssuedHouseBillsEnum = IssuedHouseBillsEnumSchema.enum;

/** 
 * WoodDeclarationEnumSchema 
 * @type { enum }
 * @description Wood declaration
 */
export const WoodDeclarationEnumSchema = z.enum(["NoWood", "TreatedAndCertified", "NotTreatedAndNotCertified", "Processed"]);
export type WoodDeclarationEnum = z.infer<typeof WoodDeclarationEnumSchema>;
export const WoodDeclarationEnum = WoodDeclarationEnumSchema.enum;

/** 
 * ImportStatusEnumSchema 
 * @type { enum }
 * @description Import result status
 */
export const ImportStatusEnumSchema = z.enum(["Success", "Warning", "Error"]);
export type ImportStatusEnum = z.infer<typeof ImportStatusEnumSchema>;
export const ImportStatusEnum = ImportStatusEnumSchema.enum;

/** 
 * WorkingDocumentCreatedByResponseDTOSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } name Employee name 
 */
export const WorkingDocumentCreatedByResponseDTOSchema = z.object({ id: z.string(), name: z.string().nullable() });
export type WorkingDocumentCreatedByResponseDTO = z.infer<typeof WorkingDocumentCreatedByResponseDTOSchema>;

/** 
 * WorkingDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId Position ID 
 * @property { string } name Working document name 
 * @property { string } nameSuffix Working document name suffix 
 * @property { string } type Working document type 
 * @property { string } referenceTable Reference table 
 * @property { string } referenceId Reference ID 
 * @property { string } createdById Created by 
 * @property { string } createdAt Created at 
 * @property { WorkingDocumentsModels.WorkingDocumentCreatedByResponseDTO } createdBy Created by 
 */
export const WorkingDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), name: z.string(), nameSuffix: z.string().nullish(), type: TypeEnumSchema, referenceTable: z.string(), referenceId: z.string(), createdById: z.string(), createdAt: z.iso.datetime({ offset: true }), createdBy: WorkingDocumentCreatedByResponseDTOSchema });
export type WorkingDocumentResponseDTO = z.infer<typeof WorkingDocumentResponseDTOSchema>;

/** 
 * OfficeCurrencyResponseDtoSchema 
 * @type { object }
 * @property { string } isoCode  
 * @property { string } name  
 */
export const OfficeCurrencyResponseDtoSchema = z.object({ isoCode: z.string(), name: z.string() });
export type OfficeCurrencyResponseDto = z.infer<typeof OfficeCurrencyResponseDtoSchema>;

/** 
 * OfficeBankAccountCurrencyMappingResponseDtoSchema 
 * @type { object }
 * @property { string } currency  
 * @property { string } bankAccountId  
 * @property { string } bankAccountName  
 */
export const OfficeBankAccountCurrencyMappingResponseDtoSchema = z.object({ currency: z.string(), bankAccountId: z.string(), bankAccountName: z.string() });
export type OfficeBankAccountCurrencyMappingResponseDto = z.infer<typeof OfficeBankAccountCurrencyMappingResponseDtoSchema>;

/** 
 * OfficeBookkeepingResponseDtoSchema 
 * @type { object }
 * @property { string } generalLedgerSystem  
 * @property { OfficesModels.OfficeCurrencyResponseDto } defaultCurrency  
 * @property { OfficesModels.OfficeCurrencyResponseDto[] } availableCurrencies  
 * @property { boolean } showPaymentInstructions  
 * @property { boolean } showCompanyRegistrationNumber  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { boolean } reportInvoicesToHungarianTaxAuthority  
 * @property { OfficesModels.OfficeBankAccountCurrencyMappingResponseDto[] } bankAccountCurrencyMapping  
 * @property { string } costCenterId  
 * @property { string } minimumOutgoingInvoiceDate  
 * @property { string } minimumOutgoingInvoiceServiceDate  
 * @property { string } minimumIncomingInvoiceDate  
 * @property { string } minimumIncomingInvoiceServiceDate  
 * @property { boolean } factoringReportingEnabled  
 */
export const OfficeBookkeepingResponseDtoSchema = z.object({ generalLedgerSystem: z.string(), defaultCurrency: OfficeCurrencyResponseDtoSchema.nullish(), availableCurrencies: z.array(OfficeCurrencyResponseDtoSchema), showPaymentInstructions: z.boolean(), showCompanyRegistrationNumber: z.boolean(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), reportInvoicesToHungarianTaxAuthority: z.boolean(), bankAccountCurrencyMapping: z.array(OfficeBankAccountCurrencyMappingResponseDtoSchema), costCenterId: z.string().nullish(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), factoringReportingEnabled: z.boolean() });
export type OfficeBookkeepingResponseDto = z.infer<typeof OfficeBookkeepingResponseDtoSchema>;

/** 
 * LanguageEnumSchema 
 * @type { enum }
 */
export const LanguageEnumSchema = z.enum(["English", "German", "Hungarian", "Czech", "Turkish", "Slovenian"]);
export type LanguageEnum = z.infer<typeof LanguageEnumSchema>;
export const LanguageEnum = LanguageEnumSchema.enum;

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
 * @property { LanguageEnum } language  
 * @property { OfficesModels.OfficeDocumentPartEnum } documentPart  
 */
export const OfficeDocumentSettingsResponseDtoSchema = z.object({ id: z.string(), mediaUrl: z.string(), language: CommonModels.LanguageEnumSchema, documentPart: OfficeDocumentPartEnumSchema });
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
export const AddressResponseDTOSchema = z.object({ id: z.string(), street: z.string(), secondaryStreet: z.string(), zip: z.string(), city: z.string(), district: z.string(), isoCode2: z.string(), country: z.string(), isoCode3: z.string() });
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
 * @property { OfficesModels.AddressResponseDTO } address  
 */
export const OfficeRepresentingBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string(), types: z.array(z.string()), email: z.array(z.string()).nullish(), phone: z.array(z.string()).nullish(), addressId: z.string().nullish(), address: AddressResponseDTOSchema.nullish() });
export type OfficeRepresentingBusinessPartnerResponseDto = z.infer<typeof OfficeRepresentingBusinessPartnerResponseDtoSchema>;

/** 
 * LocaleEnumSchema 
 * @type { enum }
 */
export const LocaleEnumSchema = z.enum(["en-US", "de-DE", "cs-CZ", "sl-SI", "tr-TR", "hu-HU"]);
export type LocaleEnum = z.infer<typeof LocaleEnumSchema>;
export const LocaleEnum = LocaleEnumSchema.enum;

/** 
 * OfficePaymentTermsDateTypeSchema 
 * @type { enum }
 */
export const OfficePaymentTermsDateTypeSchema = z.enum(["InvoiceDate", "ServiceDate"]);
export type OfficePaymentTermsDateType = z.infer<typeof OfficePaymentTermsDateTypeSchema>;
export const OfficePaymentTermsDateType = OfficePaymentTermsDateTypeSchema.enum;

/** 
 * OfficePaymentTermsResponseDtoSchema 
 * @type { object }
 * @property { number } days  
 * @property { string } relativeTo  
 */
export const OfficePaymentTermsResponseDtoSchema = z.object({ days: z.number().nullable(), relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema.nullable() }).partial();
export type OfficePaymentTermsResponseDto = z.infer<typeof OfficePaymentTermsResponseDtoSchema>;

/** 
 * OfficeCountryResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const OfficeCountryResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
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
export const OfficeBankAccountResponseDtoSchema = z.object({ id: z.string(), name: z.string(), bankName: z.string(), iban: z.string(), swiftBic: z.string(), useFooterOnInvoice: z.boolean(), footer: z.object({ mediaUrl: z.string() }).nullish(), isFactoringBank: z.boolean() });
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
 * @property { LocaleEnum } locale  
 * @property { string } vatId  
 * @property { string } taxNumber  
 * @property { boolean } restrictPositionInvolvedParties  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { boolean } usePartnerMatchCodes  
 * @property { boolean } restrictFinancePartnersToRelationship  
 * @property { OfficesModels.OfficePaymentTermsResponseDto } termsExport  
 * @property { OfficesModels.OfficePaymentTermsResponseDto } termsImport  
 * @property { OfficesModels.OfficeCountryResponseDto } country  
 * @property { OfficesModels.OfficeBankAccountResponseDto[] } bankAccounts  
 * @property { OfficesModels.OfficeBookkeepingResponseDto } bookkeeping  
 * @property { OfficesModels.OfficeDocumentSettingsResponseDto[] } documentSettings  
 * @property { OfficesModels.OfficeRepresentingBusinessPartnerResponseDto } representingBusinessPartner  
 * @property { boolean } hasInttraCredentials  
 */
export const OfficeDetailResponseDtoSchema = z.object({ id: z.string(), name: z.string(), symbol: z.string().nullable(), invoicePrefix: z.number().nullable(), autoClosePositionsAfterDays: z.number().nullish(), defaultLanguage: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullish(), vatId: z.string().nullable(), taxNumber: z.string().nullable(), restrictPositionInvolvedParties: z.boolean(), showWatermarkOnDocuments: z.boolean(), usePartnerMatchCodes: z.boolean(), restrictFinancePartnersToRelationship: z.boolean(), termsExport: OfficePaymentTermsResponseDtoSchema.nullable(), termsImport: OfficePaymentTermsResponseDtoSchema.nullable(), country: OfficeCountryResponseDtoSchema.nullable(), bankAccounts: z.array(OfficeBankAccountResponseDtoSchema), bookkeeping: OfficeBookkeepingResponseDtoSchema, documentSettings: z.array(OfficeDocumentSettingsResponseDtoSchema), representingBusinessPartner: OfficeRepresentingBusinessPartnerResponseDtoSchema.nullable(), hasInttraCredentials: z.boolean().nullish() });
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
 * @property { LocaleEnum } locale  
 * @property { string } vatId  
 * @property { string } taxNumber  
 * @property { OfficesModels.OfficePaymentTermsResponseDto } termsExport  
 * @property { OfficesModels.OfficePaymentTermsResponseDto } termsImport  
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
 * @property { OfficesModels.OfficeRepresentingBusinessPartnerResponseDto } representingBusinessPartner  
 * @property { boolean } factoringReportingEnabled  
 */
export const OfficeResponseDtoSchema = z.object({ id: z.string(), name: z.string(), symbol: z.string().nullable(), invoicePrefix: z.number().nullable(), autoClosePositionsAfterDays: z.number().nullish(), defaultLanguage: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullish(), vatId: z.string().nullable(), taxNumber: z.string().nullable(), termsExport: OfficePaymentTermsResponseDtoSchema.nullable(), termsImport: OfficePaymentTermsResponseDtoSchema.nullable(), showPaymentInstructions: z.boolean(), showCompanyRegistrationNumber: z.boolean(), restrictPositionInvolvedParties: z.boolean(), showWatermarkOnDocuments: z.boolean(), showInvoiceVatLinesInOfficeCurrency: z.boolean(), usePartnerMatchCodes: z.boolean(), restrictFinancePartnersToRelationship: z.boolean(), reportInvoicesToHungarianTaxAuthority: z.boolean(), costCenterId: z.string().nullish(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }).nullish(), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullish(), countryId: z.string().nullable(), defaultCurrencyId: z.string().nullable(), availableCurrencyIds: z.array(z.string()).nullable(), generalLedgerSystem: z.string().nullable(), representingBusinessPartnerId: z.string().nullable(), representingBusinessPartner: OfficeRepresentingBusinessPartnerResponseDtoSchema.nullable(), factoringReportingEnabled: z.boolean() });
export type OfficeResponseDto = z.infer<typeof OfficeResponseDtoSchema>;

/** 
 * UpdateOfficePaymentTermsRequestSchema 
 * @type { object }
 * @property { number } days  
 * @property { string } relativeTo  
 */
export const UpdateOfficePaymentTermsRequestSchema = z.object({ days: z.number(), relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema });
export type UpdateOfficePaymentTermsRequest = z.infer<typeof UpdateOfficePaymentTermsRequestSchema>;

/** 
 * UpdateOfficeBankAccountCurrencyMappingSchema 
 * @type { object }
 * @property { string } currency  
 * @property { string } bankAccountId  
 */
export const UpdateOfficeBankAccountCurrencyMappingSchema = z.object({ currency: z.string(), bankAccountId: z.string() });
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
 * @property { OfficesModels.UpdateOfficePaymentTermsRequest } termsExport Office Terms Export 
 * @property { OfficesModels.UpdateOfficePaymentTermsRequest } termsImport Office Terms Import 
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
 * @property { OfficesModels.UpdateOfficeBankAccountCurrencyMapping[] } bankAccountCurrencyMapping Office bank account currency mapping 
 */
export const UpdateOfficeRequestSchema = z.object({ name: z.string().nullable(), symbol: z.string().nullable(), invoicePrefix: z.number().nullable(), autoClosePositionsAfterDays: z.number().nullable(), defaultLanguage: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullable(), vatId: z.string().nullable(), taxNumber: z.string().nullable(), termsExport: UpdateOfficePaymentTermsRequestSchema.nullable(), termsImport: UpdateOfficePaymentTermsRequestSchema.nullable(), showPaymentInstructions: z.boolean().nullable(), showCompanyRegistrationNumber: z.boolean().nullable(), reportInvoicesToHungarianTaxAuthority: z.boolean().nullable(), restrictPositionInvolvedParties: z.boolean().nullable(), showWatermarkOnDocuments: z.boolean().nullable(), showInvoiceVatLinesInOfficeCurrency: z.boolean().nullable(), usePartnerMatchCodes: z.boolean().nullable(), restrictFinancePartnersToRelationship: z.boolean().nullable(), costCenterId: z.string().nullable(), minimumOutgoingInvoiceDate: z.iso.datetime({ offset: true }).nullable(), minimumOutgoingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullable(), minimumIncomingInvoiceDate: z.iso.datetime({ offset: true }).nullable(), minimumIncomingInvoiceServiceDate: z.iso.datetime({ offset: true }).nullable(), countryId: z.string().nullable(), defaultCurrencyId: z.string().nullable(), representingBusinessPartnerId: z.string().nullable(), availableCurrencyIds: z.array(z.string()).nullable(), generalLedgerSystem: z.string().nullable(), factoringReportingEnabled: z.boolean().nullable(), bankAccountCurrencyMapping: z.array(UpdateOfficeBankAccountCurrencyMappingSchema).nullable() }).partial();
export type UpdateOfficeRequest = z.infer<typeof UpdateOfficeRequestSchema>;

/** 
 * CurrencyEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CurrencyEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type CurrencyEmployeeDTO = z.infer<typeof CurrencyEmployeeDTOSchema>;

/** 
 * CurrencyResponseDtoSchema 
 * @type { object }
 * @property { string } isoCode isoCode of the currency 
 * @property { string } name Name of the currency 
 * @property { string } symbol Symbol of the currency 
 * @property { string } alignment Alignment of the currency 
 * @property { string } createdById ID of the employee who created this currency 
 * @property { CurrenciesModels.CurrencyEmployeeDTO } createdBy Employee who created this currency 
 * @property { string } createdAt Date when the currency was created 
 * @property { string } updatedById ID of the employee who last updated this currency 
 * @property { CurrenciesModels.CurrencyEmployeeDTO } updatedBy Employee who last updated this currency 
 * @property { string } updatedAt Date when the currency was last updated 
 */
export const CurrencyResponseDtoSchema = z.object({ isoCode: z.string(), name: z.string(), symbol: z.string().nullish(), alignment: z.string().nullish(), createdById: z.string().nullish(), createdBy: CurrencyEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CurrencyEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type CurrencyResponseDto = z.infer<typeof CurrencyResponseDtoSchema>;

/** 
 * CountryEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CountryEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type CountryEmployeeDTO = z.infer<typeof CountryEmployeeDTOSchema>;

/** 
 * CountryResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the country 
 * @property { string } name Name of the country 
 * @property { string } isoCode2 ISO 2-letter code 
 * @property { string } isoCode3 ISO 3-letter code 
 * @property { string } currencyNotation Currency notation 
 * @property { string } createdById  
 * @property { CountriesModels.CountryEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CountriesModels.CountryEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CountryResponseDTOSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string(), currencyNotation: z.string(), createdById: z.string().nullish(), createdBy: CountryEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CountryEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type CountryResponseDTO = z.infer<typeof CountryResponseDTOSchema>;

/** 
 * TeamEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const TeamEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type TeamEmployeeDTO = z.infer<typeof TeamEmployeeDTOSchema>;

/** 
 * TeamMemberResponseDTOSchema 
 * @type { object }
 * @property { string } employeeId Employee id 
 * @property { string } name Employee name 
 */
export const TeamMemberResponseDTOSchema = z.object({ employeeId: z.string(), name: z.string().nullish() });
export type TeamMemberResponseDTO = z.infer<typeof TeamMemberResponseDTOSchema>;

/** 
 * TeamResponseDTOSchema 
 * @type { object }
 * @property { string } id Team id 
 * @property { string } name Team name 
 * @property { string } officeId Office id 
 * @property { boolean } archived Is archived 
 * @property { string } archivedAt Archived at 
 * @property { string } createdById ID of the employee who created this team 
 * @property { TeamsModels.TeamEmployeeDTO } createdBy Employee who created this team 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this team 
 * @property { TeamsModels.TeamEmployeeDTO } updatedBy Employee who last updated this team 
 * @property { string } updatedAt Updated at 
 * @property { TeamsModels.TeamMemberResponseDTO[] } members Team members ordered by name ascending 
 */
export const TeamResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: TeamEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: TeamEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), members: z.array(TeamMemberResponseDTOSchema) });
export type TeamResponseDTO = z.infer<typeof TeamResponseDTOSchema>;

/** 
 * FolderSymlinkResponseDTOSchema 
 * @type { object }
 * @property { string } targetEntityName  
 * @property { string } targetEntityId  
 */
export const FolderSymlinkResponseDTOSchema = z.object({ targetEntityName: TargetEntityNameEnumSchema, targetEntityId: z.string() });
export type FolderSymlinkResponseDTO = z.infer<typeof FolderSymlinkResponseDTOSchema>;

/** 
 * FolderTreeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } isSystem  
 * @property { boolean } isSymlink  
 * @property { FoldersModels.FolderSymlinkResponseDTO } symlink  
 * @property { FoldersModels.FolderTreeResponseDTO[] } folders  
 */
export const FolderTreeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), isSystem: z.boolean(), isSymlink: z.boolean(), symlink: FolderSymlinkResponseDTOSchema.nullable(), get folders() { return z.array(FolderTreeResponseDTOSchema) } });
export type FolderTreeResponseDTO = z.infer<typeof FolderTreeResponseDTOSchema>;

/** 
 * FolderEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const FolderEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type FolderEmployeeDTO = z.infer<typeof FolderEmployeeDTOSchema>;

/** 
 * FileResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } archived  
 * @property { boolean } isSystem  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { FolderEmployeeDTO } createdBy  
 * @property { FolderEmployeeDTO } updatedBy  
 * @property { string } downloadUrl  
 */
export const FileResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), isSystem: z.boolean(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: CommonModels.FolderEmployeeDTOSchema, updatedBy: CommonModels.FolderEmployeeDTOSchema, downloadUrl: z.string().nullish() });
export type FileResponseDTO = z.infer<typeof FileResponseDTOSchema>;

/** 
 * FolderResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } archived  
 * @property { boolean } isSystem  
 * @property { boolean } isSymlink  
 * @property { FoldersModels.FolderSymlinkResponseDTO } symlink  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { FolderEmployeeDTO } createdBy  
 * @property { FolderEmployeeDTO } updatedBy  
 * @property { FileResponseDTO[] } files  
 * @property { FoldersModels.FolderResponseDTO[] } folders  
 */
export const FolderResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), isSystem: z.boolean(), isSymlink: z.boolean(), symlink: FolderSymlinkResponseDTOSchema.nullable(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: CommonModels.FolderEmployeeDTOSchema, updatedBy: CommonModels.FolderEmployeeDTOSchema, files: z.array(CommonModels.FileResponseDTOSchema), get folders() { return z.array(FolderResponseDTOSchema) } });
export type FolderResponseDTO = z.infer<typeof FolderResponseDTOSchema>;

/** 
 * EditorContentUpdateDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const EditorContentUpdateDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type EditorContentUpdateDto = z.infer<typeof EditorContentUpdateDtoSchema>;

/** 
 * RemarkBlockDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 */
export const RemarkBlockDTOSchema = z.object({ id: z.string().nullable(), enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), content: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type RemarkBlockDTO = z.infer<typeof RemarkBlockDTOSchema>;

/** 
 * TitleBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { string } defaultTitle  
 * @property { boolean } includePositionNumber  
 * @property { boolean } allowManualOverride  
 */
export const TitleBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), defaultTitle: z.string().nullable(), includePositionNumber: z.boolean().nullable(), allowManualOverride: z.boolean().nullable() }).partial();
export type TitleBlockDTO = z.infer<typeof TitleBlockDTOSchema>;

/** 
 * PositionInvolvedPartyTypeEnumSchema 
 * @type { enum }
 */
export const PositionInvolvedPartyTypeEnumSchema = z.enum(["Customer", "Notify", "AlsoNotify", "FOBForwarder", "RoutingAgent", "DeliveryAgent", "TransportProvider", "OceanCarrier", "OriginServiceProvider", "DestinationServiceProvider", "InsuranceProvider", "OriginCustomsAgent", "DestinationCustomsAgent", "StuffingProvider", "StrippingProvider", "Shipper", "Consignee", "CustomsBroker", "Courier", "Trucker", "Airline", "DestinationAgent", "OriginAgent", "FilingAgent"]);
export type PositionInvolvedPartyTypeEnum = z.infer<typeof PositionInvolvedPartyTypeEnumSchema>;
export const PositionInvolvedPartyTypeEnum = PositionInvolvedPartyTypeEnumSchema.enum;

/** 
 * ReceiverBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { string } defaultRole  
 */
export const ReceiverBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), defaultRole: CommonModels.PositionInvolvedPartyTypeEnumSchema.nullable() }).partial();
export type ReceiverBlockDTO = z.infer<typeof ReceiverBlockDTOSchema>;

/** 
 * OurInformationBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } showName  
 * @property { boolean } showPhone  
 * @property { boolean } showDate  
 * @property { boolean } showBookingNumber  
 * @property { boolean } showCustomerReference  
 * @property { boolean } showMasterBillOfLadingNumber  
 * @property { boolean } showHouseBillOfLadingNumber  
 */
export const OurInformationBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), showName: z.boolean().nullable(), showPhone: z.boolean().nullable(), showDate: z.boolean().nullable(), showBookingNumber: z.boolean().nullable(), showCustomerReference: z.boolean().nullable(), showMasterBillOfLadingNumber: z.boolean().nullable(), showHouseBillOfLadingNumber: z.boolean().nullable() }).partial();
export type OurInformationBlockDTO = z.infer<typeof OurInformationBlockDTOSchema>;

/** 
 * RouteTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } showDate  
 * @property { boolean } showLocation  
 * @property { boolean } showType  
 * @property { boolean } showReference  
 * @property { boolean } showVesselVoyage  
 * @property { boolean } showAddress  
 * @property { boolean } showProvider  
 */
export const RouteTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), showDate: z.boolean().nullable(), showLocation: z.boolean().nullable(), showType: z.boolean().nullable(), showReference: z.boolean().nullable(), showVesselVoyage: z.boolean().nullable(), showAddress: z.boolean().nullable(), showProvider: z.boolean().nullable() }).partial();
export type RouteTableBlockDTO = z.infer<typeof RouteTableBlockDTOSchema>;

/** 
 * CargoTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable() }).partial();
export type CargoTableBlockDTO = z.infer<typeof CargoTableBlockDTOSchema>;

/** 
 * CargoSummaryBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoSummaryBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable() }).partial();
export type CargoSummaryBlockDTO = z.infer<typeof CargoSummaryBlockDTOSchema>;

/** 
 * FinanceTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } showOnlyForReceiver  
 * @property { boolean } showVendor  
 * @property { boolean } showBuyRate  
 * @property { boolean } showCustomer  
 * @property { boolean } showSellRate  
 * @property { boolean } showGrid  
 * @property { boolean } showCharges  
 * @property { boolean } showAdditionalText  
 * @property { boolean } showQuantity  
 * @property { boolean } showProfit  
 * @property { boolean } showTotalsByCurrency  
 * @property { boolean } includeSubPositions  
 * @property { boolean } subPositionTotals  
 * @property { boolean } showBuyRateExchangeRates  
 * @property { boolean } showSellRateExchangeRates  
 * @property { boolean } showTotal  
 */
export const FinanceTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), showOnlyForReceiver: z.boolean().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showProfit: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), showTotal: z.boolean().nullable() }).partial();
export type FinanceTableBlockDTO = z.infer<typeof FinanceTableBlockDTOSchema>;

/** 
 * FooterBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const FooterBlockDTOSchema = z.object({ enabled: z.boolean().nullable() }).partial();
export type FooterBlockDTO = z.infer<typeof FooterBlockDTOSchema>;

/** 
 * TermsBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const TermsBlockDTOSchema = z.object({ enabled: z.boolean().nullable() }).partial();
export type TermsBlockDTO = z.infer<typeof TermsBlockDTOSchema>;

/** 
 * CutOffDatesBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } billOfLadingFromCustomer  
 * @property { boolean } billOfLadingToCarrier  
 * @property { boolean } customsAMS  
 * @property { boolean } vgmCustomer  
 */
export const CutOffDatesBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), billOfLadingFromCustomer: z.boolean().nullable(), billOfLadingToCarrier: z.boolean().nullable(), customsAMS: z.boolean().nullable(), vgmCustomer: z.boolean().nullable() }).partial();
export type CutOffDatesBlockDTO = z.infer<typeof CutOffDatesBlockDTOSchema>;

/** 
 * TemplateBlocksResponseDTOSchema 
 * @type { object }
 * @property { TitleBlockDTO } titleBlock  
 * @property { ReceiverBlockDTO } receiverBlock  
 * @property { OurInformationBlockDTO } ourInformationBlock  
 * @property { RouteTableBlockDTO } routeTableBlock  
 * @property { CargoTableBlockDTO } cargoTableBlock  
 * @property { CargoSummaryBlockDTO } cargoSummaryBlock  
 * @property { FinanceTableBlockDTO } financeTableBlock  
 * @property { RemarkBlockDTO[] } remarkBlocks  
 * @property { FooterBlockDTO } footerBlock  
 * @property { TermsBlockDTO } termsBlock  
 * @property { CutOffDatesBlockDTO } cutOffDatesBlock  
 */
export const TemplateBlocksResponseDTOSchema = z.object({ titleBlock: CommonModels.TitleBlockDTOSchema.nullable(), receiverBlock: CommonModels.ReceiverBlockDTOSchema.nullable(), ourInformationBlock: CommonModels.OurInformationBlockDTOSchema.nullable(), routeTableBlock: CommonModels.RouteTableBlockDTOSchema.nullable(), cargoTableBlock: CommonModels.CargoTableBlockDTOSchema.nullable(), cargoSummaryBlock: CommonModels.CargoSummaryBlockDTOSchema.nullable(), financeTableBlock: CommonModels.FinanceTableBlockDTOSchema.nullable(), remarkBlocks: z.array(CommonModels.RemarkBlockDTOSchema).nullable(), footerBlock: CommonModels.FooterBlockDTOSchema.nullable(), termsBlock: CommonModels.TermsBlockDTOSchema.nullable(), cutOffDatesBlock: CommonModels.CutOffDatesBlockDTOSchema.nullable() }).partial();
export type TemplateBlocksResponseDTO = z.infer<typeof TemplateBlocksResponseDTOSchema>;

/** 
 * TemplatedDocumentBlueprintDtoSchema 
 * @type { object }
 * @property { string } templateId  
 * @property { string } templateName  
 * @property { string } capturedAt  
 * @property { TemplateBlocksResponseDTO } blocks  
 */
export const TemplatedDocumentBlueprintDtoSchema = z.object({ templateId: z.string(), templateName: z.string(), capturedAt: z.string(), blocks: CommonModels.TemplateBlocksResponseDTOSchema });
export type TemplatedDocumentBlueprintDto = z.infer<typeof TemplatedDocumentBlueprintDtoSchema>;

/** 
 * RouteTableProviderDtoSchema 
 * @type { object }
 * @property { string } id Provider ID 
 * @property { string } name Provider name 
 */
export const RouteTableProviderDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type RouteTableProviderDto = z.infer<typeof RouteTableProviderDtoSchema>;

/** 
 * RouteTablePointDtoSchema 
 * @type { object }
 * @property { string } id Route point ID 
 * @property { string } type Route point type 
 * @property { string } datetime Route point datetime 
 * @property { string } secondaryDatetime Route point secondary datetime 
 * @property { string } address Route point address 
 * @property { string } name Route point address name 
 * @property { string } reference Route point reference 
 * @property { RouteTableProviderDto } provider Route point provider 
 * @property { string } vessel Vessel information 
 * @property { string } voyage Voyage information 
 * @property { string } carrier Carrier name 
 */
export const RouteTablePointDtoSchema = z.object({ id: z.string(), type: z.string(), datetime: z.string().nullish(), secondaryDatetime: z.string().nullish(), address: z.string().nullish(), name: z.string().nullish(), reference: z.string().nullish(), provider: CommonModels.RouteTableProviderDtoSchema.nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), carrier: z.string().nullish() });
export type RouteTablePointDto = z.infer<typeof RouteTablePointDtoSchema>;

/** 
 * RouteTableBlockResponseDtoSchema 
 * @type { object }
 * @property { string } selectedRouteId Selected route ID 
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { boolean } showReference Show reference column 
 * @property { boolean } showVesselVoyage Show vessel/voyage column 
 * @property { boolean } showProvider Show provider column 
 * @property { RouteTablePointDto[] } points Route points 
 * @property { boolean } showAddress Show address 
 * @property { boolean } showDates Show dates 
 * @property { boolean } showType Show type 
 * @property { boolean } showLocation Show location 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } suppressRoute Suppress route 
 */
export const RouteTableBlockResponseDtoSchema = z.object({ selectedRouteId: z.string().nullish(), selectedRoutePointIds: z.array(z.string()), showReference: z.boolean(), showVesselVoyage: z.boolean(), showProvider: z.boolean(), points: z.array(CommonModels.RouteTablePointDtoSchema).nullish(), showAddress: z.boolean().nullish(), showDates: z.boolean(), showType: z.boolean(), showLocation: z.boolean(), showGrid: z.boolean(), suppressRoute: z.boolean() });
export type RouteTableBlockResponseDto = z.infer<typeof RouteTableBlockResponseDtoSchema>;

/** 
 * CargoSpecialtyDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } unNumber UN number for hazardous specialty 
 * @property { string } IMOClass IMO class for hazardous specialty 
 * @property { number } temperatureFrom Temperature from (°C) for temperature-controlled specialty 
 * @property { number } temperatureUntil Temperature until (°C) for temperature-controlled specialty 
 */
export const CargoSpecialtyDtoSchema = z.object({ name: CommonModels.PositionCargoPackageEnumSchema, unNumber: z.string().nullish(), IMOClass: z.string().nullish(), temperatureFrom: z.number().nullish(), temperatureUntil: z.number().nullish() });
export type CargoSpecialtyDto = z.infer<typeof CargoSpecialtyDtoSchema>;

/** 
 * CargoPackageDtoSchema 
 * @type { object }
 * @property { string } id Package ID 
 * @property { string } description Package description 
 * @property { string } weight Weight 
 * @property { string } hsCodes HS codes (numeric only) 
 * @property { number } quantity Quantity 
 * @property { number } width Width (cm) 
 * @property { number } length Length (cm) 
 * @property { number } height Height (cm) 
 * @property { number } volume Total volume in m3 for this package group 
 * @property { string } packageType Package type name 
 * @property { string } caseMarks Case marks 
 * @property { CargoSpecialtyDto[] } specialties Package specialties 
 * @property { number } chargeableWeight Chargeable weight in kg 
 * @property { number } volumetricWeight Volumetric weight in kg 
 */
export const CargoPackageDtoSchema = z.object({ id: z.string(), description: z.string().nullish(), weight: z.string().nullish(), hsCodes: z.string().nullish(), quantity: z.number().nullish(), width: z.number().nullish(), length: z.number().nullish(), height: z.number().nullish(), volume: z.number().nullish(), packageType: z.string().nullish(), caseMarks: z.string().nullish(), specialties: z.array(CommonModels.CargoSpecialtyDtoSchema).nullish(), chargeableWeight: z.number().nullish(), volumetricWeight: z.number().nullish() });
export type CargoPackageDto = z.infer<typeof CargoPackageDtoSchema>;

/** 
 * CargoItemRouteDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { RouteTablePointDto[] } points Route points 
 */
export const CargoItemRouteDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()), points: z.array(CommonModels.RouteTablePointDtoSchema).nullish() });
export type CargoItemRouteDto = z.infer<typeof CargoItemRouteDtoSchema>;

/** 
 * CargoItemDtoSchema 
 * @type { object }
 * @property { string } cargoId Cargo ID 
 * @property { string } cargoType Cargo type 
 * @property { string } containerNumber Container number 
 * @property { string } seal1 First seal (sea cargo only) 
 * @property { string } seal2 Second seal (sea cargo only) 
 * @property { string } vgm Verified gross mass (VGM) for container, sea cargo only 
 * @property { number } totalGrossWeight Total gross weight from cargo details 
 * @property { number } totalVolume Total volume (m3) calculated from cargo packages 
 * @property { number } chargeableWeight Chargeable weight in kg for transport unit 
 * @property { number } volumetricWeight Volumetric weight in kg for transport unit 
 * @property { CargoPackageDto[] } packages Cargo packages 
 * @property { string[] } selectedPackageIds Selected cargo package IDs 
 * @property { CargoItemRouteDto } route Cargo route (when routes are split) 
 */
export const CargoItemDtoSchema = z.object({ cargoId: z.string(), cargoType: z.string(), containerNumber: z.string().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), vgm: z.string().nullish(), totalGrossWeight: z.number().nullish(), totalVolume: z.number().nullish(), chargeableWeight: z.number().nullish(), volumetricWeight: z.number().nullish(), packages: z.array(CommonModels.CargoPackageDtoSchema), selectedPackageIds: z.array(z.string()), route: CommonModels.CargoItemRouteDtoSchema.nullish() });
export type CargoItemDto = z.infer<typeof CargoItemDtoSchema>;

/** 
 * CargoTableBlockDtoSchema 
 * @type { object }
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { boolean } suppressWeight Suppress weight column display 
 * @property { boolean } showGrid Show grid borders in cargo table 
 * @property { boolean } suppressVolume Suppress volume column display 
 * @property { boolean } suppressSpecialities Suppress specialities column display 
 * @property { boolean } suppressDimensions Suppress dimensions column display 
 * @property { boolean } suppressPackageVolume Suppress package volume column display 
 * @property { boolean } suppressPackageWeight Suppress package weight column display 
 * @property { boolean } showGrandTotal Show grand total 
 * @property { boolean } showTransportUnitTotal Show transport unit total 
 * @property { boolean } showRoute Show route information (only applicable when routes are split) 
 * @property { boolean } suppressCargo Suppress cargo table display 
 * @property { boolean } showTransportUnitChargeableWeight Show chargeable weight for transport units 
 * @property { boolean } showTransportUnitVolumetricWeight Show volumetric weight for transport units 
 * @property { boolean } showPackageChargeableWeight Show chargeable weight for packages 
 * @property { boolean } showPackageVolumetricWeight Show volumetric weight for packages 
 * @property { boolean } showPackageHSCodes Show HS codes for packages 
 * @property { boolean } showPackageType Show package type for packages 
 * @property { boolean } showPackageQuantity Show quantity for packages 
 * @property { boolean } showPackageDescription Show description for packages 
 * @property { boolean } showPackageCaseMarks Show case marks for packages 
 * @property { boolean } showTransportUnitNumber Show transport unit number 
 * @property { boolean } showTransportUnitType Show transport unit type 
 * @property { boolean } showTransportUnitSeal1 Show transport unit seal 1 
 * @property { boolean } showTransportUnitSeal2 Show transport unit seal 2 
 * @property { CargoItemDto[] } items Cargo items 
 */
export const CargoTableBlockDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).nullish(), suppressWeight: z.boolean().nullish(), showGrid: z.boolean().nullish(), suppressVolume: z.boolean().nullish(), suppressSpecialities: z.boolean().nullish(), suppressDimensions: z.boolean().nullish(), suppressPackageVolume: z.boolean().nullish(), suppressPackageWeight: z.boolean().nullish(), showGrandTotal: z.boolean().nullish(), showTransportUnitTotal: z.boolean().nullish(), showRoute: z.boolean().nullish(), suppressCargo: z.boolean().nullish(), showTransportUnitChargeableWeight: z.boolean().nullish(), showTransportUnitVolumetricWeight: z.boolean().nullish(), showPackageChargeableWeight: z.boolean().nullish(), showPackageVolumetricWeight: z.boolean().nullish(), showPackageHSCodes: z.boolean().nullish(), showPackageType: z.boolean().nullish(), showPackageQuantity: z.boolean().nullish(), showPackageDescription: z.boolean().nullish(), showPackageCaseMarks: z.boolean().nullish(), showTransportUnitNumber: z.boolean().nullish(), showTransportUnitType: z.boolean().nullish(), showTransportUnitSeal1: z.boolean().nullish(), showTransportUnitSeal2: z.boolean().nullish(), items: z.array(CommonModels.CargoItemDtoSchema) });
export type CargoTableBlockDto = z.infer<typeof CargoTableBlockDtoSchema>;

/** 
 * SummaryCargoItemDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { number } quantity Count of cargos for this type 
 * @property { string } description Comma-joined transport unit numbers or custom description 
 */
export const SummaryCargoItemDtoSchema = z.object({ transportUnitType: z.string(), quantity: z.number(), description: z.string() });
export type SummaryCargoItemDto = z.infer<typeof SummaryCargoItemDtoSchema>;

/** 
 * SummaryCargoBlockResponseDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemDto[] } items  
 */
export const SummaryCargoBlockResponseDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemDtoSchema) });
export type SummaryCargoBlockResponseDto = z.infer<typeof SummaryCargoBlockResponseDtoSchema>;

/** 
 * PositionAccountItemTypeEnumSchema 
 * @type { enum }
 */
export const PositionAccountItemTypeEnumSchema = z.enum(["CHARGE", "TEXT", "DIVIDER"]);
export type PositionAccountItemTypeEnum = z.infer<typeof PositionAccountItemTypeEnumSchema>;
export const PositionAccountItemTypeEnum = PositionAccountItemTypeEnumSchema.enum;

/** 
 * FinanceRowDtoSchema 
 * @type { object }
 * @property { string } id Finance row ID 
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { string } chargeType Charge type 
 * @property { string } additionalText Additional text 
 * @property { string } text Text content 
 * @property { number } buyAmount Buy amount 
 * @property { string } buyCurrencyNotation Buy currency notation 
 * @property { number } sellAmount Sell amount 
 * @property { string } sellCurrencyNotation Sell currency notation 
 * @property { string } buyBPName Buy business partner name 
 * @property { string } sellBPName Sell business partner name 
 * @property { number } sellExchangeRate Sell exchange rate 
 * @property { number } buyExchangeRate Buy exchange rate 
 * @property { number } quantity Quantity 
 */
export const FinanceRowDtoSchema = z.object({ id: z.string(), type: CommonModels.PositionAccountItemTypeEnumSchema, chargeType: z.string().nullish(), additionalText: z.string().nullish(), text: z.string().nullish(), buyAmount: z.number().nullish(), buyCurrencyNotation: z.string().nullish(), sellAmount: z.number().nullish(), sellCurrencyNotation: z.string().nullish(), buyBPName: z.string().nullish(), sellBPName: z.string().nullish(), sellExchangeRate: z.number().nullish(), buyExchangeRate: z.number().nullish(), quantity: z.number().nullish() });
export type FinanceRowDto = z.infer<typeof FinanceRowDtoSchema>;

/** 
 * FinanceTotalsDtoSchema 
 * @type { object }
 * @property { number } customerTotal Customer total 
 * @property { number } vendorTotal Vendor total 
 * @property { number } combinedTotal Combined total 
 * @property { string } currencyNotation Currency notation 
 */
export const FinanceTotalsDtoSchema = z.object({ customerTotal: z.number().nullable(), vendorTotal: z.number().nullable(), combinedTotal: z.number().nullable(), currencyNotation: z.string().nullable() }).partial();
export type FinanceTotalsDto = z.infer<typeof FinanceTotalsDtoSchema>;

/** 
 * FinanceTotalsByCurrencyDtoSchema 
 * @type { object }
 * @property { string } currencyNotation Currency notation 
 * @property { number } vendorTotal Total for vendor side in this currency 
 * @property { number } customerTotal Total for customer side in this currency 
 */
export const FinanceTotalsByCurrencyDtoSchema = z.object({ currencyNotation: z.string(), vendorTotal: z.number().nullish(), customerTotal: z.number().nullish() });
export type FinanceTotalsByCurrencyDto = z.infer<typeof FinanceTotalsByCurrencyDtoSchema>;

/** 
 * FinanceTablePositionDtoSchema 
 * @type { object }
 * @property { FinanceRowDto[] } rows Finance rows 
 * @property { FinanceTotalsDto } totals Finance totals 
 * @property { string[] } selectedFinanceRowIds Selected finance row IDs 
 * @property { string } positionId Position ID 
 * @property { string } positionNumber Position number 
 * @property { FinanceTotalsByCurrencyDto[] } totalsByCurrency Totals grouped by currency 
 */
export const FinanceTablePositionDtoSchema = z.object({ rows: z.array(CommonModels.FinanceRowDtoSchema).nullable(), totals: CommonModels.FinanceTotalsDtoSchema.nullable(), selectedFinanceRowIds: z.array(z.string()).nullable(), positionId: z.string().nullable(), positionNumber: z.string().nullable(), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).nullable() }).partial();
export type FinanceTablePositionDto = z.infer<typeof FinanceTablePositionDtoSchema>;

/** 
 * FinanceTableBlockDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Selected business partner ID 
 * @property { boolean } showVendor Show vendor 
 * @property { boolean } showBuyRate Show buy rate 
 * @property { boolean } showCustomer Show customer 
 * @property { boolean } showSellRate Show sell rate 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } showCharges Show charges 
 * @property { boolean } showAdditionalText Show additional text 
 * @property { boolean } showQuantity Show quantity 
 * @property { boolean } showTotalsByCurrency Show totals grouped by currency 
 * @property { boolean } suppressFinances Suppress finances from output 
 * @property { boolean } suppressZeroLines Suppress rows where the amounts are zero 
 * @property { boolean } showTotal Show total from output 
 * @property { boolean } showProfit Show profit from output 
 * @property { boolean } showBuyRateExchangeRates Show buy rate exchange rates from output 
 * @property { boolean } showSellRateExchangeRates Show sell rate exchange rates from output 
 * @property { boolean } includeSubPositions Include sub-positions 
 * @property { boolean } subPositionTotals Show sub-position totals 
 * @property { FinanceTablePositionDto[] } positions Finance positions 
 * @property { FinanceTotalsDto } totals Finance totals 
 * @property { FinanceTotalsByCurrencyDto[] } totalsByCurrency Totals grouped by currency 
 */
export const FinanceTableBlockDtoSchema = z.object({ selectedBpId: z.string().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), suppressFinances: z.boolean().nullable(), suppressZeroLines: z.boolean().nullable(), showTotal: z.boolean().nullable(), showProfit: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), positions: z.array(CommonModels.FinanceTablePositionDtoSchema).nullable(), totals: CommonModels.FinanceTotalsDtoSchema.nullable(), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).nullable() }).partial();
export type FinanceTableBlockDto = z.infer<typeof FinanceTableBlockDtoSchema>;

/** 
 * RemarkBlockDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockDtoSchema = z.object({ id: z.string(), position: z.number().gte(1), content: CommonModels.EditorContentUpdateDtoSchema, enabled: z.boolean().nullish() });
export type RemarkBlockDto = z.infer<typeof RemarkBlockDtoSchema>;

/** 
 * ConfigBlockDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 * @property { boolean } showWatermarkOnDocuments Show watermark on documents 
 * @property { LocaleEnum } locale  
 */
export const ConfigBlockDtoSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable(), showWatermarkOnDocuments: z.boolean().nullable(), locale: CommonModels.LocaleEnumSchema.nullable() }).partial();
export type ConfigBlockDto = z.infer<typeof ConfigBlockDtoSchema>;

/** 
 * TitleBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } value Title value 
 */
export const TitleBlockUpdateDtoSchema = z.object({ value: z.string().nullable() }).partial();
export type TitleBlockUpdateDto = z.infer<typeof TitleBlockUpdateDtoSchema>;

/** 
 * ReceiverBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Receiver business partner ID 
 * @property { string } address Receiver address 
 */
export const ReceiverBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().nullable(), address: z.string().nullable() }).partial();
export type ReceiverBlockUpdateDto = z.infer<typeof ReceiverBlockUpdateDtoSchema>;

/** 
 * OurInformationBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } phone Phone number 
 * @property { string } date Date 
 * @property { string } bookingNumber Booking number 
 * @property { string } customerReference Customer reference 
 * @property { string } masterBillOfLadingNumber Master bill of lading number 
 * @property { string } houseBillOfLadingNumber House bill of lading number 
 * @property { string } positionNumber Position number 
 */
export const OurInformationBlockUpdateDtoSchema = z.object({ name: z.string().nullable(), phone: z.string().nullable(), date: z.string().nullable(), bookingNumber: z.string().nullable(), customerReference: z.string().nullable(), masterBillOfLadingNumber: z.string().nullable(), houseBillOfLadingNumber: z.string().nullable(), positionNumber: z.string().nullable() }).partial();
export type OurInformationBlockUpdateDto = z.infer<typeof OurInformationBlockUpdateDtoSchema>;

/** 
 * TermsBlockDtoSchema 
 * @type { object }
 * @property { string } termsImageUrl Terms image URL 
 */
export const TermsBlockDtoSchema = z.object({ termsImageUrl: z.string().nullable() }).partial();
export type TermsBlockDto = z.infer<typeof TermsBlockDtoSchema>;

/** 
 * CutOffDatesBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } billOfLadingFromCustomer Bill of lading from customer date 
 * @property { string } billOfLadingToCarrier Bill of lading to carrier date 
 * @property { string } customsAMS Customs AMS date 
 * @property { string } vgmCustomer VGM customer date 
 */
export const CutOffDatesBlockUpdateDtoSchema = z.object({ billOfLadingFromCustomer: z.string().nullable(), billOfLadingToCarrier: z.string().nullable(), customsAMS: z.string().nullable(), vgmCustomer: z.string().nullable() }).partial();
export type CutOffDatesBlockUpdateDto = z.infer<typeof CutOffDatesBlockUpdateDtoSchema>;

/** 
 * TemplatedDocumentDataDtoSchema 
 * @type { object }
 * @property { TitleBlockUpdateDto } title Title block data 
 * @property { ReceiverBlockUpdateDto } receiver Receiver block data 
 * @property { OurInformationBlockUpdateDto } ourInformation Our information block data 
 * @property { RouteTableBlockResponseDto } routeTable Route table block data 
 * @property { CargoTableBlockDto } cargoTable Cargo table block data 
 * @property { SummaryCargoBlockResponseDto } summaryCargo Summary cargo block data 
 * @property { FinanceTableBlockDto } financeTable Finance table block data 
 * @property { RemarkBlockDto[] } remarks Remark blocks 
 * @property { TermsBlockDto } terms Terms block data 
 * @property { ConfigBlockDto } config Config block data 
 * @property { CutOffDatesBlockUpdateDto } cutOffDates Cut off dates block data 
 */
export const TemplatedDocumentDataDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.nullable(), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.nullable(), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.nullable(), routeTable: CommonModels.RouteTableBlockResponseDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockDtoSchema.nullable(), summaryCargo: CommonModels.SummaryCargoBlockResponseDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockDtoSchema.nullable(), remarks: z.array(CommonModels.RemarkBlockDtoSchema).nullable(), terms: CommonModels.TermsBlockDtoSchema.nullable(), config: CommonModels.ConfigBlockDtoSchema.nullable(), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.nullable() }).partial();
export type TemplatedDocumentDataDto = z.infer<typeof TemplatedDocumentDataDtoSchema>;

/** 
 * TemplatedDocumentResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } officeId  
 * @property { string } name  
 * @property { string } nameSuffix  
 * @property { string } defaultFileName  
 * @property { number } versionNumber  
 * @property { WorkingDocumentsTemplatedDocumentModels.TemplatedDocumentBlueprintDto } blueprint Captured template blueprint 
 * @property { TemplatedDocumentDataDto } data Document data 
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } issuedAt  
 */
export const TemplatedDocumentResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), officeId: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), versionNumber: z.number(), blueprint: TemplatedDocumentBlueprintDtoSchema, data: CommonModels.TemplatedDocumentDataDtoSchema, createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), issuedAt: z.iso.datetime({ offset: true }).nullish() });
export type TemplatedDocumentResponseDto = z.infer<typeof TemplatedDocumentResponseDtoSchema>;

/** 
 * RouteTableUpdateBlockDtoSchema 
 * @type { object }
 * @property { string } selectedRouteId Selected route ID 
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { boolean } showReference Show reference column 
 * @property { boolean } showVesselVoyage Show vessel/voyage column 
 * @property { boolean } showProvider Show provider column 
 * @property { RouteTablePointDto[] } points Route points 
 * @property { boolean } showAddress Show address 
 * @property { boolean } showDates Show dates 
 * @property { boolean } showType Show type 
 * @property { boolean } showLocation Show location 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } suppressRoute Suppress route 
 */
export const RouteTableUpdateBlockDtoSchema = z.object({ selectedRouteId: z.string().nullable(), selectedRoutePointIds: z.array(z.string()).nullable(), showReference: z.boolean().nullable(), showVesselVoyage: z.boolean().nullable(), showProvider: z.boolean().nullable(), points: z.array(CommonModels.RouteTablePointDtoSchema).nullable(), showAddress: z.boolean().nullable(), showDates: z.boolean().nullable(), showType: z.boolean().nullable(), showLocation: z.boolean().nullable(), showGrid: z.boolean().nullable(), suppressRoute: z.boolean().nullable() }).partial();
export type RouteTableUpdateBlockDto = z.infer<typeof RouteTableUpdateBlockDtoSchema>;

/** 
 * CargoItemRouteUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 */
export const CargoItemRouteUpdateDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()) });
export type CargoItemRouteUpdateDto = z.infer<typeof CargoItemRouteUpdateDtoSchema>;

/** 
 * CargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } cargoId Cargo ID to update packages for 
 * @property { string[] } selectedPackageIds Selected cargo package IDs 
 * @property { CargoItemRouteUpdateDto } route Cargo route (when routes are split) 
 */
export const CargoItemUpdateDtoSchema = z.object({ cargoId: z.string().nullable(), selectedPackageIds: z.array(z.string()).nullable(), route: CommonModels.CargoItemRouteUpdateDtoSchema.nullable() }).partial();
export type CargoItemUpdateDto = z.infer<typeof CargoItemUpdateDtoSchema>;

/** 
 * CargoTableBlockUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { CargoItemUpdateDto[] } items Cargo items for package updates 
 * @property { boolean } suppressWeight Suppress weight column display 
 * @property { boolean } showGrid Show grid borders in cargo table 
 * @property { boolean } suppressVolume Suppress volume column display 
 * @property { boolean } suppressSpecialities Suppress specialities column display 
 * @property { boolean } suppressDimensions Suppress dimensions column display 
 * @property { boolean } suppressPackageVolume Suppress package volume column display 
 * @property { boolean } suppressPackageWeight Suppress package weight column display 
 * @property { boolean } showRoute Show route information (only applicable when routes are split) 
 * @property { boolean } showGrandTotal Show grand total 
 * @property { boolean } showTransportUnitTotal Show transport unit total 
 * @property { boolean } suppressCargo Suppress cargo table display 
 * @property { boolean } showTransportUnitChargeableWeight Show chargeable weight for transport units 
 * @property { boolean } showTransportUnitVolumetricWeight Show volumetric weight for transport units 
 * @property { boolean } showPackageChargeableWeight Show chargeable weight for packages 
 * @property { boolean } showPackageVolumetricWeight Show volumetric weight for packages 
 * @property { boolean } showPackageHSCodes Show HS codes for packages 
 * @property { boolean } showPackageType Show package type for packages 
 * @property { boolean } showPackageQuantity Show quantity for packages 
 * @property { boolean } showPackageDescription Show description for packages 
 * @property { boolean } showPackageCaseMarks Show case marks for packages 
 * @property { boolean } showTransportUnitNumber Show transport unit number 
 * @property { boolean } showTransportUnitType Show transport unit type 
 * @property { boolean } showTransportUnitSeal1 Show transport unit seal 1 
 * @property { boolean } showTransportUnitSeal2 Show transport unit seal 2 
 */
export const CargoTableBlockUpdateDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).nullable(), items: z.array(CommonModels.CargoItemUpdateDtoSchema).nullable(), suppressWeight: z.boolean().nullable(), showGrid: z.boolean().nullable(), suppressVolume: z.boolean().nullable(), suppressSpecialities: z.boolean().nullable(), suppressDimensions: z.boolean().nullable(), suppressPackageVolume: z.boolean().nullable(), suppressPackageWeight: z.boolean().nullable(), showRoute: z.boolean().nullable(), showGrandTotal: z.boolean().nullable(), showTransportUnitTotal: z.boolean().nullable(), suppressCargo: z.boolean().nullable(), showTransportUnitChargeableWeight: z.boolean().nullable(), showTransportUnitVolumetricWeight: z.boolean().nullable(), showPackageChargeableWeight: z.boolean().nullable(), showPackageVolumetricWeight: z.boolean().nullable(), showPackageHSCodes: z.boolean().nullable(), showPackageType: z.boolean().nullable(), showPackageQuantity: z.boolean().nullable(), showPackageDescription: z.boolean().nullable(), showPackageCaseMarks: z.boolean().nullable(), showTransportUnitNumber: z.boolean().nullable(), showTransportUnitType: z.boolean().nullable(), showTransportUnitSeal1: z.boolean().nullable(), showTransportUnitSeal2: z.boolean().nullable() }).partial();
export type CargoTableBlockUpdateDto = z.infer<typeof CargoTableBlockUpdateDtoSchema>;

/** 
 * SummaryCargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { string } description Updated description for this cargo type 
 */
export const SummaryCargoItemUpdateDtoSchema = z.object({ transportUnitType: z.string(), description: z.string() });
export type SummaryCargoItemUpdateDto = z.infer<typeof SummaryCargoItemUpdateDtoSchema>;

/** 
 * SummaryCargoBlockUpdateDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemUpdateDto[] } items  
 */
export const SummaryCargoBlockUpdateDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemUpdateDtoSchema) });
export type SummaryCargoBlockUpdateDto = z.infer<typeof SummaryCargoBlockUpdateDtoSchema>;

/** 
 * FinanceTablePositionUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedFinanceRowIds Selected finance row IDs 
 * @property { string } positionId Position ID 
 */
export const FinanceTablePositionUpdateDtoSchema = z.object({ selectedFinanceRowIds: z.array(z.string()).nullable(), positionId: z.string().nullable() }).partial();
export type FinanceTablePositionUpdateDto = z.infer<typeof FinanceTablePositionUpdateDtoSchema>;

/** 
 * FinanceTableBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Selected business partner ID 
 * @property { boolean } showVendor Show vendor 
 * @property { boolean } showBuyRate Show buy rate 
 * @property { boolean } showCustomer Show customer 
 * @property { boolean } showSellRate Show sell rate 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } showCharges Show charges 
 * @property { boolean } showAdditionalText Show additional text 
 * @property { boolean } showQuantity Show quantity 
 * @property { boolean } showTotalsByCurrency Show totals grouped by currency 
 * @property { boolean } suppressFinances Suppress finances from output 
 * @property { boolean } suppressZeroLines Suppress rows where the amounts are zero 
 * @property { boolean } showTotal Show total from output 
 * @property { boolean } showProfit Show profit from output 
 * @property { boolean } showBuyRateExchangeRates Show buy rate exchange rates from output 
 * @property { boolean } showSellRateExchangeRates Show sell rate exchange rates from output 
 * @property { boolean } includeSubPositions Include sub-positions 
 * @property { boolean } subPositionTotals Show sub-position totals 
 * @property { FinanceTablePositionUpdateDto[] } positions Finance positions 
 */
export const FinanceTableBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), suppressFinances: z.boolean().nullable(), suppressZeroLines: z.boolean().nullable(), showTotal: z.boolean().nullable(), showProfit: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), positions: z.array(CommonModels.FinanceTablePositionUpdateDtoSchema).nullable() }).partial();
export type FinanceTableBlockUpdateDto = z.infer<typeof FinanceTableBlockUpdateDtoSchema>;

/** 
 * RemarkBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockUpdateDtoSchema = z.object({ id: z.string(), position: z.number().gte(1).nullish(), content: CommonModels.EditorContentUpdateDtoSchema.nullish(), enabled: z.boolean().nullish() });
export type RemarkBlockUpdateDto = z.infer<typeof RemarkBlockUpdateDtoSchema>;

/** 
 * TemplatedDocumentDataUpdateDtoSchema 
 * @type { object }
 * @property { TitleBlockUpdateDto } title Title block data 
 * @property { ReceiverBlockUpdateDto } receiver Receiver block data 
 * @property { OurInformationBlockUpdateDto } ourInformation Our information block data 
 * @property { RouteTableUpdateBlockDto } routeTable Route table block data 
 * @property { CargoTableBlockUpdateDto } cargoTable Cargo table block data 
 * @property { SummaryCargoBlockUpdateDto } summaryCargo Summary cargo block data 
 * @property { FinanceTableBlockUpdateDto } financeTable Finance table block data 
 * @property { RemarkBlockUpdateDto[] } remarks Remark blocks 
 * @property { CutOffDatesBlockUpdateDto } cutOffDates Cut off dates block data 
 */
export const TemplatedDocumentDataUpdateDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.nullable(), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.nullable(), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.nullable(), routeTable: CommonModels.RouteTableUpdateBlockDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockUpdateDtoSchema.nullable(), summaryCargo: CommonModels.SummaryCargoBlockUpdateDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockUpdateDtoSchema.nullable(), remarks: z.array(CommonModels.RemarkBlockUpdateDtoSchema).nullable(), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.nullable() }).partial();
export type TemplatedDocumentDataUpdateDto = z.infer<typeof TemplatedDocumentDataUpdateDtoSchema>;

/** 
 * UpdateTemplatedDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } nameSuffix Optional suffix for the document name 
 * @property { TemplatedDocumentDataUpdateDto } data Partial document data to update 
 */
export const UpdateTemplatedDocumentRequestDtoSchema = z.object({ nameSuffix: z.string().nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateTemplatedDocumentRequestDto = z.infer<typeof UpdateTemplatedDocumentRequestDtoSchema>;

/** 
 * RemarkVisibilitySchema 
 * @type { enum }
 */
export const RemarkVisibilitySchema = z.enum(["internal", "popup"]);
export type RemarkVisibility = z.infer<typeof RemarkVisibilitySchema>;
export const RemarkVisibility = RemarkVisibilitySchema.enum;

/** 
 * RemarkTypeSchema 
 * @type { enum }
 */
export const RemarkTypeSchema = z.enum(["INFORMATIONAL", "WARNING"]);
export type RemarkType = z.infer<typeof RemarkTypeSchema>;
export const RemarkType = RemarkTypeSchema.enum;

/** 
 * BusinessPartnerRemarkResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the remark 
 * @property { BusinessPartnersModels.RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { BusinessPartnersModels.RemarkType } type Type of the remark 
 */
export const BusinessPartnerRemarkResponseDTOSchema = z.object({ id: z.string(), visibility: RemarkVisibilitySchema, content: z.string(), type: RemarkTypeSchema });
export type BusinessPartnerRemarkResponseDTO = z.infer<typeof BusinessPartnerRemarkResponseDTOSchema>;

/** 
 * BusinessPartnerAddressDtoSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } city City name 
 * @property { string } isoCode Country code 
 */
export const BusinessPartnerAddressDtoSchema = z.object({ street: z.string().nullable(), zip: z.string().nullable(), city: z.string().nullable(), isoCode: z.string().nullable() }).partial();
export type BusinessPartnerAddressDto = z.infer<typeof BusinessPartnerAddressDtoSchema>;

/** 
 * BusinessPartnerTypeSchema 
 * @type { enum }
 */
export const BusinessPartnerTypeSchema = z.enum(["businessPartner", "destinationAgent", "oceanCarrier", "office", "customsAgent", "stuffingStrippingProvider", "shipper", "fobForwarder", "routingAgent", "transportProvider", "originServiceProvider", "insuranceProvider", "consignee", "courier", "trucker", "airline", "originAgent", "filingAgent"]);
export type BusinessPartnerType = z.infer<typeof BusinessPartnerTypeSchema>;
export const BusinessPartnerType = BusinessPartnerTypeSchema.enum;

/** 
 * BusinessPartnerEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type BusinessPartnerEmployeeDTO = z.infer<typeof BusinessPartnerEmployeeDTOSchema>;

/** 
 * BusinessPartnerListResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } matchCode Match code of the business partner 
 * @property { BusinessPartnersModels.BusinessPartnerAddressDto } address Address information 
 * @property { BusinessPartnerType[] } types List of business partner types 
 * @property { boolean } archived Archive status 
 * @property { string } shortName Short name of the business partner 
 * @property { string } vat VAT number of the business partner 
 * @property { string } debtorId Debtor ID for the local currency 
 * @property { string } creditorId Creditor ID for the local currency 
 * @property { boolean } locked Whether the business partner is locked 
 * @property { string } currency Currency (invoice currency) 
 * @property { BusinessPartnersModels.BusinessPartnerRemarkResponseDTO[] } remarks Remarks for the business partner 
 * @property { string } createdById ID of the employee who created this business partner 
 * @property { BusinessPartnersModels.BusinessPartnerEmployeeDTO } createdBy Employee who created this business partner 
 * @property { string } createdAt Date when the business partner was created 
 * @property { string } updatedById ID of the employee who last updated this business partner 
 * @property { BusinessPartnersModels.BusinessPartnerEmployeeDTO } updatedBy Employee who last updated this business partner 
 * @property { string } updatedAt Date when the business partner was last updated 
 */
export const BusinessPartnerListResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), address: BusinessPartnerAddressDtoSchema, types: z.array(CommonModels.BusinessPartnerTypeSchema), archived: z.boolean(), shortName: z.string().nullish(), vat: z.string().nullish(), debtorId: z.string().nullish(), creditorId: z.string().nullish(), locked: z.boolean(), currency: z.string().nullish(), remarks: z.array(BusinessPartnerRemarkResponseDTOSchema), createdById: z.string().nullish(), createdBy: BusinessPartnerEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: BusinessPartnerEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type BusinessPartnerListResponseDTO = z.infer<typeof BusinessPartnerListResponseDTOSchema>;

/** 
 * BusinessPartnerFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { BusinessPartnerType[] } types  
 * @property { string } shortName  
 * @property { string } name  
 * @property { string } vat  
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } matchCode  
 * @property { boolean } archived Filter by archived status 
 */
export const BusinessPartnerFilterDtoSchema = z.object({ search: z.string().nullable(), types: z.array(CommonModels.BusinessPartnerTypeSchema).nullable(), shortName: z.string().nullable(), name: z.string().nullable(), vat: z.string().nullable(), debtorId: z.string().nullable(), creditorId: z.string().nullable(), matchCode: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type BusinessPartnerFilterDto = z.infer<typeof BusinessPartnerFilterDtoSchema>;

/** 
 * BusinessPartnerPaginatedLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } label Label of the business partner 
 * @property { BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerPaginatedLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema) });
export type BusinessPartnerPaginatedLabelResponseDTO = z.infer<typeof BusinessPartnerPaginatedLabelResponseDTOSchema>;

/** 
 * BusinessPartnerLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { string[] } ids Business partner ids to filter by 
 * @property { BusinessPartnerType[] } types Array of business partner types to filter by 
 * @property { boolean } archived Filter by archived status 
 */
export const BusinessPartnerLabelsFilterDtoSchema = z.object({ search: z.string().nullable(), ids: z.array(z.string()).nullable(), types: z.array(CommonModels.BusinessPartnerTypeSchema).nullable(), archived: z.boolean().nullable() }).partial();
export type BusinessPartnerLabelsFilterDto = z.infer<typeof BusinessPartnerLabelsFilterDtoSchema>;

/** 
 * CreateBusinessPartnerAddressDtoSchema 
 * @type { object }
 * @property { string } street  
 * @property { string } secondaryStreet  
 * @property { string } zip  
 * @property { string } cityId  
 * @property { string } district  
 * @property { string } countryId  
 */
export const CreateBusinessPartnerAddressDtoSchema = z.object({ street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), district: z.string().nullable(), countryId: z.string().nullable() }).partial();
export type CreateBusinessPartnerAddressDto = z.infer<typeof CreateBusinessPartnerAddressDtoSchema>;

/** 
 * CreateBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } name Full name of the business partner. Min Length: `3` 
 * @property { string } secondaryName Full name of the business partner. Min Length: `3` 
 * @property { BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { string } matchCode Unique identifier code 
 * @property { string } shortName Short name for the business partner 
 * @property { BusinessPartnersModels.CreateBusinessPartnerAddressDto } address Address information 
 */
export const CreateBusinessPartnerRequestDTOSchema = z.object({ name: z.string().min(3), secondaryName: z.string().min(3).nullish(), types: z.array(CommonModels.BusinessPartnerTypeSchema), matchCode: z.string().nullish(), shortName: z.string().nullish(), address: CreateBusinessPartnerAddressDtoSchema.nullish() });
export type CreateBusinessPartnerRequestDTO = z.infer<typeof CreateBusinessPartnerRequestDTOSchema>;

/** 
 * BusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 * @property { BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { string } rootFolderId Root folder identifier associated with this business partner 
 */
export const BusinessPartnerResponseDTOSchema = z.object({ id: z.string(), name: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema), rootFolderId: z.string().nullish() });
export type BusinessPartnerResponseDTO = z.infer<typeof BusinessPartnerResponseDTOSchema>;

/** 
 * BusinessPartnerAddressCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerAddressCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type BusinessPartnerAddressCityDto = z.infer<typeof BusinessPartnerAddressCityDtoSchema>;

/** 
 * BusinessPartnerAddressCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const BusinessPartnerAddressCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type BusinessPartnerAddressCountryDto = z.infer<typeof BusinessPartnerAddressCountryDtoSchema>;

/** 
 * BusinessPartnerAddressResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the address 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street information 
 * @property { string } zip ZIP/Postal code 
 * @property { BusinessPartnerAddressCityDto } city Country data 
 * @property { string } district District information 
 * @property { BusinessPartnerAddressCountryDto } country Country data 
 */
export const BusinessPartnerAddressResponseDTOSchema = z.object({ id: z.string(), street: z.string(), secondaryStreet: z.string(), zip: z.string(), city: CommonModels.BusinessPartnerAddressCityDtoSchema, district: z.string(), country: CommonModels.BusinessPartnerAddressCountryDtoSchema });
export type BusinessPartnerAddressResponseDTO = z.infer<typeof BusinessPartnerAddressResponseDTOSchema>;

/** 
 * BusinessPartnerLabelResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 */
export const BusinessPartnerLabelResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type BusinessPartnerLabelResponseDto = z.infer<typeof BusinessPartnerLabelResponseDtoSchema>;

/** 
 * ContactResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the contact 
 * @property { string } name Name of the contact 
 */
export const ContactResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ContactResponseDTO = z.infer<typeof ContactResponseDTOSchema>;

/** 
 * BusinessPartnerDetailResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } createdById ID of the employee who created this record 
 * @property { BusinessPartnersModels.BusinessPartnerEmployeeDTO } createdBy Employee who created this record 
 * @property { string } createdAt Creation timestamp 
 * @property { string } updatedById ID of the employee who last updated this record 
 * @property { BusinessPartnersModels.BusinessPartnerEmployeeDTO } updatedBy Employee who last updated this record 
 * @property { string } updatedAt Last update timestamp 
 * @property { string } matchCode Match code of the business partner 
 * @property { string } shortName Short name 
 * @property { string } name Full name 
 * @property { string } secondaryName Secondary name 
 * @property { BusinessPartnerType[] } types List of business partner types 
 * @property { boolean } archived Archived status 
 * @property { BusinessPartnerAddressResponseDTO } address Main address information 
 * @property { BusinessPartnerAddressResponseDTO } blAddress BL address information 
 * @property { BusinessPartnersModels.BusinessPartnerLabelResponseDto[] } similar Similar named business partners 
 * @property { boolean } locked  
 * @property { boolean } addressIsDifferentForBl  
 * @property { string } lockedById Unique identifier of the employee who locked the business partner 
 * @property { string } lockedByName  
 * @property { string } lockedAt Unique identifier of the employee who locked the business partner 
 * @property { BusinessPartnersModels.ContactResponseDTO } belongsTo Parent business partner 
 * @property { BusinessPartnersModels.ContactResponseDTO } salesRep Sales representative 
 * @property { BusinessPartnersModels.ContactResponseDTO } operations Operations contact 
 */
export const BusinessPartnerDetailResponseDTOSchema = z.object({ id: z.string(), createdById: z.string().nullish(), createdBy: BusinessPartnerEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: BusinessPartnerEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), matchCode: z.string(), shortName: z.string(), name: z.string(), secondaryName: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema), archived: z.boolean(), address: CommonModels.BusinessPartnerAddressResponseDTOSchema, blAddress: CommonModels.BusinessPartnerAddressResponseDTOSchema, similar: z.array(BusinessPartnerLabelResponseDtoSchema).nullish(), locked: z.boolean(), addressIsDifferentForBl: z.boolean(), lockedById: z.string().nullish(), lockedByName: z.string().nullish(), lockedAt: z.iso.datetime({ offset: true }).nullish(), belongsTo: ContactResponseDTOSchema, salesRep: ContactResponseDTOSchema, operations: ContactResponseDTOSchema });
export type BusinessPartnerDetailResponseDTO = z.infer<typeof BusinessPartnerDetailResponseDTOSchema>;

/** 
 * UpdateBusinessPartnerAddressDtoSchema 
 * @type { object }
 * @property { string } street  
 * @property { string } secondaryStreet  
 * @property { string } zip  
 * @property { string } cityId  
 * @property { string } district  
 * @property { string } countryId  
 */
export const UpdateBusinessPartnerAddressDtoSchema = z.object({ street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), district: z.string().nullable(), countryId: z.string().nullable() }).partial();
export type UpdateBusinessPartnerAddressDto = z.infer<typeof UpdateBusinessPartnerAddressDtoSchema>;

/** 
 * UpdateBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Updated match code 
 * @property { string } shortName Updated short name 
 * @property { string } name Updated full name 
 * @property { string } secondaryName Updated secondary name 
 * @property { BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { BusinessPartnersModels.UpdateBusinessPartnerAddressDto } address Address information 
 * @property { BusinessPartnersModels.UpdateBusinessPartnerAddressDto } blAddress Bl address information 
 * @property { string } belongsToId Parent business partner 
 * @property { string } salesRepId Sales representative 
 * @property { string } operationsId Operations contact 
 * @property { boolean } addressIsDifferentForBl Different address for BL 
 */
export const UpdateBusinessPartnerRequestDTOSchema = z.object({ matchCode: z.string().nullable(), shortName: z.string().nullable(), name: z.string().nullable(), secondaryName: z.string().nullable(), types: z.array(CommonModels.BusinessPartnerTypeSchema).nullable(), address: UpdateBusinessPartnerAddressDtoSchema.nullable(), blAddress: UpdateBusinessPartnerAddressDtoSchema.nullable(), belongsToId: z.string().nullable(), salesRepId: z.string().nullable(), operationsId: z.string().nullable(), addressIsDifferentForBl: z.boolean().nullable() }).partial();
export type UpdateBusinessPartnerRequestDTO = z.infer<typeof UpdateBusinessPartnerRequestDTOSchema>;

/** 
 * CreateBusinessPartnerRemarkRequestDTOSchema 
 * @type { object }
 * @property { BusinessPartnersModels.RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { BusinessPartnersModels.RemarkType } type Type of remark 
 */
export const CreateBusinessPartnerRemarkRequestDTOSchema = z.object({ visibility: RemarkVisibilitySchema, content: z.string(), type: RemarkTypeSchema });
export type CreateBusinessPartnerRemarkRequestDTO = z.infer<typeof CreateBusinessPartnerRemarkRequestDTOSchema>;

/** 
 * UpdateBusinessPartnerRemarkRequestDtoSchema 
 * @type { object }
 * @property { BusinessPartnersModels.RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { BusinessPartnersModels.RemarkType } type Type of remark 
 */
export const UpdateBusinessPartnerRemarkRequestDtoSchema = z.object({ visibility: RemarkVisibilitySchema.nullable(), content: z.string().nullable(), type: RemarkTypeSchema.nullable() }).partial();
export type UpdateBusinessPartnerRemarkRequestDto = z.infer<typeof UpdateBusinessPartnerRemarkRequestDtoSchema>;

/** 
 * AccountTypeEnumSchema 
 * @type { enum }
 */
export const AccountTypeEnumSchema = z.enum(["Direct Account", "Logistic Provider / Forwarder", "4PL/NVOCC", "LLP", "Carrier", "Service Provider (other)", "Strategic", "Key Account", "Transactional", "Agent", "Other"]);
export type AccountTypeEnum = z.infer<typeof AccountTypeEnumSchema>;
export const AccountTypeEnum = AccountTypeEnumSchema.enum;

/** 
 * BusinessPartnerAuthorizationSchema 
 * @type { enum }
 */
export const BusinessPartnerAuthorizationSchema = z.enum(["requiresApproval", "blocked", "regularBusinessPartner"]);
export type BusinessPartnerAuthorization = z.infer<typeof BusinessPartnerAuthorizationSchema>;
export const BusinessPartnerAuthorization = BusinessPartnerAuthorizationSchema.enum;

/** 
 * BusinessPartnerPaymentTermsResponseDtoSchema 
 * @type { object }
 * @property { string } relativeTo  
 * @property { number } days Minimum: `0` 
 */
export const BusinessPartnerPaymentTermsResponseDtoSchema = z.object({ relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema, days: z.number().gte(0) });
export type BusinessPartnerPaymentTermsResponseDto = z.infer<typeof BusinessPartnerPaymentTermsResponseDtoSchema>;

/** 
 * EditorContentResponseDtoSchema 
 * @type { object }
 * @property { string } html HTML content 
 * @property { object } json JSON content 
 * @property { any } json.[key]  
 */
export const EditorContentResponseDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type EditorContentResponseDto = z.infer<typeof EditorContentResponseDtoSchema>;

/** 
 * BusinessPartnerBankAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerBankAccountResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type BusinessPartnerBankAccountResponseDto = z.infer<typeof BusinessPartnerBankAccountResponseDtoSchema>;

/** 
 * PartnerNetworkInfoDtoSchema 
 * @type { object }
 * @property { string } id Partner network ID 
 * @property { string } name Partner network name 
 */
export const PartnerNetworkInfoDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PartnerNetworkInfoDto = z.infer<typeof PartnerNetworkInfoDtoSchema>;

/** 
 * DunningSystemReferenceDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } isDefault  
 */
export const DunningSystemReferenceDTOSchema = z.object({ id: z.string(), name: z.string(), isDefault: z.boolean() });
export type DunningSystemReferenceDTO = z.infer<typeof DunningSystemReferenceDTOSchema>;

/** 
 * BusinessPartnerBasicResponseDTOSchema 
 * @type { object }
 * @property { string } businessPartnerId Reference to the business partner 
 * @property { string[] } relationship List of relationships 
 * @property { BusinessPartnersModels.AccountTypeEnum } accountType  
 * @property { string } vat VAT number 
 * @property { string } legacySystemId Legacy system (move) id 
 * @property { string } registrationNumber  
 * @property { string } eori EORI number 
 * @property { BusinessPartnersModels.BusinessPartnerAuthorization } authorization Authorization status 
 * @property { number } creditLimit Credit limit 
 * @property { string } invoiceLanguage Invoice language 
 * @property { string } invoiceCurrency Invoice currency 
 * @property { string } iban IBAN 
 * @property { string } bankNumber Bank number 
 * @property { string } bankAccountNumber Bank account number 
 * @property { BusinessPartnersModels.BusinessPartnerPaymentTermsResponseDto } termsExport  
 * @property { BusinessPartnersModels.BusinessPartnerPaymentTermsResponseDto } termsImport  
 * @property { EditorContentResponseDto } notes Notes 
 * @property { string } bankAccountId  
 * @property { BusinessPartnersModels.BusinessPartnerBankAccountResponseDto } bankAccount  
 * @property { BusinessPartnersModels.PartnerNetworkInfoDto[] } partnerNetworks Partner networks 
 * @property { string } dunningSystemId  
 * @property { DunningSystemReferenceDTO } dunningSystem  
 * @property { string } hblIssuerSigner HBL issuer/signer prefill 
 * @property { string } signatureFileAttachmentId Signature file attachment ID 
 * @property { string } signatureFileAttachmentUrl Signed URL for signature file attachment 
 */
export const BusinessPartnerBasicResponseDTOSchema = z.object({ businessPartnerId: z.string(), relationship: z.array(z.string()), accountType: AccountTypeEnumSchema.nullish(), vat: z.string(), legacySystemId: z.string().nullish(), registrationNumber: z.string().nullish(), eori: z.string(), authorization: BusinessPartnerAuthorizationSchema.nullable(), creditLimit: z.number(), invoiceLanguage: z.string(), invoiceCurrency: z.string(), iban: z.string(), bankNumber: z.string(), bankAccountNumber: z.string(), termsExport: BusinessPartnerPaymentTermsResponseDtoSchema, termsImport: BusinessPartnerPaymentTermsResponseDtoSchema, notes: CommonModels.EditorContentResponseDtoSchema.nullish(), bankAccountId: z.string().nullish(), bankAccount: BusinessPartnerBankAccountResponseDtoSchema.nullish(), partnerNetworks: z.array(PartnerNetworkInfoDtoSchema), dunningSystemId: z.string().nullish(), dunningSystem: CommonModels.DunningSystemReferenceDTOSchema.nullish(), hblIssuerSigner: z.string(), signatureFileAttachmentId: z.string(), signatureFileAttachmentUrl: z.string().nullish() });
export type BusinessPartnerBasicResponseDTO = z.infer<typeof BusinessPartnerBasicResponseDTOSchema>;

/** 
 * UpdateBusinessPartnerPaymentTermsDtoSchema 
 * @type { object }
 * @property { string } relativeTo  
 * @property { number } days Minimum: `0` 
 */
export const UpdateBusinessPartnerPaymentTermsDtoSchema = z.object({ relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema.nullable(), days: z.number().gte(0).nullable() }).partial();
export type UpdateBusinessPartnerPaymentTermsDto = z.infer<typeof UpdateBusinessPartnerPaymentTermsDtoSchema>;

/** 
 * UpdateBusinessPartnerBasicRequestDTOSchema 
 * @type { object }
 * @property { string[] } relationship Updated relationships 
 * @property { string } vat Updated VAT number 
 * @property { string } eori Updated EORI number 
 * @property { BusinessPartnersModels.AccountTypeEnum } accountType  
 * @property { BusinessPartnersModels.BusinessPartnerAuthorization } authorization Updated authorization status 
 * @property { number } creditLimit Updated credit limit 
 * @property { string } invoiceLanguage Invoice language 
 * @property { string } invoiceCurrency Invoice currency 
 * @property { string } iban IBAN 
 * @property { string } bankNumber Bank number 
 * @property { string } bankAccountNumber Bank account number 
 * @property { string } legacySystemId Legacy system (move) id 
 * @property { string } registrationNumber  
 * @property { BusinessPartnersModels.UpdateBusinessPartnerPaymentTermsDto } termsExport  
 * @property { BusinessPartnersModels.UpdateBusinessPartnerPaymentTermsDto } termsImport  
 * @property { EditorContentUpdateDto } notes Notes 
 * @property { string } bankAccountId  
 * @property { string[] } partnerNetworkIds Partner network IDs 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { string } hblIssuerSigner HBL issuer/signer prefill 
 * @property { string } signatureFileAttachmentId Signature file attachment ID 
 */
export const UpdateBusinessPartnerBasicRequestDTOSchema = z.object({ relationship: z.array(z.string()).nullable(), vat: z.string().nullable(), eori: z.string().nullable(), accountType: AccountTypeEnumSchema.nullable(), authorization: BusinessPartnerAuthorizationSchema.nullable(), creditLimit: z.number().nullable(), invoiceLanguage: z.string().nullable(), invoiceCurrency: z.string().nullable(), iban: z.string().nullable(), bankNumber: z.string().nullable(), bankAccountNumber: z.string().nullable(), legacySystemId: z.string().nullable(), registrationNumber: z.string().nullable(), termsExport: UpdateBusinessPartnerPaymentTermsDtoSchema.nullable(), termsImport: UpdateBusinessPartnerPaymentTermsDtoSchema.nullable(), notes: CommonModels.EditorContentUpdateDtoSchema.nullable(), bankAccountId: z.string().nullable(), partnerNetworkIds: z.array(z.string()).nullable(), dunningSystemId: z.string().nullable(), hblIssuerSigner: z.string().nullable(), signatureFileAttachmentId: z.string().nullable() }).partial();
export type UpdateBusinessPartnerBasicRequestDTO = z.infer<typeof UpdateBusinessPartnerBasicRequestDTOSchema>;

/** 
 * BusinessPartnerBookkeepingMappingResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { string } businessPartnerId  
 * @property { boolean } paysTaxInEurForFactoring  
 */
export const BusinessPartnerBookkeepingMappingResponseDtoSchema = z.object({ id: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish(), currencyNotation: z.string().nullish(), businessPartnerId: z.string(), paysTaxInEurForFactoring: z.boolean().nullish() });
export type BusinessPartnerBookkeepingMappingResponseDto = z.infer<typeof BusinessPartnerBookkeepingMappingResponseDtoSchema>;

/** 
 * BusinessPartnerBookkeepingMappingsResponseDtoSchema 
 * @type { object }
 * @property { BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDto[] } bookkeepingMappings  
 */
export const BusinessPartnerBookkeepingMappingsResponseDtoSchema = z.object({ bookkeepingMappings: z.array(BusinessPartnerBookkeepingMappingResponseDtoSchema) });
export type BusinessPartnerBookkeepingMappingsResponseDto = z.infer<typeof BusinessPartnerBookkeepingMappingsResponseDtoSchema>;

/** 
 * UpdateBookkeepingMappingDtoSchema 
 * @type { object }
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { boolean } paysTaxInEurForFactoring Pays tax in EUR for factoring (Logvin case) 
 */
export const UpdateBookkeepingMappingDtoSchema = z.object({ debtorId: z.string().nullable(), creditorId: z.string().nullable(), currencyNotation: z.string().nullable(), paysTaxInEurForFactoring: z.boolean().nullable() }).partial();
export type UpdateBookkeepingMappingDto = z.infer<typeof UpdateBookkeepingMappingDtoSchema>;

/** 
 * UpdateBookkeepingMappingRequestDtoSchema 
 * @type { object }
 * @property { BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto[] } bookkeepingMappings  
 */
export const UpdateBookkeepingMappingRequestDtoSchema = z.object({ bookkeepingMappings: z.array(UpdateBookkeepingMappingDtoSchema).nullable() }).partial();
export type UpdateBookkeepingMappingRequestDto = z.infer<typeof UpdateBookkeepingMappingRequestDtoSchema>;

/** 
 * BusinessPartnerContactRoleEnumSchema 
 * @type { enum }
 */
export const BusinessPartnerContactRoleEnumSchema = z.enum(["General", "CommercialManager", "SystemEngineer", "TechnicalEngineer", "Logistics", "Operations", "Sales", "Accounting", "Invoice", "Dunnings", "Reclamations", "Management"]);
export type BusinessPartnerContactRoleEnum = z.infer<typeof BusinessPartnerContactRoleEnumSchema>;
export const BusinessPartnerContactRoleEnum = BusinessPartnerContactRoleEnumSchema.enum;

/** 
 * BusinessPartnerContactResponseDTOSchema 
 * @type { object }
 * @property { string } id Contact ID 
 * @property { BusinessPartnerContactsModels.BusinessPartnerContactRoleEnum } role  
 * @property { string } name Contact name 
 * @property { string } email Contact email 
 * @property { string } phone Contact phone 
 */
export const BusinessPartnerContactResponseDTOSchema = z.object({ id: z.string(), role: BusinessPartnerContactRoleEnumSchema.nullish(), name: z.string().nullish(), email: z.string().nullish(), phone: z.string().nullish() });
export type BusinessPartnerContactResponseDTO = z.infer<typeof BusinessPartnerContactResponseDTOSchema>;

/** 
 * BusinessPartnerContactListResponseDTOSchema 
 * @type { object }
 * @property { BusinessPartnerContactsModels.BusinessPartnerContactResponseDTO[] } contacts List of contacts 
 */
export const BusinessPartnerContactListResponseDTOSchema = z.object({ contacts: z.array(BusinessPartnerContactResponseDTOSchema) });
export type BusinessPartnerContactListResponseDTO = z.infer<typeof BusinessPartnerContactListResponseDTOSchema>;

/** 
 * CreateBusinessPartnerContactRequestDTOSchema 
 * @type { object }
 * @property { BusinessPartnerContactsModels.BusinessPartnerContactRoleEnum } role  
 * @property { string } name Contact name 
 * @property { string } email Contact email 
 * @property { string } phone Contact phone 
 */
export const CreateBusinessPartnerContactRequestDTOSchema = z.object({ role: BusinessPartnerContactRoleEnumSchema.nullable(), name: z.string().nullable(), email: z.string().nullable(), phone: z.string().nullable() }).partial();
export type CreateBusinessPartnerContactRequestDTO = z.infer<typeof CreateBusinessPartnerContactRequestDTOSchema>;

/** 
 * UpdateBusinessPartnerContactRequestDTOSchema 
 * @type { object }
 * @property { BusinessPartnerContactsModels.BusinessPartnerContactRoleEnum } role  
 * @property { string } name Contact name 
 * @property { string } email Contact email 
 * @property { string } phone Contact phone 
 */
export const UpdateBusinessPartnerContactRequestDTOSchema = z.object({ role: BusinessPartnerContactRoleEnumSchema.nullable(), name: z.string().nullable(), email: z.string().nullable(), phone: z.string().nullable() }).partial();
export type UpdateBusinessPartnerContactRequestDTO = z.infer<typeof UpdateBusinessPartnerContactRequestDTOSchema>;

/** 
 * CityCountryDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the country 
 * @property { string } name Name of the country 
 * @property { string } isoCode2 2 character iso code of the country 
 * @property { string } isoCode3 3 character iso code of the country 
 */
export const CityCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type CityCountryDto = z.infer<typeof CityCountryDtoSchema>;

/** 
 * CityEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CityEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type CityEmployeeDTO = z.infer<typeof CityEmployeeDTOSchema>;

/** 
 * CityResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the city 
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { boolean } archived Whether the city is archived 
 * @property { string } countryId Country ID 
 * @property { CitiesModels.CityCountryDto } country  
 * @property { string } createdById  
 * @property { CitiesModels.CityEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CitiesModels.CityEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CityResponseDTOSchema = z.object({ id: z.string(), name: z.string(), isoCode: z.string().nullish(), stateCode: z.string().nullish(), archived: z.boolean().nullish(), countryId: z.string().nullish(), country: CityCountryDtoSchema.nullish(), createdById: z.string().nullish(), createdBy: CityEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CityEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type CityResponseDTO = z.infer<typeof CityResponseDTOSchema>;

/** 
 * CityLabelCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CityLabelCountryDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CityLabelCountryDto = z.infer<typeof CityLabelCountryDtoSchema>;

/** 
 * CityLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { CitiesModels.CityLabelCountryDto } country  
 */
export const CityLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), country: CityLabelCountryDtoSchema.nullish() });
export type CityLabelResponseDTO = z.infer<typeof CityLabelResponseDTOSchema>;

/** 
 * DepotCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DepotCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type DepotCityDto = z.infer<typeof DepotCityDtoSchema>;

/** 
 * DepotCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const DepotCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type DepotCountryDto = z.infer<typeof DepotCountryDtoSchema>;

/** 
 * AddressDTOSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } zip ZIP/Postal code 
 * @property { DepotsModels.DepotCityDto } city  
 * @property { string } district District name 
 * @property { DepotsModels.DepotCountryDto } country  
 */
export const AddressDTOSchema = z.object({ street: z.string(), zip: z.string(), city: DepotCityDtoSchema.nullish(), district: z.string().nullish(), country: DepotCountryDtoSchema.nullish() });
export type AddressDTO = z.infer<typeof AddressDTOSchema>;

/** 
 * DepotEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DepotEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type DepotEmployeeDTO = z.infer<typeof DepotEmployeeDTOSchema>;

/** 
 * DepotResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the depot 
 * @property { string } matchCode Match code for the depot 
 * @property { string } name Name of the depot 
 * @property { string } shortName Short name of the depot 
 * @property { string } additionalInformation Additional info of the depot 
 * @property { DepotsModels.AddressDTO } address Address details of the depot 
 * @property { boolean } archived  
 * @property { string } createdById  
 * @property { DepotsModels.DepotEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { DepotsModels.DepotEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const DepotResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), name: z.string(), shortName: z.string().nullish(), additionalInformation: z.string().nullish(), address: AddressDTOSchema, archived: z.boolean(), createdById: z.string().nullish(), createdBy: DepotEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DepotEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type DepotResponseDTO = z.infer<typeof DepotResponseDTOSchema>;

/** 
 * PartnerNetworkEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PartnerNetworkEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PartnerNetworkEmployeeDTO = z.infer<typeof PartnerNetworkEmployeeDTOSchema>;

/** 
 * PartnerNetworkResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the partner network 
 * @property { string } name Name of the partner network 
 * @property { boolean } archived Whether the partner network is archived 
 * @property { string } createdById  
 * @property { PartnerNetworksModels.PartnerNetworkEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { PartnerNetworksModels.PartnerNetworkEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const PartnerNetworkResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: PartnerNetworkEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: PartnerNetworkEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type PartnerNetworkResponseDTO = z.infer<typeof PartnerNetworkResponseDTOSchema>;

/** 
 * WarehouseCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const WarehouseCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type WarehouseCityDto = z.infer<typeof WarehouseCityDtoSchema>;

/** 
 * WarehouseCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const WarehouseCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type WarehouseCountryDto = z.infer<typeof WarehouseCountryDtoSchema>;

/** 
 * WarehouseEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const WarehouseEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type WarehouseEmployeeDTO = z.infer<typeof WarehouseEmployeeDTOSchema>;

/** 
 * WarehouseResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } shortName  
 * @property { string } additionalInformation  
 * @property { string } matchCode  
 * @property { string } street  
 * @property { string } secondaryStreet  
 * @property { string } zip  
 * @property { WarehousesModels.WarehouseCityDto } city  
 * @property { WarehousesModels.WarehouseCountryDto } country  
 * @property { string } district  
 * @property { boolean } archived  
 * @property { string } createdById  
 * @property { WarehousesModels.WarehouseEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { WarehousesModels.WarehouseEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const WarehouseResponseDTOSchema = z.object({ id: z.string(), name: z.string().nullish(), shortName: z.string().nullish(), additionalInformation: z.string().nullish(), matchCode: z.string(), street: z.string().nullish(), secondaryStreet: z.string().nullish(), zip: z.string().nullish(), city: WarehouseCityDtoSchema.nullish(), country: WarehouseCountryDtoSchema.nullish(), district: z.string().nullish(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: WarehouseEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: WarehouseEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type WarehouseResponseDTO = z.infer<typeof WarehouseResponseDTOSchema>;

/** 
 * ActivityTypeEnumSchema 
 * @type { enum }
 */
export const ActivityTypeEnumSchema = z.enum(["View", "Modify"]);
export type ActivityTypeEnum = z.infer<typeof ActivityTypeEnumSchema>;
export const ActivityTypeEnum = ActivityTypeEnumSchema.enum;

/** 
 * UserSectionActivityDtoSchema 
 * @type { object }
 * @property { string } section Section name 
 * @property { UserActivityModels.ActivityTypeEnum } activityType Type of activity 
 * @property { string } lastSeen Last seen timestamp 
 */
export const UserSectionActivityDtoSchema = z.object({ section: z.string(), activityType: ActivityTypeEnumSchema, lastSeen: z.iso.datetime({ offset: true }) });
export type UserSectionActivityDto = z.infer<typeof UserSectionActivityDtoSchema>;

/** 
 * ActiveUserDtoSchema 
 * @type { object }
 * @property { string } userId User ID 
 * @property { string } firstName User first name 
 * @property { string } lastName User last name 
 * @property { string } userAvatar User avatar URL 
 * @property { UserActivityModels.UserSectionActivityDto } section User section activity 
 * @property { string } lastSeen Last seen timestamp 
 * @property { boolean } isCurrentlyActive Is currently active 
 */
export const ActiveUserDtoSchema = z.object({ userId: z.string(), firstName: z.string(), lastName: z.string(), userAvatar: z.string().nullish(), section: UserSectionActivityDtoSchema, lastSeen: z.iso.datetime({ offset: true }), isCurrentlyActive: z.boolean() });
export type ActiveUserDto = z.infer<typeof ActiveUserDtoSchema>;

/** 
 * ActivityEntityTypeEnumSchema 
 * @type { enum }
 */
export const ActivityEntityTypeEnumSchema = z.enum(["Position", "Invoice", "BusinessPartner", "Quote"]);
export type ActivityEntityTypeEnum = z.infer<typeof ActivityEntityTypeEnumSchema>;
export const ActivityEntityTypeEnum = ActivityEntityTypeEnumSchema.enum;

/** 
 * ActivityMetadataDtoSchema 
 * @type { object }
 * @property { number } totalActiveUsers Total number of active users 
 * @property { string } entityId Entity ID 
 * @property { UserActivityModels.ActivityEntityTypeEnum } entityType Entity type 
 * @property { number } activeThresholdMinutes Active threshold in minutes 
 */
export const ActivityMetadataDtoSchema = z.object({ totalActiveUsers: z.number(), entityId: z.string(), entityType: ActivityEntityTypeEnumSchema, activeThresholdMinutes: z.number() });
export type ActivityMetadataDto = z.infer<typeof ActivityMetadataDtoSchema>;

/** 
 * UserActivityResponseDtoSchema 
 * @type { object }
 * @property { UserActivityModels.ActiveUserDto[] } activeUsers List of active users 
 * @property { UserActivityModels.ActivityMetadataDto } metadata Activity metadata 
 */
export const UserActivityResponseDtoSchema = z.object({ activeUsers: z.array(ActiveUserDtoSchema), metadata: ActivityMetadataDtoSchema });
export type UserActivityResponseDto = z.infer<typeof UserActivityResponseDtoSchema>;

/** 
 * DocumentTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DocumentTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type DocumentTemplateEmployeeDTO = z.infer<typeof DocumentTemplateEmployeeDTOSchema>;

/** 
 * DocumentTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name  
 * @property { boolean } isArchived  
 * @property { string } createdById ID of the employee who created this template 
 * @property { DocumentTemplatesModels.DocumentTemplateEmployeeDTO } createdBy Employee who created this template 
 * @property { string } createdAt  
 * @property { string } updatedById ID of the employee who last updated this template 
 * @property { DocumentTemplatesModels.DocumentTemplateEmployeeDTO } updatedBy Employee who last updated this template 
 * @property { string } updatedAt  
 * @property { TemplateBlocksResponseDTO } blocks  
 */
export const DocumentTemplateResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), isArchived: z.boolean(), createdById: z.string().nullish(), createdBy: DocumentTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DocumentTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), blocks: CommonModels.TemplateBlocksResponseDTOSchema });
export type DocumentTemplateResponseDTO = z.infer<typeof DocumentTemplateResponseDTOSchema>;

/** 
 * TemplateBlocksDTOSchema 
 * @type { object }
 * @property { TitleBlockDTO } titleBlock  
 * @property { ReceiverBlockDTO } receiverBlock  
 * @property { OurInformationBlockDTO } ourInformationBlock  
 * @property { RouteTableBlockDTO } routeTableBlock  
 * @property { CargoTableBlockDTO } cargoTableBlock  
 * @property { CargoSummaryBlockDTO } cargoSummaryBlock  
 * @property { FinanceTableBlockDTO } financeTableBlock  
 * @property { RemarkBlockDTO[] } remarkBlocks  
 * @property { FooterBlockDTO } footerBlock  
 * @property { TermsBlockDTO } termsBlock  
 * @property { CutOffDatesBlockDTO } cutOffDatesBlock  
 */
export const TemplateBlocksDTOSchema = z.object({ titleBlock: CommonModels.TitleBlockDTOSchema.nullable(), receiverBlock: CommonModels.ReceiverBlockDTOSchema.nullable(), ourInformationBlock: CommonModels.OurInformationBlockDTOSchema.nullable(), routeTableBlock: CommonModels.RouteTableBlockDTOSchema.nullable(), cargoTableBlock: CommonModels.CargoTableBlockDTOSchema.nullable(), cargoSummaryBlock: CommonModels.CargoSummaryBlockDTOSchema.nullable(), financeTableBlock: CommonModels.FinanceTableBlockDTOSchema.nullable(), remarkBlocks: z.array(CommonModels.RemarkBlockDTOSchema).nullable(), footerBlock: CommonModels.FooterBlockDTOSchema.nullable(), termsBlock: CommonModels.TermsBlockDTOSchema.nullable(), cutOffDatesBlock: CommonModels.CutOffDatesBlockDTOSchema.nullable() }).partial();
export type TemplateBlocksDTO = z.infer<typeof TemplateBlocksDTOSchema>;

/** 
 * CreateDocumentTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { DocumentTemplatesModels.TemplateBlocksDTO } blocks  
 */
export const CreateDocumentTemplateRequestDTOSchema = z.object({ name: z.string(), blocks: TemplateBlocksDTOSchema.nullish() });
export type CreateDocumentTemplateRequestDTO = z.infer<typeof CreateDocumentTemplateRequestDTOSchema>;

/** 
 * UpdateDocumentTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { boolean } isArchived  
 * @property { DocumentTemplatesModels.TemplateBlocksDTO } blocks  
 */
export const UpdateDocumentTemplateRequestDTOSchema = z.object({ name: z.string().nullable(), isArchived: z.boolean().nullable(), blocks: TemplateBlocksDTOSchema.nullable() }).partial();
export type UpdateDocumentTemplateRequestDTO = z.infer<typeof UpdateDocumentTemplateRequestDTOSchema>;

/** 
 * CreateRemarkBlockRequestDTOSchema 
 * @type { object }
 * @property { EditorContentUpdateDto } content  
 * @property { number } position 1-based position of the remark block. Minimum: `1` 
 * @property { boolean } enabled  
 */
export const CreateRemarkBlockRequestDTOSchema = z.object({ content: CommonModels.EditorContentUpdateDtoSchema, position: z.number().gte(1).nullish(), enabled: z.boolean().nullish() });
export type CreateRemarkBlockRequestDTO = z.infer<typeof CreateRemarkBlockRequestDTOSchema>;

/** 
 * HsCodeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const HsCodeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type HsCodeEmployeeDTO = z.infer<typeof HsCodeEmployeeDTOSchema>;

/** 
 * HsCodeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the HS Code 
 * @property { string } name Name of the HS Code 
 * @property { string } description Description of the HS Code 
 * @property { string } customArea Custom area associated with the HS Code 
 * @property { boolean } archived Indicates if the HS Code is archived 
 * @property { string } createdById  
 * @property { HsCodesModels.HsCodeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { HsCodesModels.HsCodeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const HsCodeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), description: z.string(), customArea: z.string(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: HsCodeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: HsCodeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type HsCodeResponseDTO = z.infer<typeof HsCodeResponseDTOSchema>;

/** 
 * TransportModeEnumSchema 
 * @type { enum }
 */
export const TransportModeEnumSchema = z.enum(["Air", "Sea", "Road"]);
export type TransportModeEnum = z.infer<typeof TransportModeEnumSchema>;
export const TransportModeEnum = TransportModeEnumSchema.enum;

/** 
 * CargoTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CargoTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type CargoTypeEmployeeDTO = z.infer<typeof CargoTypeEmployeeDTOSchema>;

/** 
 * CargoTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the cargo type 
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { TransportModeEnum[] } modules Transport modules applicable to the cargo type 
 * @property { boolean } archived Indicates if the cargo type is archived 
 * @property { string } createdById  
 * @property { CargoTypesModels.CargoTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { CargoTypesModels.CargoTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const CargoTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), shortName: z.string().nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), unit: z.string(), emptyWeight: z.number().nullish(), containerIsoCode: z.string().nullish(), isContainer: z.boolean().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), archived: z.boolean(), createdById: z.string().nullish(), createdBy: CargoTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: CargoTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type CargoTypeResponseDTO = z.infer<typeof CargoTypeResponseDTOSchema>;

/** 
 * TransportModuleEnumSchema 
 * @type { enum }
 */
export const TransportModuleEnumSchema = z.enum(["Air", "Sea", "Road"]);
export type TransportModuleEnum = z.infer<typeof TransportModuleEnumSchema>;
export const TransportModuleEnum = TransportModuleEnumSchema.enum;

/** 
 * CargoTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { CargoTypesModels.TransportModuleEnum } module  
 * @property { boolean } archived Archived status filter 
 * @property { string } search  
 */
export const CargoTypePaginationFilterDtoSchema = z.object({ module: TransportModuleEnumSchema.nullable(), archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type CargoTypePaginationFilterDto = z.infer<typeof CargoTypePaginationFilterDtoSchema>;

/** 
 * CreateCargoTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { string } unit Measurement unit for dimensions 
 * @property { TransportModeEnum[] } modules Transport modes applicable to the cargo type 
 */
export const CreateCargoTypeRequestDTOSchema = z.object({ name: z.string(), shortName: z.string().nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), emptyWeight: z.number().nullish(), containerIsoCode: z.string().nullish(), isContainer: z.boolean().nullish(), unit: z.string(), modules: z.array(CommonModels.TransportModeEnumSchema) });
export type CreateCargoTypeRequestDTO = z.infer<typeof CreateCargoTypeRequestDTOSchema>;

/** 
 * UpdateCargoTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the cargo type 
 * @property { string } shortName Short name of the cargo type 
 * @property { number } length Length of the cargo type 
 * @property { number } width Width of the cargo type 
 * @property { number } height Height of the cargo type 
 * @property { number } emptyWeight Empty weight of the cargo container 
 * @property { string } containerIsoCode Container ISO code 
 * @property { boolean } isContainer Whether this cargo type is a container 
 * @property { string } unit Measurement unit for dimensions 
 * @property { TransportModeEnum[] } modules Transport modules applicable to the cargo type 
 */
export const UpdateCargoTypeRequestDTOSchema = z.object({ name: z.string().nullable(), shortName: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), emptyWeight: z.number().nullable(), containerIsoCode: z.string().nullable(), isContainer: z.boolean().nullable(), unit: z.string().nullable(), modules: z.array(CommonModels.TransportModeEnumSchema).nullable() }).partial();
export type UpdateCargoTypeRequestDTO = z.infer<typeof UpdateCargoTypeRequestDTOSchema>;

/** 
 * RouteLocationTypeEnumSchema 
 * @type { enum }
 */
export const RouteLocationTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "Port", "Terminal", "City", "Warehouse", "ContainerYard", "Airport"]);
export type RouteLocationTypeEnum = z.infer<typeof RouteLocationTypeEnumSchema>;
export const RouteLocationTypeEnum = RouteLocationTypeEnumSchema.enum;

/** 
 * RoutePointLocationResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { RouteLocationTypeEnum } type  
 */
export const RoutePointLocationResponseDtoSchema = z.object({ id: z.string(), name: z.string(), type: CommonModels.RouteLocationTypeEnumSchema.nullable() });
export type RoutePointLocationResponseDto = z.infer<typeof RoutePointLocationResponseDtoSchema>;

/** 
 * RoutePointTypeEnumSchema 
 * @type { enum }
 */
export const RoutePointTypeEnumSchema = z.enum(["EmptyContainerDepot", "LoadingAddress", "Stop", "FumigationStop", "OriginCustomsStop", "StuffingLocation", "PortTerminal", "PortOfLoading", "TransshipmentPort", "PortOfDischarge", "StrippingLocation", "ContainerYard", "DestinationCustomsStop", "FinalDestination", "EmptyContainerReturn", "OriginAgent", "HandlingAgent", "XRay", "CustomsBroker", "AirportOfDeparture", "StopAirport", "DestinationAirport", "CustomsStop", "DestinationAgent", "DeliveryAddress", "Courier", "PickupAddress", "StopAddress"]);
export type RoutePointTypeEnum = z.infer<typeof RoutePointTypeEnumSchema>;
export const RoutePointTypeEnum = RoutePointTypeEnumSchema.enum;

/** 
 * IncotermsEnumSchema 
 * @type { enum }
 */
export const IncotermsEnumSchema = z.enum(["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]);
export type IncotermsEnum = z.infer<typeof IncotermsEnumSchema>;
export const IncotermsEnum = IncotermsEnumSchema.enum;

/** 
 * PositionRouteTransportModeEnumSchema 
 * @type { enum }
 */
export const PositionRouteTransportModeEnumSchema = z.enum(["Truck", "Rail/Truck", "Rail", "Barge"]);
export type PositionRouteTransportModeEnum = z.infer<typeof PositionRouteTransportModeEnumSchema>;
export const PositionRouteTransportModeEnum = PositionRouteTransportModeEnumSchema.enum;

/** 
 * RoutePointProviderResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const RoutePointProviderResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type RoutePointProviderResponseDto = z.infer<typeof RoutePointProviderResponseDtoSchema>;

/** 
 * RoutePointResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { RoutePointTypeEnum } type  
 * @property { string } name  
 * @property { number } sequenceNumber  
 * @property { RoutePointLocationResponseDto } location  
 * @property { string } estimatedTime  
 * @property { string } secondaryEstimatedTime Secondary estimated time (sea positions only) 
 * @property { string } reference  
 * @property { string } secondaryReference  
 * @property { IncotermsEnum } incoterm  
 * @property { PositionRouteTransportModeEnum } transportMode  
 * @property { RoutePointProviderResponseDto } provider  
 * @property { string } vessel Vessel name (sea positions only) 
 * @property { string } voyage Voyage number (sea positions only) 
 * @property { string } carrier Carrier name (sea positions only) 
 */
export const RoutePointResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.RoutePointTypeEnumSchema, name: z.string(), sequenceNumber: z.number(), location: CommonModels.RoutePointLocationResponseDtoSchema.nullish(), estimatedTime: z.iso.datetime({ offset: true }).nullish(), secondaryEstimatedTime: z.iso.datetime({ offset: true }).nullish(), reference: z.string().nullish(), secondaryReference: z.string().nullish(), incoterm: CommonModels.IncotermsEnumSchema.nullish(), transportMode: CommonModels.PositionRouteTransportModeEnumSchema.nullish(), provider: CommonModels.RoutePointProviderResponseDtoSchema.nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), carrier: z.string().nullish() });
export type RoutePointResponseDto = z.infer<typeof RoutePointResponseDtoSchema>;

/** 
 * RouteResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } cargoId Cargo ID (sea positions only) 
 * @property { string } cargoNumber Cargo number (sea positions only) 
 * @property { RoutePointResponseDto[] } points  
 */
export const RouteResponseDtoSchema = z.object({ id: z.string(), cargoId: z.string().nullish(), cargoNumber: z.string().nullish(), points: z.array(CommonModels.RoutePointResponseDtoSchema) });
export type RouteResponseDto = z.infer<typeof RouteResponseDtoSchema>;

/** 
 * RouteListResponseDtoSchema 
 * @type { object }
 * @property { RouteResponseDto[] } routes  
 * @property { boolean } splitRoute Whether the position routes are split by cargo (sea positions only) 
 */
export const RouteListResponseDtoSchema = z.object({ routes: z.array(CommonModels.RouteResponseDtoSchema), splitRoute: z.boolean() });
export type RouteListResponseDto = z.infer<typeof RouteListResponseDtoSchema>;

/** 
 * CreateRoutePointRequestDtoSchema 
 * @type { object }
 * @property { RoutePointTypeEnum } type  
 */
export const CreateRoutePointRequestDtoSchema = z.object({ type: CommonModels.RoutePointTypeEnumSchema });
export type CreateRoutePointRequestDto = z.infer<typeof CreateRoutePointRequestDtoSchema>;

/** 
 * UpdateRoutePointRequestDtoSchema 
 * @type { object }
 * @property { string } locationId Location ID for the route point 
 * @property { RouteLocationTypeEnum } locationType Type of location 
 * @property { string } estimatedTime Updated estimated time for the route point 
 * @property { string } secondaryEstimatedTime Secondary estimated time for the route point (sea positions only) 
 * @property { string } reference Reference for the route point 
 * @property { string } secondaryReference Secondary reference for the route point 
 * @property { IncotermsEnum } incoterm  
 * @property { PositionRouteTransportModeEnum } transportMode  
 * @property { string } providerId  
 * @property { string } vessel Vessel name (sea positions only) 
 * @property { string } voyage Voyage number (sea positions only) 
 * @property { string } carrier Carrier name (sea positions only) 
 */
export const UpdateRoutePointRequestDtoSchema = z.object({ locationId: z.string().nullable(), locationType: CommonModels.RouteLocationTypeEnumSchema.nullable(), estimatedTime: z.iso.datetime({ offset: true }).nullable(), secondaryEstimatedTime: z.iso.datetime({ offset: true }).nullable(), reference: z.string().nullable(), secondaryReference: z.string().nullable(), incoterm: CommonModels.IncotermsEnumSchema.nullable(), transportMode: CommonModels.PositionRouteTransportModeEnumSchema.nullable(), providerId: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), carrier: z.string().nullable() }).partial();
export type UpdateRoutePointRequestDto = z.infer<typeof UpdateRoutePointRequestDtoSchema>;

/** 
 * InvolvedPartyBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 * @property { BusinessPartnerAddressResponseDTO } address Main address information 
 */
export const InvolvedPartyBusinessPartnerResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), address: CommonModels.BusinessPartnerAddressResponseDTOSchema.nullish() });
export type InvolvedPartyBusinessPartnerResponseDTO = z.infer<typeof InvolvedPartyBusinessPartnerResponseDTOSchema>;

/** 
 * InvolvedPartyContactResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvolvedPartyContactResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
export type InvolvedPartyContactResponseDTO = z.infer<typeof InvolvedPartyContactResponseDTOSchema>;

/** 
 * InvolvedPartyResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { PositionInvolvedPartyTypeEnum } type  
 * @property { string } reference  
 * @property { InvolvedPartyBusinessPartnerResponseDTO } businessPartner  
 * @property { InvolvedPartyContactResponseDTO } contact  
 */
export const InvolvedPartyResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.PositionInvolvedPartyTypeEnumSchema, reference: z.string().nullish(), businessPartner: CommonModels.InvolvedPartyBusinessPartnerResponseDTOSchema.nullish(), contact: CommonModels.InvolvedPartyContactResponseDTOSchema.nullish() });
export type InvolvedPartyResponseDto = z.infer<typeof InvolvedPartyResponseDtoSchema>;

/** 
 * CreateInvolvedPartyRequestDtoSchema 
 * @type { object }
 * @property { PositionInvolvedPartyTypeEnum } type Type of the involved party to create 
 */
export const CreateInvolvedPartyRequestDtoSchema = z.object({ type: CommonModels.PositionInvolvedPartyTypeEnumSchema });
export type CreateInvolvedPartyRequestDto = z.infer<typeof CreateInvolvedPartyRequestDtoSchema>;

/** 
 * PositionChargeDtoResponseSchema 
 * @type { object }
 * @property { object } chargeType  
 * @property { string } chargeType.id  
 * @property { string } chargeType.name  
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { object } buyVatRule  
 * @property { string } buyVatRule.id  
 * @property { string } buyVatRule.name  
 * @property { string } buyVatRule.matchcode  
 * @property { object } vendor  
 * @property { string } vendor.id  
 * @property { string } vendor.name  
 * @property { string } vendor.matchCode  
 * @property { string } vendor.label  
 * @property { string } vendor.debtorId  
 * @property { string } vendor.creditorId  
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { object } sellVatRule  
 * @property { string } sellVatRule.id  
 * @property { string } sellVatRule.name  
 * @property { string } sellVatRule.matchcode  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { string } customer.debtorId  
 * @property { string } customer.creditorId  
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 * @property { number } profit Profit amount 
 * @property { string } profitCurrencyCode Profit currency code 
 */
export const PositionChargeDtoResponseSchema = z.object({ chargeType: z.object({ id: z.string(), name: z.string() }).nullish(), additionalText: z.string(), quantity: z.number().nullish(), buyRate: z.number().nullish(), buyCurrencyCode: z.string(), buyVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).nullish(), vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).nullish(), buyExchangeRate: z.number().nullish(), sellRate: z.number().nullish(), sellCurrencyCode: z.string(), sellVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).nullish(), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).nullish(), sellExchangeRate: z.number().nullish(), profit: z.number().nullish(), profitCurrencyCode: z.string().nullish() });
export type PositionChargeDtoResponse = z.infer<typeof PositionChargeDtoResponseSchema>;

/** 
 * PositionTextDtoResponseSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const PositionTextDtoResponseSchema = z.object({ content: z.string() });
export type PositionTextDtoResponse = z.infer<typeof PositionTextDtoResponseSchema>;

/** 
 * PositionAccountItemDtoResponseSchema 
 * @type { object }
 * @property { string } id Item ID 
 * @property { string } outgoingInvoiceId  
 * @property { string } registeredInvoiceId  
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { PositionChargeDtoResponse } charge Charge data if type is CHARGE 
 * @property { PositionTextDtoResponse } text Text data if type is TEXT 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 */
export const PositionAccountItemDtoResponseSchema = z.object({ id: z.string(), outgoingInvoiceId: z.string().nullish(), registeredInvoiceId: z.string().nullish(), type: CommonModels.PositionAccountItemTypeEnumSchema, orderPosition: z.number(), charge: CommonModels.PositionChargeDtoResponseSchema.nullish(), text: CommonModels.PositionTextDtoResponseSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }) });
export type PositionAccountItemDtoResponse = z.infer<typeof PositionAccountItemDtoResponseSchema>;

/** 
 * PositionAccountTotalsResponseDtoSchema 
 * @type { object }
 * @property { number } totalBuyRates Total buy rates 
 * @property { number } totalSellRates Total sell rates 
 * @property { number } totalProfit Total profit 
 * @property { number } margin Margin percentage 
 * @property { number } displayAmount Display amount 
 * @property { string } displayCurrencyCode Display currency code 
 */
export const PositionAccountTotalsResponseDtoSchema = z.object({ totalBuyRates: z.number(), totalSellRates: z.number(), totalProfit: z.number(), margin: z.number().nullish(), displayAmount: z.number(), displayCurrencyCode: z.string() });
export type PositionAccountTotalsResponseDto = z.infer<typeof PositionAccountTotalsResponseDtoSchema>;

/** 
 * PositionAccountMasterTotalsDtoSchema 
 * @type { object }
 * @property { PositionAccountModels.PositionAccountTotalsResponseDto } totals  
 * @property { PositionAccountModels.PositionAccountTotalsResponseDto[] } totalsPerCurrency  
 */
export const PositionAccountMasterTotalsDtoSchema = z.object({ totals: PositionAccountTotalsResponseDtoSchema, totalsPerCurrency: z.array(PositionAccountTotalsResponseDtoSchema) });
export type PositionAccountMasterTotalsDto = z.infer<typeof PositionAccountMasterTotalsDtoSchema>;

/** 
 * ChildPositionAccountReferenceDtoSchema 
 * @type { object }
 * @property { string } positionId  
 * @property { string } positionNumber  
 * @property { string } accountId  
 */
export const ChildPositionAccountReferenceDtoSchema = z.object({ positionId: z.string().nullish(), positionNumber: z.string(), accountId: z.string() });
export type ChildPositionAccountReferenceDto = z.infer<typeof ChildPositionAccountReferenceDtoSchema>;

/** 
 * PositionAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id Account ID 
 * @property { string } positionId Position ID 
 * @property { string } invoiceId Invoice ID 
 * @property { PositionAccountItemDtoResponse[] } items Account items 
 * @property { PositionAccountModels.PositionAccountTotalsResponseDto } totals  
 * @property { PositionAccountModels.PositionAccountTotalsResponseDto[] } totalsPerCurrency  
 * @property { PositionAccountModels.PositionAccountMasterTotalsDto } masterTotals  
 * @property { PositionAccountModels.ChildPositionAccountReferenceDto[] } childPositionAccounts  
 */
export const PositionAccountResponseDtoSchema = z.object({ id: z.string(), positionId: z.string().nullish(), invoiceId: z.string().nullish(), items: z.array(CommonModels.PositionAccountItemDtoResponseSchema), totals: PositionAccountTotalsResponseDtoSchema, totalsPerCurrency: z.array(PositionAccountTotalsResponseDtoSchema), masterTotals: PositionAccountMasterTotalsDtoSchema.nullish(), childPositionAccounts: z.array(ChildPositionAccountReferenceDtoSchema).nullish() });
export type PositionAccountResponseDto = z.infer<typeof PositionAccountResponseDtoSchema>;

/** 
 * CreatePositionChargeDataRequestDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1` 
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
export const CreatePositionChargeDataRequestDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type CreatePositionChargeDataRequestDto = z.infer<typeof CreatePositionChargeDataRequestDtoSchema>;

/** 
 * CreatePositionTextDataRequestDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const CreatePositionTextDataRequestDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type CreatePositionTextDataRequestDto = z.infer<typeof CreatePositionTextDataRequestDtoSchema>;

/** 
 * CreatePositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { PositionAccountItemsModels.CreatePositionChargeDataRequestDto } charge Charge data if type is CHARGE 
 * @property { PositionAccountItemsModels.CreatePositionTextDataRequestDto } text Text data if type is TEXT 
 */
export const CreatePositionAccountItemRequestDtoSchema = z.object({ type: CommonModels.PositionAccountItemTypeEnumSchema, charge: CreatePositionChargeDataRequestDtoSchema.nullish(), text: CreatePositionTextDataRequestDtoSchema.nullish() });
export type CreatePositionAccountItemRequestDto = z.infer<typeof CreatePositionAccountItemRequestDtoSchema>;

/** 
 * CreatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { PositionAccountItemsModels.CreatePositionAccountItemRequestDto[] } items Array of items to create. All items in a single request must be of the same type (CHARGE, TEXT, or DIVIDER) 
 */
export const CreatePositionAccountItemsRequestDtoSchema = z.object({ items: z.array(CreatePositionAccountItemRequestDtoSchema) });
export type CreatePositionAccountItemsRequestDto = z.infer<typeof CreatePositionAccountItemsRequestDtoSchema>;

/** 
 * UpdatePositionChargeDataRequestDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1` 
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
export const UpdatePositionChargeDataRequestDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type UpdatePositionChargeDataRequestDto = z.infer<typeof UpdatePositionChargeDataRequestDtoSchema>;

/** 
 * UpdatePositionTextDataRequestDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const UpdatePositionTextDataRequestDtoSchema = z.object({ content: z.string() });
export type UpdatePositionTextDataRequestDto = z.infer<typeof UpdatePositionTextDataRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { PositionAccountItemsModels.UpdatePositionChargeDataRequestDto } charge Charge data if type is CHARGE 
 * @property { PositionAccountItemsModels.UpdatePositionTextDataRequestDto } text Text data if type is TEXT 
 */
export const UpdatePositionAccountItemRequestDtoSchema = z.object({ type: CommonModels.PositionAccountItemTypeEnumSchema, charge: UpdatePositionChargeDataRequestDtoSchema.nullish(), text: UpdatePositionTextDataRequestDtoSchema.nullish() });
export type UpdatePositionAccountItemRequestDto = z.infer<typeof UpdatePositionAccountItemRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemWithIdRequestDtoSchema 
 * @type { object }
 * @property { string } id ID of the item to update 
 * @property { PositionAccountItemsModels.UpdatePositionAccountItemRequestDto } data Data to update 
 */
export const UpdatePositionAccountItemWithIdRequestDtoSchema = z.object({ id: z.string(), data: UpdatePositionAccountItemRequestDtoSchema });
export type UpdatePositionAccountItemWithIdRequestDto = z.infer<typeof UpdatePositionAccountItemWithIdRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { PositionAccountItemsModels.UpdatePositionAccountItemWithIdRequestDto[] } items Array of items to update 
 */
export const UpdatePositionAccountItemsRequestDtoSchema = z.object({ items: z.array(UpdatePositionAccountItemWithIdRequestDtoSchema) });
export type UpdatePositionAccountItemsRequestDto = z.infer<typeof UpdatePositionAccountItemsRequestDtoSchema>;

/** 
 * UserPreviewDtoSchema 
 * @type { object }
 * @property { string } userId  
 * @property { string } name  
 */
export const UserPreviewDtoSchema = z.object({ userId: z.string(), name: z.string() });
export type UserPreviewDto = z.infer<typeof UserPreviewDtoSchema>;

/** 
 * PositionAccountProfitChangeGroupDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { UserPreviewDto[] } users  
 * @property { object } profit  
 * @property { number } profit.amount  
 * @property { string } profit.currencyCode  
 * @property { number } changeCount  
 */
export const PositionAccountProfitChangeGroupDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), users: z.array(CommonModels.UserPreviewDtoSchema), profit: z.object({ amount: z.number(), currencyCode: z.string() }), changeCount: z.number() });
export type PositionAccountProfitChangeGroupDto = z.infer<typeof PositionAccountProfitChangeGroupDtoSchema>;

/** 
 * PositionAccountProfitChangeEntryDtoSchema 
 * @type { object }
 * @property { string } timestamp  
 * @property { UserPreviewDto } user  
 * @property { number } changeNumber  
 * @property { number } oldProfit  
 * @property { number } newProfit  
 * @property { string } currencyCode  
 */
export const PositionAccountProfitChangeEntryDtoSchema = z.object({ timestamp: z.iso.datetime({ offset: true }), user: CommonModels.UserPreviewDtoSchema, changeNumber: z.number(), oldProfit: z.number(), newProfit: z.number(), currencyCode: z.string() });
export type PositionAccountProfitChangeEntryDto = z.infer<typeof PositionAccountProfitChangeEntryDtoSchema>;

/** 
 * PositionAccountProfitChangeGroupDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { string } currencyCode  
 * @property { PositionProfitChangeTrackingModels.PositionAccountProfitChangeEntryDto[] } entries  
 */
export const PositionAccountProfitChangeGroupDetailDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), currencyCode: z.string(), entries: z.array(PositionAccountProfitChangeEntryDtoSchema) });
export type PositionAccountProfitChangeGroupDetailDto = z.infer<typeof PositionAccountProfitChangeGroupDetailDtoSchema>;

/** 
 * PortCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PortCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PortCityDto = z.infer<typeof PortCityDtoSchema>;

/** 
 * PortCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const PortCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type PortCountryDto = z.infer<typeof PortCountryDtoSchema>;

/** 
 * PortAddressDtoSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } zip ZIP/Postal code 
 * @property { PortsModels.PortCityDto } city  
 * @property { string } district District name 
 * @property { PortsModels.PortCountryDto } country  
 */
export const PortAddressDtoSchema = z.object({ street: z.string(), zip: z.string(), city: PortCityDtoSchema.nullish(), district: z.string().nullish(), country: PortCountryDtoSchema.nullish() });
export type PortAddressDto = z.infer<typeof PortAddressDtoSchema>;

/** 
 * PortEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PortEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PortEmployeeDTO = z.infer<typeof PortEmployeeDTOSchema>;

/** 
 * PortResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the port 
 * @property { string } name Name of the port 
 * @property { string } matchCode Match code for the port 
 * @property { PortsModels.PortAddressDto } address Address details of the port 
 * @property { string } createdById  
 * @property { PortsModels.PortEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { PortsModels.PortEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const PortResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), address: PortAddressDtoSchema, createdById: z.string().nullish(), createdBy: PortEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: PortEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type PortResponseDTO = z.infer<typeof PortResponseDTOSchema>;

/** 
 * TerminalTypeSchema 
 * @type { enum }
 */
export const TerminalTypeSchema = z.enum(["port", "airport"]);
export type TerminalType = z.infer<typeof TerminalTypeSchema>;
export const TerminalType = TerminalTypeSchema.enum;

/** 
 * CreateTerminalRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Unique identifier code for the terminal 
 * @property { string } shortName Optional short name for the terminal 
 * @property { string } name Full name of the terminal 
 * @property { TerminalsModels.TerminalType } type Type of the terminal 
 * @property { string } portId ID of associated port, required if type is port 
 * @property { string } airportId ID of associated airport, required if type is airport 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street 
 * @property { string } zip ZIP / Postal code 
 * @property { string } district District 
 * @property { string } cityId City id 
 * @property { string } countryId Country id 
 * @property { string } additionalInformation Additional information 
 */
export const CreateTerminalRequestDTOSchema = z.object({ matchCode: z.string(), shortName: z.string().nullish(), name: z.string(), type: TerminalTypeSchema, portId: z.string().nullish(), airportId: z.string().nullish(), street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), district: z.string().nullish(), cityId: z.string(), countryId: z.string(), additionalInformation: z.string().nullish() });
export type CreateTerminalRequestDTO = z.infer<typeof CreateTerminalRequestDTOSchema>;

/** 
 * TerminalCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const TerminalCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type TerminalCityDto = z.infer<typeof TerminalCityDtoSchema>;

/** 
 * TerminalCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const TerminalCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
export type TerminalCountryDto = z.infer<typeof TerminalCountryDtoSchema>;

/** 
 * TerminalAddressDTOSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street 
 * @property { string } zip ZIP/Postal code 
 * @property { TerminalsModels.TerminalCityDto } city  
 * @property { string } district District name 
 * @property { TerminalsModels.TerminalCountryDto } country  
 */
export const TerminalAddressDTOSchema = z.object({ street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), city: TerminalCityDtoSchema.nullish(), district: z.string().nullish(), country: TerminalCountryDtoSchema.nullish() });
export type TerminalAddressDTO = z.infer<typeof TerminalAddressDTOSchema>;

/** 
 * AirportReferenceDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the airport 
 * @property { string } name Name of the airport 
 */
export const AirportReferenceDTOSchema = z.object({ id: z.string(), name: z.string() });
export type AirportReferenceDTO = z.infer<typeof AirportReferenceDTOSchema>;

/** 
 * PortReferenceDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the port 
 * @property { string } name Name of the port 
 */
export const PortReferenceDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PortReferenceDTO = z.infer<typeof PortReferenceDTOSchema>;

/** 
 * TerminalEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const TerminalEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type TerminalEmployeeDTO = z.infer<typeof TerminalEmployeeDTOSchema>;

/** 
 * TerminalResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the terminal 
 * @property { string } matchCode Match code for the terminal 
 * @property { string } name Name of the terminal 
 * @property { TerminalsModels.TerminalType } type Type of the terminal 
 * @property { TerminalsModels.AirportReferenceDTO } airport Associated airport information if terminal type is airport 
 * @property { TerminalsModels.PortReferenceDTO } port Associated port information if terminal type is port 
 * @property { boolean } archived Archived status of the terminal 
 * @property { string } shortName Short name of the terminal 
 * @property { TerminalsModels.TerminalAddressDTO } address Address of the terminal 
 * @property { string } additionalInformation Additional information 
 * @property { string } createdById  
 * @property { TerminalsModels.TerminalEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { TerminalsModels.TerminalEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const TerminalResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), name: z.string(), type: TerminalTypeSchema.nullish(), airport: AirportReferenceDTOSchema.nullish(), port: PortReferenceDTOSchema.nullish(), archived: z.boolean(), shortName: z.string().nullish(), address: TerminalAddressDTOSchema.nullish(), additionalInformation: z.string().nullish(), createdById: z.string().nullish(), createdBy: TerminalEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: TerminalEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type TerminalResponseDTO = z.infer<typeof TerminalResponseDTOSchema>;

/** 
 * UpdateTerminalRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Updated match code for the terminal 
 * @property { string } shortName Updated short name 
 * @property { string } name Updated name 
 * @property { TerminalsModels.TerminalType } type Type of the terminal 
 * @property { string } portId ID of associated port, required if type is port 
 * @property { string } airportId ID of associated airport, required if type is airport 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street 
 * @property { string } zip ZIP / Postal code 
 * @property { string } district District 
 * @property { string } cityId City id 
 * @property { string } countryId Country id 
 * @property { string } additionalInformation Additional information 
 */
export const UpdateTerminalRequestDTOSchema = z.object({ matchCode: z.string().nullable(), shortName: z.string().nullable(), name: z.string().nullable(), type: TerminalTypeSchema.nullable(), portId: z.string().nullable(), airportId: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), district: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), additionalInformation: z.string().nullable() }).partial();
export type UpdateTerminalRequestDTO = z.infer<typeof UpdateTerminalRequestDTOSchema>;

/** 
 * AirportEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const AirportEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type AirportEmployeeDTO = z.infer<typeof AirportEmployeeDTOSchema>;

/** 
 * AirportResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the airport 
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 * @property { string } createdById  
 * @property { AirportsModels.AirportEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { AirportsModels.AirportEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const AirportResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), iataCode: z.string(), createdById: z.string().nullish(), createdBy: AirportEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: AirportEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type AirportResponseDTO = z.infer<typeof AirportResponseDTOSchema>;

/** 
 * ExportDeclarationDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const ExportDeclarationDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type ExportDeclarationDocumentBusinessPartnerResponseDTO = z.infer<typeof ExportDeclarationDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * ExportDeclarationDocumentCargoResponseDTOSchema 
 * @type { object }
 * @property { number } quantity Quantity of packages 
 * @property { number } weight Weight of the cargo 
 * @property { number } length Length of the cargo 
 * @property { number } width Width of the cargo 
 * @property { number } height Height of the cargo 
 * @property { string } packageType Type of package 
 * @property { string } positionNumber Position number 
 */
export const ExportDeclarationDocumentCargoResponseDTOSchema = z.object({ quantity: z.number(), weight: z.number(), length: z.number(), width: z.number(), height: z.number(), packageType: z.string(), positionNumber: z.string() });
export type ExportDeclarationDocumentCargoResponseDTO = z.infer<typeof ExportDeclarationDocumentCargoResponseDTOSchema>;

/** 
 * ExportDeclarationDocumentRouteResponseDTOSchema 
 * @type { object }
 * @property { string } pickupDate Pickup date 
 * @property { string } deliveryDate Delivery date 
 * @property { string } pickupCity Pickup city 
 * @property { string } deliveryCity Delivery city 
 */
export const ExportDeclarationDocumentRouteResponseDTOSchema = z.object({ pickupDate: z.string(), deliveryDate: z.string(), pickupCity: z.string(), deliveryCity: z.string() });
export type ExportDeclarationDocumentRouteResponseDTO = z.infer<typeof ExportDeclarationDocumentRouteResponseDTOSchema>;

/** 
 * HBLDocumentConfigDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 * @property { string } blTermsAndConditionsImageUrl BL terms and conditions image URL 
 * @property { string } signatureImageUrl Signature image URL 
 * @property { boolean } hasSignatureImage Whether office has a signature image configured 
 */
export const HBLDocumentConfigDtoSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable(), blTermsAndConditionsImageUrl: z.string().nullable(), signatureImageUrl: z.string().nullable(), hasSignatureImage: z.boolean().nullable() }).partial();
export type HBLDocumentConfigDto = z.infer<typeof HBLDocumentConfigDtoSchema>;

/** 
 * DirectionEnumSchema 
 * @type { enum }
 */
export const DirectionEnumSchema = z.enum(["Import", "Export"]);
export type DirectionEnum = z.infer<typeof DirectionEnumSchema>;
export const DirectionEnum = DirectionEnumSchema.enum;

/** 
 * ExportDeclarationDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the export declaration document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the export declaration document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } dateOfHandover Date when the goods are handed over for export 
 * @property { string } direction Direction of the shipment (e.g., import/export) 
 * @property { string } transportMode Mode of transport for the shipment 
 * @property { number } versionNumber Version number of the document 
 * @property { string } issuerName Name of the issuer 
 * @property { string } issuerAddress Address of the issuer 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentBusinessPartnerResponseDTO } customer Customer information 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { string } selectedCargoId ID of the selected cargo 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentRouteResponseDTO } route Route information 
 * @property { string } signingPlace Place where the document is signed 
 * @property { string } signingDate Date when the document is signed 
 * @property { WorkingDocumentsExportDeclarationModels.ExportDeclarationDocumentBusinessPartnerResponseDTO } signedBy Information about who signed the document 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { HBLDocumentConfigDto } config Configuration settings for the document 
 */
export const ExportDeclarationDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), dateOfHandover: z.iso.datetime({ offset: true }).nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), versionNumber: z.number(), issuerName: z.string().nullish(), issuerAddress: z.string().nullish(), customer: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.nullish(), consignee: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.nullish(), selectedCargoId: z.string().nullish(), cargo: z.array(ExportDeclarationDocumentCargoResponseDTOSchema).nullish(), route: ExportDeclarationDocumentRouteResponseDTOSchema.nullish(), signingPlace: z.string().nullish(), signingDate: z.iso.datetime({ offset: true }).nullish(), signedBy: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.HBLDocumentConfigDtoSchema.nullish() });
export type ExportDeclarationDocumentResponseDTO = z.infer<typeof ExportDeclarationDocumentResponseDTOSchema>;

/** 
 * UpdateExportDeclarationDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Name suffix 
 * @property { string } dateOfHandover Date when goods are handed over for export 
 * @property { string } issuerName Name of the issuer 
 * @property { string } issuerAddress Address of the issuer 
 * @property { string } customerId Customer ID 
 * @property { string } customerAddress Customer address 
 * @property { string } shipperId Shipper ID 
 * @property { string } shipperAddress Shipper address 
 * @property { string } consigneeId Consignee ID 
 * @property { string } consigneeAddress Consignee address 
 * @property { string } selectedCargoId Selected cargo ID 
 * @property { string } signingPlace Place where the document is signed 
 * @property { string } signingDate Date when the document is signed 
 * @property { string } signedByEmployeeId ID of the employee who signed the document 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateExportDeclarationDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), dateOfHandover: z.iso.datetime({ offset: true }).nullable(), issuerName: z.string().nullable(), issuerAddress: z.string().nullable(), customerId: z.string().nullable(), customerAddress: z.string().nullable(), shipperId: z.string().nullable(), shipperAddress: z.string().nullable(), consigneeId: z.string().nullable(), consigneeAddress: z.string().nullable(), selectedCargoId: z.string().nullable(), signingPlace: z.string().nullable(), signingDate: z.iso.datetime({ offset: true }).nullable(), signedByEmployeeId: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateExportDeclarationDocumentRequestDTO = z.infer<typeof UpdateExportDeclarationDocumentRequestDTOSchema>;

/** 
 * HazardousPackingGroupEnumSchema 
 * @type { enum }
 */
export const HazardousPackingGroupEnumSchema = z.enum(["PG I", "PG II", "PG III"]);
export type HazardousPackingGroupEnum = z.infer<typeof HazardousPackingGroupEnumSchema>;
export const HazardousPackingGroupEnum = HazardousPackingGroupEnumSchema.enum;

/** 
 * PositionCargoPackageHazardousSpecialtyResponseDTOSchema 
 * @type { object }
 * @property { number } totalLength  
 * @property { number } totalWidth  
 * @property { number } temperature  
 * @property { string } unNumber  
 * @property { string } IMOClass  
 * @property { string } shippingName  
 * @property { string } technicalName  
 * @property { HazardousPackingGroupEnum } packagingGroup  
 * @property { number } netWeight  
 * @property { number } flashpoint  
 * @property { string[] } properties  
 * @property { string } acceptanceNumber  
 * @property { string } medGuide  
 * @property { string } emergencyPhone  
 * @property { string } emergencySchedule  
 */
export const PositionCargoPackageHazardousSpecialtyResponseDTOSchema = z.object({ totalLength: z.number().nullable(), totalWidth: z.number().nullable(), temperature: z.number().nullable(), unNumber: z.string().nullable(), IMOClass: z.string().nullable(), shippingName: z.string().nullable(), technicalName: z.string().nullable(), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema.nullable(), netWeight: z.number().nullable(), flashpoint: z.number().nullable(), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).nullable(), acceptanceNumber: z.string().nullable(), medGuide: z.string().nullable(), emergencyPhone: z.string().nullable(), emergencySchedule: z.string().nullable() }).partial();
export type PositionCargoPackageHazardousSpecialtyResponseDTO = z.infer<typeof PositionCargoPackageHazardousSpecialtyResponseDTOSchema>;

/** 
 * PositionCargoPackageTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionCargoPackageTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PositionCargoPackageTypeResponseDTO = z.infer<typeof PositionCargoPackageTypeResponseDTOSchema>;

/** 
 * HsCodeLabelDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const HsCodeLabelDtoSchema = z.object({ id: z.string(), label: z.string() });
export type HsCodeLabelDto = z.infer<typeof HsCodeLabelDtoSchema>;

/** 
 * PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema = z.object({ temperatureFrom: z.number().nullable(), temperatureUntil: z.number().nullable() }).partial();
export type PositionCargoPackageTemperatureControlledSpecialtyResponseDto = z.infer<typeof PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema>;

/** 
 * PositionCargoSourcePackageResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } positionNumber  
 */
export const PositionCargoSourcePackageResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string() });
export type PositionCargoSourcePackageResponseDTO = z.infer<typeof PositionCargoSourcePackageResponseDTOSchema>;

/** 
 * PositionCargoPackageResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } cargoId  
 * @property { string } rootFolderId  
 * @property { number } quantity  
 * @property { string } packageTypeId  
 * @property { PositionCargoPackageTypeResponseDTO } packageType  
 * @property { number } length  
 * @property { number } width  
 * @property { number } height  
 * @property { number } netWeight  
 * @property { number } grossWeight  
 * @property { number } chargeableWeight  
 * @property { string } note  
 * @property { string } name  
 * @property { number } orderNumber  
 * @property { number } volume  
 * @property { number } volumetricWeight  
 * @property { string } caseMarks  
 * @property { string } description  
 * @property { string[] } hsCodes  
 * @property { HsCodeLabelDto[] } hsCodeLabels HS code details 
 * @property { string } customsRemarks  
 * @property { number } loadMeter  
 * @property { string[] } specialties  
 * @property { PositionCargoPackageHazardousSpecialtyResponseDTO } hazardousSpecialty  
 * @property { PositionCargoPackageTemperatureControlledSpecialtyResponseDto } temperatureControlledSpecialty  
 * @property { PositionCargoSourcePackageResponseDTO } sourcePackage  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const PositionCargoPackageResponseDTOSchema = z.object({ id: z.string(), cargoId: z.string(), rootFolderId: z.string().nullish(), quantity: z.number().nullish(), packageTypeId: z.string().nullish(), packageType: CommonModels.PositionCargoPackageTypeResponseDTOSchema.nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), netWeight: z.number().nullish(), grossWeight: z.number().nullish(), chargeableWeight: z.number().nullish(), note: z.string().nullish(), name: z.string().nullish(), orderNumber: z.number().nullish(), volume: z.number().nullish(), volumetricWeight: z.number().nullish(), caseMarks: z.string().nullish(), description: z.string().nullish(), hsCodes: z.array(z.string()).nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).nullish(), customsRemarks: z.string().nullish(), loadMeter: z.number().nullish(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema), hazardousSpecialty: CommonModels.PositionCargoPackageHazardousSpecialtyResponseDTOSchema.nullish(), temperatureControlledSpecialty: CommonModels.PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema.nullish(), sourcePackage: CommonModels.PositionCargoSourcePackageResponseDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), mrn: z.string().nullish(), exportPortFilling: z.string().nullish(), customsReleased: z.boolean().nullish(), importCustomsReleaseNumber: z.string().nullish(), portCustomsNumber: z.string().nullish() });
export type PositionCargoPackageResponseDTO = z.infer<typeof PositionCargoPackageResponseDTOSchema>;

/** 
 * PackageTotalsDtoSchema 
 * @type { object }
 * @property { number } quantity  
 * @property { number } weightPerPiece  
 * @property { number } volume  
 * @property { number } chargeableWeight  
 * @property { number } loadMeter  
 */
export const PackageTotalsDtoSchema = z.object({ quantity: z.number(), weightPerPiece: z.number(), volume: z.number(), chargeableWeight: z.number().nullish(), loadMeter: z.number().nullish() });
export type PackageTotalsDto = z.infer<typeof PackageTotalsDtoSchema>;

/** 
 * PackageSpecialtyTotalsResponseDtoSchema 
 * @type { object }
 * @property { PackageTotalsDto } noSpecialties  
 * @property { PackageTotalsDto } hazardous  
 * @property { PackageTotalsDto } nonStackable  
 * @property { PackageTotalsDto } temperatureControlled  
 * @property { PackageTotalsDto } diplomatic  
 * @property { PackageTotalsDto } oversized  
 * @property { PackageTotalsDto } total  
 */
export const PackageSpecialtyTotalsResponseDtoSchema = z.object({ noSpecialties: CommonModels.PackageTotalsDtoSchema, hazardous: CommonModels.PackageTotalsDtoSchema, nonStackable: CommonModels.PackageTotalsDtoSchema, temperatureControlled: CommonModels.PackageTotalsDtoSchema, diplomatic: CommonModels.PackageTotalsDtoSchema, oversized: CommonModels.PackageTotalsDtoSchema, total: CommonModels.PackageTotalsDtoSchema });
export type PackageSpecialtyTotalsResponseDto = z.infer<typeof PackageSpecialtyTotalsResponseDtoSchema>;

/** 
 * PositionCargoCargoTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Cargo type ID. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } name Cargo type name. Example: `Electronics` 
 * @property { string } shortName Cargo type short name. Example: `ELEC` 
 */
export const PositionCargoCargoTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), shortName: z.string().nullish() });
export type PositionCargoCargoTypeResponseDTO = z.infer<typeof PositionCargoCargoTypeResponseDTOSchema>;

/** 
 * PositionCargoResponseDTOSchema 
 * @type { object }
 * @property { string } id Cargo ID. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } positionId Position ID this cargo belongs to. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } quoteId Quote ID this cargo belongs to. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } rootFolderId Folder id bound to this cargo. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { PositionCargoCargoTypeResponseDTO } cargoType Cargo type 
 * @property { boolean } autoCalculateTotals  
 * @property { boolean } shipperOwnContainer  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { string } textForCustoms  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { HsCodeLabelDto[] } hsCodeLabels HS code details 
 * @property { string } note  
 * @property { PositionCargoPackageResponseDTO[] } packages Packages for the cargo 
 * @property { string } createdAt Creation date. Example: `2023-04-09T12:00:00Z` 
 * @property { string } updatedAt Last update date. Example: `2023-04-09T12:00:00Z` 
 * @property { number } completeWeight  
 * @property { PackageSpecialtyTotalsResponseDto } packageTotals  
 */
export const PositionCargoResponseDTOSchema = z.object({ id: z.string(), positionId: z.string().nullish(), quoteId: z.string().nullish(), rootFolderId: z.string().nullish(), cargoType: CommonModels.PositionCargoCargoTypeResponseDTOSchema.nullish(), autoCalculateTotals: z.boolean(), shipperOwnContainer: z.boolean(), autoCalculateRates: z.boolean(), autoCalculateVgm: z.boolean(), transportUnitNumber: z.string().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), rateOptions: z.string().nullish(), rateClass: z.string().nullish(), textForCustoms: z.string().nullish(), totalVolume: z.number().nullish(), totalGrossWeight: z.number().nullish(), totalNetWeight: z.number().nullish(), totalVolumetricWeight: z.number().nullish(), totalChargeableWeight: z.number().nullish(), totalLoadMeter: z.number().nullish(), ratePerKg: z.number().nullish(), totalRate: z.number().nullish(), tare: z.number().nullish(), vgm: z.number().nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).nullish(), note: z.string().nullish(), packages: z.array(CommonModels.PositionCargoPackageResponseDTOSchema).nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), completeWeight: z.number().nullish(), packageTotals: CommonModels.PackageSpecialtyTotalsResponseDtoSchema.nullish() });
export type PositionCargoResponseDTO = z.infer<typeof PositionCargoResponseDTOSchema>;

/** 
 * HazardousSpecialtyDTOSchema 
 * @type { object }
 * @property { number } totalLength Total length 
 * @property { number } totalWidth Total width 
 * @property { number } temperature Temperature 
 * @property { string } unNumber UN number 
 * @property { string } IMOClass IMOClass 
 * @property { string } shippingName Shipping name 
 * @property { string } technicalName Technical name 
 * @property { HazardousPackingGroupEnum } packagingGroup Packaging 
 * @property { number } netWeight Net weight 
 * @property { number } flashpoint Flashpoint 
 * @property { string[] } properties Properties 
 * @property { string } acceptanceNumber Acceptance number 
 * @property { string } medGuide Medical guide 
 * @property { string } emergencyPhone Emergency phone 
 * @property { string } emergencySchedule Emergency schedule 
 */
export const HazardousSpecialtyDTOSchema = z.object({ totalLength: z.number().nullable(), totalWidth: z.number().nullable(), temperature: z.number().nullable(), unNumber: z.string().nullable(), IMOClass: z.string().nullable(), shippingName: z.string().nullable(), technicalName: z.string().nullable(), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema.nullable(), netWeight: z.number().nullable(), flashpoint: z.number().nullable(), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).nullable(), acceptanceNumber: z.string().nullable(), medGuide: z.string().nullable(), emergencyPhone: z.string().nullable(), emergencySchedule: z.string().nullable() }).partial();
export type HazardousSpecialtyDTO = z.infer<typeof HazardousSpecialtyDTOSchema>;

/** 
 * TemperatureControlledSpecialtyDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const TemperatureControlledSpecialtyDtoSchema = z.object({ temperatureFrom: z.number().nullable(), temperatureUntil: z.number().nullable() }).partial();
export type TemperatureControlledSpecialtyDto = z.infer<typeof TemperatureControlledSpecialtyDtoSchema>;

/** 
 * CreatePositionCargoPackageDTOSchema 
 * @type { object }
 * @property { number } quantity Package quantity 
 * @property { string } packageTypeId Package type ID 
 * @property { number } length Package length 
 * @property { number } width Package width 
 * @property { number } height Package height 
 * @property { number } netWeight Package net weight 
 * @property { number } grossWeight Package gross weight 
 * @property { number } loadMeter Package load meter 
 * @property { number } chargeableWeight Package chargeable weight 
 * @property { number } volume Package volume 
 * @property { number } volumetricWeight Package volumetric weight 
 * @property { string } caseMarks Package case marks 
 * @property { string } note Package note 
 * @property { string } description Package description 
 * @property { string[] } hsCodes Package HS codes 
 * @property { string } customsRemarks Text for customs 
 * @property { string[] } specialties  
 * @property { HazardousSpecialtyDTO } hazardousSpecialty  
 * @property { TemperatureControlledSpecialtyDto } temperatureControlledSpecialty  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const CreatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().nullable(), packageTypeId: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), netWeight: z.number().nullable(), grossWeight: z.number().nullable(), loadMeter: z.number().nullable(), chargeableWeight: z.number().nullable(), volume: z.number().nullable(), volumetricWeight: z.number().nullable(), caseMarks: z.string().nullable(), note: z.string().nullable(), description: z.string().nullable(), hsCodes: z.array(z.string()).nullable(), customsRemarks: z.string().nullable(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).nullable(), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema.nullable(), temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema.nullable(), mrn: z.string().nullable(), exportPortFilling: z.string().nullable(), customsReleased: z.boolean().nullable(), importCustomsReleaseNumber: z.string().nullable(), portCustomsNumber: z.string().nullable() }).partial();
export type CreatePositionCargoPackageDTO = z.infer<typeof CreatePositionCargoPackageDTOSchema>;

/** 
 * UpdatePositionCargoPackageDTOSchema 
 * @type { object }
 * @property { number } quantity Package quantity 
 * @property { string } packageTypeId Package type ID 
 * @property { number } length Package length 
 * @property { number } width Package width 
 * @property { number } height Package height 
 * @property { number } netWeight Package net weight 
 * @property { number } grossWeight Package gross weight 
 * @property { number } chargeableWeight Package chargeable weight 
 * @property { string } note Package case marks 
 * @property { number } volume Package volume 
 * @property { number } volumetricWeight Package volumetric weight 
 * @property { number } orderNumber Package order number 
 * @property { string } caseMarks Package case marks 
 * @property { string } description Package description 
 * @property { string[] } hsCodes Package HS codes 
 * @property { string } customsRemarks Text for customs 
 * @property { number } loadMeter Load meter 
 * @property { string[] } specialties Package specialties 
 * @property { HazardousSpecialtyDTO } hazardousSpecialty Hazardous specialty details 
 * @property { TemperatureControlledSpecialtyDto } temperatureControlledSpecialty  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const UpdatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().nullable(), packageTypeId: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), netWeight: z.number().nullable(), grossWeight: z.number().nullable(), chargeableWeight: z.number().nullable(), note: z.string().nullable(), volume: z.number().nullable(), volumetricWeight: z.number().nullable(), orderNumber: z.number().nullable(), caseMarks: z.string().nullable(), description: z.string().nullable(), hsCodes: z.array(z.string()).nullable(), customsRemarks: z.string().nullable(), loadMeter: z.number().nullable(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).nullable(), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema.nullable(), temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema.nullable(), mrn: z.string().nullable(), exportPortFilling: z.string().nullable(), customsReleased: z.boolean().nullable(), importCustomsReleaseNumber: z.string().nullable(), portCustomsNumber: z.string().nullable() }).partial();
export type UpdatePositionCargoPackageDTO = z.infer<typeof UpdatePositionCargoPackageDTOSchema>;

/** 
 * PackageTypeCodeEnumSchema 
 * @type { enum }
 */
export const PackageTypeCodeEnumSchema = z.enum(["1A", "1B", "1D", "1F", "1G", "1W", "2C", "3A", "3H", "43", "44", "4A", "4B", "4C", "4D", "4F", "4G", "4H", "5H", "5L", "5M", "6H", "6P", "7A", "7B", "8A", "8B", "8C", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AL", "AM", "AP", "AT", "AV", "B4", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DP", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EN", "FB", "FC", "FD", "FE", "FI", "FL", "FO", "FP", "FR", "FT", "FW", "FX", "GB", "GI", "GL", "GR", "GU", "GY", "GZ", "HA", "HB", "HC", "HG", "HN", "HR", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "IK", "IL", "IN", "IZ", "JB", "JC", "JG", "JR", "JT", "JY", "KG", "KI", "LE", "LG", "LT", "LU", "LV", "LZ", "MA", "MB", "MC", "ME", "MR", "MS", "MT", "MW", "MX", "NA", "NE", "NF", "NG", "NS", "NT", "NU", "NV", "OA", "OB", "OC", "OD", "OE", "OF", "OK", "OT", "OU", "P2", "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PN", "PO", "PP", "PR", "PT", "PU", "PV", "PX", "PY", "PZ", "QA", "QB", "QC", "QD", "QF", "QG", "QH", "QJ", "QK", "QL", "QM", "QN", "QP", "QQ", "QR", "QS", "RD", "RG", "RJ", "RK", "RL", "RO", "RT", "RZ", "SA", "SB", "SC", "SD", "SE", "SH", "SI", "SK", "SL", "SM", "SO", "SP", "SS", "ST", "SU", "SV", "SW", "SY", "SZ", "T1", "TB", "TC", "TD", "TE", "TG", "TI", "TK", "TL", "TN", "TO", "TR", "TS", "TT", "TU", "TV", "TW", "TY", "TZ", "UC", "UN", "VA", "VG", "VI", "VK", "VL", "VO", "VP", "VQ", "VN", "VR", "VS", "VY", "WA", "WB", "WC", "WD", "WF", "WG", "WH", "WJ", "WK", "WL", "WM", "WN", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ", "XA", "XB", "XC", "XD", "XF", "XG", "XH", "XJ", "XK", "YA", "YB", "YC", "YD", "YF", "YG", "YH", "YJ", "YK", "YL", "YM", "YN", "YP", "YQ", "YR", "YS", "YT", "YV", "YW", "YX", "YY", "YZ", "ZA", "ZB", "ZC", "ZD", "ZF", "ZG", "ZH", "ZJ", "ZK", "ZL", "ZM", "ZN", "ZP", "ZQ", "ZR", "ZS", "ZT", "ZU", "ZV", "ZW", "ZX", "ZY", "ZZ"]);
export type PackageTypeCodeEnum = z.infer<typeof PackageTypeCodeEnumSchema>;
export const PackageTypeCodeEnum = PackageTypeCodeEnumSchema.enum;

/** 
 * PackageTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PackageTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PackageTypeEmployeeDTO = z.infer<typeof PackageTypeEmployeeDTOSchema>;

/** 
 * PackageTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the package type 
 * @property { string } name Unique name for the package type 
 * @property { number } length Length of the package type 
 * @property { number } width Width of the package type 
 * @property { number } height Height of the package type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { boolean } archived Indicates if the package type is archived 
 * @property { PackageTypesModels.PackageTypeCodeEnum } code  
 * @property { string } createdById  
 * @property { PackageTypesModels.PackageTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { PackageTypesModels.PackageTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const PackageTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), unit: z.string(), archived: z.boolean(), code: PackageTypeCodeEnumSchema.nullish(), createdById: z.string().nullish(), createdBy: PackageTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: PackageTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type PackageTypeResponseDTO = z.infer<typeof PackageTypeResponseDTOSchema>;

/** 
 * CreatePackageTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Unique name for the package type 
 * @property { number } length Length of the package type 
 * @property { number } width Width of the package type 
 * @property { number } height Height of the package type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { PackageTypesModels.PackageTypeCodeEnum } code  
 */
export const CreatePackageTypeRequestDTOSchema = z.object({ name: z.string(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), unit: z.string(), code: PackageTypeCodeEnumSchema.nullish() });
export type CreatePackageTypeRequestDTO = z.infer<typeof CreatePackageTypeRequestDTOSchema>;

/** 
 * UpdatePackageTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name for package type 
 * @property { number } length Updated length of the package type 
 * @property { number } width Updated width of the package type 
 * @property { number } height Updated height of the package type 
 * @property { string } unit Updated measurement unit for dimensions 
 * @property { PackageTypesModels.PackageTypeCodeEnum } code  
 */
export const UpdatePackageTypeRequestDTOSchema = z.object({ name: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), unit: z.string().nullable(), code: PackageTypeCodeEnumSchema.nullable() }).partial();
export type UpdatePackageTypeRequestDTO = z.infer<typeof UpdatePackageTypeRequestDTOSchema>;

/** 
 * QuantityOfOriginalBlDocumentsEnumSchema 
 * @type { enum }
 */
export const QuantityOfOriginalBlDocumentsEnumSchema = z.enum(["ZERO", "ONE", "TWO", "THREE"]);
export type QuantityOfOriginalBlDocumentsEnum = z.infer<typeof QuantityOfOriginalBlDocumentsEnumSchema>;
export const QuantityOfOriginalBlDocumentsEnum = QuantityOfOriginalBlDocumentsEnumSchema.enum;

/** 
 * HouseBlDocumentSettingsDtoDTOSchema 
 * @type { object }
 * @property { QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals 
 * @property { number } quantityOfCopies Quantity of copies 
 * @property { string } date Date 
 * @property { string } location Location 
 * @property { string } signer Signer 
 * @property { boolean } hideSignature Hide signature 
 * @property { boolean } capsLock Render issuer/signer in caps lock 
 * @property { string } documentTitle Document title 
 */
export const HouseBlDocumentSettingsDtoDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), quantityOfCopies: z.number().nullable(), date: z.iso.datetime({ offset: true }).nullable(), location: z.string().nullable(), signer: z.string().nullable(), hideSignature: z.boolean().nullable(), capsLock: z.boolean().nullable(), documentTitle: z.string().nullable() }).partial();
export type HouseBlDocumentSettingsDtoDTO = z.infer<typeof HouseBlDocumentSettingsDtoDTOSchema>;

/** 
 * HouseBlDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const HouseBlDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type HouseBlDocumentBusinessPartnerResponseDTO = z.infer<typeof HouseBlDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * HouseBlDocumentCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const HouseBlDocumentCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentCountryResponseDTO = z.infer<typeof HouseBlDocumentCountryResponseDTOSchema>;

/** 
 * HouseBlDocumentPlaceResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the place 
 * @property { string } name Name of the place 
 */
export const HouseBlDocumentPlaceResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentPlaceResponseDTO = z.infer<typeof HouseBlDocumentPlaceResponseDTOSchema>;

/** 
 * HouseBlDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const HouseBlDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentPortResponseDTO = z.infer<typeof HouseBlDocumentPortResponseDTOSchema>;

/** 
 * HouseBlDocumentTerminalResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the terminal 
 * @property { string } name Name of the terminal 
 */
export const HouseBlDocumentTerminalResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentTerminalResponseDTO = z.infer<typeof HouseBlDocumentTerminalResponseDTOSchema>;

/** 
 * HouseBlDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the house BL document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the house BL document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } blNumber Bill of lading number 
 * @property { string } carrierBookingNumber Carrier booking number 
 * @property { string } exportReference Export reference number 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } forwarder Forwarder information for the shipment 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentCountryResponseDTO } originCountry Origin country 
 * @property { boolean } useLatterOfCredit Whether to use letter of credit 
 * @property { EditorContentResponseDto } additionalText Additional text for the document 
 * @property { EditorContentResponseDto } additionalTextTop Additional text for the document 
 * @property { string } direction Direction of the shipment (e.g., import/export) 
 * @property { string } transportMode Mode of transport for the shipment 
 * @property { number } versionNumber Version number of the document 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } consignee Consignee information for the shipment 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } shipper Shipper information for the shipment 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } cargoReleaseBy Delivery agent information for the shipment 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } notify Notify party information for the shipment 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } alsoNotify Additional notify party information 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentBusinessPartnerResponseDTO } precarriageBy Pre-carriage by information 
 * @property { string } precarriageByText Pre-carriage by free-text override 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentPlaceResponseDTO } placeOfReceipt Place of receipt information 
 * @property { string } placeOfReceiptText Place of receipt free-text override 
 * @property { string } vessel Name of the vessel 
 * @property { string } voyage Voyage number of the vessel 
 * @property { string } declaredValue Declared value of the shipment 
 * @property { number } rateOfExchange Rate of exchange of the shipment 
 * @property { string } currency Currency of the shipment 
 * @property { string } freightPayable Freight payable of the shipment 
 * @property { string } issuer Issuer 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentPortResponseDTO } portOfLoading Port of loading information 
 * @property { string } portOfLoadingText Port of loading free-text override 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentTerminalResponseDTO } loadingPierTerminal Loading pier/terminal information 
 * @property { string } loadingPierTerminalText Loading pier/terminal free-text override 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentPortResponseDTO } portOfDischarge Port of discharge information 
 * @property { string } portOfDischargeText Port of discharge free-text override 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentPlaceResponseDTO } placeOfDelivery Place of delivery information 
 * @property { string } placeOfDeliveryText Place of delivery free-text override 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentPlaceResponseDTO } originalsToBeReleasedAt Originals to be released at information 
 * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override 
 * @property { string } typeOfMove Type of move 
 * @property { string } placeOfIssue  
 * @property { TemplatedDocumentDataDto } data Templated document data 
 * @property { WorkingDocumentsHouseBlModels.HouseBlDocumentSettingsDtoDTO } settings Settings for the House BL document 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { HBLDocumentConfigDto } config Configuration settings for the document 
 */
export const HouseBlDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), blNumber: z.string().nullish(), carrierBookingNumber: z.string().nullish(), exportReference: z.string().nullish(), forwarder: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), originCountry: HouseBlDocumentCountryResponseDTOSchema.nullish(), useLatterOfCredit: z.boolean().nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.nullish(), additionalTextTop: CommonModels.EditorContentResponseDtoSchema.nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), versionNumber: z.number(), consignee: HouseBlDocumentBusinessPartnerResponseDTOSchema, shipper: HouseBlDocumentBusinessPartnerResponseDTOSchema, cargoReleaseBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), notify: HouseBlDocumentBusinessPartnerResponseDTOSchema, alsoNotify: HouseBlDocumentBusinessPartnerResponseDTOSchema, precarriageBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), precarriageByText: z.string().nullish(), placeOfReceipt: HouseBlDocumentPlaceResponseDTOSchema.nullish(), placeOfReceiptText: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), declaredValue: z.string().nullish(), rateOfExchange: z.number().nullish(), currency: z.string().nullish(), freightPayable: z.string().nullish(), issuer: z.string().nullish(), portOfLoading: HouseBlDocumentPortResponseDTOSchema.nullish(), portOfLoadingText: z.string().nullish(), loadingPierTerminal: HouseBlDocumentTerminalResponseDTOSchema.nullish(), loadingPierTerminalText: z.string().nullish(), portOfDischarge: HouseBlDocumentPortResponseDTOSchema.nullish(), portOfDischargeText: z.string().nullish(), placeOfDelivery: HouseBlDocumentPlaceResponseDTOSchema.nullish(), placeOfDeliveryText: z.string().nullish(), originalsToBeReleasedAt: HouseBlDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAtText: z.string().nullish(), typeOfMove: z.string().nullish(), placeOfIssue: z.string().nullish(), data: CommonModels.TemplatedDocumentDataDtoSchema.nullish(), settings: HouseBlDocumentSettingsDtoDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.HBLDocumentConfigDtoSchema });
export type HouseBlDocumentResponseDTO = z.infer<typeof HouseBlDocumentResponseDTOSchema>;

/** 
 * UpdateHouseBlDocumentSettingsRequestDTOSchema 
 * @type { object }
 * @property { QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals 
 * @property { number } quantityOfCopies Quantity of copies 
 * @property { string } blNumber BL number 
 * @property { string } exportReference Export reference number 
 * @property { string } location Location 
 * @property { string } signer Signer 
 * @property { boolean } hideSignature Hide signature 
 * @property { boolean } capsLock Render issuer/signer in caps lock 
 * @property { string } date Date 
 * @property { string } documentTitle Document title 
 */
export const UpdateHouseBlDocumentSettingsRequestDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), quantityOfCopies: z.number().nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), location: z.string().nullable(), signer: z.string().nullable(), hideSignature: z.boolean().nullable(), capsLock: z.boolean().nullable(), date: z.iso.datetime({ offset: true }).nullable(), documentTitle: z.string().nullable() }).partial();
export type UpdateHouseBlDocumentSettingsRequestDTO = z.infer<typeof UpdateHouseBlDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateHouseBlDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateHouseBlDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } blNumber Bill of lading number 
 * @property { string } carrierBookingNumber Carrier booking number 
 * @property { string } exportReference Export reference number 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } forwarder Forwarder information 
 * @property { string } originCountryId Origin country ID 
 * @property { boolean } useLatterOfCredit Whether to use letter of credit 
 * @property { string } declaredValue Declared value 
 * @property { number } rateOfExchange Rate of exchange 
 * @property { string } freightPayable Freight payable 
 * @property { string } issuer Issuer 
 * @property { string } placeOfIssue Place of issue 
 * @property { EditorContentUpdateDto } additionalText Additional text 
 * @property { EditorContentUpdateDto } additionalTextTop Additional text top 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } shipper Shipper information 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } notify Notify party information 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } cargoReleaseBy Cargo release party information 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party information 
 * @property { string } precarriageById Pre-carriage by ID 
 * @property { string } precarriageByText Pre-carriage by free-text override 
 * @property { string } placeOfReceiptId Place of receipt ID 
 * @property { string } placeOfReceiptText Place of receipt free-text override 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } portOfLoadingId Port of loading ID 
 * @property { string } portOfLoadingText Port of loading free-text override 
 * @property { string } loadingPierTerminalId Loading pier/terminal ID 
 * @property { string } loadingPierTerminalText Loading pier/terminal free-text override 
 * @property { string } portOfDischargeId Port of discharge ID 
 * @property { string } portOfDischargeText Port of discharge free-text override 
 * @property { string } placeOfDeliveryId Place of delivery ID 
 * @property { string } placeOfDeliveryText Place of delivery free-text override 
 * @property { string } originalsToBeReleasedAtId Originals to be released at ID 
 * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override 
 * @property { string } typeOfMove Type of move 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentSettingsRequestDTO } settings Settings 
 * @property { TemplatedDocumentDataUpdateDto } data House BL templated document data 
 */
export const UpdateHouseBlDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), blNumber: z.string().nullable(), carrierBookingNumber: z.string().nullable(), exportReference: z.string().nullable(), forwarder: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), originCountryId: z.string().nullable(), useLatterOfCredit: z.boolean().nullable(), declaredValue: z.string().nullable(), rateOfExchange: z.number().nullable(), freightPayable: z.string().nullable(), issuer: z.string().nullable(), placeOfIssue: z.string().nullable(), additionalText: CommonModels.EditorContentUpdateDtoSchema.nullable(), additionalTextTop: CommonModels.EditorContentUpdateDtoSchema.nullable(), consignee: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), notify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), cargoReleaseBy: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), precarriageById: z.string().nullable(), precarriageByText: z.string().nullable(), placeOfReceiptId: z.string().nullable(), placeOfReceiptText: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), portOfLoadingId: z.string().nullable(), portOfLoadingText: z.string().nullable(), loadingPierTerminalId: z.string().nullable(), loadingPierTerminalText: z.string().nullable(), portOfDischargeId: z.string().nullable(), portOfDischargeText: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), placeOfDeliveryText: z.string().nullable(), originalsToBeReleasedAtId: z.string().nullable(), originalsToBeReleasedAtText: z.string().nullable(), typeOfMove: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), settings: UpdateHouseBlDocumentSettingsRequestDTOSchema.nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateHouseBlDocumentRequestDTO = z.infer<typeof UpdateHouseBlDocumentRequestDTOSchema>;

/** 
 * BlInstructionsDocumentSettingsDtoDTOSchema 
 * @type { object }
 * @property { QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals 
 * @property { string } date Date 
 * @property { string } location Location 
 * @property { string } signer Siger 
 */
export const BlInstructionsDocumentSettingsDtoDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable(), location: z.string().nullable(), signer: z.string().nullable() }).partial();
export type BlInstructionsDocumentSettingsDtoDTO = z.infer<typeof BlInstructionsDocumentSettingsDtoDTOSchema>;

/** 
 * BlInstructionsDocumentCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const BlInstructionsDocumentCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type BlInstructionsDocumentCountryResponseDTO = z.infer<typeof BlInstructionsDocumentCountryResponseDTOSchema>;

/** 
 * BlInstructionsDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 * @property { string } eori EORI number of the business partner 
 * @property { string } vatNumber VAT number of the business partner 
 */
export const BlInstructionsDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable(), eori: z.string().nullable(), vatNumber: z.string().nullable() }).partial();
export type BlInstructionsDocumentBusinessPartnerResponseDTO = z.infer<typeof BlInstructionsDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * BlInstructionsDocumentPlaceResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the place 
 * @property { string } name Name of the place 
 */
export const BlInstructionsDocumentPlaceResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type BlInstructionsDocumentPlaceResponseDTO = z.infer<typeof BlInstructionsDocumentPlaceResponseDTOSchema>;

/** 
 * MovementTypeEnumSchema 
 * @type { enum }
 */
export const MovementTypeEnumSchema = z.enum(["DoorToDoor", "PortToPort", "PortToDoor", "DoorToPort"]);
export type MovementTypeEnum = z.infer<typeof MovementTypeEnumSchema>;
export const MovementTypeEnum = MovementTypeEnumSchema.enum;

/** 
 * AllChargesEnumSchema 
 * @type { enum }
 */
export const AllChargesEnumSchema = z.enum(["Prepaid", "Collect", "Detailed"]);
export type AllChargesEnum = z.infer<typeof AllChargesEnumSchema>;
export const AllChargesEnum = AllChargesEnumSchema.enum;

/** 
 * ChargePaymentEnumSchema 
 * @type { enum }
 */
export const ChargePaymentEnumSchema = z.enum(["Prepaid", "Collect"]);
export type ChargePaymentEnum = z.infer<typeof ChargePaymentEnumSchema>;
export const ChargePaymentEnum = ChargePaymentEnumSchema.enum;

/** 
 * BlInstructionsDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 * @property { string } countryCode Country ISO2 code of the port 
 */
export const BlInstructionsDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), countryCode: z.string().nullable() }).partial();
export type BlInstructionsDocumentPortResponseDTO = z.infer<typeof BlInstructionsDocumentPortResponseDTOSchema>;

/** 
 * DocumentConfigDTOSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 */
export const DocumentConfigDTOSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable() }).partial();
export type DocumentConfigDTO = z.infer<typeof DocumentConfigDTOSchema>;

/** 
 * RequestedDocumentTypeEnumSchema 
 * @type { enum }
 */
export const RequestedDocumentTypeEnumSchema = z.enum(["SeawayBill", "Original"]);
export type RequestedDocumentTypeEnum = z.infer<typeof RequestedDocumentTypeEnumSchema>;
export const RequestedDocumentTypeEnum = RequestedDocumentTypeEnumSchema.enum;

/** 
 * ManifestFilerStatusEnumSchema 
 * @type { enum }
 */
export const ManifestFilerStatusEnumSchema = z.enum(["Self", "Carrier"]);
export type ManifestFilerStatusEnum = z.infer<typeof ManifestFilerStatusEnumSchema>;
export const ManifestFilerStatusEnum = ManifestFilerStatusEnumSchema.enum;

/** 
 * BlInstructionsDocumentCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BlInstructionsDocumentCountryDtoSchema = z.object({ id: z.string(), name: z.string() });
export type BlInstructionsDocumentCountryDto = z.infer<typeof BlInstructionsDocumentCountryDtoSchema>;

/** 
 * BlInstructionsDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the BL Instructions document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the BL Instructions document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } date Date of the BL Instructions document 
 * @property { string } blNumber Bill of lading number 
 * @property { string } exportReference Export reference number 
 * @property { string } direction Direction of the shipment (e.g., import/export) 
 * @property { string } transportMode Mode of transport for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentCountryResponseDTO } originCountry Origin country 
 * @property { boolean } useLatterOfCredit Whether to use letter of credit 
 * @property { string } additionalText Additional text for the document 
 * @property { number } versionNumber Version number of the document 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } buyer Buyer information for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } seller Seller information for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } consignee Consignee information for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } shipper Shipper information for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } notify Notify party information for the shipment 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } alsoNotify Additional notify party information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } forwarder Forwarder party information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentBusinessPartnerResponseDTO } precarriageBy Pre-carriage by information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } placeOfReceipt Place of receipt information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } stowedIntoContainerCity Stowed into container city information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } placeOfAcceptanceCity Place of acceptance city information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } originalsToBeReleasedAt  
 * @property { string } originalsToBeReleasedAtText  
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } loadingPierTerminal  
 * @property { string } loadingPierTerminalText  
 * @property { string } precarriageByText  
 * @property { string } placeOfReceiptText  
 * @property { string } portOfLoadingText  
 * @property { string } portOfDischargeText  
 * @property { string } placeOfDeliveryText  
 * @property { string } vessel Name of the vessel 
 * @property { string } voyage Name of the vessel 
 * @property { MovementTypeEnum } movementType  
 * @property { string } carrierBookingNumber  
 * @property { string } csnNumber  
 * @property { string } mcinNumber  
 * @property { string } pcinNumber  
 * @property { string } dueNumber  
 * @property { boolean } goodsDeliveredInEu  
 * @property { string } rucNumber  
 * @property { number } shipmentDeclaredValue  
 * @property { string } shipmentDeclaredValueCurrency  
 * @property { WorkingDocumentsBlInstructionsModels.AllChargesEnum } allCharges Base freight payment term 
 * @property { ChargePaymentEnum } baseFreight Base freight payment term 
 * @property { ChargePaymentEnum } additionalCharges Additional charges payment term 
 * @property { ChargePaymentEnum } originHaulageCharges Origin haulage charges payment term 
 * @property { ChargePaymentEnum } originPortCharges Origin port charges payment term 
 * @property { ChargePaymentEnum } destinationPortCharges Destination port charges payment term 
 * @property { ChargePaymentEnum } destinationHaulageCharges Destination haulage charges payment term 
 * @property { string } shippingInstructionsComments Free-text shipping instructions comments 
 * @property { string } chargePayerId Charge payer business partner ID 
 * @property { string } chargePayLocationId Charge pay location ID 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPortResponseDTO } portOfLoading Port of loading information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPortResponseDTO } portOfDischarge Port of discharge information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentPlaceResponseDTO } placeOfDelivery Place of delivery information 
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentSettingsDtoDTO } settings Settings for the BL Instructions document 
 * @property { TemplatedDocumentDataDto } data Templated document data 
 * @property { CargoTableBlockDto } cargo Cargo table block (identical to House BL cargo) 
 * @property { string } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { DocumentConfigDTO } config Configuration settings for the document 
 * @property { WorkingDocumentsBlInstructionsModels.RequestedDocumentTypeEnum } requestedDocumentType  
 * @property { boolean } requestedDocumentFreighted  
 * @property { number } requestedDocumentQuantity  
 * @property { WorkingDocumentsBlInstructionsModels.ManifestFilerStatusEnum } manifestFilerStatus  
 * @property { string } manifestFilerIdentifier  
 * @property { WorkingDocumentsBlInstructionsModels.BlInstructionsDocumentCountryDto } manifestFilingCountry  
 */
export const BlInstructionsDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), date: z.iso.datetime({ offset: true }).nullish(), blNumber: z.string().nullish(), exportReference: z.string().nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), originCountry: BlInstructionsDocumentCountryResponseDTOSchema.nullish(), useLatterOfCredit: z.boolean().nullish(), additionalText: z.string().nullish(), versionNumber: z.number(), buyer: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), seller: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), consignee: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, shipper: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, notify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, alsoNotify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, forwarder: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, precarriageBy: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), placeOfReceipt: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), stowedIntoContainerCity: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), placeOfAcceptanceCity: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAt: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAtText: z.string().nullish(), loadingPierTerminal: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), loadingPierTerminalText: z.string().nullish(), precarriageByText: z.string().nullish(), placeOfReceiptText: z.string().nullish(), portOfLoadingText: z.string().nullish(), portOfDischargeText: z.string().nullish(), placeOfDeliveryText: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), movementType: CommonModels.MovementTypeEnumSchema.nullish(), carrierBookingNumber: z.string().nullish(), csnNumber: z.string().nullish(), mcinNumber: z.string().nullish(), pcinNumber: z.string().nullish(), dueNumber: z.string().nullish(), goodsDeliveredInEu: z.boolean().nullish(), rucNumber: z.string().nullish(), shipmentDeclaredValue: z.number().nullish(), shipmentDeclaredValueCurrency: z.string().nullish(), allCharges: AllChargesEnumSchema.nullish(), baseFreight: CommonModels.ChargePaymentEnumSchema.nullish(), additionalCharges: CommonModels.ChargePaymentEnumSchema.nullish(), originHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullish(), originPortCharges: CommonModels.ChargePaymentEnumSchema.nullish(), destinationPortCharges: CommonModels.ChargePaymentEnumSchema.nullish(), destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullish(), shippingInstructionsComments: z.string().nullish(), chargePayerId: z.string().nullish(), chargePayLocationId: z.string().nullish(), portOfLoading: BlInstructionsDocumentPortResponseDTOSchema.nullish(), portOfDischarge: BlInstructionsDocumentPortResponseDTOSchema.nullish(), placeOfDelivery: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), settings: BlInstructionsDocumentSettingsDtoDTOSchema.nullish(), data: CommonModels.TemplatedDocumentDataDtoSchema.nullish(), cargo: CommonModels.CargoTableBlockDtoSchema.nullish(), bodyRemarks: z.string().nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.DocumentConfigDTOSchema, requestedDocumentType: RequestedDocumentTypeEnumSchema.nullish(), requestedDocumentFreighted: z.boolean().nullish(), requestedDocumentQuantity: z.number().nullish(), manifestFilerStatus: ManifestFilerStatusEnumSchema.nullish(), manifestFilerIdentifier: z.string().nullish(), manifestFilingCountry: BlInstructionsDocumentCountryDtoSchema.nullish() });
export type BlInstructionsDocumentResponseDTO = z.infer<typeof BlInstructionsDocumentResponseDTOSchema>;

/** 
 * UpdateBlInstructionsDocumentSettingsRequestDTOSchema 
 * @type { object }
 * @property { QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals 
 * @property { string } blNumber BL number 
 * @property { string } exportReference Export reference number 
 * @property { string } location Location 
 * @property { string } signer Signer 
 * @property { string } date Date 
 */
export const UpdateBlInstructionsDocumentSettingsRequestDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), location: z.string().nullable(), signer: z.string().nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdateBlInstructionsDocumentSettingsRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateBlInstructionsDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateBlInstructionsDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } blNumber Bill of lading number 
 * @property { string } exportReference Export reference number 
 * @property { string } csnNumber  
 * @property { string } mcinNumber  
 * @property { string } pcinNumber  
 * @property { string } dueNumber  
 * @property { boolean } goodsDeliveredInEu  
 * @property { string } rucNumber  
 * @property { string } shipmentDeclaredValueCurrency  
 * @property { number } shipmentDeclaredValue  
 * @property { WorkingDocumentsBlInstructionsModels.AllChargesEnum } allCharges All charges payment term 
 * @property { ChargePaymentEnum } baseFreight Base freight payment term 
 * @property { ChargePaymentEnum } additionalCharges Additional charges payment term 
 * @property { ChargePaymentEnum } originHaulageCharges Origin haulage charges payment term 
 * @property { ChargePaymentEnum } originPortCharges Origin port charges payment term 
 * @property { ChargePaymentEnum } destinationPortCharges Destination port charges payment term 
 * @property { ChargePaymentEnum } destinationHaulageCharges Destination haulage charges payment term 
 * @property { string } originCountryId Origin country ID 
 * @property { boolean } useLatterOfCredit Whether to use letter of credit 
 * @property { string } additionalText Additional text 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } shipper Shipper information 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } buyer Buyer information 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } seller Seller information 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } forwarder Forwarder information 
 * @property { string } originalsToBeReleasedAtId Originals to be released at ID 
 * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } notify Notify party information 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party information 
 * @property { string } shippingInstructionsComments Shipping instructions free-text comments 
 * @property { string } chargePayerId Charge payer business partner ID 
 * @property { string } chargePayLocationId Charge pay location ID 
 * @property { string } precarriageById Pre-carriage by ID 
 * @property { string } placeOfReceiptId Place of receipt ID 
 * @property { string } stowedIntoContainerCityId Stowed into container city ID 
 * @property { string } loadingPierTerminalId Loading pier/terminal ID 
 * @property { string } loadingPierTerminalText  
 * @property { string } placeOfAcceptanceCityId Place of acceptance city ID 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Vessel name 
 * @property { string } carrierBookingNumber Carrier booking number 
 * @property { string } portOfLoadingId Port of loading ID 
 * @property { string } portOfDischargeId Port of discharge ID 
 * @property { string } placeOfDeliveryId Place of delivery ID 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { string } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { string } date Date of the BL Instructions document 
 * @property { WorkingDocumentsBlInstructionsModels.UpdateBlInstructionsDocumentSettingsRequestDTO } settings Settings 
 * @property { TemplatedDocumentDataUpdateDto } data House BL templated document data 
 * @property { WorkingDocumentsBlInstructionsModels.RequestedDocumentTypeEnum } requestedDocumentType  
 * @property { boolean } requestedDocumentFreighted  
 * @property { number } requestedDocumentQuantity  
 * @property { string } precarriageByText  
 * @property { string } placeOfReceiptText  
 * @property { string } portOfLoadingText  
 * @property { string } portOfDischargeText  
 * @property { string } placeOfDeliveryText  
 * @property { WorkingDocumentsBlInstructionsModels.ManifestFilerStatusEnum } manifestFilerStatus  
 * @property { string } manifestFilingCountryId  
 * @property { string } manifestFilerIdentifier  
 */
export const UpdateBlInstructionsDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), csnNumber: z.string().nullable(), mcinNumber: z.string().nullable(), pcinNumber: z.string().nullable(), dueNumber: z.string().nullable(), goodsDeliveredInEu: z.boolean().nullable(), rucNumber: z.string().nullable(), shipmentDeclaredValueCurrency: z.string().nullable(), shipmentDeclaredValue: z.number().nullable(), allCharges: AllChargesEnumSchema.nullable(), baseFreight: CommonModels.ChargePaymentEnumSchema.nullable(), additionalCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originPortCharges: CommonModels.ChargePaymentEnumSchema.nullable(), destinationPortCharges: CommonModels.ChargePaymentEnumSchema.nullable(), destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originCountryId: z.string().nullable(), useLatterOfCredit: z.boolean().nullable(), additionalText: z.string().nullable(), consignee: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), buyer: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), seller: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), forwarder: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), originalsToBeReleasedAtId: z.string().nullable(), originalsToBeReleasedAtText: z.string().nullable(), notify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shippingInstructionsComments: z.string().nullable(), chargePayerId: z.string().nullable(), chargePayLocationId: z.string().nullable(), precarriageById: z.string().nullable(), placeOfReceiptId: z.string().nullable(), stowedIntoContainerCityId: z.string().nullable(), loadingPierTerminalId: z.string().nullable(), loadingPierTerminalText: z.string().nullable(), placeOfAcceptanceCityId: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), carrierBookingNumber: z.string().nullable(), portOfLoadingId: z.string().nullable(), portOfDischargeId: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), bodyRemarks: z.string().nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable(), settings: UpdateBlInstructionsDocumentSettingsRequestDTOSchema.nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable(), requestedDocumentType: RequestedDocumentTypeEnumSchema.nullable(), requestedDocumentFreighted: z.boolean().nullable(), requestedDocumentQuantity: z.number().nullable(), precarriageByText: z.string().nullable(), placeOfReceiptText: z.string().nullable(), portOfLoadingText: z.string().nullable(), portOfDischargeText: z.string().nullable(), placeOfDeliveryText: z.string().nullable(), manifestFilerStatus: ManifestFilerStatusEnumSchema.nullable(), manifestFilingCountryId: z.string().nullable(), manifestFilerIdentifier: z.string().nullable() }).partial();
export type UpdateBlInstructionsDocumentRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentRequestDTOSchema>;

/** 
 * AMSInstructionsDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const AMSInstructionsDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type AMSInstructionsDocumentPortResponseDTO = z.infer<typeof AMSInstructionsDocumentPortResponseDTOSchema>;

/** 
 * AMSInstructionsDocumentCityResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the city 
 * @property { string } name Name of the city 
 */
export const AMSInstructionsDocumentCityResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type AMSInstructionsDocumentCityResponseDTO = z.infer<typeof AMSInstructionsDocumentCityResponseDTOSchema>;

/** 
 * AMSInstructionsDocumentSignedByResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the employee 
 * @property { string } name Name of the employee 
 */
export const AMSInstructionsDocumentSignedByResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type AMSInstructionsDocumentSignedByResponseDTO = z.infer<typeof AMSInstructionsDocumentSignedByResponseDTOSchema>;

/** 
 * AMSInstructionsDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const AMSInstructionsDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type AMSInstructionsDocumentBusinessPartnerResponseDTO = z.infer<typeof AMSInstructionsDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * AMSInstructionsDocumentCargoDTOSchema 
 * @type { object }
 * @property { string } caseMarks Case marks of the cargo 
 * @property { string } containerNumber Container number of the cargo 
 * @property { number } nrOfPackages Number of packages in the cargo 
 * @property { string } description Description of the cargo 
 * @property { number } weight Weight of the cargo 
 * @property { number } volume Volume of the cargo 
 * @property { string } seal1 Seal number 1 of the cargo 
 * @property { string } seal2 Seal number 2 of the cargo 
 */
export const AMSInstructionsDocumentCargoDTOSchema = z.object({ caseMarks: z.string().nullable(), containerNumber: z.string().nullable(), nrOfPackages: z.number().nullable(), description: z.string().nullable(), weight: z.number().nullable(), volume: z.number().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable() }).partial();
export type AMSInstructionsDocumentCargoDTO = z.infer<typeof AMSInstructionsDocumentCargoDTOSchema>;

/** 
 * AMSInstructionsDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the AMS Instructions document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the AMS Instructions document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } date Date of the AMS Instructions document 
 * @property { string } direction Direction of the shipment (e.g., import/export) 
 * @property { string } transportMode Mode of transport for the shipment 
 * @property { number } versionNumber Version number of the document 
 * @property { EditorContentResponseDto } additionalAMSText Additional AMS text 
 * @property { string } principalName Principal name 
 * @property { string } blNumber Bill of lading number 
 * @property { string } vessel Vessel 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentPortResponseDTO } portOfLoading Port of loading 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentCityResponseDTO } placeOfDelivery Port of delivery 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentPortResponseDTO } portOfDischarge Port of discharge 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentCityResponseDTO } placeOfIssue Place of issue 
 * @property { string } dateOfIssue Date of issue 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentSignedByResponseDTO } signedBy Signed by 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentBusinessPartnerResponseDTO } deliveryBusinessPartner Delivery business partner 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentCityResponseDTO } placeOfAcceptance Port of acceptance 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentBusinessPartnerResponseDTO } notify Notify party 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentBusinessPartnerResponseDTO } alsoNotify Also notify party 
 * @property { string } applyTo Apply to 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { string[] } availableContainerNumbers Available container numbers 
 * @property { string[] } selectedContainerNumbers Selected container numbers 
 * @property { string[] } selectedContainerLabels Selected container labels 
 * @property { WorkingDocumentsAmsInstructionsModels.AMSInstructionsDocumentCargoDTO[] } cargo Cargo information 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { DocumentConfigDTO } config Configuration settings for the document 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 */
export const AMSInstructionsDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), date: z.iso.datetime({ offset: true }).nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), versionNumber: z.number(), additionalAMSText: CommonModels.EditorContentResponseDtoSchema.nullish(), principalName: z.string().nullish(), blNumber: z.string().nullish(), vessel: z.string().nullish(), portOfLoading: AMSInstructionsDocumentPortResponseDTOSchema.nullish(), placeOfDelivery: AMSInstructionsDocumentCityResponseDTOSchema.nullish(), portOfDischarge: AMSInstructionsDocumentPortResponseDTOSchema.nullish(), placeOfIssue: AMSInstructionsDocumentCityResponseDTOSchema.nullish(), dateOfIssue: z.iso.datetime({ offset: true }).nullish(), signedBy: AMSInstructionsDocumentSignedByResponseDTOSchema.nullish(), deliveryBusinessPartner: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), placeOfAcceptance: AMSInstructionsDocumentCityResponseDTOSchema.nullish(), consignee: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), notify: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), alsoNotify: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), applyTo: z.string().nullish(), suppressWeight: z.boolean().nullish(), suppressMeasurement: z.boolean().nullish(), availableContainerNumbers: z.array(z.string()).nullish(), selectedContainerNumbers: z.array(z.string()).nullish(), selectedContainerLabels: z.array(z.string()).nullish(), cargo: z.array(AMSInstructionsDocumentCargoDTOSchema).nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.DocumentConfigDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }).nullish(), updatedAt: z.iso.datetime({ offset: true }).nullish() });
export type AMSInstructionsDocumentResponseDTO = z.infer<typeof AMSInstructionsDocumentResponseDTOSchema>;

/** 
 * UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateAMSInstructionsDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { EditorContentUpdateDto } additionalAMSText Additional AMS text 
 * @property { string } principalName Principal name 
 * @property { string } blNumber Bill of lading number 
 * @property { string } vessel Vessel 
 * @property { string } portOfLoadingId Port of loading id 
 * @property { string } placeOfDeliveryId Place of delivery id 
 * @property { string } portOfDischargeId Port of discharge id 
 * @property { string } placeOfIssueId Place of issue 
 * @property { string } dateOfIssue Date of issue 
 * @property { string } signedById Signed by employee ID 
 * @property { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } deliveryBusinessPartner Delivery business partner 
 * @property { string } placeOfAcceptanceId Port of acceptance 
 * @property { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } notify Notify party 
 * @property { WorkingDocumentsAmsInstructionsModels.UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party 
 * @property { string } applyTo Apply to 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { string[] } selectedContainerNumbers Selected container numbers 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { string } date Date of the AMS Instructions document 
 */
export const UpdateAMSInstructionsDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), additionalAMSText: CommonModels.EditorContentUpdateDtoSchema.nullable(), principalName: z.string().nullable(), blNumber: z.string().nullable(), vessel: z.string().nullable(), portOfLoadingId: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), portOfDischargeId: z.string().nullable(), placeOfIssueId: z.string().nullable(), dateOfIssue: z.iso.datetime({ offset: true }).nullable(), signedById: z.string().nullable(), deliveryBusinessPartner: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), placeOfAcceptanceId: z.string().nullable(), consignee: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), notify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), applyTo: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), selectedContainerNumbers: z.array(z.string()).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdateAMSInstructionsDocumentRequestDTO = z.infer<typeof UpdateAMSInstructionsDocumentRequestDTOSchema>;

/** 
 * HouseAwbDocumentOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 * @property { string } name Name 
 */
export const HouseAwbDocumentOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullish(), sellRate: z.number(), name: z.string().nullish() });
export type HouseAwbDocumentOtherChargeDTO = z.infer<typeof HouseAwbDocumentOtherChargeDTOSchema>;

/** 
 * HouseAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { number } totalOtherCharges Total other charges 
 * @property { number } total Total 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentOtherChargeDTO[] } otherCharges Other charges 
 */
export const HouseAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number(), totalOtherCharges: z.number(), total: z.number(), otherCharges: z.array(HouseAwbDocumentOtherChargeDTOSchema) });
export type HouseAwbDocumentChargesDTO = z.infer<typeof HouseAwbDocumentChargesDTOSchema>;

/** 
 * HouseAwbDocumentCargoDTOSchema 
 * @type { object }
 * @property { number } quantity Quantity 
 * @property { number } grossWeight Gross weight 
 * @property { string } rateClass Rate class 
 * @property { string } commodityItemNo Commodity item number 
 * @property { number } rateOrCharge Rate or charge 
 * @property { number } total Total 
 * @property { string } description Description 
 */
export const HouseAwbDocumentCargoDTOSchema = z.object({ quantity: z.number(), grossWeight: z.number().nullish(), rateClass: z.string().nullish(), commodityItemNo: z.string().nullish(), rateOrCharge: z.number().nullish(), total: z.number().nullish(), description: z.string().nullish() });
export type HouseAwbDocumentCargoDTO = z.infer<typeof HouseAwbDocumentCargoDTOSchema>;

/** 
 * HouseAwbDocumentRouteDTOSchema 
 * @type { object }
 * @property { string } airportOfDeparture Airport of departure 
 * @property { string } airportOfDestination Airport of destination 
 * @property { string } toAirport1 To airport 1 
 * @property { string } byCarrier1 By carrier 1 
 * @property { string } toAirport2 To airport 2 
 * @property { string } byCarrier2 By carrier 2 
 * @property { string } toAirport3 To airport 3 
 * @property { string } byCarrier3 By carrier 3 
 * @property { string } flightNumber1 Flight number 1 
 * @property { string } flightDay1 Flight day 1 
 * @property { string } flightNumber2 Flight number 2 
 * @property { string } flightDay2 Flight day 2 
 */
export const HouseAwbDocumentRouteDTOSchema = z.object({ airportOfDeparture: z.string(), airportOfDestination: z.string(), toAirport1: z.string().nullish(), byCarrier1: z.string().nullish(), toAirport2: z.string().nullish(), byCarrier2: z.string().nullish(), toAirport3: z.string().nullish(), byCarrier3: z.string().nullish(), flightNumber1: z.string().nullish(), flightDay1: z.string().nullish(), flightNumber2: z.string().nullish(), flightDay2: z.string().nullish() });
export type HouseAwbDocumentRouteDTO = z.infer<typeof HouseAwbDocumentRouteDTOSchema>;

/** 
 * HouseAwbDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const HouseAwbDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type HouseAwbDocumentBusinessPartnerResponseDTO = z.infer<typeof HouseAwbDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * HouseAwbDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the House AWB document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the House AWB document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } currency Currency 
 * @property { number } versionNumber Version number of the document 
 * @property { string } hawbNumber HAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { number } exchangeRate Exchange rate 
 * @property { EditorContentResponseDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentCargoDTO[] } cargo Cargo packages 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } signingLocation Signing location 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentRouteDTO } route Route 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentBusinessPartnerResponseDTO } issuer Issuer 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { WorkingDocumentsHouseAwbModels.HouseAwbDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { DocumentConfigDTO } config Config 
 */
export const HouseAwbDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), currency: z.string().nullish(), versionNumber: z.number(), hawbNumber: z.string().nullish(), sciReference: z.string().nullish(), reference1: z.string().nullish(), reference2: z.string().nullish(), reference3: z.string().nullish(), exchangeRate: z.number().nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.nullish(), handlingInstructions: z.string().nullish(), accountInformation: CommonModels.AccountInformationEnumSchema.nullish(), additionalAccountingNotes: z.string().nullish(), isSecured: z.boolean(), suppressContainerWeight: z.boolean(), suppressCargoMeasurement: z.boolean(), cargo: z.array(HouseAwbDocumentCargoDTOSchema).nullish(), charges: HouseAwbDocumentChargesDTOSchema.nullish(), shipperSigner: z.string().nullish(), shipperSignerUserName: z.string().nullish(), signer: z.string().nullish(), signingDate: z.iso.datetime({ offset: true }).nullish(), signingLocation: z.string().nullish(), issuerIataCode: z.string().nullish(), route: HouseAwbDocumentRouteDTOSchema.nullish(), issuer: HouseAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), consignee: HouseAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: HouseAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), config: CommonModels.DocumentConfigDTOSchema.nullish() });
export type HouseAwbDocumentResponseDTO = z.infer<typeof HouseAwbDocumentResponseDTOSchema>;

/** 
 * UpdateHouseAwbDocumentChargesOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 */
export const UpdateHouseAwbDocumentChargesOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullable(), sellRate: z.number().nullable() }).partial();
export type UpdateHouseAwbDocumentChargesOtherChargeDTO = z.infer<typeof UpdateHouseAwbDocumentChargesOtherChargeDTOSchema>;

/** 
 * UpdateHouseAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentChargesOtherChargeDTO[] } otherCharges Other charges 
 */
export const UpdateHouseAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number().nullable(), otherCharges: z.array(UpdateHouseAwbDocumentChargesOtherChargeDTOSchema).nullable() }).partial();
export type UpdateHouseAwbDocumentChargesDTO = z.infer<typeof UpdateHouseAwbDocumentChargesDTOSchema>;

/** 
 * UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateHouseAwbDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateHouseAwbDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } hawbNumber HAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { number } exchangeRate Exchange rate 
 * @property { EditorContentUpdateDto } additionalText Additional text 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } issuerId Issuer ID 
 * @property { string } issuerName Issuer name 
 * @property { string } issuerAddress Issuer address 
 * @property { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateHouseAwbDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), hawbNumber: z.string().nullable(), sciReference: z.string().nullable(), reference1: z.string().nullable(), reference2: z.string().nullable(), reference3: z.string().nullable(), exchangeRate: z.number().nullable(), additionalText: CommonModels.EditorContentUpdateDtoSchema.nullable(), handlingInstructions: z.string().nullable(), accountInformation: CommonModels.AccountInformationEnumSchema.nullable(), additionalAccountingNotes: z.string().nullable(), isSecured: z.boolean().nullable(), suppressContainerWeight: z.boolean().nullable(), suppressCargoMeasurement: z.boolean().nullable(), charges: UpdateHouseAwbDocumentChargesDTOSchema.nullable(), shipperSigner: z.string().nullable(), shipperSignerUserName: z.string().nullable(), signer: z.string().nullable(), signingDate: z.iso.datetime({ offset: true }).nullable(), issuerId: z.string().nullable(), issuerName: z.string().nullable(), issuerAddress: z.string().nullable(), consignee: UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateHouseAwbDocumentRequestDTO = z.infer<typeof UpdateHouseAwbDocumentRequestDTOSchema>;

/** 
 * ChargeTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { DirectionEnum } direction  
 * @property { TransportModeEnum[] } transportModes  
 * @property { LanguageEnum } language  
 * @property { string } search  
 */
export const ChargeTypeLabelFilterDtoSchema = z.object({ direction: CommonModels.DirectionEnumSchema.nullable(), transportModes: z.array(CommonModels.TransportModeEnumSchema).nullable(), language: CommonModels.LanguageEnumSchema.nullable(), search: z.string().nullable() }).partial();
export type ChargeTypeLabelFilterDto = z.infer<typeof ChargeTypeLabelFilterDtoSchema>;

/** 
 * ChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { LanguageEnum } language  
 * @property { string } value  
 */
export const ChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type ChargeTypeTranslationDto = z.infer<typeof ChargeTypeTranslationDtoSchema>;

/** 
 * ChargeTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChargeTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ChargeTypeEmployeeDTO = z.infer<typeof ChargeTypeEmployeeDTOSchema>;

/** 
 * ChargeTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { TransportModeEnum[] } modules  
 * @property { DirectionEnum[] } directions  
 * @property { ChargeTypesModels.ChargeTypeTranslationDto[] } translations  
 * @property { string } createdById  
 * @property { ChargeTypesModels.ChargeTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { ChargeTypesModels.ChargeTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const ChargeTypeResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), englishName: z.string(), archived: z.boolean(), description: z.string().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), directions: z.array(CommonModels.DirectionEnumSchema), translations: z.array(ChargeTypeTranslationDtoSchema), createdById: z.string().nullish(), createdBy: ChargeTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ChargeTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ChargeTypeResponseDTO = z.infer<typeof ChargeTypeResponseDTOSchema>;

/** 
 * ChargeTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } search  
 * @property { boolean } archived  
 * @property { DirectionEnum } direction  
 * @property { TransportModeEnum[] } transportModes  
 */
export const ChargeTypePaginationFilterDtoSchema = z.object({ name: z.string().nullable(), search: z.string().nullable(), archived: z.boolean().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), transportModes: z.array(CommonModels.TransportModeEnumSchema).nullable() }).partial();
export type ChargeTypePaginationFilterDto = z.infer<typeof ChargeTypePaginationFilterDtoSchema>;

/** 
 * CreateChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { LanguageEnum } language  
 * @property { string } value  
 */
export const CreateChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type CreateChargeTypeTranslationDto = z.infer<typeof CreateChargeTypeTranslationDtoSchema>;

/** 
 * CreateChargeTypeRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { TransportModeEnum[] } modules  
 * @property { DirectionEnum[] } directions  
 * @property { ChargeTypesModels.CreateChargeTypeTranslationDto[] } translations  
 */
export const CreateChargeTypeRequestDTOSchema = z.object({ matchCode: z.string(), englishName: z.string().nullish(), archived: z.boolean().nullish(), description: z.string().nullish(), modules: z.array(CommonModels.TransportModeEnumSchema), directions: z.array(CommonModels.DirectionEnumSchema), translations: z.array(CreateChargeTypeTranslationDtoSchema).nullish() });
export type CreateChargeTypeRequestDTO = z.infer<typeof CreateChargeTypeRequestDTOSchema>;

/** 
 * UpdateChargeTypeTranslationDtoSchema 
 * @type { object }
 * @property { LanguageEnum } language  
 * @property { string } value  
 */
export const UpdateChargeTypeTranslationDtoSchema = z.object({ language: CommonModels.LanguageEnumSchema, value: z.string() });
export type UpdateChargeTypeTranslationDto = z.infer<typeof UpdateChargeTypeTranslationDtoSchema>;

/** 
 * UpdateChargeTypeRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode  
 * @property { string } englishName  
 * @property { boolean } archived  
 * @property { string } description  
 * @property { TransportModeEnum[] } modules  
 * @property { DirectionEnum[] } directions  
 * @property { ChargeTypesModels.UpdateChargeTypeTranslationDto[] } translations  
 */
export const UpdateChargeTypeRequestDTOSchema = z.object({ matchCode: z.string().nullable(), englishName: z.string().nullable(), archived: z.boolean().nullable(), description: z.string().nullable(), modules: z.array(CommonModels.TransportModeEnumSchema).nullable(), directions: z.array(CommonModels.DirectionEnumSchema).nullable(), translations: z.array(UpdateChargeTypeTranslationDtoSchema).nullable() }).partial();
export type UpdateChargeTypeRequestDTO = z.infer<typeof UpdateChargeTypeRequestDTOSchema>;

/** 
 * MasterAwbDocumentOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 * @property { string } name Name 
 */
export const MasterAwbDocumentOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullish(), sellRate: z.number(), name: z.string().nullish() });
export type MasterAwbDocumentOtherChargeDTO = z.infer<typeof MasterAwbDocumentOtherChargeDTOSchema>;

/** 
 * MasterAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { number } totalOtherCharges Total other charges 
 * @property { number } total Total 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentOtherChargeDTO[] } otherCharges Other charges 
 */
export const MasterAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number(), totalOtherCharges: z.number(), total: z.number(), otherCharges: z.array(MasterAwbDocumentOtherChargeDTOSchema) });
export type MasterAwbDocumentChargesDTO = z.infer<typeof MasterAwbDocumentChargesDTOSchema>;

/** 
 * MasterAwbDocumentCargoDTOSchema 
 * @type { object }
 * @property { number } quantity Quantity 
 * @property { number } grossWeight Gross weight 
 * @property { string } rateClass Rate class 
 * @property { string } commodityItemNo Commodity item number 
 * @property { number } rateOrCharge Rate or charge 
 * @property { number } total Total 
 * @property { string } description Description 
 */
export const MasterAwbDocumentCargoDTOSchema = z.object({ quantity: z.number(), grossWeight: z.number().nullish(), rateClass: z.string().nullish(), commodityItemNo: z.string().nullish(), rateOrCharge: z.number().nullish(), total: z.number().nullish(), description: z.string().nullish() });
export type MasterAwbDocumentCargoDTO = z.infer<typeof MasterAwbDocumentCargoDTOSchema>;

/** 
 * MasterAwbDocumentRouteDTOSchema 
 * @type { object }
 * @property { string } airportOfDeparture Airport of departure 
 * @property { string } airportOfDestination Airport of destination 
 * @property { string } toAirport1 To airport 1 
 * @property { string } byCarrier1 By carrier 1 
 * @property { string } toAirport2 To airport 2 
 * @property { string } byCarrier2 By carrier 2 
 * @property { string } toAirport3 To airport 3 
 * @property { string } byCarrier3 By carrier 3 
 * @property { string } flightNumber1 Flight number 1 
 * @property { string } flightDay1 Flight day 1 
 * @property { string } flightNumber2 Flight number 2 
 * @property { string } flightDay2 Flight day 2 
 */
export const MasterAwbDocumentRouteDTOSchema = z.object({ airportOfDeparture: z.string(), airportOfDestination: z.string(), toAirport1: z.string().nullish(), byCarrier1: z.string().nullish(), toAirport2: z.string().nullish(), byCarrier2: z.string().nullish(), toAirport3: z.string().nullish(), byCarrier3: z.string().nullish(), flightNumber1: z.string().nullish(), flightDay1: z.string().nullish(), flightNumber2: z.string().nullish(), flightDay2: z.string().nullish() });
export type MasterAwbDocumentRouteDTO = z.infer<typeof MasterAwbDocumentRouteDTOSchema>;

/** 
 * MasterAwbDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const MasterAwbDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type MasterAwbDocumentBusinessPartnerResponseDTO = z.infer<typeof MasterAwbDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * MasterAwbDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the Master AWB document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the Master AWB document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } currency Currency 
 * @property { number } versionNumber Version number of the document 
 * @property { string } mawbNumber MAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { EditorContentResponseDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentCargoDTO[] } cargo Cargo packages 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } signingLocation Signing location 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { number } exchangeRate Exchange rate 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentRouteDTO } route Route 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { WorkingDocumentsMasterAwbModels.MasterAwbDocumentBusinessPartnerResponseDTO } issuer Issuer 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { DocumentConfigDTO } config Config 
 */
export const MasterAwbDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), currency: z.string().nullish(), versionNumber: z.number(), mawbNumber: z.string().nullish(), sciReference: z.string().nullish(), reference1: z.string().nullish(), reference2: z.string().nullish(), reference3: z.string().nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.nullish(), handlingInstructions: z.string().nullish(), accountInformation: CommonModels.AccountInformationEnumSchema.nullish(), additionalAccountingNotes: z.string().nullish(), isSecured: z.boolean(), suppressContainerWeight: z.boolean(), suppressCargoMeasurement: z.boolean(), cargo: z.array(MasterAwbDocumentCargoDTOSchema).nullish(), charges: MasterAwbDocumentChargesDTOSchema.nullish(), shipperSigner: z.string().nullish(), shipperSignerUserName: z.string().nullish(), signer: z.string().nullish(), signingDate: z.iso.datetime({ offset: true }).nullish(), signingLocation: z.string().nullish(), issuerIataCode: z.string().nullish(), exchangeRate: z.number().nullish(), route: MasterAwbDocumentRouteDTOSchema.nullish(), consignee: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), issuer: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), config: CommonModels.DocumentConfigDTOSchema.nullish() });
export type MasterAwbDocumentResponseDTO = z.infer<typeof MasterAwbDocumentResponseDTOSchema>;

/** 
 * UpdateMasterAwbDocumentChargesOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 */
export const UpdateMasterAwbDocumentChargesOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullable(), sellRate: z.number().nullable() }).partial();
export type UpdateMasterAwbDocumentChargesOtherChargeDTO = z.infer<typeof UpdateMasterAwbDocumentChargesOtherChargeDTOSchema>;

/** 
 * UpdateMasterAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentChargesOtherChargeDTO[] } otherCharges Other charges 
 */
export const UpdateMasterAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number().nullable(), otherCharges: z.array(UpdateMasterAwbDocumentChargesOtherChargeDTOSchema).nullable() }).partial();
export type UpdateMasterAwbDocumentChargesDTO = z.infer<typeof UpdateMasterAwbDocumentChargesDTOSchema>;

/** 
 * UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateMasterAwbDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateMasterAwbDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } mawbNumber MAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { EditorContentUpdateDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } issuerId Issuer ID 
 * @property { string } issuerName Issuer name 
 * @property { string } issuerAddress Issuer address 
 * @property { string } issuerCity Issuer city 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { WorkingDocumentsMasterAwbModels.UpdateMasterAwbDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { number } exchangeRate Exchange rate 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateMasterAwbDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), mawbNumber: z.string().nullable(), sciReference: z.string().nullable(), reference1: z.string().nullable(), reference2: z.string().nullable(), reference3: z.string().nullable(), additionalText: CommonModels.EditorContentUpdateDtoSchema.nullable(), handlingInstructions: z.string().nullable(), accountInformation: CommonModels.AccountInformationEnumSchema.nullable(), additionalAccountingNotes: z.string().nullable(), isSecured: z.boolean().nullable(), suppressContainerWeight: z.boolean().nullable(), suppressCargoMeasurement: z.boolean().nullable(), charges: UpdateMasterAwbDocumentChargesDTOSchema.nullable(), shipperSigner: z.string().nullable(), shipperSignerUserName: z.string().nullable(), signer: z.string().nullable(), signingDate: z.iso.datetime({ offset: true }).nullable(), issuerId: z.string().nullable(), issuerName: z.string().nullable(), issuerAddress: z.string().nullable(), issuerCity: z.string().nullable(), issuerIataCode: z.string().nullable(), consignee: UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), exchangeRate: z.number().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateMasterAwbDocumentRequestDTO = z.infer<typeof UpdateMasterAwbDocumentRequestDTOSchema>;

/** 
 * CmrDocumentLanguageSchema 
 * @type { enum }
 */
export const CmrDocumentLanguageSchema = z.enum(["en", "fr", "de"]);
export type CmrDocumentLanguage = z.infer<typeof CmrDocumentLanguageSchema>;
export const CmrDocumentLanguage = CmrDocumentLanguageSchema.enum;

/** 
 * CmrDocumentSettingsDtoDTOSchema 
 * @type { object }
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentLanguage } primaryLanguage Primary language 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentLanguage } secondaryLanguage Secondary language 
 */
export const CmrDocumentSettingsDtoDTOSchema = z.object({ primaryLanguage: CmrDocumentLanguageSchema.nullable(), secondaryLanguage: CmrDocumentLanguageSchema.nullable() }).partial();
export type CmrDocumentSettingsDtoDTO = z.infer<typeof CmrDocumentSettingsDtoDTOSchema>;

/** 
 * CmrDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const CmrDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type CmrDocumentBusinessPartnerResponseDTO = z.infer<typeof CmrDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * CmrDocumentCityResponseDTOSchema 
 * @type { object }
 * @property { string } cityId ID of the city 
 * @property { string } cityName Name of the city 
 * @property { string } date Date of delivery/takeover 
 * @property { string } countryName Country name 
 */
export const CmrDocumentCityResponseDTOSchema = z.object({ cityId: z.string(), cityName: z.string(), date: z.iso.datetime({ offset: true }).nullish(), countryName: z.string().nullish() });
export type CmrDocumentCityResponseDTO = z.infer<typeof CmrDocumentCityResponseDTOSchema>;

/** 
 * CmrDocumentCostsResponseDTOSchema 
 * @type { object }
 * @property { number } carriageCharges Carriage charges 
 * @property { number } reductions Reductions 
 * @property { number } balance Balance 
 * @property { number } supplements Supplements 
 * @property { number } miscellaneous Miscellaneous charges 
 * @property { number } total Total amount 
 */
export const CmrDocumentCostsResponseDTOSchema = z.object({ carriageCharges: z.number().nullable(), reductions: z.number().nullable(), balance: z.number().nullable(), supplements: z.number().nullable(), miscellaneous: z.number().nullable(), total: z.number().nullable() }).partial();
export type CmrDocumentCostsResponseDTO = z.infer<typeof CmrDocumentCostsResponseDTOSchema>;

/** 
 * CmrDocumentCargoResponseDTOSchema 
 * @type { object }
 * @property { string } caseMarks Case marks of the cargo 
 * @property { number } quantity Quantity of packages 
 * @property { string } description Description of the cargo 
 * @property { string } packageType  
 * @property { string } statisticNumber  
 * @property { string } positionNumber Position number of the cargo 
 * @property { number } grossWeight Gross weight of the cargo 
 * @property { number } volume Volume of the cargo 
 * @property { string } containerNumber Container number of the cargo 
 * @property { string } seal1 Seal number 1 of the cargo 
 * @property { string } seal2 Seal number 2 of the cargo 
 */
export const CmrDocumentCargoResponseDTOSchema = z.object({ caseMarks: z.string().nullable(), quantity: z.number().nullable(), description: z.string().nullable(), packageType: z.string().nullable(), statisticNumber: z.string().nullable(), positionNumber: z.string().nullable(), grossWeight: z.number().nullable(), volume: z.number().nullable(), containerNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable() }).partial();
export type CmrDocumentCargoResponseDTO = z.infer<typeof CmrDocumentCargoResponseDTOSchema>;

/** 
 * CmrDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the document 
 * @property { string } name Name of the document 
 * @property { string } positionNumber Position number 
 * @property { string } nameSuffix Name suffix of the document 
 * @property { string } defaultFileName  
 * @property { string } positionId Position ID 
 * @property { number } versionNumber Version number of the document 
 * @property { string } cmrNumber CMR number 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentBusinessPartnerResponseDTO } carrier Carrier information 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentBusinessPartnerResponseDTO } successiveCarrier Successive carrier information 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentCityResponseDTO } delivery Delivery information 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentCityResponseDTO } takeover Takeover information 
 * @property { string } annexedDocuments Annexed documents 
 * @property { string } carriersObservations Carriers observations 
 * @property { string } senderInstructions Sender instructions 
 * @property { string } reimbursement Reimbursement information 
 * @property { string } specialAgreements Special agreements 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { boolean } freightPaid Whether freight is paid 
 * @property { boolean } freightToBePaid Whether freight is to be paid 
 * @property { string } creationPlace Place of creation 
 * @property { string } creationDate Date of creation 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentCostsResponseDTO } costsForShipper Costs for shipper 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentCostsResponseDTO } costsForConsignee Costs for consignee 
 * @property { string[] } selectedCargoIds List of selected cargo IDs 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { HBLDocumentConfigDto } config Configuration settings for the document 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentSettingsDtoDTO } settings Settings for the BL Instructions document 
 */
export const CmrDocumentResponseDTOSchema = z.object({ id: z.string(), name: z.string(), positionNumber: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), positionId: z.string(), versionNumber: z.number(), cmrNumber: z.string().nullish(), consignee: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), carrier: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), successiveCarrier: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), delivery: CmrDocumentCityResponseDTOSchema.nullish(), takeover: CmrDocumentCityResponseDTOSchema.nullish(), annexedDocuments: z.string().nullish(), carriersObservations: z.string().nullish(), senderInstructions: z.string().nullish(), reimbursement: z.string().nullish(), specialAgreements: z.string().nullish(), suppressWeight: z.boolean(), suppressMeasurement: z.boolean(), freightPaid: z.boolean(), freightToBePaid: z.boolean(), creationPlace: z.string(), creationDate: z.string(), costsForShipper: CmrDocumentCostsResponseDTOSchema.nullish(), costsForConsignee: CmrDocumentCostsResponseDTOSchema.nullish(), selectedCargoIds: z.array(z.string()), cargo: z.array(CmrDocumentCargoResponseDTOSchema).nullish(), config: CommonModels.HBLDocumentConfigDtoSchema, bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), settings: CmrDocumentSettingsDtoDTOSchema.nullish() });
export type CmrDocumentResponseDTO = z.infer<typeof CmrDocumentResponseDTOSchema>;

/** 
 * UpdateCmrDocumentSettingsRequestDTOSchema 
 * @type { object }
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentLanguage } primaryLanguage Primary language 
 * @property { WorkingDocumentsCmrFormModels.CmrDocumentLanguage } secondaryLanguage Secondary language 
 */
export const UpdateCmrDocumentSettingsRequestDTOSchema = z.object({ primaryLanguage: CmrDocumentLanguageSchema.nullable(), secondaryLanguage: CmrDocumentLanguageSchema.nullable() }).partial();
export type UpdateCmrDocumentSettingsRequestDTO = z.infer<typeof UpdateCmrDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateCmrDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateCmrDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateCmrDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateCmrDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateCmrDocumentDeliveryRequestDTOSchema 
 * @type { object }
 * @property { string } cityId City ID 
 * @property { string } cityName City name 
 * @property { string } date Date 
 */
export const UpdateCmrDocumentDeliveryRequestDTOSchema = z.object({ cityId: z.string().nullable(), cityName: z.string().nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdateCmrDocumentDeliveryRequestDTO = z.infer<typeof UpdateCmrDocumentDeliveryRequestDTOSchema>;

/** 
 * UpdateCmrDocumentCostsRequestDTOSchema 
 * @type { object }
 * @property { number } carriageCharges Carriage charges 
 * @property { number } reductions Reductions 
 * @property { number } balance Balance 
 * @property { number } supplements Supplements 
 * @property { number } miscellaneous Miscellaneous 
 * @property { number } total Total 
 */
export const UpdateCmrDocumentCostsRequestDTOSchema = z.object({ carriageCharges: z.number().nullable(), reductions: z.number().nullable(), balance: z.number().nullable(), supplements: z.number().nullable(), miscellaneous: z.number().nullable(), total: z.number().nullable() }).partial();
export type UpdateCmrDocumentCostsRequestDTO = z.infer<typeof UpdateCmrDocumentCostsRequestDTOSchema>;

/** 
 * UpdateCmrDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Name suffix 
 * @property { string } cmrNumber CMR number 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentBusinessPartnerRequestDTO } shipper Shipper information 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentBusinessPartnerRequestDTO } carrier Carrier information 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentBusinessPartnerRequestDTO } successiveCarrier Successive carrier information 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentDeliveryRequestDTO } delivery Delivery information 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentDeliveryRequestDTO } takeover Takeover information 
 * @property { string } annexedDocuments Annexed documents 
 * @property { string } carriersObservations Carriers observations 
 * @property { string } senderInstructions Sender instructions 
 * @property { string } reimbursement Reimbursement 
 * @property { string } specialAgreements Special agreements 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { boolean } freightPaid Whether freight is paid 
 * @property { boolean } freightToBePaid Whether freight is to be paid 
 * @property { string } creationPlace Place of creation 
 * @property { string } creationDate Date of creation 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentCostsRequestDTO } costsForShipper Costs for shipper 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentCostsRequestDTO } costsForConsignee Costs for consignee 
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { WorkingDocumentsCmrFormModels.UpdateCmrDocumentSettingsRequestDTO } settings Settings 
 */
export const UpdateCmrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), cmrNumber: z.string().nullable(), consignee: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), carrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), successiveCarrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), delivery: UpdateCmrDocumentDeliveryRequestDTOSchema.nullable(), takeover: UpdateCmrDocumentDeliveryRequestDTOSchema.nullable(), annexedDocuments: z.string().nullable(), carriersObservations: z.string().nullable(), senderInstructions: z.string().nullable(), reimbursement: z.string().nullable(), specialAgreements: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), freightPaid: z.boolean().nullable(), freightToBePaid: z.boolean().nullable(), creationPlace: z.string().nullable(), creationDate: z.string().nullable(), costsForShipper: UpdateCmrDocumentCostsRequestDTOSchema.nullable(), costsForConsignee: UpdateCmrDocumentCostsRequestDTOSchema.nullable(), selectedCargoIds: z.array(z.string()).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), settings: UpdateCmrDocumentSettingsRequestDTOSchema.nullable() }).partial();
export type UpdateCmrDocumentRequestDTO = z.infer<typeof UpdateCmrDocumentRequestDTOSchema>;

/** 
 * IsfDocumentCargoCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const IsfDocumentCargoCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type IsfDocumentCargoCountryResponseDTO = z.infer<typeof IsfDocumentCargoCountryResponseDTOSchema>;

/** 
 * IsfDocumentCargoResponseDTOSchema 
 * @type { object }
 * @property { string } productCode Product code of the cargo 
 * @property { string } descriptionOfGoods Description of goods 
 * @property { string } htsCode HTS code of the cargo 
 * @property { string } manufacturerSupplier Manufacturer supplier of the cargo 
 * @property { string } seal1 Seal number 1 of the cargo 
 * @property { string } seal2 Seal number 2 of the cargo 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentCargoCountryResponseDTO } countryOfOrigin Country of origin of the cargo 
 */
export const IsfDocumentCargoResponseDTOSchema = z.object({ productCode: z.string().nullable(), descriptionOfGoods: z.string().nullable(), htsCode: z.string().nullable(), manufacturerSupplier: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), countryOfOrigin: IsfDocumentCargoCountryResponseDTOSchema.nullable() }).partial();
export type IsfDocumentCargoResponseDTO = z.infer<typeof IsfDocumentCargoResponseDTOSchema>;

/** 
 * IsfDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const IsfDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type IsfDocumentPortResponseDTO = z.infer<typeof IsfDocumentPortResponseDTOSchema>;

/** 
 * IsfDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 * @property { string } number Number of the business partner 
 */
export const IsfDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable(), number: z.string().nullable() }).partial();
export type IsfDocumentBusinessPartnerResponseDTO = z.infer<typeof IsfDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * IsfDocumentContainerLocationResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the container location 
 * @property { string } name Name of the container location 
 * @property { string } address Address of the container location 
 */
export const IsfDocumentContainerLocationResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type IsfDocumentContainerLocationResponseDTO = z.infer<typeof IsfDocumentContainerLocationResponseDTOSchema>;

/** 
 * IsfDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the document 
 * @property { string } name Name of the document 
 * @property { string } nameSuffix Name suffix of the document 
 * @property { string } defaultFileName  
 * @property { string } positionId Position ID 
 * @property { string } positionNumber Position number 
 * @property { number } versionNumber Version number of the document 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } hBLNumber HBL number 
 * @property { string } mBLNumber MBL number 
 * @property { string } scacCodeHBL SCAC code for HBL 
 * @property { string } scacCodeMBL SCAC code for MBL 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentPortResponseDTO } portOfDischarge Port of discharge 
 * @property { string } issueLocation Issue location 
 * @property { string } issueDate Issue date 
 * @property { string } companyName Company name 
 * @property { object } completedBy  
 * @property { string } completedBy.name  
 * @property { string } completedBy.email  
 * @property { object } container  
 * @property { string } container.id  
 * @property { string } container.name  
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } manufacturer Manufacturer information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } seller Seller information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } buyer Buyer information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } consolidator Consolidator information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentContainerLocationResponseDTO } containerLocation Container location information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } shipTo Ship to information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentBusinessPartnerResponseDTO } importer Importer information 
 * @property { WorkingDocumentsIsfFormModels.IsfDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { HBLDocumentConfigDto } config Configuration settings for the document 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 */
export const IsfDocumentResponseDTOSchema = z.object({ id: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), positionId: z.string(), positionNumber: z.string(), versionNumber: z.number(), vessel: z.string().nullish(), voyage: z.string().nullish(), hBLNumber: z.string().nullish(), mBLNumber: z.string().nullish(), scacCodeHBL: z.string().nullish(), scacCodeMBL: z.string().nullish(), portOfDischarge: IsfDocumentPortResponseDTOSchema.nullish(), issueLocation: z.string().nullish(), issueDate: z.iso.datetime({ offset: true }).nullish(), companyName: z.string().nullish(), completedBy: z.object({ name: z.string(), email: z.string() }).nullish(), container: z.object({ id: z.string(), name: z.string() }).nullish(), consignee: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), manufacturer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), seller: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), buyer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), consolidator: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), containerLocation: IsfDocumentContainerLocationResponseDTOSchema.nullish(), shipTo: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), importer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), cargo: z.array(IsfDocumentCargoResponseDTOSchema).nullish(), config: CommonModels.HBLDocumentConfigDtoSchema, bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish() });
export type IsfDocumentResponseDTO = z.infer<typeof IsfDocumentResponseDTOSchema>;

/** 
 * UpdateIsfDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 * @property { string } number Business partner number 
 */
export const UpdateIsfDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable(), number: z.string().nullable() }).partial();
export type UpdateIsfDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateIsfDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateIsfDocumentCargoRequestDTOSchema 
 * @type { object }
 * @property { string } productCode Product code 
 * @property { string } descriptionOfGoods Description of goods 
 * @property { string } htsCode HTS code 
 * @property { string } manufacturerSupplier Manufacturer supplier 
 * @property { string } countryOfOriginId Country of origin ID 
 */
export const UpdateIsfDocumentCargoRequestDTOSchema = z.object({ productCode: z.string().nullable(), descriptionOfGoods: z.string().nullable(), htsCode: z.string().nullable(), manufacturerSupplier: z.string().nullable(), countryOfOriginId: z.string().nullable() }).partial();
export type UpdateIsfDocumentCargoRequestDTO = z.infer<typeof UpdateIsfDocumentCargoRequestDTOSchema>;

/** 
 * UpdateIsfDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Name suffix 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } hBLNumber HBL number 
 * @property { string } mBLNumber MBL number 
 * @property { string } scacCodeHBL SCAC code for HBL 
 * @property { string } scacCodeMBL SCAC code for MBL 
 * @property { string } portOfDischargeId Port of discharge Id 
 * @property { string } issueLocation Issue location 
 * @property { string } issueDate Issue date 
 * @property { string } companyName Company name 
 * @property { string } completedByName Completed by name 
 * @property { string } completedByEmail Completed by email 
 * @property { string } containerId Container ID 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } manufacturer Manufacturer information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } seller Seller information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } buyer Buyer information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } consolidator Consolidator information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } containerLocation Container location information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } shipTo Ship to information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentBusinessPartnerRequestDTO } importer Importer information 
 * @property { WorkingDocumentsIsfFormModels.UpdateIsfDocumentCargoRequestDTO[] } cargo Cargo information 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateIsfDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), hBLNumber: z.string().nullable(), mBLNumber: z.string().nullable(), scacCodeHBL: z.string().nullable(), scacCodeMBL: z.string().nullable(), portOfDischargeId: z.string().nullable(), issueLocation: z.string().nullable(), issueDate: z.iso.datetime({ offset: true }).nullable(), companyName: z.string().nullable(), completedByName: z.string().nullable(), completedByEmail: z.string().nullable(), containerId: z.string().nullable(), consignee: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), manufacturer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), seller: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), buyer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), consolidator: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), containerLocation: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), shipTo: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), importer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), cargo: z.array(UpdateIsfDocumentCargoRequestDTOSchema).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateIsfDocumentRequestDTO = z.infer<typeof UpdateIsfDocumentRequestDTOSchema>;

/** 
 * FcrDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const FcrDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type FcrDocumentBusinessPartnerResponseDTO = z.infer<typeof FcrDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * FcrDocumentCargoResponseDTOSchema 
 * @type { object }
 * @property { string } caseMarks Case marks of the cargo 
 * @property { string } containerNumber Container number 
 * @property { string } seal1 Seal number 1 of the cargo 
 * @property { string } seal2 Seal number 2 of the cargo 
 * @property { number } quantity Quantity of the cargo 
 * @property { string } description Description of the cargo 
 * @property { number } weight Weight of the cargo 
 * @property { number } volume Volume of the cargo 
 */
export const FcrDocumentCargoResponseDTOSchema = z.object({ caseMarks: z.string().nullable(), containerNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), quantity: z.number().nullable(), description: z.string().nullable(), weight: z.number().nullable(), volume: z.number().nullable() }).partial();
export type FcrDocumentCargoResponseDTO = z.infer<typeof FcrDocumentCargoResponseDTOSchema>;

/** 
 * FcrDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the document 
 * @property { string } name Name of the document 
 * @property { string } nameSuffix Name suffix of the document 
 * @property { string } defaultFileName  
 * @property { string } positionId Position ID 
 * @property { string } positionNumber Position number 
 * @property { number } versionNumber Version number of the document 
 * @property { string } fcrNumber FCR number 
 * @property { string } edvNumber EDV number 
 * @property { number } numberOfOriginals Number of originals 
 * @property { string } placeOfLoading Place of loading 
 * @property { string } dateOfLoading Date of loading 
 * @property { string } viaCity Via city 
 * @property { string } toDestination To destination 
 * @property { string } transportMode Transport mode 
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } issuePlace Issue place 
 * @property { string } issueDate Issue date 
 * @property { string } deliveryTerms Delivery terms 
 * @property { WorkingDocumentsFcrFormModels.FcrDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { WorkingDocumentsFcrFormModels.FcrDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { WorkingDocumentsFcrFormModels.FcrDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { HBLDocumentConfigDto } config Configuration settings for the document 
 */
export const FcrDocumentResponseDTOSchema = z.object({ id: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), positionId: z.string(), positionNumber: z.string(), versionNumber: z.number(), fcrNumber: z.string().nullish(), edvNumber: z.string().nullish(), numberOfOriginals: z.number(), placeOfLoading: z.string().nullish(), dateOfLoading: z.iso.datetime({ offset: true }).nullish(), viaCity: z.string().nullish(), toDestination: z.string().nullish(), transportMode: CommonModels.TransportModeEnumSchema, bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), issuePlace: z.string().nullish(), issueDate: z.iso.datetime({ offset: true }).nullish(), deliveryTerms: z.string().nullish(), shipper: FcrDocumentBusinessPartnerResponseDTOSchema.nullish(), consignee: FcrDocumentBusinessPartnerResponseDTOSchema.nullish(), cargo: z.array(FcrDocumentCargoResponseDTOSchema).nullish(), config: CommonModels.HBLDocumentConfigDtoSchema });
export type FcrDocumentResponseDTO = z.infer<typeof FcrDocumentResponseDTOSchema>;

/** 
 * UpdateFcrDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Name suffix 
 * @property { string } fcrNumber FCR number 
 * @property { string } edvNumber EDV number 
 * @property { number } numberOfOriginals Number of originals 
 * @property { string } placeOfLoading Place of loading 
 * @property { string } dateOfLoading Date of loading 
 * @property { string } viaCity Via city 
 * @property { string } toDestination To destination 
 * @property { string } transportMode Transport mode 
 * @property { string } issuePlace Issue place 
 * @property { string } issueDate Issue date 
 * @property { string } deliveryTerms Delivery terms 
 * @property { string } shipperId Shipper ID 
 * @property { string } shipperAddress Shipper address 
 * @property { string } consigneeId Consignee ID 
 * @property { string } consigneeAddress Consignee address 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateFcrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), fcrNumber: z.string().nullable(), edvNumber: z.string().nullable(), numberOfOriginals: z.number().nullable(), placeOfLoading: z.string().nullable(), dateOfLoading: z.iso.datetime({ offset: true }).nullable(), viaCity: z.string().nullable(), toDestination: z.string().nullable(), transportMode: z.string().nullable(), issuePlace: z.string().nullable(), issueDate: z.iso.datetime({ offset: true }).nullable(), deliveryTerms: z.string().nullable(), shipperId: z.string().nullable(), shipperAddress: z.string().nullable(), consigneeId: z.string().nullable(), consigneeAddress: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateFcrDocumentRequestDTO = z.infer<typeof UpdateFcrDocumentRequestDTOSchema>;

/** 
 * ShippingInstructionsPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } addressLine1  
 * @property { string } addressLine2  
 * @property { string } city  
 * @property { string } postalCode  
 * @property { string } state  
 * @property { string } countryCode  
 * @property { string } contactName  
 * @property { string } contactPhone  
 * @property { string } contactEmail  
 */
export const ShippingInstructionsPartnerResponseDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), addressLine1: z.string().nullable(), addressLine2: z.string().nullable(), city: z.string().nullable(), postalCode: z.string().nullable(), state: z.string().nullable(), countryCode: z.string().nullable(), contactName: z.string().nullable(), contactPhone: z.string().nullable(), contactEmail: z.string().nullable() }).partial();
export type ShippingInstructionsPartnerResponseDto = z.infer<typeof ShippingInstructionsPartnerResponseDtoSchema>;

/** 
 * ShippingInstructionsGeneralDetailsDtoSchema 
 * @type { object }
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } shipper  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } consignee  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } freightForwarder  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } notifyParty  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } additionalNotifyParty1  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } additionalNotifyParty2  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } contractParty  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } manufacturer  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } consolidator  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } importer  
 * @property { ShippingInstructionsModels.ShippingInstructionsPartnerResponseDto } warehouseKeeper  
 */
export const ShippingInstructionsGeneralDetailsDtoSchema = z.object({ shipper: ShippingInstructionsPartnerResponseDtoSchema.nullable(), consignee: ShippingInstructionsPartnerResponseDtoSchema.nullable(), freightForwarder: ShippingInstructionsPartnerResponseDtoSchema.nullable(), notifyParty: ShippingInstructionsPartnerResponseDtoSchema.nullable(), additionalNotifyParty1: ShippingInstructionsPartnerResponseDtoSchema.nullable(), additionalNotifyParty2: ShippingInstructionsPartnerResponseDtoSchema.nullable(), contractParty: ShippingInstructionsPartnerResponseDtoSchema.nullable(), manufacturer: ShippingInstructionsPartnerResponseDtoSchema.nullable(), consolidator: ShippingInstructionsPartnerResponseDtoSchema.nullable(), importer: ShippingInstructionsPartnerResponseDtoSchema.nullable(), warehouseKeeper: ShippingInstructionsPartnerResponseDtoSchema.nullable() }).partial();
export type ShippingInstructionsGeneralDetailsDto = z.infer<typeof ShippingInstructionsGeneralDetailsDtoSchema>;

/** 
 * ShippingInstructionsLocationResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } code  
 * @property { string } countryCode  
 * @property { string } eta  
 * @property { string } vessel  
 * @property { string } voyage  
 */
export const ShippingInstructionsLocationResponseDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), code: z.string().nullable(), countryCode: z.string().nullable(), eta: z.iso.datetime({ offset: true }).nullable(), vessel: z.string().nullable(), voyage: z.string().nullable() }).partial();
export type ShippingInstructionsLocationResponseDto = z.infer<typeof ShippingInstructionsLocationResponseDtoSchema>;

/** 
 * SIMoveTypeEnumSchema 
 * @type { enum }
 */
export const SIMoveTypeEnumSchema = z.enum(["DoorToDoor", "DoorToPort", "PortToDoor", "PortToPort"]);
export type SIMoveTypeEnum = z.infer<typeof SIMoveTypeEnumSchema>;
export const SIMoveTypeEnum = SIMoveTypeEnumSchema.enum;

/** 
 * ShippingInstructionsTransportDtoSchema 
 * @type { object }
 * @property { string } vessel  
 * @property { string } voyage  
 * @property { string } imo  
 * @property { ShippingInstructionsModels.ShippingInstructionsLocationResponseDto } placeOfReceipt  
 * @property { ShippingInstructionsModels.ShippingInstructionsLocationResponseDto } portOfLoading  
 * @property { ShippingInstructionsModels.ShippingInstructionsLocationResponseDto } portOfDischarge  
 * @property { ShippingInstructionsModels.ShippingInstructionsLocationResponseDto } placeOfDelivery  
 * @property { ShippingInstructionsModels.SIMoveTypeEnum } moveType  
 * @property { string } shipmentType  
 */
export const ShippingInstructionsTransportDtoSchema = z.object({ vessel: z.string().nullable(), voyage: z.string().nullable(), imo: z.string().nullable(), placeOfReceipt: ShippingInstructionsLocationResponseDtoSchema.nullable(), portOfLoading: ShippingInstructionsLocationResponseDtoSchema.nullable(), portOfDischarge: ShippingInstructionsLocationResponseDtoSchema.nullable(), placeOfDelivery: ShippingInstructionsLocationResponseDtoSchema.nullable(), moveType: SIMoveTypeEnumSchema.nullable(), shipmentType: z.string().nullable() }).partial();
export type ShippingInstructionsTransportDto = z.infer<typeof ShippingInstructionsTransportDtoSchema>;

/** 
 * ShippingInstructionsHazardousDtoSchema 
 * @type { object }
 * @property { string } IMOClass  
 * @property { string } UNDGNumber  
 * @property { string } contact  
 */
export const ShippingInstructionsHazardousDtoSchema = z.object({ IMOClass: z.string().nullable(), UNDGNumber: z.string().nullable(), contact: z.string().nullable() }).partial();
export type ShippingInstructionsHazardousDto = z.infer<typeof ShippingInstructionsHazardousDtoSchema>;

/** 
 * ShippingInstructionsPackageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } quantity  
 * @property { string } packageType  
 * @property { string } packageTypeDescription  
 * @property { string } packageDescription  
 * @property { string } hsCode  
 * @property { number } volume  
 * @property { number } grossWeight  
 * @property { string } caseMarks  
 * @property { ShippingInstructionsModels.ShippingInstructionsHazardousDto } hazardous  
 * @property { string } ncmCodes  
 * @property { string } cusCode  
 */
export const ShippingInstructionsPackageResponseDtoSchema = z.object({ id: z.string().nullable(), quantity: z.number().nullable(), packageType: z.string().nullable(), packageTypeDescription: z.string().nullable(), packageDescription: z.string().nullable(), hsCode: z.string().nullable(), volume: z.number().nullable(), grossWeight: z.number().nullable(), caseMarks: z.string().nullable(), hazardous: ShippingInstructionsHazardousDtoSchema.nullable(), ncmCodes: z.string().nullable(), cusCode: z.string().nullable() }).partial();
export type ShippingInstructionsPackageResponseDto = z.infer<typeof ShippingInstructionsPackageResponseDtoSchema>;

/** 
 * ShippingInstructionsCargoResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } transportUnitNumber  
 * @property { string } transportUnitType  
 * @property { string } transportUnitDescription  
 * @property { string } containerSupplier  
 * @property { number } grossWeight  
 * @property { number } tare  
 * @property { number } volume  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { string } woodDeclaration  
 * @property { ShippingInstructionsModels.ShippingInstructionsPackageResponseDto[] } packages  
 */
export const ShippingInstructionsCargoResponseDtoSchema = z.object({ id: z.string().nullish(), transportUnitNumber: z.string().nullish(), transportUnitType: z.string().nullish(), transportUnitDescription: z.string().nullish(), containerSupplier: z.string().nullish(), grossWeight: z.number().nullish(), tare: z.number().nullish(), volume: z.number().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), woodDeclaration: WoodDeclarationEnumSchema.nullish(), packages: z.array(ShippingInstructionsPackageResponseDtoSchema) });
export type ShippingInstructionsCargoResponseDto = z.infer<typeof ShippingInstructionsCargoResponseDtoSchema>;

/** 
 * ShippingInstructionsHeaderDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } nameSuffix  
 * @property { number } versionNumber  
 * @property { string } shippingInstructionNumber  
 * @property { string } carrierScac  
 * @property { string } carrierBookingNumber  
 */
export const ShippingInstructionsHeaderDtoSchema = z.object({ name: z.string(), nameSuffix: z.string().nullish(), versionNumber: z.number(), shippingInstructionNumber: z.string().nullish(), carrierScac: z.string().nullish(), carrierBookingNumber: z.string().nullish() });
export type ShippingInstructionsHeaderDto = z.infer<typeof ShippingInstructionsHeaderDtoSchema>;

/** 
 * ShippingInstructionsReferencesDtoSchema 
 * @type { object }
 * @property { string } shipperReference  
 * @property { string } forwarderReference  
 * @property { string } transactionReferenceNumber  
 * @property { string } blReferenceNumber  
 * @property { string } uniqueConsignmentReference  
 * @property { string } purchaseOrderNumber  
 * @property { string } contractReferenceNumber  
 * @property { string } rucNumber  
 * @property { string } consigneeOrderNumber  
 * @property { string } invoiceReferenceNumber  
 * @property { string } letterOfCreditReference  
 * @property { string } customsHouseBrokerReference  
 * @property { string } fmcNumber  
 * @property { string } exportLicenseNumber  
 */
export const ShippingInstructionsReferencesDtoSchema = z.object({ shipperReference: z.string().nullable(), forwarderReference: z.string().nullable(), transactionReferenceNumber: z.string().nullable(), blReferenceNumber: z.string().nullable(), uniqueConsignmentReference: z.string().nullable(), purchaseOrderNumber: z.string().nullable(), contractReferenceNumber: z.string().nullable(), rucNumber: z.string().nullable(), consigneeOrderNumber: z.string().nullable(), invoiceReferenceNumber: z.string().nullable(), letterOfCreditReference: z.string().nullable(), customsHouseBrokerReference: z.string().nullable(), fmcNumber: z.string().nullable(), exportLicenseNumber: z.string().nullable() }).partial();
export type ShippingInstructionsReferencesDto = z.infer<typeof ShippingInstructionsReferencesDtoSchema>;

/** 
 * ShippingInstructionsCustomsComplianceDtoSchema 
 * @type { object }
 * @property { string } shipperTaxId  
 * @property { string } shipperEORI  
 * @property { string } consigneeTaxId  
 * @property { string } consigneeEORI  
 * @property { string } notifyPartyTaxId  
 * @property { string } notifyPartyEORI  
 */
export const ShippingInstructionsCustomsComplianceDtoSchema = z.object({ shipperTaxId: z.string().nullable(), shipperEORI: z.string().nullable(), consigneeTaxId: z.string().nullable(), consigneeEORI: z.string().nullable(), notifyPartyTaxId: z.string().nullable(), notifyPartyEORI: z.string().nullable() }).partial();
export type ShippingInstructionsCustomsComplianceDto = z.infer<typeof ShippingInstructionsCustomsComplianceDtoSchema>;

/** 
 * ShippingInstructionsIcs2DtoSchema 
 * @type { object }
 * @property { boolean } goodsDeliveredInEu  
 * @property { string } ensDeclaration  
 * @property { string } issuedHouseBills  
 */
export const ShippingInstructionsIcs2DtoSchema = z.object({ goodsDeliveredInEu: z.boolean().nullable(), ensDeclaration: EnsDeclarationEnumSchema.nullable(), issuedHouseBills: IssuedHouseBillsEnumSchema.nullable() }).partial();
export type ShippingInstructionsIcs2Dto = z.infer<typeof ShippingInstructionsIcs2DtoSchema>;

/** 
 * ShippingInstructionsCargoIdentificationNumbersDtoSchema 
 * @type { object }
 * @property { string } PCINNumber  
 * @property { string } CSNNumber  
 * @property { string } MCINNumber  
 */
export const ShippingInstructionsCargoIdentificationNumbersDtoSchema = z.object({ PCINNumber: z.string().nullable(), CSNNumber: z.string().nullable(), MCINNumber: z.string().nullable() }).partial();
export type ShippingInstructionsCargoIdentificationNumbersDto = z.infer<typeof ShippingInstructionsCargoIdentificationNumbersDtoSchema>;

/** 
 * ShippingInstructionsControlTotalsDtoSchema 
 * @type { object }
 * @property { number } totalNumberOfContainers  
 * @property { number } totalNumberOfPackages  
 * @property { number } totalShipmentWeight  
 * @property { number } totalShipmentVolume  
 */
export const ShippingInstructionsControlTotalsDtoSchema = z.object({ totalNumberOfContainers: z.number().nullable(), totalNumberOfPackages: z.number().nullable(), totalShipmentWeight: z.number().nullable(), totalShipmentVolume: z.number().nullable() }).partial();
export type ShippingInstructionsControlTotalsDto = z.infer<typeof ShippingInstructionsControlTotalsDtoSchema>;

/** 
 * FreightChargesDtoSchema 
 * @type { object }
 * @property { string } freightPayer  
 * @property { string } freightTerm  
 */
export const FreightChargesDtoSchema = z.object({ freightPayer: z.string().nullable(), freightTerm: CommonModels.ChargePaymentEnumSchema.nullable() }).partial();
export type FreightChargesDto = z.infer<typeof FreightChargesDtoSchema>;

/** 
 * ShippingInstructionsShippersDeclaredValueDtoSchema 
 * @type { object }
 * @property { string } currency  
 * @property { number } shipperDeclaredValue  
 */
export const ShippingInstructionsShippersDeclaredValueDtoSchema = z.object({ currency: z.string().nullable(), shipperDeclaredValue: z.number().nullable() }).partial();
export type ShippingInstructionsShippersDeclaredValueDto = z.infer<typeof ShippingInstructionsShippersDeclaredValueDtoSchema>;

/** 
 * ShippingInstructionsNotificationEmailsDtoSchema 
 * @type { object }
 * @property { string } siRequestorEmails  
 */
export const ShippingInstructionsNotificationEmailsDtoSchema = z.object({ siRequestorEmails: z.string().nullable() }).partial();
export type ShippingInstructionsNotificationEmailsDto = z.infer<typeof ShippingInstructionsNotificationEmailsDtoSchema>;

/** 
 * ShippingInstructionsResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } name  
 * @property { string } nameSuffix  
 * @property { string } date  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { number } versionNumber  
 * @property { ShippingInstructionsModels.ShippingInstructionsHeaderDto } header  
 * @property { ShippingInstructionsModels.ShippingInstructionsGeneralDetailsDto } generalDetails  
 * @property { ShippingInstructionsModels.ShippingInstructionsReferencesDto } references  
 * @property { ShippingInstructionsModels.ShippingInstructionsTransportDto } transport  
 * @property { ShippingInstructionsModels.ShippingInstructionsCustomsComplianceDto } customsCompliance  
 * @property { ShippingInstructionsModels.ShippingInstructionsIcs2Dto } ics2  
 * @property { ShippingInstructionsModels.ShippingInstructionsCargoIdentificationNumbersDto } cargoIdentificationNumbers  
 * @property { ShippingInstructionsModels.ShippingInstructionsCargoResponseDto[] } cargo  
 * @property { ShippingInstructionsModels.ShippingInstructionsControlTotalsDto } controlTotals  
 * @property { ShippingInstructionsModels.FreightChargesDto } freightCharges  
 * @property { ShippingInstructionsModels.ShippingInstructionsShippersDeclaredValueDto } shippersDeclaredValue  
 * @property { ShippingInstructionsModels.ShippingInstructionsNotificationEmailsDto } notificationEmails  
 * @property { string } defaultFileName  
 */
export const ShippingInstructionsResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), name: z.string(), nameSuffix: z.string().nullish(), date: z.iso.datetime({ offset: true }).nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), versionNumber: z.number(), header: ShippingInstructionsHeaderDtoSchema, generalDetails: ShippingInstructionsGeneralDetailsDtoSchema, references: ShippingInstructionsReferencesDtoSchema, transport: ShippingInstructionsTransportDtoSchema, customsCompliance: ShippingInstructionsCustomsComplianceDtoSchema, ics2: ShippingInstructionsIcs2DtoSchema, cargoIdentificationNumbers: ShippingInstructionsCargoIdentificationNumbersDtoSchema, cargo: z.array(ShippingInstructionsCargoResponseDtoSchema).nullish(), controlTotals: ShippingInstructionsControlTotalsDtoSchema, freightCharges: FreightChargesDtoSchema, shippersDeclaredValue: ShippingInstructionsShippersDeclaredValueDtoSchema, notificationEmails: ShippingInstructionsNotificationEmailsDtoSchema, defaultFileName: z.string() });
export type ShippingInstructionsResponseDto = z.infer<typeof ShippingInstructionsResponseDtoSchema>;

/** 
 * UpdateShippingInstructionsPartnerDtoSchema 
 * @type { object }
 * @property { string } id Partner id 
 * @property { string } name Partner name 
 * @property { string } addressLine1 Address line 1 
 * @property { string } addressLine2 Address line 2 
 * @property { string } city City 
 * @property { string } postalCode Postal code 
 * @property { string } state State 
 * @property { string } countryCode Country code 
 * @property { string } taxId Tax ID 
 * @property { string } contactName Contact name 
 * @property { string } contactPhone Contact phone 
 * @property { string } contactEmail Contact email 
 */
export const UpdateShippingInstructionsPartnerDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), addressLine1: z.string().nullable(), addressLine2: z.string().nullable(), city: z.string().nullable(), postalCode: z.string().nullable(), state: z.string().nullable(), countryCode: z.string().nullable(), taxId: z.string().nullable(), contactName: z.string().nullable(), contactPhone: z.string().nullable(), contactEmail: z.string().nullable() }).partial();
export type UpdateShippingInstructionsPartnerDto = z.infer<typeof UpdateShippingInstructionsPartnerDtoSchema>;

/** 
 * UpdateShippingInstructionsGeneralDetailsDtoSchema 
 * @type { object }
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } shipper Shipper 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } consignee Consignee 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } freightForwarder Freight forwarder 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } notifyParty Notify party 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } additionalNotifyParty1 Additional notify party 1 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } additionalNotifyParty2 Additional notify party 2 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } contractParty Contract party 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } manufacturer Manufacturer 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } consolidator Consolidator 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } importer Importer 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPartnerDto } warehouseKeeper Warehouse keeper 
 */
export const UpdateShippingInstructionsGeneralDetailsDtoSchema = z.object({ shipper: UpdateShippingInstructionsPartnerDtoSchema.nullable(), consignee: UpdateShippingInstructionsPartnerDtoSchema.nullable(), freightForwarder: UpdateShippingInstructionsPartnerDtoSchema.nullable(), notifyParty: UpdateShippingInstructionsPartnerDtoSchema.nullable(), additionalNotifyParty1: UpdateShippingInstructionsPartnerDtoSchema.nullable(), additionalNotifyParty2: UpdateShippingInstructionsPartnerDtoSchema.nullable(), contractParty: UpdateShippingInstructionsPartnerDtoSchema.nullable(), manufacturer: UpdateShippingInstructionsPartnerDtoSchema.nullable(), consolidator: UpdateShippingInstructionsPartnerDtoSchema.nullable(), importer: UpdateShippingInstructionsPartnerDtoSchema.nullable(), warehouseKeeper: UpdateShippingInstructionsPartnerDtoSchema.nullable() }).partial();
export type UpdateShippingInstructionsGeneralDetailsDto = z.infer<typeof UpdateShippingInstructionsGeneralDetailsDtoSchema>;

/** 
 * UpdateShippingInstructionsLocationDtoSchema 
 * @type { object }
 * @property { string } id Location id 
 * @property { string } name Location name 
 * @property { string } code Location code 
 * @property { string } countryCode Country code 
 */
export const UpdateShippingInstructionsLocationDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), code: z.string().nullable(), countryCode: z.string().nullable() }).partial();
export type UpdateShippingInstructionsLocationDto = z.infer<typeof UpdateShippingInstructionsLocationDtoSchema>;

/** 
 * UpdateShippingInstructionsTransportDtoSchema 
 * @type { object }
 * @property { string } vessel Vessel 
 * @property { string } voyage Voyage 
 * @property { string } imo IMO 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsLocationDto } placeOfReceipt Place of receipt 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsLocationDto } portOfLoading Port of loading 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsLocationDto } portOfDischarge Port of discharge 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsLocationDto } placeOfDelivery Place of delivery 
 * @property { ShippingInstructionsModels.SIMoveTypeEnum } moveType Move type 
 * @property { string } shipmentType Shipment type 
 */
export const UpdateShippingInstructionsTransportDtoSchema = z.object({ vessel: z.string().nullable(), voyage: z.string().nullable(), imo: z.string().nullable(), placeOfReceipt: UpdateShippingInstructionsLocationDtoSchema.nullable(), portOfLoading: UpdateShippingInstructionsLocationDtoSchema.nullable(), portOfDischarge: UpdateShippingInstructionsLocationDtoSchema.nullable(), placeOfDelivery: UpdateShippingInstructionsLocationDtoSchema.nullable(), moveType: SIMoveTypeEnumSchema.nullable(), shipmentType: z.string().nullable() }).partial();
export type UpdateShippingInstructionsTransportDto = z.infer<typeof UpdateShippingInstructionsTransportDtoSchema>;

/** 
 * UpdateShippingInstructionsHazardousDtoSchema 
 * @type { object }
 * @property { string } IMOClass IMO class 
 * @property { string } UNDGNumber UNDG number 
 * @property { string } contact Contact 
 */
export const UpdateShippingInstructionsHazardousDtoSchema = z.object({ IMOClass: z.string().nullable(), UNDGNumber: z.string().nullable(), contact: z.string().nullable() }).partial();
export type UpdateShippingInstructionsHazardousDto = z.infer<typeof UpdateShippingInstructionsHazardousDtoSchema>;

/** 
 * UpdateShippingInstructionsPackageDtoSchema 
 * @type { object }
 * @property { string } id Package id 
 * @property { number } quantity Quantity 
 * @property { string } packageType Package type 
 * @property { string } packageTypeDescription Package type description 
 * @property { string } packageDescription Package description 
 * @property { string } hsCode HS code 
 * @property { number } volume Volume 
 * @property { number } grossWeight Gross weight 
 * @property { string } caseMarks Case marks 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsHazardousDto } hazardous Hazardous 
 * @property { string } ncmCodes NCM codes 
 * @property { string } cusCode CUS code 
 */
export const UpdateShippingInstructionsPackageDtoSchema = z.object({ id: z.string().nullable(), quantity: z.number().nullable(), packageType: z.string().nullable(), packageTypeDescription: z.string().nullable(), packageDescription: z.string().nullable(), hsCode: z.string().nullable(), volume: z.number().nullable(), grossWeight: z.number().nullable(), caseMarks: z.string().nullable(), hazardous: UpdateShippingInstructionsHazardousDtoSchema.nullable(), ncmCodes: z.string().nullable(), cusCode: z.string().nullable() }).partial();
export type UpdateShippingInstructionsPackageDto = z.infer<typeof UpdateShippingInstructionsPackageDtoSchema>;

/** 
 * UpdateShippingInstructionsCargoDtoSchema 
 * @type { object }
 * @property { string } id Cargo id 
 * @property { string } transportUnitNumber Transport unit number 
 * @property { string } transportUnitType Transport unit type 
 * @property { string } transportUnitDescription Transport unit description 
 * @property { string } containerSupplier Container supplier 
 * @property { number } grossWeight Gross weight 
 * @property { number } tare Tare 
 * @property { number } volume Volume 
 * @property { string } seal1 Seal 1 
 * @property { string } seal2 Seal 2 
 * @property { string } woodDeclaration Wood declaration 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsPackageDto[] } packages Packages 
 */
export const UpdateShippingInstructionsCargoDtoSchema = z.object({ id: z.string().nullable(), transportUnitNumber: z.string().nullable(), transportUnitType: z.string().nullable(), transportUnitDescription: z.string().nullable(), containerSupplier: z.string().nullable(), grossWeight: z.number().nullable(), tare: z.number().nullable(), volume: z.number().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), woodDeclaration: WoodDeclarationEnumSchema.nullable(), packages: z.array(UpdateShippingInstructionsPackageDtoSchema).nullable() }).partial();
export type UpdateShippingInstructionsCargoDto = z.infer<typeof UpdateShippingInstructionsCargoDtoSchema>;

/** 
 * UpdateShippingInstructionsHeaderDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } nameSuffix Name suffix 
 * @property { number } versionNumber Version number 
 * @property { string } shippingInstructionNumber Shipping instruction number 
 * @property { string } carrierScac Carrier SCAC 
 * @property { string } carrierBookingNumber Carrier booking number 
 */
export const UpdateShippingInstructionsHeaderDtoSchema = z.object({ name: z.string().nullable(), nameSuffix: z.string().nullable(), versionNumber: z.number().nullable(), shippingInstructionNumber: z.string().nullable(), carrierScac: z.string().nullable(), carrierBookingNumber: z.string().nullable() }).partial();
export type UpdateShippingInstructionsHeaderDto = z.infer<typeof UpdateShippingInstructionsHeaderDtoSchema>;

/** 
 * UpdateShippingInstructionsReferencesDtoSchema 
 * @type { object }
 * @property { string } shipperReference Shipper reference 
 * @property { string } forwarderReference Forwarder reference 
 * @property { string } transactionReferenceNumber Transaction reference number 
 * @property { string } blReferenceNumber BL reference number 
 * @property { string } uniqueConsignmentReference Unique consignment reference 
 * @property { string } purchaseOrderNumber Purchase order number 
 * @property { string } contractReferenceNumber Contract reference number 
 * @property { string } rucNumber RUC number 
 * @property { string } consigneeOrderNumber Consignee order number 
 * @property { string } invoiceReferenceNumber Invoice reference number 
 * @property { string } letterOfCreditReference Letter of credit reference 
 * @property { string } customsHouseBrokerReference Customs house broker reference 
 * @property { string } fmcNumber FMC number 
 * @property { string } exportLicenseNumber Export license number 
 */
export const UpdateShippingInstructionsReferencesDtoSchema = z.object({ shipperReference: z.string().nullable(), forwarderReference: z.string().nullable(), transactionReferenceNumber: z.string().nullable(), blReferenceNumber: z.string().nullable(), uniqueConsignmentReference: z.string().nullable(), purchaseOrderNumber: z.string().nullable(), contractReferenceNumber: z.string().nullable(), rucNumber: z.string().nullable(), consigneeOrderNumber: z.string().nullable(), invoiceReferenceNumber: z.string().nullable(), letterOfCreditReference: z.string().nullable(), customsHouseBrokerReference: z.string().nullable(), fmcNumber: z.string().nullable(), exportLicenseNumber: z.string().nullable() }).partial();
export type UpdateShippingInstructionsReferencesDto = z.infer<typeof UpdateShippingInstructionsReferencesDtoSchema>;

/** 
 * UpdateShippingInstructionsCustomsComplianceDtoSchema 
 * @type { object }
 * @property { string } shipperTaxId Shipper tax ID 
 * @property { string } shipperEORI Shipper EORI 
 * @property { string } consigneeTaxId Consignee tax ID 
 * @property { string } consigneeEORI Consignee EORI 
 * @property { string } notifyPartyTaxId Notify party tax ID 
 * @property { string } notifyPartyEORI Notify party EORI 
 */
export const UpdateShippingInstructionsCustomsComplianceDtoSchema = z.object({ shipperTaxId: z.string().nullable(), shipperEORI: z.string().nullable(), consigneeTaxId: z.string().nullable(), consigneeEORI: z.string().nullable(), notifyPartyTaxId: z.string().nullable(), notifyPartyEORI: z.string().nullable() }).partial();
export type UpdateShippingInstructionsCustomsComplianceDto = z.infer<typeof UpdateShippingInstructionsCustomsComplianceDtoSchema>;

/** 
 * UpdateShippingInstructionsIcs2DtoSchema 
 * @type { object }
 * @property { boolean } goodsDeliveredInEu Goods delivered in EU 
 * @property { string } ensDeclaration ENS declaration 
 * @property { string } issuedHouseBills Issued house bills 
 */
export const UpdateShippingInstructionsIcs2DtoSchema = z.object({ goodsDeliveredInEu: z.boolean().nullable(), ensDeclaration: EnsDeclarationEnumSchema.nullable(), issuedHouseBills: IssuedHouseBillsEnumSchema.nullable() }).partial();
export type UpdateShippingInstructionsIcs2Dto = z.infer<typeof UpdateShippingInstructionsIcs2DtoSchema>;

/** 
 * UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema 
 * @type { object }
 * @property { string } PCINNumber PCIN number 
 * @property { string } CSNNumber CSN number 
 * @property { string } MCINNumber MCIN number 
 */
export const UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema = z.object({ PCINNumber: z.string().nullable(), CSNNumber: z.string().nullable(), MCINNumber: z.string().nullable() }).partial();
export type UpdateShippingInstructionsCargoIdentificationNumbersDto = z.infer<typeof UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema>;

/** 
 * UpdateFreightChargesDtoSchema 
 * @type { object }
 * @property { string } freightPayer  
 * @property { string } freightTerm  
 */
export const UpdateFreightChargesDtoSchema = z.object({ freightPayer: z.string().nullable(), freightTerm: CommonModels.ChargePaymentEnumSchema.nullable() }).partial();
export type UpdateFreightChargesDto = z.infer<typeof UpdateFreightChargesDtoSchema>;

/** 
 * UpdateShippingInstructionsShippersDeclaredValueDtoSchema 
 * @type { object }
 * @property { string } currency Currency 
 * @property { number } shipperDeclaredValue Shipper declared value 
 */
export const UpdateShippingInstructionsShippersDeclaredValueDtoSchema = z.object({ currency: z.string().nullable(), shipperDeclaredValue: z.number().nullable() }).partial();
export type UpdateShippingInstructionsShippersDeclaredValueDto = z.infer<typeof UpdateShippingInstructionsShippersDeclaredValueDtoSchema>;

/** 
 * UpdateShippingInstructionsNotificationEmailsDtoSchema 
 * @type { object }
 * @property { string } siRequestorEmails SI requestor emails 
 */
export const UpdateShippingInstructionsNotificationEmailsDtoSchema = z.object({ siRequestorEmails: z.string().nullable() }).partial();
export type UpdateShippingInstructionsNotificationEmailsDto = z.infer<typeof UpdateShippingInstructionsNotificationEmailsDtoSchema>;

/** 
 * UpdateShippingInstructionsRequestDtoSchema 
 * @type { object }
 * @property { string } date Date 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsHeaderDto } header Header 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsGeneralDetailsDto } generalDetails General details 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsReferencesDto } references References 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsTransportDto } transport Transport 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsCustomsComplianceDto } customsCompliance Customs compliance 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsIcs2Dto } ics2 ICS2 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsCargoIdentificationNumbersDto } cargoIdentificationNumbers Cargo identification numbers 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsCargoDto[] } cargo Cargo 
 * @property { ShippingInstructionsModels.UpdateFreightChargesDto } freightCharges  
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsShippersDeclaredValueDto } shippersDeclaredValue Shipper's declared value 
 * @property { ShippingInstructionsModels.UpdateShippingInstructionsNotificationEmailsDto } notificationEmails Notification emails 
 */
export const UpdateShippingInstructionsRequestDtoSchema = z.object({ date: z.iso.datetime({ offset: true }).nullable(), header: UpdateShippingInstructionsHeaderDtoSchema.nullable(), generalDetails: UpdateShippingInstructionsGeneralDetailsDtoSchema.nullable(), references: UpdateShippingInstructionsReferencesDtoSchema.nullable(), transport: UpdateShippingInstructionsTransportDtoSchema.nullable(), customsCompliance: UpdateShippingInstructionsCustomsComplianceDtoSchema.nullable(), ics2: UpdateShippingInstructionsIcs2DtoSchema.nullable(), cargoIdentificationNumbers: UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema.nullable(), cargo: z.array(UpdateShippingInstructionsCargoDtoSchema).nullable(), freightCharges: UpdateFreightChargesDtoSchema.nullable(), shippersDeclaredValue: UpdateShippingInstructionsShippersDeclaredValueDtoSchema.nullable(), notificationEmails: UpdateShippingInstructionsNotificationEmailsDtoSchema.nullable() }).partial();
export type UpdateShippingInstructionsRequestDto = z.infer<typeof UpdateShippingInstructionsRequestDtoSchema>;

/** 
 * EmployeeAccountEmploymentDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountEmploymentDtoSchema = z.object({ officeId: z.string(), officeName: z.string() });
export type EmployeeAccountEmploymentDto = z.infer<typeof EmployeeAccountEmploymentDtoSchema>;

/** 
 * EmployeeAccountPrimaryOfficeDtoSchema 
 * @type { object }
 * @property { string } officeId Office ID 
 * @property { string } officeName Office name 
 */
export const EmployeeAccountPrimaryOfficeDtoSchema = z.object({ officeId: z.string(), officeName: z.string() });
export type EmployeeAccountPrimaryOfficeDto = z.infer<typeof EmployeeAccountPrimaryOfficeDtoSchema>;

/** 
 * EmployeeAccountRoleDtoSchema 
 * @type { object }
 * @property { string } name Role name 
 * @property { string[] } permissions Role permissions 
 * @property { string } officeId Office ID 
 */
export const EmployeeAccountRoleDtoSchema = z.object({ name: z.string(), permissions: z.array(z.string()), officeId: z.string().nullish() });
export type EmployeeAccountRoleDto = z.infer<typeof EmployeeAccountRoleDtoSchema>;

/** 
 * EmployeeAccountDtoSchema 
 * @type { object }
 * @property { string } defaultUrl  
 * @property { string } costCenter  
 * @property { LocaleEnum } locale  
 * @property { array[] } aclRules Can hold any type of value 
 * @property { object } settings Employee settings keyed by setting name 
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { EmployeeAccountModels.EmployeeAccountEmploymentDto[] } employments Employments 
 * @property { EmployeeAccountModels.EmployeeAccountPrimaryOfficeDto } primaryOffice Primary office 
 * @property { EmployeeAccountModels.EmployeeAccountRoleDto[] } roles Roles 
 */
export const EmployeeAccountDtoSchema = z.object({ defaultUrl: z.string().nullish(), costCenter: z.string().nullish(), locale: CommonModels.LocaleEnumSchema.nullish(), aclRules: z.array(z.array(z.any())), settings: z.union([z.object({}).catchall(z.any()), z.array(z.object({}).catchall(z.any())), z.string(), z.array(z.string()), z.array(z.number())]), id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), employments: z.array(EmployeeAccountEmploymentDtoSchema), primaryOffice: EmployeeAccountPrimaryOfficeDtoSchema, roles: z.array(EmployeeAccountRoleDtoSchema) });
export type EmployeeAccountDto = z.infer<typeof EmployeeAccountDtoSchema>;

/** 
 * EmployeeProfileResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } firstName Employee first name 
 * @property { string } lastName Employee last name 
 * @property { string } email Employee email 
 * @property { string } phone Employee phone number 
 * @property { string } defaultUrl Employee default URL 
 * @property { LocaleEnum } locale Employee locale 
 */
export const EmployeeProfileResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.string(), phone: z.string().nullish(), defaultUrl: z.string().nullish(), locale: CommonModels.LocaleEnumSchema.nullish() });
export type EmployeeProfileResponseDTO = z.infer<typeof EmployeeProfileResponseDTOSchema>;

/** 
 * UpdateEmployeeProfileRequestDTOSchema 
 * @type { object }
 * @property { string } firstName Employee first name. Example: `John` 
 * @property { string } lastName Employee last name. Example: `Doe` 
 * @property { string } email Employee email address. Example: `john.doe@example.com` 
 * @property { string } phone Employee phone number. Example: `+1234567890` 
 * @property { string } defaultUrl Default URL for the employee profile. Example: `https://example.com` 
 * @property { string } costCenter Employee cost center 
 * @property { LocaleEnum } locale Employee locale preference. Example: `en-US` 
 */
export const UpdateEmployeeProfileRequestDTOSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.email().nullable(), phone: z.string().nullable(), defaultUrl: z.url().nullable(), costCenter: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullable() }).partial();
export type UpdateEmployeeProfileRequestDTO = z.infer<typeof UpdateEmployeeProfileRequestDTOSchema>;

/** 
 * EmployeeRoleContextSchema 
 * @type { enum }
 */
export const EmployeeRoleContextSchema = z.enum(["global", "office"]);
export type EmployeeRoleContext = z.infer<typeof EmployeeRoleContextSchema>;
export const EmployeeRoleContext = EmployeeRoleContextSchema.enum;

/** 
 * EmployeeRoleResponseSchema 
 * @type { object }
 * @property { string } id Unique identifier of the role 
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string } context Role context 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmployeeRoleResponseSchema = z.object({ id: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema.nullish(), permissions: z.array(z.string()) });
export type EmployeeRoleResponse = z.infer<typeof EmployeeRoleResponseSchema>;

/** 
 * EmploymentEmployeeResponseSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { boolean } archived Archived 
 * @property { EmployeeRoleResponse[] } roles Global Roles 
 */
export const EmploymentEmployeeResponseSchema = z.object({ id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), archived: z.boolean().nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).nullish() });
export type EmploymentEmployeeResponse = z.infer<typeof EmploymentEmployeeResponseSchema>;

/** 
 * EmployeeOfficeResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeOfficeResponseSchema = z.object({ id: z.string(), name: z.string() });
export type EmployeeOfficeResponse = z.infer<typeof EmployeeOfficeResponseSchema>;

/** 
 * EmploymentResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { EmployeeOfficeResponse } office  
 * @property { string } employeeId  
 * @property { EmploymentEmployeeResponse } employee  
 * @property { boolean } archived  
 * @property { string } costCenter  
 * @property { EmployeeRoleResponse[] } roles Employment Roles 
 */
export const EmploymentResponseSchema = z.object({ id: z.string(), officeId: z.string(), office: CommonModels.EmployeeOfficeResponseSchema.nullish(), employeeId: z.string(), employee: CommonModels.EmploymentEmployeeResponseSchema.nullish(), archived: z.boolean(), costCenter: z.string().nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).nullish() });
export type EmploymentResponse = z.infer<typeof EmploymentResponseSchema>;

/** 
 * EmployeeResponseSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { LocaleEnum } locale  
 * @property { string } phone Phone number 
 * @property { boolean } archived Archived 
 * @property { string } primaryOfficeId Primary office id 
 * @property { EmployeeOfficeResponse } primaryOffice Primary office 
 * @property { EmploymentResponse[] } employments Employments 
 * @property { EmployeeRoleResponse[] } roles Global Roles 
 * @property { string } createdAt  
 * @property { string } updatedAt  
 */
export const EmployeeResponseSchema = z.object({ id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), locale: CommonModels.LocaleEnumSchema.nullish(), phone: z.string().nullish(), archived: z.boolean().nullish(), primaryOfficeId: z.string().nullish(), primaryOffice: CommonModels.EmployeeOfficeResponseSchema.nullish(), employments: z.array(CommonModels.EmploymentResponseSchema).nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }) });
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;

/** 
 * EmployeeCreateRequestSchema 
 * @type { object }
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { LocaleEnum } locale  
 * @property { string } primaryOfficeId Primary office ID 
 * @property { string } phone Phone number 
 */
export const EmployeeCreateRequestSchema = z.object({ firstName: z.string(), lastName: z.string(), email: z.email(), locale: CommonModels.LocaleEnumSchema.nullish(), primaryOfficeId: z.string().nullish(), phone: z.string().nullish() });
export type EmployeeCreateRequest = z.infer<typeof EmployeeCreateRequestSchema>;

/** 
 * EmployeeOneStepCreateEmploymentRequestSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string[] } roleIds Array of office role IDs 
 */
export const EmployeeOneStepCreateEmploymentRequestSchema = z.object({ officeId: z.string(), roleIds: z.array(z.string()).nullish() });
export type EmployeeOneStepCreateEmploymentRequest = z.infer<typeof EmployeeOneStepCreateEmploymentRequestSchema>;

/** 
 * EmployeeOneStepCreateRequestSchema 
 * @type { object }
 * @property { LocaleEnum } locale  
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { string } phone Phone number 
 * @property { string[] } roleIds Array of global role IDs 
 * @property { string } primaryOfficeId Primary office ID 
 * @property { EmployeeModels.EmployeeOneStepCreateEmploymentRequest[] } employments Employments. Min Items: `1` 
 */
export const EmployeeOneStepCreateRequestSchema = z.object({ locale: CommonModels.LocaleEnumSchema.nullish(), firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string().nullish(), roleIds: z.array(z.string()).nullish(), primaryOfficeId: z.string().nullish(), employments: z.array(EmployeeOneStepCreateEmploymentRequestSchema).min(1) });
export type EmployeeOneStepCreateRequest = z.infer<typeof EmployeeOneStepCreateRequestSchema>;

/** 
 * EmployeeUpdateRequestSchema 
 * @type { object }
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number of the employee 
 * @property { LocaleEnum } locale  
 * @property { string } primaryOfficeId  
 */
export const EmployeeUpdateRequestSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), phone: z.string().nullable(), locale: CommonModels.LocaleEnumSchema.nullable(), primaryOfficeId: z.string().nullable() }).partial();
export type EmployeeUpdateRequest = z.infer<typeof EmployeeUpdateRequestSchema>;

/** 
 * CustomerCompanyDtoSchema 
 * @type { object }
 * @property { string } id Company ID 
 * @property { string } name Company name 
 */
export const CustomerCompanyDtoSchema = z.object({ id: z.string(), name: z.string().nullish() });
export type CustomerCompanyDto = z.infer<typeof CustomerCompanyDtoSchema>;

/** 
 * CustomerBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id Company ID 
 * @property { string } name Company name 
 */
export const CustomerBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerBusinessPartnerDto = z.infer<typeof CustomerBusinessPartnerDtoSchema>;

/** 
 * CustomerAccountDtoSchema 
 * @type { object }
 * @property { array[] } aclRules Can hold any type of value 
 * @property { string } id Customer ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { CustomerAccountModels.CustomerCompanyDto } company Company 
 * @property { CustomerAccountModels.CustomerBusinessPartnerDto } businessPartner  
 */
export const CustomerAccountDtoSchema = z.object({ aclRules: z.array(z.array(z.any())), id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), company: CustomerCompanyDtoSchema.nullish(), businessPartner: CustomerBusinessPartnerDtoSchema.nullish() });
export type CustomerAccountDto = z.infer<typeof CustomerAccountDtoSchema>;

/** 
 * CustomerProfileBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerProfileBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerProfileBusinessPartnerDto = z.infer<typeof CustomerProfileBusinessPartnerDtoSchema>;

/** 
 * CustomerProfileResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 * @property { CustomersModels.CustomerProfileBusinessPartnerDto } businessPartner  
 */
export const CustomerProfileResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), businessPartner: CustomerProfileBusinessPartnerDtoSchema.nullish() });
export type CustomerProfileResponseDTO = z.infer<typeof CustomerProfileResponseDTOSchema>;

/** 
 * CustomerBusinessPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerBusinessPartnerResponseDto = z.infer<typeof CustomerBusinessPartnerResponseDtoSchema>;

/** 
 * CustomerResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company Id of the customer 
 * @property { string } businessPartnerId Business partner Id of the customer 
 * @property { boolean } archived Wether the customer is archived 
 * @property { CustomersModels.CustomerBusinessPartnerResponseDto } businessPartner  
 */
export const CustomerResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), archived: z.boolean(), businessPartner: CustomerBusinessPartnerResponseDtoSchema.nullish() });
export type CustomerResponseDTO = z.infer<typeof CustomerResponseDTOSchema>;

/** 
 * CustomerListItemBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerListItemBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerListItemBusinessPartnerDto = z.infer<typeof CustomerListItemBusinessPartnerDtoSchema>;

/** 
 * CustomerListItemDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 * @property { CustomersModels.CustomerListItemBusinessPartnerDto } businessPartner  
 */
export const CustomerListItemDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.string(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), businessPartner: CustomerListItemBusinessPartnerDtoSchema.nullish() });
export type CustomerListItemDTO = z.infer<typeof CustomerListItemDTOSchema>;

/** 
 * QuoteStatusEnumSchema 
 * @type { enum }
 */
export const QuoteStatusEnumSchema = z.enum(["Pending", "Cancelled", "Converted"]);
export type QuoteStatusEnum = z.infer<typeof QuoteStatusEnumSchema>;
export const QuoteStatusEnum = QuoteStatusEnumSchema.enum;

/** 
 * LoadTypeEnumSchema 
 * @type { enum }
 */
export const LoadTypeEnumSchema = z.enum(["LCL", "FCL", "Trailer", "Container", "BreakBulk", "Roro", "MAFI", "LTL_ROAD", "FTL_ROAD", "Standard"]);
export type LoadTypeEnum = z.infer<typeof LoadTypeEnumSchema>;
export const LoadTypeEnum = LoadTypeEnumSchema.enum;

/** 
 * QuoteCustomerResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 * @property { string } phone The phone number of the customer 
 * @property { string } email The email of the customer 
 */
export const QuoteCustomerResponseDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), phone: z.string().nullish(), email: z.string().nullish() });
export type QuoteCustomerResponseDto = z.infer<typeof QuoteCustomerResponseDtoSchema>;

/** 
 * QuoteNamedReferenceResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the entity 
 * @property { string } name Name of the entity 
 * @property { string } matchCode  
 * @property { string } label Display label (name or match code depending on office settings) 
 */
export const QuoteNamedReferenceResponseDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), matchCode: z.string().nullable(), label: z.string().nullable() }).partial();
export type QuoteNamedReferenceResponseDto = z.infer<typeof QuoteNamedReferenceResponseDtoSchema>;

/** 
 * ServiceTypeEnumSchema 
 * @type { enum }
 */
export const ServiceTypeEnumSchema = z.enum(["InlandTransport", "DoorToPortOfDischarge", "PortOfLoadingToDoor", "DoorToDoor", "PortToPort", "DoorToAirport", "AirportToAirport", "AirportToDoor", "PortOfDischargeRampToDoor"]);
export type ServiceTypeEnum = z.infer<typeof ServiceTypeEnumSchema>;
export const ServiceTypeEnum = ServiceTypeEnumSchema.enum;

/** 
 * SeaRoutingEnumSchema 
 * @type { enum }
 */
export const SeaRoutingEnumSchema = z.enum(["Direct", "Transhipment"]);
export type SeaRoutingEnum = z.infer<typeof SeaRoutingEnumSchema>;
export const SeaRoutingEnum = SeaRoutingEnumSchema.enum;

/** 
 * QuotePreviewResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the quote 
 * @property { TransportModeEnum } transportMode Transport mode 
 * @property { string } statusDate The date of the quote status 
 * @property { string } createdAt The date when the quote was created 
 * @property { string } number The quote number 
 * @property { QuotesModels.QuoteStatusEnum } status Status of the quote 
 * @property { DirectionEnum } direction Direction of the quote 
 * @property { LoadTypeEnum } loadType Load type 
 * @property { QuotesModels.QuoteCustomerResponseDto } customer The customer information 
 * @property { string } customerReference Customer reference number 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } consignee Consignee information 
 * @property { string } consigneeReference Consignee reference number 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } carrier The carrier 
 * @property { string } carrierReference Carrier reference number 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } employee Responsible employee 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } origin Origin location 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } destination Destination location 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } portOfLoading Port of loading 
 * @property { QuotesModels.QuoteNamedReferenceResponseDto } dischargePort Discharge port 
 * @property { string } bookingNumber Booking reference number 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } vesselCarrier Carrier name from route point (sea positions only) 
 * @property { string } equipment Equipment summary (e.g., "2x20DC, 1x40HC") 
 * @property { ServiceTypeEnum } serviceType Service type 
 * @property { string } currency Currency code 
 * @property { number } profit Total profit 
 * @property { number } margin Profit margin percentage 
 * @property { number } numberOfConvertedPositions Number of positions converted from this quote 
 * @property { string } departureDate Departure date 
 * @property { string } arrivalDate Arrival date 
 * @property { SeaRoutingEnum } routing Sea routing type 
 */
export const QuotePreviewResponseDTOSchema = z.object({ id: z.string(), transportMode: CommonModels.TransportModeEnumSchema, statusDate: z.iso.datetime({ offset: true }).nullable(), createdAt: z.iso.datetime({ offset: true }), number: z.string(), status: QuoteStatusEnumSchema, direction: CommonModels.DirectionEnumSchema, loadType: CommonModels.LoadTypeEnumSchema.nullish(), customer: QuoteCustomerResponseDtoSchema, customerReference: z.string().nullish(), consignee: QuoteNamedReferenceResponseDtoSchema.nullish(), consigneeReference: z.string().nullish(), carrier: QuoteNamedReferenceResponseDtoSchema.nullish(), carrierReference: z.string().nullish(), employee: QuoteNamedReferenceResponseDtoSchema.nullish(), origin: QuoteNamedReferenceResponseDtoSchema, destination: QuoteNamedReferenceResponseDtoSchema, portOfLoading: QuoteNamedReferenceResponseDtoSchema.nullish(), dischargePort: QuoteNamedReferenceResponseDtoSchema.nullish(), bookingNumber: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), vesselCarrier: z.string().nullish(), equipment: z.string().nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), currency: z.string().nullish(), profit: z.number().nullish(), margin: z.number().nullish(), numberOfConvertedPositions: z.number(), departureDate: z.iso.datetime({ offset: true }).nullish(), arrivalDate: z.iso.datetime({ offset: true }).nullish(), routing: CommonModels.SeaRoutingEnumSchema.nullish() });
export type QuotePreviewResponseDTO = z.infer<typeof QuotePreviewResponseDTOSchema>;

/** 
 * DateRangeDtoSchema 
 * @type { object }
 * @property { string } start  
 * @property { string } end  
 */
export const DateRangeDtoSchema = z.object({ start: z.iso.datetime({ offset: true }).nullable(), end: z.iso.datetime({ offset: true }).nullable() }).partial();
export type DateRangeDto = z.infer<typeof DateRangeDtoSchema>;

/** 
 * QuoteFilterDtoSchema 
 * @type { object }
 * @property { DateRangeDto } statusDate  
 * @property { TransportModeEnum } transportMode  
 * @property { QuotesModels.QuoteStatusEnum[] } status  
 * @property { DirectionEnum } direction  
 * @property { LoadTypeEnum } loadType  
 * @property { ServiceTypeEnum } serviceType  
 * @property { string[] } carrierId Filter quotes by carrier IDs 
 * @property { string[] } consigneeId Filter quotes by consignee IDs 
 * @property { string[] } employee Filter quotes by employee IDs 
 * @property { SeaRoutingEnum } routing  
 * @property { string } number Filter quotes by quote number 
 * @property { DateRangeDto } createdAt  
 * @property { string } vesselCarrier Filter quotes by carrier name from route point 
 * @property { string } searchQuery  
 * @property { string[] } customer  
 */
export const QuoteFilterDtoSchema = z.object({ statusDate: CommonModels.DateRangeDtoSchema.nullable(), transportMode: CommonModels.TransportModeEnumSchema.nullable(), status: z.array(QuoteStatusEnumSchema).nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), carrierId: z.array(z.string()).nullable(), consigneeId: z.array(z.string()).nullable(), employee: z.array(z.string()).nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), number: z.string().nullable(), createdAt: CommonModels.DateRangeDtoSchema.nullable(), vesselCarrier: z.string().nullable(), searchQuery: z.string().nullable(), customer: z.array(z.string()).nullable() }).partial();
export type QuoteFilterDto = z.infer<typeof QuoteFilterDtoSchema>;

/** 
 * BusinessPartnerLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema) });
export type BusinessPartnerLabelResponseDTO = z.infer<typeof BusinessPartnerLabelResponseDTOSchema>;

/** 
 * QuoteExportFilterDtoSchema 
 * @type { object }
 * @property { DateRangeDto } statusDate  
 * @property { TransportModeEnum } transportMode  
 * @property { QuotesModels.QuoteStatusEnum[] } status  
 * @property { DirectionEnum } direction  
 * @property { string } searchQuery  
 * @property { string[] } customer  
 */
export const QuoteExportFilterDtoSchema = z.object({ statusDate: CommonModels.DateRangeDtoSchema.nullable(), transportMode: CommonModels.TransportModeEnumSchema.nullable(), status: z.array(QuoteStatusEnumSchema).nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), searchQuery: z.string().nullable(), customer: z.array(z.string()).nullable() }).partial();
export type QuoteExportFilterDto = z.infer<typeof QuoteExportFilterDtoSchema>;

/** 
 * QuoteExportColumnSchema 
 * @type { enum }
 */
export const QuoteExportColumnSchema = z.enum(["id", "transportMode", "statusDate", "createdAt", "number", "status", "direction", "loadType", "serviceType", "customerId", "customerName", "customerPhone", "customerEmail", "customerReference", "consigneeId", "consigneeName", "consigneeReference", "carrierId", "carrierName", "carrierReference", "responsibleEmployeeName", "originLocationId", "originLocationName", "destinationLocationId", "destinationLocationName", "portOfLoadingId", "portOfLoadingName", "dischargePortId", "dischargePortName", "bookingNumber", "vessel", "voyage", "equipment", "departureDate", "arrivalDate", "routing", "currency", "profit", "margin"]);
export type QuoteExportColumn = z.infer<typeof QuoteExportColumnSchema>;
export const QuoteExportColumn = QuoteExportColumnSchema.enum;

/** 
 * QuoteExportRequestDtoSchema 
 * @type { object }
 * @property { QuotesModels.QuoteExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { QuotesModels.QuoteExportFilterDto } filter  
 */
export const QuoteExportRequestDtoSchema = z.object({ columns: z.array(QuoteExportColumnSchema).min(1).nullable(), order: z.array(z.string()).nullable(), filter: QuoteExportFilterDtoSchema.nullable() }).partial();
export type QuoteExportRequestDto = z.infer<typeof QuoteExportRequestDtoSchema>;

/** 
 * SectionEnumSchema 
 * @type { enum }
 */
export const SectionEnumSchema = z.enum(["Logistics"]);
export type SectionEnum = z.infer<typeof SectionEnumSchema>;
export const SectionEnum = SectionEnumSchema.enum;

/** 
 * CreateQuoteRequestDTOSchema 
 * @type { object }
 * @property { SectionEnum } section The section of the quote 
 * @property { DirectionEnum } direction The direction of the quote 
 * @property { TransportModeEnum } transportMode The mode of transport for the quote 
 * @property { LoadTypeEnum } loadType The load type for the quote 
 * @property { ServiceTypeEnum } serviceType The service type for the quote 
 * @property { string } customerBusinessPartnerId The ID of the business partner that is the customer 
 */
export const CreateQuoteRequestDTOSchema = z.object({ section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, loadType: CommonModels.LoadTypeEnumSchema, serviceType: CommonModels.ServiceTypeEnumSchema, customerBusinessPartnerId: z.string() });
export type CreateQuoteRequestDTO = z.infer<typeof CreateQuoteRequestDTOSchema>;

/** 
 * QuoteSeaDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 * @property { SeaRoutingEnum } routing Sea routing type 
 */
export const QuoteSeaDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable() }).partial();
export type QuoteSeaDetailsDto = z.infer<typeof QuoteSeaDetailsDtoSchema>;

/** 
 * QuoteCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const QuoteCustomerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type QuoteCustomerDto = z.infer<typeof QuoteCustomerDtoSchema>;

/** 
 * QuoteEmployeeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the employee 
 * @property { string } name Name of the employee 
 */
export const QuoteEmployeeResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
export type QuoteEmployeeResponseDTO = z.infer<typeof QuoteEmployeeResponseDTOSchema>;

/** 
 * CargoTypeEnumSchema 
 * @type { enum }
 */
export const CargoTypeEnumSchema = z.enum(["Trailer", "Container", "BreakBulk", "Roro", "Project"]);
export type CargoTypeEnum = z.infer<typeof CargoTypeEnumSchema>;
export const CargoTypeEnum = CargoTypeEnumSchema.enum;

/** 
 * FrequencyEnumSchema 
 * @type { enum }
 */
export const FrequencyEnumSchema = z.enum(["Daily", "Weekly", "Monthly"]);
export type FrequencyEnum = z.infer<typeof FrequencyEnumSchema>;
export const FrequencyEnum = FrequencyEnumSchema.enum;

/** 
 * QuoteTypeEnumSchema 
 * @type { enum }
 */
export const QuoteTypeEnumSchema = z.enum(["Sea", "Road", "Air"]);
export type QuoteTypeEnum = z.infer<typeof QuoteTypeEnumSchema>;
export const QuoteTypeEnum = QuoteTypeEnumSchema.enum;

/** 
 * QuoteConvertedPositionDtoSchema 
 * @type { object }
 * @property { string } positionId  
 * @property { string } positionNumber  
 */
export const QuoteConvertedPositionDtoSchema = z.object({ positionId: z.string(), positionNumber: z.string() });
export type QuoteConvertedPositionDto = z.infer<typeof QuoteConvertedPositionDtoSchema>;

/** 
 * QuoteRoadDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 */
export const QuoteRoadDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable() }).partial();
export type QuoteRoadDetailsDto = z.infer<typeof QuoteRoadDetailsDtoSchema>;

/** 
 * QuoteAirDetailsDtoSchema 
 * @type { object }
 * @property { boolean } isCourier Whether this quote is courier transport 
 */
export const QuoteAirDetailsDtoSchema = z.object({ isCourier: z.boolean().nullable() }).partial();
export type QuoteAirDetailsDto = z.infer<typeof QuoteAirDetailsDtoSchema>;

/** 
 * QuoteCoreResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the quote 
 * @property { string } rootFolderId Root folder identifier bound to this quote 
 * @property { QuotesModels.QuoteCustomerDto } customer  
 * @property { QuotesModels.QuoteStatusEnum } status Current status of the quote 
 * @property { string } responsibleEmployeeId Unique identifier of the responsible employee 
 * @property { string } receivedByEmployeeId Unique identifier of the employee receiving the quote 
 * @property { ServiceTypeEnum } serviceType  
 * @property { string } salesRepId Unique identifier of the sales rep 
 * @property { QuotesModels.QuoteEmployeeResponseDTO } responsibleEmployee The responsible employee 
 * @property { QuotesModels.QuoteEmployeeResponseDTO } receivedByEmployee The employee who received the quote 
 * @property { string } owningOfficeId ID of the office owning the quote 
 * @property { string } name Name of the quote 
 * @property { string } number Quote number 
 * @property { SectionEnum } section Section of the quote 
 * @property { DirectionEnum } direction Direction of the quote 
 * @property { TransportModeEnum } transportMode Mode of transport 
 * @property { string } statusDate Date of the quote status 
 * @property { QuotesModels.CargoTypeEnum } cargoType Type of cargo 
 * @property { IncotermsEnum } incoterms Incoterms for the quote 
 * @property { IncotermsEnum } secondIncoterms Second incoterms for the quote 
 * @property { string } buyRateReference Reference for buy rate 
 * @property { FrequencyEnum } frequency Frequency of the quote 
 * @property { string } transitDurationInDays Transit duration in days 
 * @property { QuotesModels.QuoteTypeEnum } quoteType Type of quote 
 * @property { string } defaultCurrencyId Default currency 
 * @property { QuotesModels.QuoteEmployeeResponseDTO } salesRep The sales rep for the quote 
 * @property { string } team Team 
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { QuotesModels.QuoteConvertedPositionDto[] } convertedPositions Positions converted from this quote. Default: `` 
 * @property { LoadTypeEnum } loadType Load type of quote 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 * @property { QuotesModels.QuoteRoadDetailsDto } roadDetails Road-specific quote overview details 
 * @property { QuotesModels.QuoteAirDetailsDto } airDetails Air-specific quote overview details 
 * @property { QuotesModels.QuoteSeaDetailsDto } seaDetails Sea-specific quote overview details 
 */
export const QuoteCoreResponseDTOSchema = z.object({ id: z.string(), rootFolderId: z.string().nullish(), customer: QuoteCustomerDtoSchema.nullish(), status: QuoteStatusEnumSchema, responsibleEmployeeId: z.string().nullish(), receivedByEmployeeId: z.string().nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), salesRepId: z.string().nullish(), responsibleEmployee: QuoteEmployeeResponseDTOSchema.nullish(), receivedByEmployee: QuoteEmployeeResponseDTOSchema.nullish(), owningOfficeId: z.string(), name: z.string(), number: z.string(), section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, statusDate: z.iso.datetime({ offset: true }), cargoType: CargoTypeEnumSchema.nullish(), incoterms: CommonModels.IncotermsEnumSchema.nullish(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullish(), buyRateReference: z.string().nullish(), frequency: CommonModels.FrequencyEnumSchema.nullish(), transitDurationInDays: z.string().nullish(), quoteType: QuoteTypeEnumSchema.nullish(), defaultCurrencyId: z.string().nullish(), salesRep: QuoteEmployeeResponseDTOSchema.nullish(), team: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), convertedPositions: z.array(QuoteConvertedPositionDtoSchema).default([]), loadType: CommonModels.LoadTypeEnumSchema.nullish(), volumetricWeightModifier: z.number().nullish(), roadDetails: QuoteRoadDetailsDtoSchema.nullish(), airDetails: QuoteAirDetailsDtoSchema.nullish(), seaDetails: QuoteSeaDetailsDtoSchema.nullish() });
export type QuoteCoreResponseDTO = z.infer<typeof QuoteCoreResponseDTOSchema>;

/** 
 * UpdateQuoteSeaDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 * @property { SeaRoutingEnum } routing Sea routing type 
 */
export const UpdateQuoteSeaDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable() }).partial();
export type UpdateQuoteSeaDetailsDto = z.infer<typeof UpdateQuoteSeaDetailsDtoSchema>;

/** 
 * UpdateQuoteRoadDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 */
export const UpdateQuoteRoadDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable() }).partial();
export type UpdateQuoteRoadDetailsDto = z.infer<typeof UpdateQuoteRoadDetailsDtoSchema>;

/** 
 * UpdateQuoteAirDetailsDtoSchema 
 * @type { object }
 * @property { boolean } isCourier Whether this quote is courier transport 
 */
export const UpdateQuoteAirDetailsDtoSchema = z.object({ isCourier: z.boolean().nullable() }).partial();
export type UpdateQuoteAirDetailsDto = z.infer<typeof UpdateQuoteAirDetailsDtoSchema>;

/** 
 * UpdateQuoteRequestDTOSchema 
 * @type { object }
 * @property { string } number The quote number 
 * @property { string } statusDate The date of the quote status 
 * @property { QuotesModels.CargoTypeEnum } cargoType The type of cargo for the quote 
 * @property { LoadTypeEnum } loadType The load type for the quote 
 * @property { IncotermsEnum } incoterms The incoterms for the quote 
 * @property { IncotermsEnum } secondIncoterms The second incoterms for the quote 
 * @property { ServiceTypeEnum } serviceType The type of service for the quote 
 * @property { string } buyRateReference The reference for the buy rate 
 * @property { FrequencyEnum } frequency The frequency of the quote 
 * @property { string } transitDurationInDays The transit duration in days 
 * @property { QuotesModels.QuoteTypeEnum } quoteType The type of quote 
 * @property { string } defaultCurrencyId The default currency for the quote 
 * @property { string } salesRepId The sales representative for the quote 
 * @property { string } responsibleEmployeeId The responsible employee for the quote 
 * @property { string } receivedByEmployeeId The employee who receieved the quote 
 * @property { string } team The team responsible for the quote 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 * @property { QuotesModels.UpdateQuoteRoadDetailsDto } roadDetails Road-specific quote overview details 
 * @property { QuotesModels.UpdateQuoteAirDetailsDto } airDetails Air-specific quote overview details 
 * @property { QuotesModels.UpdateQuoteSeaDetailsDto } seaDetails Sea-specific quote overview details 
 */
export const UpdateQuoteRequestDTOSchema = z.object({ number: z.string().nullable(), statusDate: z.iso.datetime({ offset: true }).nullable(), cargoType: CargoTypeEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), incoterms: CommonModels.IncotermsEnumSchema.nullable(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), buyRateReference: z.string().nullable(), frequency: CommonModels.FrequencyEnumSchema.nullable(), transitDurationInDays: z.string().nullable(), quoteType: QuoteTypeEnumSchema.nullable(), defaultCurrencyId: z.string().nullable(), salesRepId: z.string().nullable(), responsibleEmployeeId: z.string().nullable(), receivedByEmployeeId: z.string().nullable(), team: z.string().nullable(), volumetricWeightModifier: z.number().nullable(), roadDetails: UpdateQuoteRoadDetailsDtoSchema.nullable(), airDetails: UpdateQuoteAirDetailsDtoSchema.nullable(), seaDetails: UpdateQuoteSeaDetailsDtoSchema.nullable() }).partial();
export type UpdateQuoteRequestDTO = z.infer<typeof UpdateQuoteRequestDTOSchema>;

/** 
 * QuoteSectionEnumSchema 
 * @type { enum }
 */
export const QuoteSectionEnumSchema = z.enum(["Customer", "Overview", "Cargo", "Finances", "Documents"]);
export type QuoteSectionEnum = z.infer<typeof QuoteSectionEnumSchema>;
export const QuoteSectionEnum = QuoteSectionEnumSchema.enum;

/** 
 * DuplicateQuoteRequestDtoSchema 
 * @type { object }
 * @property { QuotesModels.QuoteSectionEnum[] } sections The sections to duplicate. Min Items: `1` 
 */
export const DuplicateQuoteRequestDtoSchema = z.object({ sections: z.array(QuoteSectionEnumSchema).min(1) });
export type DuplicateQuoteRequestDto = z.infer<typeof DuplicateQuoteRequestDtoSchema>;

/** 
 * QuoteAccountItemTypeEnumSchema 
 * @type { enum }
 */
export const QuoteAccountItemTypeEnumSchema = z.enum(["CHARGE", "TEXT", "DIVIDER"]);
export type QuoteAccountItemTypeEnum = z.infer<typeof QuoteAccountItemTypeEnumSchema>;
export const QuoteAccountItemTypeEnum = QuoteAccountItemTypeEnumSchema.enum;

/** 
 * QuoteChargeDtoResponseSchema 
 * @type { object }
 * @property { object } chargeType  
 * @property { string } chargeType.id  
 * @property { string } chargeType.name  
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { object } buyVatRule  
 * @property { string } buyVatRule.id  
 * @property { string } buyVatRule.name  
 * @property { string } buyVatRule.matchcode  
 * @property { string } buyVatRule.printCode  
 * @property { object } vendor  
 * @property { string } vendor.id  
 * @property { string } vendor.name  
 * @property { string } vendor.matchCode  
 * @property { string } vendor.label  
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { object } sellVatRule  
 * @property { string } sellVatRule.id  
 * @property { string } sellVatRule.name  
 * @property { string } sellVatRule.matchcode  
 * @property { string } sellVatRule.printCode  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 * @property { number } profit Profit amount 
 */
export const QuoteChargeDtoResponseSchema = z.object({ chargeType: z.object({ id: z.string(), name: z.string() }), additionalText: z.string(), quantity: z.number().nullish(), buyRate: z.number().nullish(), buyCurrencyCode: z.string(), buyVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() }), vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }), buyExchangeRate: z.number().nullish(), sellRate: z.number().nullish(), sellCurrencyCode: z.string(), sellVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() }), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }), sellExchangeRate: z.number().nullish(), profit: z.number().nullish() });
export type QuoteChargeDtoResponse = z.infer<typeof QuoteChargeDtoResponseSchema>;

/** 
 * QuoteTextDtoResponseSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const QuoteTextDtoResponseSchema = z.object({ content: z.string() });
export type QuoteTextDtoResponse = z.infer<typeof QuoteTextDtoResponseSchema>;

/** 
 * QuoteAccountItemDtoResponseSchema 
 * @type { object }
 * @property { string } id Item ID 
 * @property { QuoteAccountModels.QuoteAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { QuoteAccountModels.QuoteChargeDtoResponse } charge Charge data if type is CHARGE 
 * @property { QuoteAccountModels.QuoteTextDtoResponse } text Text data if type is TEXT 
 */
export const QuoteAccountItemDtoResponseSchema = z.object({ id: z.string(), type: QuoteAccountItemTypeEnumSchema, orderPosition: z.number(), charge: QuoteChargeDtoResponseSchema.nullish(), text: QuoteTextDtoResponseSchema.nullish() });
export type QuoteAccountItemDtoResponse = z.infer<typeof QuoteAccountItemDtoResponseSchema>;

/** 
 * QuoteAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id Account ID 
 * @property { string } quoteId Quote ID 
 * @property { QuoteAccountModels.QuoteAccountItemDtoResponse[] } items Account items 
 * @property { object } totals Account totals 
 * @property { number } totals.totalBuyRates  
 * @property { number } totals.totalSellRates  
 * @property { number } totals.totalProfit  
 * @property { number } totals.displayAmount  
 * @property { string } totals.displayCurrencyCode  
 * @property { object[] } totalsPerCurrency Account totals per currency 
 * @property { number } totalsPerCurrency.[0].totalBuyRates  
 * @property { number } totalsPerCurrency.[0].totalSellRates  
 * @property { number } totalsPerCurrency.[0].totalProfit  
 * @property { number } totalsPerCurrency.[0].displayAmount  
 * @property { string } totalsPerCurrency.[0].displayCurrencyCode  
 */
export const QuoteAccountResponseDtoSchema = z.object({ id: z.string(), quoteId: z.string(), items: z.array(QuoteAccountItemDtoResponseSchema), totals: z.object({ totalBuyRates: z.number().nullable(), totalSellRates: z.number().nullable(), totalProfit: z.number().nullable(), displayAmount: z.number().nullable(), displayCurrencyCode: z.string().nullable() }).partial(), totalsPerCurrency: z.array(z.object({ totalBuyRates: z.number().nullable(), totalSellRates: z.number().nullable(), totalProfit: z.number().nullable(), displayAmount: z.number().nullable(), displayCurrencyCode: z.string().nullable() }).partial()) });
export type QuoteAccountResponseDto = z.infer<typeof QuoteAccountResponseDtoSchema>;

/** 
 * CreateQuoteChargeDataDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1`. Default: `1` 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code. Default: `EUR` 
 * @property { string } buyVatRuleId Buy VAT rule ID 
 * @property { string } vendorId Vendor ID 
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code. Default: `EUR` 
 * @property { string } sellVatRuleId Sell VAT rule ID 
 * @property { string } customerId Customer ID 
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 */
export const CreateQuoteChargeDataDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable().default(1), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable().default("EUR"), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable().default("EUR"), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type CreateQuoteChargeDataDto = z.infer<typeof CreateQuoteChargeDataDtoSchema>;

/** 
 * CreateQuoteTextDataDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const CreateQuoteTextDataDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type CreateQuoteTextDataDto = z.infer<typeof CreateQuoteTextDataDtoSchema>;

/** 
 * CreateQuoteAccountItemRequestDtoSchema 
 * @type { object }
 * @property { QuoteAccountModels.QuoteAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { QuoteAccountModels.CreateQuoteChargeDataDto } charge Charge data if type is CHARGE 
 * @property { QuoteAccountModels.CreateQuoteTextDataDto } text Text data if type is TEXT 
 */
export const CreateQuoteAccountItemRequestDtoSchema = z.object({ type: QuoteAccountItemTypeEnumSchema, orderPosition: z.number().nullish(), charge: CreateQuoteChargeDataDtoSchema.nullish(), text: CreateQuoteTextDataDtoSchema.nullish() });
export type CreateQuoteAccountItemRequestDto = z.infer<typeof CreateQuoteAccountItemRequestDtoSchema>;

/** 
 * UpdateQuoteChargeDataDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1` 
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
export const UpdateQuoteChargeDataDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type UpdateQuoteChargeDataDto = z.infer<typeof UpdateQuoteChargeDataDtoSchema>;

/** 
 * UpdateQuoteTextDataDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const UpdateQuoteTextDataDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type UpdateQuoteTextDataDto = z.infer<typeof UpdateQuoteTextDataDtoSchema>;

/** 
 * UpdateQuoteAccountItemRequestDtoSchema 
 * @type { object }
 * @property { number } orderPosition Order position of the item 
 * @property { QuoteAccountModels.UpdateQuoteChargeDataDto } charge Charge data if type is CHARGE 
 * @property { QuoteAccountModels.UpdateQuoteTextDataDto } text Text data if type is TEXT 
 */
export const UpdateQuoteAccountItemRequestDtoSchema = z.object({ orderPosition: z.number().nullable(), charge: UpdateQuoteChargeDataDtoSchema.nullable(), text: UpdateQuoteTextDataDtoSchema.nullable() }).partial();
export type UpdateQuoteAccountItemRequestDto = z.infer<typeof UpdateQuoteAccountItemRequestDtoSchema>;

/** 
 * QuoteAccountProfitChangeGroupDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { UserPreviewDto[] } users  
 * @property { object } profit  
 * @property { number } profit.amount  
 * @property { string } profit.currencyCode  
 * @property { number } changeCount  
 */
export const QuoteAccountProfitChangeGroupDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), users: z.array(CommonModels.UserPreviewDtoSchema), profit: z.object({ amount: z.number(), currencyCode: z.string() }), changeCount: z.number() });
export type QuoteAccountProfitChangeGroupDto = z.infer<typeof QuoteAccountProfitChangeGroupDtoSchema>;

/** 
 * QuoteAccountProfitChangeEntryDtoSchema 
 * @type { object }
 * @property { string } timestamp  
 * @property { UserPreviewDto } user  
 * @property { number } changeNumber  
 * @property { number } oldProfit  
 * @property { number } newProfit  
 * @property { string } currencyCode  
 */
export const QuoteAccountProfitChangeEntryDtoSchema = z.object({ timestamp: z.iso.datetime({ offset: true }), user: CommonModels.UserPreviewDtoSchema, changeNumber: z.number(), oldProfit: z.number(), newProfit: z.number(), currencyCode: z.string() });
export type QuoteAccountProfitChangeEntryDto = z.infer<typeof QuoteAccountProfitChangeEntryDtoSchema>;

/** 
 * QuoteAccountProfitChangeGroupDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { string } currencyCode  
 * @property { QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeEntryDto[] } entries  
 */
export const QuoteAccountProfitChangeGroupDetailDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), currencyCode: z.string(), entries: z.array(QuoteAccountProfitChangeEntryDtoSchema) });
export type QuoteAccountProfitChangeGroupDetailDto = z.infer<typeof QuoteAccountProfitChangeGroupDetailDtoSchema>;

/** 
 * QuoteDocumentDataDtoSchema 
 * @type { object }
 * @property { RouteTableBlockResponseDto } routeTable  
 * @property { CargoTableBlockDto } cargoTable  
 * @property { FinanceTableBlockDto } financeTable  
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
 * @property { LocaleEnum } locale  
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
 * @property { TransportModeEnum } quoteTransportMode Mode of transport 
 * @property { FrequencyEnum } frequency Frequency of the quote 
 * @property { string } transitDurationInDays Transit duration in days 
 * @property { QuoteDocumentModels.CustomerDto } customer  
 * @property { QuoteDocumentModels.ContactDto } contact  
 * @property { QuoteDocumentModels.QuoteDocumentDataDto } data  
 * @property { boolean } suspendCargoTable  
 * @property { boolean } suspendFinanceTable  
 * @property { EditorContentResponseDto } bodyRemarks  
 * @property { EditorContentResponseDto } footerRemarks  
 * @property { boolean } isIssued  
 * @property { number } version  
 * @property { QuoteDocumentModels.QuoteDocumentConfigDto } config  
 * @property { string } issuedAt  
 */
export const QuoteDocumentResponseDtoSchema = z.object({ id: z.string(), quoteId: z.string(), quoteNumber: z.string(), quoteTransportMode: CommonModels.TransportModeEnumSchema, frequency: CommonModels.FrequencyEnumSchema.nullish(), transitDurationInDays: z.string().nullish(), customer: CustomerDtoSchema, contact: ContactDtoSchema, data: QuoteDocumentDataDtoSchema.nullish(), suspendCargoTable: z.boolean(), suspendFinanceTable: z.boolean(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), isIssued: z.boolean(), version: z.number(), config: QuoteDocumentConfigDtoSchema.nullish(), issuedAt: z.iso.datetime({ offset: true }).nullish() });
export type QuoteDocumentResponseDto = z.infer<typeof QuoteDocumentResponseDtoSchema>;

/** 
 * QuoteDocumentDataUpdateDtoSchema 
 * @type { object }
 * @property { RouteTableUpdateBlockDto } routeTable  
 * @property { CargoTableBlockUpdateDto } cargoTable  
 * @property { FinanceTableBlockUpdateDto } financeTable  
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
 * @property { QuoteDocumentModels.CustomerUpdateDto } customer  
 * @property { QuoteDocumentModels.ContactUpdateDto } contact  
 * @property { EditorContentUpdateDto } bodyRemarks  
 * @property { EditorContentUpdateDto } footerRemarks  
 * @property { boolean } suspendCargoTable  
 * @property { boolean } suspendFinanceTable  
 * @property { QuoteDocumentModels.QuoteDocumentDataUpdateDto } data  
 */
export const UpdateQuoteDocumentRequestDtoSchema = z.object({ customer: CustomerUpdateDtoSchema.nullable(), contact: ContactUpdateDtoSchema.nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), suspendCargoTable: z.boolean().nullable(), suspendFinanceTable: z.boolean().nullable(), data: QuoteDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateQuoteDocumentRequestDto = z.infer<typeof UpdateQuoteDocumentRequestDtoSchema>;

/** 
 * DunningPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label Display label: matchCode when office.usePartnerMatchCodes, else name 
 */
export const DunningPartnerDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type DunningPartnerDto = z.infer<typeof DunningPartnerDtoSchema>;

/** 
 * DunningConfirmedByDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningConfirmedByDtoSchema = z.object({ id: z.string(), name: z.string() });
export type DunningConfirmedByDto = z.infer<typeof DunningConfirmedByDtoSchema>;

/** 
 * DunningStatusSchema 
 * @type { enum }
 */
export const DunningStatusSchema = z.enum(["PREPARED", "ISSUED"]);
export type DunningStatus = z.infer<typeof DunningStatusSchema>;
export const DunningStatus = DunningStatusSchema.enum;

/** 
 * DunningResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { DunningManagementModels.DunningPartnerDto } partner  
 * @property { number } level  
 * @property { string } dunningLevelId  
 * @property { string } status  
 * @property { number } invoiceCount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 * @property { number } daysOverdue  
 * @property { number } dunningFee  
 * @property { string } createdAt  
 * @property { string } statusChangedOn  
 * @property { DunningManagementModels.DunningConfirmedByDto } confirmedBy  
 * @property { string } documentUrl  
 */
export const DunningResponseDtoSchema = z.object({ id: z.string(), partner: DunningPartnerDtoSchema, level: z.number(), dunningLevelId: z.string().nullish(), status: DunningStatusSchema, invoiceCount: z.number(), outstandingAmount: z.number(), currencyNotation: z.string(), daysOverdue: z.number(), dunningFee: z.number(), createdAt: z.iso.datetime({ offset: true }), statusChangedOn: z.iso.datetime({ offset: true }), confirmedBy: DunningConfirmedByDtoSchema.nullish(), documentUrl: z.string().nullish() });
export type DunningResponseDto = z.infer<typeof DunningResponseDtoSchema>;

/** 
 * DunningFilterDtoSchema 
 * @type { object }
 * @property { DunningManagementModels.DunningStatus[] } status  
 * @property { string } partnerId Partner ID to filter by 
 * @property { array[] } level Dunning level(s) to filter by 
 * @property { number } outstandingAmountMin Minimum outstanding amount 
 * @property { number } outstandingAmountMax Maximum outstanding amount 
 * @property { string } createdFrom Created from (ISO date string) 
 * @property { string } createdTo Created to (ISO date string) 
 * @property { string } confirmedBy Confirmed by employee ID 
 */
export const DunningFilterDtoSchema = z.object({ status: z.array(DunningStatusSchema).nullable(), partnerId: z.string().nullable(), level: z.array(z.array(z.any())).nullable(), outstandingAmountMin: z.number().nullable(), outstandingAmountMax: z.number().nullable(), createdFrom: z.iso.datetime({ offset: true }).nullable(), createdTo: z.iso.datetime({ offset: true }).nullable(), confirmedBy: z.string().nullable() }).partial();
export type DunningFilterDto = z.infer<typeof DunningFilterDtoSchema>;

/** 
 * DunningPdfConfigDTOSchema 
 * @type { object }
 * @property { string } headerImageUrl  
 * @property { string } footerImageUrl  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { LocaleEnum } locale  
 */
export const DunningPdfConfigDTOSchema = z.object({ headerImageUrl: z.string(), footerImageUrl: z.string(), showWatermarkOnDocuments: z.boolean(), locale: CommonModels.LocaleEnumSchema.nullish() });
export type DunningPdfConfigDTO = z.infer<typeof DunningPdfConfigDTOSchema>;

/** 
 * DunningPdfBusinessPartnerDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } address  
 * @property { string } referenceNumber  
 */
export const DunningPdfBusinessPartnerDTOSchema = z.object({ id: z.string(), name: z.string(), address: z.string(), referenceNumber: z.string().nullish() });
export type DunningPdfBusinessPartnerDTO = z.infer<typeof DunningPdfBusinessPartnerDTOSchema>;

/** 
 * DunningPdfInvoiceDTOSchema 
 * @type { object }
 * @property { string } invoiceNumber  
 * @property { string } issuingDate  
 * @property { string } dueDate  
 * @property { number } daysOverdue  
 * @property { number } dunningLevel  
 * @property { number } invoiceAmount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 * @property { number } interest  
 */
export const DunningPdfInvoiceDTOSchema = z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), dueDate: z.iso.datetime({ offset: true }).nullish(), daysOverdue: z.number(), dunningLevel: z.number(), invoiceAmount: z.number(), outstandingAmount: z.number(), currencyNotation: z.string(), interest: z.number().nullish() });
export type DunningPdfInvoiceDTO = z.infer<typeof DunningPdfInvoiceDTOSchema>;

/** 
 * DunningPdfTotalDTOSchema 
 * @type { object }
 * @property { number } invoicesSum  
 * @property { number } dunningFee  
 * @property { number } interest  
 * @property { string } currencyNotation  
 */
export const DunningPdfTotalDTOSchema = z.object({ invoicesSum: z.number(), dunningFee: z.number(), interest: z.number(), currencyNotation: z.string() });
export type DunningPdfTotalDTO = z.infer<typeof DunningPdfTotalDTOSchema>;

/** 
 * DunningPdfBankAccountDTOSchema 
 * @type { object }
 * @property { string } displayValue  
 * @property { string } iban  
 * @property { string } bankName  
 * @property { string } swiftBic  
 */
export const DunningPdfBankAccountDTOSchema = z.object({ displayValue: z.string(), iban: z.string(), bankName: z.string(), swiftBic: z.string() });
export type DunningPdfBankAccountDTO = z.infer<typeof DunningPdfBankAccountDTOSchema>;

/** 
 * DunningPdfUpcomingInvoiceDTOSchema 
 * @type { object }
 * @property { string } number  
 * @property { string } issuingDate  
 * @property { string } dueDate  
 * @property { number } dueDays  
 * @property { number } invoiceAmount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 */
export const DunningPdfUpcomingInvoiceDTOSchema = z.object({ number: z.string(), issuingDate: z.iso.datetime({ offset: true }).nullish(), dueDate: z.iso.datetime({ offset: true }).nullish(), dueDays: z.number().nullish(), invoiceAmount: z.number().nullish(), outstandingAmount: z.number().nullish(), currencyNotation: z.string().nullish() });
export type DunningPdfUpcomingInvoiceDTO = z.infer<typeof DunningPdfUpcomingInvoiceDTOSchema>;

/** 
 * DunningPdfPayloadDTOSchema 
 * @type { object }
 * @property { string } dunningId  
 * @property { number } dunningLevel  
 * @property { EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { DunningManagementModels.DunningPdfBusinessPartnerDTO } businessPartner  
 * @property { DunningManagementModels.DunningPdfInvoiceDTO[] } invoices  
 * @property { DunningManagementModels.DunningPdfTotalDTO } total  
 * @property { DunningManagementModels.DunningPdfBankAccountDTO } bankAccount  
 * @property { string } employeeName  
 * @property { DunningManagementModels.DunningPdfConfigDTO } config  
 * @property { LanguageEnum } language  
 * @property { DunningManagementModels.DunningPdfUpcomingInvoiceDTO[] } upcomingInvoices  
 */
export const DunningPdfPayloadDTOSchema = z.object({ dunningId: z.string(), dunningLevel: z.number(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), businessPartner: DunningPdfBusinessPartnerDTOSchema, invoices: z.array(DunningPdfInvoiceDTOSchema), total: DunningPdfTotalDTOSchema, bankAccount: DunningPdfBankAccountDTOSchema, employeeName: z.string().nullable(), config: DunningPdfConfigDTOSchema, language: CommonModels.LanguageEnumSchema.nullish(), upcomingInvoices: z.array(DunningPdfUpcomingInvoiceDTOSchema).nullish() });
export type DunningPdfPayloadDTO = z.infer<typeof DunningPdfPayloadDTOSchema>;

/** 
 * PartnerOutstandingInvoiceSummaryFilterDtoSchema 
 * @type { object }
 * @property { string } search Search string (partner name) 
 * @property { number } daysOverdueMin Minimum days overdue 
 * @property { string } partnerId Partner ID 
 * @property { number } outstandingAmountMin Minimum outstanding amount 
 * @property { string } currency Currency 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { DateRangeDto } lastDunningDate Last dunning date range 
 */
export const PartnerOutstandingInvoiceSummaryFilterDtoSchema = z.object({ search: z.string().nullable(), daysOverdueMin: z.number().nullable(), partnerId: z.string().nullable(), outstandingAmountMin: z.number().nullable(), currency: z.string().nullable(), dunningSystemId: z.string().nullable(), lastDunningDate: CommonModels.DateRangeDtoSchema.nullable() }).partial();
export type PartnerOutstandingInvoiceSummaryFilterDto = z.infer<typeof PartnerOutstandingInvoiceSummaryFilterDtoSchema>;

/** 
 * DunningLevelOfficeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } currencyNotation  
 */
export const DunningLevelOfficeDTOSchema = z.object({ id: z.string(), name: z.string(), currencyNotation: z.string() });
export type DunningLevelOfficeDTO = z.infer<typeof DunningLevelOfficeDTOSchema>;

/** 
 * DunningLevelEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningLevelEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type DunningLevelEmployeeDTO = z.infer<typeof DunningLevelEmployeeDTOSchema>;

/** 
 * DunningLevelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } level  
 * @property { number } daysOverdue  
 * @property { number } dunningFee  
 * @property { number } interestRate  
 * @property { string } usedInOfficeId  
 * @property { DunningLevelsModels.DunningLevelOfficeDTO } usedInOffice  
 * @property { DunningSystemReferenceDTO } dunningSystem  
 * @property { string } createdById  
 * @property { DunningLevelsModels.DunningLevelEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { DunningLevelsModels.DunningLevelEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 * @property { boolean } archived  
 * @property { EditorContentResponseDto } bodyRemarks  
 * @property { EditorContentResponseDto } footerRemarks  
 */
export const DunningLevelResponseDTOSchema = z.object({ id: z.string(), level: z.number(), daysOverdue: z.number(), dunningFee: z.number(), interestRate: z.number().nullish(), usedInOfficeId: z.string(), usedInOffice: DunningLevelOfficeDTOSchema.nullish(), dunningSystem: CommonModels.DunningSystemReferenceDTOSchema.nullish(), createdById: z.string().nullish(), createdBy: DunningLevelEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DunningLevelEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), archived: z.boolean(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish() });
export type DunningLevelResponseDTO = z.infer<typeof DunningLevelResponseDTOSchema>;

/** 
 * CreateDunningLevelRequestDTOSchema 
 * @type { object }
 * @property { number } level Dunning level number. Minimum: `1` 
 * @property { number } daysOverdue Days overdue before this level applies. Minimum: `1` 
 * @property { number } dunningFee Fee amount for this dunning level. Minimum: `0` 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { number } interestRate Minimum: `0`. Maximum: `100` 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const CreateDunningLevelRequestDTOSchema = z.object({ level: z.number().gte(1), daysOverdue: z.number().gte(1), dunningFee: z.number().gte(0), dunningSystemId: z.string().nullish(), interestRate: z.number().gte(0).lte(100).nullish(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullish() });
export type CreateDunningLevelRequestDTO = z.infer<typeof CreateDunningLevelRequestDTOSchema>;

/** 
 * UpdateDunningLevelRequestDTOSchema 
 * @type { object }
 * @property { number } level Dunning level number. Minimum: `1` 
 * @property { number } daysOverdue Days overdue before this level applies. Minimum: `1` 
 * @property { number } dunningFee Fee amount for this dunning level. Minimum: `0` 
 * @property { number } interestRate Minimum: `0`. Maximum: `100` 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateDunningLevelRequestDTOSchema = z.object({ level: z.number().gte(1).nullable(), daysOverdue: z.number().gte(1).nullable(), dunningFee: z.number().gte(0).nullable(), interestRate: z.number().gte(0).lte(100).nullable(), dunningSystemId: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateDunningLevelRequestDTO = z.infer<typeof UpdateDunningLevelRequestDTOSchema>;

/** 
 * DunningSystemEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningSystemEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type DunningSystemEmployeeDTO = z.infer<typeof DunningSystemEmployeeDTOSchema>;

/** 
 * DunningSystemResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name  
 * @property { boolean } isDefault  
 * @property { boolean } archived  
 * @property { string } archivedAt  
 * @property { string } createdById  
 * @property { DunningSystemsModels.DunningSystemEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { DunningSystemsModels.DunningSystemEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const DunningSystemResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), isDefault: z.boolean(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: DunningSystemEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DunningSystemEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type DunningSystemResponseDTO = z.infer<typeof DunningSystemResponseDTOSchema>;

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
 * InvoiceDirectionEnumSchema 
 * @type { enum }
 */
export const InvoiceDirectionEnumSchema = z.enum(["Incoming", "Outgoing"]);
export type InvoiceDirectionEnum = z.infer<typeof InvoiceDirectionEnumSchema>;
export const InvoiceDirectionEnum = InvoiceDirectionEnumSchema.enum;

/** 
 * AccountStatementInvoicesByCurrencyAndDirectionDtoSchema 
 * @type { object }
 * @property { string } direction  
 * @property { string } currency  
 * @property { DunningAccountStatementModels.AccountStatementPdfPayloadInvoiceDto[] } invoices  
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
 * @property { DunningAccountStatementModels.AccountStatementPdfPayloadBusinessPartnerDto } businessPartner  
 * @property { DunningAccountStatementModels.AccountStatementInvoicesByCurrencyAndDirectionDto[] } invoicesByCurrencyAndDirection  
 * @property { DunningAccountStatementModels.AccountStatementPdfPayloadBankAccountDto } bankAccount  
 * @property { string } employeeName  
 * @property { ConfigBlockDto } config  
 */
export const AccountStatementPdfPayloadDTOSchema = z.object({ businessPartner: AccountStatementPdfPayloadBusinessPartnerDtoSchema, invoicesByCurrencyAndDirection: z.array(AccountStatementInvoicesByCurrencyAndDirectionDtoSchema), bankAccount: AccountStatementPdfPayloadBankAccountDtoSchema, employeeName: z.string().nullable(), config: CommonModels.ConfigBlockDtoSchema });
export type AccountStatementPdfPayloadDTO = z.infer<typeof AccountStatementPdfPayloadDTOSchema>;

/** 
 * InvoiceTypeEnumSchema 
 * @type { enum }
 */
export const InvoiceTypeEnumSchema = z.enum(["CreditNote", "Invoice", "CollectiveInvoice", "ProForma", "PartialCreditNote", "DirectInvoice"]);
export type InvoiceTypeEnum = z.infer<typeof InvoiceTypeEnumSchema>;
export const InvoiceTypeEnum = InvoiceTypeEnumSchema.enum;

/** 
 * BooleanFilterEnumSchema 
 * @type { enum }
 */
export const BooleanFilterEnumSchema = z.enum(["Yes", "No"]);
export type BooleanFilterEnum = z.infer<typeof BooleanFilterEnumSchema>;
export const BooleanFilterEnum = BooleanFilterEnumSchema.enum;

/** 
 * InvoiceStatusEnumSchema 
 * @type { enum }
 */
export const InvoiceStatusEnumSchema = z.enum(["Credited", "Draft", "Overpaid", "PartiallyPaid", "Outstanding", "Paid", "CreditNote", "ProForma"]);
export type InvoiceStatusEnum = z.infer<typeof InvoiceStatusEnumSchema>;
export const InvoiceStatusEnum = InvoiceStatusEnumSchema.enum;

/** 
 * OfficeInvoiceFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { DateRangeDto } issuingDate  
 * @property { DateRangeDto } serviceDate  
 * @property { InvoiceDirectionEnum[] } invoiceDirection  
 * @property { InvoiceTypeEnum[] } invoiceType  
 * @property { BooleanFilterEnum[] } collective  
 * @property { number } amountMin  
 * @property { number } amountMax  
 * @property { string[] } currencyNotation  
 * @property { string[] } vatRule  
 * @property { DateRangeDto } dueDate  
 * @property { InvoiceStatusEnum[] } status  
 * @property { string[] } receiver Filter by invoice receiver/customer IDs (UUID) 
 * @property { string[] } receiverCountry Filter by invoice receiver/customer country IDs 
 * @property { string[] } salesRep Filter by sales rep id 
 * @property { string } positionNumbersString  
 * @property { string[] } positionNumbers  
 * @property { string } invoiceNumbersString  
 * @property { string[] } invoiceNumbers  
 * @property { BooleanFilterEnum[] } bookkeepingExportStatus  
 * @property { BooleanFilterEnum[] } dunningBlock  
 * @property { BooleanFilterEnum[] } invoiceInReview  
 * @property { BooleanFilterEnum[] } isInvoiceOk  
 * @property { BooleanFilterEnum[] } isVatOk  
 * @property { number } invoiceNumberMin  
 * @property { number } invoiceNumberMax  
 * @property { number } internalNumberMin  
 * @property { number } internalNumberMax  
 * @property { string } externalSystemId Filter invoices by position external system ID (substring match) 
 * @property { string } hblNumber Filter invoices by HBL/HAWB (substring match) 
 * @property { string } mblNumber Filter invoices by MBL/MAWB (substring match) 
 * @property { string } bookingNumber Filter invoices by booking number (substring match) 
 * @property { string } vessel Filter invoices by vessel name (substring match) 
 * @property { string } voyage Filter invoices by voyage number (substring match) 
 * @property { string } creditorId Filter invoices by creditor ID (substring match) 
 * @property { string } debtorId Filter invoices by debtor ID (substring match) 
 */
export const OfficeInvoiceFilterDtoSchema = z.object({ search: z.string().nullable(), issuingDate: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).nullable(), invoiceType: z.array(CommonModels.InvoiceTypeEnumSchema).nullable(), collective: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), amountMin: z.number().nullable(), amountMax: z.number().nullable(), currencyNotation: z.array(z.string()).nullable(), vatRule: z.array(z.string()).nullable(), dueDate: CommonModels.DateRangeDtoSchema.nullable(), status: z.array(CommonModels.InvoiceStatusEnumSchema).nullable(), receiver: z.array(z.string()).nullable(), receiverCountry: z.array(z.string()).nullable(), salesRep: z.array(z.string()).nullable(), positionNumbersString: z.string().nullable(), positionNumbers: z.array(z.string()).nullable(), invoiceNumbersString: z.string().nullable(), invoiceNumbers: z.array(z.string()).nullable(), bookkeepingExportStatus: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), dunningBlock: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceInReview: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isInvoiceOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isVatOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceNumberMin: z.number().nullable(), invoiceNumberMax: z.number().nullable(), internalNumberMin: z.number().nullable(), internalNumberMax: z.number().nullable(), externalSystemId: z.string().nullable(), hblNumber: z.string().nullable(), mblNumber: z.string().nullable(), bookingNumber: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), creditorId: z.string().nullable(), debtorId: z.string().nullable() }).partial();
export type OfficeInvoiceFilterDto = z.infer<typeof OfficeInvoiceFilterDtoSchema>;

/** 
 * OfficeInvoiceListQueryDtoSchema 
 * @type { object }
 * @property { string } order Order by fields (comma separated with +/- prefix): invoiceNumber, issuingDate, invoiceType, amount, netAmount, currencyNotation, dueDate, status, paidOn, serviceDate, internalNumber, positionNumber, invoiceDirection, receiver, receiverCountry, paidAmount, totalVat, dunningBlock, invoiceInReview, isInvoiceOk, isVatOk, comments, salesRepName, isExportedToBookkeeping, createdAt, customerReferenceOverride, externalSystemId. Example: `invoiceNumber` 
 * @property { OfficeInvoiceFilterDto } filter  
 * @property { number } limit Items per response. Minimum: `1`. Maximum: `100`. Default: `20` 
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 */
export const OfficeInvoiceListQueryDtoSchema = z.object({ order: z.string().nullish(), filter: CommonModels.OfficeInvoiceFilterDtoSchema.nullish(), limit: z.number().gte(1).lte(100).default(20), page: z.number().nullish(), cursor: z.string().nullish() });
export type OfficeInvoiceListQueryDto = z.infer<typeof OfficeInvoiceListQueryDtoSchema>;

/** 
 * PositionPreviewResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } externalSystemId  
 * @property { TransportModeEnum } transportMode  
 * @property { DirectionEnum } direction  
 * @property { LoadTypeEnum } loadType  
 * @property { string } createdAt  
 * @property { string } number  
 * @property { boolean } isCancelled  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { string } customer.phone  
 * @property { string } customer.email  
 * @property { string } customerReference  
 * @property { object } consignee  
 * @property { string } consignee.id  
 * @property { string } consignee.name  
 * @property { string } consignee.matchCode  
 * @property { string } consignee.label  
 * @property { string } consigneeReference  
 * @property { object } carrier  
 * @property { string } carrier.id  
 * @property { string } carrier.name  
 * @property { string } carrier.matchCode  
 * @property { string } carrier.label  
 * @property { string } carrierReference  
 * @property { number } positionNumber  
 * @property { string } hblNumber  
 * @property { string } mblNumber  
 * @property { string } bookingNumber  
 * @property { string } vessel  
 * @property { string } voyage  
 * @property { string } vesselCarrier Carrier name from route point (sea positions only) 
 * @property { object } origin  
 * @property { string } origin.id  
 * @property { string } origin.name  
 * @property { string } loadDate  
 * @property { object } loadingPort  
 * @property { string } loadingPort.id  
 * @property { string } loadingPort.name  
 * @property { object } dischargePort  
 * @property { string } dischargePort.id  
 * @property { string } dischargePort.name  
 * @property { object } destination  
 * @property { string } destination.id  
 * @property { string } destination.name  
 * @property { string } deliveryDate  
 * @property { string } equipment  
 * @property { ServiceTypeEnum } serviceType  
 * @property { object } destinationOffice  
 * @property { string } destinationOffice.id  
 * @property { string } destinationOffice.name  
 * @property { string } currency  
 * @property { number } profit  
 * @property { number } margin  
 * @property { object } employee  
 * @property { string } employee.id  
 * @property { string } employee.name  
 * @property { object } project  
 * @property { string } project.id  
 * @property { string } project.name  
 * @property { string } serviceDate  
 * @property { string } departureDate  
 * @property { string } arrivalDate  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { SeaRoutingEnum } routing  
 * @property { EditorContentResponseDto } notes Notes 
 * @property { boolean } isMasterPosition  
 * @property { boolean } hasInvoices Whether this position has at least one invoice 
 * @property { object } parentPosition  
 * @property { string } parentPosition.id  
 * @property { string } parentPosition.number  
 */
export const PositionPreviewResponseDtoSchema = z.object({ id: z.string(), externalSystemId: z.string().nullish(), transportMode: CommonModels.TransportModeEnumSchema, direction: CommonModels.DirectionEnumSchema, loadType: CommonModels.LoadTypeEnumSchema.nullish(), createdAt: z.iso.datetime({ offset: true }).nullish(), number: z.string(), isCancelled: z.boolean(), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), phone: z.string().nullish(), email: z.string().nullish() }), customerReference: z.string().nullish(), consignee: z.object({ id: z.string().nullable(), name: z.string().nullable(), matchCode: z.string().nullable(), label: z.string().nullable() }).nullish(), consigneeReference: z.string().nullish(), carrier: z.object({ id: z.string().nullable(), name: z.string().nullable(), matchCode: z.string().nullable(), label: z.string().nullable() }).nullish(), carrierReference: z.string().nullish(), positionNumber: z.number().nullish(), hblNumber: z.string().nullish(), mblNumber: z.string().nullish(), bookingNumber: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), vesselCarrier: z.string().nullish(), origin: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), loadDate: z.iso.datetime({ offset: true }).nullish(), loadingPort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), dischargePort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), destination: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), deliveryDate: z.iso.datetime({ offset: true }).nullish(), equipment: z.string().nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), destinationOffice: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), currency: z.string().nullish(), profit: z.number().nullish(), margin: z.number().nullish(), employee: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), project: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), serviceDate: z.iso.datetime({ offset: true }).nullish(), departureDate: z.iso.datetime({ offset: true }).nullish(), arrivalDate: z.iso.datetime({ offset: true }).nullish(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullish(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullish(), customsDate: z.iso.datetime({ offset: true }).nullish(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullish(), routing: CommonModels.SeaRoutingEnumSchema.nullish(), notes: CommonModels.EditorContentResponseDtoSchema.nullish(), isMasterPosition: z.boolean(), hasInvoices: z.boolean().nullish(), parentPosition: z.object({ id: z.string().nullable(), number: z.string().nullable() }).nullish() });
export type PositionPreviewResponseDto = z.infer<typeof PositionPreviewResponseDtoSchema>;

/** 
 * PositionStatusEnumSchema 
 * @type { enum }
 */
export const PositionStatusEnumSchema = z.enum(["Preparing", "NeedsDocumentation", "Executing", "Done"]);
export type PositionStatusEnum = z.infer<typeof PositionStatusEnumSchema>;
export const PositionStatusEnum = PositionStatusEnumSchema.enum;

/** 
 * PositionFilterDtoSchema 
 * @type { object }
 * @property { TransportModeEnum } transportMode  
 * @property { string[] } customerId  
 * @property { string[] } carrierId Filter positions by carrier IDs 
 * @property { string[] } consigneeId Filter positions by consignee IDs 
 * @property { boolean } isCancelled  
 * @property { PositionStatusEnum } status  
 * @property { string } number  
 * @property { DirectionEnum } direction  
 * @property { LoadTypeEnum } loadType  
 * @property { ServiceTypeEnum } serviceType  
 * @property { string[] } employee Filter positions by employee IDs 
 * @property { string } searchQuery  
 * @property { string } externalSystemId Filter positions by external system ID (substring match) 
 * @property { DateRangeDto } createdAt  
 * @property { DateRangeDto } serviceDate  
 * @property { DateRangeDto } departureDate  
 * @property { DateRangeDto } arrivalDate  
 * @property { DateRangeDto } blfromCostumerDate  
 * @property { DateRangeDto } blfromCarrierDate  
 * @property { DateRangeDto } customsDate  
 * @property { DateRangeDto } vgmCustomerDate  
 * @property { string } partnerNetworkId Filter positions by partner network ID 
 * @property { string[] } projectLiteId Filter positions by project IDs 
 * @property { string[] } checklistItemsDone Checklist item ids that must be completed 
 * @property { string[] } checklistItemsNotDone Checklist item ids that must be not completed 
 * @property { SeaRoutingEnum } routing  
 * @property { BooleanFilterEnum[] } isExcludedFromStatistics  
 * @property { boolean } isMasterPosition  
 * @property { string[] } loadingPortId Filter positions by loading port/airport IDs (checks both sea port of loading and air airport of departure) 
 * @property { string[] } dischargePortId Filter positions by discharge port/airport IDs (checks both sea port of discharge and air destination airport) 
 * @property { string } customerReference Filter positions by customer reference 
 * @property { string } carrierReference Filter positions by carrier reference 
 * @property { string } consigneeReference Filter positions by consignee reference 
 * @property { string } hblNumber Filter positions by HBL/HAWB number 
 * @property { string } mblNumber Filter positions by MBL/MAWB number 
 * @property { string } bookingNumber Filter positions by booking number 
 * @property { string } vessel Filter positions by vessel name 
 * @property { string } voyage Filter positions by voyage number 
 * @property { string } vesselCarrier Filter positions by vessel or carrier name 
 */
export const PositionFilterDtoSchema = z.object({ transportMode: CommonModels.TransportModeEnumSchema.nullable(), customerId: z.array(z.string()).nullable(), carrierId: z.array(z.string()).nullable(), consigneeId: z.array(z.string()).nullable(), isCancelled: z.boolean().nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), number: z.string().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), employee: z.array(z.string()).nullable(), searchQuery: z.string().nullable(), externalSystemId: z.string().nullable(), createdAt: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), departureDate: CommonModels.DateRangeDtoSchema.nullable(), arrivalDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCostumerDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCarrierDate: CommonModels.DateRangeDtoSchema.nullable(), customsDate: CommonModels.DateRangeDtoSchema.nullable(), vgmCustomerDate: CommonModels.DateRangeDtoSchema.nullable(), partnerNetworkId: z.string().nullable(), projectLiteId: z.array(z.string()).nullable(), checklistItemsDone: z.array(z.string()).nullable(), checklistItemsNotDone: z.array(z.string()).nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isMasterPosition: z.boolean().nullable(), loadingPortId: z.array(z.string()).nullable(), dischargePortId: z.array(z.string()).nullable(), customerReference: z.string().nullable(), carrierReference: z.string().nullable(), consigneeReference: z.string().nullable(), hblNumber: z.string().nullable(), mblNumber: z.string().nullable(), bookingNumber: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), vesselCarrier: z.string().nullable() }).partial();
export type PositionFilterDto = z.infer<typeof PositionFilterDtoSchema>;

/** 
 * PositionExportFilterDtoSchema 
 * @type { object }
 * @property { TransportModeEnum } transportMode  
 * @property { string[] } customerId  
 * @property { boolean } isCancelled  
 * @property { PositionStatusEnum } status  
 * @property { string } number  
 * @property { DirectionEnum } direction  
 * @property { LoadTypeEnum } loadType  
 * @property { ServiceTypeEnum } serviceType  
 * @property { string[] } responsibleEmployee Filter positions by responsible employee IDs 
 * @property { string } searchQuery  
 * @property { string } externalSystemId Filter positions by external system ID (substring match) 
 * @property { DateRangeDto } statusDate  
 * @property { DateRangeDto } serviceDate  
 * @property { DateRangeDto } dateOfDeparture  
 * @property { DateRangeDto } dateOfArrival  
 * @property { DateRangeDto } blfromCostumerDate  
 * @property { DateRangeDto } blfromCarrierDate  
 * @property { DateRangeDto } customsDate  
 * @property { DateRangeDto } vgmCustomerDate  
 * @property { string } partnerNetworkId Filter positions by partner network ID 
 * @property { string[] } projectLiteId Filter positions by project IDs 
 * @property { string[] } checklistItemsDone Checklist item ids that must be completed 
 * @property { string[] } checklistItemsNotDone Checklist item ids that must be not completed 
 * @property { SeaRoutingEnum } routing  
 * @property { BooleanFilterEnum[] } isExcludedFromStatistics  
 */
export const PositionExportFilterDtoSchema = z.object({ transportMode: CommonModels.TransportModeEnumSchema.nullable(), customerId: z.array(z.string()).nullable(), isCancelled: z.boolean().nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), number: z.string().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), responsibleEmployee: z.array(z.string()).nullable(), searchQuery: z.string().nullable(), externalSystemId: z.string().nullable(), statusDate: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), dateOfDeparture: CommonModels.DateRangeDtoSchema.nullable(), dateOfArrival: CommonModels.DateRangeDtoSchema.nullable(), blfromCostumerDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCarrierDate: CommonModels.DateRangeDtoSchema.nullable(), customsDate: CommonModels.DateRangeDtoSchema.nullable(), vgmCustomerDate: CommonModels.DateRangeDtoSchema.nullable(), partnerNetworkId: z.string().nullable(), projectLiteId: z.array(z.string()).nullable(), checklistItemsDone: z.array(z.string()).nullable(), checklistItemsNotDone: z.array(z.string()).nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).nullable() }).partial();
export type PositionExportFilterDto = z.infer<typeof PositionExportFilterDtoSchema>;

/** 
 * PositionExportColumnSchema 
 * @type { enum }
 */
export const PositionExportColumnSchema = z.enum(["id", "externalSystemId", "transportMode", "direction", "loadType", "createdAt", "number", "isCancelled", "customerName", "customerPhone", "customerEmail", "customerReference", "consigneeName", "consigneeReference", "carrierName", "carrierReference", "positionNumber", "hblNumber", "mblNumber", "bookingNumber", "vessel", "voyage", "originName", "loadDate", "loadingPortName", "dischargePortName", "destinationName", "deliveryDate", "equipment", "serviceTypeName", "departureDate", "arrivalDate", "destinationOfficeName", "currency", "profit", "margin", "employeeName", "projectName", "serviceDate", "routing", "notes", "blFromCustomerDate", "blFromCarrierDate", "customsDate", "vgmCustomerDate", "isMasterPosition", "parentPositionId", "parentPositionNumber"]);
export type PositionExportColumn = z.infer<typeof PositionExportColumnSchema>;
export const PositionExportColumn = PositionExportColumnSchema.enum;

/** 
 * PositionExportRequestDtoSchema 
 * @type { object }
 * @property { string } order Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number` 
 * @property { PositionsModels.PositionExportColumn[] } columns Min Items: `1` 
 * @property { PositionsModels.PositionExportFilterDto } filter  
 */
export const PositionExportRequestDtoSchema = z.object({ order: z.string().nullable(), columns: z.array(PositionExportColumnSchema).min(1).nullable(), filter: PositionExportFilterDtoSchema.nullable() }).partial();
export type PositionExportRequestDto = z.infer<typeof PositionExportRequestDtoSchema>;

/** 
 * PositionAirCustomsStatusTypeEnumSchema 
 * @type { enum }
 */
export const PositionAirCustomsStatusTypeEnumSchema = z.enum(["Other", "X", "C", "TD", "T1"]);
export type PositionAirCustomsStatusTypeEnum = z.infer<typeof PositionAirCustomsStatusTypeEnumSchema>;
export const PositionAirCustomsStatusTypeEnum = PositionAirCustomsStatusTypeEnumSchema.enum;

/** 
 * PositionAirDetailsDtoSchema 
 * @type { object }
 * @property { boolean } hawbRequired  
 * @property { string } hawbNumber  
 * @property { boolean } mawbRequired  
 * @property { string } mawbNumber  
 * @property { string } airlineDeadline  
 * @property { string } mrnT1Number  
 * @property { string } customsStatus  
 * @property { PositionAirCustomsStatusTypeEnum } customsStatusType  
 * @property { string } deliveryToConsignee  
 * @property { boolean } isCourier  
 */
export const PositionAirDetailsDtoSchema = z.object({ hawbRequired: z.boolean(), hawbNumber: z.string().nullish(), mawbRequired: z.boolean(), mawbNumber: z.string().nullish(), airlineDeadline: z.iso.datetime({ offset: true }).nullish(), mrnT1Number: z.string().nullish(), customsStatus: z.string().nullish(), customsStatusType: CommonModels.PositionAirCustomsStatusTypeEnumSchema.nullish(), deliveryToConsignee: z.iso.datetime({ offset: true }).nullish(), isCourier: z.boolean() });
export type PositionAirDetailsDto = z.infer<typeof PositionAirDetailsDtoSchema>;

/** 
 * PositionSeaDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode  
 * @property { string } houseBillOfLadingNumber  
 * @property { string } masterBillOfLadingNumber  
 * @property { boolean } hblRequired  
 * @property { boolean } mblRequired  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { string } buyServiceContract  
 * @property { string } sellServiceContract  
 * @property { string } quoteReference  
 * @property { SeaRoutingEnum } routing  
 * @property { string } defaultBookingNumber  
 */
export const PositionSeaDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullish(), houseBillOfLadingNumber: z.string().nullish(), masterBillOfLadingNumber: z.string().nullish(), hblRequired: z.boolean(), mblRequired: z.boolean(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullish(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullish(), customsDate: z.iso.datetime({ offset: true }).nullish(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullish(), buyServiceContract: z.string().nullish(), sellServiceContract: z.string().nullish(), quoteReference: z.string().nullish(), routing: CommonModels.SeaRoutingEnumSchema.nullish(), defaultBookingNumber: z.string().nullish() });
export type PositionSeaDetailsDto = z.infer<typeof PositionSeaDetailsDtoSchema>;

/** 
 * PositionCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PositionCustomerDto = z.infer<typeof PositionCustomerDtoSchema>;

/** 
 * PositionQuoteDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PositionQuoteDtoSchema = z.object({ id: z.string(), number: z.string() });
export type PositionQuoteDto = z.infer<typeof PositionQuoteDtoSchema>;

/** 
 * PositionSourcePositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PositionSourcePositionDtoSchema = z.object({ id: z.string(), number: z.string() });
export type PositionSourcePositionDto = z.infer<typeof PositionSourcePositionDtoSchema>;

/** 
 * ParentPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const ParentPositionDtoSchema = z.object({ id: z.string(), number: z.string() });
export type ParentPositionDto = z.infer<typeof ParentPositionDtoSchema>;

/** 
 * PositionTypeEnumSchema 
 * @type { enum }
 */
export const PositionTypeEnumSchema = z.enum(["Sea", "Road", "Air"]);
export type PositionTypeEnum = z.infer<typeof PositionTypeEnumSchema>;
export const PositionTypeEnum = PositionTypeEnumSchema.enum;

/** 
 * PositionProjectLiteDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionProjectLiteDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PositionProjectLiteDto = z.infer<typeof PositionProjectLiteDtoSchema>;

/** 
 * EmployeeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeDtoSchema = z.object({ id: z.string(), name: z.string() });
export type EmployeeDto = z.infer<typeof EmployeeDtoSchema>;

/** 
 * PositionCoreResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } rootFolderId  
 * @property { string } externalSystemId  
 * @property { MovementTypeEnum } inttraTypeOfMove  
 * @property { PositionCustomerDto } customer  
 * @property { boolean } isCancelled  
 * @property { string } owningOfficeId  
 * @property { string } originOfficeId  
 * @property { PositionQuoteDto } quote  
 * @property { PositionSourcePositionDto } sourcePosition  
 * @property { string } number  
 * @property { SectionEnum } section  
 * @property { DirectionEnum } direction  
 * @property { TransportModeEnum } transportMode  
 * @property { string } statusDate  
 * @property { string } serviceDate  
 * @property { string } dateOfDeparture  
 * @property { string } dateOfArrival  
 * @property { PositionStatusEnum } status  
 * @property { LoadTypeEnum } loadType  
 * @property { IncotermsEnum } incoterms  
 * @property { IncotermsEnum } secondIncoterms  
 * @property { ServiceTypeEnum } serviceType  
 * @property { ParentPositionDto } parentPosition  
 * @property { string } buyRateReference  
 * @property { FrequencyEnum } frequency  
 * @property { PositionTypeEnum } positionType  
 * @property { boolean } isParentPosition  
 * @property { boolean } hasParentPosition  
 * @property { boolean } hasChildPositions  
 * @property { PositionProjectLiteDto } projectLite  
 * @property { boolean } isExcludedFromStatistics  
 * @property { EmployeeDto } salesRep  
 * @property { string } fillingCompany  
 * @property { string } sellingContract  
 * @property { string } fillingScacCode  
 * @property { string } serviceValidity  
 * @property { string } ratesValidity  
 * @property { EmployeeDto } responsibleEmployee  
 * @property { EmployeeDto } receivedByEmployee  
 * @property { string } team  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { EditorContentResponseDto } notes Notes 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 * @property { PositionAirDetailsDto } airDetails  
 * @property { PositionSeaDetailsDto } seaDetails  
 */
export const PositionCoreResponseDtoSchema = z.object({ id: z.string(), rootFolderId: z.string().nullish(), externalSystemId: z.string().nullish(), inttraTypeOfMove: CommonModels.MovementTypeEnumSchema.nullish(), customer: CommonModels.PositionCustomerDtoSchema.nullish(), isCancelled: z.boolean(), owningOfficeId: z.string(), originOfficeId: z.string().nullish(), quote: CommonModels.PositionQuoteDtoSchema.nullish(), sourcePosition: CommonModels.PositionSourcePositionDtoSchema.nullish(), number: z.string(), section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, statusDate: z.iso.datetime({ offset: true }), serviceDate: z.iso.datetime({ offset: true }).nullish(), dateOfDeparture: z.iso.datetime({ offset: true }).nullish(), dateOfArrival: z.iso.datetime({ offset: true }).nullish(), status: CommonModels.PositionStatusEnumSchema.nullish(), loadType: CommonModels.LoadTypeEnumSchema.nullish(), incoterms: CommonModels.IncotermsEnumSchema.nullish(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), parentPosition: CommonModels.ParentPositionDtoSchema.nullish(), buyRateReference: z.string().nullish(), frequency: CommonModels.FrequencyEnumSchema.nullish(), positionType: CommonModels.PositionTypeEnumSchema.nullish(), isParentPosition: z.boolean(), hasParentPosition: z.boolean().nullish(), hasChildPositions: z.boolean().nullish(), projectLite: CommonModels.PositionProjectLiteDtoSchema.nullish(), isExcludedFromStatistics: z.boolean(), salesRep: CommonModels.EmployeeDtoSchema.nullish(), fillingCompany: z.string().nullish(), sellingContract: z.string().nullish(), fillingScacCode: z.string().nullish(), serviceValidity: z.iso.datetime({ offset: true }).nullish(), ratesValidity: z.iso.datetime({ offset: true }).nullish(), responsibleEmployee: CommonModels.EmployeeDtoSchema.nullish(), receivedByEmployee: CommonModels.EmployeeDtoSchema.nullish(), team: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), notes: CommonModels.EditorContentResponseDtoSchema.nullish(), volumetricWeightModifier: z.number().nullish(), airDetails: CommonModels.PositionAirDetailsDtoSchema.nullable(), seaDetails: CommonModels.PositionSeaDetailsDtoSchema.nullable() });
export type PositionCoreResponseDto = z.infer<typeof PositionCoreResponseDtoSchema>;

/** 
 * CreatePositionRequestDtoSchema 
 * @type { object }
 * @property { SectionEnum } section  
 * @property { DirectionEnum } direction  
 * @property { TransportModeEnum } transportMode  
 * @property { LoadTypeEnum } loadType  
 * @property { ServiceTypeEnum } serviceType  
 * @property { string } estimatedServiceDate  
 * @property { string } customerBusinessPartnerId  
 */
export const CreatePositionRequestDtoSchema = z.object({ section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, loadType: CommonModels.LoadTypeEnumSchema, serviceType: CommonModels.ServiceTypeEnumSchema, estimatedServiceDate: z.iso.datetime({ offset: true }), customerBusinessPartnerId: z.string() });
export type CreatePositionRequestDto = z.infer<typeof CreatePositionRequestDtoSchema>;

/** 
 * DuplicatePositionPackageInformationParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } packageType  
 * @property { boolean } packageQuantity  
 * @property { boolean } packageDescription  
 * @property { boolean } packageHsCodes  
 * @property { boolean } packageNetWeight  
 * @property { boolean } packageGrossWeight  
 * @property { boolean } packageCaseMark  
 * @property { boolean } packageNote  
 * @property { boolean } packageCustomsMark  
 */
export const DuplicatePositionPackageInformationParametersDtoSchema = z.object({ enabled: z.boolean(), packageType: z.boolean(), packageQuantity: z.boolean(), packageDescription: z.boolean(), packageHsCodes: z.boolean(), packageNetWeight: z.boolean(), packageGrossWeight: z.boolean(), packageCaseMark: z.boolean(), packageNote: z.boolean(), packageCustomsMark: z.boolean() });
export type DuplicatePositionPackageInformationParametersDto = z.infer<typeof DuplicatePositionPackageInformationParametersDtoSchema>;

/** 
 * DuplicatePositionCargoParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { PositionsModels.DuplicatePositionPackageInformationParametersDto } packageInformation  
 */
export const DuplicatePositionCargoParametersDtoSchema = z.object({ enabled: z.boolean(), packageInformation: DuplicatePositionPackageInformationParametersDtoSchema });
export type DuplicatePositionCargoParametersDto = z.infer<typeof DuplicatePositionCargoParametersDtoSchema>;

/** 
 * DuplicatePositionOverviewParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } quoteReference  
 */
export const DuplicatePositionOverviewParametersDtoSchema = z.object({ enabled: z.boolean(), quoteReference: z.boolean() });
export type DuplicatePositionOverviewParametersDto = z.infer<typeof DuplicatePositionOverviewParametersDtoSchema>;

/** 
 * DuplicatePositionInvolvedPartiesParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } reference  
 */
export const DuplicatePositionInvolvedPartiesParametersDtoSchema = z.object({ enabled: z.boolean(), reference: z.boolean() });
export type DuplicatePositionInvolvedPartiesParametersDto = z.infer<typeof DuplicatePositionInvolvedPartiesParametersDtoSchema>;

/** 
 * DuplicatePositionRoutesParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } routeDates  
 * @property { boolean } routeLocation  
 */
export const DuplicatePositionRoutesParametersDtoSchema = z.object({ enabled: z.boolean(), routeDates: z.boolean(), routeLocation: z.boolean() });
export type DuplicatePositionRoutesParametersDto = z.infer<typeof DuplicatePositionRoutesParametersDtoSchema>;

/** 
 * DuplicatePositionFinanceAccountParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } exchangeRate  
 */
export const DuplicatePositionFinanceAccountParametersDtoSchema = z.object({ enabled: z.boolean(), exchangeRate: z.boolean() });
export type DuplicatePositionFinanceAccountParametersDto = z.infer<typeof DuplicatePositionFinanceAccountParametersDtoSchema>;

/** 
 * DuplicatePositionDocumentsParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } hblWorkingDocument  
 * @property { boolean } siWorkingDocument  
 */
export const DuplicatePositionDocumentsParametersDtoSchema = z.object({ enabled: z.boolean(), hblWorkingDocument: z.boolean(), siWorkingDocument: z.boolean() });
export type DuplicatePositionDocumentsParametersDto = z.infer<typeof DuplicatePositionDocumentsParametersDtoSchema>;

/** 
 * DuplicatePositionDocuboxParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const DuplicatePositionDocuboxParametersDtoSchema = z.object({ enabled: z.boolean() });
export type DuplicatePositionDocuboxParametersDto = z.infer<typeof DuplicatePositionDocuboxParametersDtoSchema>;

/** 
 * DuplicatePositionParametersDtoSchema 
 * @type { object }
 * @property { PositionsModels.DuplicatePositionOverviewParametersDto } overview  
 * @property { PositionsModels.DuplicatePositionInvolvedPartiesParametersDto } involvedParties  
 * @property { PositionsModels.DuplicatePositionCargoParametersDto } cargo  
 * @property { PositionsModels.DuplicatePositionRoutesParametersDto } routes  
 * @property { PositionsModels.DuplicatePositionFinanceAccountParametersDto } financeAccount  
 * @property { PositionsModels.DuplicatePositionDocumentsParametersDto } documents  
 * @property { PositionsModels.DuplicatePositionDocuboxParametersDto } docubox  
 */
export const DuplicatePositionParametersDtoSchema = z.object({ overview: DuplicatePositionOverviewParametersDtoSchema, involvedParties: DuplicatePositionInvolvedPartiesParametersDtoSchema, cargo: DuplicatePositionCargoParametersDtoSchema, routes: DuplicatePositionRoutesParametersDtoSchema, financeAccount: DuplicatePositionFinanceAccountParametersDtoSchema, documents: DuplicatePositionDocumentsParametersDtoSchema, docubox: DuplicatePositionDocuboxParametersDtoSchema });
export type DuplicatePositionParametersDto = z.infer<typeof DuplicatePositionParametersDtoSchema>;

/** 
 * DuplicatePositionDefaultParametersResponseDtoSchema 
 * @type { object }
 * @property { string } estimatedServiceDate Suggested estimated service date for the duplicated position (ISO 8601) 
 * @property { PositionsModels.DuplicatePositionParametersDto } parameters Default duplication parameters with section and sub-parameter flags 
 */
export const DuplicatePositionDefaultParametersResponseDtoSchema = z.object({ estimatedServiceDate: z.string(), parameters: DuplicatePositionParametersDtoSchema });
export type DuplicatePositionDefaultParametersResponseDto = z.infer<typeof DuplicatePositionDefaultParametersResponseDtoSchema>;

/** 
 * PositionSectionEnumSchema 
 * @type { enum }
 */
export const PositionSectionEnumSchema = z.enum(["overview", "involvedParties", "cargo", "financeAccount", "routes", "routeDates", "documents", "docubox"]);
export type PositionSectionEnum = z.infer<typeof PositionSectionEnumSchema>;
export const PositionSectionEnum = PositionSectionEnumSchema.enum;

/** 
 * DuplicatePositionRequestDtoSchema 
 * @type { object }
 * @property { PositionsModels.PositionSectionEnum[] } sections Legacy: sections to duplicate. Ignored when parameters is provided. 
 * @property { PositionsModels.DuplicatePositionParametersDto } parameters Nested parameters for duplication control. Preferred over sections. 
 * @property { string } estimatedServiceDate  
 */
export const DuplicatePositionRequestDtoSchema = z.object({ sections: z.array(PositionSectionEnumSchema).nullish(), parameters: DuplicatePositionParametersDtoSchema.nullish(), estimatedServiceDate: z.iso.datetime({ offset: true }) });
export type DuplicatePositionRequestDto = z.infer<typeof DuplicatePositionRequestDtoSchema>;

/** 
 * UpdatePositionAirDetailsDtoSchema 
 * @type { object }
 * @property { string } hawbNumber  
 * @property { string } mawbNumber  
 * @property { string } airlineDeadline  
 * @property { string } customsStatus  
 * @property { PositionAirCustomsStatusTypeEnum } customsStatusType  
 * @property { string } mrnT1Number  
 * @property { boolean } hawbRequired  
 * @property { boolean } mawbRequired  
 * @property { boolean } isCourier  
 * @property { string } deliveryToConsignee  
 */
export const UpdatePositionAirDetailsDtoSchema = z.object({ hawbNumber: z.string().nullable(), mawbNumber: z.string().nullable(), airlineDeadline: z.iso.datetime({ offset: true }).nullable(), customsStatus: z.string().nullable(), customsStatusType: CommonModels.PositionAirCustomsStatusTypeEnumSchema.nullable(), mrnT1Number: z.string().nullable(), hawbRequired: z.boolean().nullable(), mawbRequired: z.boolean().nullable(), isCourier: z.boolean().nullable(), deliveryToConsignee: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdatePositionAirDetailsDto = z.infer<typeof UpdatePositionAirDetailsDtoSchema>;

/** 
 * UpdatePositionSeaDetailsDtoSchema 
 * @type { object }
 * @property { string } bookingMatchingCode  
 * @property { string } houseBillOfLadingNumber  
 * @property { string } masterBillOfLadingNumber  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { string } buyServiceContract  
 * @property { string } sellServiceContract  
 * @property { string } quoteReference  
 * @property { SeaRoutingEnum } routing  
 * @property { boolean } hblRequired  
 * @property { boolean } mblRequired  
 */
export const UpdatePositionSeaDetailsDtoSchema = z.object({ bookingMatchingCode: z.string().nullable(), houseBillOfLadingNumber: z.string().nullable(), masterBillOfLadingNumber: z.string().nullable(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullable(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullable(), customsDate: z.iso.datetime({ offset: true }).nullable(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable(), quoteReference: z.string().nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), hblRequired: z.boolean().nullable(), mblRequired: z.boolean().nullable() }).partial();
export type UpdatePositionSeaDetailsDto = z.infer<typeof UpdatePositionSeaDetailsDtoSchema>;

/** 
 * UpdatePositionDtoSchema 
 * @type { object }
 * @property { string } externalSystemId  
 * @property { string } statusDate  
 * @property { PositionStatusEnum } status  
 * @property { LoadTypeEnum } loadType  
 * @property { IncotermsEnum } incoterms  
 * @property { IncotermsEnum } secondIncoterms  
 * @property { string } fillingCompany  
 * @property { string } sellingContract  
 * @property { string } fillingScacCode  
 * @property { string } serviceValidity  
 * @property { string } ratesValidity  
 * @property { ServiceTypeEnum } serviceType  
 * @property { string } buyRateReference  
 * @property { FrequencyEnum } frequency  
 * @property { boolean } isParentPosition  
 * @property { boolean } isExcludedFromStatistics  
 * @property { string } team  
 * @property { string } salesRepId  
 * @property { string } responsibleEmployeeId  
 * @property { string } receivedByEmployeeId  
 * @property { string } originOfficeId  
 * @property { string } projectLiteId  
 * @property { EditorContentUpdateDto } notes Notes 
 * @property { MovementTypeEnum } inttraTypeOfMove  
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 * @property { PositionsModels.UpdatePositionAirDetailsDto } airDetails  
 * @property { PositionsModels.UpdatePositionSeaDetailsDto } seaDetails  
 */
export const UpdatePositionDtoSchema = z.object({ externalSystemId: z.string().nullable(), statusDate: z.iso.datetime({ offset: true }).nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), incoterms: CommonModels.IncotermsEnumSchema.nullable(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullable(), fillingCompany: z.string().nullable(), sellingContract: z.string().nullable(), fillingScacCode: z.string().nullable(), serviceValidity: z.iso.datetime({ offset: true }).nullable(), ratesValidity: z.iso.datetime({ offset: true }).nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), buyRateReference: z.string().nullable(), frequency: CommonModels.FrequencyEnumSchema.nullable(), isParentPosition: z.boolean().nullable(), isExcludedFromStatistics: z.boolean().nullable(), team: z.string().nullable(), salesRepId: z.string().nullable(), responsibleEmployeeId: z.string().nullable(), receivedByEmployeeId: z.string().nullable(), originOfficeId: z.string().nullable(), projectLiteId: z.string().nullable(), notes: CommonModels.EditorContentUpdateDtoSchema.nullable(), inttraTypeOfMove: CommonModels.MovementTypeEnumSchema.nullable(), volumetricWeightModifier: z.number().nullable(), airDetails: UpdatePositionAirDetailsDtoSchema.nullable(), seaDetails: UpdatePositionSeaDetailsDtoSchema.nullable() }).partial();
export type UpdatePositionDto = z.infer<typeof UpdatePositionDtoSchema>;

/** 
 * ChildPositionCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChildPositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type ChildPositionCustomerDto = z.infer<typeof ChildPositionCustomerDtoSchema>;

/** 
 * ChildPositionProfitDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currency  
 */
export const ChildPositionProfitDtoSchema = z.object({ amount: z.number(), currency: z.string() });
export type ChildPositionProfitDto = z.infer<typeof ChildPositionProfitDtoSchema>;

/** 
 * ChildPositionResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { number } packages  
 * @property { number } weight  
 * @property { number } volume  
 * @property { PositionsModels.ChildPositionCustomerDto } customer  
 * @property { PositionsModels.ChildPositionProfitDto } profit  
 */
export const ChildPositionResponseDtoSchema = z.object({ id: z.string(), number: z.string(), packages: z.number(), weight: z.number(), volume: z.number(), customer: ChildPositionCustomerDtoSchema, profit: ChildPositionProfitDtoSchema });
export type ChildPositionResponseDto = z.infer<typeof ChildPositionResponseDtoSchema>;

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
 * @property { InvoiceDirectionEnum } invoiceDirection  
 * @property { InvoiceTypeEnum } invoiceType  
 * @property { string } invoiceNumber  
 * @property { string } issuingDate  
 * @property { number } amount  
 * @property { string } currencyNotation  
 * @property { InvoiceStatusEnum } status  
 * @property { boolean } isExportedToBookkeeping  
 * @property { string } internalNumber  
 * @property { InvoicesModels.InvoiceBusinessPartnerResponseDto } receiver  
 * @property { InvoicesModels.InvoiceEmployeeResponseDto } representative  
 * @property { boolean } collective  
 * @property { InvoicesModels.InvoiceRelatedInvoiceResponseDto } creditNote  
 * @property { InvoicesModels.InvoiceRelatedInvoiceResponseDto } cancelledInvoice  
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
 * @property { InvoicesModels.InvoicePartnerDto } shipper  
 * @property { InvoicesModels.InvoicePartnerDto } consignee  
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
 * @property { InvoicesModels.InvoiceChargeTypeDto } chargeType  
 * @property { string } additionalText  
 * @property { number } quantity  
 * @property { number } netAmount  
 * @property { number } grossAmount  
 * @property { number } sumInInvoiceCurrency  
 * @property { number } sumInOfficeCurrency  
 * @property { string } currencyNotation  
 * @property { number } exchangeRate  
 * @property { InvoicesModels.InvoiceVatRuleDto } vatRule  
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
 * @property { LocaleEnum } locale  
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
 * @property { InvoicesModels.InvoiceCustomerDto } customer  
 * @property { string } customerNumber  
 * @property { string } customerNameOverride  
 * @property { string } customerReferenceOverride  
 * @property { string } customerContactOverride  
 * @property { boolean } showInvoiceVatLinesInOfficeCurrency  
 * @property { InvoicesModels.InvoicePositionDto } position  
 * @property { ServiceTypeEnum } serviceType  
 * @property { InvoicesModels.InvoiceOfficeDto } salesOffice  
 * @property { InvoicesModels.InvoiceSalesRepDto } salesRep  
 * @property { number } totalNet  
 * @property { number } totalVat  
 * @property { number } totalGross  
 * @property { string } currencyNotation  
 * @property { number } exchangeRate  
 * @property { number } paymentTermDays  
 * @property { OfficePaymentTermsDateType } paymentTermType  
 * @property { InvoicesModels.InvoiceServiceRecipientDto } serviceRecipient  
 * @property { boolean } showPaymentInstructions  
 * @property { boolean } dunningBlock  
 * @property { boolean } invoiceInReview  
 * @property { string } comments  
 * @property { InvoicesModels.InvoiceBankAccountDto } bankAccount  
 * @property { InvoicesModels.InvoiceFinanceLineDto[] } financeLines  
 * @property { InvoicesModels.InvoiceRemarksDto } remarks  
 * @property { InvoicesModels.InvoiceVatLineDto[] } vatLines  
 * @property { InvoicesModels.InvoiceConfigDto } config  
 * @property { InvoicesModels.RelatedInvoiceDetailDto } creditNote  
 * @property { InvoicesModels.RelatedInvoiceDetailDto } draftCreditNote  
 * @property { InvoicesModels.RelatedInvoiceDetailDto } cancelledInvoice  
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
 * @property { InvoicesModels.TotalAmountsDto[] } totalAmounts  
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
 * @property { InvoiceTypeEnum } invoiceType  
 * @property { boolean } collective  
 * @property { string } serviceDate  
 * @property { string } internalNumber  
 * @property { string } reference  
 * @property { number } amount  
 * @property { number } netAmount  
 * @property { number } tax  
 * @property { string } currency  
 * @property { string } dueDate  
 * @property { InvoiceStatusEnum } status  
 * @property { string } payDate  
 * @property { number } paidAmount  
 * @property { InvoicesModels.InvoicePreviewPositionDto } position  
 * @property { InvoicesModels.InvoicePreviewReceiverDto } receiver  
 * @property { InvoicesModels.InvoicePreviewReceiverCountryDto } receiverCountry  
 * @property { InvoicesModels.InvoicePreviewClerkDto } clerk  
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
 * @property { InvoicesModels.VatRuleLabelResponseDto[] } vatRules  
 */
export const OfficeInvoicePreviewDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), invoiceNumber: z.string().nullish(), invoiceDirection: CommonModels.InvoiceDirectionEnumSchema, issuingDate: z.iso.datetime({ offset: true }).nullish(), invoiceType: CommonModels.InvoiceTypeEnumSchema, collective: z.boolean(), serviceDate: z.iso.datetime({ offset: true }).nullish(), internalNumber: z.string().nullish(), reference: z.string().nullish(), amount: z.number(), netAmount: z.number(), tax: z.number(), currency: z.string(), dueDate: z.iso.datetime({ offset: true }).nullish(), status: CommonModels.InvoiceStatusEnumSchema, payDate: z.iso.datetime({ offset: true }).nullish(), paidAmount: z.number().nullish(), position: InvoicePreviewPositionDtoSchema.nullish(), receiver: InvoicePreviewReceiverDtoSchema.nullish(), receiverCountry: InvoicePreviewReceiverCountryDtoSchema.nullish(), clerk: InvoicePreviewClerkDtoSchema.nullish(), cancelled: z.boolean(), ok: z.boolean(), isExportedToBookkeeping: z.boolean(), dunningBlock: z.boolean(), invoiceInReview: z.boolean(), vatOk: z.boolean(), comments: z.string().nullish(), paymentComment: z.string().nullish(), creditorId: z.string().nullish(), debtorId: z.string().nullish(), hblNumber: z.string().nullish(), mblNumber: z.string().nullish(), bookingNumber: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), vatRules: z.array(VatRuleLabelResponseDtoSchema).nullish() });
export type OfficeInvoicePreviewDto = z.infer<typeof OfficeInvoicePreviewDtoSchema>;

/** 
 * InvoiceExportFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { DateRangeDto } issuingDate  
 * @property { DateRangeDto } serviceDate  
 * @property { InvoiceDirectionEnum[] } invoiceDirection  
 * @property { InvoiceTypeEnum[] } invoiceType  
 * @property { BooleanFilterEnum[] } collective  
 * @property { number } amountMin  
 * @property { number } amountMax  
 * @property { string[] } currencyNotation  
 * @property { DateRangeDto } dueDate  
 * @property { InvoiceStatusEnum[] } status  
 * @property { string[] } receiver Filter by invoice receiver/customer ID (UUID) 
 * @property { string } positionNumbersString  
 * @property { string[] } positionNumbers  
 * @property { string } invoiceNumbersString  
 * @property { string[] } invoiceNumbers  
 * @property { BooleanFilterEnum[] } bookkeepingExportStatus  
 * @property { BooleanFilterEnum[] } dunningBlock  
 * @property { BooleanFilterEnum[] } invoiceInReview  
 * @property { BooleanFilterEnum[] } isInvoiceOk  
 * @property { BooleanFilterEnum[] } isVatOk  
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
 * @property { InvoicesModels.InvoiceExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { InvoicesModels.InvoiceExportFilterDto } filter  
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
 * @property { InvoicesModels.UninvoicedChargeTotalAmountDto[] } totalAmounts  
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
 * @property { InvoiceDirectionEnum } invoiceDirection Invoice direction (Incoming or Outgoing) 
 * @property { InvoicesModels.ReceiverDto } receiver Business Partner receiving the invoice 
 * @property { InvoicesModels.UninvoicedChargePositionDto } position  
 * @property { InvoicesModels.UninvoicedChargeChargeTypeDto } chargeType  
 * @property { string } currencyNotation ISO 4217 currency code 
 * @property { number } amount Charge amount in charge currency 
 * @property { number } amountInOfficeCurrency Charge amount in office currency 
 * @property { string } officeCurrency Office currency code 
 * @property { number } exchangeRate  
 * @property { InvoicesModels.UninvoicedChargeVatRuleDto } vatRule  
 * @property { string } serviceDate  
 * @property { InvoicesModels.UninvoicedChargeGroupStatusEnum } status Status of charge group 
 * @property { string[] } missingInformation Missing fields required for invoicing this charge 
 * @property { InvoicesModels.UninvoicedChargeEmployeeDto } employee  
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
 * @property { DateRangeDto } serviceDate  
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
 * @property { DateRangeDto } serviceDate  
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
 * @property { DateRangeDto } serviceDate  
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
 * @property { InvoicesModels.UninvoicedChargeExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { InvoicesModels.UninvoicedChargesExportFilterDto } filter  
 */
export const UninvoicedChargesExportRequestDtoSchema = z.object({ columns: z.array(UninvoicedChargeExportColumnSchema).min(1).nullable(), order: z.array(z.string()).nullable(), filter: UninvoicedChargesExportFilterDtoSchema.nullable() }).partial();
export type UninvoicedChargesExportRequestDto = z.infer<typeof UninvoicedChargesExportRequestDtoSchema>;

/** 
 * CreateDraftInvoiceRequestDtoSchema 
 * @type { object }
 * @property { string[] } chargeItemIds Charge item IDs to include in the invoice. Min Items: `1` 
 * @property { InvoiceTypeEnum } invoiceType Type of invoice 
 * @property { string } customerId Customer ID (required for outgoing invoices) 
 * @property { InvoiceDirectionEnum } direction Invoice direction 
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
 * @property { OfficePaymentTermsDateType } paymentTermType  
 * @property { string } serviceRecipientId Service recipient ID 
 * @property { string } bankAccountId Bank account ID 
 * @property { InvoicesModels.UpdateInvoiceRemarksDto } remarks Additional remarks 
 * @property { InvoicesModels.InvoiceLanguageEnum } language Invoice language 
 * @property { boolean } showPaymentInstructions  
 * @property { InvoicesModels.UpdateInvoiceCustomerDto } customer  
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
 * @property { OfficePaymentTermsDateType } paymentTermType  
 * @property { string } receiptDate Update receipt date in ISO format 
 * @property { string } serviceDate Update service date in ISO format 
 * @property { string } serviceDateUntil Update service end date in ISO format 
 * @property { boolean } isVatOk Mark VAT as checked/OK by accounting 
 * @property { boolean } isInvoiceOk Mark overall invoice as checked/OK by accounting 
 * @property { boolean } dunningBlock  
 * @property { boolean } invoiceInReview  
 * @property { string } comments  
 * @property { InvoicesModels.FixInvoiceRemarksDto } remarks Additional remarks 
 * @property { string } invoiceNumber Invoice number (incoming invoices only) 
 * @property { string } bankAccountId Bank account ID 
 * @property { string } serviceRecipientId Service recipient ID 
 * @property { InvoicesModels.FixInvoiceCustomerDto } customer Customer reference (incoming invoices only) 
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
 * @property { InvoicesModels.UpdateIssuedInvoiceChargeRequestDto[] } charges Array of charge updates. Min Items: `1` 
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
 * @property { InvoicesModels.UpdateInvoiceChargeRequestDto[] } charges Array of charge updates. Min Items: `1` 
 */
export const UpdateInvoiceChargesRequestDtoSchema = z.object({ charges: z.array(UpdateInvoiceChargeRequestDtoSchema).min(1) });
export type UpdateInvoiceChargesRequestDto = z.infer<typeof UpdateInvoiceChargesRequestDtoSchema>;

/** 
 * VatRuleTypeEnumSchema 
 * @type { enum }
 */
export const VatRuleTypeEnumSchema = z.enum(["Outgoing", "Incoming"]);
export type VatRuleTypeEnum = z.infer<typeof VatRuleTypeEnumSchema>;
export const VatRuleTypeEnum = VatRuleTypeEnumSchema.enum;

/** 
 * VatRuleFilterDtoSchema 
 * @type { object }
 * @property { string } matchcode Matchcode to filter by 
 * @property { string } name Name to filter by 
 * @property { VatRulesModels.VatRuleTypeEnum } type  
 * @property { string } officeId Office ID to filter by 
 * @property { boolean } archived Filter by archived status 
 * @property { string } search Search to filter by 
 */
export const VatRuleFilterDtoSchema = z.object({ matchcode: z.string().nullable(), name: z.string().nullable(), type: VatRuleTypeEnumSchema.nullable(), officeId: z.string().nullable(), archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type VatRuleFilterDto = z.infer<typeof VatRuleFilterDtoSchema>;

/** 
 * VatRuleEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const VatRuleEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type VatRuleEmployeeDTO = z.infer<typeof VatRuleEmployeeDTOSchema>;

/** 
 * VatRuleOfficeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const VatRuleOfficeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type VatRuleOfficeDTO = z.infer<typeof VatRuleOfficeDTOSchema>;

/** 
 * VatRuleResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchcode  
 * @property { string } name  
 * @property { number } vatPercentage  
 * @property { number } vatNumber VAT rule reference number 
 * @property { boolean } noTax  
 * @property { VatRulesModels.VatRuleTypeEnum } type  
 * @property { boolean } archived  
 * @property { boolean } isReverseCharge  
 * @property { string } createdById  
 * @property { VatRulesModels.VatRuleEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { VatRulesModels.VatRuleEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 * @property { string } officeId  
 * @property { VatRulesModels.VatRuleOfficeDTO } office  
 * @property { string } bookkeepingId  
 * @property { string } bookkeepingTargetAccountNumber  
 */
export const VatRuleResponseDTOSchema = z.object({ id: z.string(), matchcode: z.string(), name: z.string(), vatPercentage: z.number(), vatNumber: z.number().nullish(), noTax: z.boolean().nullish(), type: VatRuleTypeEnumSchema, archived: z.boolean(), isReverseCharge: z.boolean(), createdById: z.string().nullish(), createdBy: VatRuleEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: VatRuleEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), officeId: z.string(), office: VatRuleOfficeDTOSchema.nullish(), bookkeepingId: z.string().nullish(), bookkeepingTargetAccountNumber: z.string().nullish() });
export type VatRuleResponseDTO = z.infer<typeof VatRuleResponseDTOSchema>;

/** 
 * CreateVatRuleRequestDTOSchema 
 * @type { object }
 * @property { string } matchcode Unique matchcode for the VAT rule 
 * @property { string } name Name of the VAT rule 
 * @property { boolean } noTax  
 * @property { number } vatPercentage VAT percentage (0-100). Minimum: `0`. Maximum: `100` 
 * @property { number } vatNumber VAT rule reference number 
 * @property { VatRulesModels.VatRuleTypeEnum } type Type of VAT rule 
 * @property { string } officeId Office ID 
 * @property { boolean } isReverseCharge Is reverse charge VAT rule 
 * @property { string } bookkeepingId Bookkeeping ID 
 * @property { string } bookkeepingTargetAccountNumber Bookkeeping target account number 
 */
export const CreateVatRuleRequestDTOSchema = z.object({ matchcode: z.string(), name: z.string(), noTax: z.boolean().nullish(), vatPercentage: z.number().gte(0).lte(100), vatNumber: z.number().nullish(), type: VatRuleTypeEnumSchema, officeId: z.string(), isReverseCharge: z.boolean().nullish(), bookkeepingId: z.string().nullish(), bookkeepingTargetAccountNumber: z.string().nullish() });
export type CreateVatRuleRequestDTO = z.infer<typeof CreateVatRuleRequestDTOSchema>;

/** 
 * UpdateVatRuleRequestDTOSchema 
 * @type { object }
 * @property { string } matchcode Unique matchcode for the VAT rule 
 * @property { string } name Name of the VAT rule 
 * @property { boolean } noTax  
 * @property { number } vatPercentage VAT percentage (0-100). Minimum: `0`. Maximum: `100` 
 * @property { number } vatNumber VAT rule reference number. Minimum: `0` 
 * @property { VatRulesModels.VatRuleTypeEnum } type Type of VAT rule 
 * @property { string } officeId Office ID 
 * @property { boolean } isReverseCharge Is reverse charge VAT rule 
 * @property { string } bookkeepingId Bookkeeping ID 
 * @property { string } bookkeepingTargetAccountNumber Bookkeeping target account number 
 */
export const UpdateVatRuleRequestDTOSchema = z.object({ matchcode: z.string().nullable(), name: z.string().nullable(), noTax: z.boolean().nullable(), vatPercentage: z.number().gte(0).lte(100).nullable(), vatNumber: z.number().gte(0).nullable(), type: VatRuleTypeEnumSchema.nullable(), officeId: z.string().nullable(), isReverseCharge: z.boolean().nullable(), bookkeepingId: z.string().nullable(), bookkeepingTargetAccountNumber: z.string().nullable() }).partial();
export type UpdateVatRuleRequestDTO = z.infer<typeof UpdateVatRuleRequestDTOSchema>;

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
 * @property { InvoicePaymentsModels.OfficePaymentTotalAmountsDto[] } totalAmounts  
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
 * @property { InvoiceDirectionEnum } invoiceDirection  
 * @property { number } grossAmount  
 * @property { InvoiceStatusEnum } status  
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
 * @property { InvoicePaymentsModels.PaymentMethodEnum } paymentMethod  
 * @property { string } comment  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { InvoicePaymentsModels.OfficePaymentPreviewCreatedByDto } createdBy  
 * @property { InvoicePaymentsModels.OfficePaymentPreviewInvoiceDto } invoice  
 * @property { InvoicePaymentsModels.OfficePaymentBusinessPartnerDto } businessPartner  
 */
export const OfficePaymentPreviewDtoSchema = z.object({ id: z.string(), amount: z.number(), positionNumber: z.string(), currencyNotation: z.string(), paymentDate: z.iso.datetime({ offset: true }), paymentMethod: PaymentMethodEnumSchema, comment: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: OfficePaymentPreviewCreatedByDtoSchema, invoice: OfficePaymentPreviewInvoiceDtoSchema, businessPartner: OfficePaymentBusinessPartnerDtoSchema.nullish() });
export type OfficePaymentPreviewDto = z.infer<typeof OfficePaymentPreviewDtoSchema>;

/** 
 * OfficeInvoicePaymentFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by invoice number 
 * @property { DateRangeDto } paymentDate Filter by payment date range 
 * @property { DateRangeDto } invoiceIssuingDate Filter by invoice issuing date range 
 * @property { InvoiceDirectionEnum[] } invoiceDirection Filter by invoice direction 
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
 * @property { InvoicePaymentsModels.BulkCreatePaymentBusinessPartnerDto[] } businessPartners List of business partners paid in this bulk operation 
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
 * @property { InvoicePaymentsModels.CalculatePaymentItemDto[] } payments  
 * @property { InvoicePaymentsModels.CalculatePaymentTotalDto[] } totals  
 */
export const CalculatePaymentsResponseDtoSchema = z.object({ payments: z.array(CalculatePaymentItemDtoSchema), totals: z.array(CalculatePaymentTotalDtoSchema) });
export type CalculatePaymentsResponseDto = z.infer<typeof CalculatePaymentsResponseDtoSchema>;

/** 
 * OfficeInvoicePaymentExportFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by invoice number 
 * @property { DateRangeDto } paymentDate Filter by payment date range 
 * @property { DateRangeDto } invoiceIssuingDate Filter by invoice issuing date range 
 * @property { InvoiceDirectionEnum[] } invoiceDirection Filter by invoice direction 
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
 * @property { InvoicePaymentsModels.OfficeInvoicePaymentExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { InvoicePaymentsModels.OfficeInvoicePaymentExportFilterDto } filter  
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
 * @property { InvoicePaymentsModels.PaymentMethodEnum } paymentMethod  
 * @property { string } bankAccountId  
 * @property { string } bankAccount  
 * @property { string } comment  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { InvoicePaymentsModels.PaymentCreatedByDto } createdBy  
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
 * @property { InvoicePaymentsModels.PositionInvoicePaymentMethodEnum } paymentMethod Payment method 
 * @property { string } bankAccountId Bank account ID 
 * @property { string } comment Optional comment 
 */
export const CreateInvoicePaymentRequestDtoSchema = z.object({ amount: z.number(), paymentDate: z.iso.datetime({ offset: true }), paymentMethod: PositionInvoicePaymentMethodEnumSchema, bankAccountId: z.string().nullish(), comment: z.string().nullish() });
export type CreateInvoicePaymentRequestDto = z.infer<typeof CreateInvoicePaymentRequestDtoSchema>;

/** 
 * PaymentConfirmationPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PaymentConfirmationPositionDtoSchema = z.object({ id: z.string(), number: z.string() });
export type PaymentConfirmationPositionDto = z.infer<typeof PaymentConfirmationPositionDtoSchema>;

/** 
 * PaymentConfirmationItemDtoSchema 
 * @type { object }
 * @property { string } invoiceId Invoice ID 
 * @property { string } invoiceNumber Invoice number 
 * @property { string } invoiceDate Invoice date 
 * @property { number } invoiceAmount Invoice amount 
 * @property { number } amount Payment amount 
 * @property { string } currencyNotation Currency notation 
 * @property { string } reference Reference 
 * @property { PaymentConfirmationsModels.PaymentConfirmationPositionDto } position Position information 
 * @property { string } paymentDate Payment date 
 */
export const PaymentConfirmationItemDtoSchema = z.object({ invoiceId: z.string(), invoiceNumber: z.string(), invoiceDate: z.iso.datetime({ offset: true }), invoiceAmount: z.number(), amount: z.number(), currencyNotation: z.string(), reference: z.string().nullish(), position: PaymentConfirmationPositionDtoSchema, paymentDate: z.iso.datetime({ offset: true }) });
export type PaymentConfirmationItemDto = z.infer<typeof PaymentConfirmationItemDtoSchema>;

/** 
 * ProjectLiteEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ProjectLiteEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ProjectLiteEmployeeDTO = z.infer<typeof ProjectLiteEmployeeDTOSchema>;

/** 
 * ProjectLiteResponseDTOSchema 
 * @type { object }
 * @property { string } id Project ID 
 * @property { string } name Project name 
 * @property { string } officeId Office ID 
 * @property { boolean } archived Is archived 
 * @property { string } createdById ID of the employee who created this project 
 * @property { ProjectLiteModels.ProjectLiteEmployeeDTO } createdBy Employee who created this project 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this project 
 * @property { ProjectLiteModels.ProjectLiteEmployeeDTO } updatedBy Employee who last updated this project 
 * @property { string } updatedAt Updated at 
 */
export const ProjectLiteResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: ProjectLiteEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ProjectLiteEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ProjectLiteResponseDTO = z.infer<typeof ProjectLiteResponseDTOSchema>;

/** 
 * PositionChecklistCompletedByResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionChecklistCompletedByResponseDtoSchema = z.object({ id: z.string(), name: z.string().nullable() });
export type PositionChecklistCompletedByResponseDto = z.infer<typeof PositionChecklistCompletedByResponseDtoSchema>;

/** 
 * PositionChecklistItemResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } checklistItemId  
 * @property { string } templateId  
 * @property { number } order  
 * @property { boolean } completed  
 * @property { string } completedAt  
 * @property { PositionChecklistModels.PositionChecklistCompletedByResponseDto } completedBy  
 * @property { string } notes  
 * @property { string } name  
 */
export const PositionChecklistItemResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), checklistItemId: z.string(), templateId: z.string().nullable(), order: z.number(), completed: z.boolean(), completedAt: z.iso.datetime({ offset: true }).nullable(), completedBy: PositionChecklistCompletedByResponseDtoSchema.nullable(), notes: z.string().nullable(), name: z.string().nullable() });
export type PositionChecklistItemResponseDto = z.infer<typeof PositionChecklistItemResponseDtoSchema>;

/** 
 * PositionChecklistResponseDtoSchema 
 * @type { object }
 * @property { PositionChecklistModels.PositionChecklistItemResponseDto[] } items  
 * @property { string[] } appliedTemplateIds  
 */
export const PositionChecklistResponseDtoSchema = z.object({ items: z.array(PositionChecklistItemResponseDtoSchema), appliedTemplateIds: z.array(z.string()) });
export type PositionChecklistResponseDto = z.infer<typeof PositionChecklistResponseDtoSchema>;

/** 
 * ChecklistTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChecklistTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ChecklistTemplateEmployeeDTO = z.infer<typeof ChecklistTemplateEmployeeDTOSchema>;

/** 
 * ChecklistTemplateItemResponseDTOSchema 
 * @type { object }
 * @property { string } checklistItemId Checklist item id 
 * @property { number } order Order index 
 * @property { string } name Checklist item name 
 */
export const ChecklistTemplateItemResponseDTOSchema = z.object({ checklistItemId: z.string(), order: z.number(), name: z.string().nullish() });
export type ChecklistTemplateItemResponseDTO = z.infer<typeof ChecklistTemplateItemResponseDTOSchema>;

/** 
 * ChecklistTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id Template id 
 * @property { string } name Template name 
 * @property { string } officeId Office id 
 * @property { boolean } archived Is archived 
 * @property { string } archivedAt Archived at 
 * @property { string } createdById ID of the employee who created this template 
 * @property { ChecklistTemplatesModels.ChecklistTemplateEmployeeDTO } createdBy Employee who created this template 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this template 
 * @property { ChecklistTemplatesModels.ChecklistTemplateEmployeeDTO } updatedBy Employee who last updated this template 
 * @property { string } updatedAt Updated at 
 * @property { ChecklistTemplatesModels.ChecklistTemplateItemResponseDTO[] } items Ordered items 
 */
export const ChecklistTemplateResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: ChecklistTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ChecklistTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), items: z.array(ChecklistTemplateItemResponseDTOSchema) });
export type ChecklistTemplateResponseDTO = z.infer<typeof ChecklistTemplateResponseDTOSchema>;

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
 * @property { BookkeepingExportModels.BookkeepingExportFormatEnum } format  
 * @property { OfficeInvoiceFilterDto } invoiceFilters  
 */
export const CreateBookkeepingExportBatchRequestDtoSchema = z.object({ format: BookkeepingExportFormatEnumSchema.nullish(), invoiceFilters: CommonModels.OfficeInvoiceFilterDtoSchema });
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
 * @property { BookkeepingExportModels.BookkeepingExportFileTypeEnum } variant  
 * @property { string } downloadUrl  
 * @property { string } fileName  
 */
export const BookkeepingExportFileDtoSchema = z.object({ variant: BookkeepingExportFileTypeEnumSchema, downloadUrl: z.string().nullable(), fileName: z.string() });
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
export const BookkeepingExportBatchSummaryDtoSchema = z.object({ totalCount: z.number(), needsReviewCount: z.number(), readyForExportCount: z.number(), excludedCount: z.number(), invoiceNumberRange: z.object({ from: z.string(), to: z.string() }).nullish(), dateRange: z.object({ from: z.iso.datetime({ offset: true }), to: z.iso.datetime({ offset: true }) }).nullish() });
export type BookkeepingExportBatchSummaryDto = z.infer<typeof BookkeepingExportBatchSummaryDtoSchema>;

/** 
 * BookkeepingExportBatchDetailsDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { BookkeepingExportModels.BookkeepingExportFormatEnum } format  
 * @property { BookkeepingExportModels.BookkeepingExportBatchStatusEnum } status  
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
 * @property { BookkeepingExportModels.BookkeepingExportBatchSummaryDto } summary  
 * @property { BookkeepingExportModels.BookkeepingExportFileDto[] } files  
 */
export const BookkeepingExportBatchDetailsDtoSchema = z.object({ id: z.string(), format: BookkeepingExportFormatEnumSchema, status: BookkeepingExportBatchStatusEnumSchema, totalInvoiceCount: z.number(), exportedInvoiceCount: z.number(), createdBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }), createdAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish(), revertedAt: z.iso.datetime({ offset: true }).nullish(), revertedBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }).nullish(), summary: BookkeepingExportBatchSummaryDtoSchema, files: z.array(BookkeepingExportFileDtoSchema).nullish() });
export type BookkeepingExportBatchDetailsDto = z.infer<typeof BookkeepingExportBatchDetailsDtoSchema>;

/** 
 * UpdateBookkeepingExportBatchRequestDtoSchema 
 * @type { object }
 * @property { BookkeepingExportModels.BookkeepingExportFormatEnum } format  
 */
export const UpdateBookkeepingExportBatchRequestDtoSchema = z.object({ format: BookkeepingExportFormatEnumSchema });
export type UpdateBookkeepingExportBatchRequestDto = z.infer<typeof UpdateBookkeepingExportBatchRequestDtoSchema>;

/** 
 * BookkeepingExportBatchPreviewDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { BookkeepingExportModels.BookkeepingExportFormatEnum } format  
 * @property { BookkeepingExportModels.BookkeepingExportBatchStatusEnum } status  
 * @property { number } totalInvoiceCount  
 * @property { number } exportedInvoiceCount  
 * @property { object } createdBy  
 * @property { string } createdBy.id  
 * @property { string } createdBy.fullName  
 * @property { string } createdBy.email  
 * @property { string } createdAt  
 * @property { string } exportedAt  
 * @property { string } revertedAt  
 * @property { BookkeepingExportModels.BookkeepingExportFileDto[] } files  
 */
export const BookkeepingExportBatchPreviewDtoSchema = z.object({ id: z.string(), format: BookkeepingExportFormatEnumSchema, status: BookkeepingExportBatchStatusEnumSchema, totalInvoiceCount: z.number(), exportedInvoiceCount: z.number(), createdBy: z.object({ id: z.string(), fullName: z.string(), email: z.string() }), createdAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish(), revertedAt: z.iso.datetime({ offset: true }).nullish(), files: z.array(BookkeepingExportFileDtoSchema).nullish() });
export type BookkeepingExportBatchPreviewDto = z.infer<typeof BookkeepingExportBatchPreviewDtoSchema>;

/** 
 * DateRangeSchema 
 * @type { object }
 * @property { string } from  
 * @property { string } to  
 */
export const DateRangeSchema = z.object({ from: z.iso.datetime({ offset: true }).nullable(), to: z.iso.datetime({ offset: true }).nullable() }).partial();
export type DateRange = z.infer<typeof DateRangeSchema>;

/** 
 * BookkeepingExportBatchPreviewFilterDtoSchema 
 * @type { object }
 * @property { BookkeepingExportModels.DateRange } createdDate  
 * @property { BookkeepingExportModels.BookkeepingExportBatchStatusEnum[] } status  
 * @property { BookkeepingExportModels.BookkeepingExportFormatEnum[] } format  
 * @property { string[] } createdBy  
 */
export const BookkeepingExportBatchPreviewFilterDtoSchema = z.object({ createdDate: DateRangeSchema.nullable(), status: z.array(BookkeepingExportBatchStatusEnumSchema).nullable(), format: z.array(BookkeepingExportFormatEnumSchema).nullable(), createdBy: z.array(z.string()).nullable() }).partial();
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
 * @property { BookkeepingExportModels.BookkeepingExportBatchItemStatusEnum } status  
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
export const BookkeepingExportItemDetailDtoSchema = z.object({ id: z.string(), invoiceId: z.string(), status: BookkeepingExportBatchItemStatusEnumSchema, includedInExport: z.boolean(), validationIssues: z.array(z.string()).nullish(), invoice: z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), currency: z.string(), amount: z.number(), tax: z.number(), vatRules: z.array(z.string()) }), receiver: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), account: z.string(), contraAccount: z.string() }), comments: z.string().nullish() });
export type BookkeepingExportItemDetailDto = z.infer<typeof BookkeepingExportItemDetailDtoSchema>;

/** 
 * BookkeepingExportItemDetailFilterDtoSchema 
 * @type { object }
 * @property { BookkeepingExportModels.BookkeepingExportBatchItemStatusEnum[] } status  
 */
export const BookkeepingExportItemDetailFilterDtoSchema = z.object({ status: z.array(BookkeepingExportBatchItemStatusEnumSchema).nullable() }).partial();
export type BookkeepingExportItemDetailFilterDto = z.infer<typeof BookkeepingExportItemDetailFilterDtoSchema>;

/** 
 * BookkeepingExportVatLineItemDtoSchema 
 * @type { object }
 * @property { string } invoiceId  
 * @property { string } batchId  
 * @property { string } batchItemId  
 * @property { BookkeepingExportModels.BookkeepingExportBatchItemStatusEnum } status  
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
export const BookkeepingExportVatLineItemDtoSchema = z.object({ invoiceId: z.string(), batchId: z.string(), batchItemId: z.string(), status: BookkeepingExportBatchItemStatusEnumSchema, includedInExport: z.boolean(), validationIssues: z.array(z.string()).nullish(), invoice: z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), currency: z.string(), amount: z.number(), tax: z.number(), comments: z.string().nullish() }), receiver: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), account: z.string(), contraAccount: z.string() }), vatPercentage: z.number(), vatRule: z.string(), netAmount: z.number(), vatAmount: z.number(), grossAmount: z.number(), vatAmountInOfficeCurrency: z.number().nullish(), netAmountInOfficeCurrency: z.number().nullish(), grossAmountInOfficeCurrency: z.number().nullish(), officeCurrency: z.string() });
export type BookkeepingExportVatLineItemDto = z.infer<typeof BookkeepingExportVatLineItemDtoSchema>;

/** 
 * FactoringExportBatchStatusEnumSchema 
 * @type { enum }
 */
export const FactoringExportBatchStatusEnumSchema = z.enum(["Initializing", "Preparing", "Exported", "Failed"]);
export type FactoringExportBatchStatusEnum = z.infer<typeof FactoringExportBatchStatusEnumSchema>;
export const FactoringExportBatchStatusEnum = FactoringExportBatchStatusEnumSchema.enum;

/** 
 * FactoringExportBatchResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { FactoringExportModels.FactoringExportBatchStatusEnum } status  
 * @property { number } totalInvoices  
 * @property { number } totalAmount  
 * @property { string } currencyNotation  
 * @property { string } jobId  
 * @property { string } eurFileUrl  
 * @property { string } usdFileUrl  
 * @property { string } createdById  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } exportedAt  
 */
export const FactoringExportBatchResponseDtoSchema = z.object({ id: z.string(), officeId: z.string(), status: FactoringExportBatchStatusEnumSchema, totalInvoices: z.number(), totalAmount: z.number(), currencyNotation: z.string(), jobId: z.string().nullish(), eurFileUrl: z.string().nullish(), usdFileUrl: z.string().nullish(), createdById: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish() });
export type FactoringExportBatchResponseDto = z.infer<typeof FactoringExportBatchResponseDtoSchema>;

/** 
 * FileMetadataDtoSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType File MIME type 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const FileMetadataDtoSchema = z.object({ fileName: z.string(), mimeType: z.string(), fileSize: z.number().gte(1) });
export type FileMetadataDto = z.infer<typeof FileMetadataDtoSchema>;

/** 
 * PrepareFactoringMergeRequestDtoSchema 
 * @type { object }
 * @property { FactoringMergeModels.FileMetadataDto } eurDebtorFile EUR debtor file metadata 
 * @property { FactoringMergeModels.FileMetadataDto } eurOperationsFile EUR operations file metadata 
 * @property { FactoringMergeModels.FileMetadataDto } eurExistingFactoringFile EUR existing factoring file metadata (optional) 
 * @property { FactoringMergeModels.FileMetadataDto } usdDebtorFile USD debtor file metadata 
 * @property { FactoringMergeModels.FileMetadataDto } usdOperationsFile USD operations file metadata 
 * @property { FactoringMergeModels.FileMetadataDto } usdExistingFactoringFile USD existing factoring file metadata (optional) 
 */
export const PrepareFactoringMergeRequestDtoSchema = z.object({ eurDebtorFile: FileMetadataDtoSchema.nullable(), eurOperationsFile: FileMetadataDtoSchema.nullable(), eurExistingFactoringFile: FileMetadataDtoSchema.nullable(), usdDebtorFile: FileMetadataDtoSchema.nullable(), usdOperationsFile: FileMetadataDtoSchema.nullable(), usdExistingFactoringFile: FileMetadataDtoSchema.nullable() }).partial();
export type PrepareFactoringMergeRequestDto = z.infer<typeof PrepareFactoringMergeRequestDtoSchema>;

/** 
 * MediaUploadInstructionsDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } method  
 * @property { string } url  
 */
export const MediaUploadInstructionsDtoSchema = z.object({ id: z.string(), method: z.string(), url: z.string() });
export type MediaUploadInstructionsDto = z.infer<typeof MediaUploadInstructionsDtoSchema>;

/** 
 * FactoringMergeUploadInstructionsResponseDtoSchema 
 * @type { object }
 * @property { string } batchId  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } eurDebtorFile  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } eurOperationsFile  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } eurExistingFactoringFile  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } usdDebtorFile  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } usdOperationsFile  
 * @property { FactoringMergeModels.MediaUploadInstructionsDto } usdExistingFactoringFile  
 */
export const FactoringMergeUploadInstructionsResponseDtoSchema = z.object({ batchId: z.string(), eurDebtorFile: MediaUploadInstructionsDtoSchema.nullish(), eurOperationsFile: MediaUploadInstructionsDtoSchema.nullish(), eurExistingFactoringFile: MediaUploadInstructionsDtoSchema.nullish(), usdDebtorFile: MediaUploadInstructionsDtoSchema.nullish(), usdOperationsFile: MediaUploadInstructionsDtoSchema.nullish(), usdExistingFactoringFile: MediaUploadInstructionsDtoSchema.nullish() });
export type FactoringMergeUploadInstructionsResponseDto = z.infer<typeof FactoringMergeUploadInstructionsResponseDtoSchema>;

/** 
 * FactoringMergeBatchStatusEnumSchema 
 * @type { enum }
 */
export const FactoringMergeBatchStatusEnumSchema = z.enum(["Initializing", "Processing", "Completed", "Failed"]);
export type FactoringMergeBatchStatusEnum = z.infer<typeof FactoringMergeBatchStatusEnumSchema>;
export const FactoringMergeBatchStatusEnum = FactoringMergeBatchStatusEnumSchema.enum;

/** 
 * FactoringMergeBatchResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { FactoringMergeModels.FactoringMergeBatchStatusEnum } status  
 * @property { string } eurDebtorFileMediaId  
 * @property { string } eurOperationsFileMediaId  
 * @property { string } eurExistingFactoringFileMediaId  
 * @property { string } usdDebtorFileMediaId  
 * @property { string } usdOperationsFileMediaId  
 * @property { string } usdExistingFactoringFileMediaId  
 * @property { string } eurResultFileMediaId  
 * @property { string } eurResultFileUrl  
 * @property { string } usdResultFileMediaId  
 * @property { string } usdResultFileUrl  
 * @property { string } jobId  
 * @property { string } errorMessage  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } completedAt  
 */
export const FactoringMergeBatchResponseDtoSchema = z.object({ id: z.string(), officeId: z.string(), status: FactoringMergeBatchStatusEnumSchema, eurDebtorFileMediaId: z.string().nullish(), eurOperationsFileMediaId: z.string().nullish(), eurExistingFactoringFileMediaId: z.string().nullish(), usdDebtorFileMediaId: z.string().nullish(), usdOperationsFileMediaId: z.string().nullish(), usdExistingFactoringFileMediaId: z.string().nullish(), eurResultFileMediaId: z.string().nullish(), eurResultFileUrl: z.string().nullish(), usdResultFileMediaId: z.string().nullish(), usdResultFileUrl: z.string().nullish(), jobId: z.string().nullish(), errorMessage: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), completedAt: z.iso.datetime({ offset: true }).nullish() });
export type FactoringMergeBatchResponseDto = z.infer<typeof FactoringMergeBatchResponseDtoSchema>;

/** 
 * AWBStockBusinessPartnerPreviewDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } name Business partner name 
 * @property { string } carrierPrefix Carrier prefix (3 digits) 
 */
export const AWBStockBusinessPartnerPreviewDTOSchema = z.object({ id: z.string(), name: z.string(), carrierPrefix: z.string() });
export type AWBStockBusinessPartnerPreviewDTO = z.infer<typeof AWBStockBusinessPartnerPreviewDTOSchema>;

/** 
 * AWBStockEmployeePreviewDTOSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Employee email 
 */
export const AWBStockEmployeePreviewDTOSchema = z.object({ id: z.string(), email: z.string() });
export type AWBStockEmployeePreviewDTO = z.infer<typeof AWBStockEmployeePreviewDTOSchema>;

/** 
 * AWBStockResponseDTOSchema 
 * @type { object }
 * @property { string } id AWB stock ID 
 * @property { AWBStocksModels.AWBStockBusinessPartnerPreviewDTO } carrier Carrier business partner 
 * @property { number } startNumber Start number 
 * @property { number } lastUsedNumber Last used number 
 * @property { number } stock Stock size 
 * @property { number } usedCodes Used codes count 
 * @property { number } priority Priority 
 * @property { boolean } archived Is archived 
 * @property { string } comments Comments 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { AWBStocksModels.AWBStockEmployeePreviewDTO } createdBy User who created the stock 
 * @property { AWBStocksModels.AWBStockEmployeePreviewDTO } updatedBy User who updated the stock 
 * @property { string } officeId Office ID 
 */
export const AWBStockResponseDTOSchema = z.object({ id: z.string(), carrier: AWBStockBusinessPartnerPreviewDTOSchema, startNumber: z.number(), lastUsedNumber: z.number().nullish(), stock: z.number(), usedCodes: z.number(), priority: z.number(), archived: z.boolean(), comments: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: AWBStockEmployeePreviewDTOSchema, updatedBy: AWBStockEmployeePreviewDTOSchema.nullish(), officeId: z.string() });
export type AWBStockResponseDTO = z.infer<typeof AWBStockResponseDTOSchema>;

/** 
 * MasterDataTypeEnumSchema 
 * @type { enum }
 */
export const MasterDataTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "City", "Warehouse", "ContainerYard", "PortTerminal", "AirportTerminal", "Port", "Airport"]);
export type MasterDataTypeEnum = z.infer<typeof MasterDataTypeEnumSchema>;
export const MasterDataTypeEnum = MasterDataTypeEnumSchema.enum;

/** 
 * MasterDataItemResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the item 
 * @property { string } name Name of the item 
 * @property { MasterDataModels.MasterDataTypeEnum } type Type of the item 
 */
export const MasterDataItemResponseDTOSchema = z.object({ id: z.string(), name: z.string(), type: MasterDataTypeEnumSchema });
export type MasterDataItemResponseDTO = z.infer<typeof MasterDataItemResponseDTOSchema>;

/** 
 * MasterDataItemsResponseDTOSchema 
 * @type { object }
 * @property { MasterDataModels.MasterDataItemResponseDTO[] } items List of master data items 
 */
export const MasterDataItemsResponseDTOSchema = z.object({ items: z.array(MasterDataItemResponseDTOSchema) });
export type MasterDataItemsResponseDTO = z.infer<typeof MasterDataItemsResponseDTOSchema>;

/** 
 * MasterDataLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the item 
 * @property { string } label Label of the item 
 * @property { MasterDataModels.MasterDataTypeEnum } type Type of the item 
 */
export const MasterDataLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), type: MasterDataTypeEnumSchema });
export type MasterDataLabelResponseDTO = z.infer<typeof MasterDataLabelResponseDTOSchema>;

/** 
 * ContainerYardEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ContainerYardEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ContainerYardEmployeeDTO = z.infer<typeof ContainerYardEmployeeDTOSchema>;

/** 
 * ContainerYardResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } matchCode Container yard match code 
 * @property { string } shortName Container yard short name 
 * @property { string } name Container yard name 
 * @property { boolean } archived Whether the container yard is archived 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { object } city  
 * @property { string } city.id  
 * @property { string } city.name  
 * @property { object } country  
 * @property { string } country.id  
 * @property { string } country.name  
 * @property { string } country.isoCode2  
 * @property { string } country.isoCode3  
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 * @property { string } createdById  
 * @property { ContainerYardsModels.ContainerYardEmployeeDTO } createdBy  
 * @property { string } createdAt Date when the container yard was created 
 * @property { string } updatedById  
 * @property { ContainerYardsModels.ContainerYardEmployeeDTO } updatedBy  
 * @property { string } updatedAt Date when the container yard was last updated 
 */
export const ContainerYardResponseDTOSchema = z.object({ id: z.string(), matchCode: z.string(), shortName: z.string().nullish(), name: z.string(), archived: z.boolean(), street: z.string().nullish(), secondaryStreet: z.string().nullish(), zip: z.string().nullish(), city: z.object({ id: z.string(), name: z.string() }).nullish(), country: z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() }).nullish(), district: z.string().nullish(), additionalInformation: z.string().nullish(), createdById: z.string().nullish(), createdBy: ContainerYardEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ContainerYardEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ContainerYardResponseDTO = z.infer<typeof ContainerYardResponseDTOSchema>;

/** 
 * ChecklistItemEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChecklistItemEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type ChecklistItemEmployeeDTO = z.infer<typeof ChecklistItemEmployeeDTOSchema>;

/** 
 * ChecklistItemResponseDTOSchema 
 * @type { object }
 * @property { string } id Checklist item ID 
 * @property { string } name Checklist item name 
 * @property { string } officeId Office ID 
 * @property { boolean } archived Is archived 
 * @property { string } archivedAt Archived at 
 * @property { string } createdById ID of the employee who created this checklist item 
 * @property { ChecklistItemsModels.ChecklistItemEmployeeDTO } createdBy Employee who created this checklist item 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this checklist item 
 * @property { ChecklistItemsModels.ChecklistItemEmployeeDTO } updatedBy Employee who last updated this checklist item 
 * @property { string } updatedAt Updated at 
 */
export const ChecklistItemResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: ChecklistItemEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ChecklistItemEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ChecklistItemResponseDTO = z.infer<typeof ChecklistItemResponseDTOSchema>;

/** 
 * ImportTypeEnumSchema 
 * @type { enum }
 */
export const ImportTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "Warehouse"]);
export type ImportTypeEnum = z.infer<typeof ImportTypeEnumSchema>;
export const ImportTypeEnum = ImportTypeEnumSchema.enum;

/** 
 * MasterDataImportRequestDtoSchema 
 * @type { object }
 * @property { string } mediaId Media ID of the uploaded file 
 * @property { MasterDataImportModels.ImportTypeEnum } type Type of data to import 
 */
export const MasterDataImportRequestDtoSchema = z.object({ mediaId: z.string(), type: ImportTypeEnumSchema });
export type MasterDataImportRequestDto = z.infer<typeof MasterDataImportRequestDtoSchema>;

/** 
 * ImportResultDtoSchema 
 * @type { object }
 * @property { string } importStatus Import result status 
 * @property { string } downloadUrl S3 presigned URL for result file download 
 * @property { string } expiresAt Download URL expiration time 
 * @property { string } errorCode  
 */
export const ImportResultDtoSchema = z.object({ importStatus: ImportStatusEnumSchema.nullish(), downloadUrl: z.string(), expiresAt: z.iso.datetime({ offset: true }).nullish(), errorCode: z.string().nullish() });
export type ImportResultDto = z.infer<typeof ImportResultDtoSchema>;

/** 
 * ImportStatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Current job status 
 * @property { MasterDataImportModels.ImportResultDto } result Import result data when job is completed 
 */
export const ImportStatusResponseDtoSchema = z.object({ status: z.string().nullable(), result: ImportResultDtoSchema.nullish() });
export type ImportStatusResponseDto = z.infer<typeof ImportStatusResponseDtoSchema>;

/** 
 * RemarkTemplateLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { EditorContentResponseDto } content Remark template content 
 */
export const RemarkTemplateLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), content: CommonModels.EditorContentResponseDtoSchema });
export type RemarkTemplateLabelResponseDTO = z.infer<typeof RemarkTemplateLabelResponseDTOSchema>;

/** 
 * RemarkTemplateEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const RemarkTemplateEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type RemarkTemplateEmployeeDTO = z.infer<typeof RemarkTemplateEmployeeDTOSchema>;

/** 
 * OnlyUsedForEnumSchema 
 * @type { enum }
 */
export const OnlyUsedForEnumSchema = z.enum(["transport-order", "export-declaration", "house-bl", "master-bl", "house-awb", "master-awb", "bl-instructions", "ams-instructions", "cmr-form", "fcr-form", "isf-form", "templated-document", "invoice", "quote-document", "shipping-instructions", "position-office-notes", "invoice-body-remarks", "business-partner-office-notes"]);
export type OnlyUsedForEnum = z.infer<typeof OnlyUsedForEnumSchema>;
export const OnlyUsedForEnum = OnlyUsedForEnumSchema.enum;

/** 
 * RemarkTemplateResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } name Template name 
 * @property { EditorContentResponseDto } content Template content 
 * @property { string[] } onlyUsedFor Restrict template usage to specific document types 
 * @property { boolean } archived  
 * @property { string } createdById  
 * @property { RemarkTemplatesModels.RemarkTemplateEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { RemarkTemplatesModels.RemarkTemplateEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const RemarkTemplateResponseDTOSchema = z.object({ id: z.string(), officeId: z.string(), name: z.string(), content: CommonModels.EditorContentResponseDtoSchema, onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullish(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: RemarkTemplateEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: RemarkTemplateEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type RemarkTemplateResponseDTO = z.infer<typeof RemarkTemplateResponseDTOSchema>;

/** 
 * CreateRemarkTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { EditorContentUpdateDto } content Template content 
 * @property { RemarkTemplatesModels.OnlyUsedForEnum[] } onlyUsedFor Restrict template usage to specific document types 
 */
export const CreateRemarkTemplateRequestDTOSchema = z.object({ name: z.string(), content: CommonModels.EditorContentUpdateDtoSchema, onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullish() });
export type CreateRemarkTemplateRequestDTO = z.infer<typeof CreateRemarkTemplateRequestDTOSchema>;

/** 
 * UpdateRemarkTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Template name 
 * @property { EditorContentUpdateDto } content Template content 
 * @property { string[] } onlyUsedFor Restrict template usage to specific document types 
 * @property { boolean } archived Archive status 
 */
export const UpdateRemarkTemplateRequestDTOSchema = z.object({ name: z.string().nullable(), content: CommonModels.EditorContentUpdateDtoSchema.nullable(), onlyUsedFor: z.array(OnlyUsedForEnumSchema).nullable(), archived: z.boolean().nullable() }).partial();
export type UpdateRemarkTemplateRequestDTO = z.infer<typeof UpdateRemarkTemplateRequestDTOSchema>;

/** 
 * IntegrationChannelBusinessPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const IntegrationChannelBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type IntegrationChannelBusinessPartnerResponseDto = z.infer<typeof IntegrationChannelBusinessPartnerResponseDtoSchema>;

/** 
 * IntegrationChannelEmployeeResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const IntegrationChannelEmployeeResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type IntegrationChannelEmployeeResponseDto = z.infer<typeof IntegrationChannelEmployeeResponseDtoSchema>;

/** 
 * IntegrationChannelResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { string } businessPartnerId  
 * @property { IntegrationChannelsModels.IntegrationChannelBusinessPartnerResponseDto } businessPartner  
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
 * @property { IntegrationChannelsModels.IntegrationChannelEmployeeResponseDto } createdBy  
 * @property { string } updatedAt  
 * @property { string } updatedById  
 * @property { IntegrationChannelsModels.IntegrationChannelEmployeeResponseDto } updatedBy  
 */
export const IntegrationChannelResponseDtoSchema = z.object({ id: z.string(), officeId: z.string(), businessPartnerId: z.string(), businessPartner: IntegrationChannelBusinessPartnerResponseDtoSchema, employeeId: z.string(), name: z.string(), archived: z.boolean(), sftpHost: z.string(), sftpPort: z.number(), sftpUsername: z.string(), inboundPath: z.string(), outboundPath: z.string(), pollingFrequencyMinutes: z.number(), lastPolledAt: z.iso.datetime({ offset: true }).nullish(), createdAt: z.iso.datetime({ offset: true }), createdById: z.string(), createdBy: IntegrationChannelEmployeeResponseDtoSchema, updatedAt: z.iso.datetime({ offset: true }), updatedById: z.string(), updatedBy: IntegrationChannelEmployeeResponseDtoSchema });
export type IntegrationChannelResponseDto = z.infer<typeof IntegrationChannelResponseDtoSchema>;

/** 
 * IntegrationMessageChannelResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const IntegrationMessageChannelResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type IntegrationMessageChannelResponseDto = z.infer<typeof IntegrationMessageChannelResponseDtoSchema>;

/** 
 * IntegrationMessageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { IntegrationMessagesModels.IntegrationMessageChannelResponseDto } integrationChannel  
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
export const IntegrationMessageResponseDtoSchema = z.object({ id: z.string(), integrationChannel: IntegrationMessageChannelResponseDtoSchema, positionId: z.string().nullish(), positionNumber: z.string().nullish(), direction: z.string(), format: z.string(), status: z.string(), rawContent: z.string(), fileName: z.string(), errorMessage: z.string().nullish(), processedAt: z.iso.datetime({ offset: true }).nullish(), sentAt: z.iso.datetime({ offset: true }).nullish(), createdAt: z.iso.datetime({ offset: true }) });
export type IntegrationMessageResponseDto = z.infer<typeof IntegrationMessageResponseDtoSchema>;

/** 
 * VesselDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { number } imo  
 * @property { number } mmsi  
 */
export const VesselDtoSchema = z.object({ name: z.string(), imo: z.number().nullish(), mmsi: z.number().nullish() });
export type VesselDto = z.infer<typeof VesselDtoSchema>;

/** 
 * BookingListItemDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } bookingNumber  
 * @property { string } ets  
 * @property { string } eta  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 */
export const BookingListItemDtoSchema = z.object({ id: z.string(), bookingNumber: z.string().nullable(), ets: z.iso.datetime({ offset: true }).nullable(), eta: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable() });
export type BookingListItemDto = z.infer<typeof BookingListItemDtoSchema>;

/** 
 * BookingContainerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } containerNumber  
 * @property { string } type  
 * @property { string } loadType  
 * @property { string } stuffedInContainer  
 * @property { string[] } hsCode  
 * @property { number } noS  
 * @property { number } weight  
 * @property { string } lastEventLocation  
 * @property { string } lastEventName  
 * @property { string } lastEventDate  
 * @property { string } seals  
 */
export const BookingContainerDtoSchema = z.object({ id: z.string(), containerNumber: z.string().nullable(), type: z.string().nullable(), loadType: z.string().nullable(), stuffedInContainer: z.iso.datetime({ offset: true }).nullable(), hsCode: z.array(z.string()).nullable(), noS: z.number().nullable(), weight: z.number().nullable(), lastEventLocation: z.string().nullable(), lastEventName: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), seals: z.string().nullable() });
export type BookingContainerDto = z.infer<typeof BookingContainerDtoSchema>;

/** 
 * BookingPackageDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } packageNumber  
 * @property { string } containerNumber  
 * @property { string } type  
 * @property { string } description  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 */
export const BookingPackageDtoSchema = z.object({ id: z.string(), packageNumber: z.string(), containerNumber: z.string().nullable(), type: z.string().nullable(), description: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable() });
export type BookingPackageDto = z.infer<typeof BookingPackageDtoSchema>;

/** 
 * BookingResponseDtoSchema 
 * @type { object }
 * @property { string } bookingNumber  
 * @property { string } ets  
 * @property { string } etaPod  
 * @property { string } etaFinalDeliveryPlace  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } destination  
 * @property { string } lastEvent  
 * @property { string[] } files  
 * @property { string } poNumber  
 * @property { string } blNumber  
 * @property { ControlTowerBookingsModels.BookingContainerDto[] } containers  
 * @property { ControlTowerBookingsModels.BookingPackageDto[] } packages  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 * @property { string } id  
 */
export const BookingResponseDtoSchema = z.object({ bookingNumber: z.string().nullable(), ets: z.iso.datetime({ offset: true }).nullable(), etaPod: z.iso.datetime({ offset: true }).nullable(), etaFinalDeliveryPlace: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), destination: z.string().nullable(), lastEvent: z.string().nullable(), files: z.array(z.string()).nullable(), poNumber: z.string().nullable(), blNumber: z.string().nullable(), containers: z.array(BookingContainerDtoSchema).nullish(), packages: z.array(BookingPackageDtoSchema).nullish(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable(), id: z.string() });
export type BookingResponseDto = z.infer<typeof BookingResponseDtoSchema>;

/** 
 * PackageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } poNumber  
 * @property { string } bookingNumber  
 * @property { string } blNumber  
 * @property { string } containerNumber  
 * @property { string } packageNumber  
 * @property { string } description  
 * @property { number } netWeight  
 * @property { number } grossWeight  
 * @property { number } length  
 * @property { number } width  
 * @property { number } height  
 * @property { number } volume  
 * @property { string } storageInstruction  
 * @property { string } destination  
 * @property { string[] } files  
 * @property { string } ets  
 * @property { string } eta  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 */
export const PackageResponseDtoSchema = z.object({ id: z.string(), poNumber: z.string().nullable(), bookingNumber: z.string().nullable(), blNumber: z.string().nullable(), containerNumber: z.string().nullable(), packageNumber: z.string().nullable(), description: z.string().nullable(), netWeight: z.number().nullable(), grossWeight: z.number().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), volume: z.number().nullable(), storageInstruction: z.string().nullable(), destination: z.string().nullable(), files: z.array(z.string()).nullable(), ets: z.iso.datetime({ offset: true }).nullable(), eta: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable() });
export type PackageResponseDto = z.infer<typeof PackageResponseDtoSchema>;

/** 
 * PackageListItemDtoSchema 
 * @type { object }
 * @property { string } packageNumber  
 * @property { string } bookingId  
 * @property { string } id  
 * @property { string } ets  
 * @property { string } eta  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 */
export const PackageListItemDtoSchema = z.object({ packageNumber: z.string(), bookingId: z.string(), id: z.string(), ets: z.iso.datetime({ offset: true }).nullable(), eta: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable() });
export type PackageListItemDto = z.infer<typeof PackageListItemDtoSchema>;

/** 
 * ContainerListItemDtoSchema 
 * @type { object }
 * @property { string } containerNumber  
 * @property { string } id  
 * @property { string } ets  
 * @property { string } eta  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 */
export const ContainerListItemDtoSchema = z.object({ containerNumber: z.string().nullable(), id: z.string(), ets: z.iso.datetime({ offset: true }).nullable(), eta: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable() });
export type ContainerListItemDto = z.infer<typeof ContainerListItemDtoSchema>;

/** 
 * ContainerEventDtoSchema 
 * @type { object }
 * @property { VesselDto } vessel  
 * @property { string } name  
 * @property { string } date  
 * @property { boolean } checkedIn  
 */
export const ContainerEventDtoSchema = z.object({ vessel: CommonModels.VesselDtoSchema.nullable(), name: z.string(), date: z.iso.datetime({ offset: true }).nullable(), checkedIn: z.boolean() });
export type ContainerEventDto = z.infer<typeof ContainerEventDtoSchema>;

/** 
 * ContainerJourneyDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } country  
 * @property { string } terminal  
 * @property { boolean } checkedIn  
 * @property { ControlTowerContainersModels.ContainerEventDto[] } events  
 */
export const ContainerJourneyDtoSchema = z.object({ id: z.string(), country: z.string().nullable(), terminal: z.string().nullable(), checkedIn: z.boolean(), events: z.array(ContainerEventDtoSchema) });
export type ContainerJourneyDto = z.infer<typeof ContainerJourneyDtoSchema>;

/** 
 * PackageNumberDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } type  
 * @property { string } description  
 */
export const PackageNumberDtoSchema = z.object({ id: z.string(), type: z.string().nullable(), description: z.string() });
export type PackageNumberDto = z.infer<typeof PackageNumberDtoSchema>;

/** 
 * ContainerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } containerNumber  
 * @property { string } poNumber  
 * @property { string } bookingNumber  
 * @property { string } blNumber  
 * @property { string } stuffedInContainer  
 * @property { string } containerType  
 * @property { string } loadType  
 * @property { string[] } hsCode  
 * @property { number } totalVolume  
 * @property { number } totalWeight  
 * @property { string } cargoDescription  
 * @property { number } noS  
 * @property { ControlTowerContainersModels.ContainerJourneyDto[] } journeys  
 * @property { ControlTowerContainersModels.PackageNumberDto[] } packages  
 * @property { string } bookingId  
 * @property { string } destination  
 * @property { string[] } files  
 * @property { string } ets  
 * @property { string } eta  
 * @property { string } supplierName  
 * @property { string } supplierAddress  
 * @property { string } lastEvent  
 * @property { string } lastEventLocation  
 * @property { string } lastEventDate  
 * @property { string } journeyFrom  
 * @property { string } journeyTo  
 * @property { VesselDto } vessel  
 */
export const ContainerResponseDtoSchema = z.object({ id: z.string(), containerNumber: z.string().nullable(), poNumber: z.string().nullable(), bookingNumber: z.string().nullable(), blNumber: z.string().nullable(), stuffedInContainer: z.iso.datetime({ offset: true }).nullable(), containerType: z.string().nullable(), loadType: z.string().nullable(), hsCode: z.array(z.string()).nullable(), totalVolume: z.number().nullable(), totalWeight: z.number().nullable(), cargoDescription: z.string().nullable(), noS: z.number().nullable(), journeys: z.array(ContainerJourneyDtoSchema).nullish(), packages: z.array(PackageNumberDtoSchema).nullish(), bookingId: z.string().nullable(), destination: z.string().nullable(), files: z.array(z.string()).nullable(), ets: z.iso.datetime({ offset: true }).nullable(), eta: z.iso.datetime({ offset: true }).nullable(), supplierName: z.string().nullable(), supplierAddress: z.string().nullable(), lastEvent: z.string().nullable(), lastEventLocation: z.string().nullable(), lastEventDate: z.iso.datetime({ offset: true }).nullable(), journeyFrom: z.string().nullable(), journeyTo: z.string().nullable(), vessel: CommonModels.VesselDtoSchema.nullable() });
export type ContainerResponseDto = z.infer<typeof ContainerResponseDtoSchema>;

/** 
 * ContainerJourneyResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { ControlTowerContainersModels.ContainerJourneyDto[] } journeys  
 * @property { string[] } packageNumbers  
 */
export const ContainerJourneyResponseDtoSchema = z.object({ id: z.string(), number: z.string(), journeys: z.array(ContainerJourneyDtoSchema), packageNumbers: z.array(z.string()) });
export type ContainerJourneyResponseDto = z.infer<typeof ContainerJourneyResponseDtoSchema>;

/** 
 * LinksDtoSchema 
 * @type { object }
 * @property { string } self  
 * @property { string } related  
 */
export const LinksDtoSchema = z.object({ self: z.string().nullable(), related: z.string().nullable() }).partial();
export type LinksDto = z.infer<typeof LinksDtoSchema>;

/** 
 * ApiResponseDataDtoSchema 
 * @type { object }
 * @property { string } type  
 * @property { string } id  
 * @property { object } attributes  
 * @property { object } relationships  
 * @property { ControlTowerMeModels.LinksDto } links  
 */
export const ApiResponseDataDtoSchema = z.object({ type: z.string(), id: z.string(), attributes: z.object({}).nullish(), relationships: z.object({}).nullish(), links: LinksDtoSchema.nullish() });
export type ApiResponseDataDto = z.infer<typeof ApiResponseDataDtoSchema>;

/** 
 * PaginationLinksDtoSchema 
 * @type { object }
 * @property { string } next  
 * @property { string } self  
 * @property { string } last  
 */
export const PaginationLinksDtoSchema = z.object({ next: z.string().nullable(), self: z.string().nullable(), last: z.string().nullable() }).partial();
export type PaginationLinksDto = z.infer<typeof PaginationLinksDtoSchema>;

/** 
 * ApiResponseDtoSchema 
 * @type { object }
 * @property { ControlTowerMeModels.ApiResponseDataDto } data  
 * @property { ControlTowerMeModels.PaginationLinksDto } links  
 */
export const ApiResponseDtoSchema = z.object({ data: ApiResponseDataDtoSchema, links: PaginationLinksDtoSchema.nullish() });
export type ApiResponseDto = z.infer<typeof ApiResponseDtoSchema>;

/** 
 * DelayNotificationEnumSchema 
 * @type { enum }
 */
export const DelayNotificationEnumSchema = z.enum(["EveryDelay", "LongerThan24Hours", "LongerThan3Days"]);
export type DelayNotificationEnum = z.infer<typeof DelayNotificationEnumSchema>;
export const DelayNotificationEnum = DelayNotificationEnumSchema.enum;

/** 
 * UserEmailPreferencesDtoSchema 
 * @type { object }
 * @property { boolean } originDeparture  
 * @property { boolean } loadedOnVessel  
 * @property { boolean } destinationArrival  
 * @property { boolean } onsiteDelivery  
 * @property { ControlTowerMeModels.DelayNotificationEnum } delay  
 */
export const UserEmailPreferencesDtoSchema = z.object({ originDeparture: z.boolean(), loadedOnVessel: z.boolean(), destinationArrival: z.boolean(), onsiteDelivery: z.boolean(), delay: DelayNotificationEnumSchema });
export type UserEmailPreferencesDto = z.infer<typeof UserEmailPreferencesDtoSchema>;

/** 
 * UserProjectAccessDtoSchema 
 * @type { object }
 * @property { string[] } projectIds  
 */
export const UserProjectAccessDtoSchema = z.object({ projectIds: z.array(z.string()) });
export type UserProjectAccessDto = z.infer<typeof UserProjectAccessDtoSchema>;

/** 
 * UserRoleEnumSchema 
 * @type { enum }
 */
export const UserRoleEnumSchema = z.enum(["User", "Admin"]);
export type UserRoleEnum = z.infer<typeof UserRoleEnumSchema>;
export const UserRoleEnum = UserRoleEnumSchema.enum;

/** 
 * UserDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name Min Length: `3` 
 * @property { string } email  
 * @property { ControlTowerMeModels.UserEmailPreferencesDto } emailPreferences  
 * @property { ControlTowerMeModels.UserProjectAccessDto } projectAccess  
 * @property { ControlTowerMeModels.UserRoleEnum } role  
 * @property { boolean } isAdmin  
 */
export const UserDetailDtoSchema = z.object({ id: z.string(), name: z.string().min(3), email: z.email(), emailPreferences: UserEmailPreferencesDtoSchema.nullable(), projectAccess: UserProjectAccessDtoSchema.nullable(), role: UserRoleEnumSchema.nullable(), isAdmin: z.boolean() });
export type UserDetailDto = z.infer<typeof UserDetailDtoSchema>;

/** 
 * UserEmailPreferencesUpdateDtoSchema 
 * @type { object }
 * @property { boolean } originDeparture  
 * @property { boolean } loadedOnVessel  
 * @property { boolean } destinationArrival  
 * @property { boolean } onsiteDelivery  
 * @property { ControlTowerMeModels.DelayNotificationEnum } delay  
 */
export const UserEmailPreferencesUpdateDtoSchema = z.object({ originDeparture: z.boolean(), loadedOnVessel: z.boolean(), destinationArrival: z.boolean(), onsiteDelivery: z.boolean(), delay: DelayNotificationEnumSchema });
export type UserEmailPreferencesUpdateDto = z.infer<typeof UserEmailPreferencesUpdateDtoSchema>;

/** 
 * UserProjectAccessUpdateDtoSchema 
 * @type { object }
 * @property { number[] } projectIds  
 */
export const UserProjectAccessUpdateDtoSchema = z.object({ projectIds: z.array(z.number()) });
export type UserProjectAccessUpdateDto = z.infer<typeof UserProjectAccessUpdateDtoSchema>;

/** 
 * UserUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } email  
 * @property { string } password  
 * @property { ControlTowerMeModels.UserEmailPreferencesUpdateDto } emailPreferences  
 * @property { ControlTowerMeModels.UserProjectAccessUpdateDto } projectAccess  
 */
export const UserUpdateDtoSchema = z.object({ name: z.string(), email: z.email(), password: z.string(), emailPreferences: UserEmailPreferencesUpdateDtoSchema, projectAccess: UserProjectAccessUpdateDtoSchema });
export type UserUpdateDto = z.infer<typeof UserUpdateDtoSchema>;

/** 
 * SearchItemTypeEnumSchema 
 * @type { enum }
 */
export const SearchItemTypeEnumSchema = z.enum(["Project", "Booking", "Container"]);
export type SearchItemTypeEnum = z.infer<typeof SearchItemTypeEnumSchema>;
export const SearchItemTypeEnum = SearchItemTypeEnumSchema.enum;

/** 
 * SearchItemDtoSchema 
 * @type { object }
 * @property { ControlTowerSearchModels.SearchItemTypeEnum } type  
 * @property { string } id  
 * @property { string } label  
 */
export const SearchItemDtoSchema = z.object({ type: SearchItemTypeEnumSchema, id: z.string(), label: z.string().nullable() });
export type SearchItemDto = z.infer<typeof SearchItemDtoSchema>;

/** 
 * SearchResponseDtoSchema 
 * @type { object }
 * @property { ControlTowerSearchModels.SearchItemDto[] } items  
 * @property { number } projectsCount  
 * @property { number } bookingsCount  
 * @property { number } containersCount  
 * @property { number } totalCount  
 */
export const SearchResponseDtoSchema = z.object({ items: z.array(SearchItemDtoSchema), projectsCount: z.number(), bookingsCount: z.number(), containersCount: z.number(), totalCount: z.number() });
export type SearchResponseDto = z.infer<typeof SearchResponseDtoSchema>;

/** 
 * EventRelationTypeEnumSchema 
 * @type { enum }
 */
export const EventRelationTypeEnumSchema = z.enum(["Booking", "Container", "PurchaseOrder"]);
export type EventRelationTypeEnum = z.infer<typeof EventRelationTypeEnumSchema>;
export const EventRelationTypeEnum = EventRelationTypeEnumSchema.enum;

/** 
 * CalendarEventRelationDtoSchema 
 * @type { object }
 * @property { ControlTowerCalendarModels.EventRelationTypeEnum } type  
 * @property { string } id  
 * @property { string } number  
 */
export const CalendarEventRelationDtoSchema = z.object({ type: EventRelationTypeEnumSchema, id: z.string(), number: z.string() });
export type CalendarEventRelationDto = z.infer<typeof CalendarEventRelationDtoSchema>;

/** 
 * CalendarTypeEnumSchema 
 * @type { enum }
 */
export const CalendarTypeEnumSchema = z.enum(["PurchaseOrder", "Booking", "Container", "Package"]);
export type CalendarTypeEnum = z.infer<typeof CalendarTypeEnumSchema>;
export const CalendarTypeEnum = CalendarTypeEnumSchema.enum;

/** 
 * CalendarEventDtoSchema 
 * @type { object }
 * @property { string } entityId  
 * @property { string } entityNumber  
 * @property { ControlTowerCalendarModels.CalendarTypeEnum } entityType  
 * @property { string } date  
 * @property { string } title  
 * @property { ControlTowerCalendarModels.CalendarEventRelationDto[] } relations  
 */
export const CalendarEventDtoSchema = z.object({ entityId: z.string(), entityNumber: z.string(), entityType: CalendarTypeEnumSchema, date: z.iso.datetime({ offset: true }), title: z.string(), relations: z.array(CalendarEventRelationDtoSchema) });
export type CalendarEventDto = z.infer<typeof CalendarEventDtoSchema>;

/** 
 * FiltersDtoSchema 
 * @type { object }
 * @property { string[] } poNumbers  
 * @property { string[] } bookingNumbers  
 * @property { string[] } containerNumbers  
 */
export const FiltersDtoSchema = z.object({ poNumbers: z.array(z.string()), bookingNumbers: z.array(z.string()), containerNumbers: z.array(z.string()) });
export type FiltersDto = z.infer<typeof FiltersDtoSchema>;

/** 
 * CalendarDtoSchema 
 * @type { object }
 * @property { ControlTowerCalendarModels.CalendarEventDto[] } events  
 * @property { ControlTowerCalendarModels.FiltersDto } filters  
 */
export const CalendarDtoSchema = z.object({ events: z.array(CalendarEventDtoSchema), filters: FiltersDtoSchema });
export type CalendarDto = z.infer<typeof CalendarDtoSchema>;

/** 
 * CalendarResponseDtoSchema 
 * @type { object }
 * @property { ControlTowerCalendarModels.CalendarDto } data  
 */
export const CalendarResponseDtoSchema = z.object({ data: CalendarDtoSchema });
export type CalendarResponseDto = z.infer<typeof CalendarResponseDtoSchema>;

/** 
 * InttraShippingInstructionStatusEnumSchema 
 * @type { enum }
 */
export const InttraShippingInstructionStatusEnumSchema = z.enum(["PendingUpload", "Uploaded", "ContrlAccepted", "ContrlRejected", "AperakAccepted", "AperakRejected", "FailedUpload"]);
export type InttraShippingInstructionStatusEnum = z.infer<typeof InttraShippingInstructionStatusEnumSchema>;
export const InttraShippingInstructionStatusEnum = InttraShippingInstructionStatusEnumSchema.enum;

/** 
 * ShippingInstructionMessageListItemResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } shippingInstructionsId  
 * @property { string } positionId  
 * @property { string } createdByUserId  
 * @property { InttraShippingInstructionMessagesModels.InttraShippingInstructionStatusEnum } status  
 * @property { string } fileName  
 * @property { string } sftpPath  
 * @property { string } sentAt  
 * @property { number } uploadAttemptCount  
 * @property { string } lastUploadError  
 * @property { string } notes  
 * @property { string } contrlStatus  
 * @property { string } contrlReceivedAt  
 * @property { string } contrlRaw  
 * @property { string } aperakStatus  
 * @property { string } aperakReceivedAt  
 * @property { string } aperakRaw  
 */
export const ShippingInstructionMessageListItemResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), shippingInstructionsId: z.string(), positionId: z.string(), createdByUserId: z.string(), status: InttraShippingInstructionStatusEnumSchema, fileName: z.string(), sftpPath: z.string(), sentAt: z.iso.datetime({ offset: true }), uploadAttemptCount: z.number(), lastUploadError: z.string().nullish(), notes: z.string().nullish(), contrlStatus: z.string().nullish(), contrlReceivedAt: z.iso.datetime({ offset: true }).nullish(), contrlRaw: z.string().nullish(), aperakStatus: z.string().nullish(), aperakReceivedAt: z.iso.datetime({ offset: true }).nullish(), aperakRaw: z.string().nullish() });
export type ShippingInstructionMessageListItemResponseDto = z.infer<typeof ShippingInstructionMessageListItemResponseDtoSchema>;

/** 
 * ShippingInstructionMessageFilterDtoSchema 
 * @type { object }
 * @property { InttraShippingInstructionMessagesModels.InttraShippingInstructionStatusEnum[] } status  
 */
export const ShippingInstructionMessageFilterDtoSchema = z.object({ status: z.array(InttraShippingInstructionStatusEnumSchema).nullable() }).partial();
export type ShippingInstructionMessageFilterDto = z.infer<typeof ShippingInstructionMessageFilterDtoSchema>;

/** 
 * ShippingInstructionMessageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } shippingInstructionsId  
 * @property { string } positionId  
 * @property { string } createdByUserId  
 * @property { InttraShippingInstructionMessagesModels.InttraShippingInstructionStatusEnum } status  
 * @property { object } shippingInstructionSnapshot  
 * @property { string } renderedRequestPayload  
 * @property { string } fileName  
 * @property { string } sftpPath  
 * @property { string } sentAt  
 * @property { number } uploadAttemptCount  
 * @property { string } lastUploadError  
 * @property { string } notes  
 * @property { string } contrlStatus  
 * @property { string } contrlReceivedAt  
 * @property { string } contrlRaw  
 * @property { string } aperakStatus  
 * @property { string } aperakReceivedAt  
 * @property { string } aperakRaw  
 */
export const ShippingInstructionMessageResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), shippingInstructionsId: z.string(), positionId: z.string(), createdByUserId: z.string(), status: InttraShippingInstructionStatusEnumSchema, shippingInstructionSnapshot: z.object({}), renderedRequestPayload: z.string(), fileName: z.string(), sftpPath: z.string(), sentAt: z.iso.datetime({ offset: true }), uploadAttemptCount: z.number(), lastUploadError: z.string().nullish(), notes: z.string().nullish(), contrlStatus: z.string().nullish(), contrlReceivedAt: z.iso.datetime({ offset: true }).nullish(), contrlRaw: z.string().nullish(), aperakStatus: z.string().nullish(), aperakReceivedAt: z.iso.datetime({ offset: true }).nullish(), aperakRaw: z.string().nullish() });
export type ShippingInstructionMessageResponseDto = z.infer<typeof ShippingInstructionMessageResponseDtoSchema>;

/** 
 * UploadOfficeDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } fileName File name with extension 
 * @property { string } mimeType MIME type of the file 
 * @property { number } fileSize Size of the file 
 * @property { string } language Language of the document 
 * @property { string } documentPart Part of the document this image represents 
 */
export const UploadOfficeDocumentRequestDtoSchema = z.object({ fileName: z.string(), mimeType: z.string(), fileSize: z.number(), language: CommonModels.LanguageEnumSchema, documentPart: OfficeDocumentPartEnumSchema });
export type UploadOfficeDocumentRequestDto = z.infer<typeof UploadOfficeDocumentRequestDtoSchema>;

/** 
 * TerminalPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter terminals by matchCode, shortName, or name 
 * @property { boolean } archived  
 * @property { string } type  
 */
export const TerminalPaginationFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable(), type: TerminalTypeSchema.nullable() }).partial();
export type TerminalPaginationFilterDto = z.infer<typeof TerminalPaginationFilterDtoSchema>;

/** 
 * EmployeeRoleListItemResponseSchema 
 * @type { object }
 * @property { string } id Unique identifier of the role 
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string } context Role context 
 * @property { string[] } permissions Permissions associated with the role 
 * @property { number } numberOfUsers Number of users associated with the role 
 */
export const EmployeeRoleListItemResponseSchema = z.object({ id: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema.nullish(), permissions: z.array(z.string()), numberOfUsers: z.number() });
export type EmployeeRoleListItemResponse = z.infer<typeof EmployeeRoleListItemResponseSchema>;

/** 
 * EmployeeRolePaginationFilterDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } context Role context 
 * @property { string } search  
 */
export const EmployeeRolePaginationFilterDtoSchema = z.object({ name: z.string().nullable(), context: CommonModels.EmployeeRoleContextSchema.nullable(), search: z.string().nullable() }).partial();
export type EmployeeRolePaginationFilterDto = z.infer<typeof EmployeeRolePaginationFilterDtoSchema>;

/** 
 * EmployeeRoleCreateRequestSchema 
 * @type { object }
 * @property { string } name Name of the role 
 * @property { string } color Color of the role 
 * @property { string } description Color of the role 
 * @property { string } context Role context
 * - office or global 
 * @property { string[] } permissions Permission IDs associated with the role
 * can only be either office or global. Default: `` 
 */
export const EmployeeRoleCreateRequestSchema = z.object({ name: z.string(), color: z.string(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema, permissions: z.array(z.string()).default([]) });
export type EmployeeRoleCreateRequest = z.infer<typeof EmployeeRoleCreateRequestSchema>;

/** 
 * EmployeeRolePermissionDtoSchema 
 * @type { object }
 * @property { string } id Employee Permission unique identifier 
 * @property { string } label  
 * @property { string } group  
 * @property { string } description  
 * @property { string } context Scope where this rule is applied 
 * @property { boolean } enabled  
 */
export const EmployeeRolePermissionDtoSchema = z.object({ id: z.string(), label: z.string(), group: z.string(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema, enabled: z.boolean() });
export type EmployeeRolePermissionDto = z.infer<typeof EmployeeRolePermissionDtoSchema>;

/** 
 * EmployeePermissionResponseSchema 
 * @type { object }
 * @property { string } id Employee Permission unique identifier 
 * @property { string } label  
 * @property { string } group  
 * @property { string } description  
 * @property { string } context Scope where this rule is applied 
 */
export const EmployeePermissionResponseSchema = z.object({ id: z.string(), label: z.string(), group: z.string(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema });
export type EmployeePermissionResponse = z.infer<typeof EmployeePermissionResponseSchema>;

/** 
 * EmployeePermissionFilterDtoSchema 
 * @type { object }
 * @property { string } context Role context 
 * @property { string[] } ids Ids 
 */
export const EmployeePermissionFilterDtoSchema = z.object({ context: CommonModels.EmployeeRoleContextSchema.nullable(), ids: z.array(z.string()).nullable() }).partial();
export type EmployeePermissionFilterDto = z.infer<typeof EmployeePermissionFilterDtoSchema>;

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
 * RemarkTemplateFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived  
 * @property { string } search  
 * @property { string } onlyUsedFor Filter by document type 
 */
export const RemarkTemplateFilterDtoSchema = z.object({ archived: z.boolean().nullable(), search: z.string().nullable(), onlyUsedFor: OnlyUsedForEnumSchema.nullable() }).partial();
export type RemarkTemplateFilterDto = z.infer<typeof RemarkTemplateFilterDtoSchema>;

/** 
 * StatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Status 
 * @property { string } message Message 
 * @property { string } code Alphanumeric code of the message type 
 */
export const StatusResponseDtoSchema = z.object({ status: z.string(), message: z.string(), code: z.string() });
export type StatusResponseDto = z.infer<typeof StatusResponseDtoSchema>;

/** 
 * PaginationDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const PaginationDtoSchema = z.object({ items: z.array(z.string()), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type PaginationDto = z.infer<typeof PaginationDtoSchema>;

/** 
 * WorkingDocumentFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { string } type  
 */
export const WorkingDocumentFilterDtoSchema = z.object({ search: z.string().nullable(), type: z.string().nullable() }).partial();
export type WorkingDocumentFilterDto = z.infer<typeof WorkingDocumentFilterDtoSchema>;

/** 
 * OfficeListItemResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { number } numberOfEmployees  
 */
export const OfficeListItemResponseSchema = z.object({ id: z.string(), name: z.string(), numberOfEmployees: z.number() });
export type OfficeListItemResponse = z.infer<typeof OfficeListItemResponseSchema>;

/** 
 * OfficeFilterDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } search  
 */
export const OfficeFilterDtoSchema = z.object({ name: z.string().nullable(), search: z.string().nullable() }).partial();
export type OfficeFilterDto = z.infer<typeof OfficeFilterDtoSchema>;

/** 
 * LabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const LabelResponseDTOSchema = z.object({ id: z.string(), label: z.string() });
export type LabelResponseDTO = z.infer<typeof LabelResponseDTOSchema>;

/** 
 * OfficeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const OfficeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type OfficeLabelFilterDto = z.infer<typeof OfficeLabelFilterDtoSchema>;

/** 
 * CreateOfficeRequestSchema 
 * @type { object }
 * @property { string } name  
 */
export const CreateOfficeRequestSchema = z.object({ name: z.string() });
export type CreateOfficeRequest = z.infer<typeof CreateOfficeRequestSchema>;

/** 
 * DocumentImageUploadInstructionsDtoSchema 
 * @type { object }
 * @property { string } method HTTP method to use for upload 
 * @property { string } url URL to upload the file to 
 * @property { string } documentId ID of the created/updated document setting 
 */
export const DocumentImageUploadInstructionsDtoSchema = z.object({ method: z.string(), url: z.string(), documentId: z.string() });
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
export const CreateOfficeBankAccountDtoSchema = z.object({ name: z.string().nullable(), bankName: z.string().nullable(), iban: z.string().nullable(), swiftBic: z.string().nullable(), useFooterOnInvoice: z.boolean().nullable() }).partial();
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
export const UpdateOfficeBankAccountDtoSchema = z.object({ name: z.string().nullable(), bankName: z.string().nullable(), iban: z.string().nullable(), swiftBic: z.string().nullable(), useFooterOnInvoice: z.boolean().nullable(), isFactoringBank: z.boolean().nullable() }).partial();
export type UpdateOfficeBankAccountDto = z.infer<typeof UpdateOfficeBankAccountDtoSchema>;

/** 
 * UploadOfficeBankAccountFooterRequestDtoSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType File MIME type 
 * @property { number } fileSize Size of the file 
 */
export const UploadOfficeBankAccountFooterRequestDtoSchema = z.object({ fileName: z.string(), mimeType: z.string(), fileSize: z.number() });
export type UploadOfficeBankAccountFooterRequestDto = z.infer<typeof UploadOfficeBankAccountFooterRequestDtoSchema>;

/** 
 * BankAccountFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by name or bank name 
 * @property { string } officeId Office ID to filter by 
 */
export const BankAccountFilterDtoSchema = z.object({ search: z.string().nullable(), officeId: z.string().nullable() }).partial();
export type BankAccountFilterDto = z.infer<typeof BankAccountFilterDtoSchema>;

/** 
 * CurrencyPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string } search  
 */
export const CurrencyPaginationFilterDtoSchema = z.object({ officeId: z.string().nullable(), search: z.string().nullable() }).partial();
export type CurrencyPaginationFilterDto = z.infer<typeof CurrencyPaginationFilterDtoSchema>;

/** 
 * CreateCurrencyRequestDTOSchema 
 * @type { object }
 * @property { string } isoCode Unique identifier for the currency 
 * @property { string } name Name of the currency 
 * @property { string } symbol Symbol of the currency 
 * @property { string } alignment Alignment of the currency 
 */
export const CreateCurrencyRequestDTOSchema = z.object({ isoCode: z.string(), name: z.string(), symbol: z.string(), alignment: z.string() });
export type CreateCurrencyRequestDTO = z.infer<typeof CreateCurrencyRequestDTOSchema>;

/** 
 * UpdateCurrencyRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the currency 
 */
export const UpdateCurrencyRequestDTOSchema = z.object({ name: z.string().nullable() }).partial();
export type UpdateCurrencyRequestDTO = z.infer<typeof UpdateCurrencyRequestDTOSchema>;

/** 
 * CountryPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CountryPaginationFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type CountryPaginationFilterDto = z.infer<typeof CountryPaginationFilterDtoSchema>;

/** 
 * CreateTeamRequestDTOSchema 
 * @type { object }
 * @property { string } name Team name. Min Length: `3`. Max Length: `120` 
 */
export const CreateTeamRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type CreateTeamRequestDTO = z.infer<typeof CreateTeamRequestDTOSchema>;

/** 
 * TeamLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const TeamLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type TeamLabelFilterDto = z.infer<typeof TeamLabelFilterDtoSchema>;

/** 
 * TeamFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const TeamFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type TeamFilterDto = z.infer<typeof TeamFilterDtoSchema>;

/** 
 * UpdateTeamRequestDTOSchema 
 * @type { object }
 * @property { string } name Team name. Min Length: `3`. Max Length: `120` 
 */
export const UpdateTeamRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type UpdateTeamRequestDTO = z.infer<typeof UpdateTeamRequestDTOSchema>;

/** 
 * BulkAddTeamMembersRequestDTOSchema 
 * @type { object }
 * @property { string[] } employeeIds Employee ids to add to team 
 */
export const BulkAddTeamMembersRequestDTOSchema = z.object({ employeeIds: z.array(z.uuid()) });
export type BulkAddTeamMembersRequestDTO = z.infer<typeof BulkAddTeamMembersRequestDTOSchema>;

/** 
 * BulkRemoveTeamMembersRequestDTOSchema 
 * @type { object }
 * @property { string[] } employeeIds Employee ids to remove from team 
 */
export const BulkRemoveTeamMembersRequestDTOSchema = z.object({ employeeIds: z.array(z.uuid()) });
export type BulkRemoveTeamMembersRequestDTO = z.infer<typeof BulkRemoveTeamMembersRequestDTOSchema>;

/** 
 * FolderContentFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived When omitted, both archived and unarchived files are returned. 
 */
export const FolderContentFilterDtoSchema = z.object({ archived: z.boolean().nullable() }).partial();
export type FolderContentFilterDto = z.infer<typeof FolderContentFilterDtoSchema>;

/** 
 * CreateFolderRequestDTOSchema 
 * @type { object }
 * @property { string } parentFolderId  
 * @property { string } name  
 */
export const CreateFolderRequestDTOSchema = z.object({ parentFolderId: z.string(), name: z.string() });
export type CreateFolderRequestDTO = z.infer<typeof CreateFolderRequestDTOSchema>;

/** 
 * RenameFolderRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 */
export const RenameFolderRequestDTOSchema = z.object({ name: z.string() });
export type RenameFolderRequestDTO = z.infer<typeof RenameFolderRequestDTOSchema>;

/** 
 * MoveFoldersRequestDTOSchema 
 * @type { object }
 * @property { string[] } folderIds Min Items: `1` 
 * @property { string } targetFolderId  
 */
export const MoveFoldersRequestDTOSchema = z.object({ folderIds: z.array(z.string()).min(1), targetFolderId: z.string() });
export type MoveFoldersRequestDTO = z.infer<typeof MoveFoldersRequestDTOSchema>;

/** 
 * CreateFileRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } mimeType  
 * @property { number } fileSize Minimum: `0` 
 */
export const CreateFileRequestDTOSchema = z.object({ name: z.string(), mimeType: z.string(), fileSize: z.number().gte(0) });
export type CreateFileRequestDTO = z.infer<typeof CreateFileRequestDTOSchema>;

/** 
 * FileUploadResponseDTOSchema 
 * @type { object }
 * @property { string } fileId  
 * @property { string } method  
 * @property { string } url  
 */
export const FileUploadResponseDTOSchema = z.object({ fileId: z.string(), method: z.string(), url: z.string() });
export type FileUploadResponseDTO = z.infer<typeof FileUploadResponseDTOSchema>;

/** 
 * GetFilesEmlRequestDTOSchema 
 * @type { object }
 * @property { string[] } ids Min Items: `1` 
 */
export const GetFilesEmlRequestDTOSchema = z.object({ ids: z.array(z.string()).min(1) });
export type GetFilesEmlRequestDTO = z.infer<typeof GetFilesEmlRequestDTOSchema>;

/** 
 * RenameFileRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 */
export const RenameFileRequestDTOSchema = z.object({ name: z.string() });
export type RenameFileRequestDTO = z.infer<typeof RenameFileRequestDTOSchema>;

/** 
 * MoveFilesRequestDTOSchema 
 * @type { object }
 * @property { string[] } fileIds Min Items: `1` 
 * @property { string } targetFolderId  
 */
export const MoveFilesRequestDTOSchema = z.object({ fileIds: z.array(z.string()).min(1), targetFolderId: z.string() });
export type MoveFilesRequestDTO = z.infer<typeof MoveFilesRequestDTOSchema>;

/** 
 * SetFilesArchivedRequestDTOSchema 
 * @type { object }
 * @property { string[] } ids Min Items: `1` 
 */
export const SetFilesArchivedRequestDTOSchema = z.object({ ids: z.array(z.string()).min(1) });
export type SetFilesArchivedRequestDTO = z.infer<typeof SetFilesArchivedRequestDTOSchema>;

/** 
 * CreateTemplatedDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } templateId Template ID to use for creating the document 
 * @property { string } nameSuffix Optional suffix for the document name 
 */
export const CreateTemplatedDocumentRequestDtoSchema = z.object({ templateId: z.string(), nameSuffix: z.string().nullish() });
export type CreateTemplatedDocumentRequestDto = z.infer<typeof CreateTemplatedDocumentRequestDtoSchema>;

/** 
 * GenerateWorkingDocumentPreviewRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 */
export const GenerateWorkingDocumentPreviewRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullable() }).partial();
export type GenerateWorkingDocumentPreviewRequestDto = z.infer<typeof GenerateWorkingDocumentPreviewRequestDtoSchema>;

/** 
 * GenerateWorkingDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 * @property { string } fileName  
 */
export const GenerateWorkingDocumentRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullish(), fileName: z.string() });
export type GenerateWorkingDocumentRequestDto = z.infer<typeof GenerateWorkingDocumentRequestDtoSchema>;

/** 
 * BusinessPartnerSignatureUploadRequestDTOSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType Mime type 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const BusinessPartnerSignatureUploadRequestDTOSchema = z.object({ fileName: z.string(), mimeType: z.string(), fileSize: z.number().gte(1) });
export type BusinessPartnerSignatureUploadRequestDTO = z.infer<typeof BusinessPartnerSignatureUploadRequestDTOSchema>;

/** 
 * BusinessPartnerSignatureUploadResponseDTOSchema 
 * @type { object }
 * @property { string } mediaId Media ID for the uploaded signature 
 * @property { string } method HTTP method to use for upload 
 * @property { string } url URL to upload the file to 
 */
export const BusinessPartnerSignatureUploadResponseDTOSchema = z.object({ mediaId: z.string(), method: z.string(), url: z.string() });
export type BusinessPartnerSignatureUploadResponseDTO = z.infer<typeof BusinessPartnerSignatureUploadResponseDTOSchema>;

/** 
 * CargoAgentResponseDTOSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner identifier 
 * @property { string } portOfHamburgAccountNumber Port of Hamburg account number 
 * @property { string } iataAccountNumber IATA account number 
 * @property { string } regulatedAgentCode Regulated agent code 
 */
export const CargoAgentResponseDTOSchema = z.object({ businessPartnerId: z.string(), portOfHamburgAccountNumber: z.string(), iataAccountNumber: z.string(), regulatedAgentCode: z.string() });
export type CargoAgentResponseDTO = z.infer<typeof CargoAgentResponseDTOSchema>;

/** 
 * UpdateCargoAgentDTOSchema 
 * @type { object }
 * @property { string } portOfHamburgAccountNumber Hamburg port account number 
 * @property { string } iataAccountNumber IATA account number 
 * @property { string } regulatedAgentCode Regulated agent code 
 */
export const UpdateCargoAgentDTOSchema = z.object({ portOfHamburgAccountNumber: z.string().nullable(), iataAccountNumber: z.string().nullable(), regulatedAgentCode: z.string().nullable() }).partial();
export type UpdateCargoAgentDTO = z.infer<typeof UpdateCargoAgentDTOSchema>;

/** 
 * CarrierResponseDTOSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner identifier 
 * @property { string } scac SCAC code 
 * @property { string } iataAirlinePrefix IATA airline prefix 
 * @property { string } iataCode IATA code 
 * @property { string } registrationAddress Registration address 
 * @property { string } masterBlSuffix Master BL suffix 
 * @property { string } houseBlSuffix House BL suffix 
 * @property { string } airWaybillSuffix Air waybill suffix 
 * @property { string } cargoManifestSuffix Cargo manifest suffix 
 * @property { string } fundReportSuffix Fund report suffix 
 * @property { string } invoiceSuffix Invoice suffix 
 */
export const CarrierResponseDTOSchema = z.object({ businessPartnerId: z.string(), scac: z.string(), iataAirlinePrefix: z.string(), iataCode: z.string(), registrationAddress: z.string(), masterBlSuffix: z.string(), houseBlSuffix: z.string(), airWaybillSuffix: z.string(), cargoManifestSuffix: z.string(), fundReportSuffix: z.string(), invoiceSuffix: z.string() });
export type CarrierResponseDTO = z.infer<typeof CarrierResponseDTOSchema>;

/** 
 * UpdateCarrierDTOSchema 
 * @type { object }
 * @property { string } scac SCAC code 
 * @property { string } iataAirlinePrefix IATA airline prefix 
 * @property { string } iataCode IATA code 
 * @property { string } registrationAddress Registration address 
 * @property { string } masterBlSuffix Master BL suffix 
 * @property { string } houseBlSuffix House BL suffix 
 * @property { string } airWaybillSuffix Air waybill suffix 
 * @property { string } cargoManifestSuffix Cargo manifest suffix 
 * @property { string } fundReportSuffix Fund report suffix 
 * @property { string } invoiceSuffix Invoice suffix 
 */
export const UpdateCarrierDTOSchema = z.object({ scac: z.string().nullable(), iataAirlinePrefix: z.string().nullable(), iataCode: z.string().nullable(), registrationAddress: z.string().nullable(), masterBlSuffix: z.string().nullable(), houseBlSuffix: z.string().nullable(), airWaybillSuffix: z.string().nullable(), cargoManifestSuffix: z.string().nullable(), fundReportSuffix: z.string().nullable(), invoiceSuffix: z.string().nullable() }).partial();
export type UpdateCarrierDTO = z.infer<typeof UpdateCarrierDTOSchema>;

/** 
 * CreateBookkeepingMappingDtoSchema 
 * @type { object }
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { boolean } paysTaxInEurForFactoring Pays tax in EUR for factoring (Logvin case) 
 */
export const CreateBookkeepingMappingDtoSchema = z.object({ debtorId: z.string().nullable(), creditorId: z.string().nullable(), currencyNotation: z.string().nullable(), paysTaxInEurForFactoring: z.boolean().nullable() }).partial();
export type CreateBookkeepingMappingDto = z.infer<typeof CreateBookkeepingMappingDtoSchema>;

/** 
 * BusinessPartnerContactFilterDtoSchema 
 * @type { object }
 * @property { string } search Search by name, email, or phone 
 */
export const BusinessPartnerContactFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type BusinessPartnerContactFilterDto = z.infer<typeof BusinessPartnerContactFilterDtoSchema>;

/** 
 * CityPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Free search 
 * @property { boolean } archived  
 */
export const CityPaginationFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type CityPaginationFilterDto = z.infer<typeof CityPaginationFilterDtoSchema>;

/** 
 * CityLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CityLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type CityLabelFilterDto = z.infer<typeof CityLabelFilterDtoSchema>;

/** 
 * CreateCityRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { string } countryId Country ID 
 */
export const CreateCityRequestDTOSchema = z.object({ name: z.string(), isoCode: z.string().nullish(), stateCode: z.string().nullish(), countryId: z.string() });
export type CreateCityRequestDTO = z.infer<typeof CreateCityRequestDTOSchema>;

/** 
 * UpdateCityRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the city 
 * @property { string } isoCode ISO code of the city 
 * @property { string } stateCode State code of the city 
 * @property { string } countryId Country ID 
 */
export const UpdateCityRequestDTOSchema = z.object({ name: z.string().nullable(), isoCode: z.string().nullable(), stateCode: z.string().nullable(), countryId: z.string().nullable() }).partial();
export type UpdateCityRequestDTO = z.infer<typeof UpdateCityRequestDTOSchema>;

/** 
 * CreateDepotRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Unique identifier code for the depot 
 * @property { string } shortName Optional short name for the depot 
 * @property { string } additionalInformation  
 * @property { string } name Full name of the depot 
 * @property { string } street Street address of the depot 
 * @property { string } zip ZIP/Postal code 
 * @property { string } district District information 
 * @property { string } cityId City id 
 * @property { string } countryId Country code 
 */
export const CreateDepotRequestDTOSchema = z.object({ matchCode: z.string(), shortName: z.string().nullish(), additionalInformation: z.string().nullish(), name: z.string(), street: z.string(), zip: z.string(), district: z.string().nullish(), cityId: z.string(), countryId: z.string() });
export type CreateDepotRequestDTO = z.infer<typeof CreateDepotRequestDTOSchema>;

/** 
 * DepotPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter depots by name, matchCode, or shortName 
 * @property { boolean } archived  
 */
export const DepotPaginationFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type DepotPaginationFilterDto = z.infer<typeof DepotPaginationFilterDtoSchema>;

/** 
 * DepotLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DepotLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type DepotLabelFilterDto = z.infer<typeof DepotLabelFilterDtoSchema>;

/** 
 * UpdateDepotRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Updated match code for the depot 
 * @property { string } shortName Updated short name 
 * @property { string } additionalInformation Updated short name 
 * @property { string } name Updated full name 
 * @property { string } street Updated street address 
 * @property { string } zip Updated ZIP/Postal code 
 * @property { string } district Updated district information 
 * @property { string } cityId Updated city id 
 * @property { string } countryId Updated country code 
 */
export const UpdateDepotRequestDTOSchema = z.object({ matchCode: z.string().nullable(), shortName: z.string().nullable(), additionalInformation: z.string().nullable(), name: z.string().nullable(), street: z.string().nullable(), zip: z.string().nullable(), district: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable() }).partial();
export type UpdateDepotRequestDTO = z.infer<typeof UpdateDepotRequestDTOSchema>;

/** 
 * PartnerNetworkLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const PartnerNetworkLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PartnerNetworkLabelFilterDto = z.infer<typeof PartnerNetworkLabelFilterDtoSchema>;

/** 
 * PartnerNetworkPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Free search 
 * @property { boolean } archived  
 */
export const PartnerNetworkPaginationFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type PartnerNetworkPaginationFilterDto = z.infer<typeof PartnerNetworkPaginationFilterDtoSchema>;

/** 
 * CreatePartnerNetworkRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the partner network 
 */
export const CreatePartnerNetworkRequestDTOSchema = z.object({ name: z.string() });
export type CreatePartnerNetworkRequestDTO = z.infer<typeof CreatePartnerNetworkRequestDTOSchema>;

/** 
 * UpdatePartnerNetworkRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the partner network 
 */
export const UpdatePartnerNetworkRequestDTOSchema = z.object({ name: z.string().nullable() }).partial();
export type UpdatePartnerNetworkRequestDTO = z.infer<typeof UpdatePartnerNetworkRequestDTOSchema>;

/** 
 * CreateWarehouseRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } shortName  
 * @property { string } additionalInformation  
 * @property { string } matchCode  
 * @property { string } street  
 * @property { string } secondaryStreet  
 * @property { string } zip  
 * @property { string } cityId  
 * @property { string } countryId  
 * @property { string } district  
 */
export const CreateWarehouseRequestDTOSchema = z.object({ name: z.string().nullish(), shortName: z.string().nullish(), additionalInformation: z.string().nullish(), matchCode: z.string(), street: z.string().nullish(), secondaryStreet: z.string().nullish(), zip: z.string().nullish(), cityId: z.string().nullish(), countryId: z.string().nullish(), district: z.string().nullish() });
export type CreateWarehouseRequestDTO = z.infer<typeof CreateWarehouseRequestDTOSchema>;

/** 
 * WarehouseLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const WarehouseLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type WarehouseLabelFilterDto = z.infer<typeof WarehouseLabelFilterDtoSchema>;

/** 
 * WarehouseFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived Filter by archived status 
 */
export const WarehouseFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type WarehouseFilterDto = z.infer<typeof WarehouseFilterDtoSchema>;

/** 
 * UpdateWarehouseRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } shortName  
 * @property { string } additionalInformation  
 * @property { string } matchCode  
 * @property { string } street  
 * @property { string } secondaryStreet  
 * @property { string } zip  
 * @property { string } cityId  
 * @property { string } countryId  
 * @property { string } district  
 */
export const UpdateWarehouseRequestDTOSchema = z.object({ name: z.string().nullable(), shortName: z.string().nullable(), additionalInformation: z.string().nullable(), matchCode: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), district: z.string().nullable() }).partial();
export type UpdateWarehouseRequestDTO = z.infer<typeof UpdateWarehouseRequestDTOSchema>;

/** 
 * DocumentTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DocumentTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type DocumentTemplateLabelFilterDto = z.infer<typeof DocumentTemplateLabelFilterDtoSchema>;

/** 
 * DocumentTemplateFilterDtoSchema 
 * @type { object }
 * @property { boolean } isArchived  
 * @property { string } search  
 */
export const DocumentTemplateFilterDtoSchema = z.object({ isArchived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type DocumentTemplateFilterDto = z.infer<typeof DocumentTemplateFilterDtoSchema>;

/** 
 * HsCodePaginationFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived Archived status 
 * @property { string } search  
 */
export const HsCodePaginationFilterDtoSchema = z.object({ archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type HsCodePaginationFilterDto = z.infer<typeof HsCodePaginationFilterDtoSchema>;

/** 
 * HsCodeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const HsCodeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type HsCodeLabelFilterDto = z.infer<typeof HsCodeLabelFilterDtoSchema>;

/** 
 * CreateHsCodeRequestDTOSchema 
 * @type { object }
 * @property { string } name Unique name for the HS Code 
 * @property { string } description Description of the HS Code 
 * @property { string } customArea Custom area associated with the HS Code 
 */
export const CreateHsCodeRequestDTOSchema = z.object({ name: z.string(), description: z.string(), customArea: z.string() });
export type CreateHsCodeRequestDTO = z.infer<typeof CreateHsCodeRequestDTOSchema>;

/** 
 * UpdateHsCodeRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name of the HS Code. 
 * @property { string } description Updated description of the HS Code. 
 * @property { string } customArea Updated custom area associated with the HS Code. 
 */
export const UpdateHsCodeRequestDTOSchema = z.object({ name: z.string().nullable(), description: z.string().nullable(), customArea: z.string().nullable() }).partial();
export type UpdateHsCodeRequestDTO = z.infer<typeof UpdateHsCodeRequestDTOSchema>;

/** 
 * CargoTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const CargoTypeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type CargoTypeLabelFilterDto = z.infer<typeof CargoTypeLabelFilterDtoSchema>;

/** 
 * MergeRoutesRequestDtoSchema 
 * @type { object }
 * @property { string } sourceCargoId Source cargo ID to merge from (sea positions only) 
 */
export const MergeRoutesRequestDtoSchema = z.object({ sourceCargoId: z.string().nullable() });
export type MergeRoutesRequestDto = z.infer<typeof MergeRoutesRequestDtoSchema>;

/** 
 * CopyRouteRequestDtoSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to copy to (sea positions only) 
 */
export const CopyRouteRequestDtoSchema = z.object({ targetCargoId: z.string().nullable() });
export type CopyRouteRequestDto = z.infer<typeof CopyRouteRequestDtoSchema>;

/** 
 * UpdateInvolvedPartyDtoSchema 
 * @type { object }
 * @property { string } reference  
 * @property { string } businessPartnerId  
 * @property { string } contactId  
 */
export const UpdateInvolvedPartyDtoSchema = z.object({ reference: z.string().nullable(), businessPartnerId: z.string().nullable(), contactId: z.string().nullable() }).partial();
export type UpdateInvolvedPartyDto = z.infer<typeof UpdateInvolvedPartyDtoSchema>;

/** 
 * DeletePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to delete 
 */
export const DeletePositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()) });
export type DeletePositionAccountItemsRequestDto = z.infer<typeof DeletePositionAccountItemsRequestDtoSchema>;

/** 
 * DuplicatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to duplicate 
 */
export const DuplicatePositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()) });
export type DuplicatePositionAccountItemsRequestDto = z.infer<typeof DuplicatePositionAccountItemsRequestDtoSchema>;

/** 
 * ReassignPositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to reassign 
 * @property { string } targetPositionId Target position ID to reassign items to 
 */
export const ReassignPositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()), targetPositionId: z.string() });
export type ReassignPositionAccountItemsRequestDto = z.infer<typeof ReassignPositionAccountItemsRequestDtoSchema>;

/** 
 * ReorderPositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { number } orderPosition New order position for the item 
 */
export const ReorderPositionAccountItemRequestDtoSchema = z.object({ orderPosition: z.number() });
export type ReorderPositionAccountItemRequestDto = z.infer<typeof ReorderPositionAccountItemRequestDtoSchema>;

/** 
 * PositionProfitChangeTrackingFilterDtoSchema 
 * @type { object }
 * @property { string } userId User IDs who made the changes 
 * @property { string } dateFrom Date range start 
 * @property { string } dateTo Date range end 
 */
export const PositionProfitChangeTrackingFilterDtoSchema = z.object({ userId: z.string().nullable(), dateFrom: z.string().nullable(), dateTo: z.string().nullable() }).partial();
export type PositionProfitChangeTrackingFilterDto = z.infer<typeof PositionProfitChangeTrackingFilterDtoSchema>;

/** 
 * PortPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter ports by name or match code 
 */
export const PortPaginationFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PortPaginationFilterDto = z.infer<typeof PortPaginationFilterDtoSchema>;

/** 
 * PortLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const PortLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PortLabelFilterDto = z.infer<typeof PortLabelFilterDtoSchema>;

/** 
 * CreatePortRequestDTOSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } street Street address 
 * @property { string } secondaryStreet  
 * @property { string } zip ZIP / Postal code 
 * @property { string } cityId City id 
 * @property { string } countryId Country id 
 * @property { string } district  
 */
export const CreatePortRequestDTOSchema = z.object({ name: z.string(), matchCode: z.string(), street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), cityId: z.string(), countryId: z.string(), district: z.string().nullish() });
export type CreatePortRequestDTO = z.infer<typeof CreatePortRequestDTOSchema>;

/** 
 * UpdatePortRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name 
 * @property { string } matchCode Updated match code 
 * @property { string } street Updated street address 
 * @property { string } secondaryStreet Updated secondary street 
 * @property { string } zip Updated ZIP/Postal code 
 * @property { string } cityId Updated city id 
 * @property { string } countryId Updated country id 
 * @property { string } district  
 */
export const UpdatePortRequestDTOSchema = z.object({ name: z.string().nullable(), matchCode: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), district: z.string().nullable() }).partial();
export type UpdatePortRequestDTO = z.infer<typeof UpdatePortRequestDTOSchema>;

/** 
 * TerminalLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const TerminalLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type TerminalLabelFilterDto = z.infer<typeof TerminalLabelFilterDtoSchema>;

/** 
 * AirportPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } search Search term to filter airports by name, match code or IATA code 
 */
export const AirportPaginationFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type AirportPaginationFilterDto = z.infer<typeof AirportPaginationFilterDtoSchema>;

/** 
 * AirportLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const AirportLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type AirportLabelFilterDto = z.infer<typeof AirportLabelFilterDtoSchema>;

/** 
 * CreateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const CreateAirportRequestDTOSchema = z.object({ name: z.string(), matchCode: z.string(), iataCode: z.string() });
export type CreateAirportRequestDTO = z.infer<typeof CreateAirportRequestDTOSchema>;

/** 
 * UpdateAirportRequestDTOSchema 
 * @type { object }
 * @property { string } name Name of the airport 
 * @property { string } matchCode Match code for the airport 
 * @property { string } iataCode IATA code of the airport 
 */
export const UpdateAirportRequestDTOSchema = z.object({ name: z.string().nullable(), matchCode: z.string().nullable(), iataCode: z.string().nullable() }).partial();
export type UpdateAirportRequestDTO = z.infer<typeof UpdateAirportRequestDTOSchema>;

/** 
 * CargoSummaryResponseDTOSchema 
 * @type { object }
 * @property { string } transportUnitTypeName Transport unit type name (e.g., "40' DRY", "20'") 
 * @property { number } quantity Total quantity of this transport unit type 
 */
export const CargoSummaryResponseDTOSchema = z.object({ transportUnitTypeName: z.string(), quantity: z.number() });
export type CargoSummaryResponseDTO = z.infer<typeof CargoSummaryResponseDTOSchema>;

/** 
 * CreatePositionCargoDTOSchema 
 * @type { object }
 * @property { string } cargoTypeId Cargo type ID 
 * @property { string } note  
 * @property { boolean } autoCalculateTotals  
 * @property { boolean } shipperOwnContainer  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { string } textForCustoms  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 */
export const CreatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().nullable(), note: z.string().nullable(), autoCalculateTotals: z.boolean().nullable(), shipperOwnContainer: z.boolean().nullable(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean().nullable(), autoCalculateVgm: z.boolean().nullable() }).partial();
export type CreatePositionCargoDTO = z.infer<typeof CreatePositionCargoDTOSchema>;

/** 
 * UpdatePositionCargoDTOSchema 
 * @type { object }
 * @property { string } cargoTypeId Cargo type ID 
 * @property { string } note  
 * @property { boolean } autoCalculateTotals  
 * @property { boolean } shipperOwnContainer  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { string } textForCustoms  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 */
export const UpdatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().nullable(), note: z.string().nullable(), autoCalculateTotals: z.boolean().nullable(), shipperOwnContainer: z.boolean().nullable(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean().nullable(), autoCalculateVgm: z.boolean().nullable() }).partial();
export type UpdatePositionCargoDTO = z.infer<typeof UpdatePositionCargoDTOSchema>;

/** 
 * MovePositionCargoPackageRequestDTOSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to move the package to 
 */
export const MovePositionCargoPackageRequestDTOSchema = z.object({ targetCargoId: z.string() });
export type MovePositionCargoPackageRequestDTO = z.infer<typeof MovePositionCargoPackageRequestDTOSchema>;

/** 
 * PackageTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived Archived 
 * @property { string } search  
 */
export const PackageTypePaginationFilterDtoSchema = z.object({ archived: z.boolean().nullable(), search: z.string().nullable() }).partial();
export type PackageTypePaginationFilterDto = z.infer<typeof PackageTypePaginationFilterDtoSchema>;

/** 
 * PackageTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const PackageTypeLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type PackageTypeLabelFilterDto = z.infer<typeof PackageTypeLabelFilterDtoSchema>;

/** 
 * EmployeeSettingsResponseDtoSchema 
 * @type { object }
 * @property { object } settings Map of all settings for the employee 
 */
export const EmployeeSettingsResponseDtoSchema = z.object({ settings: z.union([z.object({}).catchall(z.any()), z.array(z.object({}).catchall(z.any())), z.string(), z.array(z.string()), z.array(z.number())]) });
export type EmployeeSettingsResponseDto = z.infer<typeof EmployeeSettingsResponseDtoSchema>;

/** 
 * UpdateEmployeeSettingDtoSchema 
 * @type { object }
 * @property { object } value The value to store for the setting. If null, the setting will be deleted. 
 */
export const UpdateEmployeeSettingDtoSchema = z.object({ value: z.union([z.object({}).catchall(z.any()), z.array(z.unknown()), z.string(), z.number(), z.boolean()]).nullable() }).partial();
export type UpdateEmployeeSettingDto = z.infer<typeof UpdateEmployeeSettingDtoSchema>;

/** 
 * EmployeeRoleUpdateRequestSchema 
 * @type { object }
 * @property { string } name Role Id 
 * @property { string } color Role Color 
 * @property { string } description Role Description 
 */
export const EmployeeRoleUpdateRequestSchema = z.object({ name: z.string(), color: z.string(), description: z.string() });
export type EmployeeRoleUpdateRequest = z.infer<typeof EmployeeRoleUpdateRequestSchema>;

/** 
 * EmployeeRoleTogglePermissionRequestSchema 
 * @type { object }
 * @property { boolean } toggled Turn the permission on or off 
 */
export const EmployeeRoleTogglePermissionRequestSchema = z.object({ toggled: z.boolean() });
export type EmployeeRoleTogglePermissionRequest = z.infer<typeof EmployeeRoleTogglePermissionRequestSchema>;

/** 
 * CopyEmployeeRoleDtoSchema 
 * @type { object }
 * @property { string } newRoleName  
 */
export const CopyEmployeeRoleDtoSchema = z.object({ newRoleName: z.string() });
export type CopyEmployeeRoleDto = z.infer<typeof CopyEmployeeRoleDtoSchema>;

/** 
 * EmployeeFilterDtoSchema 
 * @type { object }
 * @property { string } office Office ID (single select, offices the user has access to) 
 * @property { string[] } roles Role IDs (multiselect) 
 * @property { string } primaryOfficeId Primary office id 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } email Email 
 * @property { string[] } ids Ids 
 * @property { boolean } archived Archived
 * set to true to only return archived employees
 * does not return archived employees by default. Default: `false` 
 * @property { string } search Free text search multiple fields 
 * @property { string } officeRole Office role 
 */
export const EmployeeFilterDtoSchema = z.object({ office: z.string().nullable(), roles: z.array(z.string()).nullable(), primaryOfficeId: z.string().nullable(), firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.string().nullable(), ids: z.array(z.string()).nullable(), archived: z.boolean().nullable().default(false), search: z.string().nullable(), officeRole: z.string().nullable() }).partial();
export type EmployeeFilterDto = z.infer<typeof EmployeeFilterDtoSchema>;

/** 
 * EmployeeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search Free text search 
 * @property { string } officeId Office ID to filter employees by employment in that office 
 */
export const EmployeeLabelFilterDtoSchema = z.object({ search: z.string().nullable(), officeId: z.string().nullable() }).partial();
export type EmployeeLabelFilterDto = z.infer<typeof EmployeeLabelFilterDtoSchema>;

/** 
 * EmployeeRoleMemberResponseSchema 
 * @type { object }
 * @property { string } roleId  
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmployeeRoleMemberResponseSchema = z.object({ roleId: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), permissions: z.array(z.string()) });
export type EmployeeRoleMemberResponse = z.infer<typeof EmployeeRoleMemberResponseSchema>;

/** 
 * EmployeeRoleMembershipsUpdateRequestSchema 
 * @type { object }
 * @property { string[] } roleIds Array of role IDs 
 */
export const EmployeeRoleMembershipsUpdateRequestSchema = z.object({ roleIds: z.array(z.string()) });
export type EmployeeRoleMembershipsUpdateRequest = z.infer<typeof EmployeeRoleMembershipsUpdateRequestSchema>;

/** 
 * EmploymentCreateRequestSchema 
 * @type { object }
 * @property { string } officeId  
 * @property { string } employeeId  
 */
export const EmploymentCreateRequestSchema = z.object({ officeId: z.string(), employeeId: z.string() });
export type EmploymentCreateRequest = z.infer<typeof EmploymentCreateRequestSchema>;

/** 
 * EmploymentFilterDtoSchema 
 * @type { object }
 * @property { string } officeId Office IDs 
 * @property { string } employeeId Employee IDs 
 */
export const EmploymentFilterDtoSchema = z.object({ officeId: z.string().nullable(), employeeId: z.string().nullable() }).partial();
export type EmploymentFilterDto = z.infer<typeof EmploymentFilterDtoSchema>;

/** 
 * EmploymentRoleMemberResponseSchema 
 * @type { object }
 * @property { string } roleId  
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmploymentRoleMemberResponseSchema = z.object({ roleId: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), permissions: z.array(z.string()) });
export type EmploymentRoleMemberResponse = z.infer<typeof EmploymentRoleMemberResponseSchema>;

/** 
 * EmploymentRoleMembershipsUpdateRequestSchema 
 * @type { object }
 * @property { string[] } roleIds Array of role IDs 
 */
export const EmploymentRoleMembershipsUpdateRequestSchema = z.object({ roleIds: z.array(z.string()) });
export type EmploymentRoleMembershipsUpdateRequest = z.infer<typeof EmploymentRoleMembershipsUpdateRequestSchema>;

/** 
 * UpdateEmploymentRequestDtoSchema 
 * @type { object }
 * @property { string } costCenter  
 * @property { string[] } roleIds  
 */
export const UpdateEmploymentRequestDtoSchema = z.object({ costCenter: z.string().nullable(), roleIds: z.array(z.string()).nullable() }).partial();
export type UpdateEmploymentRequestDto = z.infer<typeof UpdateEmploymentRequestDtoSchema>;

/** 
 * CreateCustomerDTOSchema 
 * @type { object }
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 */
export const CreateCustomerDTOSchema = z.object({ firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string().nullish(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish() });
export type CreateCustomerDTO = z.infer<typeof CreateCustomerDTOSchema>;

/** 
 * CustomerPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } firstName  
 * @property { string } lastName  
 * @property { string } email  
 * @property { string } companyId  
 * @property { string } businessPartnerId  
 * @property { string } search  
 */
export const CustomerPaginationFilterDtoSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.string().nullable(), companyId: z.string().nullable(), businessPartnerId: z.string().nullable(), search: z.string().nullable() }).partial();
export type CustomerPaginationFilterDto = z.infer<typeof CustomerPaginationFilterDtoSchema>;

/** 
 * UpdateCustomerDTOSchema 
 * @type { object }
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 */
export const UpdateCustomerDTOSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), phone: z.string().nullable(), companyId: z.string().nullable(), businessPartnerId: z.string().nullable() }).partial();
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerDTOSchema>;

/** 
 * QuoteListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } totalProfit  
 * @property { number } profitPerQuote  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const QuoteListResponseDtoSchema = z.object({ items: z.array(z.string()), totalProfit: z.number(), profitPerQuote: z.number(), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type QuoteListResponseDto = z.infer<typeof QuoteListResponseDtoSchema>;

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

/** 
 * CreateDunningWithInvoicesRequestDTOSchema 
 * @type { object }
 * @property { string[] } invoiceIds Array of outstanding invoice IDs to include in the dunning. Example: `123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001` 
 * @property { string } dunningLevelId The ID of the dunning level to use for this dunning. Example: `123e4567-e89b-12d3-a456-426614174002` 
 * @property { number } dunningFee Optional dunning fee to use. If not provided, the fee from the dunning level will be used. Minimum: `0`. Example: `25.5` 
 * @property { number } interestRate Minimum: `0`. Maximum: `100`. Example: `25.5` 
 * @property { boolean } includeUpcomingInvoices  
 */
export const CreateDunningWithInvoicesRequestDTOSchema = z.object({ invoiceIds: z.array(z.string()), dunningLevelId: z.string(), dunningFee: z.number().gte(0).nullish(), interestRate: z.number().gte(0).lte(100).nullish(), includeUpcomingInvoices: z.boolean().nullish() });
export type CreateDunningWithInvoicesRequestDTO = z.infer<typeof CreateDunningWithInvoicesRequestDTOSchema>;

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
 * DunningLevelLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DunningLevelLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type DunningLevelLabelFilterDto = z.infer<typeof DunningLevelLabelFilterDtoSchema>;

/** 
 * DunningLevelFilterDtoSchema 
 * @type { object }
 * @property { string } dunningSystemId Dunning system ID to filter by 
 * @property { string } search Search to filter by 
 * @property { boolean } archived Filter by archived status 
 */
export const DunningLevelFilterDtoSchema = z.object({ dunningSystemId: z.string().nullable(), search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type DunningLevelFilterDto = z.infer<typeof DunningLevelFilterDtoSchema>;

/** 
 * DunningSystemLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DunningSystemLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type DunningSystemLabelFilterDto = z.infer<typeof DunningSystemLabelFilterDtoSchema>;

/** 
 * DunningSystemFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 * @property { boolean } isDefault  
 */
export const DunningSystemFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable(), isDefault: z.boolean().nullable() }).partial();
export type DunningSystemFilterDto = z.infer<typeof DunningSystemFilterDtoSchema>;

/** 
 * CreateDunningSystemRequestDTOSchema 
 * @type { object }
 * @property { string } name Dunning system name. Min Length: `3`. Max Length: `100` 
 * @property { boolean } isDefault Is default dunning system 
 */
export const CreateDunningSystemRequestDTOSchema = z.object({ name: z.string().min(3).max(100), isDefault: z.boolean().nullish() });
export type CreateDunningSystemRequestDTO = z.infer<typeof CreateDunningSystemRequestDTOSchema>;

/** 
 * UpdateDunningSystemRequestDTOSchema 
 * @type { object }
 * @property { string } name Dunning system name. Min Length: `3`. Max Length: `100` 
 * @property { boolean } isDefault Is default dunning system 
 */
export const UpdateDunningSystemRequestDTOSchema = z.object({ name: z.string().min(3).max(100).nullable(), isDefault: z.boolean().nullable() }).partial();
export type UpdateDunningSystemRequestDTO = z.infer<typeof UpdateDunningSystemRequestDTOSchema>;

/** 
 * PositionLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } isParentPosition  
 * @property { boolean } isLinkedPosition  
 */
export const PositionLabelsFilterDtoSchema = z.object({ search: z.string().nullable(), isParentPosition: z.boolean().nullable(), isLinkedPosition: z.boolean().nullable() }).partial();
export type PositionLabelsFilterDto = z.infer<typeof PositionLabelsFilterDtoSchema>;

/** 
 * PositionListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const PositionListResponseDtoSchema = z.object({ items: z.array(z.string()), totalProfit: z.number(), profitPerPosition: z.number(), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type PositionListResponseDto = z.infer<typeof PositionListResponseDtoSchema>;

/** 
 * LinkChildPositionsRequestDtoSchema 
 * @type { object }
 * @property { string[] } childPositionIds  
 */
export const LinkChildPositionsRequestDtoSchema = z.object({ childPositionIds: z.array(z.string()) });
export type LinkChildPositionsRequestDto = z.infer<typeof LinkChildPositionsRequestDtoSchema>;

/** 
 * UnlinkChildPositionsRequestDtoSchema 
 * @type { object }
 * @property { string[] } childPositionIds  
 */
export const UnlinkChildPositionsRequestDtoSchema = z.object({ childPositionIds: z.array(z.string()) });
export type UnlinkChildPositionsRequestDto = z.infer<typeof UnlinkChildPositionsRequestDtoSchema>;

/** 
 * ConvertQuoteToPositionRequestDtoSchema 
 * @type { object }
 * @property { string } estimatedServiceDate  
 */
export const ConvertQuoteToPositionRequestDtoSchema = z.object({ estimatedServiceDate: z.iso.datetime({ offset: true }) });
export type ConvertQuoteToPositionRequestDto = z.infer<typeof ConvertQuoteToPositionRequestDtoSchema>;

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
 * PaymentConfirmationItemFilterDtoSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner ID 
 * @property { string } paymentDate Payment date 
 */
export const PaymentConfirmationItemFilterDtoSchema = z.object({ businessPartnerId: z.string(), paymentDate: z.iso.datetime({ offset: true }) });
export type PaymentConfirmationItemFilterDto = z.infer<typeof PaymentConfirmationItemFilterDtoSchema>;

/** 
 * GeneratePaymentConfirmationRequestDtoSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner ID 
 * @property { string } paymentDate Payment date 
 * @property { string } positionId Position ID (optional) 
 */
export const GeneratePaymentConfirmationRequestDtoSchema = z.object({ businessPartnerId: z.string(), paymentDate: z.iso.datetime({ offset: true }), positionId: z.string().nullish() });
export type GeneratePaymentConfirmationRequestDto = z.infer<typeof GeneratePaymentConfirmationRequestDtoSchema>;

/** 
 * CreateProjectLiteRequestDTOSchema 
 * @type { object }
 * @property { string } name Project name 
 */
export const CreateProjectLiteRequestDTOSchema = z.object({ name: z.string() });
export type CreateProjectLiteRequestDTO = z.infer<typeof CreateProjectLiteRequestDTOSchema>;

/** 
 * ProjectLiteFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ProjectLiteFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ProjectLiteFilterDto = z.infer<typeof ProjectLiteFilterDtoSchema>;

/** 
 * UpdateProjectLiteRequestDTOSchema 
 * @type { object }
 * @property { string } name Project name 
 */
export const UpdateProjectLiteRequestDTOSchema = z.object({ name: z.string().nullable() }).partial();
export type UpdateProjectLiteRequestDTO = z.infer<typeof UpdateProjectLiteRequestDTOSchema>;

/** 
 * ApplyTemplatesRequestDtoSchema 
 * @type { object }
 * @property { string[] } templateIds  
 */
export const ApplyTemplatesRequestDtoSchema = z.object({ templateIds: z.array(z.string()) });
export type ApplyTemplatesRequestDto = z.infer<typeof ApplyTemplatesRequestDtoSchema>;

/** 
 * UpdatePositionChecklistItemDtoSchema 
 * @type { object }
 * @property { string } notes Max Length: `512` 
 */
export const UpdatePositionChecklistItemDtoSchema = z.object({ notes: z.string().max(512).nullable() }).partial();
export type UpdatePositionChecklistItemDto = z.infer<typeof UpdatePositionChecklistItemDtoSchema>;

/** 
 * ReorderPositionChecklistDtoSchema 
 * @type { object }
 * @property { string[] } itemIds  
 */
export const ReorderPositionChecklistDtoSchema = z.object({ itemIds: z.array(z.string()) });
export type ReorderPositionChecklistDto = z.infer<typeof ReorderPositionChecklistDtoSchema>;

/** 
 * CreateChecklistTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist template name. Min Length: `3`. Max Length: `120` 
 */
export const CreateChecklistTemplateRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type CreateChecklistTemplateRequestDTO = z.infer<typeof CreateChecklistTemplateRequestDTOSchema>;

/** 
 * ChecklistTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const ChecklistTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type ChecklistTemplateLabelFilterDto = z.infer<typeof ChecklistTemplateLabelFilterDtoSchema>;

/** 
 * ChecklistTemplateFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ChecklistTemplateFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ChecklistTemplateFilterDto = z.infer<typeof ChecklistTemplateFilterDtoSchema>;

/** 
 * UpdateChecklistTemplateRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist template name. Min Length: `3`. Max Length: `120` 
 * @property { string[] } items Ordered checklist item ids 
 */
export const UpdateChecklistTemplateRequestDTOSchema = z.object({ name: z.string().min(3).max(120), items: z.array(z.uuid()) });
export type UpdateChecklistTemplateRequestDTO = z.infer<typeof UpdateChecklistTemplateRequestDTOSchema>;

/** 
 * CreateBookkeepingExportBatchResponseDtoSchema 
 * @type { object }
 * @property { string } batchId  
 */
export const CreateBookkeepingExportBatchResponseDtoSchema = z.object({ batchId: z.string() });
export type CreateBookkeepingExportBatchResponseDto = z.infer<typeof CreateBookkeepingExportBatchResponseDtoSchema>;

/** 
 * UpdateBookkeepingExportBatchItemRequestDtoSchema 
 * @type { object }
 * @property { boolean } includedInExport Whether the item should be included in the export 
 * @property { string[] } itemIds Min Items: `0` 
 * @property { boolean } vatOk  
 * @property { boolean } invoiceOk  
 */
export const UpdateBookkeepingExportBatchItemRequestDtoSchema = z.object({ includedInExport: z.boolean().nullish(), itemIds: z.array(z.string()), vatOk: z.boolean().nullish(), invoiceOk: z.boolean().nullish() });
export type UpdateBookkeepingExportBatchItemRequestDto = z.infer<typeof UpdateBookkeepingExportBatchItemRequestDtoSchema>;

/** 
 * CreateFactoringExportRequestDtoSchema 
 * @type { object }
 * @property { string } invoiceDateFrom Invoice date from 
 * @property { string } invoiceDateUntil Invoice date until 
 */
export const CreateFactoringExportRequestDtoSchema = z.object({ invoiceDateFrom: z.iso.datetime({ offset: true }), invoiceDateUntil: z.iso.datetime({ offset: true }) });
export type CreateFactoringExportRequestDto = z.infer<typeof CreateFactoringExportRequestDtoSchema>;

/** 
 * AWBStockFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived  
 * @property { string } carrierId  
 * @property { string } searchQuery  
 * @property { boolean } used  
 */
export const AWBStockFilterDtoSchema = z.object({ archived: z.boolean().nullable(), carrierId: z.string().nullable(), searchQuery: z.string().nullable(), used: z.boolean().nullable() }).partial();
export type AWBStockFilterDto = z.infer<typeof AWBStockFilterDtoSchema>;

/** 
 * CreateAWBStockRequestDTOSchema 
 * @type { object }
 * @property { string } carrierId Carrier business partner ID 
 * @property { number } startNumber Start number. Minimum: `0` 
 * @property { number } stock Stock size 
 * @property { number } priority Priority 
 * @property { string } comments Comments 
 * @property { string } officeId Office ID 
 */
export const CreateAWBStockRequestDTOSchema = z.object({ carrierId: z.string(), startNumber: z.number().gte(0), stock: z.number(), priority: z.number(), comments: z.string().nullish(), officeId: z.string() });
export type CreateAWBStockRequestDTO = z.infer<typeof CreateAWBStockRequestDTOSchema>;

/** 
 * GenerateAWBNumberRequestDTOSchema 
 * @type { object }
 * @property { string } carrierId Carrier ID. Example: `e847c7dd-a364-4488-bed6-1e5878aff022` 
 */
export const GenerateAWBNumberRequestDTOSchema = z.object({ carrierId: z.string() });
export type GenerateAWBNumberRequestDTO = z.infer<typeof GenerateAWBNumberRequestDTOSchema>;

/** 
 * GenerateAWBNumberResponseDTOSchema 
 * @type { object }
 * @property { string } formattedAwbNumber Generated AWB number. Example: `123-45678901` 
 */
export const GenerateAWBNumberResponseDTOSchema = z.object({ formattedAwbNumber: z.string() });
export type GenerateAWBNumberResponseDTO = z.infer<typeof GenerateAWBNumberResponseDTOSchema>;

/** 
 * UpdateAWBStockRequestDTOSchema 
 * @type { object }
 * @property { string } comments Comments 
 */
export const UpdateAWBStockRequestDTOSchema = z.object({ comments: z.string().nullable() }).partial();
export type UpdateAWBStockRequestDTO = z.infer<typeof UpdateAWBStockRequestDTOSchema>;

/** 
 * ContainerYardFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ContainerYardFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ContainerYardFilterDto = z.infer<typeof ContainerYardFilterDtoSchema>;

/** 
 * ContainerYardLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const ContainerYardLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type ContainerYardLabelFilterDto = z.infer<typeof ContainerYardLabelFilterDtoSchema>;

/** 
 * CreateContainerYardRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Match code 
 * @property { string } name Name 
 * @property { string } shortName Short name 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } cityId City ID 
 * @property { string } countryId Country ID 
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 */
export const CreateContainerYardRequestDTOSchema = z.object({ matchCode: z.string(), name: z.string(), shortName: z.string().nullish(), street: z.string(), secondaryStreet: z.string().nullish(), zip: z.string(), cityId: z.string(), countryId: z.string(), district: z.string().nullish(), additionalInformation: z.string().nullish() });
export type CreateContainerYardRequestDTO = z.infer<typeof CreateContainerYardRequestDTOSchema>;

/** 
 * UpdateContainerYardRequestDTOSchema 
 * @type { object }
 * @property { string } matchCode Match code 
 * @property { string } name Name 
 * @property { string } shortName Short name 
 * @property { string } addressId Address ID 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } cityId City ID 
 * @property { string } countryId Country ID 
 * @property { string } district District 
 * @property { string } additionalInformation Additional information 
 */
export const UpdateContainerYardRequestDTOSchema = z.object({ matchCode: z.string().nullable(), name: z.string().nullable(), shortName: z.string().nullable(), addressId: z.string().nullable(), street: z.string().nullable(), secondaryStreet: z.string().nullable(), zip: z.string().nullable(), cityId: z.string().nullable(), countryId: z.string().nullable(), district: z.string().nullable(), additionalInformation: z.string().nullable() }).partial();
export type UpdateContainerYardRequestDTO = z.infer<typeof UpdateContainerYardRequestDTOSchema>;

/** 
 * CreateChecklistItemRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist item name. Min Length: `3`. Max Length: `256` 
 */
export const CreateChecklistItemRequestDTOSchema = z.object({ name: z.string().min(3).max(256) });
export type CreateChecklistItemRequestDTO = z.infer<typeof CreateChecklistItemRequestDTOSchema>;

/** 
 * ChecklistItemLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const ChecklistItemLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type ChecklistItemLabelFilterDto = z.infer<typeof ChecklistItemLabelFilterDtoSchema>;

/** 
 * ChecklistItemFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ChecklistItemFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ChecklistItemFilterDto = z.infer<typeof ChecklistItemFilterDtoSchema>;

/** 
 * UpdateChecklistItemRequestDTOSchema 
 * @type { object }
 * @property { string } name Checklist item name. Min Length: `3`. Max Length: `256` 
 */
export const UpdateChecklistItemRequestDTOSchema = z.object({ name: z.string().min(3).max(256).nullable() }).partial();
export type UpdateChecklistItemRequestDTO = z.infer<typeof UpdateChecklistItemRequestDTOSchema>;

/** 
 * MasterDataImportUploadRequestDtoSchema 
 * @type { object }
 * @property { string } filename File name 
 * @property { string } contentType Content type of the file 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const MasterDataImportUploadRequestDtoSchema = z.object({ filename: z.string(), contentType: z.string(), fileSize: z.number().gte(1) });
export type MasterDataImportUploadRequestDto = z.infer<typeof MasterDataImportUploadRequestDtoSchema>;

/** 
 * MasterDataImportUploadResponseDtoSchema 
 * @type { object }
 * @property { string } mediaId Media ID for the uploaded file 
 * @property { string } url S3 presigned upload URL 
 */
export const MasterDataImportUploadResponseDtoSchema = z.object({ mediaId: z.string(), url: z.string() });
export type MasterDataImportUploadResponseDto = z.infer<typeof MasterDataImportUploadResponseDtoSchema>;

/** 
 * MasterDataImportResponseDtoSchema 
 * @type { object }
 * @property { string } jobId PG Boss job ID 
 * @property { string } status Initial job status 
 */
export const MasterDataImportResponseDtoSchema = z.object({ jobId: z.string(), status: z.string().nullish() });
export type MasterDataImportResponseDto = z.infer<typeof MasterDataImportResponseDtoSchema>;

/** 
 * RemarkTemplateLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const RemarkTemplateLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type RemarkTemplateLabelFilterDto = z.infer<typeof RemarkTemplateLabelFilterDtoSchema>;

/** 
 * IntegrationChannelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const IntegrationChannelFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type IntegrationChannelFilterDto = z.infer<typeof IntegrationChannelFilterDtoSchema>;

/** 
 * IntegrationChannelLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const IntegrationChannelLabelsFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type IntegrationChannelLabelsFilterDto = z.infer<typeof IntegrationChannelLabelsFilterDtoSchema>;

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
export const CreateIntegrationChannelRequestDtoSchema = z.object({ businessPartnerId: z.string(), employeeId: z.string(), name: z.string(), sftpHost: z.string(), sftpPort: z.number().gte(1).lte(65535), sftpUsername: z.string(), sftpPassword: z.string(), inboundPath: z.string(), outboundPath: z.string(), pollingFrequencyMinutes: z.number().gte(1) });
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
export const UpdateIntegrationChannelRequestDtoSchema = z.object({ businessPartnerId: z.string().nullable(), employeeId: z.string().nullable(), name: z.string().nullable(), sftpHost: z.string().nullable(), sftpPort: z.number().gte(1).lte(65535).nullable(), sftpUsername: z.string().nullable(), sftpPassword: z.string().nullable(), inboundPath: z.string().nullable(), outboundPath: z.string().nullable(), pollingFrequencyMinutes: z.number().gte(1).nullable() }).partial();
export type UpdateIntegrationChannelRequestDto = z.infer<typeof UpdateIntegrationChannelRequestDtoSchema>;

/** 
 * TestConnectionResponseDtoSchema 
 * @type { object }
 * @property { boolean } success  
 */
export const TestConnectionResponseDtoSchema = z.object({ success: z.boolean() });
export type TestConnectionResponseDto = z.infer<typeof TestConnectionResponseDtoSchema>;

/** 
 * IntegrationMessageFilterDtoSchema 
 * @type { object }
 * @property { string[] } integrationChannelId  
 * @property { string } search  
 */
export const IntegrationMessageFilterDtoSchema = z.object({ integrationChannelId: z.array(z.uuid()).nullable(), search: z.string().nullable() }).partial();
export type IntegrationMessageFilterDto = z.infer<typeof IntegrationMessageFilterDtoSchema>;

/** 
 * BookingFilterDtoSchema 
 * @type { object }
 * @property { string } projectId  
 * @property { string } search Min Length: `1` 
 * @property { string[] } companyIds  
 * @property { string } purchaseOrderId  
 */
export const BookingFilterDtoSchema = z.object({ projectId: z.string().nullable(), search: z.string().min(1).nullable(), companyIds: z.array(z.string()).nullable(), purchaseOrderId: z.string().nullable() }).partial();
export type BookingFilterDto = z.infer<typeof BookingFilterDtoSchema>;

/** 
 * PackageFilterDtoSchema 
 * @type { object }
 * @property { string } search Min Length: `1` 
 */
export const PackageFilterDtoSchema = z.object({ search: z.string().min(1).nullable() }).partial();
export type PackageFilterDto = z.infer<typeof PackageFilterDtoSchema>;

/** 
 * ContainerFilterDtoSchema 
 * @type { object }
 * @property { number[] } companyIds  
 * @property { string } search  
 */
export const ContainerFilterDtoSchema = z.object({ companyIds: z.array(z.number()).nullable(), search: z.string().nullable() }).partial();
export type ContainerFilterDto = z.infer<typeof ContainerFilterDtoSchema>;

/** 
 * LoginRequestDtoSchema 
 * @type { object }
 * @property { string } username  
 * @property { string } password  
 */
export const LoginRequestDtoSchema = z.object({ username: z.string(), password: z.string() });
export type LoginRequestDto = z.infer<typeof LoginRequestDtoSchema>;

/** 
 * LoginResponseDtoSchema 
 * @type { object }
 * @property { string } accessToken  
 * @property { boolean } resetPasswordRequired  
 * @property { string } passwordResetToken  
 * @property { string } username  
 */
export const LoginResponseDtoSchema = z.object({ accessToken: z.string().nullable(), resetPasswordRequired: z.boolean().nullish(), passwordResetToken: z.string().nullish(), username: z.string().nullish() });
export type LoginResponseDto = z.infer<typeof LoginResponseDtoSchema>;

/** 
 * PasswordResetDtoSchema 
 * @type { object }
 * @property { string } password  
 * @property { string } username  
 * @property { string } token  
 */
export const PasswordResetDtoSchema = z.object({ password: z.string(), username: z.string(), token: z.string() });
export type PasswordResetDto = z.infer<typeof PasswordResetDtoSchema>;

/** 
 * UserBasicUpdateDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } email  
 */
export const UserBasicUpdateDtoSchema = z.object({ name: z.string(), email: z.email() });
export type UserBasicUpdateDto = z.infer<typeof UserBasicUpdateDtoSchema>;

/** 
 * UserPasswordUpdateDtoSchema 
 * @type { object }
 * @property { string } password  
 */
export const UserPasswordUpdateDtoSchema = z.object({ password: z.string() });
export type UserPasswordUpdateDto = z.infer<typeof UserPasswordUpdateDtoSchema>;

/** 
 * SearchRequestDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const SearchRequestDtoSchema = z.object({ search: z.string() });
export type SearchRequestDto = z.infer<typeof SearchRequestDtoSchema>;

/** 
 * UpdateShippingInstructionMessageRequestDtoSchema 
 * @type { object }
 * @property { string } notes  
 */
export const UpdateShippingInstructionMessageRequestDtoSchema = z.object({ notes: z.string().nullable() }).partial();
export type UpdateShippingInstructionMessageRequestDto = z.infer<typeof UpdateShippingInstructionMessageRequestDtoSchema>;

/** 
 * CreateShippingInstructionMessageRequestDtoSchema 
 * @type { object }
 * @property { boolean } isAmendment Default: `false` 
 */
export const CreateShippingInstructionMessageRequestDtoSchema = z.object({ isAmendment: z.boolean().nullable().default(false) }).partial();
export type CreateShippingInstructionMessageRequestDto = z.infer<typeof CreateShippingInstructionMessageRequestDtoSchema>;

/** 
 * OfficeInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } rotatedByUserId  
 * @property { string } officeId  
 * @property { string } sftpUsername  
 * @property { string } sftpPublicKey  
 * @property { string } partnerCode  
 * @property { string } ediId  
 * @property { string } notificationEmail  
 */
export const OfficeInttraCredentialsResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string().nullish(), officeId: z.string(), sftpUsername: z.string().nullish(), sftpPublicKey: z.string().nullish(), partnerCode: z.string().nullish(), ediId: z.string().nullish(), notificationEmail: z.string().nullish() });
export type OfficeInttraCredentialsResponseDto = z.infer<typeof OfficeInttraCredentialsResponseDtoSchema>;

/** 
 * GenerateInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } publicKey  
 * @property { string } rotatedAt  
 * @property { string } rotatedByUserId  
 */
export const GenerateInttraCredentialsResponseDtoSchema = z.object({ publicKey: z.string(), rotatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string() });
export type GenerateInttraCredentialsResponseDto = z.infer<typeof GenerateInttraCredentialsResponseDtoSchema>;

/** 
 * UpdateInttraCredentialsRequestDtoSchema 
 * @type { object }
 * @property { string } sftpUsername  
 * @property { string } sftpPassword  
 * @property { string } partnerCode  
 * @property { string } ediId  
 * @property { string } notificationEmail  
 */
export const UpdateInttraCredentialsRequestDtoSchema = z.object({ sftpUsername: z.string().nullable(), sftpPassword: z.string().nullable(), partnerCode: z.string().nullable(), ediId: z.string().nullable(), notificationEmail: z.string().nullable() }).partial();
export type UpdateInttraCredentialsRequestDto = z.infer<typeof UpdateInttraCredentialsRequestDtoSchema>;

/** 
 * UpdateInttraCredentialsResponseDtoSchema 
 * @type { object }
 * @property { string } rotatedAt  
 * @property { string } rotatedByUserId  
 */
export const UpdateInttraCredentialsResponseDtoSchema = z.object({ rotatedAt: z.iso.datetime({ offset: true }), rotatedByUserId: z.string() });
export type UpdateInttraCredentialsResponseDto = z.infer<typeof UpdateInttraCredentialsResponseDtoSchema>;

/** 
 * WorkingDocumentsListOrderParamEnumSchema 
 * @type { enum }
 */
export const WorkingDocumentsListOrderParamEnumSchema = z.enum(["NAME", "TYPE", "CREATED_AT", "UPDATED_AT"]);
export type WorkingDocumentsListOrderParamEnum = z.infer<typeof WorkingDocumentsListOrderParamEnumSchema>;
export const WorkingDocumentsListOrderParamEnum = WorkingDocumentsListOrderParamEnumSchema.enum;

/** 
 * WorkingDocumentsListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { WorkingDocumentsModels.WorkingDocumentResponseDTO[] } items  
 */
export const WorkingDocumentsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(WorkingDocumentResponseDTOSchema).nullable() }).partial().shape });
export type WorkingDocumentsListResponse = z.infer<typeof WorkingDocumentsListResponseSchema>;

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
 * @property { OfficesModels.OfficeListItemResponse[] } items  
 */
export const OfficesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(OfficeListItemResponseSchema).nullable() }).partial().shape });
export type OfficesPaginateResponse = z.infer<typeof OfficesPaginateResponseSchema>;

/** 
 * FindAllLabelsResponseSchema 
 * @type { array }
 */
export const FindAllLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
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
 * @property { LabelResponseDTO[] } items  
 */
export const OfficesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type OfficesPaginateLabelsResponse = z.infer<typeof OfficesPaginateLabelsResponseSchema>;

/** 
 * BankAccountsFindAllResponseSchema 
 * @type { array }
 */
export const BankAccountsFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type BankAccountsFindAllResponse = z.infer<typeof BankAccountsFindAllResponseSchema>;

/** 
 * BankAccountsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const BankAccountsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "bankName", "createdAt", "updatedAt"]);
export type BankAccountsPaginateLabelsOrderParamEnum = z.infer<typeof BankAccountsPaginateLabelsOrderParamEnumSchema>;
export const BankAccountsPaginateLabelsOrderParamEnum = BankAccountsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * BankAccountsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const BankAccountsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type BankAccountsPaginateLabelsResponse = z.infer<typeof BankAccountsPaginateLabelsResponseSchema>;

/** 
 * CurrenciesListOrderParamEnumSchema 
 * @type { enum }
 */
export const CurrenciesListOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CurrenciesListOrderParamEnum = z.infer<typeof CurrenciesListOrderParamEnumSchema>;
export const CurrenciesListOrderParamEnum = CurrenciesListOrderParamEnumSchema.enum;

/** 
 * CurrenciesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CurrenciesModels.CurrencyResponseDto[] } items  
 */
export const CurrenciesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CurrencyResponseDtoSchema).nullable() }).partial().shape });
export type CurrenciesListResponse = z.infer<typeof CurrenciesListResponseSchema>;

/** 
 * PaginateCurrencyLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCurrencyLabelsOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCurrencyLabelsOrderParamEnum = z.infer<typeof PaginateCurrencyLabelsOrderParamEnumSchema>;
export const PaginateCurrencyLabelsOrderParamEnum = PaginateCurrencyLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateCurrencyLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PaginateCurrencyLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateCurrencyLabelsResponse = z.infer<typeof PaginateCurrencyLabelsResponseSchema>;

/** 
 * PaginateCurrencyLabelsByOfficeOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCurrencyLabelsByOfficeOrderParamEnumSchema = z.enum(["isoCode", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCurrencyLabelsByOfficeOrderParamEnum = z.infer<typeof PaginateCurrencyLabelsByOfficeOrderParamEnumSchema>;
export const PaginateCurrencyLabelsByOfficeOrderParamEnum = PaginateCurrencyLabelsByOfficeOrderParamEnumSchema.enum;

/** 
 * PaginateCurrencyLabelsByOfficeResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PaginateCurrencyLabelsByOfficeResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateCurrencyLabelsByOfficeResponse = z.infer<typeof PaginateCurrencyLabelsByOfficeResponseSchema>;

/** 
 * CountriesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CountriesPaginateOrderParamEnumSchema = z.enum(["name", "isoCode2", "isoCode3", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CountriesPaginateOrderParamEnum = z.infer<typeof CountriesPaginateOrderParamEnumSchema>;
export const CountriesPaginateOrderParamEnum = CountriesPaginateOrderParamEnumSchema.enum;

/** 
 * CountriesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CountriesModels.CountryResponseDTO[] } items  
 */
export const CountriesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CountryResponseDTOSchema).nullable() }).partial().shape });
export type CountriesPaginateResponse = z.infer<typeof CountriesPaginateResponseSchema>;

/** 
 * PaginateCountryLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateCountryLabelsOrderParamEnumSchema = z.enum(["name", "isoCode2", "isoCode3", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateCountryLabelsOrderParamEnum = z.infer<typeof PaginateCountryLabelsOrderParamEnumSchema>;
export const PaginateCountryLabelsOrderParamEnum = PaginateCountryLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateCountryLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PaginateCountryLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateCountryLabelsResponse = z.infer<typeof PaginateCountryLabelsResponseSchema>;

/** 
 * TeamsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const TeamsPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TeamsPaginateOrderParamEnum = z.infer<typeof TeamsPaginateOrderParamEnumSchema>;
export const TeamsPaginateOrderParamEnum = TeamsPaginateOrderParamEnumSchema.enum;

/** 
 * TeamsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { TeamsModels.TeamResponseDTO[] } items  
 */
export const TeamsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(TeamResponseDTOSchema).nullable() }).partial().shape });
export type TeamsPaginateResponse = z.infer<typeof TeamsPaginateResponseSchema>;

/** 
 * TeamsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const TeamsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TeamsPaginateLabelsOrderParamEnum = z.infer<typeof TeamsPaginateLabelsOrderParamEnumSchema>;
export const TeamsPaginateLabelsOrderParamEnum = TeamsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * TeamsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const TeamsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type TeamsPaginateLabelsResponse = z.infer<typeof TeamsPaginateLabelsResponseSchema>;

/** 
 * GetContentOrderParamSchema 
 * @type { array }
 * @description Example: `name`
 */
export const GetContentOrderParamSchema = z.array(z.string()).nullish();
export type GetContentOrderParam = z.infer<typeof GetContentOrderParamSchema>;

/** 
 * BusinessPartnersPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const BusinessPartnersPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "vat", "shortName", "address", "locked", "currency", "archived"]);
export type BusinessPartnersPaginateOrderParamEnum = z.infer<typeof BusinessPartnersPaginateOrderParamEnumSchema>;
export const BusinessPartnersPaginateOrderParamEnum = BusinessPartnersPaginateOrderParamEnumSchema.enum;

/** 
 * BusinessPartnersPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BusinessPartnersModels.BusinessPartnerListResponseDTO[] } items  
 */
export const BusinessPartnersPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BusinessPartnerListResponseDTOSchema).nullable() }).partial().shape });
export type BusinessPartnersPaginateResponse = z.infer<typeof BusinessPartnersPaginateResponseSchema>;

/** 
 * BusinessPartnersPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const BusinessPartnersPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "vat", "shortName", "address", "locked", "currency", "archived"]);
export type BusinessPartnersPaginateLabelsOrderParamEnum = z.infer<typeof BusinessPartnersPaginateLabelsOrderParamEnumSchema>;
export const BusinessPartnersPaginateLabelsOrderParamEnum = BusinessPartnersPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * BusinessPartnersPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BusinessPartnersModels.BusinessPartnerPaginatedLabelResponseDTO[] } items  
 */
export const BusinessPartnersPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BusinessPartnerPaginatedLabelResponseDTOSchema).nullable() }).partial().shape });
export type BusinessPartnersPaginateLabelsResponse = z.infer<typeof BusinessPartnersPaginateLabelsResponseSchema>;

/** 
 * GetRemarksResponseSchema 
 * @type { array }
 */
export const GetRemarksResponseSchema = z.array(BusinessPartnerRemarkResponseDTOSchema);
export type GetRemarksResponse = z.infer<typeof GetRemarksResponseSchema>;

/** 
 * UpdateBookkeepingMappingResponseSchema 
 * @type { array }
 */
export const UpdateBookkeepingMappingResponseSchema = z.array(BusinessPartnerBookkeepingMappingResponseDtoSchema);
export type UpdateBookkeepingMappingResponse = z.infer<typeof UpdateBookkeepingMappingResponseSchema>;

/** 
 * PaginateContactLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateContactLabelsOrderParamEnumSchema = z.enum(["name", "role", "email", "createdAt", "updatedAt"]);
export type PaginateContactLabelsOrderParamEnum = z.infer<typeof PaginateContactLabelsOrderParamEnumSchema>;
export const PaginateContactLabelsOrderParamEnum = PaginateContactLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateContactLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PaginateContactLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateContactLabelsResponse = z.infer<typeof PaginateContactLabelsResponseSchema>;

/** 
 * CitiesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CitiesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type CitiesPaginateOrderParamEnum = z.infer<typeof CitiesPaginateOrderParamEnumSchema>;
export const CitiesPaginateOrderParamEnum = CitiesPaginateOrderParamEnumSchema.enum;

/** 
 * CitiesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CitiesModels.CityResponseDTO[] } items  
 */
export const CitiesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CityResponseDTOSchema).nullable() }).partial().shape });
export type CitiesPaginateResponse = z.infer<typeof CitiesPaginateResponseSchema>;

/** 
 * ListCityLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ListCityLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ListCityLabelsOrderParamEnum = z.infer<typeof ListCityLabelsOrderParamEnumSchema>;
export const ListCityLabelsOrderParamEnum = ListCityLabelsOrderParamEnumSchema.enum;

/** 
 * ListCityLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CitiesModels.CityLabelResponseDTO[] } items  
 */
export const ListCityLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CityLabelResponseDTOSchema).nullable() }).partial().shape });
export type ListCityLabelsResponse = z.infer<typeof ListCityLabelsResponseSchema>;

/** 
 * DepotsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const DepotsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DepotsPaginateOrderParamEnum = z.infer<typeof DepotsPaginateOrderParamEnumSchema>;
export const DepotsPaginateOrderParamEnum = DepotsPaginateOrderParamEnumSchema.enum;

/** 
 * DepotsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DepotsModels.DepotResponseDTO[] } items  
 */
export const DepotsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DepotResponseDTOSchema).nullable() }).partial().shape });
export type DepotsPaginateResponse = z.infer<typeof DepotsPaginateResponseSchema>;

/** 
 * DepotsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DepotsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DepotsPaginateLabelsOrderParamEnum = z.infer<typeof DepotsPaginateLabelsOrderParamEnumSchema>;
export const DepotsPaginateLabelsOrderParamEnum = DepotsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DepotsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const DepotsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type DepotsPaginateLabelsResponse = z.infer<typeof DepotsPaginateLabelsResponseSchema>;

/** 
 * PartnerNetworksPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PartnerNetworksPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PartnerNetworksPaginateLabelsOrderParamEnum = z.infer<typeof PartnerNetworksPaginateLabelsOrderParamEnumSchema>;
export const PartnerNetworksPaginateLabelsOrderParamEnum = PartnerNetworksPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * PartnerNetworksPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PartnerNetworksPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PartnerNetworksPaginateLabelsResponse = z.infer<typeof PartnerNetworksPaginateLabelsResponseSchema>;

/** 
 * PartnerNetworksPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PartnerNetworksPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PartnerNetworksPaginateOrderParamEnum = z.infer<typeof PartnerNetworksPaginateOrderParamEnumSchema>;
export const PartnerNetworksPaginateOrderParamEnum = PartnerNetworksPaginateOrderParamEnumSchema.enum;

/** 
 * PartnerNetworksPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PartnerNetworksModels.PartnerNetworkResponseDTO[] } items  
 */
export const PartnerNetworksPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PartnerNetworkResponseDTOSchema).nullable() }).partial().shape });
export type PartnerNetworksPaginateResponse = z.infer<typeof PartnerNetworksPaginateResponseSchema>;

/** 
 * WarehousesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const WarehousesPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type WarehousesPaginateOrderParamEnum = z.infer<typeof WarehousesPaginateOrderParamEnumSchema>;
export const WarehousesPaginateOrderParamEnum = WarehousesPaginateOrderParamEnumSchema.enum;

/** 
 * WarehousesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { WarehousesModels.WarehouseResponseDTO[] } items  
 */
export const WarehousesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(WarehouseResponseDTOSchema).nullable() }).partial().shape });
export type WarehousesPaginateResponse = z.infer<typeof WarehousesPaginateResponseSchema>;

/** 
 * WarehousesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const WarehousesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type WarehousesPaginateLabelsOrderParamEnum = z.infer<typeof WarehousesPaginateLabelsOrderParamEnumSchema>;
export const WarehousesPaginateLabelsOrderParamEnum = WarehousesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * WarehousesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const WarehousesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type WarehousesPaginateLabelsResponse = z.infer<typeof WarehousesPaginateLabelsResponseSchema>;

/** 
 * DocumentTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DocumentTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DocumentTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof DocumentTemplatesPaginateLabelsOrderParamEnumSchema>;
export const DocumentTemplatesPaginateLabelsOrderParamEnum = DocumentTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DocumentTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const DocumentTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type DocumentTemplatesPaginateLabelsResponse = z.infer<typeof DocumentTemplatesPaginateLabelsResponseSchema>;

/** 
 * DocumentTemplatesListOrderParamEnumSchema 
 * @type { enum }
 */
export const DocumentTemplatesListOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DocumentTemplatesListOrderParamEnum = z.infer<typeof DocumentTemplatesListOrderParamEnumSchema>;
export const DocumentTemplatesListOrderParamEnum = DocumentTemplatesListOrderParamEnumSchema.enum;

/** 
 * DocumentTemplatesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DocumentTemplatesModels.DocumentTemplateResponseDTO[] } items  
 */
export const DocumentTemplatesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DocumentTemplateResponseDTOSchema).nullable() }).partial().shape });
export type DocumentTemplatesListResponse = z.infer<typeof DocumentTemplatesListResponseSchema>;

/** 
 * HsCodesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const HsCodesPaginateOrderParamEnumSchema = z.enum(["matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type HsCodesPaginateOrderParamEnum = z.infer<typeof HsCodesPaginateOrderParamEnumSchema>;
export const HsCodesPaginateOrderParamEnum = HsCodesPaginateOrderParamEnumSchema.enum;

/** 
 * HsCodesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { HsCodesModels.HsCodeResponseDTO[] } items  
 */
export const HsCodesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(HsCodeResponseDTOSchema).nullable() }).partial().shape });
export type HsCodesPaginateResponse = z.infer<typeof HsCodesPaginateResponseSchema>;

/** 
 * HsCodesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const HsCodesPaginateLabelsOrderParamEnumSchema = z.enum(["matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type HsCodesPaginateLabelsOrderParamEnum = z.infer<typeof HsCodesPaginateLabelsOrderParamEnumSchema>;
export const HsCodesPaginateLabelsOrderParamEnum = HsCodesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * HsCodesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const HsCodesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type HsCodesPaginateLabelsResponse = z.infer<typeof HsCodesPaginateLabelsResponseSchema>;

/** 
 * CargoTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const CargoTypesPaginateOrderParamEnumSchema = z.enum(["matchcode", "description", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type CargoTypesPaginateOrderParamEnum = z.infer<typeof CargoTypesPaginateOrderParamEnumSchema>;
export const CargoTypesPaginateOrderParamEnum = CargoTypesPaginateOrderParamEnumSchema.enum;

/** 
 * CargoTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CargoTypesModels.CargoTypeResponseDTO[] } items  
 */
export const CargoTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CargoTypeResponseDTOSchema).nullable() }).partial().shape });
export type CargoTypesPaginateResponse = z.infer<typeof CargoTypesPaginateResponseSchema>;

/** 
 * CargoTypesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const CargoTypesPaginateLabelsOrderParamEnumSchema = z.enum(["matchcode", "description", "createdAt", "updatedAt", "createdBy", "updatedBy", "name"]);
export type CargoTypesPaginateLabelsOrderParamEnum = z.infer<typeof CargoTypesPaginateLabelsOrderParamEnumSchema>;
export const CargoTypesPaginateLabelsOrderParamEnum = CargoTypesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * CargoTypesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const CargoTypesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type CargoTypesPaginateLabelsResponse = z.infer<typeof CargoTypesPaginateLabelsResponseSchema>;

/** 
 * FindByPositionIdResponseSchema 
 * @type { array }
 */
export const FindByPositionIdResponseSchema = z.array(CommonModels.InvolvedPartyResponseDtoSchema);
export type FindByPositionIdResponse = z.infer<typeof FindByPositionIdResponseSchema>;

/** 
 * PositionAccountItemsCreateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsCreateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsCreateResponse = z.infer<typeof PositionAccountItemsCreateResponseSchema>;

/** 
 * PositionAccountItemsUpdateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsUpdateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsUpdateResponse = z.infer<typeof PositionAccountItemsUpdateResponseSchema>;

/** 
 * PositionAccountItemsDuplicateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsDuplicateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsDuplicateResponse = z.infer<typeof PositionAccountItemsDuplicateResponseSchema>;

/** 
 * ReassignResponseSchema 
 * @type { array }
 */
export const ReassignResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type ReassignResponse = z.infer<typeof ReassignResponseSchema>;

/** 
 * PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema 
 * @type { enum }
 */
export const PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema = z.enum(["timestamp", "profitAmount", "changeCount"]);
export type PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnum = z.infer<typeof PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema>;
export const PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnum = PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema.enum;

/** 
 * PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDto[] } items  
 */
export const PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PositionAccountProfitChangeGroupDtoSchema).nullable() }).partial().shape });
export type PositionProfitChangeTrackingFindProfitChangeGroupsResponse = z.infer<typeof PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema>;

/** 
 * PortsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PortsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PortsPaginateOrderParamEnum = z.infer<typeof PortsPaginateOrderParamEnumSchema>;
export const PortsPaginateOrderParamEnum = PortsPaginateOrderParamEnumSchema.enum;

/** 
 * PortsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PortsModels.PortResponseDTO[] } items  
 */
export const PortsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PortResponseDTOSchema).nullable() }).partial().shape });
export type PortsPaginateResponse = z.infer<typeof PortsPaginateResponseSchema>;

/** 
 * PortsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PortsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PortsPaginateLabelsOrderParamEnum = z.infer<typeof PortsPaginateLabelsOrderParamEnumSchema>;
export const PortsPaginateLabelsOrderParamEnum = PortsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * PortsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PortsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PortsPaginateLabelsResponse = z.infer<typeof PortsPaginateLabelsResponseSchema>;

/** 
 * TerminalsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const TerminalsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TerminalsPaginateOrderParamEnum = z.infer<typeof TerminalsPaginateOrderParamEnumSchema>;
export const TerminalsPaginateOrderParamEnum = TerminalsPaginateOrderParamEnumSchema.enum;

/** 
 * TerminalsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { TerminalsModels.TerminalResponseDTO[] } items  
 */
export const TerminalsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(TerminalResponseDTOSchema).nullable() }).partial().shape });
export type TerminalsPaginateResponse = z.infer<typeof TerminalsPaginateResponseSchema>;

/** 
 * TerminalsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const TerminalsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "shortName", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TerminalsPaginateLabelsOrderParamEnum = z.infer<typeof TerminalsPaginateLabelsOrderParamEnumSchema>;
export const TerminalsPaginateLabelsOrderParamEnum = TerminalsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * TerminalsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const TerminalsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type TerminalsPaginateLabelsResponse = z.infer<typeof TerminalsPaginateLabelsResponseSchema>;

/** 
 * AirportsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const AirportsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "iataCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type AirportsPaginateOrderParamEnum = z.infer<typeof AirportsPaginateOrderParamEnumSchema>;
export const AirportsPaginateOrderParamEnum = AirportsPaginateOrderParamEnumSchema.enum;

/** 
 * AirportsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { AirportsModels.AirportResponseDTO[] } items  
 */
export const AirportsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(AirportResponseDTOSchema).nullable() }).partial().shape });
export type AirportsPaginateResponse = z.infer<typeof AirportsPaginateResponseSchema>;

/** 
 * AirportsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const AirportsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "iataCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type AirportsPaginateLabelsOrderParamEnum = z.infer<typeof AirportsPaginateLabelsOrderParamEnumSchema>;
export const AirportsPaginateLabelsOrderParamEnum = AirportsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * AirportsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const AirportsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type AirportsPaginateLabelsResponse = z.infer<typeof AirportsPaginateLabelsResponseSchema>;

/** 
 * PositionCargoPaginationOrderFieldSchema 
 * @type { enum }
 */
export const PositionCargoPaginationOrderFieldSchema = z.enum(["createdAt", "updatedAt"]);
export type PositionCargoPaginationOrderField = z.infer<typeof PositionCargoPaginationOrderFieldSchema>;
export const PositionCargoPaginationOrderField = PositionCargoPaginationOrderFieldSchema.enum;

/** 
 * ListCargosByPositionIdOrderParamSchema 
 * @type { array }
 */
export const ListCargosByPositionIdOrderParamSchema = z.array(CommonModels.PositionCargoPaginationOrderFieldSchema).nullish();
export type ListCargosByPositionIdOrderParam = z.infer<typeof ListCargosByPositionIdOrderParamSchema>;

/** 
 * ListCargosByPositionIdResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionCargoResponseDTO[] } items  
 */
export const ListCargosByPositionIdResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.PositionCargoResponseDTOSchema).nullable() }).partial().shape });
export type ListCargosByPositionIdResponse = z.infer<typeof ListCargosByPositionIdResponseSchema>;

/** 
 * PositionCargoListCargoLabelsResponseSchema 
 * @type { array }
 */
export const PositionCargoListCargoLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type PositionCargoListCargoLabelsResponse = z.infer<typeof PositionCargoListCargoLabelsResponseSchema>;

/** 
 * PositionCargoGetCargoSummaryResponseSchema 
 * @type { array }
 */
export const PositionCargoGetCargoSummaryResponseSchema = z.array(CommonModels.CargoSummaryResponseDTOSchema);
export type PositionCargoGetCargoSummaryResponse = z.infer<typeof PositionCargoGetCargoSummaryResponseSchema>;

/** 
 * PositionCargoCreateBulkCargosResponseSchema 
 * @type { array }
 */
export const PositionCargoCreateBulkCargosResponseSchema = z.array(CommonModels.PositionCargoResponseDTOSchema);
export type PositionCargoCreateBulkCargosResponse = z.infer<typeof PositionCargoCreateBulkCargosResponseSchema>;

/** 
 * PackageTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PackageTypesPaginateOrderParamEnumSchema = z.enum(["matchCode", "description", "length", "width", "height", "unit", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PackageTypesPaginateOrderParamEnum = z.infer<typeof PackageTypesPaginateOrderParamEnumSchema>;
export const PackageTypesPaginateOrderParamEnum = PackageTypesPaginateOrderParamEnumSchema.enum;

/** 
 * PackageTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PackageTypesModels.PackageTypeResponseDTO[] } items  
 */
export const PackageTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PackageTypeResponseDTOSchema).nullable() }).partial().shape });
export type PackageTypesPaginateResponse = z.infer<typeof PackageTypesPaginateResponseSchema>;

/** 
 * PackageTypesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PackageTypesPaginateLabelsOrderParamEnumSchema = z.enum(["matchCode", "description", "length", "width", "height", "unit", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PackageTypesPaginateLabelsOrderParamEnum = z.infer<typeof PackageTypesPaginateLabelsOrderParamEnumSchema>;
export const PackageTypesPaginateLabelsOrderParamEnum = PackageTypesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * PackageTypesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PackageTypesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PackageTypesPaginateLabelsResponse = z.infer<typeof PackageTypesPaginateLabelsResponseSchema>;

/** 
 * ChargeTypesFindAllOrderParamEnumSchema 
 * @type { enum }
 */
export const ChargeTypesFindAllOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy", "englishName"]);
export type ChargeTypesFindAllOrderParamEnum = z.infer<typeof ChargeTypesFindAllOrderParamEnumSchema>;
export const ChargeTypesFindAllOrderParamEnum = ChargeTypesFindAllOrderParamEnumSchema.enum;

/** 
 * ChargeTypesFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const ChargeTypesFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ChargeTypesFindAllResponse = z.infer<typeof ChargeTypesFindAllResponseSchema>;

/** 
 * ChargeTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ChargeTypesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy", "englishName"]);
export type ChargeTypesPaginateOrderParamEnum = z.infer<typeof ChargeTypesPaginateOrderParamEnumSchema>;
export const ChargeTypesPaginateOrderParamEnum = ChargeTypesPaginateOrderParamEnumSchema.enum;

/** 
 * ChargeTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChargeTypesModels.ChargeTypeResponseDTO[] } items  
 */
export const ChargeTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChargeTypeResponseDTOSchema).nullable() }).partial().shape });
export type ChargeTypesPaginateResponse = z.infer<typeof ChargeTypesPaginateResponseSchema>;

/** 
 * EmployeeRolesListOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeeRolesListOrderParamEnumSchema = z.enum(["name", "numberOfUsers"]);
export type EmployeeRolesListOrderParamEnum = z.infer<typeof EmployeeRolesListOrderParamEnumSchema>;
export const EmployeeRolesListOrderParamEnum = EmployeeRolesListOrderParamEnumSchema.enum;

/** 
 * EmployeeRolesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRolesModels.EmployeeRoleListItemResponse[] } items  
 */
export const EmployeeRolesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleListItemResponseSchema).nullable() }).partial().shape });
export type EmployeeRolesListResponse = z.infer<typeof EmployeeRolesListResponseSchema>;

/** 
 * LabelsResponseSchema 
 * @type { array }
 */
export const LabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type LabelsResponse = z.infer<typeof LabelsResponseSchema>;

/** 
 * EmployeeRolesPaginatePermissionsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeRolesModels.EmployeeRolePermissionDto[] } items  
 */
export const EmployeeRolesPaginatePermissionsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRolePermissionDtoSchema).nullable() }).partial().shape });
export type EmployeeRolesPaginatePermissionsResponse = z.infer<typeof EmployeeRolesPaginatePermissionsResponseSchema>;

/** 
 * EmployeePermissionsPaginatePermissionsOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePermissionsPaginatePermissionsOrderParamEnumSchema = z.enum(["id"]);
export type EmployeePermissionsPaginatePermissionsOrderParamEnum = z.infer<typeof EmployeePermissionsPaginatePermissionsOrderParamEnumSchema>;
export const EmployeePermissionsPaginatePermissionsOrderParamEnum = EmployeePermissionsPaginatePermissionsOrderParamEnumSchema.enum;

/** 
 * EmployeePermissionsPaginatePermissionsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeePermissionsModels.EmployeePermissionResponse[] } items  
 */
export const EmployeePermissionsPaginatePermissionsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeePermissionResponseSchema).nullable() }).partial().shape });
export type EmployeePermissionsPaginatePermissionsResponse = z.infer<typeof EmployeePermissionsPaginatePermissionsResponseSchema>;

/** 
 * EmployeePermissionsFindAllResponseSchema 
 * @type { array }
 */
export const EmployeePermissionsFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type EmployeePermissionsFindAllResponse = z.infer<typeof EmployeePermissionsFindAllResponseSchema>;

/** 
 * EmployeePaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePaginateOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "name", "createdAt"]);
export type EmployeePaginateOrderParamEnum = z.infer<typeof EmployeePaginateOrderParamEnumSchema>;
export const EmployeePaginateOrderParamEnum = EmployeePaginateOrderParamEnumSchema.enum;

/** 
 * EmployeePopulateFieldSchema 
 * @type { enum }
 */
export const EmployeePopulateFieldSchema = z.enum(["employments", "primaryOffice", "roles", "employments.roles", "employments.office"]);
export type EmployeePopulateField = z.infer<typeof EmployeePopulateFieldSchema>;
export const EmployeePopulateField = EmployeePopulateFieldSchema.enum;

/** 
 * EmployeePaginatePopulateParamSchema 
 * @type { array }
 */
export const EmployeePaginatePopulateParamSchema = z.array(EmployeePopulateFieldSchema).nullish();
export type EmployeePaginatePopulateParam = z.infer<typeof EmployeePaginatePopulateParamSchema>;

/** 
 * EmployeePaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeModels.EmployeeResponse[] } items  
 */
export const EmployeePaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeResponseSchema).nullable() }).partial().shape });
export type EmployeePaginateResponse = z.infer<typeof EmployeePaginateResponseSchema>;

/** 
 * EmployeeFindAllResponseSchema 
 * @type { array }
 */
export const EmployeeFindAllResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type EmployeeFindAllResponse = z.infer<typeof EmployeeFindAllResponseSchema>;

/** 
 * EmployeePaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const EmployeePaginateLabelsOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "name", "createdAt"]);
export type EmployeePaginateLabelsOrderParamEnum = z.infer<typeof EmployeePaginateLabelsOrderParamEnumSchema>;
export const EmployeePaginateLabelsOrderParamEnum = EmployeePaginateLabelsOrderParamEnumSchema.enum;

/** 
 * EmployeePaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const EmployeePaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type EmployeePaginateLabelsResponse = z.infer<typeof EmployeePaginateLabelsResponseSchema>;

/** 
 * EmployeeGetPopulateParamSchema 
 * @type { array }
 */
export const EmployeeGetPopulateParamSchema = z.array(EmployeePopulateFieldSchema).nullish();
export type EmployeeGetPopulateParam = z.infer<typeof EmployeeGetPopulateParamSchema>;

/** 
 * GetWithOfficePopulateParamSchema 
 * @type { array }
 */
export const GetWithOfficePopulateParamSchema = z.array(EmployeePopulateFieldSchema).nullish();
export type GetWithOfficePopulateParam = z.infer<typeof GetWithOfficePopulateParamSchema>;

/** 
 * EmployeeListRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeModels.EmployeeRoleMemberResponse[] } items  
 */
export const EmployeeListRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmployeeListRolesResponse = z.infer<typeof EmployeeListRolesResponseSchema>;

/** 
 * EmployeeUpdateRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmployeeModels.EmployeeRoleMemberResponse[] } items  
 */
export const EmployeeUpdateRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmployeeRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmployeeUpdateRolesResponse = z.infer<typeof EmployeeUpdateRolesResponseSchema>;

/** 
 * EmploymentListOrderParamEnumSchema 
 * @type { enum }
 */
export const EmploymentListOrderParamEnumSchema = z.enum(["officeId", "createdAt"]);
export type EmploymentListOrderParamEnum = z.infer<typeof EmploymentListOrderParamEnumSchema>;
export const EmploymentListOrderParamEnum = EmploymentListOrderParamEnumSchema.enum;

/** 
 * EmploymentPaginationPopulateFieldsSchema 
 * @type { enum }
 */
export const EmploymentPaginationPopulateFieldsSchema = z.enum(["office", "employee"]);
export type EmploymentPaginationPopulateFields = z.infer<typeof EmploymentPaginationPopulateFieldsSchema>;
export const EmploymentPaginationPopulateFields = EmploymentPaginationPopulateFieldsSchema.enum;

/** 
 * EmploymentListPopulateParamSchema 
 * @type { array }
 */
export const EmploymentListPopulateParamSchema = z.array(EmploymentPaginationPopulateFieldsSchema).nullish();
export type EmploymentListPopulateParam = z.infer<typeof EmploymentListPopulateParamSchema>;

/** 
 * EmploymentListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmploymentResponse[] } items  
 */
export const EmploymentListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.EmploymentResponseSchema).nullable() }).partial().shape });
export type EmploymentListResponse = z.infer<typeof EmploymentListResponseSchema>;

/** 
 * EmploymentListRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmploymentModels.EmploymentRoleMemberResponse[] } items  
 */
export const EmploymentListRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmploymentRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmploymentListRolesResponse = z.infer<typeof EmploymentListRolesResponseSchema>;

/** 
 * EmploymentUpdateRolesResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { EmploymentModels.EmploymentRoleMemberResponse[] } items  
 */
export const EmploymentUpdateRolesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(EmploymentRoleMemberResponseSchema).nullable() }).partial().shape });
export type EmploymentUpdateRolesResponse = z.infer<typeof EmploymentUpdateRolesResponseSchema>;

/** 
 * CustomersListOrderParamEnumSchema 
 * @type { enum }
 */
export const CustomersListOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "createdAt"]);
export type CustomersListOrderParamEnum = z.infer<typeof CustomersListOrderParamEnumSchema>;
export const CustomersListOrderParamEnum = CustomersListOrderParamEnumSchema.enum;

/** 
 * CustomersListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CustomersModels.CustomerListItemDTO[] } items  
 */
export const CustomersListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CustomerListItemDTOSchema).nullable() }).partial().shape });
export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

/** 
 * QuotesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const QuotesPaginateOrderParamEnumSchema = z.enum(["number", "statusDate", "transportMode", "status", "direction", "loadType", "serviceType", "createdAt", "employee", "profit"]);
export type QuotesPaginateOrderParamEnum = z.infer<typeof QuotesPaginateOrderParamEnumSchema>;
export const QuotesPaginateOrderParamEnum = QuotesPaginateOrderParamEnumSchema.enum;

/** 
 * QuotesPaginateResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerQuote  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { QuotesModels.QuotePreviewResponseDTO[] } items  
 */
export const QuotesPaginateResponseSchema = z.object({ ...QuoteListResponseDtoSchema.shape, ...z.object({ items: z.array(QuotePreviewResponseDTOSchema).nullable() }).partial().shape });
export type QuotesPaginateResponse = z.infer<typeof QuotesPaginateResponseSchema>;

/** 
 * PositionAvailablePartnersUseCaseSchema 
 * @type { enum }
 */
export const PositionAvailablePartnersUseCaseSchema = z.enum(["financeCustomer", "financeVendor"]);
export type PositionAvailablePartnersUseCase = z.infer<typeof PositionAvailablePartnersUseCaseSchema>;
export const PositionAvailablePartnersUseCase = PositionAvailablePartnersUseCaseSchema.enum;

/** 
 * QuotesListAvailablePartnersForResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BusinessPartnerLabelResponseDTO[] } items  
 */
export const QuotesListAvailablePartnersForResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).nullable() }).partial().shape });
export type QuotesListAvailablePartnersForResponse = z.infer<typeof QuotesListAvailablePartnersForResponseSchema>;

/** 
 * GetInvolvedPartiesResponseSchema 
 * @type { array }
 */
export const GetInvolvedPartiesResponseSchema = z.array(CommonModels.InvolvedPartyResponseDtoSchema);
export type GetInvolvedPartiesResponse = z.infer<typeof GetInvolvedPartiesResponseSchema>;

/** 
 * QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDto[] } items  
 */
export const QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(QuoteAccountProfitChangeGroupDtoSchema).nullable() }).partial().shape });
export type QuoteProfitChangeTrackingFindProfitChangeGroupsResponse = z.infer<typeof QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema>;

/** 
 * ListCargosByQuoteIdOrderParamSchema 
 * @type { array }
 */
export const ListCargosByQuoteIdOrderParamSchema = z.array(CommonModels.PositionCargoPaginationOrderFieldSchema).nullish();
export type ListCargosByQuoteIdOrderParam = z.infer<typeof ListCargosByQuoteIdOrderParamSchema>;

/** 
 * ListCargosByQuoteIdResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionCargoResponseDTO[] } items  
 */
export const ListCargosByQuoteIdResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.PositionCargoResponseDTOSchema).nullable() }).partial().shape });
export type ListCargosByQuoteIdResponse = z.infer<typeof ListCargosByQuoteIdResponseSchema>;

/** 
 * QuoteCargoListCargoLabelsResponseSchema 
 * @type { array }
 */
export const QuoteCargoListCargoLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type QuoteCargoListCargoLabelsResponse = z.infer<typeof QuoteCargoListCargoLabelsResponseSchema>;

/** 
 * QuoteCargoGetCargoSummaryResponseSchema 
 * @type { array }
 */
export const QuoteCargoGetCargoSummaryResponseSchema = z.array(CommonModels.CargoSummaryResponseDTOSchema);
export type QuoteCargoGetCargoSummaryResponse = z.infer<typeof QuoteCargoGetCargoSummaryResponseSchema>;

/** 
 * QuoteCargoCreateBulkCargosResponseSchema 
 * @type { array }
 */
export const QuoteCargoCreateBulkCargosResponseSchema = z.array(CommonModels.PositionCargoResponseDTOSchema);
export type QuoteCargoCreateBulkCargosResponse = z.infer<typeof QuoteCargoCreateBulkCargosResponseSchema>;

/** 
 * ListDunningsOrderParamEnumSchema 
 * @type { enum }
 */
export const ListDunningsOrderParamEnumSchema = z.enum(["createdAt", "level", "outstandingAmount", "statusChangedOn"]);
export type ListDunningsOrderParamEnum = z.infer<typeof ListDunningsOrderParamEnumSchema>;
export const ListDunningsOrderParamEnum = ListDunningsOrderParamEnumSchema.enum;

/** 
 * ListDunningsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningManagementModels.DunningResponseDto[] } items  
 */
export const ListDunningsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningResponseDtoSchema).nullable() }).partial().shape });
export type ListDunningsResponse = z.infer<typeof ListDunningsResponseSchema>;

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
 * @property { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceSummaryResponseDto[] } items  
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
 * @property { DunningPartnerOutstandingInvoicesModels.PartnerOutstandingInvoiceResponseDto[] } items  
 */
export const ListPartnerOutstandingInvoicesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PartnerOutstandingInvoiceResponseDtoSchema).nullable() }).partial().shape });
export type ListPartnerOutstandingInvoicesResponse = z.infer<typeof ListPartnerOutstandingInvoicesResponseSchema>;

/** 
 * ListRecommendedDunningLevelsResponseSchema 
 * @type { array }
 */
export const ListRecommendedDunningLevelsResponseSchema = z.array(RecommendedLabelResponseDtoSchema);
export type ListRecommendedDunningLevelsResponse = z.infer<typeof ListRecommendedDunningLevelsResponseSchema>;

/** 
 * DunningLevelsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningLevelsPaginateLabelsOrderParamEnumSchema = z.enum(["level", "daysOverdue", "dunningFee", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DunningLevelsPaginateLabelsOrderParamEnum = z.infer<typeof DunningLevelsPaginateLabelsOrderParamEnumSchema>;
export const DunningLevelsPaginateLabelsOrderParamEnum = DunningLevelsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DunningLevelsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const DunningLevelsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type DunningLevelsPaginateLabelsResponse = z.infer<typeof DunningLevelsPaginateLabelsResponseSchema>;

/** 
 * DunningLevelsListOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningLevelsListOrderParamEnumSchema = z.enum(["level", "daysOverdue", "dunningFee", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DunningLevelsListOrderParamEnum = z.infer<typeof DunningLevelsListOrderParamEnumSchema>;
export const DunningLevelsListOrderParamEnum = DunningLevelsListOrderParamEnumSchema.enum;

/** 
 * DunningLevelsListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningLevelsModels.DunningLevelResponseDTO[] } items  
 */
export const DunningLevelsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningLevelResponseDTOSchema).nullable() }).partial().shape });
export type DunningLevelsListResponse = z.infer<typeof DunningLevelsListResponseSchema>;

/** 
 * DunningSystemsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningSystemsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "isDefault"]);
export type DunningSystemsPaginateLabelsOrderParamEnum = z.infer<typeof DunningSystemsPaginateLabelsOrderParamEnumSchema>;
export const DunningSystemsPaginateLabelsOrderParamEnum = DunningSystemsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DunningSystemsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const DunningSystemsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type DunningSystemsPaginateLabelsResponse = z.infer<typeof DunningSystemsPaginateLabelsResponseSchema>;

/** 
 * DunningSystemsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningSystemsPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "isDefault"]);
export type DunningSystemsPaginateOrderParamEnum = z.infer<typeof DunningSystemsPaginateOrderParamEnumSchema>;
export const DunningSystemsPaginateOrderParamEnum = DunningSystemsPaginateOrderParamEnumSchema.enum;

/** 
 * DunningSystemsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningSystemsModels.DunningSystemResponseDTO[] } items  
 */
export const DunningSystemsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningSystemResponseDTOSchema).nullable() }).partial().shape });
export type DunningSystemsPaginateResponse = z.infer<typeof DunningSystemsPaginateResponseSchema>;

/** 
 * GenerateAccountStatementOrderParamEnumSchema 
 * @type { enum }
 */
export const GenerateAccountStatementOrderParamEnumSchema = z.enum(["invoiceNumber", "issuingDate", "invoiceType", "amount", "netAmount", "currencyNotation", "dueDate", "status", "paidOn", "serviceDate", "internalNumber", "positionNumber", "invoiceDirection", "receiver", "receiverCountry", "paidAmount", "totalVat", "dunningBlock", "invoiceInReview", "isInvoiceOk", "isVatOk", "comments", "salesRepName", "isExportedToBookkeeping", "createdAt", "customerReferenceOverride", "externalSystemId"]);
export type GenerateAccountStatementOrderParamEnum = z.infer<typeof GenerateAccountStatementOrderParamEnumSchema>;
export const GenerateAccountStatementOrderParamEnum = GenerateAccountStatementOrderParamEnumSchema.enum;

/** 
 * PositionsFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PositionsFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PositionsFindAllResponse = z.infer<typeof PositionsFindAllResponseSchema>;

/** 
 * PositionsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PositionsPaginateOrderParamEnumSchema = z.enum(["number", "transportMode", "isCancelled", "direction", "loadType", "serviceDate", "createdAt", "departureDate", "arrivalDate", "blfromCostumerDate", "blfromCarrierDate", "customsDate", "vgmCustomerDate", "serviceType", "externalSystemId", "employee", "project", "profit", "margin", "isMasterPosition"]);
export type PositionsPaginateOrderParamEnum = z.infer<typeof PositionsPaginateOrderParamEnumSchema>;
export const PositionsPaginateOrderParamEnum = PositionsPaginateOrderParamEnumSchema.enum;

/** 
 * PositionsPaginateResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionsModels.PositionPreviewResponseDto[] } items  
 */
export const PositionsPaginateResponseSchema = z.object({ ...PositionListResponseDtoSchema.shape, ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).nullable() }).partial().shape });
export type PositionsPaginateResponse = z.infer<typeof PositionsPaginateResponseSchema>;

/** 
 * TotalProfitResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionsModels.PositionPreviewResponseDto[] } items  
 */
export const TotalProfitResponseSchema = z.object({ ...PositionListResponseDtoSchema.shape, ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).nullable() }).partial().shape });
export type TotalProfitResponse = z.infer<typeof TotalProfitResponseSchema>;

/** 
 * PositionsListAvailablePartnersForResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { BusinessPartnerLabelResponseDTO[] } items  
 */
export const PositionsListAvailablePartnersForResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).nullable() }).partial().shape });
export type PositionsListAvailablePartnersForResponse = z.infer<typeof PositionsListAvailablePartnersForResponseSchema>;

/** 
 * ListRouteLabelsResponseSchema 
 * @type { array }
 */
export const ListRouteLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type ListRouteLabelsResponse = z.infer<typeof ListRouteLabelsResponseSchema>;

/** 
 * ListChildResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionsModels.ChildPositionResponseDto[] } items  
 */
export const ListChildResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChildPositionResponseDtoSchema).nullable() }).partial().shape });
export type ListChildResponse = z.infer<typeof ListChildResponseSchema>;

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
 * @property { InvoicesModels.InvoicePreviewDto[] } items  
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
 * @property { InvoicesModels.TotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InvoicesModels.OfficeInvoicePreviewDto[] } items  
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
 * @property { InvoicesModels.UninvoicedChargeTotalAmountDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InvoicesModels.UninvoicedChargeDto[] } items  
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
 * @property { BusinessPartnerLabelResponseDTO[] } items  
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
 * @property { InvoicesModels.UninvoicedChargeTotalAmountDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InvoicesModels.UninvoicedChargeDto[] } items  
 */
export const GetOfficeUnChargesResponseSchema = z.object({ ...UninvoicedChargeListResponseDtoSchema.shape, ...z.object({ items: z.array(UninvoicedChargeDtoSchema).nullable() }).partial().shape });
export type GetOfficeUnChargesResponse = z.infer<typeof GetOfficeUnChargesResponseSchema>;

/** 
 * VatRulesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const VatRulesPaginateLabelsOrderParamEnumSchema = z.enum(["matchcode", "name", "type", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type VatRulesPaginateLabelsOrderParamEnum = z.infer<typeof VatRulesPaginateLabelsOrderParamEnumSchema>;
export const VatRulesPaginateLabelsOrderParamEnum = VatRulesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * VatRulesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const VatRulesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type VatRulesPaginateLabelsResponse = z.infer<typeof VatRulesPaginateLabelsResponseSchema>;

/** 
 * VatRulesListOrderParamEnumSchema 
 * @type { enum }
 */
export const VatRulesListOrderParamEnumSchema = z.enum(["matchcode", "name", "type", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type VatRulesListOrderParamEnum = z.infer<typeof VatRulesListOrderParamEnumSchema>;
export const VatRulesListOrderParamEnum = VatRulesListOrderParamEnumSchema.enum;

/** 
 * VatRulesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { VatRulesModels.VatRuleResponseDTO[] } items  
 */
export const VatRulesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(VatRuleResponseDTOSchema).nullable() }).partial().shape });
export type VatRulesListResponse = z.infer<typeof VatRulesListResponseSchema>;

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
 * @property { InvoicePaymentsModels.OfficePaymentTotalAmountsDto[] } totalAmounts  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InvoicePaymentsModels.OfficePaymentPreviewDto[] } items  
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
 * @property { InvoicePaymentsModels.PaymentResponseDto[] } items  
 */
export const InvoicePaymentsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PaymentResponseDtoSchema).nullable() }).partial().shape });
export type InvoicePaymentsListResponse = z.infer<typeof InvoicePaymentsListResponseSchema>;

/** 
 * PaymentConfirmationsGetOrderParamEnumSchema 
 * @type { enum }
 */
export const PaymentConfirmationsGetOrderParamEnumSchema = z.enum(["paymentDate", "invoiceNumber", "amount"]);
export type PaymentConfirmationsGetOrderParamEnum = z.infer<typeof PaymentConfirmationsGetOrderParamEnumSchema>;
export const PaymentConfirmationsGetOrderParamEnum = PaymentConfirmationsGetOrderParamEnumSchema.enum;

/** 
 * PaymentConfirmationsGetResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PaymentConfirmationsModels.PaymentConfirmationItemDto[] } items  
 */
export const PaymentConfirmationsGetResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PaymentConfirmationItemDtoSchema).nullable() }).partial().shape });
export type PaymentConfirmationsGetResponse = z.infer<typeof PaymentConfirmationsGetResponseSchema>;

/** 
 * ProjectLitePaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ProjectLitePaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ProjectLitePaginateOrderParamEnum = z.infer<typeof ProjectLitePaginateOrderParamEnumSchema>;
export const ProjectLitePaginateOrderParamEnum = ProjectLitePaginateOrderParamEnumSchema.enum;

/** 
 * ProjectLitePaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ProjectLiteModels.ProjectLiteResponseDTO[] } items  
 */
export const ProjectLitePaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ProjectLiteResponseDTOSchema).nullable() }).partial().shape });
export type ProjectLitePaginateResponse = z.infer<typeof ProjectLitePaginateResponseSchema>;

/** 
 * PaginateProjectLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateProjectLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PaginateProjectLabelsOrderParamEnum = z.infer<typeof PaginateProjectLabelsOrderParamEnumSchema>;
export const PaginateProjectLabelsOrderParamEnum = PaginateProjectLabelsOrderParamEnumSchema.enum;

/** 
 * PaginateProjectLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const PaginateProjectLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateProjectLabelsResponse = z.infer<typeof PaginateProjectLabelsResponseSchema>;

/** 
 * ApplyTemplatesResponseSchema 
 * @type { array }
 */
export const ApplyTemplatesResponseSchema = z.array(PositionChecklistItemResponseDtoSchema);
export type ApplyTemplatesResponse = z.infer<typeof ApplyTemplatesResponseSchema>;

/** 
 * PositionChecklistReorderResponseSchema 
 * @type { array }
 */
export const PositionChecklistReorderResponseSchema = z.array(PositionChecklistItemResponseDtoSchema);
export type PositionChecklistReorderResponse = z.infer<typeof PositionChecklistReorderResponseSchema>;

/** 
 * ChecklistTemplatesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistTemplatesPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistTemplatesPaginateOrderParamEnum = z.infer<typeof ChecklistTemplatesPaginateOrderParamEnumSchema>;
export const ChecklistTemplatesPaginateOrderParamEnum = ChecklistTemplatesPaginateOrderParamEnumSchema.enum;

/** 
 * ChecklistTemplatesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChecklistTemplatesModels.ChecklistTemplateResponseDTO[] } items  
 */
export const ChecklistTemplatesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChecklistTemplateResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistTemplatesPaginateResponse = z.infer<typeof ChecklistTemplatesPaginateResponseSchema>;

/** 
 * ChecklistTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof ChecklistTemplatesPaginateLabelsOrderParamEnumSchema>;
export const ChecklistTemplatesPaginateLabelsOrderParamEnum = ChecklistTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * ChecklistTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const ChecklistTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistTemplatesPaginateLabelsResponse = z.infer<typeof ChecklistTemplatesPaginateLabelsResponseSchema>;

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
 * @property { BookkeepingExportModels.BookkeepingExportBatchPreviewDto[] } items  
 */
export const PaginateBatchesResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BookkeepingExportBatchPreviewDtoSchema).nullable() }).partial().shape });
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
 * @property { BookkeepingExportModels.BookkeepingExportItemDetailDto[] } items  
 */
export const PaginateBatchItemsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BookkeepingExportItemDetailDtoSchema).nullable() }).partial().shape });
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
export const GetVatLineItemsResponseSchema = z.array(BookkeepingExportVatLineItemDtoSchema);
export type GetVatLineItemsResponse = z.infer<typeof GetVatLineItemsResponseSchema>;

/** 
 * AWBStocksPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const AWBStocksPaginateOrderParamEnumSchema = z.enum(["createdAt", "updatedAt", "createdBy", "updatedBy", "carrierName", "startNumber", "priority"]);
export type AWBStocksPaginateOrderParamEnum = z.infer<typeof AWBStocksPaginateOrderParamEnumSchema>;
export const AWBStocksPaginateOrderParamEnum = AWBStocksPaginateOrderParamEnumSchema.enum;

/** 
 * AWBStocksPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { AWBStocksModels.AWBStockResponseDTO[] } items  
 */
export const AWBStocksPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(AWBStockResponseDTOSchema).nullable() }).partial().shape });
export type AWBStocksPaginateResponse = z.infer<typeof AWBStocksPaginateResponseSchema>;

/** 
 * MasterDataFindAllTypesParamSchema 
 * @type { array }
 */
export const MasterDataFindAllTypesParamSchema = z.array(MasterDataTypeEnumSchema);
export type MasterDataFindAllTypesParam = z.infer<typeof MasterDataFindAllTypesParamSchema>;

/** 
 * MasterDataPaginateTypesParamSchema 
 * @type { array }
 */
export const MasterDataPaginateTypesParamSchema = z.array(MasterDataTypeEnumSchema);
export type MasterDataPaginateTypesParam = z.infer<typeof MasterDataPaginateTypesParamSchema>;

/** 
 * MasterDataPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { MasterDataModels.MasterDataLabelResponseDTO[] } items  
 */
export const MasterDataPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(MasterDataLabelResponseDTOSchema).nullable() }).partial().shape });
export type MasterDataPaginateResponse = z.infer<typeof MasterDataPaginateResponseSchema>;

/** 
 * ContainerYardsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ContainerYardsPaginateOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ContainerYardsPaginateOrderParamEnum = z.infer<typeof ContainerYardsPaginateOrderParamEnumSchema>;
export const ContainerYardsPaginateOrderParamEnum = ContainerYardsPaginateOrderParamEnumSchema.enum;

/** 
 * ContainerYardsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ContainerYardsModels.ContainerYardResponseDTO[] } items  
 */
export const ContainerYardsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ContainerYardResponseDTOSchema).nullable() }).partial().shape });
export type ContainerYardsPaginateResponse = z.infer<typeof ContainerYardsPaginateResponseSchema>;

/** 
 * ContainerYardsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ContainerYardsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "matchCode", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ContainerYardsPaginateLabelsOrderParamEnum = z.infer<typeof ContainerYardsPaginateLabelsOrderParamEnumSchema>;
export const ContainerYardsPaginateLabelsOrderParamEnum = ContainerYardsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * ContainerYardsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const ContainerYardsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ContainerYardsPaginateLabelsResponse = z.infer<typeof ContainerYardsPaginateLabelsResponseSchema>;

/** 
 * ChecklistItemsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistItemsPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistItemsPaginateOrderParamEnum = z.infer<typeof ChecklistItemsPaginateOrderParamEnumSchema>;
export const ChecklistItemsPaginateOrderParamEnum = ChecklistItemsPaginateOrderParamEnumSchema.enum;

/** 
 * ChecklistItemsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChecklistItemsModels.ChecklistItemResponseDTO[] } items  
 */
export const ChecklistItemsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChecklistItemResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistItemsPaginateResponse = z.infer<typeof ChecklistItemsPaginateResponseSchema>;

/** 
 * ChecklistItemsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const ChecklistItemsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type ChecklistItemsPaginateLabelsOrderParamEnum = z.infer<typeof ChecklistItemsPaginateLabelsOrderParamEnumSchema>;
export const ChecklistItemsPaginateLabelsOrderParamEnum = ChecklistItemsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * ChecklistItemsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const ChecklistItemsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type ChecklistItemsPaginateLabelsResponse = z.infer<typeof ChecklistItemsPaginateLabelsResponseSchema>;

/** 
 * RemarkTemplatesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const RemarkTemplatesPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type RemarkTemplatesPaginateLabelsOrderParamEnum = z.infer<typeof RemarkTemplatesPaginateLabelsOrderParamEnumSchema>;
export const RemarkTemplatesPaginateLabelsOrderParamEnum = RemarkTemplatesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * RemarkTemplatesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { RemarkTemplatesModels.RemarkTemplateLabelResponseDTO[] } items  
 */
export const RemarkTemplatesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(RemarkTemplateLabelResponseDTOSchema).nullable() }).partial().shape });
export type RemarkTemplatesPaginateLabelsResponse = z.infer<typeof RemarkTemplatesPaginateLabelsResponseSchema>;

/** 
 * RemarkTemplatesListOrderParamEnumSchema 
 * @type { enum }
 */
export const RemarkTemplatesListOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type RemarkTemplatesListOrderParamEnum = z.infer<typeof RemarkTemplatesListOrderParamEnumSchema>;
export const RemarkTemplatesListOrderParamEnum = RemarkTemplatesListOrderParamEnumSchema.enum;

/** 
 * RemarkTemplatesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { RemarkTemplatesModels.RemarkTemplateResponseDTO[] } items  
 */
export const RemarkTemplatesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(RemarkTemplateResponseDTOSchema).nullable() }).partial().shape });
export type RemarkTemplatesListResponse = z.infer<typeof RemarkTemplatesListResponseSchema>;

/** 
 * IntegrationChannelsListOrderParamEnumSchema 
 * @type { enum }
 */
export const IntegrationChannelsListOrderParamEnumSchema = z.enum(["createdAt", "name", "businessPartner", "lastPolledAt"]);
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
 * @property { IntegrationChannelsModels.IntegrationChannelResponseDto[] } items  
 */
export const IntegrationChannelsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(IntegrationChannelResponseDtoSchema).nullable() }).partial().shape });
export type IntegrationChannelsListResponse = z.infer<typeof IntegrationChannelsListResponseSchema>;

/** 
 * IntegrationChannelsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const IntegrationChannelsPaginateLabelsOrderParamEnumSchema = z.enum(["createdAt", "name", "businessPartner", "lastPolledAt"]);
export type IntegrationChannelsPaginateLabelsOrderParamEnum = z.infer<typeof IntegrationChannelsPaginateLabelsOrderParamEnumSchema>;
export const IntegrationChannelsPaginateLabelsOrderParamEnum = IntegrationChannelsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * IntegrationChannelsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { LabelResponseDTO[] } items  
 */
export const IntegrationChannelsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type IntegrationChannelsPaginateLabelsResponse = z.infer<typeof IntegrationChannelsPaginateLabelsResponseSchema>;

/** 
 * IntegrationMessagesListOrderParamEnumSchema 
 * @type { enum }
 */
export const IntegrationMessagesListOrderParamEnumSchema = z.enum(["createdAt", "status", "direction", "format", "integrationChannel", "positionNumber"]);
export type IntegrationMessagesListOrderParamEnum = z.infer<typeof IntegrationMessagesListOrderParamEnumSchema>;
export const IntegrationMessagesListOrderParamEnum = IntegrationMessagesListOrderParamEnumSchema.enum;

/** 
 * IntegrationMessagesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { IntegrationMessagesModels.IntegrationMessageResponseDto[] } items  
 */
export const IntegrationMessagesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(IntegrationMessageResponseDtoSchema).nullable() }).partial().shape });
export type IntegrationMessagesListResponse = z.infer<typeof IntegrationMessagesListResponseSchema>;

/** 
 * ControlTowerBookingsFindAllOrderParamEnumSchema 
 * @type { enum }
 */
export const ControlTowerBookingsFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
export type ControlTowerBookingsFindAllOrderParamEnum = z.infer<typeof ControlTowerBookingsFindAllOrderParamEnumSchema>;
export const ControlTowerBookingsFindAllOrderParamEnum = ControlTowerBookingsFindAllOrderParamEnumSchema.enum;

/** 
 * ControlTowerBookingsFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ControlTowerBookingsModels.BookingListItemDto[] } items  
 */
export const ControlTowerBookingsFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BookingListItemDtoSchema).nullable() }).partial().shape });
export type ControlTowerBookingsFindAllResponse = z.infer<typeof ControlTowerBookingsFindAllResponseSchema>;

/** 
 * ControlTowerPackagesFindAllOrderParamEnumSchema 
 * @type { enum }
 */
export const ControlTowerPackagesFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
export type ControlTowerPackagesFindAllOrderParamEnum = z.infer<typeof ControlTowerPackagesFindAllOrderParamEnumSchema>;
export const ControlTowerPackagesFindAllOrderParamEnum = ControlTowerPackagesFindAllOrderParamEnumSchema.enum;

/** 
 * ControlTowerPackagesFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ControlTowerPackagesModels.PackageListItemDto[] } items  
 */
export const ControlTowerPackagesFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PackageListItemDtoSchema).nullable() }).partial().shape });
export type ControlTowerPackagesFindAllResponse = z.infer<typeof ControlTowerPackagesFindAllResponseSchema>;

/** 
 * ControlTowerContainersFindAllOrderParamEnumSchema 
 * @type { enum }
 */
export const ControlTowerContainersFindAllOrderParamEnumSchema = z.enum(["Eta", "createdAt"]);
export type ControlTowerContainersFindAllOrderParamEnum = z.infer<typeof ControlTowerContainersFindAllOrderParamEnumSchema>;
export const ControlTowerContainersFindAllOrderParamEnum = ControlTowerContainersFindAllOrderParamEnumSchema.enum;

/** 
 * ControlTowerContainersFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ControlTowerContainersModels.ContainerListItemDto[] } items  
 */
export const ControlTowerContainersFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ContainerListItemDtoSchema).nullable() }).partial().shape });
export type ControlTowerContainersFindAllResponse = z.infer<typeof ControlTowerContainersFindAllResponseSchema>;

/** 
 * GetUserProfileResponseSchema 
 * @type { object }
 * @property { ControlTowerMeModels.ApiResponseDataDto } data  
 * @property { ControlTowerMeModels.PaginationLinksDto } links  
 * @property { ControlTowerMeModels.UserDetailDto } data.attributes  
 */
export const GetUserProfileResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type GetUserProfileResponse = z.infer<typeof GetUserProfileResponseSchema>;

/** 
 * UpdateUserDataResponseSchema 
 * @type { object }
 * @property { ControlTowerMeModels.ApiResponseDataDto } data  
 * @property { ControlTowerMeModels.PaginationLinksDto } links  
 * @property { ControlTowerMeModels.UserDetailDto } data.attributes  
 */
export const UpdateUserDataResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type UpdateUserDataResponse = z.infer<typeof UpdateUserDataResponseSchema>;

/** 
 * UpdateUserProfileResponseSchema 
 * @type { object }
 * @property { ControlTowerMeModels.ApiResponseDataDto } data  
 * @property { ControlTowerMeModels.PaginationLinksDto } links  
 * @property { ControlTowerMeModels.UserDetailDto } data.attributes  
 */
export const UpdateUserProfileResponseSchema = z.object({ ...ApiResponseDtoSchema.shape, ...z.object({ data: z.object({ attributes: UserDetailDtoSchema.nullable() }).partial().nullable() }).partial().shape });
export type UpdateUserProfileResponse = z.infer<typeof UpdateUserProfileResponseSchema>;

/** 
 * GetCalendarPoNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarPoNumbersParamSchema = z.array(z.string()).nullish();
export type GetCalendarPoNumbersParam = z.infer<typeof GetCalendarPoNumbersParamSchema>;

/** 
 * GetCalendarContainerNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarContainerNumbersParamSchema = z.array(z.string()).nullish();
export type GetCalendarContainerNumbersParam = z.infer<typeof GetCalendarContainerNumbersParamSchema>;

/** 
 * GetCalendarBookingNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarBookingNumbersParamSchema = z.array(z.string()).nullish();
export type GetCalendarBookingNumbersParam = z.infer<typeof GetCalendarBookingNumbersParamSchema>;

/** 
 * InttraShippingInstructionMessagesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { InttraShippingInstructionMessagesModels.ShippingInstructionMessageListItemResponseDto[] } items  
 */
export const InttraShippingInstructionMessagesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ShippingInstructionMessageListItemResponseDtoSchema).nullable() }).partial().shape });
export type InttraShippingInstructionMessagesListResponse = z.infer<typeof InttraShippingInstructionMessagesListResponseSchema>;

}
