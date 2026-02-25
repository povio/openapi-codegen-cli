import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseAwbModels {
/** 
 * HouseAwbDocumentOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 * @property { string } name Name 
 */
export const HouseAwbDocumentOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().describe("Charge type ID").nullish(), sellRate: z.number().describe("Sell rate"), name: z.string().describe("Name").nullish() }).readonly();
export type HouseAwbDocumentOtherChargeDTO = z.infer<typeof HouseAwbDocumentOtherChargeDTOSchema>;

/** 
 * HouseAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { number } totalOtherCharges Total other charges 
 * @property { number } total Total 
 * @property { HouseAwbDocumentOtherChargeDTO[] } otherCharges Other charges 
 */
export const HouseAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number().describe("Weight charge"), totalOtherCharges: z.number().describe("Total other charges"), total: z.number().describe("Total"), otherCharges: z.array(HouseAwbDocumentOtherChargeDTOSchema).readonly().describe("Other charges") }).readonly();
export type HouseAwbDocumentChargesDTO = z.infer<typeof HouseAwbDocumentChargesDTOSchema>;

/** 
 * HouseAwbDocumentCargoDTOSchema 
 * @type { object }
 * @property { number } quantity Quantity 
 * @property { number } grossWeight Gross weight 
 * @property { string } rateClass Rate class 
 * @property { string } commodityItemNo Commodity item number 
 * @property { number } rateOrCharge Rate or charge 
 * @property { number } total Total 
 * @property { string } description Description 
 */
export const HouseAwbDocumentCargoDTOSchema = z.object({ quantity: z.number().describe("Quantity"), grossWeight: z.number().describe("Gross weight").nullish(), rateClass: z.string().describe("Rate class").nullish(), commodityItemNo: z.string().describe("Commodity item number").nullish(), rateOrCharge: z.number().describe("Rate or charge").nullish(), total: z.number().describe("Total").nullish(), description: z.string().describe("Description").nullish() }).readonly();
export type HouseAwbDocumentCargoDTO = z.infer<typeof HouseAwbDocumentCargoDTOSchema>;

/** 
 * HouseAwbDocumentRouteDTOSchema 
 * @type { object }
 * @property { string } airportOfDeparture Airport of departure 
 * @property { string } airportOfDestination Airport of destination 
 * @property { string } toAirport1 To airport 1 
 * @property { string } byCarrier1 By carrier 1 
 * @property { string } toAirport2 To airport 2 
 * @property { string } byCarrier2 By carrier 2 
 * @property { string } toAirport3 To airport 3 
 * @property { string } byCarrier3 By carrier 3 
 * @property { string } flightNumber1 Flight number 1 
 * @property { string } flightDay1 Flight day 1 
 * @property { string } flightNumber2 Flight number 2 
 * @property { string } flightDay2 Flight day 2 
 */
export const HouseAwbDocumentRouteDTOSchema = z.object({ airportOfDeparture: z.string().describe("Airport of departure"), airportOfDestination: z.string().describe("Airport of destination"), toAirport1: z.string().describe("To airport 1").nullish(), byCarrier1: z.string().describe("By carrier 1").nullish(), toAirport2: z.string().describe("To airport 2").nullish(), byCarrier2: z.string().describe("By carrier 2").nullish(), toAirport3: z.string().describe("To airport 3").nullish(), byCarrier3: z.string().describe("By carrier 3").nullish(), flightNumber1: z.string().describe("Flight number 1").nullish(), flightDay1: z.string().describe("Flight day 1").nullish(), flightNumber2: z.string().describe("Flight number 2").nullish(), flightDay2: z.string().describe("Flight day 2").nullish() }).readonly();
export type HouseAwbDocumentRouteDTO = z.infer<typeof HouseAwbDocumentRouteDTOSchema>;

/** 
 * HouseAwbDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const HouseAwbDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().describe("ID of the business partner"), name: z.string().describe("Name of the business partner"), address: z.string().describe("Address of the business partner") }).readonly();
export type HouseAwbDocumentBusinessPartnerResponseDTO = z.infer<typeof HouseAwbDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * HouseAwbDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the House AWB document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the House AWB document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } currency Currency 
 * @property { number } versionNumber Version number of the document 
 * @property { string } hawbNumber HAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { number } exchangeRate Exchange rate 
 * @property { CommonModels.EditorContentResponseDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { HouseAwbDocumentCargoDTO[] } cargo Cargo packages 
 * @property { HouseAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } signingLocation Signing location 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { HouseAwbDocumentRouteDTO } route Route 
 * @property { HouseAwbDocumentBusinessPartnerResponseDTO } issuer Issuer 
 * @property { HouseAwbDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { HouseAwbDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { CommonModels.DocumentConfigDTO } config Config 
 */
