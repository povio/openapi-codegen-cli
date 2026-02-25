import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsAmsInstructionsModels {
  /**
   * AMSInstructionsDocumentPortResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the port
   * @property { string } name Name of the port
   */
  export const AMSInstructionsDocumentPortResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the port"), name: z.string().describe("Name of the port") })
    .readonly();
  export type AMSInstructionsDocumentPortResponseDTO = z.infer<typeof AMSInstructionsDocumentPortResponseDTOSchema>;

  /**
   * AMSInstructionsDocumentCityResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the city
   * @property { string } name Name of the city
   */
  export const AMSInstructionsDocumentCityResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the city"), name: z.string().describe("Name of the city") })
    .readonly();
  export type AMSInstructionsDocumentCityResponseDTO = z.infer<typeof AMSInstructionsDocumentCityResponseDTOSchema>;

  /**
   * AMSInstructionsDocumentSignedByResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the employee
   * @property { string } name Name of the employee
   */
  export const AMSInstructionsDocumentSignedByResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the employee"), name: z.string().describe("Name of the employee") })
    .readonly();
  export type AMSInstructionsDocumentSignedByResponseDTO = z.infer<
    typeof AMSInstructionsDocumentSignedByResponseDTOSchema
  >;

  /**
   * AMSInstructionsDocumentBusinessPartnerResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the business partner
   * @property { string } name Name of the business partner
   * @property { string } address Address of the business partner
   */
  export const AMSInstructionsDocumentBusinessPartnerResponseDTOSchema = z
    .object({
      id: z.string().describe("ID of the business partner"),
      name: z.string().describe("Name of the business partner"),
      address: z.string().describe("Address of the business partner"),
    })
    .readonly();
  export type AMSInstructionsDocumentBusinessPartnerResponseDTO = z.infer<
    typeof AMSInstructionsDocumentBusinessPartnerResponseDTOSchema
  >;

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
  export const AMSInstructionsDocumentCargoDTOSchema = z
    .object({
      caseMarks: z.string().describe("Case marks of the cargo"),
      containerNumber: z.string().describe("Container number of the cargo"),
      nrOfPackages: z.number().describe("Number of packages in the cargo"),
      description: z.string().describe("Description of the cargo"),
      weight: z.number().describe("Weight of the cargo"),
      volume: z.number().describe("Volume of the cargo"),
      seal1: z.string().describe("Seal number 1 of the cargo"),
      seal2: z.string().describe("Seal number 2 of the cargo"),
    })
    .readonly();
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
  export const AMSInstructionsDocumentResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the AMS Instructions document"),
      positionId: z.string().describe("Unique identifier of the position this document belongs to"),
      positionNumber: z.string().describe("Position number for reference").nullish(),
      name: z.string().describe("Name of the AMS Instructions document"),
      nameSuffix: z.string().describe("Suffix to be added to the document name").nullish(),
      defaultFileName: z.string(),
      date: z.iso.datetime({ offset: true }).describe("Date of the AMS Instructions document").nullish(),
      direction: CommonModels.DirectionEnumSchema.describe("Direction of the shipment (e.g., import/export)").nullish(),
      transportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport for the shipment").nullish(),
      versionNumber: z.number().describe("Version number of the document"),
      additionalAMSText: CommonModels.EditorContentResponseDtoSchema.describe("Additional AMS text").nullish(),
      principalName: z.string().describe("Principal name").nullish(),
      blNumber: z.string().describe("Bill of lading number").nullish(),
      vessel: z.string().describe("Vessel").nullish(),
      portOfLoading: AMSInstructionsDocumentPortResponseDTOSchema.describe("Port of loading").nullish(),
      placeOfDelivery: AMSInstructionsDocumentCityResponseDTOSchema.describe("Port of delivery").nullish(),
      portOfDischarge: AMSInstructionsDocumentPortResponseDTOSchema.describe("Port of discharge").nullish(),
      placeOfIssue: AMSInstructionsDocumentCityResponseDTOSchema.describe("Place of issue").nullish(),
      dateOfIssue: z.iso.datetime({ offset: true }).describe("Date of issue").nullish(),
      signedBy: AMSInstructionsDocumentSignedByResponseDTOSchema.describe("Signed by").nullish(),
      deliveryBusinessPartner:
        AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Delivery business partner").nullish(),
      placeOfAcceptance: AMSInstructionsDocumentCityResponseDTOSchema.describe("Port of acceptance").nullish(),
      consignee: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Consignee").nullish(),
      shipper: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Shipper").nullish(),
      notify: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Notify party").nullish(),
      alsoNotify: AMSInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Also notify party").nullish(),
      applyTo: z.string().describe("Apply to").nullish(),
      suppressWeight: z.boolean().describe("Whether to suppress weight information").nullish(),
      suppressMeasurement: z.boolean().describe("Whether to suppress measurement information").nullish(),
      availableContainerNumbers: z.array(z.string()).readonly().describe("Available container numbers").nullish(),
      selectedContainerNumbers: z.array(z.string()).readonly().describe("Selected container numbers").nullish(),
      selectedContainerLabels: z.array(z.string()).readonly().describe("Selected container labels").nullish(),
      cargo: z.array(AMSInstructionsDocumentCargoDTOSchema).readonly().describe("Cargo information").nullish(),
      bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(),
      footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(),
      config: CommonModels.DocumentConfigDTOSchema.describe("Configuration settings for the document").nullish(),
      createdAt: z.iso.datetime({ offset: true }).describe("Created at").nullish(),
      updatedAt: z.iso.datetime({ offset: true }).describe("Updated at").nullish(),
    })
    .readonly();
  export type AMSInstructionsDocumentResponseDTO = z.infer<typeof AMSInstructionsDocumentResponseDTOSchema>;

  /**
   * UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema
   * @type { object }
   * @property { string } id Business partner ID
   * @property { string } address Business partner address
   */
  export const UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema = z
    .object({
      id: z.string().describe("Business partner ID"),
      address: z.string().describe("Business partner address"),
    })
    .readonly();
  export type UpdateAMSInstructionsDocumentBusinessPartnerRequestDTO = z.infer<
    typeof UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema
  >;

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
  export const UpdateAMSInstructionsDocumentRequestDTOSchema = z
    .object({
      nameSuffix: z.string().describe("Document name suffix"),
      additionalAMSText: CommonModels.EditorContentUpdateDtoSchema.describe("Additional AMS text"),
      principalName: z.string().describe("Principal name"),
      blNumber: z.string().describe("Bill of lading number"),
      vessel: z.string().describe("Vessel"),
      portOfLoadingId: z.string().describe("Port of loading id"),
      placeOfDeliveryId: z.string().describe("Place of delivery id"),
      portOfDischargeId: z.string().describe("Port of discharge id"),
      placeOfIssueId: z.string().describe("Place of issue"),
      dateOfIssue: z.iso.datetime({ offset: true }).describe("Date of issue"),
      signedById: z.string().describe("Signed by employee ID"),
      deliveryBusinessPartner:
        UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Delivery business partner"),
      placeOfAcceptanceId: z.string().describe("Port of acceptance"),
      consignee: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Consignee"),
      shipper: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Shipper"),
      notify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Notify party"),
      alsoNotify: UpdateAMSInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Also notify party"),
      applyTo: z.string().describe("Apply to"),
      suppressWeight: z.boolean().describe("Whether to suppress weight information"),
      suppressMeasurement: z.boolean().describe("Whether to suppress measurement information"),
      selectedContainerNumbers: z.array(z.string()).readonly().describe("Selected container numbers"),
      bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"),
      footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks"),
      date: z.iso.datetime({ offset: true }).describe("Date of the AMS Instructions document"),
    })
    .readonly();
  export type UpdateAMSInstructionsDocumentRequestDTO = z.infer<typeof UpdateAMSInstructionsDocumentRequestDTOSchema>;
}
