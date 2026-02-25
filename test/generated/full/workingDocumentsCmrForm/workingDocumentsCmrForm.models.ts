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
export const CmrDocumentSettingsDtoDTOSchema = z.object({ primaryLanguage: CmrDocumentLanguageSchema.describe("Primary language"), secondaryLanguage: CmrDocumentLanguageSchema.describe("Secondary language") }).readonly();
export type CmrDocumentSettingsDtoDTO = z.infer<typeof CmrDocumentSettingsDtoDTOSchema>;

/** 
 * CmrDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const CmrDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().describe("ID of the business partner"), name: z.string().describe("Name of the business partner"), address: z.string().describe("Address of the business partner") }).readonly();
export type CmrDocumentBusinessPartnerResponseDTO = z.infer<typeof CmrDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * CmrDocumentCityResponseDTOSchema 
 * @type { object }
 * @property { string } cityId ID of the city 
 * @property { string } cityName Name of the city 
 * @property { string } date Date of delivery/takeover 
 * @property { string } countryName Country name 
 */
export const CmrDocumentCityResponseDTOSchema = z.object({ cityId: z.string().describe("ID of the city"), cityName: z.string().describe("Name of the city"), date: z.iso.datetime({ offset: true }).describe("Date of delivery/takeover").nullish(), countryName: z.string().describe("Country name").nullish() }).readonly();
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
export const CmrDocumentCostsResponseDTOSchema = z.object({ carriageCharges: z.number().describe("Carriage charges"), reductions: z.number().describe("Reductions"), balance: z.number().describe("Balance"), supplements: z.number().describe("Supplements"), miscellaneous: z.number().describe("Miscellaneous charges"), total: z.number().describe("Total amount") }).readonly();
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
export const CmrDocumentCargoResponseDTOSchema = z.object({ caseMarks: z.string().describe("Case marks of the cargo"), quantity: z.number().describe("Quantity of packages"), description: z.string().describe("Description of the cargo"), packageType: z.string(), statisticNumber: z.string(), positionNumber: z.string().describe("Position number of the cargo"), grossWeight: z.number().describe("Gross weight of the cargo"), volume: z.number().describe("Volume of the cargo"), containerNumber: z.string().describe("Container number of the cargo"), seal1: z.string().describe("Seal number 1 of the cargo"), seal2: z.string().describe("Seal number 2 of the cargo") }).readonly();
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
export const CmrDocumentResponseDTOSchema = z.object({ id: z.string().describe("ID of the document"), name: z.string().describe("Name of the document"), positionNumber: z.string().describe("Position number"), nameSuffix: z.string().describe("Name suffix of the document").nullish(), defaultFileName: z.string(), positionId: z.string().describe("Position ID"), versionNumber: z.number().describe("Version number of the document"), cmrNumber: z.string().describe("CMR number").nullish(), consignee: CmrDocumentBusinessPartnerResponseDTOSchema.describe("Consignee information").nullish(), shipper: CmrDocumentBusinessPartnerResponseDTOSchema.describe("Shipper information").nullish(), carrier: CmrDocumentBusinessPartnerResponseDTOSchema.describe("Carrier information").nullish(), successiveCarrier: CmrDocumentBusinessPartnerResponseDTOSchema.describe("Successive carrier information").nullish(), delivery: CmrDocumentCityResponseDTOSchema.describe("Delivery information").nullish(), takeover: CmrDocumentCityResponseDTOSchema.describe("Takeover information").nullish(), annexedDocuments: z.string().describe("Annexed documents").nullish(), carriersObservations: z.string().describe("Carriers observations").nullish(), senderInstructions: z.string().describe("Sender instructions").nullish(), reimbursement: z.string().describe("Reimbursement information").nullish(), specialAgreements: z.string().describe("Special agreements").nullish(), suppressWeight: z.boolean().describe("Whether to suppress weight information"), suppressMeasurement: z.boolean().describe("Whether to suppress measurement information"), freightPaid: z.boolean().describe("Whether freight is paid"), freightToBePaid: z.boolean().describe("Whether freight is to be paid"), creationPlace: z.string().describe("Place of creation"), creationDate: z.string().describe("Date of creation"), costsForShipper: CmrDocumentCostsResponseDTOSchema.describe("Costs for shipper").nullish(), costsForConsignee: CmrDocumentCostsResponseDTOSchema.describe("Costs for consignee").nullish(), selectedCargoIds: z.array(z.string()).readonly().describe("List of selected cargo IDs"), cargo: z.array(CmrDocumentCargoResponseDTOSchema).readonly().describe("List of cargo information").nullish(), config: CommonModels.HBLDocumentConfigDtoSchema.describe("Configuration settings for the document"), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(), settings: CmrDocumentSettingsDtoDTOSchema.describe("Settings for the BL Instructions document").nullish() }).readonly();
export type CmrDocumentResponseDTO = z.infer<typeof CmrDocumentResponseDTOSchema>;

