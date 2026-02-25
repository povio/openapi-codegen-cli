import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsFcrFormModels {
/** 
 * FcrDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const FcrDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().describe("ID of the business partner"), name: z.string().describe("Name of the business partner"), address: z.string().describe("Address of the business partner") }).readonly();
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
export const FcrDocumentCargoResponseDTOSchema = z.object({ caseMarks: z.string().describe("Case marks of the cargo"), containerNumber: z.string().describe("Container number"), seal1: z.string().describe("Seal number 1 of the cargo"), seal2: z.string().describe("Seal number 2 of the cargo"), quantity: z.number().describe("Quantity of the cargo"), description: z.string().describe("Description of the cargo"), weight: z.number().describe("Weight of the cargo"), volume: z.number().describe("Volume of the cargo") }).readonly();
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
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } issuePlace Issue place 
 * @property { string } issueDate Issue date 
 * @property { string } deliveryTerms Delivery terms 
 * @property { FcrDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { FcrDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { FcrDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { CommonModels.HBLDocumentConfigDto } config Configuration settings for the document 
 */
export const FcrDocumentResponseDTOSchema = z.object({ id: z.string().describe("ID of the document"), name: z.string().describe("Name of the document"), nameSuffix: z.string().describe("Name suffix of the document").nullish(), defaultFileName: z.string(), positionId: z.string().describe("Position ID"), positionNumber: z.string().describe("Position number"), versionNumber: z.number().describe("Version number of the document"), fcrNumber: z.string().describe("FCR number").nullish(), edvNumber: z.string().describe("EDV number").nullish(), numberOfOriginals: z.number().describe("Number of originals"), placeOfLoading: z.string().describe("Place of loading").nullish(), dateOfLoading: z.iso.datetime({ offset: true }).describe("Date of loading").nullish(), viaCity: z.string().describe("Via city").nullish(), toDestination: z.string().describe("To destination").nullish(), transportMode: CommonModels.TransportModeEnumSchema.describe("Transport mode"), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(), issuePlace: z.string().describe("Issue place").nullish(), issueDate: z.iso.datetime({ offset: true }).describe("Issue date").nullish(), deliveryTerms: z.string().describe("Delivery terms").nullish(), shipper: FcrDocumentBusinessPartnerResponseDTOSchema.describe("Shipper information").nullish(), consignee: FcrDocumentBusinessPartnerResponseDTOSchema.describe("Consignee information").nullish(), cargo: z.array(FcrDocumentCargoResponseDTOSchema).readonly().describe("List of cargo information").nullish(), config: CommonModels.HBLDocumentConfigDtoSchema.describe("Configuration settings for the document") }).readonly();
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
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateFcrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().describe("Name suffix"), fcrNumber: z.string().describe("FCR number"), edvNumber: z.string().describe("EDV number"), numberOfOriginals: z.number().describe("Number of originals"), placeOfLoading: z.string().describe("Place of loading"), dateOfLoading: z.iso.datetime({ offset: true }).describe("Date of loading"), viaCity: z.string().describe("Via city"), toDestination: z.string().describe("To destination"), transportMode: z.string().describe("Transport mode"), issuePlace: z.string().describe("Issue place"), issueDate: z.iso.datetime({ offset: true }).describe("Issue date"), deliveryTerms: z.string().describe("Delivery terms"), shipperId: z.string().describe("Shipper ID"), shipperAddress: z.string().describe("Shipper address"), consigneeId: z.string().describe("Consignee ID"), consigneeAddress: z.string().describe("Consignee address"), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks") }).readonly();
export type UpdateFcrDocumentRequestDTO = z.infer<typeof UpdateFcrDocumentRequestDTOSchema>;

}
