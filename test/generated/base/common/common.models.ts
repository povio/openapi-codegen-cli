import { z } from "zod";

export namespace CommonModels {
/** 
 * PositionCargoPackageEnumSchema 
 * @type { enum }
 */
export const PositionCargoPackageEnumSchema = z.enum(["Hazardous", "NonStackable", "TemperatureControlled", "OversizedCargo", "DiplomaticCargo"]);
export type PositionCargoPackageEnum = z.infer<typeof PositionCargoPackageEnumSchema>;
export const PositionCargoPackageEnum = PositionCargoPackageEnumSchema.enum;

/** 
 * HazardousSpecialtyEnumSchema 
 * @type { enum }
 */
export const HazardousSpecialtyEnumSchema = z.enum(["Explosives", "FlammableGas", "NonToxicAndFlammableGas", "PoisonGases", "FlammableLiquid", "FlammableSolid", "SpontaneouslyCombustible", "DangerousWhenWet", "Oxidizers", "OrganicPeroxides", "Poison", "InfectiousSubstances", "Radioactive", "Corrosive", "MiscellaneousDangerousSubstances"]);
export type HazardousSpecialtyEnum = z.infer<typeof HazardousSpecialtyEnumSchema>;
export const HazardousSpecialtyEnum = HazardousSpecialtyEnumSchema.enum;

/** 
 * RateOptionsEnumSchema 
 * @type { enum }
 */
export const RateOptionsEnumSchema = z.enum(["AsAgreed", "SpotRate"]);
export type RateOptionsEnum = z.infer<typeof RateOptionsEnumSchema>;
export const RateOptionsEnum = RateOptionsEnumSchema.enum;

/** 
 * RateClassEnumSchema 
 * @type { enum }
 */
export const RateClassEnumSchema = z.enum(["MinimumCharge", "NormalRate", "QuantityRate"]);
export type RateClassEnum = z.infer<typeof RateClassEnumSchema>;
export const RateClassEnum = RateClassEnumSchema.enum;

/** 
 * AccountInformationEnumSchema 
 * @type { enum }
 * @description Account information
 */
export const AccountInformationEnumSchema = z.enum(["FreightCollect", "FreightPrepaid"]);
export type AccountInformationEnum = z.infer<typeof AccountInformationEnumSchema>;
export const AccountInformationEnum = AccountInformationEnumSchema.enum;

/** 
 * LanguageEnumSchema 
 * @type { enum }
 */
export const LanguageEnumSchema = z.enum(["English", "German", "Hungarian", "Czech", "Turkish", "Slovenian"]);
export type LanguageEnum = z.infer<typeof LanguageEnumSchema>;
export const LanguageEnum = LanguageEnumSchema.enum;

/** 
 * LocaleEnumSchema 
 * @type { enum }
 */
export const LocaleEnumSchema = z.enum(["en-US", "de-DE", "cs-CZ", "sl-SI", "tr-TR", "hu-HU"]);
export type LocaleEnum = z.infer<typeof LocaleEnumSchema>;
export const LocaleEnum = LocaleEnumSchema.enum;

/** 
 * OfficePaymentTermsDateTypeSchema 
 * @type { enum }
 */
export const OfficePaymentTermsDateTypeSchema = z.enum(["InvoiceDate", "ServiceDate"]);
export type OfficePaymentTermsDateType = z.infer<typeof OfficePaymentTermsDateTypeSchema>;
export const OfficePaymentTermsDateType = OfficePaymentTermsDateTypeSchema.enum;

/** 
 * FolderEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const FolderEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type FolderEmployeeDTO = z.infer<typeof FolderEmployeeDTOSchema>;


/** 
 * FileResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } archived  
 * @property { boolean } isSystem  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { FolderEmployeeDTO } createdBy  
 * @property { FolderEmployeeDTO } updatedBy  
 * @property { string } downloadUrl  
 */
export const FileResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), isSystem: z.boolean(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: CommonModels.FolderEmployeeDTOSchema, updatedBy: CommonModels.FolderEmployeeDTOSchema, downloadUrl: z.string().nullish() }).readonly();
export type FileResponseDTO = z.infer<typeof FileResponseDTOSchema>;


/** 
 * EditorContentUpdateDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const EditorContentUpdateDtoSchema = z.object({ html: z.string(), json: z.object({}).catchall(z.any()).readonly() }).readonly();
export type EditorContentUpdateDto = z.infer<typeof EditorContentUpdateDtoSchema>;


/** 
 * RemarkBlockDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 */
