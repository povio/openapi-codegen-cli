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
export const WoodDeclarationEnumSchema = z.enum(["NoWood", "TreatedAndCertified", "NotTreatedAndNotCertified", "Processed"]);
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
export const ShippingInstructionsPartnerResponseDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), addressLine1: z.string().nullable(), addressLine2: z.string().nullable(), city: z.string().nullable(), postalCode: z.string().nullable(), state: z.string().nullable(), countryCode: z.string().nullable(), contactName: z.string().nullable(), contactPhone: z.string().nullable(), contactEmail: z.string().nullable() }).partial();
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
export const ShippingInstructionsGeneralDetailsDtoSchema = z.object({ shipper: ShippingInstructionsPartnerResponseDtoSchema.nullable(), consignee: ShippingInstructionsPartnerResponseDtoSchema.nullable(), freightForwarder: ShippingInstructionsPartnerResponseDtoSchema.nullable(), notifyParty: ShippingInstructionsPartnerResponseDtoSchema.nullable(), additionalNotifyParty1: ShippingInstructionsPartnerResponseDtoSchema.nullable(), additionalNotifyParty2: ShippingInstructionsPartnerResponseDtoSchema.nullable(), contractParty: ShippingInstructionsPartnerResponseDtoSchema.nullable(), manufacturer: ShippingInstructionsPartnerResponseDtoSchema.nullable(), consolidator: ShippingInstructionsPartnerResponseDtoSchema.nullable(), importer: ShippingInstructionsPartnerResponseDtoSchema.nullable(), warehouseKeeper: ShippingInstructionsPartnerResponseDtoSchema.nullable() }).partial();
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
export const ShippingInstructionsLocationResponseDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), code: z.string().nullable(), countryCode: z.string().nullable(), eta: z.iso.datetime({ offset: true }).nullable(), vessel: z.string().nullable(), voyage: z.string().nullable() }).partial();
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
export const ShippingInstructionsTransportDtoSchema = z.object({ vessel: z.string().nullable(), voyage: z.string().nullable(), imo: z.string().nullable(), placeOfReceipt: ShippingInstructionsLocationResponseDtoSchema.nullable(), portOfLoading: ShippingInstructionsLocationResponseDtoSchema.nullable(), portOfDischarge: ShippingInstructionsLocationResponseDtoSchema.nullable(), placeOfDelivery: ShippingInstructionsLocationResponseDtoSchema.nullable(), moveType: SIMoveTypeEnumSchema.nullable(), shipmentType: z.string().nullable() }).partial();
export type ShippingInstructionsTransportDto = z.infer<typeof ShippingInstructionsTransportDtoSchema>;

/** 
 * ShippingInstructionsHazardousDtoSchema 
 * @type { object }
 * @property { string } IMOClass  
 * @property { string } UNDGNumber  
 * @property { string } contact  
 */
