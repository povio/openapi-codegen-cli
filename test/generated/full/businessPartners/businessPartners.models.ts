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
export const BusinessPartnerRemarkResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the remark"), visibility: RemarkVisibilitySchema.describe("Visibility level of the remark"), content: z.string().describe("Content of the remark"), type: RemarkTypeSchema.describe("Type of the remark") }).readonly();
export type BusinessPartnerRemarkResponseDTO = z.infer<typeof BusinessPartnerRemarkResponseDTOSchema>;

/** 
 * BusinessPartnerAddressDtoSchema 
 * @type { object }
 * @property { string } street Street address 
 * @property { string } zip ZIP/Postal code 
 * @property { string } city City name 
 * @property { string } isoCode Country code 
 */
export const BusinessPartnerAddressDtoSchema = z.object({ street: z.string().describe("Street address"), zip: z.string().describe("ZIP/Postal code"), city: z.string().describe("City name"), isoCode: z.string().describe("Country code") }).readonly();
export type BusinessPartnerAddressDto = z.infer<typeof BusinessPartnerAddressDtoSchema>;

/** 
 * BusinessPartnerEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
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
export const BusinessPartnerListResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the business partner"), name: z.string().describe("Name of the business partner"), matchCode: z.string().describe("Match code of the business partner"), address: BusinessPartnerAddressDtoSchema.describe("Address information"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("List of business partner types"), archived: z.boolean().describe("Archive status"), shortName: z.string().describe("Short name of the business partner").nullish(), vat: z.string().describe("VAT number of the business partner").nullish(), debtorId: z.string().describe("Debtor ID for the local currency").nullish(), creditorId: z.string().describe("Creditor ID for the local currency").nullish(), locked: z.boolean().describe("Whether the business partner is locked"), currency: z.string().describe("Currency (invoice currency)").nullish(), remarks: z.array(BusinessPartnerRemarkResponseDTOSchema).readonly().describe("Remarks for the business partner"), createdById: z.string().describe("ID of the employee who created this business partner").nullish(), createdBy: BusinessPartnerEmployeeDTOSchema.describe("Employee who created this business partner").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Date when the business partner was created"), updatedById: z.string().describe("ID of the employee who last updated this business partner").nullish(), updatedBy: BusinessPartnerEmployeeDTOSchema.describe("Employee who last updated this business partner").nullish(), updatedAt: z.iso.datetime({ offset: true }).describe("Date when the business partner was last updated") }).readonly();
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
export const BusinessPartnerFilterDtoSchema = z.object({ search: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly(), shortName: z.string(), name: z.string(), vat: z.string(), debtorId: z.string(), creditorId: z.string(), matchCode: z.string(), archived: z.boolean().describe("Filter by archived status") }).readonly();
export type BusinessPartnerFilterDto = z.infer<typeof BusinessPartnerFilterDtoSchema>;

/** 
 * BusinessPartnerPaginatedLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } label Label of the business partner 
 * @property { CommonModels.BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerPaginatedLabelResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the business partner"), label: z.string().describe("Label of the business partner"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Array of business partner types") }).readonly();
export type BusinessPartnerPaginatedLabelResponseDTO = z.infer<typeof BusinessPartnerPaginatedLabelResponseDTOSchema>;

/** 
 * BusinessPartnerLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { string[] } ids Business partner ids to filter by 
 * @property { CommonModels.BusinessPartnerType[] } types Array of business partner types to filter by 
 * @property { boolean } archived Filter by archived status 
 */