export const RemarkBlockDTOSchema = z.object({ id: z.string(), enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document"), content: CommonModels.EditorContentUpdateDtoSchema }).readonly();
export type RemarkBlockDTO = z.infer<typeof RemarkBlockDTOSchema>;


/** 
 * TitleBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { string } defaultTitle  
 * @property { boolean } includePositionNumber  
 * @property { boolean } allowManualOverride  
 */
export const TitleBlockDTOSchema = z.object({ enabled: z.boolean(), defaultTitle: z.string(), includePositionNumber: z.boolean(), allowManualOverride: z.boolean() }).readonly();
export type TitleBlockDTO = z.infer<typeof TitleBlockDTOSchema>;


/** 
 * PositionInvolvedPartyTypeEnumSchema 
 * @type { enum }
 */
export const PositionInvolvedPartyTypeEnumSchema = z.enum(["Customer", "Notify", "AlsoNotify", "FOBForwarder", "RoutingAgent", "DeliveryAgent", "TransportProvider", "OceanCarrier", "OriginServiceProvider", "DestinationServiceProvider", "InsuranceProvider", "OriginCustomsAgent", "DestinationCustomsAgent", "StuffingProvider", "StrippingProvider", "Shipper", "Consignee", "CustomsBroker", "Courier", "Trucker", "Airline", "DestinationAgent", "OriginAgent"]);
export type PositionInvolvedPartyTypeEnum = z.infer<typeof PositionInvolvedPartyTypeEnumSchema>;
export const PositionInvolvedPartyTypeEnum = PositionInvolvedPartyTypeEnumSchema.enum;

/** 
 * ReceiverBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { string } defaultRole  
 */
export const ReceiverBlockDTOSchema = z.object({ enabled: z.boolean(), defaultRole: CommonModels.PositionInvolvedPartyTypeEnumSchema }).readonly();
export type ReceiverBlockDTO = z.infer<typeof ReceiverBlockDTOSchema>;


/** 
 * OurInformationBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } showName  
 * @property { boolean } showPhone  
 * @property { boolean } showDate  
 * @property { boolean } showBookingNumber  
 * @property { boolean } showCustomerReference  
 * @property { boolean } showMasterBillOfLadingNumber  
 * @property { boolean } showHouseBillOfLadingNumber  
 */
export const OurInformationBlockDTOSchema = z.object({ enabled: z.boolean(), showName: z.boolean(), showPhone: z.boolean(), showDate: z.boolean(), showBookingNumber: z.boolean(), showCustomerReference: z.boolean(), showMasterBillOfLadingNumber: z.boolean(), showHouseBillOfLadingNumber: z.boolean() }).readonly();
export type OurInformationBlockDTO = z.infer<typeof OurInformationBlockDTOSchema>;


/** 
 * RouteTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } showDate  
 * @property { boolean } showLocation  
 * @property { boolean } showType  
 * @property { boolean } showReference  
 * @property { boolean } showVesselVoyage  
 * @property { boolean } showAddress  
 * @property { boolean } showProvider  
 */
export const RouteTableBlockDTOSchema = z.object({ enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document"), showDate: z.boolean(), showLocation: z.boolean(), showType: z.boolean(), showReference: z.boolean(), showVesselVoyage: z.boolean(), showAddress: z.boolean(), showProvider: z.boolean() }).readonly();
export type RouteTableBlockDTO = z.infer<typeof RouteTableBlockDTOSchema>;


/** 
 * CargoTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoTableBlockDTOSchema = z.object({ enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document") }).readonly();
export type CargoTableBlockDTO = z.infer<typeof CargoTableBlockDTOSchema>;


/** 
 * CargoSummaryBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoSummaryBlockDTOSchema = z.object({ enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document") }).readonly();
export type CargoSummaryBlockDTO = z.infer<typeof CargoSummaryBlockDTOSchema>;


/** 
 * FinanceTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } showOnlyForReceiver  
 * @property { boolean } showVendor  
 * @property { boolean } showBuyRate  
 * @property { boolean } showCustomer  
 * @property { boolean } showSellRate  
 * @property { boolean } showGrid  
 * @property { boolean } showCharges  
 * @property { boolean } showAdditionalText  
 * @property { boolean } showQuantity  
 * @property { boolean } showProfit  
 * @property { boolean } showTotalsByCurrency  
 * @property { boolean } includeSubPositions  
 * @property { boolean } subPositionTotals  
 * @property { boolean } showBuyRateExchangeRates  
 * @property { boolean } showSellRateExchangeRates  
 * @property { boolean } showTotal  
 */
export const FinanceTableBlockDTOSchema = z.object({ enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document"), showOnlyForReceiver: z.boolean(), showVendor: z.boolean(), showBuyRate: z.boolean(), showCustomer: z.boolean(), showSellRate: z.boolean(), showGrid: z.boolean(), showCharges: z.boolean(), showAdditionalText: z.boolean(), showQuantity: z.boolean(), showProfit: z.boolean(), showTotalsByCurrency: z.boolean(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean(), showSellRateExchangeRates: z.boolean(), showTotal: z.boolean() }).readonly();
export type FinanceTableBlockDTO = z.infer<typeof FinanceTableBlockDTOSchema>;


/** 
 * FooterBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const FooterBlockDTOSchema = z.object({ enabled: z.boolean() }).readonly();
export type FooterBlockDTO = z.infer<typeof FooterBlockDTOSchema>;


/** 
 * TermsBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const TermsBlockDTOSchema = z.object({ enabled: z.boolean() }).readonly();
export type TermsBlockDTO = z.infer<typeof TermsBlockDTOSchema>;


/** 
 * CutOffDatesBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { boolean } billOfLadingFromCustomer  
 * @property { boolean } billOfLadingToCarrier  
 * @property { boolean } customsAMS  
 * @property { boolean } vgmCustomer  
 */
export const CutOffDatesBlockDTOSchema = z.object({ enabled: z.boolean(), position: z.number().gte(1).describe("1-based order in the rendered document"), billOfLadingFromCustomer: z.boolean(), billOfLadingToCarrier: z.boolean(), customsAMS: z.boolean(), vgmCustomer: z.boolean() }).readonly();
export type CutOffDatesBlockDTO = z.infer<typeof CutOffDatesBlockDTOSchema>;


/** 
 * TemplateBlocksResponseDTOSchema 
 * @type { object }
 * @property { TitleBlockDTO } titleBlock  
 * @property { ReceiverBlockDTO } receiverBlock  
 * @property { OurInformationBlockDTO } ourInformationBlock  
 * @property { RouteTableBlockDTO } routeTableBlock  
 * @property { CargoTableBlockDTO } cargoTableBlock  
 * @property { CargoSummaryBlockDTO } cargoSummaryBlock  
 * @property { FinanceTableBlockDTO } financeTableBlock  
 * @property { RemarkBlockDTO[] } remarkBlocks  
 * @property { FooterBlockDTO } footerBlock  
 * @property { TermsBlockDTO } termsBlock  
 * @property { CutOffDatesBlockDTO } cutOffDatesBlock  
 */
export const TemplateBlocksResponseDTOSchema = z.object({ titleBlock: CommonModels.TitleBlockDTOSchema, receiverBlock: CommonModels.ReceiverBlockDTOSchema, ourInformationBlock: CommonModels.OurInformationBlockDTOSchema, routeTableBlock: CommonModels.RouteTableBlockDTOSchema, cargoTableBlock: CommonModels.CargoTableBlockDTOSchema, cargoSummaryBlock: CommonModels.CargoSummaryBlockDTOSchema, financeTableBlock: CommonModels.FinanceTableBlockDTOSchema, remarkBlocks: z.array(CommonModels.RemarkBlockDTOSchema).readonly(), footerBlock: CommonModels.FooterBlockDTOSchema, termsBlock: CommonModels.TermsBlockDTOSchema, cutOffDatesBlock: CommonModels.CutOffDatesBlockDTOSchema }).readonly();
export type TemplateBlocksResponseDTO = z.infer<typeof TemplateBlocksResponseDTOSchema>;


/** 
 * RouteTableProviderDtoSchema 
 * @type { object }
 * @property { string } id Provider ID 
 * @property { string } name Provider name 
 */
export const RouteTableProviderDtoSchema = z.object({ id: z.string().describe("Provider ID"), name: z.string().describe("Provider name") }).readonly();
export type RouteTableProviderDto = z.infer<typeof RouteTableProviderDtoSchema>;


/** 
 * RouteTablePointDtoSchema 
 * @type { object }
 * @property { string } id Route point ID 
 * @property { string } type Route point type 
 * @property { string } datetime Route point datetime 
 * @property { string } secondaryDatetime Route point secondary datetime 
 * @property { string } address Route point address 
 * @property { string } name Route point address name 
 * @property { string } reference Route point reference 
 * @property { RouteTableProviderDto } provider Route point provider 
 * @property { string } vessel Vessel information 
 * @property { string } voyage Voyage information 
 * @property { string } carrier Carrier name 
 */
export const RouteTablePointDtoSchema = z.object({ id: z.string().describe("Route point ID"), type: z.string().describe("Route point type"), datetime: z.string().describe("Route point datetime").nullish(), secondaryDatetime: z.string().describe("Route point secondary datetime").nullish(), address: z.string().describe("Route point address").nullish(), name: z.string().describe("Route point address name").nullish(), reference: z.string().describe("Route point reference").nullish(), provider: CommonModels.RouteTableProviderDtoSchema.describe("Route point provider").nullish(), vessel: z.string().describe("Vessel information").nullish(), voyage: z.string().describe("Voyage information").nullish(), carrier: z.string().describe("Carrier name").nullish() }).readonly();
export type RouteTablePointDto = z.infer<typeof RouteTablePointDtoSchema>;


/** 
 * RouteTableBlockResponseDtoSchema 
 * @type { object }
 * @property { string } selectedRouteId Selected route ID 
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { boolean } showReference Show reference column 
 * @property { boolean } showVesselVoyage Show vessel/voyage column 
 * @property { boolean } showProvider Show provider column 
 * @property { RouteTablePointDto[] } points Route points 
 * @property { boolean } showAddress Show address 
 * @property { boolean } showDates Show dates 
 * @property { boolean } showType Show type 
 * @property { boolean } showLocation Show location 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } suppressRoute Suppress route 
 */
export const RouteTableBlockResponseDtoSchema = z.object({ selectedRouteId: z.string().describe("Selected route ID").nullish(), selectedRoutePointIds: z.array(z.string()).readonly().describe("Selected route point IDs"), showReference: z.boolean().describe("Show reference column"), showVesselVoyage: z.boolean().describe("Show vessel/voyage column"), showProvider: z.boolean().describe("Show provider column"), points: z.array(CommonModels.RouteTablePointDtoSchema).readonly().describe("Route points").nullish(), showAddress: z.boolean().describe("Show address").nullish(), showDates: z.boolean().describe("Show dates"), showType: z.boolean().describe("Show type"), showLocation: z.boolean().describe("Show location"), showGrid: z.boolean().describe("Show grid"), suppressRoute: z.boolean().describe("Suppress route") }).readonly();
export type RouteTableBlockResponseDto = z.infer<typeof RouteTableBlockResponseDtoSchema>;


/** 
 * CargoSpecialtyDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { string } unNumber UN number for hazardous specialty 
 * @property { string } IMOClass IMO class for hazardous specialty 
 * @property { number } temperatureFrom Temperature from (°C) for temperature-controlled specialty 
 * @property { number } temperatureUntil Temperature until (°C) for temperature-controlled specialty 
 */
export const CargoSpecialtyDtoSchema = z.object({ name: CommonModels.PositionCargoPackageEnumSchema, unNumber: z.string().describe("UN number for hazardous specialty").nullish(), IMOClass: z.string().describe("IMO class for hazardous specialty").nullish(), temperatureFrom: z.number().describe("Temperature from (°C) for temperature-controlled specialty").nullish(), temperatureUntil: z.number().describe("Temperature until (°C) for temperature-controlled specialty").nullish() }).readonly();
export type CargoSpecialtyDto = z.infer<typeof CargoSpecialtyDtoSchema>;


/** 
 * CargoPackageDtoSchema 
 * @type { object }
 * @property { string } id Package ID 
 * @property { string } description Package description 
 * @property { string } weight Weight 
 * @property { string } hsCodes HS codes (numeric only) 
 * @property { number } quantity Quantity 
 * @property { number } width Width (cm) 
 * @property { number } length Length (cm) 
 * @property { number } height Height (cm) 
 * @property { number } volume Total volume in m3 for this package group 
 * @property { string } packageType Package type name 
 * @property { string } caseMarks Case marks 
 * @property { CargoSpecialtyDto[] } specialties Package specialties 
 * @property { number } chargeableWeight Chargeable weight in kg 
 * @property { number } volumetricWeight Volumetric weight in kg 
 */
export const CargoPackageDtoSchema = z.object({ id: z.string().describe("Package ID"), description: z.string().describe("Package description").nullish(), weight: z.string().describe("Weight").nullish(), hsCodes: z.string().describe("HS codes (numeric only)").nullish(), quantity: z.number().describe("Quantity").nullish(), width: z.number().describe("Width (cm)").nullish(), length: z.number().describe("Length (cm)").nullish(), height: z.number().describe("Height (cm)").nullish(), volume: z.number().describe("Total volume in m3 for this package group").nullish(), packageType: z.string().describe("Package type name").nullish(), caseMarks: z.string().describe("Case marks").nullish(), specialties: z.array(CommonModels.CargoSpecialtyDtoSchema).readonly().describe("Package specialties").nullish(), chargeableWeight: z.number().describe("Chargeable weight in kg").nullish(), volumetricWeight: z.number().describe("Volumetric weight in kg").nullish() }).readonly();
export type CargoPackageDto = z.infer<typeof CargoPackageDtoSchema>;


/** 
 * CargoItemRouteDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { RouteTablePointDto[] } points Route points 
 */
export const CargoItemRouteDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()).readonly().describe("Selected route point IDs"), points: z.array(CommonModels.RouteTablePointDtoSchema).readonly().describe("Route points").nullish() }).readonly();
export type CargoItemRouteDto = z.infer<typeof CargoItemRouteDtoSchema>;


/** 
 * CargoItemDtoSchema 
 * @type { object }
 * @property { string } cargoId Cargo ID 
 * @property { string } cargoType Cargo type 
 * @property { string } containerNumber Container number 
 * @property { string } seal1 First seal (sea cargo only) 
 * @property { string } seal2 Second seal (sea cargo only) 
 * @property { string } vgm Verified gross mass (VGM) for container, sea cargo only 
 * @property { number } totalGrossWeight Total gross weight from cargo details 
 * @property { number } totalVolume Total volume (m3) calculated from cargo packages 
 * @property { number } chargeableWeight Chargeable weight in kg for transport unit 
 * @property { number } volumetricWeight Volumetric weight in kg for transport unit 
 * @property { CargoPackageDto[] } packages Cargo packages 
 * @property { string[] } selectedPackageIds Selected cargo package IDs 
 * @property { CargoItemRouteDto } route Cargo route (when routes are split) 
 */
export const CargoItemDtoSchema = z.object({ cargoId: z.string().describe("Cargo ID"), cargoType: z.string().describe("Cargo type"), containerNumber: z.string().describe("Container number").nullish(), seal1: z.string().describe("First seal (sea cargo only)").nullish(), seal2: z.string().describe("Second seal (sea cargo only)").nullish(), vgm: z.string().describe("Verified gross mass (VGM) for container, sea cargo only").nullish(), totalGrossWeight: z.number().describe("Total gross weight from cargo details").nullish(), totalVolume: z.number().describe("Total volume (m3) calculated from cargo packages").nullish(), chargeableWeight: z.number().describe("Chargeable weight in kg for transport unit").nullish(), volumetricWeight: z.number().describe("Volumetric weight in kg for transport unit").nullish(), packages: z.array(CommonModels.CargoPackageDtoSchema).readonly().describe("Cargo packages"), selectedPackageIds: z.array(z.string()).readonly().describe("Selected cargo package IDs"), route: CommonModels.CargoItemRouteDtoSchema.describe("Cargo route (when routes are split)").nullish() }).readonly();
export type CargoItemDto = z.infer<typeof CargoItemDtoSchema>;


/** 
 * CargoTableBlockDtoSchema 
 * @type { object }
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { boolean } suppressWeight Suppress weight column display 
 * @property { boolean } showGrid Show grid borders in cargo table 
 * @property { boolean } suppressVolume Suppress volume column display 
 * @property { boolean } suppressSpecialities Suppress specialities column display 
 * @property { boolean } suppressDimensions Suppress dimensions column display 
 * @property { boolean } suppressPackageVolume Suppress package volume column display 
 * @property { boolean } suppressPackageWeight Suppress package weight column display 
 * @property { boolean } showGrandTotal Show grand total 
 * @property { boolean } showTransportUnitTotal Show transport unit total 
 * @property { boolean } showRoute Show route information (only applicable when routes are split) 
 * @property { boolean } suppressCargo Suppress cargo table display 
 * @property { boolean } showTransportUnitChargeableWeight Show chargeable weight for transport units 
 * @property { boolean } showTransportUnitVolumetricWeight Show volumetric weight for transport units 
 * @property { boolean } showPackageChargeableWeight Show chargeable weight for packages 
 * @property { boolean } showPackageVolumetricWeight Show volumetric weight for packages 
 * @property { boolean } showPackageHSCodes Show HS codes for packages 
 * @property { boolean } showPackageType Show package type for packages 
 * @property { boolean } showPackageQuantity Show quantity for packages 
 * @property { boolean } showPackageDescription Show description for packages 
 * @property { boolean } showPackageCaseMarks Show case marks for packages 
 * @property { boolean } showTransportUnitNumber Show transport unit number 
 * @property { boolean } showTransportUnitType Show transport unit type 
 * @property { boolean } showTransportUnitSeal1 Show transport unit seal 1 
 * @property { boolean } showTransportUnitSeal2 Show transport unit seal 2 
 * @property { CargoItemDto[] } items Cargo items 
 */
export const CargoTableBlockDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).readonly().describe("Selected cargo IDs").nullish(), suppressWeight: z.boolean().describe("Suppress weight column display").nullish(), showGrid: z.boolean().describe("Show grid borders in cargo table").nullish(), suppressVolume: z.boolean().describe("Suppress volume column display").nullish(), suppressSpecialities: z.boolean().describe("Suppress specialities column display").nullish(), suppressDimensions: z.boolean().describe("Suppress dimensions column display").nullish(), suppressPackageVolume: z.boolean().describe("Suppress package volume column display").nullish(), suppressPackageWeight: z.boolean().describe("Suppress package weight column display").nullish(), showGrandTotal: z.boolean().describe("Show grand total").nullish(), showTransportUnitTotal: z.boolean().describe("Show transport unit total").nullish(), showRoute: z.boolean().describe("Show route information (only applicable when routes are split)").nullish(), suppressCargo: z.boolean().describe("Suppress cargo table display").nullish(), showTransportUnitChargeableWeight: z.boolean().describe("Show chargeable weight for transport units").nullish(), showTransportUnitVolumetricWeight: z.boolean().describe("Show volumetric weight for transport units").nullish(), showPackageChargeableWeight: z.boolean().describe("Show chargeable weight for packages").nullish(), showPackageVolumetricWeight: z.boolean().describe("Show volumetric weight for packages").nullish(), showPackageHSCodes: z.boolean().describe("Show HS codes for packages").nullish(), showPackageType: z.boolean().describe("Show package type for packages").nullish(), showPackageQuantity: z.boolean().describe("Show quantity for packages").nullish(), showPackageDescription: z.boolean().describe("Show description for packages").nullish(), showPackageCaseMarks: z.boolean().describe("Show case marks for packages").nullish(), showTransportUnitNumber: z.boolean().describe("Show transport unit number").nullish(), showTransportUnitType: z.boolean().describe("Show transport unit type").nullish(), showTransportUnitSeal1: z.boolean().describe("Show transport unit seal 1").nullish(), showTransportUnitSeal2: z.boolean().describe("Show transport unit seal 2").nullish(), items: z.array(CommonModels.CargoItemDtoSchema).readonly().describe("Cargo items") }).readonly();
export type CargoTableBlockDto = z.infer<typeof CargoTableBlockDtoSchema>;


/** 
 * SummaryCargoItemDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { number } quantity Count of cargos for this type 
 * @property { string } description Comma-joined transport unit numbers or custom description 
 */
export const SummaryCargoItemDtoSchema = z.object({ transportUnitType: z.string().describe("Cargo type name (transport unit type)"), quantity: z.number().describe("Count of cargos for this type"), description: z.string().describe("Comma-joined transport unit numbers or custom description") }).readonly();
export type SummaryCargoItemDto = z.infer<typeof SummaryCargoItemDtoSchema>;


/** 
 * SummaryCargoBlockResponseDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemDto[] } items  
 */
export const SummaryCargoBlockResponseDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemDtoSchema).readonly() }).readonly();
export type SummaryCargoBlockResponseDto = z.infer<typeof SummaryCargoBlockResponseDtoSchema>;


/** 
 * PositionAccountItemTypeEnumSchema 
 * @type { enum }
 */
export const PositionAccountItemTypeEnumSchema = z.enum(["CHARGE", "TEXT", "DIVIDER"]);
export type PositionAccountItemTypeEnum = z.infer<typeof PositionAccountItemTypeEnumSchema>;
export const PositionAccountItemTypeEnum = PositionAccountItemTypeEnumSchema.enum;

/** 
 * FinanceRowDtoSchema 
 * @type { object }
 * @property { string } id Finance row ID 
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { string } chargeType Charge type 
 * @property { string } additionalText Additional text 
 * @property { string } text Text content 
 * @property { number } buyAmount Buy amount 
 * @property { string } buyCurrencyNotation Buy currency notation 
 * @property { number } sellAmount Sell amount 
 * @property { string } sellCurrencyNotation Sell currency notation 
 * @property { string } buyBPName Buy business partner name 
 * @property { string } sellBPName Sell business partner name 
 * @property { number } sellExchangeRate Sell exchange rate 
 * @property { number } buyExchangeRate Buy exchange rate 
 * @property { number } quantity Quantity 
 */
export const FinanceRowDtoSchema = z.object({ id: z.string().describe("Finance row ID"), type: CommonModels.PositionAccountItemTypeEnumSchema.describe("Item type"), chargeType: z.string().describe("Charge type").nullish(), additionalText: z.string().describe("Additional text").nullish(), text: z.string().describe("Text content").nullish(), buyAmount: z.number().describe("Buy amount").nullish(), buyCurrencyNotation: z.string().describe("Buy currency notation").nullish(), sellAmount: z.number().describe("Sell amount").nullish(), sellCurrencyNotation: z.string().describe("Sell currency notation").nullish(), buyBPName: z.string().describe("Buy business partner name").nullish(), sellBPName: z.string().describe("Sell business partner name").nullish(), sellExchangeRate: z.number().describe("Sell exchange rate").nullish(), buyExchangeRate: z.number().describe("Buy exchange rate").nullish(), quantity: z.number().describe("Quantity").nullish() }).readonly();
export type FinanceRowDto = z.infer<typeof FinanceRowDtoSchema>;