export const ShippingInstructionsHazardousDtoSchema = z.object({ IMOClass: z.string().nullable(), UNDGNumber: z.string().nullable(), contact: z.string().nullable() }).partial();
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
export const ShippingInstructionsPackageResponseDtoSchema = z.object({ id: z.string().nullable(), quantity: z.number().nullable(), packageType: z.string().nullable(), packageTypeDescription: z.string().nullable(), packageDescription: z.string().nullable(), hsCode: z.string().nullable(), volume: z.number().nullable(), grossWeight: z.number().nullable(), caseMarks: z.string().nullable(), hazardous: ShippingInstructionsHazardousDtoSchema.nullable(), ncmCodes: z.string().nullable(), cusCode: z.string().nullable() }).partial();
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
export const ShippingInstructionsCargoResponseDtoSchema = z.object({ id: z.string().nullish(), transportUnitNumber: z.string().nullish(), transportUnitType: z.string().nullish(), transportUnitDescription: z.string().nullish(), containerSupplier: z.string().nullish(), grossWeight: z.number().nullish(), tare: z.number().nullish(), volume: z.number().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), woodDeclaration: WoodDeclarationEnumSchema.nullish(), packages: z.array(ShippingInstructionsPackageResponseDtoSchema) });
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
export const ShippingInstructionsHeaderDtoSchema = z.object({ name: z.string(), nameSuffix: z.string().nullish(), versionNumber: z.number(), shippingInstructionNumber: z.string().nullish(), carrierScac: z.string().nullish(), carrierBookingNumber: z.string().nullish() });
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
export const ShippingInstructionsReferencesDtoSchema = z.object({ shipperReference: z.string().nullable(), forwarderReference: z.string().nullable(), transactionReferenceNumber: z.string().nullable(), blReferenceNumber: z.string().nullable(), uniqueConsignmentReference: z.string().nullable(), purchaseOrderNumber: z.string().nullable(), contractReferenceNumber: z.string().nullable(), rucNumber: z.string().nullable(), consigneeOrderNumber: z.string().nullable(), invoiceReferenceNumber: z.string().nullable(), letterOfCreditReference: z.string().nullable(), customsHouseBrokerReference: z.string().nullable(), fmcNumber: z.string().nullable(), exportLicenseNumber: z.string().nullable() }).partial();
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
export const ShippingInstructionsCustomsComplianceDtoSchema = z.object({ shipperTaxId: z.string().nullable(), shipperEORI: z.string().nullable(), consigneeTaxId: z.string().nullable(), consigneeEORI: z.string().nullable(), notifyPartyTaxId: z.string().nullable(), notifyPartyEORI: z.string().nullable() }).partial();
export type ShippingInstructionsCustomsComplianceDto = z.infer<typeof ShippingInstructionsCustomsComplianceDtoSchema>;

/** 
 * ShippingInstructionsIcs2DtoSchema 
 * @type { object }
 * @property { boolean } goodsDeliveredInEu  
 * @property { string } ensDeclaration  
 * @property { string } issuedHouseBills  
 */
export const ShippingInstructionsIcs2DtoSchema = z.object({ goodsDeliveredInEu: z.boolean().nullable(), ensDeclaration: EnsDeclarationEnumSchema.nullable(), issuedHouseBills: IssuedHouseBillsEnumSchema.nullable() }).partial();
export type ShippingInstructionsIcs2Dto = z.infer<typeof ShippingInstructionsIcs2DtoSchema>;

/** 
 * ShippingInstructionsCargoIdentificationNumbersDtoSchema 
 * @type { object }
 * @property { string } PCINNumber  
 * @property { string } CSNNumber  
 * @property { string } MCINNumber  
 */
export const ShippingInstructionsCargoIdentificationNumbersDtoSchema = z.object({ PCINNumber: z.string().nullable(), CSNNumber: z.string().nullable(), MCINNumber: z.string().nullable() }).partial();
export type ShippingInstructionsCargoIdentificationNumbersDto = z.infer<typeof ShippingInstructionsCargoIdentificationNumbersDtoSchema>;

/** 
 * ShippingInstructionsControlTotalsDtoSchema 
 * @type { object }
 * @property { number } totalNumberOfContainers  
 * @property { number } totalNumberOfPackages  
 * @property { number } totalShipmentWeight  
 * @property { number } totalShipmentVolume  
 */
export const ShippingInstructionsControlTotalsDtoSchema = z.object({ totalNumberOfContainers: z.number().nullable(), totalNumberOfPackages: z.number().nullable(), totalShipmentWeight: z.number().nullable(), totalShipmentVolume: z.number().nullable() }).partial();
export type ShippingInstructionsControlTotalsDto = z.infer<typeof ShippingInstructionsControlTotalsDtoSchema>;

/** 
 * FreightChargesDtoSchema 
 * @type { object }
 * @property { string } freightPayer  
 * @property { string } freightTerm  
 */
