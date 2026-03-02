import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsCmrFormModels {
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
 * @property { CmrDocumentLanguage } primaryLanguage Primary language 
 * @property { CmrDocumentLanguage } secondaryLanguage Secondary language 
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
 * @property { CmrDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { CmrDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { CmrDocumentBusinessPartnerResponseDTO } carrier Carrier information 
 * @property { CmrDocumentBusinessPartnerResponseDTO } successiveCarrier Successive carrier information 
 * @property { CmrDocumentCityResponseDTO } delivery Delivery information 
 * @property { CmrDocumentCityResponseDTO } takeover Takeover information 
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
 * @property { CmrDocumentCostsResponseDTO } costsForShipper Costs for shipper 
 * @property { CmrDocumentCostsResponseDTO } costsForConsignee Costs for consignee 
 * @property { string[] } selectedCargoIds List of selected cargo IDs 
 * @property { CmrDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { CommonModels.HBLDocumentConfigDto } config Configuration settings for the document 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { CmrDocumentSettingsDtoDTO } settings Settings for the BL Instructions document 
 */
export const CmrDocumentResponseDTOSchema = z.object({ id: z.string(), name: z.string(), positionNumber: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), positionId: z.string(), versionNumber: z.number(), cmrNumber: z.string().nullish(), consignee: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), carrier: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), successiveCarrier: CmrDocumentBusinessPartnerResponseDTOSchema.nullish(), delivery: CmrDocumentCityResponseDTOSchema.nullish(), takeover: CmrDocumentCityResponseDTOSchema.nullish(), annexedDocuments: z.string().nullish(), carriersObservations: z.string().nullish(), senderInstructions: z.string().nullish(), reimbursement: z.string().nullish(), specialAgreements: z.string().nullish(), suppressWeight: z.boolean(), suppressMeasurement: z.boolean(), freightPaid: z.boolean(), freightToBePaid: z.boolean(), creationPlace: z.string(), creationDate: z.string(), costsForShipper: CmrDocumentCostsResponseDTOSchema.nullish(), costsForConsignee: CmrDocumentCostsResponseDTOSchema.nullish(), selectedCargoIds: z.array(z.string()), cargo: z.array(CmrDocumentCargoResponseDTOSchema).nullish(), config: CommonModels.HBLDocumentConfigDtoSchema, bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), settings: CmrDocumentSettingsDtoDTOSchema.nullish() });
export type CmrDocumentResponseDTO = z.infer<typeof CmrDocumentResponseDTOSchema>;

/** 
 * UpdateCmrDocumentSettingsRequestDTOSchema 
 * @type { object }
 * @property { CmrDocumentLanguage } primaryLanguage Primary language 
 * @property { CmrDocumentLanguage } secondaryLanguage Secondary language 
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
 * @property { UpdateCmrDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { UpdateCmrDocumentBusinessPartnerRequestDTO } shipper Shipper information 
 * @property { UpdateCmrDocumentBusinessPartnerRequestDTO } carrier Carrier information 
 * @property { UpdateCmrDocumentBusinessPartnerRequestDTO } successiveCarrier Successive carrier information 
 * @property { UpdateCmrDocumentDeliveryRequestDTO } delivery Delivery information 
 * @property { UpdateCmrDocumentDeliveryRequestDTO } takeover Takeover information 
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
 * @property { UpdateCmrDocumentCostsRequestDTO } costsForShipper Costs for shipper 
 * @property { UpdateCmrDocumentCostsRequestDTO } costsForConsignee Costs for consignee 
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { UpdateCmrDocumentSettingsRequestDTO } settings Settings 
 */
export const UpdateCmrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), cmrNumber: z.string().nullable(), consignee: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), carrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), successiveCarrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.nullable(), delivery: UpdateCmrDocumentDeliveryRequestDTOSchema.nullable(), takeover: UpdateCmrDocumentDeliveryRequestDTOSchema.nullable(), annexedDocuments: z.string().nullable(), carriersObservations: z.string().nullable(), senderInstructions: z.string().nullable(), reimbursement: z.string().nullable(), specialAgreements: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), freightPaid: z.boolean().nullable(), freightToBePaid: z.boolean().nullable(), creationPlace: z.string().nullable(), creationDate: z.string().nullable(), costsForShipper: UpdateCmrDocumentCostsRequestDTOSchema.nullable(), costsForConsignee: UpdateCmrDocumentCostsRequestDTOSchema.nullable(), selectedCargoIds: z.array(z.string()).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), settings: UpdateCmrDocumentSettingsRequestDTOSchema.nullable() }).partial();
export type UpdateCmrDocumentRequestDTO = z.infer<typeof UpdateCmrDocumentRequestDTOSchema>;

}
