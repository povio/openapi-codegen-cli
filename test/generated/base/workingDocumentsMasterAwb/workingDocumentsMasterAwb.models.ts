import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsMasterAwbModels {
/** 
 * MasterAwbDocumentOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 * @property { string } name Name 
 */
export const MasterAwbDocumentOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullish(), sellRate: z.number(), name: z.string().nullish() });
export type MasterAwbDocumentOtherChargeDTO = z.infer<typeof MasterAwbDocumentOtherChargeDTOSchema>;

/** 
 * MasterAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { number } totalOtherCharges Total other charges 
 * @property { number } total Total 
 * @property { MasterAwbDocumentOtherChargeDTO[] } otherCharges Other charges 
 */
export const MasterAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number(), totalOtherCharges: z.number(), total: z.number(), otherCharges: z.array(MasterAwbDocumentOtherChargeDTOSchema) });
export type MasterAwbDocumentChargesDTO = z.infer<typeof MasterAwbDocumentChargesDTOSchema>;

/** 
 * MasterAwbDocumentCargoDTOSchema 
 * @type { object }
 * @property { number } quantity Quantity 
 * @property { number } grossWeight Gross weight 
 * @property { string } rateClass Rate class 
 * @property { string } commodityItemNo Commodity item number 
 * @property { number } rateOrCharge Rate or charge 
 * @property { number } total Total 
 * @property { string } description Description 
 */
export const MasterAwbDocumentCargoDTOSchema = z.object({ quantity: z.number(), grossWeight: z.number().nullish(), rateClass: z.string().nullish(), commodityItemNo: z.string().nullish(), rateOrCharge: z.number().nullish(), total: z.number().nullish(), description: z.string().nullish() });
export type MasterAwbDocumentCargoDTO = z.infer<typeof MasterAwbDocumentCargoDTOSchema>;

/** 
 * MasterAwbDocumentRouteDTOSchema 
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
export const MasterAwbDocumentRouteDTOSchema = z.object({ airportOfDeparture: z.string(), airportOfDestination: z.string(), toAirport1: z.string().nullish(), byCarrier1: z.string().nullish(), toAirport2: z.string().nullish(), byCarrier2: z.string().nullish(), toAirport3: z.string().nullish(), byCarrier3: z.string().nullish(), flightNumber1: z.string().nullish(), flightDay1: z.string().nullish(), flightNumber2: z.string().nullish(), flightDay2: z.string().nullish() });
export type MasterAwbDocumentRouteDTO = z.infer<typeof MasterAwbDocumentRouteDTOSchema>;

/** 
 * MasterAwbDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 */
export const MasterAwbDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type MasterAwbDocumentBusinessPartnerResponseDTO = z.infer<typeof MasterAwbDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * MasterAwbDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the Master AWB document 
 * @property { string } positionId Unique identifier of the position this document belongs to 
 * @property { string } positionNumber Position number for reference 
 * @property { string } name Name of the Master AWB document 
 * @property { string } nameSuffix Suffix to be added to the document name 
 * @property { string } defaultFileName  
 * @property { string } currency Currency 
 * @property { number } versionNumber Version number of the document 
 * @property { string } mawbNumber MAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { CommonModels.EditorContentResponseDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { MasterAwbDocumentCargoDTO[] } cargo Cargo packages 
 * @property { MasterAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } signingLocation Signing location 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { number } exchangeRate Exchange rate 
 * @property { MasterAwbDocumentRouteDTO } route Route 
 * @property { MasterAwbDocumentBusinessPartnerResponseDTO } consignee Consignee 
 * @property { MasterAwbDocumentBusinessPartnerResponseDTO } shipper Shipper 
 * @property { MasterAwbDocumentBusinessPartnerResponseDTO } issuer Issuer 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { CommonModels.DocumentConfigDTO } config Config 
 */
export const MasterAwbDocumentResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), currency: z.string().nullish(), versionNumber: z.number(), mawbNumber: z.string().nullish(), sciReference: z.string().nullish(), reference1: z.string().nullish(), reference2: z.string().nullish(), reference3: z.string().nullish(), additionalText: CommonModels.EditorContentResponseDtoSchema.nullish(), handlingInstructions: z.string().nullish(), accountInformation: CommonModels.AccountInformationEnumSchema.nullish(), additionalAccountingNotes: z.string().nullish(), isSecured: z.boolean(), suppressContainerWeight: z.boolean(), suppressCargoMeasurement: z.boolean(), cargo: z.array(MasterAwbDocumentCargoDTOSchema).nullish(), charges: MasterAwbDocumentChargesDTOSchema.nullish(), shipperSigner: z.string().nullish(), shipperSignerUserName: z.string().nullish(), signer: z.string().nullish(), signingDate: z.iso.datetime({ offset: true }).nullish(), signingLocation: z.string().nullish(), issuerIataCode: z.string().nullish(), exchangeRate: z.number().nullish(), route: MasterAwbDocumentRouteDTOSchema.nullish(), consignee: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), shipper: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), issuer: MasterAwbDocumentBusinessPartnerResponseDTOSchema.nullish(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), config: CommonModels.DocumentConfigDTOSchema.nullish() });
export type MasterAwbDocumentResponseDTO = z.infer<typeof MasterAwbDocumentResponseDTOSchema>;