/** 
 * FinanceTotalsDtoSchema 
 * @type { object }
 * @property { number } customerTotal Customer total 
 * @property { number } vendorTotal Vendor total 
 * @property { number } combinedTotal Combined total 
 * @property { string } currencyNotation Currency notation 
 */
export const FinanceTotalsDtoSchema = z.object({ customerTotal: z.number().describe("Customer total"), vendorTotal: z.number().describe("Vendor total"), combinedTotal: z.number().describe("Combined total"), currencyNotation: z.string().describe("Currency notation") }).readonly();
export type FinanceTotalsDto = z.infer<typeof FinanceTotalsDtoSchema>;


/** 
 * FinanceTotalsByCurrencyDtoSchema 
 * @type { object }
 * @property { string } currencyNotation Currency notation 
 * @property { number } vendorTotal Total for vendor side in this currency 
 * @property { number } customerTotal Total for customer side in this currency 
 */
export const FinanceTotalsByCurrencyDtoSchema = z.object({ currencyNotation: z.string().describe("Currency notation"), vendorTotal: z.number().describe("Total for vendor side in this currency").nullish(), customerTotal: z.number().describe("Total for customer side in this currency").nullish() }).readonly();
export type FinanceTotalsByCurrencyDto = z.infer<typeof FinanceTotalsByCurrencyDtoSchema>;


/** 
 * FinanceTablePositionDtoSchema 
 * @type { object }
 * @property { FinanceRowDto[] } rows Finance rows 
 * @property { FinanceTotalsDto } totals Finance totals 
 * @property { string[] } selectedFinanceRowIds Selected finance row IDs 
 * @property { string } positionId Position ID 
 * @property { string } positionNumber Position number 
 * @property { FinanceTotalsByCurrencyDto[] } totalsByCurrency Totals grouped by currency 
 */
export const FinanceTablePositionDtoSchema = z.object({ rows: z.array(CommonModels.FinanceRowDtoSchema).readonly().describe("Finance rows"), totals: CommonModels.FinanceTotalsDtoSchema.describe("Finance totals"), selectedFinanceRowIds: z.array(z.string()).readonly().describe("Selected finance row IDs"), positionId: z.string().describe("Position ID"), positionNumber: z.string().describe("Position number"), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).readonly().describe("Totals grouped by currency") }).readonly();
export type FinanceTablePositionDto = z.infer<typeof FinanceTablePositionDtoSchema>;


/** 
 * FinanceTableBlockDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Selected business partner ID 
 * @property { boolean } showVendor Show vendor 
 * @property { boolean } showBuyRate Show buy rate 
 * @property { boolean } showCustomer Show customer 
 * @property { boolean } showSellRate Show sell rate 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } showCharges Show charges 
 * @property { boolean } showAdditionalText Show additional text 
 * @property { boolean } showQuantity Show quantity 
 * @property { boolean } showTotalsByCurrency Show totals grouped by currency 
 * @property { boolean } suppressFinances Suppress finances from output 
 * @property { boolean } suppressZeroLines Suppress rows where the amounts are zero 
 * @property { boolean } showTotal Show total from output 
 * @property { boolean } showProfit Show profit from output 
 * @property { boolean } showBuyRateExchangeRates Show buy rate exchange rates from output 
 * @property { boolean } showSellRateExchangeRates Show sell rate exchange rates from output 
 * @property { boolean } includeSubPositions Include sub-positions 
 * @property { boolean } subPositionTotals Show sub-position totals 
 * @property { FinanceTablePositionDto[] } positions Finance positions 
 * @property { FinanceTotalsDto } totals Finance totals 
 * @property { FinanceTotalsByCurrencyDto[] } totalsByCurrency Totals grouped by currency 
 */
export const FinanceTableBlockDtoSchema = z.object({ selectedBpId: z.string().describe("Selected business partner ID"), showVendor: z.boolean().describe("Show vendor"), showBuyRate: z.boolean().describe("Show buy rate"), showCustomer: z.boolean().describe("Show customer"), showSellRate: z.boolean().describe("Show sell rate"), showGrid: z.boolean().describe("Show grid"), showCharges: z.boolean().describe("Show charges"), showAdditionalText: z.boolean().describe("Show additional text"), showQuantity: z.boolean().describe("Show quantity"), showTotalsByCurrency: z.boolean().describe("Show totals grouped by currency"), suppressFinances: z.boolean().describe("Suppress finances from output"), suppressZeroLines: z.boolean().describe("Suppress rows where the amounts are zero"), showTotal: z.boolean().describe("Show total from output"), showProfit: z.boolean().describe("Show profit from output"), showBuyRateExchangeRates: z.boolean().describe("Show buy rate exchange rates from output"), showSellRateExchangeRates: z.boolean().describe("Show sell rate exchange rates from output"), includeSubPositions: z.boolean().describe("Include sub-positions").nullable(), subPositionTotals: z.boolean().describe("Show sub-position totals").nullable(), positions: z.array(CommonModels.FinanceTablePositionDtoSchema).readonly().describe("Finance positions"), totals: CommonModels.FinanceTotalsDtoSchema.describe("Finance totals"), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).readonly().describe("Totals grouped by currency") }).readonly();
export type FinanceTableBlockDto = z.infer<typeof FinanceTableBlockDtoSchema>;


/** 
 * RemarkBlockDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockDtoSchema = z.object({ id: z.string(), position: z.number().gte(1), content: CommonModels.EditorContentUpdateDtoSchema, enabled: z.boolean().nullish() }).readonly();
export type RemarkBlockDto = z.infer<typeof RemarkBlockDtoSchema>;


/** 
 * ConfigBlockDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 * @property { boolean } showWatermarkOnDocuments Show watermark on documents 
 * @property { LocaleEnum } locale  
 */
export const ConfigBlockDtoSchema = z.object({ footerImageUrl: z.string().describe("Footer image URL"), headerImageUrl: z.string().describe("Header image URL"), showWatermarkOnDocuments: z.boolean().describe("Show watermark on documents"), locale: CommonModels.LocaleEnumSchema }).readonly();
export type ConfigBlockDto = z.infer<typeof ConfigBlockDtoSchema>;


/** 
 * TitleBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } value Title value 
 */
export const TitleBlockUpdateDtoSchema = z.object({ value: z.string().describe("Title value") }).readonly();
export type TitleBlockUpdateDto = z.infer<typeof TitleBlockUpdateDtoSchema>;


/** 
 * ReceiverBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Receiver business partner ID 
 * @property { string } address Receiver address 
 */
export const ReceiverBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().describe("Receiver business partner ID"), address: z.string().describe("Receiver address") }).readonly();
export type ReceiverBlockUpdateDto = z.infer<typeof ReceiverBlockUpdateDtoSchema>;


/** 
 * OurInformationBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } name Name 
 * @property { string } phone Phone number 
 * @property { string } date Date 
 * @property { string } bookingNumber Booking number 
 * @property { string } customerReference Customer reference 
 * @property { string } masterBillOfLadingNumber Master bill of lading number 
 * @property { string } houseBillOfLadingNumber House bill of lading number 
 * @property { string } positionNumber Position number 
 */
export const OurInformationBlockUpdateDtoSchema = z.object({ name: z.string().describe("Name"), phone: z.string().describe("Phone number"), date: z.string().describe("Date"), bookingNumber: z.string().describe("Booking number"), customerReference: z.string().describe("Customer reference"), masterBillOfLadingNumber: z.string().describe("Master bill of lading number"), houseBillOfLadingNumber: z.string().describe("House bill of lading number"), positionNumber: z.string().describe("Position number") }).readonly();
export type OurInformationBlockUpdateDto = z.infer<typeof OurInformationBlockUpdateDtoSchema>;


/** 
 * TermsBlockDtoSchema 
 * @type { object }
 * @property { string } termsImageUrl Terms image URL 
 */
export const TermsBlockDtoSchema = z.object({ termsImageUrl: z.string().describe("Terms image URL") }).readonly();
export type TermsBlockDto = z.infer<typeof TermsBlockDtoSchema>;


/** 
 * CutOffDatesBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } billOfLadingFromCustomer Bill of lading from customer date 
 * @property { string } billOfLadingToCarrier Bill of lading to carrier date 
 * @property { string } customsAMS Customs AMS date 
 * @property { string } vgmCustomer VGM customer date 
 */
export const CutOffDatesBlockUpdateDtoSchema = z.object({ billOfLadingFromCustomer: z.string().describe("Bill of lading from customer date"), billOfLadingToCarrier: z.string().describe("Bill of lading to carrier date"), customsAMS: z.string().describe("Customs AMS date"), vgmCustomer: z.string().describe("VGM customer date") }).readonly();
export type CutOffDatesBlockUpdateDto = z.infer<typeof CutOffDatesBlockUpdateDtoSchema>;


/** 
 * TemplatedDocumentDataDtoSchema 
 * @type { object }
 * @property { TitleBlockUpdateDto } title Title block data 
 * @property { ReceiverBlockUpdateDto } receiver Receiver block data 
 * @property { OurInformationBlockUpdateDto } ourInformation Our information block data 
 * @property { RouteTableBlockResponseDto } routeTable Route table block data 
 * @property { CargoTableBlockDto } cargoTable Cargo table block data 
 * @property { SummaryCargoBlockResponseDto } summaryCargo Summary cargo block data 
 * @property { FinanceTableBlockDto } financeTable Finance table block data 
 * @property { RemarkBlockDto[] } remarks Remark blocks 
 * @property { TermsBlockDto } terms Terms block data 
 * @property { ConfigBlockDto } config Config block data 
 * @property { CutOffDatesBlockUpdateDto } cutOffDates Cut off dates block data 
 */
export const TemplatedDocumentDataDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.describe("Title block data"), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.describe("Receiver block data"), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.describe("Our information block data"), routeTable: CommonModels.RouteTableBlockResponseDtoSchema.describe("Route table block data"), cargoTable: CommonModels.CargoTableBlockDtoSchema.describe("Cargo table block data"), summaryCargo: CommonModels.SummaryCargoBlockResponseDtoSchema.describe("Summary cargo block data"), financeTable: CommonModels.FinanceTableBlockDtoSchema.describe("Finance table block data"), remarks: z.array(CommonModels.RemarkBlockDtoSchema).readonly().describe("Remark blocks"), terms: CommonModels.TermsBlockDtoSchema.describe("Terms block data"), config: CommonModels.ConfigBlockDtoSchema.describe("Config block data"), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.describe("Cut off dates block data") }).readonly();
export type TemplatedDocumentDataDto = z.infer<typeof TemplatedDocumentDataDtoSchema>;


/** 
 * RouteTableUpdateBlockDtoSchema 
 * @type { object }
 * @property { string } selectedRouteId Selected route ID 
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { boolean } showReference Show reference column 
 * @property { boolean } showVesselVoyage Show vessel/voyage column 
 * @property { boolean } showProvider Show provider column 
 * @property { RouteTablePointDto[] } points Route points 
 * @property { boolean } showAddress Show address 
 * @property { boolean } showDates Show dates 
 * @property { boolean } showType Show type 
 * @property { boolean } showLocation Show location 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } suppressRoute Suppress route 
 */
export const RouteTableUpdateBlockDtoSchema = z.object({ selectedRouteId: z.string().describe("Selected route ID"), selectedRoutePointIds: z.array(z.string()).readonly().describe("Selected route point IDs"), showReference: z.boolean().describe("Show reference column"), showVesselVoyage: z.boolean().describe("Show vessel/voyage column"), showProvider: z.boolean().describe("Show provider column"), points: z.array(CommonModels.RouteTablePointDtoSchema).readonly().describe("Route points"), showAddress: z.boolean().describe("Show address"), showDates: z.boolean().describe("Show dates"), showType: z.boolean().describe("Show type"), showLocation: z.boolean().describe("Show location"), showGrid: z.boolean().describe("Show grid"), suppressRoute: z.boolean().describe("Suppress route") }).readonly();
export type RouteTableUpdateBlockDto = z.infer<typeof RouteTableUpdateBlockDtoSchema>;


/** 
 * CargoItemRouteUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 */
export const CargoItemRouteUpdateDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()).readonly().describe("Selected route point IDs") }).readonly();
export type CargoItemRouteUpdateDto = z.infer<typeof CargoItemRouteUpdateDtoSchema>;


/** 
 * CargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } cargoId Cargo ID to update packages for 
 * @property { string[] } selectedPackageIds Selected cargo package IDs 
 * @property { CargoItemRouteUpdateDto } route Cargo route (when routes are split) 
 */
export const CargoItemUpdateDtoSchema = z.object({ cargoId: z.string().describe("Cargo ID to update packages for"), selectedPackageIds: z.array(z.string()).readonly().describe("Selected cargo package IDs"), route: CommonModels.CargoItemRouteUpdateDtoSchema.describe("Cargo route (when routes are split)") }).readonly();
export type CargoItemUpdateDto = z.infer<typeof CargoItemUpdateDtoSchema>;