export const BusinessPartnerLabelsFilterDtoSchema = z.object({ search: z.string(), ids: z.array(z.string()).readonly().describe("Business partner ids to filter by"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Array of business partner types to filter by"), archived: z.boolean().describe("Filter by archived status") }).readonly();
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
export const CreateBusinessPartnerAddressDtoSchema = z.object({ street: z.string(), secondaryStreet: z.string(), zip: z.string(), cityId: z.string(), district: z.string(), countryId: z.string() }).readonly();
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
export const CreateBusinessPartnerRequestDTOSchema = z.object({ name: z.string().min(3).describe("Full name of the business partner"), secondaryName: z.string().min(3).describe("Full name of the business partner").nullish(), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Types/roles of the business partner"), matchCode: z.string().describe("Unique identifier code").nullish(), shortName: z.string().describe("Short name for the business partner").nullish(), address: CreateBusinessPartnerAddressDtoSchema.describe("Address information").nullish() }).readonly();
export type CreateBusinessPartnerRequestDTO = z.infer<typeof CreateBusinessPartnerRequestDTOSchema>;

/** 
 * BusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 * @property { CommonModels.BusinessPartnerType[] } types Types/roles of the business partner 
 * @property { string } rootFolderId Root folder identifier associated with this business partner 
 */
export const BusinessPartnerResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the business partner"), name: z.string().describe("Name of the business partner"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Types/roles of the business partner"), rootFolderId: z.string().describe("Root folder identifier associated with this business partner").nullish() }).readonly();
export type BusinessPartnerResponseDTO = z.infer<typeof BusinessPartnerResponseDTOSchema>;

/** 
 * BusinessPartnerLabelResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the business partner 
 * @property { string } name Name of the business partner 
 */
export const BusinessPartnerLabelResponseDtoSchema = z.object({ id: z.string().describe("Unique identifier of the business partner"), name: z.string().describe("Name of the business partner") }).readonly();
export type BusinessPartnerLabelResponseDto = z.infer<typeof BusinessPartnerLabelResponseDtoSchema>;

/** 
 * ContactResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the contact 
 * @property { string } name Name of the contact 
 */
export const ContactResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the contact"), name: z.string().describe("Name of the contact") }).readonly();
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
export const BusinessPartnerDetailResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the business partner"), createdById: z.string().describe("ID of the employee who created this record").nullish(), createdBy: BusinessPartnerEmployeeDTOSchema.describe("Employee who created this record").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Creation timestamp"), updatedById: z.string().describe("ID of the employee who last updated this record").nullish(), updatedBy: BusinessPartnerEmployeeDTOSchema.describe("Employee who last updated this record").nullish(), updatedAt: z.iso.datetime({ offset: true }).describe("Last update timestamp"), matchCode: z.string().describe("Match code of the business partner"), shortName: z.string().describe("Short name"), name: z.string().describe("Full name"), secondaryName: z.string().describe("Secondary name"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("List of business partner types"), archived: z.boolean().describe("Archived status"), address: CommonModels.BusinessPartnerAddressResponseDTOSchema.describe("Main address information"), blAddress: CommonModels.BusinessPartnerAddressResponseDTOSchema.describe("BL address information"), similar: z.array(BusinessPartnerLabelResponseDtoSchema).readonly().describe("Similar named business partners").nullish(), locked: z.boolean(), addressIsDifferentForBl: z.boolean(), lockedById: z.string().describe("Unique identifier of the employee who locked the business partner").nullish(), lockedByName: z.string().nullish(), lockedAt: z.iso.datetime({ offset: true }).describe("Unique identifier of the employee who locked the business partner").nullish(), belongsTo: ContactResponseDTOSchema.describe("Parent business partner"), salesRep: ContactResponseDTOSchema.describe("Sales representative"), operations: ContactResponseDTOSchema.describe("Operations contact") }).readonly();
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
export const UpdateBusinessPartnerAddressDtoSchema = z.object({ street: z.string(), secondaryStreet: z.string(), zip: z.string(), cityId: z.string().nullable(), district: z.string(), countryId: z.string() }).readonly();
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
export const UpdateBusinessPartnerRequestDTOSchema = z.object({ matchCode: z.string().describe("Updated match code"), shortName: z.string().describe("Updated short name"), name: z.string().describe("Updated full name"), secondaryName: z.string().describe("Updated secondary name"), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Types/roles of the business partner"), address: UpdateBusinessPartnerAddressDtoSchema.describe("Address information"), blAddress: UpdateBusinessPartnerAddressDtoSchema.describe("Bl address information"), belongsToId: z.string().describe("Parent business partner"), salesRepId: z.string().describe("Sales representative"), operationsId: z.string().describe("Operations contact"), addressIsDifferentForBl: z.boolean().describe("Different address for BL") }).readonly();
export type UpdateBusinessPartnerRequestDTO = z.infer<typeof UpdateBusinessPartnerRequestDTOSchema>;

/** 
 * CreateBusinessPartnerRemarkRequestDTOSchema 
 * @type { object }
 * @property { RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { RemarkType } type Type of remark 
 */
export const CreateBusinessPartnerRemarkRequestDTOSchema = z.object({ visibility: RemarkVisibilitySchema.describe("Visibility level of the remark"), content: z.string().describe("Content of the remark"), type: RemarkTypeSchema.describe("Type of remark") }).readonly();
export type CreateBusinessPartnerRemarkRequestDTO = z.infer<typeof CreateBusinessPartnerRemarkRequestDTOSchema>;

/** 
 * UpdateBusinessPartnerRemarkRequestDtoSchema 
 * @type { object }
 * @property { RemarkVisibility } visibility Visibility level of the remark 
 * @property { string } content Content of the remark 
 * @property { RemarkType } type Type of remark 
 */
export const UpdateBusinessPartnerRemarkRequestDtoSchema = z.object({ visibility: RemarkVisibilitySchema.describe("Visibility level of the remark"), content: z.string().describe("Content of the remark"), type: RemarkTypeSchema.describe("Type of remark") }).readonly();
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
export const BusinessPartnerPaymentTermsResponseDtoSchema = z.object({ relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema, days: z.number().gte(0) }).readonly();
export type BusinessPartnerPaymentTermsResponseDto = z.infer<typeof BusinessPartnerPaymentTermsResponseDtoSchema>;

/** 
 * BusinessPartnerBankAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerBankAccountResponseDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type BusinessPartnerBankAccountResponseDto = z.infer<typeof BusinessPartnerBankAccountResponseDtoSchema>;

/** 
 * PartnerNetworkInfoDtoSchema 
 * @type { object }
 * @property { string } id Partner network ID 
 * @property { string } name Partner network name 
 */
export const PartnerNetworkInfoDtoSchema = z.object({ id: z.string().describe("Partner network ID"), name: z.string().describe("Partner network name") }).readonly();
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
export const BusinessPartnerBasicResponseDTOSchema = z.object({ businessPartnerId: z.string().describe("Reference to the business partner"), relationship: z.array(z.string()).readonly().describe("List of relationships"), accountType: AccountTypeEnumSchema.nullish(), vat: z.string().describe("VAT number"), legacySystemId: z.string().describe("Legacy system (move) id").nullish(), registrationNumber: z.string().nullish(), eori: z.string().describe("EORI number"), authorization: BusinessPartnerAuthorizationSchema.describe("Authorization status").nullable(), creditLimit: z.number().describe("Credit limit"), invoiceLanguage: z.string().describe("Invoice language"), invoiceCurrency: z.string().describe("Invoice currency"), iban: z.string().describe("IBAN"), bankNumber: z.string().describe("Bank number"), bankAccountNumber: z.string().describe("Bank account number"), termsExport: BusinessPartnerPaymentTermsResponseDtoSchema, termsImport: BusinessPartnerPaymentTermsResponseDtoSchema, notes: CommonModels.EditorContentResponseDtoSchema.describe("Notes").nullish(), bankAccountId: z.string().nullish(), bankAccount: BusinessPartnerBankAccountResponseDtoSchema.nullish(), partnerNetworks: z.array(PartnerNetworkInfoDtoSchema).readonly().describe("Partner networks"), dunningSystemId: z.string().nullish(), dunningSystem: CommonModels.DunningSystemReferenceDTOSchema.nullish(), hblIssuerSigner: z.string().describe("HBL issuer/signer prefill"), signatureFileAttachmentId: z.string().describe("Signature file attachment ID"), signatureFileAttachmentUrl: z.string().describe("Signed URL for signature file attachment").nullish() }).readonly();
export type BusinessPartnerBasicResponseDTO = z.infer<typeof BusinessPartnerBasicResponseDTOSchema>;

/** 
 * UpdateBusinessPartnerPaymentTermsDtoSchema 
 * @type { object }
 * @property { string } relativeTo  
 * @property { number } days Minimum: `0` 
 */
export const UpdateBusinessPartnerPaymentTermsDtoSchema = z.object({ relativeTo: CommonModels.OfficePaymentTermsDateTypeSchema, days: z.number().gte(0) }).readonly();
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
export const UpdateBusinessPartnerBasicRequestDTOSchema = z.object({ relationship: z.array(z.string()).readonly().describe("Updated relationships"), vat: z.string().describe("Updated VAT number"), eori: z.string().describe("Updated EORI number"), accountType: AccountTypeEnumSchema, authorization: BusinessPartnerAuthorizationSchema.describe("Updated authorization status"), creditLimit: z.number().describe("Updated credit limit"), invoiceLanguage: z.string().describe("Invoice language"), invoiceCurrency: z.string().describe("Invoice currency"), iban: z.string().describe("IBAN"), bankNumber: z.string().describe("Bank number"), bankAccountNumber: z.string().describe("Bank account number"), legacySystemId: z.string().describe("Legacy system (move) id"), registrationNumber: z.string(), termsExport: UpdateBusinessPartnerPaymentTermsDtoSchema, termsImport: UpdateBusinessPartnerPaymentTermsDtoSchema, notes: CommonModels.EditorContentUpdateDtoSchema.describe("Notes"), bankAccountId: z.string().nullable(), partnerNetworkIds: z.array(z.string()).readonly().describe("Partner network IDs"), dunningSystemId: z.string().describe("Dunning system ID").nullable(), hblIssuerSigner: z.string().describe("HBL issuer/signer prefill").nullable(), signatureFileAttachmentId: z.string().describe("Signature file attachment ID").nullable() }).readonly();
export type UpdateBusinessPartnerBasicRequestDTO = z.infer<typeof UpdateBusinessPartnerBasicRequestDTOSchema>;

/** 
 * BusinessPartnerSignatureUploadRequestDTOSchema 
 * @type { object }
 * @property { string } fileName File name 
 * @property { string } mimeType Mime type 
 * @property { number } fileSize File size in bytes. Minimum: `1` 
 */
export const BusinessPartnerSignatureUploadRequestDTOSchema = z.object({ fileName: z.string().describe("File name"), mimeType: z.string().describe("Mime type"), fileSize: z.number().gte(1).describe("File size in bytes") }).readonly();
export type BusinessPartnerSignatureUploadRequestDTO = z.infer<typeof BusinessPartnerSignatureUploadRequestDTOSchema>;

/** 
 * BusinessPartnerSignatureUploadResponseDTOSchema 
 * @type { object }
 * @property { string } mediaId Media ID for the uploaded signature 
 * @property { string } method HTTP method to use for upload 
 * @property { string } url URL to upload the file to 
 */
export const BusinessPartnerSignatureUploadResponseDTOSchema = z.object({ mediaId: z.string().describe("Media ID for the uploaded signature"), method: z.string().describe("HTTP method to use for upload"), url: z.string().describe("URL to upload the file to") }).readonly();
export type BusinessPartnerSignatureUploadResponseDTO = z.infer<typeof BusinessPartnerSignatureUploadResponseDTOSchema>;

/** 
 * CargoAgentResponseDTOSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner identifier 
 * @property { string } portOfHamburgAccountNumber Port of Hamburg account number 
 * @property { string } iataAccountNumber IATA account number 
 * @property { string } regulatedAgentCode Regulated agent code 
 */
export const CargoAgentResponseDTOSchema = z.object({ businessPartnerId: z.string().describe("Business partner identifier"), portOfHamburgAccountNumber: z.string().describe("Port of Hamburg account number"), iataAccountNumber: z.string().describe("IATA account number"), regulatedAgentCode: z.string().describe("Regulated agent code") }).readonly();
export type CargoAgentResponseDTO = z.infer<typeof CargoAgentResponseDTOSchema>;

/** 
 * UpdateCargoAgentDTOSchema 
 * @type { object }
 * @property { string } portOfHamburgAccountNumber Hamburg port account number 
 * @property { string } iataAccountNumber IATA account number 
 * @property { string } regulatedAgentCode Regulated agent code 
 */
export const UpdateCargoAgentDTOSchema = z.object({ portOfHamburgAccountNumber: z.string().describe("Hamburg port account number"), iataAccountNumber: z.string().describe("IATA account number"), regulatedAgentCode: z.string().describe("Regulated agent code") }).readonly();
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
export const CarrierResponseDTOSchema = z.object({ businessPartnerId: z.string().describe("Business partner identifier"), scac: z.string().describe("SCAC code"), iataAirlinePrefix: z.string().describe("IATA airline prefix"), iataCode: z.string().describe("IATA code"), registrationAddress: z.string().describe("Registration address"), masterBlSuffix: z.string().describe("Master BL suffix"), houseBlSuffix: z.string().describe("House BL suffix"), airWaybillSuffix: z.string().describe("Air waybill suffix"), cargoManifestSuffix: z.string().describe("Cargo manifest suffix"), fundReportSuffix: z.string().describe("Fund report suffix"), invoiceSuffix: z.string().describe("Invoice suffix") }).readonly();
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
export const UpdateCarrierDTOSchema = z.object({ scac: z.string().describe("SCAC code"), iataAirlinePrefix: z.string().describe("IATA airline prefix"), iataCode: z.string().describe("IATA code"), registrationAddress: z.string().describe("Registration address"), masterBlSuffix: z.string().describe("Master BL suffix"), houseBlSuffix: z.string().describe("House BL suffix"), airWaybillSuffix: z.string().describe("Air waybill suffix"), cargoManifestSuffix: z.string().describe("Cargo manifest suffix"), fundReportSuffix: z.string().describe("Fund report suffix"), invoiceSuffix: z.string().describe("Invoice suffix") }).readonly();
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
export const BusinessPartnersPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BusinessPartnerListResponseDTOSchema).readonly() }).readonly().shape });
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
export const BusinessPartnersPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(BusinessPartnerPaginatedLabelResponseDTOSchema).readonly() }).readonly().shape });
export type BusinessPartnersPaginateLabelsResponse = z.infer<typeof BusinessPartnersPaginateLabelsResponseSchema>;

/** 
 * GetRemarksResponseSchema 
 * @type { array }
 */
export const GetRemarksResponseSchema = z.array(BusinessPartnerRemarkResponseDTOSchema).readonly();
export type GetRemarksResponse = z.infer<typeof GetRemarksResponseSchema>;

}
