import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseBlModels {
  /**
   * HouseBlDocumentSettingsDtoDTOSchema
   * @type { object }
   * @property { CommonModels.QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals
   * @property { number } quantityOfCopies Quantity of copies
   * @property { string } date Date
   * @property { string } location Location
   * @property { string } signer Signer
   * @property { boolean } hideSignature Hide signature
   * @property { boolean } capsLock Render issuer/signer in caps lock
   * @property { string } documentTitle Document title
   */
  export const HouseBlDocumentSettingsDtoDTOSchema = z
    .object({
      quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.describe("Quantity of originals"),
      quantityOfCopies: z.number().describe("Quantity of copies"),
      date: z.iso.datetime({ offset: true }).describe("Date"),
      location: z.string().describe("Location"),
      signer: z.string().describe("Signer"),
      hideSignature: z.boolean().describe("Hide signature"),
      capsLock: z.boolean().describe("Render issuer/signer in caps lock"),
      documentTitle: z.string().describe("Document title"),
    })
    .readonly();
  export type HouseBlDocumentSettingsDtoDTO = z.infer<typeof HouseBlDocumentSettingsDtoDTOSchema>;

  /**
   * HouseBlDocumentBusinessPartnerResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the business partner
   * @property { string } name Name of the business partner
   * @property { string } address Address of the business partner
   */
  export const HouseBlDocumentBusinessPartnerResponseDTOSchema = z
    .object({
      id: z.string().describe("ID of the business partner"),
      name: z.string().describe("Name of the business partner"),
      address: z.string().describe("Address of the business partner"),
    })
    .readonly();
  export type HouseBlDocumentBusinessPartnerResponseDTO = z.infer<
    typeof HouseBlDocumentBusinessPartnerResponseDTOSchema
  >;

  /**
   * HouseBlDocumentCountryResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the country
   * @property { string } name Name of the country
   */
  export const HouseBlDocumentCountryResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the country"), name: z.string().describe("Name of the country") })
    .readonly();
  export type HouseBlDocumentCountryResponseDTO = z.infer<typeof HouseBlDocumentCountryResponseDTOSchema>;

  /**
   * HouseBlDocumentPlaceResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the place
   * @property { string } name Name of the place
   */
  export const HouseBlDocumentPlaceResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the place"), name: z.string().describe("Name of the place") })
    .readonly();
  export type HouseBlDocumentPlaceResponseDTO = z.infer<typeof HouseBlDocumentPlaceResponseDTOSchema>;

  /**
   * HouseBlDocumentPortResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the port
   * @property { string } name Name of the port
   */
  export const HouseBlDocumentPortResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the port"), name: z.string().describe("Name of the port") })
    .readonly();
  export type HouseBlDocumentPortResponseDTO = z.infer<typeof HouseBlDocumentPortResponseDTOSchema>;

  /**
   * HouseBlDocumentTerminalResponseDTOSchema
   * @type { object }
   * @property { string } id ID of the terminal
   * @property { string } name Name of the terminal
   */
  export const HouseBlDocumentTerminalResponseDTOSchema = z
    .object({ id: z.string().describe("ID of the terminal"), name: z.string().describe("Name of the terminal") })
    .readonly();
  export type HouseBlDocumentTerminalResponseDTO = z.infer<typeof HouseBlDocumentTerminalResponseDTOSchema>;

  /**
   * HouseBlDocumentResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier of the house BL document
   * @property { string } positionId Unique identifier of the position this document belongs to
   * @property { string } positionNumber Position number for reference
   * @property { string } name Name of the house BL document
   * @property { string } nameSuffix Suffix to be added to the document name
   * @property { string } defaultFileName
   * @property { string } blNumber Bill of lading number
   * @property { string } carrierBookingNumber Carrier booking number
   * @property { string } exportReference Export reference number
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } forwarder Forwarder information for the shipment
   * @property { HouseBlDocumentCountryResponseDTO } originCountry Origin country
   * @property { boolean } useLatterOfCredit Whether to use letter of credit
   * @property { CommonModels.EditorContentResponseDto } additionalText Additional text for the document
   * @property { CommonModels.EditorContentResponseDto } additionalTextTop Additional text for the document
   * @property { string } direction Direction of the shipment (e.g., import/export)
   * @property { string } transportMode Mode of transport for the shipment
   * @property { number } versionNumber Version number of the document
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } consignee Consignee information for the shipment
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } shipper Shipper information for the shipment
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } cargoReleaseBy Delivery agent information for the shipment
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } notify Notify party information for the shipment
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } alsoNotify Additional notify party information
   * @property { HouseBlDocumentBusinessPartnerResponseDTO } precarriageBy Pre-carriage by information
   * @property { string } precarriageByText Pre-carriage by free-text override
   * @property { HouseBlDocumentPlaceResponseDTO } placeOfReceipt Place of receipt information
   * @property { string } placeOfReceiptText Place of receipt free-text override
   * @property { string } vessel Name of the vessel
   * @property { string } voyage Voyage number of the vessel
   * @property { string } declaredValue Declared value of the shipment
   * @property { number } rateOfExchange Rate of exchange of the shipment
   * @property { string } currency Currency of the shipment
   * @property { string } freightPayable Freight payable of the shipment
   * @property { string } issuer Issuer
   * @property { HouseBlDocumentPortResponseDTO } portOfLoading Port of loading information
   * @property { string } portOfLoadingText Port of loading free-text override
   * @property { HouseBlDocumentTerminalResponseDTO } loadingPierTerminal Loading pier/terminal information
   * @property { string } loadingPierTerminalText Loading pier/terminal free-text override
   * @property { HouseBlDocumentPortResponseDTO } portOfDischarge Port of discharge information
   * @property { string } portOfDischargeText Port of discharge free-text override
   * @property { HouseBlDocumentPlaceResponseDTO } placeOfDelivery Place of delivery information
   * @property { string } placeOfDeliveryText Place of delivery free-text override
   * @property { HouseBlDocumentPlaceResponseDTO } originalsToBeReleasedAt Originals to be released at information
   * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override
   * @property { string } typeOfMove Type of move
   * @property { string } placeOfIssue
   * @property { CommonModels.TemplatedDocumentDataDto } data Templated document data
   * @property { HouseBlDocumentSettingsDtoDTO } settings Settings for the House BL document
   * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks
   * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks
   * @property { CommonModels.HBLDocumentConfigDto } config Configuration settings for the document
   */
  export const HouseBlDocumentResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier of the house BL document"),
      positionId: z.string().describe("Unique identifier of the position this document belongs to"),
      positionNumber: z.string().describe("Position number for reference").nullish(),
      name: z.string().describe("Name of the house BL document"),
      nameSuffix: z.string().describe("Suffix to be added to the document name").nullish(),
      defaultFileName: z.string(),
      blNumber: z.string().describe("Bill of lading number").nullish(),
      carrierBookingNumber: z.string().describe("Carrier booking number").nullish(),
      exportReference: z.string().describe("Export reference number").nullish(),
      forwarder: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe(
        "Forwarder information for the shipment",
      ).nullish(),
      originCountry: HouseBlDocumentCountryResponseDTOSchema.describe("Origin country").nullish(),
      useLatterOfCredit: z.boolean().describe("Whether to use letter of credit").nullish(),
      additionalText: CommonModels.EditorContentResponseDtoSchema.describe(
        "Additional text for the document",
      ).nullish(),
      additionalTextTop: CommonModels.EditorContentResponseDtoSchema.describe(
        "Additional text for the document",
      ).nullish(),
      direction: CommonModels.DirectionEnumSchema.describe("Direction of the shipment (e.g., import/export)").nullish(),
      transportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport for the shipment").nullish(),
      versionNumber: z.number().describe("Version number of the document"),
      consignee: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe("Consignee information for the shipment"),
      shipper: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe("Shipper information for the shipment"),
      cargoReleaseBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe(
        "Delivery agent information for the shipment",
      ).nullish(),
      notify: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe("Notify party information for the shipment"),
      alsoNotify: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe("Additional notify party information"),
      precarriageBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.describe("Pre-carriage by information").nullish(),
      precarriageByText: z.string().describe("Pre-carriage by free-text override").nullish(),
      placeOfReceipt: HouseBlDocumentPlaceResponseDTOSchema.describe("Place of receipt information").nullish(),
      placeOfReceiptText: z.string().describe("Place of receipt free-text override").nullish(),
      vessel: z.string().describe("Name of the vessel").nullish(),
      voyage: z.string().describe("Voyage number of the vessel").nullish(),
      declaredValue: z.string().describe("Declared value of the shipment").nullish(),
      rateOfExchange: z.number().describe("Rate of exchange of the shipment").nullish(),
      currency: z.string().describe("Currency of the shipment").nullish(),
      freightPayable: z.string().describe("Freight payable of the shipment").nullish(),
      issuer: z.string().describe("Issuer").nullish(),
      portOfLoading: HouseBlDocumentPortResponseDTOSchema.describe("Port of loading information").nullish(),
      portOfLoadingText: z.string().describe("Port of loading free-text override").nullish(),
      loadingPierTerminal: HouseBlDocumentTerminalResponseDTOSchema.describe(
        "Loading pier/terminal information",
      ).nullish(),
      loadingPierTerminalText: z.string().describe("Loading pier/terminal free-text override").nullish(),
      portOfDischarge: HouseBlDocumentPortResponseDTOSchema.describe("Port of discharge information").nullish(),
      portOfDischargeText: z.string().describe("Port of discharge free-text override").nullish(),
      placeOfDelivery: HouseBlDocumentPlaceResponseDTOSchema.describe("Place of delivery information").nullish(),
      placeOfDeliveryText: z.string().describe("Place of delivery free-text override").nullish(),
      originalsToBeReleasedAt: HouseBlDocumentPlaceResponseDTOSchema.describe(
        "Originals to be released at information",
      ).nullish(),
      originalsToBeReleasedAtText: z.string().describe("Originals to be released at free-text override").nullish(),
      typeOfMove: z.string().describe("Type of move").nullish(),
      placeOfIssue: z.string().nullish(),
      data: CommonModels.TemplatedDocumentDataDtoSchema.describe("Templated document data").nullish(),
      settings: HouseBlDocumentSettingsDtoDTOSchema.describe("Settings for the House BL document").nullish(),
      bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(),
      footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(),
      config: CommonModels.HBLDocumentConfigDtoSchema.describe("Configuration settings for the document"),
    })
    .readonly();
  export type HouseBlDocumentResponseDTO = z.infer<typeof HouseBlDocumentResponseDTOSchema>;

  /**
   * UpdateHouseBlDocumentSettingsRequestDTOSchema
   * @type { object }
   * @property { CommonModels.QuantityOfOriginalBlDocumentsEnum } quantityOfOriginals Quantity of originals
   * @property { number } quantityOfCopies Quantity of copies
   * @property { string } blNumber BL number
   * @property { string } exportReference Export reference number
   * @property { string } location Location
   * @property { string } signer Signer
   * @property { boolean } hideSignature Hide signature
   * @property { boolean } capsLock Render issuer/signer in caps lock
   * @property { string } date Date
   * @property { string } documentTitle Document title
   */
  export const UpdateHouseBlDocumentSettingsRequestDTOSchema = z
    .object({
      quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.describe("Quantity of originals"),
      quantityOfCopies: z.number().describe("Quantity of copies"),
      blNumber: z.string().describe("BL number"),
      exportReference: z.string().describe("Export reference number"),
      location: z.string().describe("Location"),
      signer: z.string().describe("Signer"),
      hideSignature: z.boolean().describe("Hide signature"),
      capsLock: z.boolean().describe("Render issuer/signer in caps lock"),
      date: z.iso.datetime({ offset: true }).describe("Date"),
      documentTitle: z.string().describe("Document title"),
    })
    .readonly();
  export type UpdateHouseBlDocumentSettingsRequestDTO = z.infer<typeof UpdateHouseBlDocumentSettingsRequestDTOSchema>;

  /**
   * UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema
   * @type { object }
   * @property { string } id Business partner ID
   * @property { string } address Business partner address
   */
  export const UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema = z
    .object({
      id: z.string().describe("Business partner ID"),
      address: z.string().describe("Business partner address"),
    })
    .readonly();
  export type UpdateHouseBlDocumentBusinessPartnerRequestDTO = z.infer<
    typeof UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema
  >;

  /**
   * UpdateHouseBlDocumentRequestDTOSchema
   * @type { object }
   * @property { string } nameSuffix Document name suffix
   * @property { string } blNumber Bill of lading number
   * @property { string } carrierBookingNumber Carrier booking number
   * @property { string } exportReference Export reference number
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } forwarder Forwarder information
   * @property { string } originCountryId Origin country ID
   * @property { boolean } useLatterOfCredit Whether to use letter of credit
   * @property { string } declaredValue Declared value
   * @property { number } rateOfExchange Rate of exchange
   * @property { string } freightPayable Freight payable
   * @property { string } issuer Issuer
   * @property { string } placeOfIssue Place of issue
   * @property { CommonModels.EditorContentUpdateDto } additionalText Additional text
   * @property { CommonModels.EditorContentUpdateDto } additionalTextTop Additional text top
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } consignee Consignee information
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } shipper Shipper information
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } notify Notify party information
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } cargoReleaseBy Cargo release party information
   * @property { UpdateHouseBlDocumentBusinessPartnerRequestDTO } alsoNotify Also notify party information
   * @property { string } precarriageById Pre-carriage by ID
   * @property { string } precarriageByText Pre-carriage by free-text override
   * @property { string } placeOfReceiptId Place of receipt ID
   * @property { string } placeOfReceiptText Place of receipt free-text override
   * @property { string } vessel Vessel name
   * @property { string } voyage Voyage number
   * @property { string } portOfLoadingId Port of loading ID
   * @property { string } portOfLoadingText Port of loading free-text override
   * @property { string } loadingPierTerminalId Loading pier/terminal ID
   * @property { string } loadingPierTerminalText Loading pier/terminal free-text override
   * @property { string } portOfDischargeId Port of discharge ID
   * @property { string } portOfDischargeText Port of discharge free-text override
   * @property { string } placeOfDeliveryId Place of delivery ID
   * @property { string } placeOfDeliveryText Place of delivery free-text override
   * @property { string } originalsToBeReleasedAtId Originals to be released at ID
   * @property { string } originalsToBeReleasedAtText Originals to be released at free-text override
   * @property { string } typeOfMove Type of move
   * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks
   * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks
   * @property { UpdateHouseBlDocumentSettingsRequestDTO } settings Settings
   * @property { CommonModels.TemplatedDocumentDataUpdateDto } data House BL templated document data
   */
  export const UpdateHouseBlDocumentRequestDTOSchema = z
    .object({
      nameSuffix: z.string().describe("Document name suffix"),
      blNumber: z.string().describe("Bill of lading number"),
      carrierBookingNumber: z.string().describe("Carrier booking number"),
      exportReference: z.string().describe("Export reference number"),
      forwarder: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Forwarder information"),
      originCountryId: z.string().describe("Origin country ID"),
      useLatterOfCredit: z.boolean().describe("Whether to use letter of credit"),
      declaredValue: z.string().describe("Declared value"),
      rateOfExchange: z.number().describe("Rate of exchange"),
      freightPayable: z.string().describe("Freight payable"),
      issuer: z.string().describe("Issuer"),
      placeOfIssue: z.string().describe("Place of issue"),
      additionalText: CommonModels.EditorContentUpdateDtoSchema.describe("Additional text"),
      additionalTextTop: CommonModels.EditorContentUpdateDtoSchema.describe("Additional text top"),
      consignee: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Consignee information"),
      shipper: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Shipper information"),
      notify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Notify party information"),
      cargoReleaseBy: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Cargo release party information"),
      alsoNotify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.describe("Also notify party information"),
      precarriageById: z.string().describe("Pre-carriage by ID"),
      precarriageByText: z.string().describe("Pre-carriage by free-text override"),
      placeOfReceiptId: z.string().describe("Place of receipt ID"),
      placeOfReceiptText: z.string().describe("Place of receipt free-text override"),
      vessel: z.string().describe("Vessel name"),
      voyage: z.string().describe("Voyage number"),
      portOfLoadingId: z.string().describe("Port of loading ID"),
      portOfLoadingText: z.string().describe("Port of loading free-text override"),
      loadingPierTerminalId: z.string().describe("Loading pier/terminal ID"),
      loadingPierTerminalText: z.string().describe("Loading pier/terminal free-text override"),
      portOfDischargeId: z.string().describe("Port of discharge ID"),
      portOfDischargeText: z.string().describe("Port of discharge free-text override"),
      placeOfDeliveryId: z.string().describe("Place of delivery ID"),
      placeOfDeliveryText: z.string().describe("Place of delivery free-text override"),
      originalsToBeReleasedAtId: z.string().describe("Originals to be released at ID"),
      originalsToBeReleasedAtText: z.string().describe("Originals to be released at free-text override"),
      typeOfMove: z.string().describe("Type of move"),
      bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"),
      footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks"),
      settings: UpdateHouseBlDocumentSettingsRequestDTOSchema.describe("Settings"),
      data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.describe("House BL templated document data"),
    })
    .readonly();
  export type UpdateHouseBlDocumentRequestDTO = z.infer<typeof UpdateHouseBlDocumentRequestDTOSchema>;
}