/** 
 * CargoTableBlockUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedCargoIds Selected cargo IDs 
 * @property { CargoItemUpdateDto[] } items Cargo items for package updates 
 * @property { boolean } suppressWeight Suppress weight column display 
 * @property { boolean } showGrid Show grid borders in cargo table 
 * @property { boolean } suppressVolume Suppress volume column display 
 * @property { boolean } suppressSpecialities Suppress specialities column display 
 * @property { boolean } suppressDimensions Suppress dimensions column display 
 * @property { boolean } suppressPackageVolume Suppress package volume column display 
 * @property { boolean } suppressPackageWeight Suppress package weight column display 
 * @property { boolean } showRoute Show route information (only applicable when routes are split) 
 * @property { boolean } showGrandTotal Show grand total 
 * @property { boolean } showTransportUnitTotal Show transport unit total 
 * @property { boolean } suppressCargo Suppress cargo table display 
 * @property { boolean } showTransportUnitChargeableWeight Show chargeable weight for transport units 
 * @property { boolean } showTransportUnitVolumetricWeight Show volumetric weight for transport units 
 * @property { boolean } showPackageChargeableWeight Show chargeable weight for packages 
 * @property { boolean } showPackageVolumetricWeight Show volumetric weight for packages 
 * @property { boolean } showPackageHSCodes Show HS codes for packages 
 * @property { boolean } showPackageType Show package type for packages 
 * @property { boolean } showPackageQuantity Show quantity for packages 
 * @property { boolean } showPackageDescription Show description for packages 
 * @property { boolean } showPackageCaseMarks Show case marks for packages 
 * @property { boolean } showTransportUnitNumber Show transport unit number 
 * @property { boolean } showTransportUnitType Show transport unit type 
 * @property { boolean } showTransportUnitSeal1 Show transport unit seal 1 
 * @property { boolean } showTransportUnitSeal2 Show transport unit seal 2 
 */
export const CargoTableBlockUpdateDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).readonly().describe("Selected cargo IDs"), items: z.array(CommonModels.CargoItemUpdateDtoSchema).readonly().describe("Cargo items for package updates"), suppressWeight: z.boolean().describe("Suppress weight column display"), showGrid: z.boolean().describe("Show grid borders in cargo table"), suppressVolume: z.boolean().describe("Suppress volume column display"), suppressSpecialities: z.boolean().describe("Suppress specialities column display"), suppressDimensions: z.boolean().describe("Suppress dimensions column display"), suppressPackageVolume: z.boolean().describe("Suppress package volume column display"), suppressPackageWeight: z.boolean().describe("Suppress package weight column display"), showRoute: z.boolean().describe("Show route information (only applicable when routes are split)").nullable(), showGrandTotal: z.boolean().describe("Show grand total"), showTransportUnitTotal: z.boolean().describe("Show transport unit total"), suppressCargo: z.boolean().describe("Suppress cargo table display"), showTransportUnitChargeableWeight: z.boolean().describe("Show chargeable weight for transport units"), showTransportUnitVolumetricWeight: z.boolean().describe("Show volumetric weight for transport units"), showPackageChargeableWeight: z.boolean().describe("Show chargeable weight for packages"), showPackageVolumetricWeight: z.boolean().describe("Show volumetric weight for packages"), showPackageHSCodes: z.boolean().describe("Show HS codes for packages"), showPackageType: z.boolean().describe("Show package type for packages"), showPackageQuantity: z.boolean().describe("Show quantity for packages"), showPackageDescription: z.boolean().describe("Show description for packages"), showPackageCaseMarks: z.boolean().describe("Show case marks for packages"), showTransportUnitNumber: z.boolean().describe("Show transport unit number"), showTransportUnitType: z.boolean().describe("Show transport unit type"), showTransportUnitSeal1: z.boolean().describe("Show transport unit seal 1"), showTransportUnitSeal2: z.boolean().describe("Show transport unit seal 2") }).readonly();
export type CargoTableBlockUpdateDto = z.infer<typeof CargoTableBlockUpdateDtoSchema>;


/** 
 * SummaryCargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { string } description Updated description for this cargo type 
 */
export const SummaryCargoItemUpdateDtoSchema = z.object({ transportUnitType: z.string().describe("Cargo type name (transport unit type)"), description: z.string().describe("Updated description for this cargo type") }).readonly();
export type SummaryCargoItemUpdateDto = z.infer<typeof SummaryCargoItemUpdateDtoSchema>;


/** 
 * SummaryCargoBlockUpdateDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemUpdateDto[] } items  
 */
export const SummaryCargoBlockUpdateDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemUpdateDtoSchema).readonly() }).readonly();
export type SummaryCargoBlockUpdateDto = z.infer<typeof SummaryCargoBlockUpdateDtoSchema>;


/** 
 * FinanceTablePositionUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedFinanceRowIds Selected finance row IDs 
 * @property { string } positionId Position ID 
 */
export const FinanceTablePositionUpdateDtoSchema = z.object({ selectedFinanceRowIds: z.array(z.string()).readonly().describe("Selected finance row IDs"), positionId: z.string().describe("Position ID") }).readonly();
export type FinanceTablePositionUpdateDto = z.infer<typeof FinanceTablePositionUpdateDtoSchema>;


/** 
 * FinanceTableBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Selected business partner ID 
 * @property { boolean } showVendor Show vendor 
 * @property { boolean } showBuyRate Show buy rate 
 * @property { boolean } showCustomer Show customer 
 * @property { boolean } showSellRate Show sell rate 
 * @property { boolean } showGrid Show grid 
 * @property { boolean } showCharges Show charges 
 * @property { boolean } showAdditionalText Show additional text 
 * @property { boolean } showQuantity Show quantity 
 * @property { boolean } showTotalsByCurrency Show totals grouped by currency 
 * @property { boolean } suppressFinances Suppress finances from output 
 * @property { boolean } suppressZeroLines Suppress rows where the amounts are zero 
 * @property { boolean } showTotal Show total from output 
 * @property { boolean } showProfit Show profit from output 
 * @property { boolean } showBuyRateExchangeRates Show buy rate exchange rates from output 
 * @property { boolean } showSellRateExchangeRates Show sell rate exchange rates from output 
 * @property { boolean } includeSubPositions Include sub-positions 
 * @property { boolean } subPositionTotals Show sub-position totals 
 * @property { FinanceTablePositionUpdateDto[] } positions Finance positions 
 */
export const FinanceTableBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().describe("Selected business partner ID"), showVendor: z.boolean().describe("Show vendor"), showBuyRate: z.boolean().describe("Show buy rate"), showCustomer: z.boolean().describe("Show customer"), showSellRate: z.boolean().describe("Show sell rate"), showGrid: z.boolean().describe("Show grid"), showCharges: z.boolean().describe("Show charges"), showAdditionalText: z.boolean().describe("Show additional text"), showQuantity: z.boolean().describe("Show quantity"), showTotalsByCurrency: z.boolean().describe("Show totals grouped by currency"), suppressFinances: z.boolean().describe("Suppress finances from output"), suppressZeroLines: z.boolean().describe("Suppress rows where the amounts are zero"), showTotal: z.boolean().describe("Show total from output"), showProfit: z.boolean().describe("Show profit from output"), showBuyRateExchangeRates: z.boolean().describe("Show buy rate exchange rates from output"), showSellRateExchangeRates: z.boolean().describe("Show sell rate exchange rates from output"), includeSubPositions: z.boolean().describe("Include sub-positions").nullable(), subPositionTotals: z.boolean().describe("Show sub-position totals").nullable(), positions: z.array(CommonModels.FinanceTablePositionUpdateDtoSchema).readonly().describe("Finance positions") }).readonly();
export type FinanceTableBlockUpdateDto = z.infer<typeof FinanceTableBlockUpdateDtoSchema>;


/** 
 * RemarkBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockUpdateDtoSchema = z.object({ id: z.string(), position: z.number().gte(1).nullish(), content: CommonModels.EditorContentUpdateDtoSchema.nullish(), enabled: z.boolean().nullish() }).readonly();
export type RemarkBlockUpdateDto = z.infer<typeof RemarkBlockUpdateDtoSchema>;


/** 
 * TemplatedDocumentDataUpdateDtoSchema 
 * @type { object }
 * @property { TitleBlockUpdateDto } title Title block data 
 * @property { ReceiverBlockUpdateDto } receiver Receiver block data 
 * @property { OurInformationBlockUpdateDto } ourInformation Our information block data 
 * @property { RouteTableUpdateBlockDto } routeTable Route table block data 
 * @property { CargoTableBlockUpdateDto } cargoTable Cargo table block data 
 * @property { SummaryCargoBlockUpdateDto } summaryCargo Summary cargo block data 
 * @property { FinanceTableBlockUpdateDto } financeTable Finance table block data 
 * @property { RemarkBlockUpdateDto[] } remarks Remark blocks 
 * @property { CutOffDatesBlockUpdateDto } cutOffDates Cut off dates block data 
 */
export const TemplatedDocumentDataUpdateDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.describe("Title block data"), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.describe("Receiver block data"), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.describe("Our information block data"), routeTable: CommonModels.RouteTableUpdateBlockDtoSchema.describe("Route table block data"), cargoTable: CommonModels.CargoTableBlockUpdateDtoSchema.describe("Cargo table block data"), summaryCargo: CommonModels.SummaryCargoBlockUpdateDtoSchema.describe("Summary cargo block data"), financeTable: CommonModels.FinanceTableBlockUpdateDtoSchema.describe("Finance table block data"), remarks: z.array(CommonModels.RemarkBlockUpdateDtoSchema).readonly().describe("Remark blocks"), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.describe("Cut off dates block data") }).readonly();
export type TemplatedDocumentDataUpdateDto = z.infer<typeof TemplatedDocumentDataUpdateDtoSchema>;


/** 
 * BusinessPartnerTypeSchema 
 * @type { enum }
 */
export const BusinessPartnerTypeSchema = z.enum(["businessPartner", "destinationAgent", "oceanCarrier", "office", "customsAgent", "stuffingStrippingProvider", "shipper", "fobForwarder", "routingAgent", "transportProvider", "originServiceProvider", "insuranceProvider", "consignee", "courier", "trucker", "airline", "originAgent"]);
export type BusinessPartnerType = z.infer<typeof BusinessPartnerTypeSchema>;
export const BusinessPartnerType = BusinessPartnerTypeSchema.enum;

/** 
 * BusinessPartnerAddressCityDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const BusinessPartnerAddressCityDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type BusinessPartnerAddressCityDto = z.infer<typeof BusinessPartnerAddressCityDtoSchema>;


/** 
 * BusinessPartnerAddressCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const BusinessPartnerAddressCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() }).readonly();
export type BusinessPartnerAddressCountryDto = z.infer<typeof BusinessPartnerAddressCountryDtoSchema>;


/** 
 * BusinessPartnerAddressResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the address 
 * @property { string } street Street address 
 * @property { string } secondaryStreet Secondary street information 
 * @property { string } zip ZIP/Postal code 
 * @property { BusinessPartnerAddressCityDto } city Country data 
 * @property { string } district District information 
 * @property { BusinessPartnerAddressCountryDto } country Country data 
 */
export const BusinessPartnerAddressResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the address"), street: z.string().describe("Street address"), secondaryStreet: z.string().describe("Secondary street information"), zip: z.string().describe("ZIP/Postal code"), city: CommonModels.BusinessPartnerAddressCityDtoSchema.describe("Country data"), district: z.string().describe("District information"), country: CommonModels.BusinessPartnerAddressCountryDtoSchema.describe("Country data") }).readonly();
export type BusinessPartnerAddressResponseDTO = z.infer<typeof BusinessPartnerAddressResponseDTOSchema>;


/** 
 * EditorContentResponseDtoSchema 
 * @type { object }
 * @property { string } html HTML content 
 * @property { object } json JSON content 
 * @property { any } json.[key]  
 */
export const EditorContentResponseDtoSchema = z.object({ html: z.string().describe("HTML content"), json: z.object({}).catchall(z.any()).readonly().describe("JSON content") }).readonly();
export type EditorContentResponseDto = z.infer<typeof EditorContentResponseDtoSchema>;


/** 
 * DunningSystemReferenceDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } isDefault  
 */
export const DunningSystemReferenceDTOSchema = z.object({ id: z.string(), name: z.string(), isDefault: z.boolean() }).readonly();
export type DunningSystemReferenceDTO = z.infer<typeof DunningSystemReferenceDTOSchema>;


/** 
 * TransportModeEnumSchema 
 * @type { enum }
 */
export const TransportModeEnumSchema = z.enum(["Air", "Sea", "Road"]);
export type TransportModeEnum = z.infer<typeof TransportModeEnumSchema>;
export const TransportModeEnum = TransportModeEnumSchema.enum;

/** 
 * SeaRoutingEnumSchema 
 * @type { enum }
 */
export const SeaRoutingEnumSchema = z.enum(["Direct", "Transhipment"]);
export type SeaRoutingEnum = z.infer<typeof SeaRoutingEnumSchema>;
export const SeaRoutingEnum = SeaRoutingEnumSchema.enum;

/** 
 * InvolvedPartyBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 * @property { BusinessPartnerAddressResponseDTO } address Main address information 
 */
export const InvolvedPartyBusinessPartnerResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), address: CommonModels.BusinessPartnerAddressResponseDTOSchema.describe("Main address information").nullish() }).readonly();
export type InvolvedPartyBusinessPartnerResponseDTO = z.infer<typeof InvolvedPartyBusinessPartnerResponseDTOSchema>;


/** 
 * InvolvedPartyContactResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvolvedPartyContactResponseDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type InvolvedPartyContactResponseDTO = z.infer<typeof InvolvedPartyContactResponseDTOSchema>;


/** 
 * InvolvedPartyResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { PositionInvolvedPartyTypeEnum } type  
 * @property { string } reference  
 * @property { InvolvedPartyBusinessPartnerResponseDTO } businessPartner  
 * @property { InvolvedPartyContactResponseDTO } contact  
 */
