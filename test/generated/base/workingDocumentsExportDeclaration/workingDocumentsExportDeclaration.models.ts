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
  export const ExportDeclarationDocumentBusinessPartnerResponseDTOSchema = z
    .object({
      id: z.string().describe("ID of the business partner"),
      name: z.string().describe("Name of the business partner"),
      address: z.string().describe("Address of the business partner"),
    })
    .readonly();
  export type ExportDeclarationDocumentBusinessPartnerResponseDTO = z.infer<
    typeof ExportDeclarationDocumentBusinessPartnerResponseDTOSchema
  >;

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
  export const ExportDeclarationDocumentCargoResponseDTOSchema = z
    .object({
      quantity: z.number().describe("Quantity of packages"),
      weight: z.number().describe("Weight of the cargo"),
      length: z.number().describe("Length of the cargo"),
      width: z.number().describe("Width of the cargo"),
      height: z.number().describe("Height of the cargo"),
      packageType: z.string().describe("Type of package"),
      positionNumber: z.string().describe("Position number"),
    })
    .readonly();
  export type ExportDeclarationDocumentCargoResponseDTO = z.infer<
    typeof ExportDeclarationDocumentCargoResponseDTOSchema
  >;

  /**
   * ExportDeclarationDocumentRouteResponseDTOSchema
   * @type { object }
   * @property { string } pickupDate Pickup date
   * @property { string } deliveryDate Delivery date
   * @property { string } pickupCity Pickup city
   * @property { string } deliveryCity Delivery city
   */
  export const ExportDeclarationDocumentRouteResponseDTOSchema = z
    .object({
      pickupDate: z.string().describe("Pickup date"),
      deliveryDate: z.string().describe("Delivery date"),
      pickupCity: z.string().describe("Pickup city"),
      deliveryCity: z.string().describe("Delivery city"),
    })
    .readonly();
  export type ExportDeclarationDocumentRouteResponseDTO = z.infer<
    typeof ExportDeclarationDocumentRouteResponseDTOSchema
  >;

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
  export const ExportDeclarationDocumentResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the export declaration document"),
      positionId: z.string().describe("Unique identifier of the position this document belongs to"),
      positionNumber: z.string().describe("Position number for reference").nullish(),
      name: z.string().describe("Name of the export declaration document"),
      nameSuffix: z.string().describe("Suffix to be added to the document name").nullish(),
      defaultFileName: z.string(),
      dateOfHandover: z.iso
        .datetime({ offset: true })
        .describe("Date when the goods are handed over for export")
        .nullish(),
      direction: CommonModels.DirectionEnumSchema.describe("Direction of the shipment (e.g., import/export)").nullish(),
      transportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport for the shipment").nullish(),
      versionNumber: z.number().describe("Version number of the document"),
      issuerName: z.string().describe("Name of the issuer").nullish(),
      issuerAddress: z.string().describe("Address of the issuer").nullish(),
      customer: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.describe("Customer information").nullish(),
      shipper: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.describe("Shipper information").nullish(),
      consignee: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.describe("Consignee information").nullish(),
      selectedCargoId: z.string().describe("ID of the selected cargo").nullish(),
      cargo: z
        .array(ExportDeclarationDocumentCargoResponseDTOSchema)
        .readonly()
        .describe("List of cargo information")
        .nullish(),
      route: ExportDeclarationDocumentRouteResponseDTOSchema.describe("Route information").nullish(),
      signingPlace: z.string().describe("Place where the document is signed").nullish(),
      signingDate: z.iso.datetime({ offset: true }).describe("Date when the document is signed").nullish(),
      signedBy: ExportDeclarationDocumentBusinessPartnerResponseDTOSchema.describe(
        "Information about who signed the document",
      ).nullish(),
      bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(),
      footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(),
      config: CommonModels.HBLDocumentConfigDtoSchema.describe("Configuration settings for the document").nullish(),
    })
    .readonly();
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
  export const UpdateExportDeclarationDocumentRequestDTOSchema = z
    .object({
      nameSuffix: z.string().describe("Name suffix"),
      dateOfHandover: z.iso.datetime({ offset: true }).describe("Date when goods are handed over for export"),
      issuerName: z.string().describe("Name of the issuer"),
      issuerAddress: z.string().describe("Address of the issuer"),
      customerId: z.string().describe("Customer ID"),
      customerAddress: z.string().describe("Customer address"),
      shipperId: z.string().describe("Shipper ID"),
      shipperAddress: z.string().describe("Shipper address"),
      consigneeId: z.string().describe("Consignee ID"),
      consigneeAddress: z.string().describe("Consignee address"),
      selectedCargoId: z.string().describe("Selected cargo ID"),
      signingPlace: z.string().describe("Place where the document is signed"),
      signingDate: z.iso.datetime({ offset: true }).describe("Date when the document is signed"),
      signedByEmployeeId: z.string().describe("ID of the employee who signed the document"),
      bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"),
      footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks"),
    })
    .readonly();
  export type UpdateExportDeclarationDocumentRequestDTO = z.infer<
    typeof UpdateExportDeclarationDocumentRequestDTOSchema
  >;
}