export const FreightChargesDtoSchema = z.object({ freightPayer: z.string().nullable(), freightTerm: CommonModels.ChargePaymentEnumSchema.nullable() }).partial();
export type FreightChargesDto = z.infer<typeof FreightChargesDtoSchema>;

/** 
 * ShippingInstructionsShippersDeclaredValueDtoSchema 
 * @type { object }
 * @property { string } currency  
 * @property { number } shipperDeclaredValue  
 */
export const ShippingInstructionsShippersDeclaredValueDtoSchema = z.object({ currency: z.string().nullable(), shipperDeclaredValue: z.number().nullable() }).partial();
export type ShippingInstructionsShippersDeclaredValueDto = z.infer<typeof ShippingInstructionsShippersDeclaredValueDtoSchema>;

/** 
 * ShippingInstructionsNotificationEmailsDtoSchema 
 * @type { object }
 * @property { string } siRequestorEmails  
 */
export const ShippingInstructionsNotificationEmailsDtoSchema = z.object({ siRequestorEmails: z.string().nullable() }).partial();
export type ShippingInstructionsNotificationEmailsDto = z.infer<typeof ShippingInstructionsNotificationEmailsDtoSchema>;

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
export const ShippingInstructionsResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), name: z.string(), nameSuffix: z.string().nullish(), date: z.iso.datetime({ offset: true }).nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), versionNumber: z.number(), header: ShippingInstructionsHeaderDtoSchema, generalDetails: ShippingInstructionsGeneralDetailsDtoSchema, references: ShippingInstructionsReferencesDtoSchema, transport: ShippingInstructionsTransportDtoSchema, customsCompliance: ShippingInstructionsCustomsComplianceDtoSchema, ics2: ShippingInstructionsIcs2DtoSchema, cargoIdentificationNumbers: ShippingInstructionsCargoIdentificationNumbersDtoSchema, cargo: z.array(ShippingInstructionsCargoResponseDtoSchema).nullish(), controlTotals: ShippingInstructionsControlTotalsDtoSchema, freightCharges: FreightChargesDtoSchema, shippersDeclaredValue: ShippingInstructionsShippersDeclaredValueDtoSchema, notificationEmails: ShippingInstructionsNotificationEmailsDtoSchema, defaultFileName: z.string() });
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
export const UpdateShippingInstructionsPartnerDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), addressLine1: z.string().nullable(), addressLine2: z.string().nullable(), city: z.string().nullable(), postalCode: z.string().nullable(), state: z.string().nullable(), countryCode: z.string().nullable(), taxId: z.string().nullable(), contactName: z.string().nullable(), contactPhone: z.string().nullable(), contactEmail: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsGeneralDetailsDtoSchema = z.object({ shipper: UpdateShippingInstructionsPartnerDtoSchema.nullable(), consignee: UpdateShippingInstructionsPartnerDtoSchema.nullable(), freightForwarder: UpdateShippingInstructionsPartnerDtoSchema.nullable(), notifyParty: UpdateShippingInstructionsPartnerDtoSchema.nullable(), additionalNotifyParty1: UpdateShippingInstructionsPartnerDtoSchema.nullable(), additionalNotifyParty2: UpdateShippingInstructionsPartnerDtoSchema.nullable(), contractParty: UpdateShippingInstructionsPartnerDtoSchema.nullable(), manufacturer: UpdateShippingInstructionsPartnerDtoSchema.nullable(), consolidator: UpdateShippingInstructionsPartnerDtoSchema.nullable(), importer: UpdateShippingInstructionsPartnerDtoSchema.nullable(), warehouseKeeper: UpdateShippingInstructionsPartnerDtoSchema.nullable() }).partial();
export type UpdateShippingInstructionsGeneralDetailsDto = z.infer<typeof UpdateShippingInstructionsGeneralDetailsDtoSchema>;

/** 
 * UpdateShippingInstructionsLocationDtoSchema 
 * @type { object }
 * @property { string } id Location id 
 * @property { string } name Location name 
 * @property { string } code Location code 
 * @property { string } countryCode Country code 
 */
export const UpdateShippingInstructionsLocationDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), code: z.string().nullable(), countryCode: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsTransportDtoSchema = z.object({ vessel: z.string().nullable(), voyage: z.string().nullable(), imo: z.string().nullable(), placeOfReceipt: UpdateShippingInstructionsLocationDtoSchema.nullable(), portOfLoading: UpdateShippingInstructionsLocationDtoSchema.nullable(), portOfDischarge: UpdateShippingInstructionsLocationDtoSchema.nullable(), placeOfDelivery: UpdateShippingInstructionsLocationDtoSchema.nullable(), moveType: SIMoveTypeEnumSchema.nullable(), shipmentType: z.string().nullable() }).partial();
export type UpdateShippingInstructionsTransportDto = z.infer<typeof UpdateShippingInstructionsTransportDtoSchema>;

/** 
 * UpdateShippingInstructionsHazardousDtoSchema 
 * @type { object }
 * @property { string } IMOClass IMO class 
 * @property { string } UNDGNumber UNDG number 
 * @property { string } contact Contact 
 */
export const UpdateShippingInstructionsHazardousDtoSchema = z.object({ IMOClass: z.string().nullable(), UNDGNumber: z.string().nullable(), contact: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsPackageDtoSchema = z.object({ id: z.string().nullable(), quantity: z.number().nullable(), packageType: z.string().nullable(), packageTypeDescription: z.string().nullable(), packageDescription: z.string().nullable(), hsCode: z.string().nullable(), volume: z.number().nullable(), grossWeight: z.number().nullable(), caseMarks: z.string().nullable(), hazardous: UpdateShippingInstructionsHazardousDtoSchema.nullable(), ncmCodes: z.string().nullable(), cusCode: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsCargoDtoSchema = z.object({ id: z.string().nullable(), transportUnitNumber: z.string().nullable(), transportUnitType: z.string().nullable(), transportUnitDescription: z.string().nullable(), containerSupplier: z.string().nullable(), grossWeight: z.number().nullable(), tare: z.number().nullable(), volume: z.number().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), woodDeclaration: WoodDeclarationEnumSchema.nullable(), packages: z.array(UpdateShippingInstructionsPackageDtoSchema).nullable() }).partial();
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
export const UpdateShippingInstructionsHeaderDtoSchema = z.object({ name: z.string().nullable(), nameSuffix: z.string().nullable(), versionNumber: z.number().nullable(), shippingInstructionNumber: z.string().nullable(), carrierScac: z.string().nullable(), carrierBookingNumber: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsReferencesDtoSchema = z.object({ shipperReference: z.string().nullable(), forwarderReference: z.string().nullable(), transactionReferenceNumber: z.string().nullable(), blReferenceNumber: z.string().nullable(), uniqueConsignmentReference: z.string().nullable(), purchaseOrderNumber: z.string().nullable(), contractReferenceNumber: z.string().nullable(), rucNumber: z.string().nullable(), consigneeOrderNumber: z.string().nullable(), invoiceReferenceNumber: z.string().nullable(), letterOfCreditReference: z.string().nullable(), customsHouseBrokerReference: z.string().nullable(), fmcNumber: z.string().nullable(), exportLicenseNumber: z.string().nullable() }).partial();
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
export const UpdateShippingInstructionsCustomsComplianceDtoSchema = z.object({ shipperTaxId: z.string().nullable(), shipperEORI: z.string().nullable(), consigneeTaxId: z.string().nullable(), consigneeEORI: z.string().nullable(), notifyPartyTaxId: z.string().nullable(), notifyPartyEORI: z.string().nullable() }).partial();
export type UpdateShippingInstructionsCustomsComplianceDto = z.infer<typeof UpdateShippingInstructionsCustomsComplianceDtoSchema>;

/** 
 * UpdateShippingInstructionsIcs2DtoSchema 
 * @type { object }
 * @property { boolean } goodsDeliveredInEu Goods delivered in EU 
 * @property { string } ensDeclaration ENS declaration 
 * @property { string } issuedHouseBills Issued house bills 
 */
export const UpdateShippingInstructionsIcs2DtoSchema = z.object({ goodsDeliveredInEu: z.boolean().nullable(), ensDeclaration: EnsDeclarationEnumSchema.nullable(), issuedHouseBills: IssuedHouseBillsEnumSchema.nullable() }).partial();
export type UpdateShippingInstructionsIcs2Dto = z.infer<typeof UpdateShippingInstructionsIcs2DtoSchema>;

/** 
 * UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema 
 * @type { object }
 * @property { string } PCINNumber PCIN number 
 * @property { string } CSNNumber CSN number 
 * @property { string } MCINNumber MCIN number 
 */
export const UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema = z.object({ PCINNumber: z.string().nullable(), CSNNumber: z.string().nullable(), MCINNumber: z.string().nullable() }).partial();
export type UpdateShippingInstructionsCargoIdentificationNumbersDto = z.infer<typeof UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema>;

/** 
 * UpdateFreightChargesDtoSchema 
 * @type { object }
 * @property { string } freightPayer  
 * @property { string } freightTerm  
 */
export const UpdateFreightChargesDtoSchema = z.object({ freightPayer: z.string().nullable(), freightTerm: CommonModels.ChargePaymentEnumSchema.nullable() }).partial();
export type UpdateFreightChargesDto = z.infer<typeof UpdateFreightChargesDtoSchema>;

/** 
 * UpdateShippingInstructionsShippersDeclaredValueDtoSchema 
 * @type { object }
 * @property { string } currency Currency 
 * @property { number } shipperDeclaredValue Shipper declared value 
 */
export const UpdateShippingInstructionsShippersDeclaredValueDtoSchema = z.object({ currency: z.string().nullable(), shipperDeclaredValue: z.number().nullable() }).partial();
export type UpdateShippingInstructionsShippersDeclaredValueDto = z.infer<typeof UpdateShippingInstructionsShippersDeclaredValueDtoSchema>;

/** 
 * UpdateShippingInstructionsNotificationEmailsDtoSchema 
 * @type { object }
 * @property { string } siRequestorEmails SI requestor emails 
 */
export const UpdateShippingInstructionsNotificationEmailsDtoSchema = z.object({ siRequestorEmails: z.string().nullable() }).partial();
export type UpdateShippingInstructionsNotificationEmailsDto = z.infer<typeof UpdateShippingInstructionsNotificationEmailsDtoSchema>;

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
export const UpdateShippingInstructionsRequestDtoSchema = z.object({ date: z.iso.datetime({ offset: true }).nullable(), header: UpdateShippingInstructionsHeaderDtoSchema.nullable(), generalDetails: UpdateShippingInstructionsGeneralDetailsDtoSchema.nullable(), references: UpdateShippingInstructionsReferencesDtoSchema.nullable(), transport: UpdateShippingInstructionsTransportDtoSchema.nullable(), customsCompliance: UpdateShippingInstructionsCustomsComplianceDtoSchema.nullable(), ics2: UpdateShippingInstructionsIcs2DtoSchema.nullable(), cargoIdentificationNumbers: UpdateShippingInstructionsCargoIdentificationNumbersDtoSchema.nullable(), cargo: z.array(UpdateShippingInstructionsCargoDtoSchema).nullable(), freightCharges: UpdateFreightChargesDtoSchema.nullable(), shippersDeclaredValue: UpdateShippingInstructionsShippersDeclaredValueDtoSchema.nullable(), notificationEmails: UpdateShippingInstructionsNotificationEmailsDtoSchema.nullable() }).partial();
export type UpdateShippingInstructionsRequestDto = z.infer<typeof UpdateShippingInstructionsRequestDtoSchema>;

}
