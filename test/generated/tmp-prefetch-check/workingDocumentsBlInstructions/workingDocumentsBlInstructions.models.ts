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
export const BlInstructionsDocumentSettingsDtoDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable(), location: z.string().nullable(), signer: z.string().nullable() }).partial();
export type BlInstructionsDocumentSettingsDtoDTO = z.infer<typeof BlInstructionsDocumentSettingsDtoDTOSchema>;

/** 
 * BlInstructionsDocumentCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const BlInstructionsDocumentCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
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
export const BlInstructionsDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable(), eori: z.string().nullable(), vatNumber: z.string().nullable() }).partial();
export type BlInstructionsDocumentBusinessPartnerResponseDTO = z.infer<typeof BlInstructionsDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * BlInstructionsDocumentPlaceResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the place 
 * @property { string } name Name of the place 
 */
export const BlInstructionsDocumentPlaceResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type BlInstructionsDocumentPlaceResponseDTO = z.infer<typeof BlInstructionsDocumentPlaceResponseDTOSchema>;

/** 
 * AllChargesEnumSchema 
 * @type { enum }
 */
export const AllChargesEnumSchema = z.enum(["Prepaid", "Collect", "Detailed"]);
export type AllChargesEnum = z.infer<typeof AllChargesEnumSchema>;
export const AllChargesEnum = AllChargesEnumSchema.enum;

/** 
 * BlInstructionsDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 * @property { string } countryCode Country ISO2 code of the port 
 */
