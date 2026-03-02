import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsExportDeclarationModels {
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
 * @property { ExportDeclarationDocumentBusinessPartnerResponseDTO } customer Customer information 
 * @property { ExportDeclarationDocumentBusinessPartnerResponseDTO } shipper Shipper information 
 * @property { ExportDeclarationDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { string } selectedCargoId ID of the selected cargo 
 * @property { ExportDeclarationDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { ExportDeclarationDocumentRouteResponseDTO } route Route information 
 * @property { string } signingPlace Place where the document is signed 
 * @property { string } signingDate Date when the document is signed 
 * @property { ExportDeclarationDocumentBusinessPartnerResponseDTO } signedBy Information about who signed the document 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { CommonModels.HBLDocumentConfigDto } config Configuration settings for the document 
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
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateExportDeclarationDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), dateOfHandover: z.iso.datetime({ offset: true }).nullable(), issuerName: z.string().nullable(), issuerAddress: z.string().nullable(), customerId: z.string().nullable(), customerAddress: z.string().nullable(), shipperId: z.string().nullable(), shipperAddress: z.string().nullable(), consigneeId: z.string().nullable(), consigneeAddress: z.string().nullable(), selectedCargoId: z.string().nullable(), signingPlace: z.string().nullable(), signingDate: z.iso.datetime({ offset: true }).nullable(), signedByEmployeeId: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateExportDeclarationDocumentRequestDTO = z.infer<typeof UpdateExportDeclarationDocumentRequestDTOSchema>;

}