export const InvolvedPartyResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.PositionInvolvedPartyTypeEnumSchema, reference: z.string().nullish(), businessPartner: CommonModels.InvolvedPartyBusinessPartnerResponseDTOSchema.nullish(), contact: CommonModels.InvolvedPartyContactResponseDTOSchema.nullish() }).readonly();
export type InvolvedPartyResponseDto = z.infer<typeof InvolvedPartyResponseDtoSchema>;


/** 
 * CreateInvolvedPartyRequestDtoSchema 
 * @type { object }
 * @property { PositionInvolvedPartyTypeEnum } type Type of the involved party to create 
 */
export const CreateInvolvedPartyRequestDtoSchema = z.object({ type: CommonModels.PositionInvolvedPartyTypeEnumSchema.describe("Type of the involved party to create") }).readonly();
export type CreateInvolvedPartyRequestDto = z.infer<typeof CreateInvolvedPartyRequestDtoSchema>;


/** 
 * RouteLocationTypeEnumSchema 
 * @type { enum }
 */
export const RouteLocationTypeEnumSchema = z.enum(["BusinessPartner", "Depot", "Port", "Terminal", "City", "Warehouse", "ContainerYard", "Airport"]);
export type RouteLocationTypeEnum = z.infer<typeof RouteLocationTypeEnumSchema>;
export const RouteLocationTypeEnum = RouteLocationTypeEnumSchema.enum;

/** 
 * RoutePointLocationResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { RouteLocationTypeEnum } type  
 */
export const RoutePointLocationResponseDtoSchema = z.object({ id: z.string(), name: z.string(), type: CommonModels.RouteLocationTypeEnumSchema.nullable() }).readonly();
export type RoutePointLocationResponseDto = z.infer<typeof RoutePointLocationResponseDtoSchema>;


/** 
 * RoutePointTypeEnumSchema 
 * @type { enum }
 */
export const RoutePointTypeEnumSchema = z.enum(["EmptyContainerDepot", "LoadingAddress", "Stop", "FumigationStop", "OriginCustomsStop", "StuffingLocation", "PortTerminal", "PortOfLoading", "TransshipmentPort", "PortOfDischarge", "StrippingLocation", "ContainerYard", "DestinationCustomsStop", "FinalDestination", "EmptyContainerReturn", "OriginAgent", "HandlingAgent", "XRay", "CustomsBroker", "AirportOfDeparture", "StopAirport", "DestinationAirport", "CustomsStop", "DestinationAgent", "DeliveryAddress", "Courier", "PickupAddress", "StopAddress"]);
export type RoutePointTypeEnum = z.infer<typeof RoutePointTypeEnumSchema>;
export const RoutePointTypeEnum = RoutePointTypeEnumSchema.enum;

/** 
 * IncotermsEnumSchema 
 * @type { enum }
 */
export const IncotermsEnumSchema = z.enum(["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]);
export type IncotermsEnum = z.infer<typeof IncotermsEnumSchema>;
export const IncotermsEnum = IncotermsEnumSchema.enum;

/** 
 * PositionRouteTransportModeEnumSchema 
 * @type { enum }
 */
export const PositionRouteTransportModeEnumSchema = z.enum(["Truck", "Rail/Truck", "Rail", "Barge"]);
export type PositionRouteTransportModeEnum = z.infer<typeof PositionRouteTransportModeEnumSchema>;
export const PositionRouteTransportModeEnum = PositionRouteTransportModeEnumSchema.enum;

/** 
 * RoutePointProviderResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const RoutePointProviderResponseDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type RoutePointProviderResponseDto = z.infer<typeof RoutePointProviderResponseDtoSchema>;


/** 
 * RoutePointResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { RoutePointTypeEnum } type  
 * @property { string } name  
 * @property { number } sequenceNumber  
 * @property { RoutePointLocationResponseDto } location  
 * @property { string } estimatedTime  
 * @property { string } secondaryEstimatedTime Secondary estimated time (sea positions only) 
 * @property { string } reference  
 * @property { string } secondaryReference  
 * @property { IncotermsEnum } incoterm  
 * @property { PositionRouteTransportModeEnum } transportMode  
 * @property { RoutePointProviderResponseDto } provider  
 * @property { string } vessel Vessel name (sea positions only) 
 * @property { string } voyage Voyage number (sea positions only) 
 * @property { string } carrier Carrier name (sea positions only) 
 */
export const RoutePointResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.RoutePointTypeEnumSchema, name: z.string(), sequenceNumber: z.number(), location: CommonModels.RoutePointLocationResponseDtoSchema.nullish(), estimatedTime: z.iso.datetime({ offset: true }).nullish(), secondaryEstimatedTime: z.iso.datetime({ offset: true }).describe("Secondary estimated time (sea positions only)").nullish(), reference: z.string().nullish(), secondaryReference: z.string().nullish(), incoterm: CommonModels.IncotermsEnumSchema.nullish(), transportMode: CommonModels.PositionRouteTransportModeEnumSchema.nullish(), provider: CommonModels.RoutePointProviderResponseDtoSchema.nullish(), vessel: z.string().describe("Vessel name (sea positions only)").nullish(), voyage: z.string().describe("Voyage number (sea positions only)").nullish(), carrier: z.string().describe("Carrier name (sea positions only)").nullish() }).readonly();
export type RoutePointResponseDto = z.infer<typeof RoutePointResponseDtoSchema>;


/** 
 * RouteResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } cargoId Cargo ID (sea positions only) 
 * @property { string } cargoNumber Cargo number (sea positions only) 
 * @property { RoutePointResponseDto[] } points  
 */
export const RouteResponseDtoSchema = z.object({ id: z.string(), cargoId: z.string().describe("Cargo ID (sea positions only)").nullish(), cargoNumber: z.string().describe("Cargo number (sea positions only)").nullish(), points: z.array(CommonModels.RoutePointResponseDtoSchema).readonly() }).readonly();
export type RouteResponseDto = z.infer<typeof RouteResponseDtoSchema>;


/** 
 * RouteListResponseDtoSchema 
 * @type { object }
 * @property { RouteResponseDto[] } routes  
 * @property { boolean } splitRoute Whether the position routes are split by cargo (sea positions only) 
 */
export const RouteListResponseDtoSchema = z.object({ routes: z.array(CommonModels.RouteResponseDtoSchema).readonly(), splitRoute: z.boolean().describe("Whether the position routes are split by cargo (sea positions only)") }).readonly();
export type RouteListResponseDto = z.infer<typeof RouteListResponseDtoSchema>;


/** 
 * CreateRoutePointRequestDtoSchema 
 * @type { object }
 * @property { RoutePointTypeEnum } type  
 */
export const CreateRoutePointRequestDtoSchema = z.object({ type: CommonModels.RoutePointTypeEnumSchema }).readonly();
export type CreateRoutePointRequestDto = z.infer<typeof CreateRoutePointRequestDtoSchema>;


/** 
 * UpdateRoutePointRequestDtoSchema 
 * @type { object }
 * @property { string } locationId Location ID for the route point 
 * @property { RouteLocationTypeEnum } locationType Type of location 
 * @property { string } estimatedTime Updated estimated time for the route point 
 * @property { string } secondaryEstimatedTime Secondary estimated time for the route point (sea positions only) 
 * @property { string } reference Reference for the route point 
 * @property { string } secondaryReference Secondary reference for the route point 
 * @property { IncotermsEnum } incoterm  
 * @property { PositionRouteTransportModeEnum } transportMode  
 * @property { string } providerId  
 * @property { string } vessel Vessel name (sea positions only) 
 * @property { string } voyage Voyage number (sea positions only) 
 * @property { string } carrier Carrier name (sea positions only) 
 */
export const UpdateRoutePointRequestDtoSchema = z.object({ locationId: z.string().describe("Location ID for the route point").nullable(), locationType: CommonModels.RouteLocationTypeEnumSchema.describe("Type of location").nullable(), estimatedTime: z.iso.datetime({ offset: true }).describe("Updated estimated time for the route point"), secondaryEstimatedTime: z.iso.datetime({ offset: true }).describe("Secondary estimated time for the route point (sea positions only)"), reference: z.string().describe("Reference for the route point"), secondaryReference: z.string().describe("Secondary reference for the route point"), incoterm: CommonModels.IncotermsEnumSchema, transportMode: CommonModels.PositionRouteTransportModeEnumSchema, providerId: z.string(), vessel: z.string().describe("Vessel name (sea positions only)"), voyage: z.string().describe("Voyage number (sea positions only)"), carrier: z.string().describe("Carrier name (sea positions only)") }).readonly();
export type UpdateRoutePointRequestDto = z.infer<typeof UpdateRoutePointRequestDtoSchema>;


/** 
 * PositionChargeDtoResponseSchema 
 * @type { object }
 * @property { object } chargeType  
 * @property { string } chargeType.id  
 * @property { string } chargeType.name  
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { object } buyVatRule  
 * @property { string } buyVatRule.id  
 * @property { string } buyVatRule.name  
 * @property { string } buyVatRule.matchcode  
 * @property { object } vendor  
 * @property { string } vendor.id  
 * @property { string } vendor.name  
 * @property { string } vendor.matchCode  
 * @property { string } vendor.label  
 * @property { string } vendor.debtorId  
 * @property { string } vendor.creditorId  
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { object } sellVatRule  
 * @property { string } sellVatRule.id  
 * @property { string } sellVatRule.name  
 * @property { string } sellVatRule.matchcode  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { string } customer.debtorId  
 * @property { string } customer.creditorId  
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 * @property { number } profit Profit amount 
 * @property { string } profitCurrencyCode Profit currency code 
 */
export const PositionChargeDtoResponseSchema = z.object({ chargeType: z.object({ id: z.string(), name: z.string() }).readonly().nullish(), additionalText: z.string().describe("Additional text for the charge"), quantity: z.number().describe("Quantity of the charge").nullish(), buyRate: z.number().describe("Buy rate amount").nullish(), buyCurrencyCode: z.string().describe("Buy rate currency code"), buyVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).readonly().nullish(), vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).readonly().nullish(), buyExchangeRate: z.number().describe("Buy exchange rate with up to 4 decimal places accuracy").nullish(), sellRate: z.number().describe("Sell rate amount").nullish(), sellCurrencyCode: z.string().describe("Sell rate currency code"), sellVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).readonly().nullish(), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).readonly().nullish(), sellExchangeRate: z.number().describe("Sell exchange rate with up to 4 decimal places accuracy").nullish(), profit: z.number().describe("Profit amount").nullish(), profitCurrencyCode: z.string().describe("Profit currency code").nullish() }).readonly();
export type PositionChargeDtoResponse = z.infer<typeof PositionChargeDtoResponseSchema>;


/** 
 * PositionTextDtoResponseSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const PositionTextDtoResponseSchema = z.object({ content: z.string().describe("Text content") }).readonly();
export type PositionTextDtoResponse = z.infer<typeof PositionTextDtoResponseSchema>;


/** 
 * PositionAccountItemDtoResponseSchema 
 * @type { object }
 * @property { string } id Item ID 
 * @property { string } outgoingInvoiceId  
 * @property { string } registeredInvoiceId  
 * @property { PositionAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { PositionChargeDtoResponse } charge Charge data if type is CHARGE 
 * @property { PositionTextDtoResponse } text Text data if type is TEXT 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 */
export const PositionAccountItemDtoResponseSchema = z.object({ id: z.string().describe("Item ID"), outgoingInvoiceId: z.string().nullish(), registeredInvoiceId: z.string().nullish(), type: CommonModels.PositionAccountItemTypeEnumSchema.describe("Item type"), orderPosition: z.number().describe("Order position of the item"), charge: CommonModels.PositionChargeDtoResponseSchema.describe("Charge data if type is CHARGE").nullish(), text: CommonModels.PositionTextDtoResponseSchema.describe("Text data if type is TEXT").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Created at"), updatedAt: z.iso.datetime({ offset: true }).describe("Updated at") }).readonly();
export type PositionAccountItemDtoResponse = z.infer<typeof PositionAccountItemDtoResponseSchema>;


/** 
 * UserPreviewDtoSchema 
 * @type { object }
 * @property { string } userId  
 * @property { string } name  
 */
export const UserPreviewDtoSchema = z.object({ userId: z.string(), name: z.string() }).readonly();
export type UserPreviewDto = z.infer<typeof UserPreviewDtoSchema>;


/** 
 * HBLDocumentConfigDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 * @property { string } blTermsAndConditionsImageUrl BL terms and conditions image URL 
 * @property { string } signatureImageUrl Signature image URL 
 * @property { boolean } hasSignatureImage Whether office has a signature image configured 
 */
export const HBLDocumentConfigDtoSchema = z.object({ footerImageUrl: z.string().describe("Footer image URL"), headerImageUrl: z.string().describe("Header image URL"), blTermsAndConditionsImageUrl: z.string().describe("BL terms and conditions image URL"), signatureImageUrl: z.string().describe("Signature image URL"), hasSignatureImage: z.boolean().describe("Whether office has a signature image configured") }).readonly();
export type HBLDocumentConfigDto = z.infer<typeof HBLDocumentConfigDtoSchema>;


/** 
 * DirectionEnumSchema 
 * @type { enum }
 */
export const DirectionEnumSchema = z.enum(["Import", "Export"]);
export type DirectionEnum = z.infer<typeof DirectionEnumSchema>;
export const DirectionEnum = DirectionEnumSchema.enum;

/** 
 * HazardousPackingGroupEnumSchema 
 * @type { enum }
 */
export const HazardousPackingGroupEnumSchema = z.enum(["PG I", "PG II", "PG III"]);
export type HazardousPackingGroupEnum = z.infer<typeof HazardousPackingGroupEnumSchema>;
export const HazardousPackingGroupEnum = HazardousPackingGroupEnumSchema.enum;

/** 
 * PositionCargoPackageHazardousSpecialtyResponseDTOSchema 
 * @type { object }
 * @property { number } totalLength  
 * @property { number } totalWidth  
 * @property { number } temperature  
 * @property { string } unNumber  
 * @property { string } IMOClass  
 * @property { string } shippingName  
 * @property { string } technicalName  
 * @property { HazardousPackingGroupEnum } packagingGroup  
 * @property { number } netWeight  
 * @property { number } flashpoint  
 * @property { string[] } properties  
 * @property { string } acceptanceNumber  
 * @property { string } medGuide  
 * @property { string } emergencyPhone  
 * @property { string } emergencySchedule  
 */
export const PositionCargoPackageHazardousSpecialtyResponseDTOSchema = z.object({ totalLength: z.number(), totalWidth: z.number(), temperature: z.number(), unNumber: z.string(), IMOClass: z.string(), shippingName: z.string(), technicalName: z.string(), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema, netWeight: z.number(), flashpoint: z.number(), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).readonly(), acceptanceNumber: z.string(), medGuide: z.string(), emergencyPhone: z.string(), emergencySchedule: z.string() }).readonly();
export type PositionCargoPackageHazardousSpecialtyResponseDTO = z.infer<typeof PositionCargoPackageHazardousSpecialtyResponseDTOSchema>;


/** 
 * PositionCargoPackageTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionCargoPackageTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type PositionCargoPackageTypeResponseDTO = z.infer<typeof PositionCargoPackageTypeResponseDTOSchema>;


/** 
 * HsCodeLabelDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const HsCodeLabelDtoSchema = z.object({ id: z.string(), label: z.string() }).readonly();
export type HsCodeLabelDto = z.infer<typeof HsCodeLabelDtoSchema>;


/** 
 * PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema = z.object({ temperatureFrom: z.number(), temperatureUntil: z.number() }).readonly();
export type PositionCargoPackageTemperatureControlledSpecialtyResponseDto = z.infer<typeof PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema>;


/** 
 * PositionCargoSourcePackageResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } positionNumber  
 */
export const PositionCargoSourcePackageResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string() }).readonly();
export type PositionCargoSourcePackageResponseDTO = z.infer<typeof PositionCargoSourcePackageResponseDTOSchema>;


