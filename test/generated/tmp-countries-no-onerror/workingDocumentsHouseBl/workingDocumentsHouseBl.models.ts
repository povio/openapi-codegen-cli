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
export const HouseBlDocumentSettingsDtoDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), quantityOfCopies: z.number().nullable(), date: z.iso.datetime({ offset: true }).nullable(), location: z.string().nullable(), signer: z.string().nullable(), hideSignature: z.boolean().nullable(), capsLock: z.boolean().nullable(), documentTitle: z.string().nullable() }).partial();
export type HouseBlDocumentSettingsDtoDTO = z.infer<typeof HouseBlDocumentSettingsDtoDTOSchema>;

/** 
 * HouseBlDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const HouseBlDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type HouseBlDocumentBusinessPartnerResponseDTO = z.infer<typeof HouseBlDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * HouseBlDocumentCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const HouseBlDocumentCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentCountryResponseDTO = z.infer<typeof HouseBlDocumentCountryResponseDTOSchema>;

/** 
 * HouseBlDocumentPlaceResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the place 
 * @property { string } name Name of the place 
 */
export const HouseBlDocumentPlaceResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentPlaceResponseDTO = z.infer<typeof HouseBlDocumentPlaceResponseDTOSchema>;

/** 
 * HouseBlDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const HouseBlDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type HouseBlDocumentPortResponseDTO = z.infer<typeof HouseBlDocumentPortResponseDTOSchema>;

/** 
 * HouseBlDocumentTerminalResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the terminal 
 * @property { string } name Name of the terminal 
 */
export const HouseBlDocumentTerminalResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
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
export const HouseBlDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string().nullish(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), blNumber: z.string().nullish(), carrierBookingNumber: z.string().nullish(), exportReference: z.string().nullish(), forwarder: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), originCountry: HouseBlDocumentCountryResponseDTOSchema.nullish(), useLatterOfCredit: z.boolean().nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.nullish(), additionalTextTop: CommonModels.EditorContentResponseDtoSchema.nullish(), direction: CommonModels.DirectionEnumSchema.nullish(), transportMode: CommonModels.TransportModeEnumSchema.nullish(), versionNumber: z.number(), consignee: HouseBlDocumentBusinessPartnerResponseDTOSchema, shipper: HouseBlDocumentBusinessPartnerResponseDTOSchema, cargoReleaseBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), notify: HouseBlDocumentBusinessPartnerResponseDTOSchema, alsoNotify: HouseBlDocumentBusinessPartnerResponseDTOSchema, precarriageBy: HouseBlDocumentBusinessPartnerResponseDTOSchema.nullish(), precarriageByText: z.string().nullish(), placeOfReceipt: HouseBlDocumentPlaceResponseDTOSchema.nullish(), placeOfReceiptText: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), declaredValue: z.string().nullish(), rateOfExchange: z.number().nullish(), currency: z.string().nullish(), freightPayable: z.string().nullish(), issuer: z.string().nullish(), portOfLoading: HouseBlDocumentPortResponseDTOSchema.nullish(), portOfLoadingText: z.string().nullish(), loadingPierTerminal: HouseBlDocumentTerminalResponseDTOSchema.nullish(), loadingPierTerminalText: z.string().nullish(), portOfDischarge: HouseBlDocumentPortResponseDTOSchema.nullish(), portOfDischargeText: z.string().nullish(), placeOfDelivery: HouseBlDocumentPlaceResponseDTOSchema.nullish(), placeOfDeliveryText: z.string().nullish(), originalsToBeReleasedAt: HouseBlDocumentPlaceResponseDTOSchema.nullish(), originalsToBeReleasedAtText: z.string().nullish(), typeOfMove: z.string().nullish(), placeOfIssue: z.string().nullish(), data: CommonModels.TemplatedDocumentDataDtoSchema.nullish(), settings: HouseBlDocumentSettingsDtoDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), config: CommonModels.HBLDocumentConfigDtoSchema });
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
export const UpdateHouseBlDocumentSettingsRequestDTOSchema = z.object({ quantityOfOriginals: CommonModels.QuantityOfOriginalBlDocumentsEnumSchema.nullable(), quantityOfCopies: z.number().nullable(), blNumber: z.string().nullable(), exportReference: z.string().nullable(), location: z.string().nullable(), signer: z.string().nullable(), hideSignature: z.boolean().nullable(), capsLock: z.boolean().nullable(), date: z.iso.datetime({ offset: true }).nullable(), documentTitle: z.string().nullable() }).partial();
export type UpdateHouseBlDocumentSettingsRequestDTO = z.infer<typeof UpdateHouseBlDocumentSettingsRequestDTOSchema>;

/** 
 * UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateHouseBlDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema>;

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
export const UpdateHouseBlDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), blNumber: z.string().nullable(), carrierBookingNumber: z.string().nullable(), exportReference: z.string().nullable(), forwarder: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), originCountryId: z.string().nullable(), useLatterOfCredit: z.boolean().nullable(), declaredValue: z.string().nullable(), rateOfExchange: z.number().nullable(), freightPayable: z.string().nullable(), issuer: z.string().nullable(), placeOfIssue: z.string().nullable(), additionalText: CommonModels.EditorContentUpdateDtoSchema.nullable(), additionalTextTop: CommonModels.EditorContentUpdateDtoSchema.nullable(), consignee: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), notify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), cargoReleaseBy: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), alsoNotify: UpdateHouseBlDocumentBusinessPartnerRequestDTOSchema.nullable(), precarriageById: z.string().nullable(), precarriageByText: z.string().nullable(), placeOfReceiptId: z.string().nullable(), placeOfReceiptText: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), portOfLoadingId: z.string().nullable(), portOfLoadingText: z.string().nullable(), loadingPierTerminalId: z.string().nullable(), loadingPierTerminalText: z.string().nullable(), portOfDischargeId: z.string().nullable(), portOfDischargeText: z.string().nullable(), placeOfDeliveryId: z.string().nullable(), placeOfDeliveryText: z.string().nullable(), originalsToBeReleasedAtId: z.string().nullable(), originalsToBeReleasedAtText: z.string().nullable(), typeOfMove: z.string().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), settings: UpdateHouseBlDocumentSettingsRequestDTOSchema.nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateHouseBlDocumentRequestDTO = z.infer<typeof UpdateHouseBlDocumentRequestDTOSchema>;

}
