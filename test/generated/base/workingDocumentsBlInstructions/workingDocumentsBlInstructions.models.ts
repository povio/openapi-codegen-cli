import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsBlInstructionsModels {
  /**
   * BlInstructionsDocumentSettingsDtoDTOSchema
   * @type { object }
   * @property { CommonModels.QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals
   * @property { string } date Date
   * @property { string } location Location
   * @property { string } signer Siger
   */
  export const BlInstructionsDocumentSettingsDtoDTOSchema = z
    .object({
      quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.describe("Quantity of originals"),
      date: z.iso.datetime({ offset: true }).describe("Date"),
      location: z.string().describe("Location"),
      signer: z.string().describe("Siger"),
    })
    .readonly();
  export type BlInstructionsDocumentSettingsDtoDTO = z.infer<typeof BlInstructionsDocumentSettingsDtoDTOSchema>;

  /**
   * BlInstructionsDocumentCountryResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the country
   * @property { string } name Name of the country
   */
  export const BlInstructionsDocumentCountryResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the country"), name: z.string().describe("Name of the country") })
    .readonly();
  export type BlInstructionsDocumentCountryResponseDTO = z.infer<typeof BlInstructionsDocumentCountryResponseDTOSchema>;

  /**
   * BlInstructionsDocumentBusinessPartnerResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the business partner
   * @property { string } name Name of the business partner
   * @property { string } address Address of the business partner
   * @property { string } eori EORI number of the business partner
   * @property { string } vatNumber VAT number of the business partner
   */
  export const BlInstructionsDocumentBusinessPartnerResponseDTOSchema = z
    .object({
      id: z.string().describe("ID of the business partner"),
      name: z.string().describe("Name of the business partner"),
      address: z.string().describe("Address of the business partner"),
      eori: z.string().describe("EORI number of the business partner"),
      vatNumber: z.string().describe("VAT number of the business partner"),
    })
    .readonly();
  export type BlInstructionsDocumentBusinessPartnerResponseDTO = z.infer<
    typeof BlInstructionsDocumentBusinessPartnerResponseDTOSchema
  >;

  /**
   * BlInstructionsDocumentPlaceResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the place
   * @property { string } name Name of the place
   */
  export const BlInstructionsDocumentPlaceResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the place"), name: z.string().describe("Name of the place") })
    .readonly();
  export type BlInstructionsDocumentPlaceResponseDTO = z.infer<typeof BlInstructionsDocumentPlaceResponseDTOSchema>;

  /**
   * AllChargesEnumSchema
   * @type { enum }
   */
  export const AllChargesEnumSchema = z.enum(["Prepaid", "Collect", "Automatic", "Detailed"]);
  export type AllChargesEnum = z.infer<typeof AllChargesEnumSchema>;
  export const AllChargesEnum = AllChargesEnumSchema.enum;

  /**
   * BlInstructionsDocumentPortResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the port
   * @property { string } name Name of the port
   * @property { string } countryCode Country ISO2 code of the port
   */
  export const BlInstructionsDocumentPortResponseDTOSchema = z
    .object({
      id: z.string().describe("ID of the port"),
      name: z.string().describe("Name of the port"),
      countryCode: z.string().describe("Country ISO2 code of the port"),
    })
    .readonly();
  export type BlInstructionsDocumentPortResponseDTO = z.infer<typeof BlInstructionsDocumentPortResponseDTOSchema>;

  /**
   * RequestedDocumentTypeEnumSchema
   * @type { enum }
   */
  export const RequestedDocumentTypeEnumSchema = z.enum(["SeawayBill", "Original"]);
  export type RequestedDocumentTypeEnum = z.infer<typeof RequestedDocumentTypeEnumSchema>;
  export const RequestedDocumentTypeEnum = RequestedDocumentTypeEnumSchema.enum;

  /**
   * ManifestFilerStatusEnumSchema
   * @type { enum }
   */
  export const ManifestFilerStatusEnumSchema = z.enum(["Self", "Carrier"]);
  export type ManifestFilerStatusEnum = z.infer<typeof ManifestFilerStatusEnumSchema>;
  export const ManifestFilerStatusEnum = ManifestFilerStatusEnumSchema.enum;

  /**
   * BlInstructionsDocumentCountryDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const BlInstructionsDocumentCountryDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type BlInstructionsDocumentCountryDto = z.infer<typeof BlInstructionsDocumentCountryDtoSchema>;

  /**
   * BlInstructionsDocumentResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the BL Instructions document
   * @property { string } positionId Unique identifier of the position this document belongs to
   * @property { string } positionNumber Position number for reference
   * @property { string } name Name of the BL Instructions document
   * @property { string } nameSuffix Suffix to be added to the document name
   * @property { string } defaultFileName
   * @property { string } date Date of the BL Instructions document
   * @property { string } blNumber Bill of lading number
   * @property { string } exportReference Export reference number
   * @property { string } direction Direction of the shipment (e.g., import/export)
   * @property { string } transportMode Mode of transport for the shipment
   * @property { BlInstructionsDocumentCountryResponseDTO } originCountry Origin country
   * @property { boolean } useLatterOfCredit Whether to use letter of credit
   * @property { string } additionalText Additional text for the document
   * @property { number } versionNumber Version number of the document
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } buyer Buyer information for the shipment
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } seller Seller information for the shipment
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } consignee Consignee information for the shipment
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } shipper Shipper information for the shipment
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } notify Notify party information for the shipment
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } alsoNotify Additional notify party information
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } forwarder Forwarder party information
   * @property { BlInstructionsDocumentBusinessPartnerResponseDTO } precarriageBy Pre-carriage by information
   * @property { BlInstructionsDocumentPlaceResponseDTO } placeOfReceipt Place of receipt information
   * @property { BlInstructionsDocumentPlaceResponseDTO } stowedIntoContainerCity Stowed into container city information
   * @property { BlInstructionsDocumentPlaceResponseDTO } placeOfAcceptanceCity Place of acceptance city information
   * @property { BlInstructionsDocumentPlaceResponseDTO } originalsToBeReleasedAt
   * @property { string } originalsToBeReleasedAtText
   * @property { BlInstructionsDocumentPlaceResponseDTO } loadingPierTerminal
   * @property { string } loadingPierTerminalText
   * @property { string } precarriageByText
   * @property { string } placeOfReceiptText
   * @property { string } portOfLoadingText
   * @property { string } portOfDischargeText
   * @property { string } placeOfDeliveryText
   * @property { string } vessel Name of the vessel
   * @property { string } voyage Name of the vessel
   * @property { CommonModels.MovementTypeEnum } movementType
   * @property { string } carrierBookingNumber
   * @property { string } csnNumber
   * @property { string } mcinNumber
   * @property { string } pcinNumber
   * @property { string } dueNumber
   * @property { boolean } goodsDeliveredInEu
   * @property { string } rucNumber
   * @property { number } shipmentDeclaredValue
   * @property { string } shipmentDeclaredValueCurrency
   * @property { AllChargesEnum } allCharges Base freight payment term
   * @property { CommonModels.ChargePaymentEnum } baseFreight Base freight payment term
   * @property { CommonModels.ChargePaymentEnum } additionalCharges Additional charges payment term
   * @property { CommonModels.ChargePaymentEnum } originHaulageCharges Origin haulage charges payment term
   * @property { CommonModels.ChargePaymentEnum } originPortCharges Origin port charges payment term
   * @property { CommonModels.ChargePaymentEnum } destinationPortCharges Destination port charges payment term
   * @property { CommonModels.ChargePaymentEnum } destinationHaulageCharges Destination haulage charges payment term
   * @property { string } shippingInstructionsComments Free-text shipping instructions comments
   * @property { string } chargePayerId Charge payer business partner ID
   * @property { string } chargePayLocationId Charge pay location ID
   * @property { BlInstructionsDocumentPortResponseDTO } portOfLoading Port of loading information
   * @property { BlInstructionsDocumentPortResponseDTO } portOfDischarge Port of discharge information
   * @property { BlInstructionsDocumentPlaceResponseDTO } placeOfDelivery Place of delivery information
   * @property { BlInstructionsDocumentSettingsDtoDTO } settings Settings for the BL Instructions document
   * @property { CommonModels.TemplatedDocumentDataDto } data Templated document data
   * @property { CommonModels.CargoTableBlockDto } cargo Cargo table block (identical to House BL cargo)
   * @property { string } bodyRemarks Body remarks
   * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks
   * @property { CommonModels.DocumentConfigDTO } config Configuration settings for the document
   * @property { RequestedDocumentTypeEnum } requestedDocumentType
   * @property { boolean } requestedDocumentFreighted
   * @property { number } requestedDocumentQuantity
   * @property { ManifestFilerStatusEnum } manifestFilerStatus
   * @property { string } manifestFilerIdentifier
   * @property { BlInstructionsDocumentCountryDto } manifestFilingCountry
   */
  export const BlInstructionsDocumentResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the BL Instructions document"),
      positionId: z.string().describe("Unique identifier of the position this document belongs to"),
      positionNumber: z.string().describe("Position number for reference").nullish(),
      name: z.string().describe("Name of the BL Instructions document"),
      nameSuffix: z.string().describe("Suffix to be added to the document name").nullish(),
      defaultFileName: z.string(),
      date: z.iso.datetime({ offset: true }).describe("Date of the BL Instructions document").nullish(),
      blNumber: z.string().describe("Bill of lading number").nullish(),
      exportReference: z.string().describe("Export reference number").nullish(),
      direction: CommonModels.DirectionEnumSchema.describe("Direction of the shipment (e.g., import/export)").nullish(),
      transportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport for the shipment").nullish(),
      originCountry: BlInstructionsDocumentCountryResponseDTOSchema.describe("Origin country").nullish(),
      useLatterOfCredit: z.boolean().describe("Whether to use letter of credit").nullish(),
      additionalText: z.string().describe("Additional text for the document").nullish(),
      versionNumber: z.number().describe("Version number of the document"),
      buyer: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe(
        "Buyer information for the shipment",
      ).nullish(),
      seller: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe(
        "Seller information for the shipment",
      ).nullish(),
      consignee: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe(
        "Consignee information for the shipment",
      ),
      shipper: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Shipper information for the shipment"),
      notify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe(
        "Notify party information for the shipment",
      ),
      alsoNotify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe(
        "Additional notify party information",
      ),
      forwarder: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Forwarder party information"),
      precarriageBy:
        BlInstructionsDocumentBusinessPartnerResponseDTOSchema.describe("Pre-carriage by information").nullish(),
      placeOfReceipt: BlInstructionsDocumentPlaceResponseDTOSchema.describe("Place of receipt information").nullish(),
      stowedIntoContainerCity: BlInstructionsDocumentPlaceResponseDTOSchema.describe(
        "Stowed into container city information",
      ).nullish(),
      placeOfAcceptanceCity: BlInstructionsDocumentPlaceResponseDTOSchema.describe(
        "Place of acceptance city information",
      ).nullish(),
      originalsToBeReleasedAt: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(),
      originalsToBeReleasedAtText: z.string().nullish(),
      loadingPierTerminal: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(),
      loadingPierTerminalText: z.string().nullish(),
      precarriageByText: z.string().nullish(),
      placeOfReceiptText: z.string().nullish(),
      portOfLoadingText: z.string().nullish(),
      portOfDischargeText: z.string().nullish(),
      placeOfDeliveryText: z.string().nullish(),
      vessel: z.string().describe("Name of the vessel").nullish(),
      voyage: z.string().describe("Name of the vessel").nullish(),
      movementType: CommonModels.MovementTypeEnumSchema.nullish(),
      carrierBookingNumber: z.string().nullish(),
      csnNumber: z.string().nullish(),
      mcinNumber: z.string().nullish(),
      pcinNumber: z.string().nullish(),
      dueNumber: z.string().nullish(),
      goodsDeliveredInEu: z.boolean().nullish(),
      rucNumber: z.string().nullish(),
      shipmentDeclaredValue: z.number().nullish(),
      shipmentDeclaredValueCurrency: z.string().nullish(),
      allCharges: AllChargesEnumSchema.describe("Base freight payment term").nullish(),
      baseFreight: CommonModels.ChargePaymentEnumSchema.describe("Base freight payment term").nullish(),
      additionalCharges: CommonModels.ChargePaymentEnumSchema.describe("Additional charges payment term").nullish(),
      originHaulageCharges: CommonModels.ChargePaymentEnumSchema.describe(
        "Origin haulage charges payment term",
      ).nullish(),
      originPortCharges: CommonModels.ChargePaymentEnumSchema.describe("Origin port charges payment term").nullish(),
      destinationPortCharges: CommonModels.ChargePaymentEnumSchema.describe(
        "Destination port charges payment term",
      ).nullish(),
      destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.describe(
        "Destination haulage charges payment term",
      ).nullish(),
      shippingInstructionsComments: z.string().describe("Free-text shipping instructions comments").nullish(),
      chargePayerId: z.string().describe("Charge payer business partner ID").nullish(),
      chargePayLocationId: z.string().describe("Charge pay location ID").nullish(),
      portOfLoading: BlInstructionsDocumentPortResponseDTOSchema.describe("Port of loading information").nullish(),
      portOfDischarge: BlInstructionsDocumentPortResponseDTOSchema.describe("Port of discharge information").nullish(),
      placeOfDelivery: BlInstructionsDocumentPlaceResponseDTOSchema.describe("Place of delivery information").nullish(),
      settings: BlInstructionsDocumentSettingsDtoDTOSchema.describe(
        "Settings for the BL Instructions document",
      ).nullish(),
      data: CommonModels.TemplatedDocumentDataDtoSchema.describe("Templated document data").nullish(),
      cargo: CommonModels.CargoTableBlockDtoSchema.describe(
        "Cargo table block (identical to House BL cargo)",
      ).nullish(),
      bodyRemarks: z.string().describe("Body remarks").nullish(),
      footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(),
      config: CommonModels.DocumentConfigDTOSchema.describe("Configuration settings for the document"),
      requestedDocumentType: RequestedDocumentTypeEnumSchema.nullish(),
      requestedDocumentFreighted: z.boolean().nullish(),
      requestedDocumentQuantity: z.number().nullish(),
      manifestFilerStatus: ManifestFilerStatusEnumSchema.nullish(),
      manifestFilerIdentifier: z.string().nullish(),
      manifestFilingCountry: BlInstructionsDocumentCountryDtoSchema.nullish(),
    })
    .readonly();
  export type BlInstructionsDocumentResponseDTO = z.infer<typeof BlInstructionsDocumentResponseDTOSchema>;

  /**
   * UpdateBlInstructionsDocumentSettingsRequestDTOSchema
   * @type { object }
   * @property { CommonModels.QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals
   * @property { string } blNumber BL number
   * @property { string } exportReference Export reference number
   * @property { string } location Location
   * @property { string } signer Signer
   * @property { string } date Date
   */
  export const UpdateBlInstructionsDocumentSettingsRequestDTOSchema = z
    .object({
      quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.describe("Quantity of originals"),
      blNumber: z.string().describe("BL number"),
      exportReference: z.string().describe("Export reference number"),
      location: z.string().describe("Location"),
      signer: z.string().describe("Signer"),
      date: z.iso.datetime({ offset: true }).describe("Date"),
    })
    .readonly();
  export type UpdateBlInstructionsDocumentSettingsRequestDTO = z.infer<
    typeof UpdateBlInstructionsDocumentSettingsRequestDTOSchema
  >;

  /**
   * UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema
   * @type { object }
   * @property { string } id Business partner ID
   * @property { string } address Business partner address
   */
  export const UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema = z
    .object({
      id: z.string().describe("Business partner ID"),
      address: z.string().describe("Business partner address"),
    })
    .readonly();
  export type UpdateBlInstructionsDocumentBusinessPartnerRequestDTO = z.infer<
    typeof UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema
  >;

  /**
   * UpdateBlInstructionsDocumentRequestDTOSchema
   * @type { object }
   * @property { string } nameSuffix Document name suffix
   * @property { string } blNumber Bill of lading number
   * @property { string } exportReference Export reference number
   * @property { string } csnNumber
   * @property { string } mcinNumber
   * @property { string } pcinNumber
   * @property { string } dueNumber
   * @property { boolean } goodsDeliveredInEu
   * @property { string } rucNumber
   * @property { string } shipmentDeclaredValueCurrency
   * @property { number } shipmentDeclaredValue
   * @property { AllChargesEnum } allCharges All charges payment term
   * @property { CommonModels.ChargePaymentEnum } baseFreight Base freight payment term
   * @property { CommonModels.ChargePaymentEnum } additionalCharges Additional charges payment term
   * @property { CommonModels.ChargePaymentEnum } originHaulageCharges Origin haulage charges payment term
   * @property { CommonModels.ChargePaymentEnum } originPortCharges Origin port charges payment term
   * @property { CommonModels.ChargePaymentEnum } destinationPortCharges Destination port charges payment term
   * @property { CommonModels.ChargePaymentEnum } destinationHaulageCharges Destination haulage charges payment term
   * @property { string } originCountryId Origin country ID
   * @property { boolean } useLatterOfCredit Whether to use letter of credit
   * @property { string } additionalText Additional text
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } consignee Consignee information
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } shipper Shipper information
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } buyer Buyer information
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } seller Seller information
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } forwarder Forwarder information
   * @property { string } originalsToBeReleasedAtId Originals to be released at ID
   * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } notify Notify party information
   * @property { UpdateBlInstructionsDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party information
   * @property { string } shippingInstructionsComments Shipping instructions free-text comments
   * @property { string } chargePayerId Charge payer business partner ID
   * @property { string } chargePayLocationId Charge pay location ID
   * @property { string } precarriageById Pre-carriage by ID
   * @property { string } placeOfReceiptId Place of receipt ID
   * @property { string } stowedIntoContainerCityId Stowed into container city ID
   * @property { string } loadingPierTerminalId Loading pier/terminal ID
   * @property { string } loadingPierTerminalText
   * @property { string } placeOfAcceptanceCityId Place of acceptance city ID
   * @property { string } vessel Vessel name
   * @property { string } voyage Vessel name
   * @property { string } carrierBookingNumber Carrier booking number
   * @property { string } portOfLoadingId Port of loading ID
   * @property { string } portOfDischargeId Port of discharge ID
   * @property { string } placeOfDeliveryId Place of delivery ID
   * @property { boolean } suppressWeight Whether to suppress weight information
   * @property { boolean } suppressMeasurement Whether to suppress measurement information
   * @property { string } bodyRemarks Body remarks
   * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks
   * @property { string } date Date of the BL Instructions document
   * @property { UpdateBlInstructionsDocumentSettingsRequestDTO } settings Settings
   * @property { CommonModels.TemplatedDocumentDataUpdateDto } data House BL templated document data
   * @property { RequestedDocumentTypeEnum } requestedDocumentType
   * @property { boolean } requestedDocumentFreighted
   * @property { number } requestedDocumentQuantity
   * @property { string } precarriageByText
   * @property { string } placeOfReceiptText
   * @property { string } portOfLoadingText
   * @property { string } portOfDischargeText
   * @property { string } placeOfDeliveryText
   * @property { ManifestFilerStatusEnum } manifestFilerStatus
   * @property { string } manifestFilingCountryId
   * @property { string } manifestFilerIdentifier
   */
  export const UpdateBlInstructionsDocumentRequestDTOSchema = z
    .object({
      nameSuffix: z.string().describe("Document name suffix"),
      blNumber: z.string().describe("Bill of lading number"),
      exportReference: z.string().describe("Export reference number"),
      csnNumber: z.string(),
      mcinNumber: z.string(),
      pcinNumber: z.string(),
      dueNumber: z.string(),
      goodsDeliveredInEu: z.boolean(),
      rucNumber: z.string(),
      shipmentDeclaredValueCurrency: z.string(),
      shipmentDeclaredValue: z.number(),
      allCharges: AllChargesEnumSchema.describe("All charges payment term"),
      baseFreight: CommonModels.ChargePaymentEnumSchema.describe("Base freight payment term"),
      additionalCharges: CommonModels.ChargePaymentEnumSchema.describe("Additional charges payment term"),
      originHaulageCharges: CommonModels.ChargePaymentEnumSchema.describe("Origin haulage charges payment term"),
      originPortCharges: CommonModels.ChargePaymentEnumSchema.describe("Origin port charges payment term"),
      destinationPortCharges: CommonModels.ChargePaymentEnumSchema.describe("Destination port charges payment term"),
      destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.describe(
        "Destination haulage charges payment term",
      ),
      originCountryId: z.string().describe("Origin country ID"),
      useLatterOfCredit: z.boolean().describe("Whether to use letter of credit"),
      additionalText: z.string().describe("Additional text"),
      consignee: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Consignee information"),
      shipper: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Shipper information"),
      buyer: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Buyer information"),
      seller: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Seller information"),
      forwarder: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Forwarder information"),
      originalsToBeReleasedAtId: z.string().describe("Originals to be released at ID"),
      originalsToBeReleasedAtText: z.string().describe("Originals to be released at free-text override"),
      notify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Notify party information"),
      alsoNotify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.describe("Also notify party information"),
      shippingInstructionsComments: z.string().describe("Shipping instructions free-text comments"),
      chargePayerId: z.string().describe("Charge payer business partner ID"),
      chargePayLocationId: z.string().describe("Charge pay location ID"),
      precarriageById: z.string().describe("Pre-carriage by ID"),
      placeOfReceiptId: z.string().describe("Place of receipt ID"),
      stowedIntoContainerCityId: z.string().describe("Stowed into container city ID"),
      loadingPierTerminalId: z.string().describe("Loading pier/terminal ID"),
      loadingPierTerminalText: z.string(),
      placeOfAcceptanceCityId: z.string().describe("Place of acceptance city ID"),
      vessel: z.string().describe("Vessel name"),
      voyage: z.string().describe("Vessel name"),
      carrierBookingNumber: z.string().describe("Carrier booking number"),
      portOfLoadingId: z.string().describe("Port of loading ID"),
      portOfDischargeId: z.string().describe("Port of discharge ID"),
      placeOfDeliveryId: z.string().describe("Place of delivery ID"),
      suppressWeight: z.boolean().describe("Whether to suppress weight information"),
      suppressMeasurement: z.boolean().describe("Whether to suppress measurement information"),
      bodyRemarks: z.string().describe("Body remarks"),
      footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks"),
      date: z.iso.datetime({ offset: true }).describe("Date of the BL Instructions document"),
      settings: UpdateBlInstructionsDocumentSettingsRequestDTOSchema.describe("Settings"),
      data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.describe("House BL templated document data"),
      requestedDocumentType: RequestedDocumentTypeEnumSchema,
      requestedDocumentFreighted: z.boolean(),
      requestedDocumentQuantity: z.number(),
      precarriageByText: z.string(),
      placeOfReceiptText: z.string(),
      portOfLoadingText: z.string(),
      portOfDischargeText: z.string(),
      placeOfDeliveryText: z.string(),
      manifestFilerStatus: ManifestFilerStatusEnumSchema,
      manifestFilingCountryId: z.string(),
      manifestFilerIdentifier: z.string(),
    })
    .readonly();
  export type UpdateBlInstructionsDocumentRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentRequestDTOSchema>;
}