/** 
 * PositionCargoPackageResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } cargoId  
 * @property { string } rootFolderId  
 * @property { number } quantity  
 * @property { string } packageTypeId  
 * @property { PositionCargoPackageTypeResponseDTO } packageType  
 * @property { number } length  
 * @property { number } width  
 * @property { number } height  
 * @property { number } netWeight  
 * @property { number } grossWeight  
 * @property { number } chargeableWeight  
 * @property { string } note  
 * @property { string } name  
 * @property { number } orderNumber  
 * @property { number } volume  
 * @property { number } volumetricWeight  
 * @property { string } caseMarks  
 * @property { string } description  
 * @property { string[] } hsCodes  
 * @property { HsCodeLabelDto[] } hsCodeLabels HS code details 
 * @property { string } customsRemarks  
 * @property { number } loadMeter  
 * @property { string[] } specialties  
 * @property { PositionCargoPackageHazardousSpecialtyResponseDTO } hazardousSpecialty  
 * @property { PositionCargoPackageTemperatureControlledSpecialtyResponseDto } temperatureControlledSpecialty  
 * @property { PositionCargoSourcePackageResponseDTO } sourcePackage  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const PositionCargoPackageResponseDTOSchema = z.object({ id: z.string(), cargoId: z.string(), rootFolderId: z.string().nullish(), quantity: z.number().nullish(), packageTypeId: z.string().nullish(), packageType: CommonModels.PositionCargoPackageTypeResponseDTOSchema.nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), netWeight: z.number().nullish(), grossWeight: z.number().nullish(), chargeableWeight: z.number().nullish(), note: z.string().nullish(), name: z.string().nullish(), orderNumber: z.number().nullish(), volume: z.number().nullish(), volumetricWeight: z.number().nullish(), caseMarks: z.string().nullish(), description: z.string().nullish(), hsCodes: z.array(z.string()).readonly().nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).readonly().describe("HS code details").nullish(), customsRemarks: z.string().nullish(), loadMeter: z.number().nullish(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).readonly(), hazardousSpecialty: CommonModels.PositionCargoPackageHazardousSpecialtyResponseDTOSchema.nullish(), temperatureControlledSpecialty: CommonModels.PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema.nullish(), sourcePackage: CommonModels.PositionCargoSourcePackageResponseDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), mrn: z.string().describe("MRN (Movement Reference Number)").nullish(), exportPortFilling: z.string().describe("Export port filling").nullish(), customsReleased: z.boolean().describe("Customs released status").nullish(), importCustomsReleaseNumber: z.string().describe("Import customs release number").nullish(), portCustomsNumber: z.string().describe("Port customs number").nullish() }).readonly();
export type PositionCargoPackageResponseDTO = z.infer<typeof PositionCargoPackageResponseDTOSchema>;


/** 
 * PackageTotalsDtoSchema 
 * @type { object }
 * @property { number } quantity  
 * @property { number } weightPerPiece  
 * @property { number } volume  
 * @property { number } chargeableWeight  
 * @property { number } loadMeter  
 */
export const PackageTotalsDtoSchema = z.object({ quantity: z.number(), weightPerPiece: z.number(), volume: z.number(), chargeableWeight: z.number().nullish(), loadMeter: z.number().nullish() }).readonly();
export type PackageTotalsDto = z.infer<typeof PackageTotalsDtoSchema>;


/** 
 * PackageSpecialtyTotalsResponseDtoSchema 
 * @type { object }
 * @property { PackageTotalsDto } noSpecialties  
 * @property { PackageTotalsDto } hazardous  
 * @property { PackageTotalsDto } nonStackable  
 * @property { PackageTotalsDto } temperatureControlled  
 * @property { PackageTotalsDto } diplomatic  
 * @property { PackageTotalsDto } oversized  
 * @property { PackageTotalsDto } total  
 */
export const PackageSpecialtyTotalsResponseDtoSchema = z.object({ noSpecialties: CommonModels.PackageTotalsDtoSchema, hazardous: CommonModels.PackageTotalsDtoSchema, nonStackable: CommonModels.PackageTotalsDtoSchema, temperatureControlled: CommonModels.PackageTotalsDtoSchema, diplomatic: CommonModels.PackageTotalsDtoSchema, oversized: CommonModels.PackageTotalsDtoSchema, total: CommonModels.PackageTotalsDtoSchema }).readonly();
export type PackageSpecialtyTotalsResponseDto = z.infer<typeof PackageSpecialtyTotalsResponseDtoSchema>;


/** 
 * PositionCargoCargoTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Cargo type ID. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } name Cargo type name. Example: `Electronics` 
 * @property { string } shortName Cargo type short name. Example: `ELEC` 
 */
export const PositionCargoCargoTypeResponseDTOSchema = z.object({ id: z.string().describe("Cargo type ID"), name: z.string().describe("Cargo type name"), shortName: z.string().describe("Cargo type short name").nullish() }).readonly();
export type PositionCargoCargoTypeResponseDTO = z.infer<typeof PositionCargoCargoTypeResponseDTOSchema>;


/** 
 * PositionCargoResponseDTOSchema 
 * @type { object }
 * @property { string } id Cargo ID. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } positionId Position ID this cargo belongs to. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } quoteId Quote ID this cargo belongs to. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } rootFolderId Folder id bound to this cargo. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { PositionCargoCargoTypeResponseDTO } cargoType Cargo type 
 * @property { boolean } autoCalculateTotals  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { string } textForCustoms  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { HsCodeLabelDto[] } hsCodeLabels HS code details 
 * @property { string } note  
 * @property { PositionCargoPackageResponseDTO[] } packages Packages for the cargo 
 * @property { string } createdAt Creation date. Example: `2023-04-09T12:00:00Z` 
 * @property { string } updatedAt Last update date. Example: `2023-04-09T12:00:00Z` 
 * @property { number } completeWeight  
 * @property { PackageSpecialtyTotalsResponseDto } packageTotals  
 */
export const PositionCargoResponseDTOSchema = z.object({ id: z.string().describe("Cargo ID"), positionId: z.string().describe("Position ID this cargo belongs to").nullish(), quoteId: z.string().describe("Quote ID this cargo belongs to").nullish(), rootFolderId: z.string().describe("Folder id bound to this cargo").nullish(), cargoType: CommonModels.PositionCargoCargoTypeResponseDTOSchema.describe("Cargo type").nullish(), autoCalculateTotals: z.boolean(), autoCalculateRates: z.boolean(), autoCalculateVgm: z.boolean(), transportUnitNumber: z.string().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), rateOptions: z.string().nullish(), rateClass: z.string().nullish(), textForCustoms: z.string().nullish(), totalVolume: z.number().nullish(), totalGrossWeight: z.number().nullish(), totalNetWeight: z.number().nullish(), totalVolumetricWeight: z.number().nullish(), totalChargeableWeight: z.number().nullish(), totalLoadMeter: z.number().nullish(), ratePerKg: z.number().nullish(), totalRate: z.number().nullish(), tare: z.number().nullish(), vgm: z.number().nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).readonly().describe("HS code details").nullish(), note: z.string().nullish(), packages: z.array(CommonModels.PositionCargoPackageResponseDTOSchema).readonly().describe("Packages for the cargo").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Creation date"), updatedAt: z.iso.datetime({ offset: true }).describe("Last update date"), completeWeight: z.number().nullish(), packageTotals: CommonModels.PackageSpecialtyTotalsResponseDtoSchema.nullish() }).readonly();
export type PositionCargoResponseDTO = z.infer<typeof PositionCargoResponseDTOSchema>;


/** 
 * HazardousSpecialtyDTOSchema 
 * @type { object }
 * @property { number } totalLength Total length 
 * @property { number } totalWidth Total width 
 * @property { number } temperature Temperature 
 * @property { string } unNumber UN number 
 * @property { string } IMOClass IMOClass 
 * @property { string } shippingName Shipping name 
 * @property { string } technicalName Technical name 
 * @property { HazardousPackingGroupEnum } packagingGroup Packaging 
 * @property { number } netWeight Net weight 
 * @property { number } flashpoint Flashpoint 
 * @property { string[] } properties Properties 
 * @property { string } acceptanceNumber Acceptance number 
 * @property { string } medGuide Medical guide 
 * @property { string } emergencyPhone Emergency phone 
 * @property { string } emergencySchedule Emergency schedule 
 */
export const HazardousSpecialtyDTOSchema = z.object({ totalLength: z.number().describe("Total length"), totalWidth: z.number().describe("Total width"), temperature: z.number().describe("Temperature"), unNumber: z.string().describe("UN number"), IMOClass: z.string().describe("IMOClass"), shippingName: z.string().describe("Shipping name"), technicalName: z.string().describe("Technical name"), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema.describe("Packaging"), netWeight: z.number().describe("Net weight"), flashpoint: z.number().describe("Flashpoint"), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).readonly().describe("Properties"), acceptanceNumber: z.string().describe("Acceptance number"), medGuide: z.string().describe("Medical guide"), emergencyPhone: z.string().describe("Emergency phone"), emergencySchedule: z.string().describe("Emergency schedule") }).readonly();
export type HazardousSpecialtyDTO = z.infer<typeof HazardousSpecialtyDTOSchema>;


/** 
 * TemperatureControlledSpecialtyDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const TemperatureControlledSpecialtyDtoSchema = z.object({ temperatureFrom: z.number(), temperatureUntil: z.number() }).readonly();
export type TemperatureControlledSpecialtyDto = z.infer<typeof TemperatureControlledSpecialtyDtoSchema>;


/** 
 * CreatePositionCargoPackageDTOSchema 
 * @type { object }
 * @property { number } quantity Package quantity 
 * @property { string } packageTypeId Package type ID 
 * @property { number } length Package length 
 * @property { number } width Package width 
 * @property { number } height Package height 
 * @property { number } netWeight Package net weight 
 * @property { number } grossWeight Package gross weight 
 * @property { number } loadMeter Package load meter 
 * @property { number } chargeableWeight Package chargeable weight 
 * @property { number } volume Package volume 
 * @property { number } volumetricWeight Package volumetric weight 
 * @property { string } caseMarks Package case marks 
 * @property { string } note Package note 
 * @property { string } description Package description 
 * @property { string[] } hsCodes Package HS codes 
 * @property { string } customsRemarks Text for customs 
 * @property { string[] } specialties  
 * @property { HazardousSpecialtyDTO } hazardousSpecialty  
 * @property { TemperatureControlledSpecialtyDto } temperatureControlledSpecialty  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const CreatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().describe("Package quantity"), packageTypeId: z.string().describe("Package type ID"), length: z.number().describe("Package length"), width: z.number().describe("Package width"), height: z.number().describe("Package height"), netWeight: z.number().describe("Package net weight"), grossWeight: z.number().describe("Package gross weight"), loadMeter: z.number().describe("Package load meter"), chargeableWeight: z.number().describe("Package chargeable weight"), volume: z.number().describe("Package volume"), volumetricWeight: z.number().describe("Package volumetric weight"), caseMarks: z.string().describe("Package case marks"), note: z.string().describe("Package note"), description: z.string().describe("Package description"), hsCodes: z.array(z.string()).readonly().describe("Package HS codes"), customsRemarks: z.string().describe("Text for customs"), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).readonly(), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema, temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema, mrn: z.string().describe("MRN (Movement Reference Number)"), exportPortFilling: z.string().describe("Export port filling"), customsReleased: z.boolean().describe("Customs released status"), importCustomsReleaseNumber: z.string().describe("Import customs release number"), portCustomsNumber: z.string().describe("Port customs number") }).readonly();
export type CreatePositionCargoPackageDTO = z.infer<typeof CreatePositionCargoPackageDTOSchema>;


/** 
 * UpdatePositionCargoPackageDTOSchema 
 * @type { object }
 * @property { number } quantity Package quantity 
 * @property { string } packageTypeId Package type ID 
 * @property { number } length Package length 
 * @property { number } width Package width 
 * @property { number } height Package height 
 * @property { number } netWeight Package net weight 
 * @property { number } grossWeight Package gross weight 
 * @property { number } chargeableWeight Package chargeable weight 
 * @property { string } note Package case marks 
 * @property { number } volume Package volume 
 * @property { number } volumetricWeight Package volumetric weight 
 * @property { number } orderNumber Package order number 
 * @property { string } caseMarks Package case marks 
 * @property { string } description Package description 
 * @property { string[] } hsCodes Package HS codes 
 * @property { string } customsRemarks Text for customs 
 * @property { number } loadMeter Load meter 
 * @property { string[] } specialties Package specialties 
 * @property { HazardousSpecialtyDTO } hazardousSpecialty Hazardous specialty details 
 * @property { TemperatureControlledSpecialtyDto } temperatureControlledSpecialty  
 * @property { string } mrn MRN (Movement Reference Number) 
 * @property { string } exportPortFilling Export port filling 
 * @property { boolean } customsReleased Customs released status 
 * @property { string } importCustomsReleaseNumber Import customs release number 
 * @property { string } portCustomsNumber Port customs number 
 */