export const HouseAwbDocumentResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the House AWB document"), positionId: z.string().describe("Unique identifier of the position this document belongs to"), positionNumber: z.string().describe("Position number for reference"), name: z.string().describe("Name of the House AWB document"), nameSuffix: z.string().describe("Suffix to be added to the document name").nullish(), defaultFileName: z.string(), currency: z.string().describe("Currency").nullish(), versionNumber: z.number().describe("Version number of the document"), hawbNumber: z.string().describe("HAWB number").nullish(), sciReference: z.string().describe("SCI reference").nullish(), reference1: z.string().describe("Reference 1").nullish(), reference2: z.string().describe("Reference 2").nullish(), reference3: z.string().describe("Reference 3").nullish(), exchangeRate: z.number().describe("Exchange rate").nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.describe("Additional text for the document").nullish(), handlingInstructions: z.string().describe("Handling instructions").nullish(), accountInformation: CommonModels.AccountInformationEnumSchema.describe("Account information").nullish(), additionalAccountingNotes: z.string().describe("Additional accounting notes").nullish(), isSecured: z.boolean().describe("Is secured"), suppressContainerWeight: z.boolean().describe("Suppress container weight"), suppressCargoMeasurement: z.boolean().describe("Suppress cargo measurement"), cargo: z.array(HouseAwbDocumentCargoDTOSchema).readonly().describe("Cargo packages").nullish(), charges: HouseAwbDocumentChargesDTOSchema.describe("Charges").nullish(), shipperSigner: z.string().describe("Shipper signer").nullish(), shipperSignerUserName: z.string().describe("Shipper signer user name").nullish(), signer: z.string().describe("Signer").nullish(), signingDate: z.iso.datetime({ offset: true }).describe("Signing date").nullish(), signingLocation: z.string().describe("Signing location").nullish(), issuerIataCode: z.string().describe("Issuer IATA code").nullish(), route: HouseAwbDocumentRouteDTOSchema.describe("Route").nullish(), issuer: HouseAwbDocumentBusinessPartnerResponseDTOSchema.describe("Issuer").nullish(), consignee: HouseAwbDocumentBusinessPartnerResponseDTOSchema.describe("Consignee").nullish(), shipper: HouseAwbDocumentBusinessPartnerResponseDTOSchema.describe("Shipper").nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Created at"), updatedAt: z.iso.datetime({ offset: true }).describe("Updated at"), config: CommonModels.DocumentConfigDTOSchema.describe("Config").nullish() }).readonly();
export type HouseAwbDocumentResponseDTO = z.infer<typeof HouseAwbDocumentResponseDTOSchema>;

/** 
 * UpdateHouseAwbDocumentChargesOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 */
export const UpdateHouseAwbDocumentChargesOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().describe("Charge type ID"), sellRate: z.number().describe("Sell rate") }).readonly();
export type UpdateHouseAwbDocumentChargesOtherChargeDTO = z.infer<typeof UpdateHouseAwbDocumentChargesOtherChargeDTOSchema>;

/** 
 * UpdateHouseAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { UpdateHouseAwbDocumentChargesOtherChargeDTO[] } otherCharges Other charges 
 */
export const UpdateHouseAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number().describe("Weight charge"), otherCharges: z.array(UpdateHouseAwbDocumentChargesOtherChargeDTOSchema).readonly().describe("Other charges") }).readonly();
export type UpdateHouseAwbDocumentChargesDTO = z.infer<typeof UpdateHouseAwbDocumentChargesDTOSchema>;

/** 
 * UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().describe("Business partner ID"), address: z.string().describe("Business partner address") }).readonly();
export type UpdateHouseAwbDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateHouseAwbDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } hawbNumber HAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { number } exchangeRate Exchange rate 
 * @property { CommonModels.EditorContentUpdateDto } additionalText Additional text 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { UpdateHouseAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } issuerId Issuer ID 
 * @property { string } issuerName Issuer name 
 * @property { string } issuerAddress Issuer address 
 * @property { UpdateHouseAwbDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { UpdateHouseAwbDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateHouseAwbDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().describe("Document name suffix"), hawbNumber: z.string().describe("HAWB number"), sciReference: z.string().describe("SCI reference"), reference1: z.string().describe("Reference 1"), reference2: z.string().describe("Reference 2"), reference3: z.string().describe("Reference 3"), exchangeRate: z.number().describe("Exchange rate"), additionalText: CommonModels.EditorContentUpdateDtoSchema.describe("Additional text"), handlingInstructions: z.string().describe("Handling instructions"), accountInformation: CommonModels.AccountInformationEnumSchema.describe("Account information"), additionalAccountingNotes: z.string().describe("Additional accounting notes"), isSecured: z.boolean().describe("Is secured"), suppressContainerWeight: z.boolean().describe("Suppress container weight"), suppressCargoMeasurement: z.boolean().describe("Suppress cargo measurement"), charges: UpdateHouseAwbDocumentChargesDTOSchema.describe("Charges"), shipperSigner: z.string().describe("Shipper signer"), shipperSignerUserName: z.string().describe("Shipper signer user name"), signer: z.string().describe("Signer"), signingDate: z.iso.datetime({ offset: true }).describe("Signing date"), issuerId: z.string().describe("Issuer ID"), issuerName: z.string().describe("Issuer name"), issuerAddress: z.string().describe("Issuer address"), consignee: UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema.describe("Consignee"), shipper: UpdateHouseAwbDocumentBusinessPartnerRequestDTOSchema.describe("Shipper"), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks") }).readonly();
export type UpdateHouseAwbDocumentRequestDTO = z.infer<typeof UpdateHouseAwbDocumentRequestDTOSchema>;

}
