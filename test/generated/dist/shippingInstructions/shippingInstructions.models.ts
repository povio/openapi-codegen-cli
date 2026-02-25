import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ShippingInstructionsModels {
  /**
   * EnsDeclarationEnumSchema
   * @type { enum }
   * @description ENS declaration
   */
  export const EnsDeclarationEnumSchema = z.enum(["Carrier", "Self"]);
  export type EnsDeclarationEnum = z.infer<typeof EnsDeclarationEnumSchema>;
  export const EnsDeclarationEnum = EnsDeclarationEnumSchema.enum;

  /**
   * IssuedHouseBillsEnumSchema
   * @type { enum }
   * @description Issued house bills
   */
  export const IssuedHouseBillsEnumSchema = z.enum(["None", "One", "Multiple"]);
  export type IssuedHouseBillsEnum = z.infer<typeof IssuedHouseBillsEnumSchema>;
  export const IssuedHouseBillsEnum = IssuedHouseBillsEnumSchema.enum;

  /**
   * WoodDeclarationEnumSchema
   * @type { enum }
   * @description Wood declaration
   */
  export const WoodDeclarationEnumSchema = z.enum([
    "NoWood",
    "TreatedAndCertified",
    "NotTreatedAndNotCertified",
    "Processed",
  ]);
  export type WoodDeclarationEnum = z.infer<typeof WoodDeclarationEnumSchema>;
  export const WoodDeclarationEnum = WoodDeclarationEnumSchema.enum;

  /**
   * ShippingInstructionsPartnerResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } addressLine1
   * @property { string } addressLine2
   * @property { string } city
   * @property { string } postalCode
   * @property { string } state
   * @property { string } countryCode
   * @property { string } contactName
   * @property { string } contactPhone
   * @property { string } contactEmail
   */
  export const ShippingInstructionsPartnerResponseDtoSchema = z
    .object({
      id: z.string(),
      name: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string(),
      city: z.string(),
      postalCode: z.string(),
      state: z.string(),
      countryCode: z.string(),
      contactName: z.string(),
      contactPhone: z.string(),
      contactEmail: z.string(),
    })
    .readonly();
  export type ShippingInstructionsPartnerResponseDto = z.infer<typeof ShippingInstructionsPartnerResponseDtoSchema>;

  /**
   * ShippingInstructionsGeneralDetailsDtoSchema
   * @type { object }
   * @property { ShippingInstructionsPartnerResponseDto } shipper
   * @property { ShippingInstructionsPartnerResponseDto } consignee
   * @property { ShippingInstructionsPartnerResponseDto } freightForwarder
   * @property { ShippingInstructionsPartnerResponseDto } notifyParty
   * @property { ShippingInstructionsPartnerResponseDto } additionalNotifyParty1
   * @property { ShippingInstructionsPartnerResponseDto } additionalNotifyParty2
   * @property { ShippingInstructionsPartnerResponseDto } contractParty
   * @property { ShippingInstructionsPartnerResponseDto } manufacturer
   * @property { ShippingInstructionsPartnerResponseDto } consolidator
   * @property { ShippingInstructionsPartnerResponseDto } importer
   * @property { ShippingInstructionsPartnerResponseDto } warehouseKeeper
   */
  export const ShippingInstructionsGeneralDetailsDtoSchema = z
    .object({
      shipper: ShippingInstructionsPartnerResponseDtoSchema,
      consignee: ShippingInstructionsPartnerResponseDtoSchema,
      freightForwarder: ShippingInstructionsPartnerResponseDtoSchema,
      notifyParty: ShippingInstructionsPartnerResponseDtoSchema,
      additionalNotifyParty1: ShippingInstructionsPartnerResponseDtoSchema,
      additionalNotifyParty2: ShippingInstructionsPartnerResponseDtoSchema,
      contractParty: ShippingInstructionsPartnerResponseDtoSchema,
      manufacturer: ShippingInstructionsPartnerResponseDtoSchema,
      consolidator: ShippingInstructionsPartnerResponseDtoSchema,
      importer: ShippingInstructionsPartnerResponseDtoSchema,
      warehouseKeeper: ShippingInstructionsPartnerResponseDtoSchema,
    })
    .readonly();
  export type ShippingInstructionsGeneralDetailsDto = z.infer<typeof ShippingInstructionsGeneralDetailsDtoSchema>;

  /**
   * ShippingInstructionsLocationResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   * @property { string } code
   * @property { string } countryCode
   * @property { string } eta
   * @property { string } vessel
   * @property { string } voyage
   */
  export const ShippingInstructionsLocationResponseDtoSchema = z
    .object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      countryCode: z.string(),
      eta: z.iso.datetime({ offset: true }),
      vessel: z.string(),
      voyage: z.string(),
    })
    .readonly();
  export type ShippingInstructionsLocationResponseDto = z.infer<typeof ShippingInstructionsLocationResponseDtoSchema>;

  /**
   * SIMoveTypeEnumSchema
   * @type { enum }
   */
  export const SIMoveTypeEnumSchema = z.enum(["DoorToDoor", "DoorToPort", "PortToDoor", "PortToPort"]);
  export type SIMoveTypeEnum = z.infer<typeof SIMoveTypeEnumSchema>;
  export const SIMoveTypeEnum = SIMoveTypeEnumSchema.enum;

  /**
   * ShippingInstructionsTransportDtoSchema
   * @type { object }
   * @property { string } vessel
   * @property { string } voyage
   * @property { string } imo
   * @property { ShippingInstructionsLocationResponseDto } placeOfReceipt
   * @property { ShippingInstructionsLocationResponseDto } portOfLoading
   * @property { ShippingInstructionsLocationResponseDto } portOfDischarge
   * @property { ShippingInstructionsLocationResponseDto } placeOfDelivery
   * @property { SIMoveTypeEnum } moveType
   * @property { string } shipmentType
   */
  export const ShippingInstructionsTransportDtoSchema = z
    .object({
      vessel: z.string(),
      voyage: z.string(),
      imo: z.string(),
      placeOfReceipt: ShippingInstructionsLocationResponseDtoSchema,
      portOfLoading: ShippingInstructionsLocationResponseDtoSchema,
      portOfDischarge: ShippingInstructionsLocationResponseDtoSchema,
      placeOfDelivery: ShippingInstructionsLocationResponseDtoSchema,
      moveType: SIMoveTypeEnumSchema,
      shipmentType: z.string(),
    })
    .readonly();
  export type ShippingInstructionsTransportDto = z.infer<typeof ShippingInstructionsTransportDtoSchema>;

  /**
   * ShippingInstructionsHazardousDtoSchema
   * @type { object }
   * @property { string } IMOClass
   * @property { string } UNDGNumber
   * @property { string } contact
   */
  export const ShippingInstructionsHazardousDtoSchema = z
    .object({ IMOClass: z.string(), UNDGNumber: z.string(), contact: z.string() })
    .readonly();
  export type ShippingInstructionsHazardousDto = z.infer<typeof ShippingInstructionsHazardousDtoSchema>;

  /**
   * ShippingInstructionsPackageResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { number } quantity
   * @property { string } packageType
   * @property { string } packageTypeDescription
   * @property { string } packageDescription
   * @property { string } hsCode
   * @property { number } volume
   * @property { number } grossWeight
   * @property { string } caseMarks
   * @property { ShippingInstructionsHazardousDto } hazardous
   * @property { string } ncmCodes
   * @property { string } cusCode
   */
  export const ShippingInstructionsPackageResponseDtoSchema = z
    .object({
      id: z.string(),
      quantity: z.number(),
      packageType: z.string(),
      packageTypeDescription: z.string(),
      packageDescription: z.string(),
      hsCode: z.string(),
      volume: z.number(),
      grossWeight: z.number(),
      caseMarks: z.string(),
      hazardous: ShippingInstructionsHazardousDtoSchema,
      ncmCodes: z.string(),
      cusCode: z.string(),
    })
    .readonly();
  export type ShippingInstructionsPackageResponseDto = z.infer<typeof ShippingInstructionsPackageResponseDtoSchema>;

  /**
   * ShippingInstructionsCargoResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } transportUnitNumber
   * @property { string } transportUnitType
   * @property { string } transportUnitDescription
   * @property { string } containerSupplier
   * @property { number } grossWeight
   * @property { number } tare
   * @property { number } volume
   * @property { string } seal1
   * @property { string } seal2
   * @property { string } woodDeclaration
   * @property { ShippingInstructionsPackageResponseDto[] } packages
   */
  export const ShippingInstructionsCargoResponseDtoSchema = z
    .object({
      id: z.string().nullish(),
      transportUnitNumber: z.string().nullish(),
      transportUnitType: z.string().nullish(),
      transportUnitDescription: z.string().nullish(),
      containerSupplier: z.string().nullish(),
      grossWeight: z.number().nullish(),
      tare: z.number().nullish(),
      volume: z.number().nullish(),
      seal1: z.string().nullish(),
      seal2: z.string().nullish(),
      woodDeclaration: WoodDeclarationEnumSchema.nullish(),
      packages: z.array(ShippingInstructionsPackageResponseDtoSchema).readonly(),
    })
    .readonly();
  export type ShippingInstructionsCargoResponseDto = z.infer<typeof ShippingInstructionsCargoResponseDtoSchema>;

  /**
   * ShippingInstructionsHeaderDtoSchema
   * @type { object }
   * @property { string } name
   * @property { string } nameSuffix
   * @property { number } versionNumber
   * @property { string } shippingInstructionNumber
   * @property { string } carrierScac
   * @property { string } carrierBookingNumber
   */
  export const ShippingInstructionsHeaderDtoSchema = z
    .object({
      name: z.string(),
      nameSuffix: z.string().nullish(),
      versionNumber: z.number(),
      shippingInstructionNumber: z.string().nullish(),
      carrierScac: z.string().nullish(),
      carrierBookingNumber: z.string().nullish(),
    })
    .readonly();
  export type ShippingInstructionsHeaderDto = z.infer<typeof ShippingInstructionsHeaderDtoSchema>;

  /**
   * ShippingInstructionsReferencesDtoSchema
   * @type { object }
   * @property { string } shipperReference
   * @property { string } forwarderReference
   * @property { string } transactionReferenceNumber
   * @property { string } blReferenceNumber
   * @property { string } uniqueConsignmentReference
   * @property { string } purchaseOrderNumber
   * @property { string } contractReferenceNumber
   * @property { string } rucNumber
   * @property { string } consigneeOrderNumber
   * @property { string } invoiceReferenceNumber
   * @property { string } letterOfCreditReference
   * @property { string } customsHouseBrokerReference
   * @property { string } fmcNumber
   * @property { string } exportLicenseNumber
   */
  export const ShippingInstructionsReferencesDtoSchema = z
    .object({
      shipperReference: z.string(),
      forwarderReference: z.string(),
      transactionReferenceNumber: z.string(),
      blReferenceNumber: z.string(),
      uniqueConsignmentReference: z.string(),
      purchaseOrderNumber: z.string(),
      contractReferenceNumber: z.string(),
      rucNumber: z.string(),
      consigneeOrderNumber: z.string(),
      invoiceReferenceNumber: z.string(),
      letterOfCreditReference: z.string(),
      customsHouseBrokerReference: z.string(),
      fmcNumber: z.string(),
      exportLicenseNumber: z.string(),
    })
    .readonly();
  export type ShippingInstructionsReferencesDto = z.infer<typeof ShippingInstructionsReferencesDtoSchema>;

  /**
   * ShippingInstructionsCustomsComplianceDtoSchema
   * @type { object }
   * @property { string } shipperTaxId
   * @property { string } shipperEORI
   * @property { string } consigneeTaxId
   * @property { string } consigneeEORI
   * @property { string } notifyPartyTaxId
   * @property { string } notifyPartyEORI
   */
  export const ShippingInstructionsCustomsComplianceDtoSchema = z
    .object({
      shipperTaxId: z.string(),
      shipperEORI: z.string(),
      consigneeTaxId: z.string(),
      consigneeEORI: z.string(),
      notifyPartyTaxId: z.string(),
      notifyPartyEORI: z.string(),
    })
    .readonly();
  export type ShippingInstructionsCustomsComplianceDto = z.infer<typeof ShippingInstructionsCustomsComplianceDtoSchema>;

  /**
   * ShippingInstructionsIcs2DtoSchema
   * @type { object }
   * @property { boolean } goodsDeliveredInEu
   * @property { string } ensDeclaration
   * @property { string } issuedHouseBills
   */
  export const ShippingInstructionsIcs2DtoSchema = z
    .object({
      goodsDeliveredInEu: z.boolean(),
      ensDeclaration: EnsDeclarationEnumSchema,
      issuedHouseBills: IssuedHouseBillsEnumSchema,
    })
    .readonly();
  export type ShippingInstructionsIcs2Dto = z.infer<typeof ShippingInstructionsIcs2DtoSchema>;

  /**
   * ShippingInstructionsCargoIdentificationNumbersDtoSchema
   * @type { object }
   * @property { string } PCINNumber
   * @property { string } CSNNumber
   * @property { string } MCINNumber
   */
  export const ShippingInstructionsCargoIdentificationNumbersDtoSchema = z
    .object({ PCINNumber: z.string(), CSNNumber: z.string(), MCINNumber: z.string() })
    .readonly();
  export type ShippingInstructionsCargoIdentificationNumbersDto = z.infer<
    typeof ShippingInstructionsCargoIdentificationNumbersDtoSchema
  >;

  /**
   * ShippingInstructionsControlTotalsDtoSchema
   * @type { object }
   * @property { number } totalNumberOfContainers
   * @property { number } totalNumberOfPackages
   * @property { number } totalShipmentWeight
   * @property { number } totalShipmentVolume
   */
  export const ShippingInstructionsControlTotalsDtoSchema = z
    .object({
      totalNumberOfContainers: z.number(),
      totalNumberOfPackages: z.number(),
      totalShipmentWeight: z.number(),
      totalShipmentVolume: z.number(),
    })
    .readonly();
  export type ShippingInstructionsControlTotalsDto = z.infer<typeof ShippingInstructionsControlTotalsDtoSchema>;

  /**
   * FreightChargesDtoSchema
   * @type { object }
   * @property { string } freightPayer
   * @property { string } freightTerm
   */
  export const FreightChargesDtoSchema = z
    .object({ freightPayer: z.string(), freightTerm: CommonModels.ChargePaymentEnumSchema })
    .readonly();
  export type FreightChargesDto = z.infer<typeof FreightChargesDtoSchema>;

  /**
   * ShippingInstructionsShippersDeclaredValueDtoSchema
   * @type { object }
   * @property { string } currency
   * @property { number } shipperDeclaredValue
   */
  export const ShippingInstructionsShippersDeclaredValueDtoSchema = z
    .object({ currency: z.string(), shipperDeclaredValue: z.number() })
    .readonly();
  export type ShippingInstructionsShippersDeclaredValueDto = z.infer<
    typeof ShippingInstructionsShippersDeclaredValueDtoSchema
  >;

  /**
   * ShippingInstructionsNotificationEmailsDtoSchema
   * @type { object }
   * @property { string } siRequestorEmails
   */
  export const ShippingInstructionsNotificationEmailsDtoSchema = z.object({ siRequestorEmails: z.string() }).readonly();
  export type ShippingInstructionsNotificationEmailsDto = z.infer<
    typeof ShippingInstructionsNotificationEmailsDtoSchema
  >;

  /**
   * ShippingInstructionsResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } positionId
   * @property { string } name
   * @property { string } nameSuffix
   * @property { string } date
   * @property { string } createdAt
   * @property { string } updatedAt
   * @property { number } versionNumber
   * @property { ShippingInstructionsHeaderDto } header
   * @property { ShippingInstructionsGeneralDetailsDto } generalDetails
   * @property { ShippingInstructionsReferencesDto } references
   * @property { ShippingInstructionsTransportDto } transport
   * @property { ShippingInstructionsCustomsComplianceDto } customsCompliance
   * @property { ShippingInstructionsIcs2Dto } ics2
   * @property { ShippingInstructionsCargoIdentificationNumbersDto } cargoIdentificationNumbers
   * @property { ShippingInstructionsCargoResponseDto[] } cargo
   * @property { ShippingInstructionsControlTotalsDto } controlTotals
   * @property { FreightChargesDto } freightCharges
   * @property { ShippingInstructionsShippersDeclaredValueDto } shippersDeclaredValue
   * @property { ShippingInstructionsNotificationEmailsDto } notificationEmails
   * @property { string } defaultFileName
   */
  export const ShippingInstructionsResponseDtoSchema = z
    .object({
      id: z.string(),
      positionId: z.string(),
      name: z.string(),
      nameSuffix: z.string().nullish(),
      date: z.iso.datetime({ offset: true }).nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedAt: z.iso.datetime({ offset: true }),
      versionNumber: z.number(),
      header: ShippingInstructionsHeaderDtoSchema,
      generalDetails: ShippingInstructionsGeneralDetailsDtoSchema,
      references: ShippingInstructionsReferencesDtoSchema,
      transport: ShippingInstructionsTransportDtoSchema,
      customsCompliance: ShippingInstructionsCustomsComplianceDtoSchema,
      ics2: ShippingInstructionsIcs2DtoSchema,
      cargoIdentificationNumbers: ShippingInstructionsCargoIdentificationNumbersDtoSchema,
      cargo: z.array(ShippingInstructionsCargoResponseDtoSchema).readonly().nullish(),
      controlTotals: ShippingInstructionsControlTotalsDtoSchema,
      freightCharges: FreightChargesDtoSchema,
      shippersDeclaredValue: ShippingInstructionsShippersDeclaredValueDtoSchema,
      notificationEmails: ShippingInstructionsNotificationEmailsDtoSchema,
      defaultFileName: z.string(),
    })
    .readonly();
  export type ShippingInstructionsResponseDto = z.infer<typeof ShippingInstructionsResponseDtoSchema>;

  /**
   * UpdateShippingInstructionsPartnerDtoSchema
   * @type { object }
   * @property { string } id Partner id
   * @property { string } name Partner name
   * @property { string } addressLine1 Address line 1
   * @property { string } addressLine2 Address line 2
   * @property { string } city City
   * @property { string } postalCode Postal code
   * @property { string } state State
   * @property { string } countryCode Country code
   * @property { string } taxId Tax ID
   * @property { string } contactName Contact name
   * @property { string } contactPhone Contact phone
   * @property { string } contactEmail Contact email
   */
  export const UpdateShippingInstructionsPartnerDtoSchema = z
    .object({
      id: z.string().describe("Partner id"),
      name: z.string().describe("Partner name"),
      addressLine1: z.string().describe("Address line 1"),
      addressLine2: z.string().describe("Address line 2"),
      city: z.string().describe("City"),
      postalCode: z.string().describe("Postal code"),
      state: z.string().describe("State"),
      countryCode: z.string().describe("Country code"),
      taxId: z.string().describe("Tax ID"),
      contactName: z.string().describe("Contact name"),
      contactPhone: z.string().describe("Contact phone"),
      contactEmail: z.string().describe("Contact email"),
    })
    .readonly();
  export type UpdateShippingInstructionsPartnerDto = z.infer<typeof UpdateShippingInstructionsPartnerDtoSchema>;

  /**
   * UpdateShippingInstructionsGeneralDetailsDtoSchema
   * @type { object }
   * @property { UpdateShippingInstructionsPartnerDto } shipper Shipper
   * @property { UpdateShippingInstructionsPartnerDto } consignee Consignee
   * @property { UpdateShippingInstructionsPartnerDto } freightForwarder Freight forwarder
   * @property { UpdateShippingInstructionsPartnerDto } notifyParty Notify party
   * @property { UpdateShippingInstructionsPartnerDto } additionalNotifyParty1 Additional notify party 1
   * @property { UpdateShippingInstructionsPartnerDto } additionalNotifyParty2 Additional notify party 2
   * @property { UpdateShippingInstructionsPartnerDto } contractParty Contract party
   * @property { UpdateShippingInstructionsPartnerDto } manufacturer Manufacturer
   * @property { UpdateShippingInstructionsPartnerDto } consolidator Consolidator
   * @property { UpdateShippingInstructionsPartnerDto } importer Importer
   * @property { UpdateShippingInstructionsPartnerDto } warehouseKeeper Warehouse keeper
   */
  export const UpdateShippingInstructionsGeneralDetailsDtoSchema = z
    .object({
      shipper: UpdateShippingInstructionsPartnerDtoSchema.describe("Shipper"),
      consignee: UpdateShippingInstructionsPartnerDtoSchema.describe("Consignee"),
      freightForwarder: UpdateShippingInstructionsPartnerDtoSchema.describe("Freight forwarder"),
      notifyParty: UpdateShippingInstructionsPartnerDtoSchema.describe("Notify party"),
      additionalNotifyParty1: UpdateShippingInstructionsPartnerDtoSchema.describe("Additional notify party 1"),
      additionalNotifyParty2: UpdateShippingInstructionsPartnerDtoSchema.describe("Additional notify party 2"),
      contractParty: UpdateShippingInstructionsPartnerDtoSchema.describe("Contract party"),
      manufacturer: UpdateShippingInstructionsPartnerDtoSchema.describe("Manufacturer"),
      consolidator: UpdateShippingInstructionsPartnerDtoSchema.describe("Consolidator"),
      importer: UpdateShippingInstructionsPartnerDtoSchema.describe("Importer"),
      warehouseKeeper: UpdateShippingInstructionsPartnerDtoSchema.describe("Warehouse keeper"),
    })
    .readonly();
  export type UpdateShippingInstructionsGeneralDetailsDto = z.infer<
    typeof UpdateShippingInstructionsGeneralDetailsDtoSchema
  >;

  /**
   * UpdateShippingInstructionsLocationDtoSchema
   * @type { object }
   * @property { string } id Location id
   * @property { string } name Location name
   * @property { string } code Location code
   * @property { string } countryCode Country code
   */
  export const UpdateShippingInstructionsLocationDtoSchema = z
    .object({
      id: z.string().describe("Location id"),
      name: z.string().describe("Location name"),
      code: z.string().describe("Location code"),
      countryCode: z.string().describe("Country code"),
    })
    .readonly();
  export type UpdateShippingInstructionsLocationDto = z.infer<typeof UpdateShippingInstructionsLocationDtoSchema>;

  /**
   * UpdateShippingInstructionsTransportDtoSchema
   * @type { object }
   * @property { string } vessel Vessel
   * @property { string } voyage Voyage
   * @property { string } imo IMO
   * @property { UpdateShippingInstructionsLocationDto } placeOfReceipt Place of receipt
   * @property { UpdateShippingInstructionsLocationDto } portOfLoading Port of loading
   * @property { UpdateShippingInstructionsLocationDto } portOfDischarge Port of discharge
   * @property { UpdateShippingInstructionsLocationDto } placeOfDelivery Place of delivery
   * @property { SIMoveTypeEnum } moveType Move type
   * @property { string } shipmentType Shipment type
   */
  export const UpdateShippingInstructionsTransportDtoSchema = z
    .object({
      vessel: z.string().describe("Vessel"),
      voyage: z.string().describe("Voyage"),
      imo: z.string().describe("IMO"),
      placeOfReceipt: UpdateShippingInstructionsLocationDtoSchema.describe("Place of receipt"),
      portOfLoading: UpdateShippingInstructionsLocationDtoSchema.describe("Port of loading"),
      portOfDischarge: UpdateShippingInstructionsLocationDtoSchema.describe("Port of discharge"),
      placeOfDelivery: UpdateShippingInstructionsLocationDtoSchema.describe("Place of delivery"),
      moveType: SIMoveTypeEnumSchema.describe("Move type"),
      shipmentType: z.string().describe("Shipment type"),
    })
    .readonly();
  export type UpdateShippingInstructionsTransportDto = z.infer<typeof UpdateShippingInstructionsTransportDtoSchema>;

  /**
   * UpdateShippingInstructionsHazardousDtoSchema
   * @type { object }
   * @property { string } IMOClass IMO class
   * @property { string } UNDGNumber UNDG number
   * @property { string } contact Contact
   */
  export const UpdateShippingInstructionsHazardousDtoSchema = z
    .object({
      IMOClass: z.string().describe("IMO class"),
      UNDGNumber: z.string().describe("UNDG number"),
      contact: z.string().describe("Contact"),
    })
    .readonly();
  export type UpdateShippingInstructionsHazardousDto = z.infer<typeof UpdateShippingInstructionsHazardousDtoSchema>;

  /**
   * UpdateShippingInstructionsPackageDtoSchema
   * @type { object }
   * @property { string } id Package id
   * @property { number } quantity Quantity
   * @property { string } packageType Package type
   * @property { string } packageTypeDescription Package type description
   * @property { string } packageDescription Package description
   * @property { string } hsCode HS code
   * @property { number } volume Volume
   * @property { number } grossWeight Gross weight
   * @property { string } caseMarks Case marks
   * @property { UpdateShippingInstructionsHazardousDto } hazardous Hazardous
   * @property { string } ncmCodes NCM codes
   * @property { string } cusCode CUS code
   */
  export const UpdateShippingInstructionsPackageDtoSchema = z
    .object({
      id: z.string().describe("Package id"),
      quantity: z.number().describe("Quantity"),
      packageType: z.string().describe("Package type"),
      packageTypeDescription: z.string().describe("Package type description"),
      packageDescription: z.string().describe("Package description"),
      hsCode: z.string().describe("HS code"),
      volume: z.number().describe("Volume"),
      grossWeight: z.number().describe("Gross weight"),
      caseMarks: z.string().describe("Case marks"),
      hazardous: UpdateShippingInstructionsHazardousDtoSchema.describe("Hazardous"),
      ncmCodes: z.string().describe("NCM codes"),
      cusCode: z.string().describe("CUS code"),
    })
    .readonly();
  export type UpdateShippingInstructionsPackageDto = z.infer<typeof UpdateShippingInstructionsPackageDtoSchema>;

  /**
   * UpdateShippingInstructionsCargoDtoSchema
   * @type { object }
   * @property { string } id Cargo id
   * @property { string } transportUnitNumber Transport unit number
   * @property { string } transportUnitType Transport unit type
   * @property { string } transportUnitDescription Transport unit description
   * @property { string } containerSupplier Container supplier
   * @property { number } grossWeight Gross weight
   * @property { number } tare Tare
   * @property { number } volume Volume
   * @property { string } seal1 Seal 1
   * @property { string } seal2 Seal 2
   * @property { string } woodDeclaration Wood declaration
   * @property { UpdateShippingInstructionsPackageDto[] } packages Packages
   */
  export const UpdateShippingInstructionsCargoDtoSchema = z
    .object({
      id: z.string().describe("Cargo id"),
      transportUnitNumber: z.string().describe("Transport unit number"),
      transportUnitType: z.string().describe("Transport unit type"),
      transportUnitDescription: z.string().describe("Transport unit description"),
      containerSupplier: z.string().describe("Container supplier"),
      grossWeight: z.number().describe("Gross weight"),
      tare: z.number().describe("Tare"),
      volume: z.number().describe("Volume"),
      seal1: z.string().describe("Seal 1"),
      seal2: z.string().describe("Seal 2"),
      woodDeclaration: WoodDeclarationEnumSchema.describe("Wood declaration"),
      packages: z.array(UpdateShippingInstructionsPackageDtoSchema).readonly().describe("Packages"),
    })
    .readonly();
  export type UpdateShippingInstructionsCargoDto = z.infer<typeof UpdateShippingInstructionsCargoDtoSchema>;

  /**
   * UpdateShippingInstructionsHeaderDtoSchema
   * @type { object }
   * @property { string } name Name
   * @property { string } nameSuffix Name suffix
   * @property { number } versionNumber Version number
   * @property { string } shippingInstructionNumber Shipping instruction number
   * @property { string } carrierScac Carrier SCAC
   * @property { string } carrierBookingNumber Carrier booking number
   */
  export const UpdateShippingInstructionsHeaderDtoSchema = z
    .object({
      name: z.string().describe("Name"),
      nameSuffix: z.string().describe("Name suffix"),
      versionNumber: z.number().describe("Version number"),
      shippingInstructionNumber: z.string().describe("Shipping instruction number"),
      carrierScac: z.string().describe("Carrier SCAC"),
      carrierBookingNumber: z.string().describe("Carrier booking number"),
    })
    .readonly();
  export type UpdateShippingInstructionsHeaderDto = z.infer<typeof UpdateShippingInstructionsHeaderDtoSchema>;

  /**
   * UpdateShippingInstructionsReferencesDtoSchema
   * @type { object }
   * @property { string } shipperReference Shipper reference
   * @property { string } forwarderReference Forwarder reference
   * @property { string } transactionReferenceNumber Transaction reference number
   * @property { string } blReferenceNumber BL reference number
   * @property { string } uniqueConsignmentReference Unique consignment reference
   * @property { string } purchaseOrderNumber Purchase order number
   * @property { string } contractReferenceNumber Contract reference number
   * @property { string } rucNumber RUC number
   * @property { string } consigneeOrderNumber Consignee order number
   * @property { string } invoiceReferenceNumber Invoice reference number
   * @property { string } letterOfCreditReference Letter of credit reference
   * @property { string } customsHouseBrokerReference Customs house broker reference
   * @property { string } fmcNumber FMC number
   * @property { string } exportLicenseNumber Export license number
   */
  export const UpdateShippingInstructionsReferencesDtoSchema = z
    .object({
      shipperReference: z.string().describe("Shipper reference"),
      forwarderReference: z.string().describe("Forwarder reference"),
      transactionReferenceNumber: z.string().describe("Transaction reference number"),
      blReferenceNumber: z.string().describe("BL reference number"),
      uniqueConsignmentReference: z.string().describe("Unique consignment reference"),
      purchaseOrderNumber: z.string().describe("Purchase order number"),
      contractReferenceNumber: z.string().describe("Contract reference number"),
      rucNumber: z.string().describe("RUC number"),
      consigneeOrderNumber: z.string().describe("Consignee order number"),
      invoiceReferenceNumber: z.string().describe("Invoice reference number"),
      letterOfCreditReference: z.string().describe("Letter of credit reference"),
      customsHouseBrokerReference: z.string().describe("Customs house broker reference"),
      fmcNumber: z.string().describe("FMC number"),
      exportLicenseNumber: z.string().describe("Export license number"),
    })
    .readonly();
  export type UpdateShippingInstructionsReferencesDto = z.infer<typeof UpdateShippingInstructionsReferencesDtoSchema>;

  /**
   * UpdateShippingInstructionsCustomsComplianceDtoSchema
   * @type { object }
   * @property { string } shipperTaxId Shipper tax ID
   * @property { string } shipperEORI Shipper EORI
   * @property { string } consigneeTaxId Consignee tax ID
   * @property { string } consigneeEORI Consignee EORI
   * @property { string } notifyPartyTaxId Notify party tax ID
   * @property { string } notifyPartyEORI Notify party EORI
   */
  export const UpdateShippingInstructionsCustomsComplianceDtoSchema = z
    .object({
      shipperTaxId: z.string().describe("Shipper tax ID"),
      shipperEORI: z.string().describe("Shipper EORI"),
      consigneeTaxId: z.string().describe("Consignee tax ID"),
      consigneeEORI: z.string().describe("Consignee EORI"),
      notifyPartyTaxId: z.string().describe("Notify party tax ID"),
      notifyPartyEORI: z.string().describe("Notify party EORI"),
    })
    .readonly();
  export type UpdateShippingInstructionsCustomsComplianceDto = z.infer<
    typeof UpdateShippingInstructionsCustomsComplianceDtoSchema
  >;

  /**
   * UpdateShippingInstructionsIcs2DtoSchema
   * @type { object }
   * @property { boolean } goodsDeliveredInEu Goods delivered in EU
   * @property { string } ensDeclaration ENS declaration
   * @property { string } issuedHouseBills Issued house bills
   */
  export const UpdateShippingInstructionsIcs2DtoSchema = z
    .object({
      goodsDeliveredInEu: z.boolean().describe("Goods delivered in EU"),
      ensDeclaration: EnsDeclarationEnumSchema.describe("ENS declaration"),
      issuedHouseBills: IssuedHouseBillsEnumSchema.describe("Issued house bills"),
    })
    .readonly();
  export type UpdateShippingInstructionsIcs2Dto = z.infer<typeof UpdateShippingInstructionsIcs2DtoSchema>;

  /**
   * UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema
   * @type { object }
   * @property { string } PCINNumber PCIN number
   * @property { string } CSNNumber CSN number
   * @property { string } MCINNumber MCIN number
   */
  export const UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema = z
    .object({
      PCINNumber: z.string().describe("PCIN number"),
      CSNNumber: z.string().describe("CSN number"),
      MCINNumber: z.string().describe("MCIN number"),
    })
    .readonly();
  export type UpdateShippingInstructionsCargoIdentificationNumbersDto = z.infer<
    typeof UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema
  >;

  /**
   * UpdateFreightChargesDtoSchema
   * @type { object }
   * @property { string } freightPayer
   * @property { string } freightTerm
   */
  export const UpdateFreightChargesDtoSchema = z
    .object({ freightPayer: z.string(), freightTerm: CommonModels.ChargePaymentEnumSchema })
    .readonly();
  export type UpdateFreightChargesDto = z.infer<typeof UpdateFreightChargesDtoSchema>;

  /**
   * UpdateShippingInstructionsShippersDeclaredValueDtoSchema
   * @type { object }
   * @property { string } currency Currency
   * @property { number } shipperDeclaredValue Shipper declared value
   */
  export const UpdateShippingInstructionsShippersDeclaredValueDtoSchema = z
    .object({
      currency: z.string().describe("Currency"),
      shipperDeclaredValue: z.number().describe("Shipper declared value"),
    })
    .readonly();
  export type UpdateShippingInstructionsShippersDeclaredValueDto = z.infer<
    typeof UpdateShippingInstructionsShippersDeclaredValueDtoSchema
  >;

  /**
   * UpdateShippingInstructionsNotificationEmailsDtoSchema
   * @type { object }
   * @property { string } siRequestorEmails SI requestor emails
   */
  export const UpdateShippingInstructionsNotificationEmailsDtoSchema = z
    .object({ siRequestorEmails: z.string().describe("SI requestor emails") })
    .readonly();
  export type UpdateShippingInstructionsNotificationEmailsDto = z.infer<
    typeof UpdateShippingInstructionsNotificationEmailsDtoSchema
  >;

  /**
   * UpdateShippingInstructionsRequestDtoSchema
   * @type { object }
   * @property { string } date Date
   * @property { UpdateShippingInstructionsHeaderDto } header Header
   * @property { UpdateShippingInstructionsGeneralDetailsDto } generalDetails General details
   * @property { UpdateShippingInstructionsReferencesDto } references References
   * @property { UpdateShippingInstructionsTransportDto } transport Transport
   * @property { UpdateShippingInstructionsCustomsComplianceDto } customsCompliance Customs compliance
   * @property { UpdateShippingInstructionsIcs2Dto } ics2 ICS2
   * @property { UpdateShippingInstructionsCargoIdentificationNumbersDto } cargoIdentificationNumbers Cargo identification numbers
   * @property { UpdateShippingInstructionsCargoDto[] } cargo Cargo
   * @property { UpdateFreightChargesDto } freightCharges
   * @property { UpdateShippingInstructionsShippersDeclaredValueDto } shippersDeclaredValue Shipper's declared value
   * @property { UpdateShippingInstructionsNotificationEmailsDto } notificationEmails Notification emails
   */
  export const UpdateShippingInstructionsRequestDtoSchema = z
    .object({
      date: z.iso.datetime({ offset: true }).describe("Date"),
      header: UpdateShippingInstructionsHeaderDtoSchema.describe("Header"),
      generalDetails: UpdateShippingInstructionsGeneralDetailsDtoSchema.describe("General details"),
      references: UpdateShippingInstructionsReferencesDtoSchema.describe("References"),
      transport: UpdateShippingInstructionsTransportDtoSchema.describe("Transport"),
      customsCompliance: UpdateShippingInstructionsCustomsComplianceDtoSchema.describe("Customs compliance"),
      ics2: UpdateShippingInstructionsIcs2DtoSchema.describe("ICS2"),
      cargoIdentificationNumbers:
        UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema.describe("Cargo identification numbers"),
      cargo: z.array(UpdateShippingInstructionsCargoDtoSchema).readonly().describe("Cargo"),
      freightCharges: UpdateFreightChargesDtoSchema,
      shippersDeclaredValue:
        UpdateShippingInstructionsShippersDeclaredValueDtoSchema.describe("Shipper's declared value"),
      notificationEmails: UpdateShippingInstructionsNotificationEmailsDtoSchema.describe("Notification emails"),
    })
    .readonly();
  export type UpdateShippingInstructionsRequestDto = z.infer<typeof UpdateShippingInstructionsRequestDtoSchema>;
}
