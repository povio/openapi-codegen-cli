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
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateFcrDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), fcrNumber: z.string().nullable(), edvNumber: z.string().nullable(), numberOfOriginals: z.number().nullable(), placeOfLoading: z.string().nullable(), dateOfLoading: z.iso.datetime({ offset: true }).nullable(), viaCity: z.string().nullable(), toDestination: z.string().nullable(), transportMode: z.string().nullable(), issuePlace: z.string().nullable(), issueDate: z.iso.datetime({ offset: true }).nullable(), deliveryTerms: z.string().nullable(), shipperId: z.string().nullable(), shipperAddress: z.string().nullable(), consigneeId: z.string().nullable(), consigneeAddress: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateFcrDocumentRequestDTO = z.infer<typeof UpdateFcrDocumentRequestDTOSchema>;

}
