import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsAmsInstructionsModels {
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
 * @property { CommonModels.EditorContentResponseDto } additionalAMSText Additional AMS text 
 * @property { string } principalName Principal name 
 * @property { string } blNumber Bill of lading number 
 * @property { string } vessel Vessel 
 * @property { AMSInstructionsDocumentPortResponseDTO } portOfLoading Port of loading 
 * @property { AMSInstructionsDocumentCityResponseDTO } placeOfDelivery Port of delivery 
 * @property { AMSInstructionsDocumentPortResponseDTO } portOfDischarge Port of discharge 
 * @property { AMSInstructionsDocumentCityResponseDTO } placeOfIssue Place of issue 
 * @property { string } dateOfIssue Date of issue 
 * @property { AMSInstructionsDocumentSignedByResponseDTO } signedBy Signed by 
 * @property { AMSInstructionsDocumentBusinessPartnerResponseDTO } deliveryBusinessPartner Delivery business partner 
 * @property { AMSInstructionsDocumentCityResponseDTO } placeOfAcceptance Port of acceptance 
 * @property { AMSInstructionsDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { AMSInstructionsDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { AMSInstructionsDocumentBusinessPartnerResponseDTO } notify Notify party 
 * @property { AMSInstructionsDocumentBusinessPartnerResponseDTO } alsoNotify Also notify party 
 * @property { string } applyTo Apply to 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { string[] } availableContainerNumbers Available container numbers 
 * @property { string[] } selectedContainerNumbers Selected container numbers 
 * @property { string[] } selectedContainerLabels Selected container labels 
 * @property { AMSInstructionsDocumentCargoDTO[] } cargo Cargo information 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { CommonModels.DocumentConfigDTO } config Configuration settings for the document 
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
 * @property { CommonModels.EditorContentUpdateDto } additionalAMSText Additional AMS text 
 * @property { string } principalName Principal name 
 * @property { string } blNumber Bill of lading number 
 * @property { string } vessel Vessel 
 * @property { string } portOfLoadingId Port of loading id 
 * @property { string } placeOfDeliveryId Place of delivery id 
 * @property { string } portOfDischargeId Port of discharge id 
 * @property { string } placeOfIssueId Place of issue 
 * @property { string } dateOfIssue Date of issue 
 * @property { string } signedById Signed by employee ID 
 * @property { UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } deliveryBusinessPartner Delivery business partner 
 * @property { string } placeOfAcceptanceId Port of acceptance 
 * @property { UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } notify Notify party 
 * @property { UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party 
 * @property { string } applyTo Apply to 
 * @property { boolean } suppressWeight Whether to suppress weight information 
 * @property { boolean } suppressMeasurement Whether to suppress measurement information 
 * @property { string[] } selectedContainerNumbers Selected container numbers 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 * @property { string } date Date of the AMS Instructions document 
 */
export const UpdateAMSInstructionsDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), additionalAMSText: CommonModels.EditorContentUpdateDtoSchema.nullable(), principalName: z.string().nullable(), blNumber: z.string().nullable(), vessel: z.string().nullable(), portOfLoadingId: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), portOfDischargeId: z.string().nullable(), placeOfIssueId: z.string().nullable(), dateOfIssue: z.iso.datetime({ offset: true }).nullable(), signedById: z.string().nullable(), deliveryBusinessPartner: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), placeOfAcceptanceId: z.string().nullable(), consignee: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), notify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), applyTo: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), selectedContainerNumbers: z.array(z.string()).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdateAMSInstructionsDocumentRequestDTO = z.infer<typeof UpdateAMSInstructionsDocumentRequestDTOSchema>;

}