export const UpdatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().describe("Package quantity").nullable(), packageTypeId: z.string().describe("Package type ID").nullable(), length: z.number().describe("Package length").nullable(), width: z.number().describe("Package width").nullable(), height: z.number().describe("Package height").nullable(), netWeight: z.number().describe("Package net weight").nullable(), grossWeight: z.number().describe("Package gross weight").nullable(), chargeableWeight: z.number().describe("Package chargeable weight").nullable(), note: z.string().describe("Package case marks").nullable(), volume: z.number().describe("Package volume").nullable(), volumetricWeight: z.number().describe("Package volumetric weight").nullable(), orderNumber: z.number().describe("Package order number"), caseMarks: z.string().describe("Package case marks").nullable(), description: z.string().describe("Package description").nullable(), hsCodes: z.array(z.string()).readonly().describe("Package HS codes"), customsRemarks: z.string().describe("Text for customs").nullable(), loadMeter: z.number().describe("Load meter").nullable(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).readonly().describe("Package specialties"), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema.describe("Hazardous specialty details"), temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema, mrn: z.string().describe("MRN (Movement Reference Number)").nullable(), exportPortFilling: z.string().describe("Export port filling").nullable(), customsReleased: z.boolean().describe("Customs released status").nullable(), importCustomsReleaseNumber: z.string().describe("Import customs release number").nullable(), portCustomsNumber: z.string().describe("Port customs number").nullable() }).readonly();
export type UpdatePositionCargoPackageDTO = z.infer<typeof UpdatePositionCargoPackageDTOSchema>;


/** 
 * QuantityOfOriginalBlDocumentsEnumSchema 
 * @type { enum }
 */
export const QuantityOfOriginalBlDocumentsEnumSchema = z.enum(["ZERO", "ONE", "TWO", "THREE"]);
export type QuantityOfOriginalBlDocumentsEnum = z.infer<typeof QuantityOfOriginalBlDocumentsEnumSchema>;
export const QuantityOfOriginalBlDocumentsEnum = QuantityOfOriginalBlDocumentsEnumSchema.enum;

/** 
 * MovementTypeEnumSchema 
 * @type { enum }
 */
export const MovementTypeEnumSchema = z.enum(["DoorToDoor", "PortToPort", "PortToDoor", "DoorToPort"]);
export type MovementTypeEnum = z.infer<typeof MovementTypeEnumSchema>;
export const MovementTypeEnum = MovementTypeEnumSchema.enum;

/** 
 * ChargePaymentEnumSchema 
 * @type { enum }
 */
export const ChargePaymentEnumSchema = z.enum(["Prepaid", "Collect", "PayableElsewhere"]);
export type ChargePaymentEnum = z.infer<typeof ChargePaymentEnumSchema>;
export const ChargePaymentEnum = ChargePaymentEnumSchema.enum;

/** 
 * DocumentConfigDTOSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 */
export const DocumentConfigDTOSchema = z.object({ footerImageUrl: z.string().describe("Footer image URL"), headerImageUrl: z.string().describe("Header image URL") }).readonly();
export type DocumentConfigDTO = z.infer<typeof DocumentConfigDTOSchema>;


/** 
 * EmployeeRoleContextSchema 
 * @type { enum }
 */
export const EmployeeRoleContextSchema = z.enum(["global", "office"]);
export type EmployeeRoleContext = z.infer<typeof EmployeeRoleContextSchema>;
export const EmployeeRoleContext = EmployeeRoleContextSchema.enum;

/** 
 * EmployeeRoleResponseSchema 
 * @type { object }
 * @property { string } id Unique identifier of the role 
 * @property { string } name Name of the role 
 * @property { string } color Color associated with the role 
 * @property { string } description Description of the role 
 * @property { string } context Role context 
 * @property { string[] } permissions Permissions associated with the role 
 */
export const EmployeeRoleResponseSchema = z.object({ id: z.string().describe("Unique identifier of the role"), name: z.string().describe("Name of the role"), color: z.string().describe("Color associated with the role").nullish(), description: z.string().describe("Description of the role").nullish(), context: CommonModels.EmployeeRoleContextSchema.describe("Role context").nullish(), permissions: z.array(z.string()).readonly().describe("Permissions associated with the role") }).readonly();
export type EmployeeRoleResponse = z.infer<typeof EmployeeRoleResponseSchema>;


/** 
 * EmploymentEmployeeResponseSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { boolean } archived Archived 
 * @property { EmployeeRoleResponse[] } roles Global Roles 
 */
export const EmploymentEmployeeResponseSchema = z.object({ id: z.string().describe("Employee ID"), email: z.email().describe("Email"), firstName: z.string().describe("First name"), lastName: z.string().describe("Last name"), phone: z.string().describe("Phone number").nullish(), archived: z.boolean().describe("Archived").nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).readonly().describe("Global Roles").nullish() }).readonly();
export type EmploymentEmployeeResponse = z.infer<typeof EmploymentEmployeeResponseSchema>;


/** 
 * EmployeeOfficeResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeOfficeResponseSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type EmployeeOfficeResponse = z.infer<typeof EmployeeOfficeResponseSchema>;


/** 
 * EmploymentResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { EmployeeOfficeResponse } office  
 * @property { string } employeeId  
 * @property { EmploymentEmployeeResponse } employee  
 * @property { boolean } archived  
 * @property { string } costCenter  
 * @property { EmployeeRoleResponse[] } roles Employment Roles 
 */
export const EmploymentResponseSchema = z.object({ id: z.string(), officeId: z.string(), office: CommonModels.EmployeeOfficeResponseSchema.nullish(), employeeId: z.string(), employee: CommonModels.EmploymentEmployeeResponseSchema.nullish(), archived: z.boolean(), costCenter: z.string().nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).readonly().describe("Employment Roles").nullish() }).readonly();
export type EmploymentResponse = z.infer<typeof EmploymentResponseSchema>;


/** 
 * LoadTypeEnumSchema 
 * @type { enum }
 */
export const LoadTypeEnumSchema = z.enum(["LCL", "FCL", "Trailer", "Container", "BreakBulk", "Roro", "MAFI", "LTL_ROAD", "FTL_ROAD", "Standard"]);
export type LoadTypeEnum = z.infer<typeof LoadTypeEnumSchema>;
export const LoadTypeEnum = LoadTypeEnumSchema.enum;

/** 
 * ServiceTypeEnumSchema 
 * @type { enum }
 */
export const ServiceTypeEnumSchema = z.enum(["InlandTransport", "DoorToPortOfDischarge", "PortOfLoadingToDoor", "DoorToDoor", "PortToPort", "DoorToAirport", "AirportToAirport", "AirportToDoor", "PortOfDischargeRampToDoor"]);
export type ServiceTypeEnum = z.infer<typeof ServiceTypeEnumSchema>;
export const ServiceTypeEnum = ServiceTypeEnumSchema.enum;

/** 
 * DateRangeDtoSchema 
 * @type { object }
 * @property { string } start  
 * @property { string } end  
 */
export const DateRangeDtoSchema = z.object({ start: z.iso.datetime({ offset: true }), end: z.iso.datetime({ offset: true }) }).readonly();
export type DateRangeDto = z.infer<typeof DateRangeDtoSchema>;


/** 
 * BusinessPartnerLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema).readonly().describe("Array of business partner types") }).readonly();
export type BusinessPartnerLabelResponseDTO = z.infer<typeof BusinessPartnerLabelResponseDTOSchema>;


/** 
 * SectionEnumSchema 
 * @type { enum }
 */
export const SectionEnumSchema = z.enum(["Logistics"]);
export type SectionEnum = z.infer<typeof SectionEnumSchema>;
export const SectionEnum = SectionEnumSchema.enum;

/** 
 * FrequencyEnumSchema 
 * @type { enum }
 */
export const FrequencyEnumSchema = z.enum(["Daily", "Weekly", "Monthly"]);
export type FrequencyEnum = z.infer<typeof FrequencyEnumSchema>;
export const FrequencyEnum = FrequencyEnumSchema.enum;

/** 
 * InvoiceDirectionEnumSchema 
 * @type { enum }
 */
export const InvoiceDirectionEnumSchema = z.enum(["Incoming", "Outgoing"]);
export type InvoiceDirectionEnum = z.infer<typeof InvoiceDirectionEnumSchema>;
export const InvoiceDirectionEnum = InvoiceDirectionEnumSchema.enum;

/** 
 * InvoiceTypeEnumSchema 
 * @type { enum }
 */
export const InvoiceTypeEnumSchema = z.enum(["CreditNote", "Invoice", "CollectiveInvoice", "ProForma", "PartialCreditNote", "DirectInvoice"]);
export type InvoiceTypeEnum = z.infer<typeof InvoiceTypeEnumSchema>;
export const InvoiceTypeEnum = InvoiceTypeEnumSchema.enum;

/** 
 * BooleanFilterEnumSchema 
 * @type { enum }
 */
export const BooleanFilterEnumSchema = z.enum(["Yes", "No"]);
export type BooleanFilterEnum = z.infer<typeof BooleanFilterEnumSchema>;
export const BooleanFilterEnum = BooleanFilterEnumSchema.enum;

/** 
 * InvoiceStatusEnumSchema 
 * @type { enum }
 */
export const InvoiceStatusEnumSchema = z.enum(["Credited", "Draft", "Overpaid", "PartiallyPaid", "Outstanding", "Paid", "CreditNote", "ProForma"]);
export type InvoiceStatusEnum = z.infer<typeof InvoiceStatusEnumSchema>;
export const InvoiceStatusEnum = InvoiceStatusEnumSchema.enum;

/** 
 * OfficeInvoiceFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { DateRangeDto } issuingDate  
 * @property { DateRangeDto } serviceDate  
 * @property { InvoiceDirectionEnum[] } invoiceDirection  
 * @property { InvoiceTypeEnum[] } invoiceType  
 * @property { BooleanFilterEnum[] } collective  
 * @property { number } amountMin  
 * @property { number } amountMax  
 * @property { string[] } currencyNotation  
 * @property { string[] } vatRule  
 * @property { DateRangeDto } dueDate  
 * @property { InvoiceStatusEnum[] } status  
 * @property { string[] } receiver Filter by invoice receiver/customer IDs (UUID) 
 * @property { string[] } receiverCountry Filter by invoice receiver/customer country IDs 
 * @property { string[] } salesRep Filter by sales rep id 
 * @property { string } positionNumbersString  
 * @property { string[] } positionNumbers  
 * @property { string } invoiceNumbersString  
 * @property { string[] } invoiceNumbers  
 * @property { BooleanFilterEnum[] } bookkeepingExportStatus  
 * @property { BooleanFilterEnum[] } dunningBlock  
 * @property { BooleanFilterEnum[] } invoiceInReview  
 * @property { BooleanFilterEnum[] } isInvoiceOk  
 * @property { BooleanFilterEnum[] } isVatOk  
 * @property { number } invoiceNumberMin  
 * @property { number } invoiceNumberMax  
 * @property { number } internalNumberMin  
 * @property { number } internalNumberMax  
 * @property { string } externalSystemId Filter invoices by position external system ID (substring match) 
 * @property { string } hblNumber Filter invoices by HBL/HAWB (substring match) 
 * @property { string } mblNumber Filter invoices by MBL/MAWB (substring match) 
 * @property { string } bookingNumber Filter invoices by booking number (substring match) 
 * @property { string } vessel Filter invoices by vessel name (substring match) 
 * @property { string } voyage Filter invoices by voyage number (substring match) 
 * @property { string } creditorId Filter invoices by creditor ID (substring match) 
 * @property { string } debtorId Filter invoices by debtor ID (substring match) 
 */