/** 
 * UpdateMasterAwbDocumentChargesOtherChargeDTOSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { number } sellRate Sell rate 
 */
export const UpdateMasterAwbDocumentChargesOtherChargeDTOSchema = z.object({ chargeTypeId: z.string().nullable(), sellRate: z.number().nullable() }).partial();
export type UpdateMasterAwbDocumentChargesOtherChargeDTO = z.infer<typeof UpdateMasterAwbDocumentChargesOtherChargeDTOSchema>;

/** 
 * UpdateMasterAwbDocumentChargesDTOSchema 
 * @type { object }
 * @property { number } weightCharge Weight charge 
 * @property { UpdateMasterAwbDocumentChargesOtherChargeDTO[] } otherCharges Other charges 
 */
export const UpdateMasterAwbDocumentChargesDTOSchema = z.object({ weightCharge: z.number().nullable(), otherCharges: z.array(UpdateMasterAwbDocumentChargesOtherChargeDTOSchema).nullable() }).partial();
export type UpdateMasterAwbDocumentChargesDTO = z.infer<typeof UpdateMasterAwbDocumentChargesDTOSchema>;

/** 
 * UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 */
export const UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable() }).partial();
export type UpdateMasterAwbDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateMasterAwbDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Document name suffix 
 * @property { string } mawbNumber MAWB number 
 * @property { string } sciReference SCI reference 
 * @property { string } reference1 Reference 1 
 * @property { string } reference2 Reference 2 
 * @property { string } reference3 Reference 3 
 * @property { CommonModels.EditorContentUpdateDto } additionalText Additional text for the document 
 * @property { string } handlingInstructions Handling instructions 
 * @property { string } accountInformation Account information 
 * @property { string } additionalAccountingNotes Additional accounting notes 
 * @property { boolean } isSecured Is secured 
 * @property { boolean } suppressContainerWeight Suppress container weight 
 * @property { boolean } suppressCargoMeasurement Suppress cargo measurement 
 * @property { UpdateMasterAwbDocumentChargesDTO } charges Charges 
 * @property { string } shipperSigner Shipper signer 
 * @property { string } shipperSignerUserName Shipper signer user name 
 * @property { string } signer Signer 
 * @property { string } signingDate Signing date 
 * @property { string } issuerId Issuer ID 
 * @property { string } issuerName Issuer name 
 * @property { string } issuerAddress Issuer address 
 * @property { string } issuerCity Issuer city 
 * @property { string } issuerIataCode Issuer IATA code 
 * @property { UpdateMasterAwbDocumentBusinessPartnerRequestDTO } consignee Consignee 
 * @property { UpdateMasterAwbDocumentBusinessPartnerRequestDTO } shipper Shipper 
 * @property { number } exchangeRate Exchange rate 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateMasterAwbDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), mawbNumber: z.string().nullable(), sciReference: z.string().nullable(), reference1: z.string().nullable(), reference2: z.string().nullable(), reference3: z.string().nullable(), additionalText: CommonModels.EditorContentUpdateDtoSchema.nullable(), handlingInstructions: z.string().nullable(), accountInformation: CommonModels.AccountInformationEnumSchema.nullable(), additionalAccountingNotes: z.string().nullable(), isSecured: z.boolean().nullable(), suppressContainerWeight: z.boolean().nullable(), suppressCargoMeasurement: z.boolean().nullable(), charges: UpdateMasterAwbDocumentChargesDTOSchema.nullable(), shipperSigner: z.string().nullable(), shipperSignerUserName: z.string().nullable(), signer: z.string().nullable(), signingDate: z.iso.datetime({ offset: true }).nullable(), issuerId: z.string().nullable(), issuerName: z.string().nullable(), issuerAddress: z.string().nullable(), issuerCity: z.string().nullable(), issuerIataCode: z.string().nullable(), consignee: UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), shipper: UpdateMasterAwbDocumentBusinessPartnerRequestDTOSchema.nullable(), exchangeRate: z.number().nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateMasterAwbDocumentRequestDTO = z.infer<typeof UpdateMasterAwbDocumentRequestDTOSchema>;

}