/** 
 * UpdateCmrDocumentSettingsRequestDTOSchema 
 * @type { object }
 * @property { CmrDocumentLanguage } primaryLanguage Primary language 
 * @property { CmrDocumentLanguage } secondaryLanguage Secondary language 
 */
export const UpdateCmrDocumentSettingsRequestDTOSchema = z.object({ primaryLanguage: CmrDocumentLanguageSchema.describe("Primary language"), secondaryLanguage: CmrDocumentLanguageSchema.describe("Secondary language") }).readonly();
export type UpdateCmrDocumentSettingsRequestDTO = z.infer<typeof UpdateCmrDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateCmrDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateCmrDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().describe("Business partner ID"), address: z.string().describe("Business partner address") }).readonly();
export type UpdateCmrDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateCmrDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateCmrDocumentDeliveryRequestDTOSchema 
 * @type { object }
 * @property { string } cityId City ID 
 * @property { string } cityName City name 
 * @property { string } date Date 
 */
export const UpdateCmrDocumentDeliveryRequestDTOSchema = z.object({ cityId: z.string().describe("City ID"), cityName: z.string().describe("City name"), date: z.iso.datetime({ offset: true }).describe("Date") }).readonly();
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
export const UpdateCmrDocumentCostsRequestDTOSchema = z.object({ carriageCharges: z.number().describe("Carriage charges"), reductions: z.number().describe("Reductions"), balance: z.number().describe("Balance"), supplements: z.number().describe("Supplements"), miscellaneous: z.number().describe("Miscellaneous"), total: z.number().describe("Total") }).readonly();
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
export const UpdateCmrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().describe("Name suffix"), cmrNumber: z.string().describe("CMR number"), consignee: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.describe("Consignee information"), shipper: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.describe("Shipper information"), carrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.describe("Carrier information"), successiveCarrier: UpdateCmrDocumentBusinessPartnerRequestDTOSchema.describe("Successive carrier information"), delivery: UpdateCmrDocumentDeliveryRequestDTOSchema.describe("Delivery information"), takeover: UpdateCmrDocumentDeliveryRequestDTOSchema.describe("Takeover information"), annexedDocuments: z.string().describe("Annexed documents"), carriersObservations: z.string().describe("Carriers observations"), senderInstructions: z.string().describe("Sender instructions"), reimbursement: z.string().describe("Reimbursement"), specialAgreements: z.string().describe("Special agreements"), suppressWeight: z.boolean().describe("Whether to suppress weight information"), suppressMeasurement: z.boolean().describe("Whether to suppress measurement information"), freightPaid: z.boolean().describe("Whether freight is paid"), freightToBePaid: z.boolean().describe("Whether freight is to be paid"), creationPlace: z.string().describe("Place of creation"), creationDate: z.string().describe("Date of creation"), costsForShipper: UpdateCmrDocumentCostsRequestDTOSchema.describe("Costs for shipper"), costsForConsignee: UpdateCmrDocumentCostsRequestDTOSchema.describe("Costs for consignee"), selectedCargoIds: z.array(z.string()).readonly().describe("Selected cargo IDs"), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks"), settings: UpdateCmrDocumentSettingsRequestDTOSchema.describe("Settings") }).readonly();
export type UpdateCmrDocumentRequestDTO = z.infer<typeof UpdateCmrDocumentRequestDTOSchema>;

}