export const BlInstructionsDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), countryCode: z.string().nullable() }).partial();
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
export const BlInstructionsDocumentCountryDtoSchema = z.object({ id: z.string(), name: z.string() });
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
export const BlInstructionsDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), date: z.iso.datetime({ offset: true }).nullish(), blNumber: z.string().nullish(), exportReference: z.string().nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), originCountry: BlInstructionsDocumentCountryResponseDTOSchema.nullish(), useLatterOfCredit: z.boolean().nullish(), additionalText: z.string().nullish(), versionNumber: z.number(), buyer: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), seller: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), consignee: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, shipper: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, notify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, alsoNotify: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, forwarder: BlInstructionsDocumentBusinessPartnerResponseDTOSchema, precarriageBy: BlInstructionsDocumentBusinessPartnerResponseDTOSchema.nullish(), placeOfReceipt: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), stowedIntoContainerCity: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), placeOfAcceptanceCity: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAt: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAtText: z.string().nullish(), loadingPierTerminal: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), loadingPierTerminalText: z.string().nullish(), precarriageByText: z.string().nullish(), placeOfReceiptText: z.string().nullish(), portOfLoadingText: z.string().nullish(), portOfDischargeText: z.string().nullish(), placeOfDeliveryText: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), movementType: CommonModels.MovementTypeEnumSchema.nullish(), carrierBookingNumber: z.string().nullish(), csnNumber: z.string().nullish(), mcinNumber: z.string().nullish(), pcinNumber: z.string().nullish(), dueNumber: z.string().nullish(), goodsDeliveredInEu: z.boolean().nullish(), rucNumber: z.string().nullish(), shipmentDeclaredValue: z.number().nullish(), shipmentDeclaredValueCurrency: z.string().nullish(), allCharges: AllChargesEnumSchema.nullish(), baseFreight: CommonModels.ChargePaymentEnumSchema.nullish(), additionalCharges: CommonModels.ChargePaymentEnumSchema.nullish(), originHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullish(), originPortCharges: CommonModels.ChargePaymentEnumSchema.nullish(), destinationPortCharges: CommonModels.ChargePaymentEnumSchema.nullish(), destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullish(), shippingInstructionsComments: z.string().nullish(), chargePayerId: z.string().nullish(), chargePayLocationId: z.string().nullish(), portOfLoading: BlInstructionsDocumentPortResponseDTOSchema.nullish(), portOfDischarge: BlInstructionsDocumentPortResponseDTOSchema.nullish(), placeOfDelivery: BlInstructionsDocumentPlaceResponseDTOSchema.nullish(), settings: BlInstructionsDocumentSettingsDtoDTOSchema.nullish(), data: CommonModels.TemplatedDocumentDataDtoSchema.nullish(), cargo: CommonModels.CargoTableBlockDtoSchema.nullish(), bodyRemarks: z.string().nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.DocumentConfigDTOSchema, requestedDocumentType: RequestedDocumentTypeEnumSchema.nullish(), requestedDocumentFreighted: z.boolean().nullish(), requestedDocumentQuantity: z.number().nullish(), manifestFilerStatus: ManifestFilerStatusEnumSchema.nullish(), manifestFilerIdentifier: z.string().nullish(), manifestFilingCountry: BlInstructionsDocumentCountryDtoSchema.nullish() });
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
export const UpdateBlInstructionsDocumentSettingsRequestDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), location: z.string().nullable(), signer: z.string().nullable(), date: z.iso.datetime({ offset: true }).nullable() }).partial();
export type UpdateBlInstructionsDocumentSettingsRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateBlInstructionsDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema>;

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
export const UpdateBlInstructionsDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), csnNumber: z.string().nullable(), mcinNumber: z.string().nullable(), pcinNumber: z.string().nullable(), dueNumber: z.string().nullable(), goodsDeliveredInEu: z.boolean().nullable(), rucNumber: z.string().nullable(), shipmentDeclaredValueCurrency: z.string().nullable(), shipmentDeclaredValue: z.number().nullable(), allCharges: AllChargesEnumSchema.nullable(), baseFreight: CommonModels.ChargePaymentEnumSchema.nullable(), additionalCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originPortCharges: CommonModels.ChargePaymentEnumSchema.nullable(), destinationPortCharges: CommonModels.ChargePaymentEnumSchema.nullable(), destinationHaulageCharges: CommonModels.ChargePaymentEnumSchema.nullable(), originCountryId: z.string().nullable(), useLatterOfCredit: z.boolean().nullable(), additionalText: z.string().nullable(), consignee: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), buyer: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), seller: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), forwarder: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), originalsToBeReleasedAtId: z.string().nullable(), originalsToBeReleasedAtText: z.string().nullable(), notify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateBlInstructionsDocumentBusinessPartnerRequestDTOSchema.nullable(), shippingInstructionsComments: z.string().nullable(), chargePayerId: z.string().nullable(), chargePayLocationId: z.string().nullable(), precarriageById: z.string().nullable(), placeOfReceiptId: z.string().nullable(), stowedIntoContainerCityId: z.string().nullable(), loadingPierTerminalId: z.string().nullable(), loadingPierTerminalText: z.string().nullable(), placeOfAcceptanceCityId: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), carrierBookingNumber: z.string().nullable(), portOfLoadingId: z.string().nullable(), portOfDischargeId: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), suppressWeight: z.boolean().nullable(), suppressMeasurement: z.boolean().nullable(), bodyRemarks: z.string().nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), date: z.iso.datetime({ offset: true }).nullable(), settings: UpdateBlInstructionsDocumentSettingsRequestDTOSchema.nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable(), requestedDocumentType: RequestedDocumentTypeEnumSchema.nullable(), requestedDocumentFreighted: z.boolean().nullable(), requestedDocumentQuantity: z.number().nullable(), precarriageByText: z.string().nullable(), placeOfReceiptText: z.string().nullable(), portOfLoadingText: z.string().nullable(), portOfDischargeText: z.string().nullable(), placeOfDeliveryText: z.string().nullable(), manifestFilerStatus: ManifestFilerStatusEnumSchema.nullable(), manifestFilingCountryId: z.string().nullable(), manifestFilerIdentifier: z.string().nullable() }).partial();
export type UpdateBlInstructionsDocumentRequestDTO = z.infer<typeof UpdateBlInstructionsDocumentRequestDTOSchema>;

}