export const OfficeInvoiceFilterDtoSchema = z.object({ search: z.string(), issuingDate: CommonModels.DateRangeDtoSchema, serviceDate: CommonModels.DateRangeDtoSchema, invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).readonly(), invoiceType: z.array(CommonModels.InvoiceTypeEnumSchema).readonly(), collective: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), amountMin: z.number(), amountMax: z.number(), currencyNotation: z.array(z.string()).readonly(), vatRule: z.array(z.string()).readonly(), dueDate: CommonModels.DateRangeDtoSchema, status: z.array(CommonModels.InvoiceStatusEnumSchema).readonly(), receiver: z.array(z.string()).readonly().describe("Filter by invoice receiver/customer IDs (UUID)"), receiverCountry: z.array(z.string()).readonly().describe("Filter by invoice receiver/customer country IDs"), salesRep: z.array(z.string()).readonly().describe("Filter by sales rep id"), positionNumbersString: z.string(), positionNumbers: z.array(z.string()).readonly(), invoiceNumbersString: z.string(), invoiceNumbers: z.array(z.string()).readonly(), bookkeepingExportStatus: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), dunningBlock: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), invoiceInReview: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), isInvoiceOk: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), isVatOk: z.array(CommonModels.BooleanFilterEnumSchema).readonly(), invoiceNumberMin: z.number(), invoiceNumberMax: z.number(), internalNumberMin: z.number(), internalNumberMax: z.number(), externalSystemId: z.string().describe("Filter invoices by position external system ID (substring match)"), hblNumber: z.string().describe("Filter invoices by HBL/HAWB (substring match)"), mblNumber: z.string().describe("Filter invoices by MBL/MAWB (substring match)"), bookingNumber: z.string().describe("Filter invoices by booking number (substring match)"), vessel: z.string().describe("Filter invoices by vessel name (substring match)"), voyage: z.string().describe("Filter invoices by voyage number (substring match)"), creditorId: z.string().describe("Filter invoices by creditor ID (substring match)"), debtorId: z.string().describe("Filter invoices by debtor ID (substring match)") }).readonly();
export type OfficeInvoiceFilterDto = z.infer<typeof OfficeInvoiceFilterDtoSchema>;


/** 
 * PositionStatusEnumSchema 
 * @type { enum }
 */
export const PositionStatusEnumSchema = z.enum(["Preparing", "NeedsDocumentation", "Executing", "Done"]);
export type PositionStatusEnum = z.infer<typeof PositionStatusEnumSchema>;
export const PositionStatusEnum = PositionStatusEnumSchema.enum;

/** 
 * PositionCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type PositionCustomerDto = z.infer<typeof PositionCustomerDtoSchema>;


/** 
 * PositionQuoteDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PositionQuoteDtoSchema = z.object({ id: z.string(), number: z.string() }).readonly();
export type PositionQuoteDto = z.infer<typeof PositionQuoteDtoSchema>;


/** 
 * ParentPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const ParentPositionDtoSchema = z.object({ id: z.string(), number: z.string() }).readonly();
export type ParentPositionDto = z.infer<typeof ParentPositionDtoSchema>;


/** 
 * PositionTypeEnumSchema 
 * @type { enum }
 */
export const PositionTypeEnumSchema = z.enum(["Sea", "Road", "Air"]);
export type PositionTypeEnum = z.infer<typeof PositionTypeEnumSchema>;
export const PositionTypeEnum = PositionTypeEnumSchema.enum;

/** 
 * PositionProjectLiteDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionProjectLiteDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type PositionProjectLiteDto = z.infer<typeof PositionProjectLiteDtoSchema>;


/** 
 * EmployeeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type EmployeeDto = z.infer<typeof EmployeeDtoSchema>;


/** 
 * PositionCoreResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } rootFolderId  
 * @property { string } externalSystemId  
 * @property { MovementTypeEnum } inttraTypeOfMove  
 * @property { PositionCustomerDto } customer  
 * @property { boolean } isCancelled  
 * @property { string } owningOfficeId  
 * @property { string } originOfficeId  
 * @property { PositionQuoteDto } quote  
 * @property { string } number  
 * @property { SectionEnum } section  
 * @property { DirectionEnum } direction  
 * @property { TransportModeEnum } transportMode  
 * @property { string } statusDate  
 * @property { string } serviceDate  
 * @property { string } dateOfDeparture  
 * @property { string } dateOfArrival  
 * @property { PositionStatusEnum } status  
 * @property { LoadTypeEnum } loadType  
 * @property { IncotermsEnum } incoterms  
 * @property { IncotermsEnum } secondIncoterms  
 * @property { ServiceTypeEnum } serviceType  
 * @property { ParentPositionDto } parentPosition  
 * @property { string } buyRateReference  
 * @property { FrequencyEnum } frequency  
 * @property { PositionTypeEnum } positionType  
 * @property { boolean } isParentPosition  
 * @property { boolean } hasParentPosition  
 * @property { boolean } hasChildPositions  
 * @property { PositionProjectLiteDto } projectLite  
 * @property { boolean } isExcludedFromStatistics  
 * @property { EmployeeDto } salesRep  
 * @property { string } fillingCompany  
 * @property { string } sellingContract  
 * @property { string } fillingScacCode  
 * @property { string } serviceValidity  
 * @property { string } ratesValidity  
 * @property { EmployeeDto } responsibleEmployee  
 * @property { EmployeeDto } receivedByEmployee  
 * @property { string } team  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { EditorContentResponseDto } notes Notes 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 */
export const PositionCoreResponseDtoSchema = z.object({ id: z.string(), rootFolderId: z.string().nullish(), externalSystemId: z.string().nullish(), inttraTypeOfMove: CommonModels.MovementTypeEnumSchema.nullish(), customer: CommonModels.PositionCustomerDtoSchema.nullish(), isCancelled: z.boolean(), owningOfficeId: z.string(), originOfficeId: z.string().nullish(), quote: CommonModels.PositionQuoteDtoSchema.nullish(), number: z.string(), section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, statusDate: z.iso.datetime({ offset: true }), serviceDate: z.iso.datetime({ offset: true }).nullish(), dateOfDeparture: z.iso.datetime({ offset: true }).nullish(), dateOfArrival: z.iso.datetime({ offset: true }).nullish(), status: CommonModels.PositionStatusEnumSchema.nullish(), loadType: CommonModels.LoadTypeEnumSchema.nullish(), incoterms: CommonModels.IncotermsEnumSchema.nullish(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), parentPosition: CommonModels.ParentPositionDtoSchema.nullish(), buyRateReference: z.string().nullish(), frequency: CommonModels.FrequencyEnumSchema.nullish(), positionType: CommonModels.PositionTypeEnumSchema.nullish(), isParentPosition: z.boolean(), hasParentPosition: z.boolean().nullish(), hasChildPositions: z.boolean().nullish(), projectLite: CommonModels.PositionProjectLiteDtoSchema.nullish(), isExcludedFromStatistics: z.boolean(), salesRep: CommonModels.EmployeeDtoSchema.nullish(), fillingCompany: z.string().nullish(), sellingContract: z.string().nullish(), fillingScacCode: z.string().nullish(), serviceValidity: z.iso.datetime({ offset: true }).nullish(), ratesValidity: z.iso.datetime({ offset: true }).nullish(), responsibleEmployee: CommonModels.EmployeeDtoSchema.nullish(), receivedByEmployee: CommonModels.EmployeeDtoSchema.nullish(), team: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), notes: CommonModels.EditorContentResponseDtoSchema.describe("Notes").nullish(), volumetricWeightModifier: z.number().describe("Volumetric weight modifier").nullish() }).readonly();
export type PositionCoreResponseDto = z.infer<typeof PositionCoreResponseDtoSchema>;


/** 
 * VesselDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { number } imo  
 * @property { number } mmsi  
 */
export const VesselDtoSchema = z.object({ name: z.string(), imo: z.number().nullish(), mmsi: z.number().nullish() }).readonly();
export type VesselDto = z.infer<typeof VesselDtoSchema>;


/** 
 * StatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Status 
 * @property { string } message Message 
 * @property { string } code Alphanumeric code of the message type 
 */
export const StatusResponseDtoSchema = z.object({ status: z.string().describe("Status"), message: z.string().describe("Message"), code: z.string().describe("Alphanumeric code of the message type") }).readonly();
export type StatusResponseDto = z.infer<typeof StatusResponseDtoSchema>;


/** 
 * PaginationDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const PaginationDtoSchema = z.object({ items: z.array(z.string()).readonly().describe("Items"), page: z.number().describe("1-indexed page number to begin from").nullish(), cursor: z.string().describe("ID of item to start after").nullish(), nextCursor: z.string().describe("Cursor for next set of items").nullish(), limit: z.number().describe("Items per response"), totalItems: z.number().describe("Total available items") }).readonly();
export type PaginationDto = z.infer<typeof PaginationDtoSchema>;


/** 
 * LabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const LabelResponseDTOSchema = z.object({ id: z.string(), label: z.string() }).readonly();
export type LabelResponseDTO = z.infer<typeof LabelResponseDTOSchema>;


/** 
 * GenerateWorkingDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 * @property { string } fileName  
 */
export const GenerateWorkingDocumentRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullish(), fileName: z.string() }).readonly();
export type GenerateWorkingDocumentRequestDto = z.infer<typeof GenerateWorkingDocumentRequestDtoSchema>;


/** 
 * UpdateInvolvedPartyDtoSchema 
 * @type { object }
 * @property { string } reference  
 * @property { string } businessPartnerId  
 * @property { string } contactId  
 */
export const UpdateInvolvedPartyDtoSchema = z.object({ reference: z.string(), businessPartnerId: z.string(), contactId: z.string() }).readonly();
export type UpdateInvolvedPartyDto = z.infer<typeof UpdateInvolvedPartyDtoSchema>;


/** 
 * MergeRoutesRequestDtoSchema 
 * @type { object }
 * @property { string } sourceCargoId Source cargo ID to merge from (sea positions only) 
 */
export const MergeRoutesRequestDtoSchema = z.object({ sourceCargoId: z.string().describe("Source cargo ID to merge from (sea positions only)").nullable() }).readonly();
export type MergeRoutesRequestDto = z.infer<typeof MergeRoutesRequestDtoSchema>;


/** 
 * CopyRouteRequestDtoSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to copy to (sea positions only) 
 */
export const CopyRouteRequestDtoSchema = z.object({ targetCargoId: z.string().describe("Target cargo ID to copy to (sea positions only)").nullable() }).readonly();
export type CopyRouteRequestDto = z.infer<typeof CopyRouteRequestDtoSchema>;


/** 
 * CargoSummaryResponseDTOSchema 
 * @type { object }
 * @property { string } transportUnitTypeName Transport unit type name (e.g., "40' DRY", "20'") 
 * @property { number } quantity Total quantity of this transport unit type 
 */
export const CargoSummaryResponseDTOSchema = z.object({ transportUnitTypeName: z.string().describe("Transport unit type name (e.g., "40' DRY", "20'")"), quantity: z.number().describe("Total quantity of this transport unit type") }).readonly();
export type CargoSummaryResponseDTO = z.infer<typeof CargoSummaryResponseDTOSchema>;


/** 
 * CreatePositionCargoDTOSchema 
 * @type { object }
 * @property { string } cargoTypeId Cargo type ID 
 * @property { string } note  
 * @property { boolean } autoCalculateTotals  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { string } textForCustoms  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 */
export const CreatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().describe("Cargo type ID"), note: z.string(), autoCalculateTotals: z.boolean(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean(), autoCalculateVgm: z.boolean() }).readonly();
export type CreatePositionCargoDTO = z.infer<typeof CreatePositionCargoDTOSchema>;


/** 
 * UpdatePositionCargoDTOSchema 
 * @type { object }
 * @property { string } cargoTypeId Cargo type ID 
 * @property { string } note  
 * @property { boolean } autoCalculateTotals  
 * @property { string } transportUnitNumber  
 * @property { string } seal1  
 * @property { string } seal2  
 * @property { number } totalVolume  
 * @property { number } totalGrossWeight  
 * @property { number } totalNetWeight  
 * @property { number } totalVolumetricWeight  
 * @property { number } totalChargeableWeight  
 * @property { number } totalLoadMeter  
 * @property { string } rateOptions  
 * @property { string } rateClass  
 * @property { number } ratePerKg  
 * @property { number } totalRate  
 * @property { string } textForCustoms  
 * @property { number } tare  
 * @property { number } vgm  
 * @property { boolean } autoCalculateRates  
 * @property { boolean } autoCalculateVgm  
 */
export const UpdatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().describe("Cargo type ID"), note: z.string(), autoCalculateTotals: z.boolean(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean(), autoCalculateVgm: z.boolean() }).readonly();
export type UpdatePositionCargoDTO = z.infer<typeof UpdatePositionCargoDTOSchema>;


/** 
 * MovePositionCargoPackageRequestDTOSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to move the package to 
 */
export const MovePositionCargoPackageRequestDTOSchema = z.object({ targetCargoId: z.string().describe("Target cargo ID to move the package to") }).readonly();
export type MovePositionCargoPackageRequestDTO = z.infer<typeof MovePositionCargoPackageRequestDTOSchema>;


/** 
 * PositionCargoPaginationOrderFieldSchema 
 * @type { enum }
 */
export const PositionCargoPaginationOrderFieldSchema = z.enum(["createdAt", "updatedAt"]);
export type PositionCargoPaginationOrderField = z.infer<typeof PositionCargoPaginationOrderFieldSchema>;
export const PositionCargoPaginationOrderField = PositionCargoPaginationOrderFieldSchema.enum;

/** 
 * PositionAvailablePartnersUseCaseSchema 
 * @type { enum }
 */
export const PositionAvailablePartnersUseCaseSchema = z.enum(["financeCustomer", "financeVendor"]);
export type PositionAvailablePartnersUseCase = z.infer<typeof PositionAvailablePartnersUseCaseSchema>;
export const PositionAvailablePartnersUseCase = PositionAvailablePartnersUseCaseSchema.enum;

}
