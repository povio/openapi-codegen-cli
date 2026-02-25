import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace BusinessPartnersModels {
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
 * @property { RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { RemarkType } type Type of the remark 
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
 * @property { BusinessPartnerAddressDto } address Address information 
 * @property { CommonModels.BusinessPartnerType[] } types List of business partner types 
 * @property { boolean } archived Archive status 
 * @property { string } shortName Short name of the business partner 
 * @property { string } vat VAT number of the business partner 
 * @property { string } debtorId Debtor ID for the local currency 
 * @property { string } creditorId Creditor ID for the local currency 
 * @property { boolean } locked Whether the business partner is locked 
 * @property { string } currency Currency (invoice currency) 
 * @property { BusinessPartnerRemarkResponseDTO[] } remarks Remarks for the business partner 
 * @property { string } createdById ID of the employee who created this business partner 
 * @property { BusinessPartnerEmployeeDTO } createdBy Employee who created this business partner 
 * @property { string } createdAt Date when the business partner was created 
 * @property { string } updatedById ID of the employee who last updated this business partner 
 * @property { BusinessPartnerEmployeeDTO } updatedBy Employee who last updated this business partner 
 * @property { string } updatedAt Date when the business partner was last updated 
 */
export const BusinessPartnerListResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), address: BusinessPartnerAddressDtoSchema, types: z.array(CommonModels.BusinessPartnerTypeSchema), archived: z.boolean(), shortName: z.string().nullish(), vat: z.string().nullish(), debtorId: z.string().nullish(), creditorId: z.string().nullish(), locked: z.boolean(), currency: z.string().nullish(), remarks: z.array(BusinessPartnerRemarkResponseDTOSchema), createdById: z.string().nullish(), createdBy: BusinessPartnerEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: BusinessPartnerEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type BusinessPartnerListResponseDTO = z.infer<typeof BusinessPartnerListResponseDTOSchema>;

/** 
 * BusinessPartnerFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { CommonModels.BusinessPartnerType[] } types  
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
 * @property { CommonModels.BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerPaginatedLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema) });
export type BusinessPartnerPaginatedLabelResponseDTO = z.infer<typeof BusinessPartnerPaginatedLabelResponseDTOSchema>;

/** 
 * BusinessPartnerLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { string[] } ids Business partner ids to filter by 
 * @property { CommonModels.BusinessPartnerType[] } types Array of business partner types to filter by 
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
 * @property { CommonModels.BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { string } matchCode Unique identifier code 
 * @property { string } shortName Short name for the business partner 
 * @property { CreateBusinessPartnerAddressDto } address Address information 
 */
export const CreateBusinessPartnerRequestDTOSchema = z.object({ name: z.string().min(3), secondaryName: z.string().min(3).nullish(), types: z.array(CommonModels.BusinessPartnerTypeSchema), matchCode: z.string().nullish(), shortName: z.string().nullish(), address: CreateBusinessPartnerAddressDtoSchema.nullish() });
export type CreateBusinessPartnerRequestDTO = z.infer<typeof CreateBusinessPartnerRequestDTOSchema>;

/** 
 * BusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 * @property { CommonModels.BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { string } rootFolderId Root folder identifier associated with this business partner 
 */
export const BusinessPartnerResponseDTOSchema = z.object({ id: z.string(), name: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema), rootFolderId: z.string().nullish() });
export type BusinessPartnerResponseDTO = z.infer<typeof BusinessPartnerResponseDTOSchema>;

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
 * @property { BusinessPartnerEmployeeDTO } createdBy Employee who created this record 
 * @property { string } createdAt Creation timestamp 
 * @property { string } updatedById ID of the employee who last updated this record 
 * @property { BusinessPartnerEmployeeDTO } updatedBy Employee who last updated this record 
 * @property { string } updatedAt Last update timestamp 
 * @property { string } matchCode Match code of the business partner 
 * @property { string } shortName Short name 
 * @property { string } name Full name 
 * @property { string } secondaryName Secondary name 
 * @property { CommonModels.BusinessPartnerType[] } types List of business partner types 
 * @property { boolean } archived Archived status 
 * @property { CommonModels.BusinessPartnerAddressResponseDTO } address Main address information 
 * @property { CommonModels.BusinessPartnerAddressResponseDTO } blAddress BL address information 
 * @property { BusinessPartnerLabelResponseDto[] } similar Similar named business partners 
 * @property { boolean } locked  
 * @property { boolean } addressIsDifferentForBl  
 * @property { string } lockedById Unique identifier of the employee who locked the business partner 
 * @property { string } lockedByName  
 * @property { string } lockedAt Unique identifier of the employee who locked the business partner 
 * @property { ContactResponseDTO } belongsTo Parent business partner 
 * @property { ContactResponseDTO } salesRep Sales representative 
 * @property { ContactResponseDTO } operations Operations contact 
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
 * @property { CommonModels.BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { UpdateBusinessPartnerAddressDto } address Address information 
 * @property { UpdateBusinessPartnerAddressDto } blAddress Bl address information 
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
 * @property { RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { RemarkType } type Type of remark 
 */
export const CreateBusinessPartnerRemarkRequestDTOSchema = z.object({ visibility: RemarkVisibilitySchema, content: z.string(), type: RemarkTypeSchema });
export type CreateBusinessPartnerRemarkRequestDTO = z.infer<typeof CreateBusinessPartnerRemarkRequestDTOSchema>;

/** 
 * UpdateBusinessPartnerRemarkRequestDtoSchema 
 * @type { object }
 * @property { RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { RemarkType } type Type of remark 
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
 * BusinessPartnerBasicResponseDTOSchema 
 * @type { object }
 * @property { string } businessPartnerId Reference to the business partner 
 * @property { string[] } relationship List of relationships 
 * @property { AccountTypeEnum } accountType  
 * @property { string } vat VAT number 
 * @property { string } legacySystemId Legacy system (move) id 
 * @property { string } registrationNumber  
 * @property { string } eori EORI number 
 * @property { BusinessPartnerAuthorization } authorization Authorization status 
 * @property { number } creditLimit Credit limit 
 * @property { string } invoiceLanguage Invoice language 
 * @property { string } invoiceCurrency Invoice currency 
 * @property { string } iban IBAN 
 * @property { string } bankNumber Bank number 
 * @property { string } bankAccountNumber Bank account number 
 * @property { BusinessPartnerPaymentTermsResponseDto } termsExport  
 * @property { BusinessPartnerPaymentTermsResponseDto } termsImport  
 * @property { CommonModels.EditorContentResponseDto } notes Notes 
 * @property { string } bankAccountId  
 * @property { BusinessPartnerBankAccountResponseDto } bankAccount  
 * @property { PartnerNetworkInfoDto[] } partnerNetworks Partner networks 
 * @property { string } dunningSystemId  
 * @property { CommonModels.DunningSystemReferenceDTO } dunningSystem  
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
 * @property { AccountTypeEnum } accountType  
 * @property { BusinessPartnerAuthorization } authorization Updated authorization status 
 * @property { number } creditLimit Updated credit limit 
 * @property { string } invoiceLanguage Invoice language 
 * @property { string } invoiceCurrency Invoice currency 
 * @property { string } iban IBAN 
 * @property { string } bankNumber Bank number 
 * @property { string } bankAccountNumber Bank account number 
 * @property { string } legacySystemId Legacy system (move) id 
 * @property { string } registrationNumber  
 * @property { UpdateBusinessPartnerPaymentTermsDto } termsExport  
 * @property { UpdateBusinessPartnerPaymentTermsDto } termsImport  
 * @property { CommonModels.EditorContentUpdateDto } notes Notes 
 * @property { string } bankAccountId  
 * @property { string[] } partnerNetworkIds Partner network IDs 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { string } hblIssuerSigner HBL issuer/signer prefill 
 * @property { string } signatureFileAttachmentId Signature file attachment ID 
 */
export const UpdateBusinessPartnerBasicRequestDTOSchema = z.object({ relationship: z.array(z.string()).nullable(), vat: z.string().nullable(), eori: z.string().nullable(), accountType: AccountTypeEnumSchema.nullable(), authorization: BusinessPartnerAuthorizationSchema.nullable(), creditLimit: z.number().nullable(), invoiceLanguage: z.string().nullable(), invoiceCurrency: z.string().nullable(), iban: z.string().nullable(), bankNumber: z.string().nullable(), bankAccountNumber: z.string().nullable(), legacySystemId: z.string().nullable(), registrationNumber: z.string().nullable(), termsExport: UpdateBusinessPartnerPaymentTermsDtoSchema.nullable(), termsImport: UpdateBusinessPartnerPaymentTermsDtoSchema.nullable(), notes: CommonModels.EditorContentUpdateDtoSchema.nullable(), bankAccountId: z.string().nullable(), partnerNetworkIds: z.array(z.string()).nullable(), dunningSystemId: z.string().nullable(), hblIssuerSigner: z.string().nullable(), signatureFileAttachmentId: z.string().nullable() }).partial();
export type UpdateBusinessPartnerBasicRequestDTO = z.infer<typeof UpdateBusinessPartnerBasicRequestDTOSchema>;

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
 * @property { BusinessPartnerListResponseDTO[] } items  
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
 * @property { BusinessPartnerPaginatedLabelResponseDTO[] } items  
 */
export const BusinessPartnersPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BusinessPartnerPaginatedLabelResponseDTOSchema).nullable() }).partial().shape });
export type BusinessPartnersPaginateLabelsResponse = z.infer<typeof BusinessPartnersPaginateLabelsResponseSchema>;

/** 
 * GetRemarksResponseSchema 
 * @type { array }
 */
export const GetRemarksResponseSchema = z.array(BusinessPartnerRemarkResponseDTOSchema);
export type GetRemarksResponse = z.infer<typeof GetRemarksResponseSchema>;

}
