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
export const FolderEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
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
export const FileResponseDTOSchema = z.object({ id: z.string(), name: z.string(), archived: z.boolean(), isSystem: z.boolean(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), createdBy: CommonModels.FolderEmployeeDTOSchema, updatedBy: CommonModels.FolderEmployeeDTOSchema, downloadUrl: z.string().nullish() });
export type FileResponseDTO = z.infer<typeof FileResponseDTOSchema>;

/** 
 * EditorContentUpdateDtoSchema 
 * @type { object }
 * @property { string } html  
 * @property { object } json  
 * @property { any } json.[key]  
 */
export const EditorContentUpdateDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type EditorContentUpdateDto = z.infer<typeof EditorContentUpdateDtoSchema>;

/** 
 * RemarkBlockDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 */
export const RemarkBlockDTOSchema = z.object({ id: z.string().nullable(), enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), content: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type RemarkBlockDTO = z.infer<typeof RemarkBlockDTOSchema>;

/** 
 * TitleBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { string } defaultTitle  
 * @property { boolean } includePositionNumber  
 * @property { boolean } allowManualOverride  
 */
export const TitleBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), defaultTitle: z.string().nullable(), includePositionNumber: z.boolean().nullable(), allowManualOverride: z.boolean().nullable() }).partial();
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
export const ReceiverBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), defaultRole: CommonModels.PositionInvolvedPartyTypeEnumSchema.nullable() }).partial();
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
export const OurInformationBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), showName: z.boolean().nullable(), showPhone: z.boolean().nullable(), showDate: z.boolean().nullable(), showBookingNumber: z.boolean().nullable(), showCustomerReference: z.boolean().nullable(), showMasterBillOfLadingNumber: z.boolean().nullable(), showHouseBillOfLadingNumber: z.boolean().nullable() }).partial();
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
export const RouteTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), showDate: z.boolean().nullable(), showLocation: z.boolean().nullable(), showType: z.boolean().nullable(), showReference: z.boolean().nullable(), showVesselVoyage: z.boolean().nullable(), showAddress: z.boolean().nullable(), showProvider: z.boolean().nullable() }).partial();
export type RouteTableBlockDTO = z.infer<typeof RouteTableBlockDTOSchema>;

/** 
 * CargoTableBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable() }).partial();
export type CargoTableBlockDTO = z.infer<typeof CargoTableBlockDTOSchema>;

/** 
 * CargoSummaryBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { number } position 1-based order in the rendered document. Minimum: `1` 
 */
export const CargoSummaryBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable() }).partial();
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
export const FinanceTableBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), showOnlyForReceiver: z.boolean().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showProfit: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), showTotal: z.boolean().nullable() }).partial();
export type FinanceTableBlockDTO = z.infer<typeof FinanceTableBlockDTOSchema>;

/** 
 * FooterBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const FooterBlockDTOSchema = z.object({ enabled: z.boolean().nullable() }).partial();
export type FooterBlockDTO = z.infer<typeof FooterBlockDTOSchema>;

/** 
 * TermsBlockDTOSchema 
 * @type { object }
 * @property { boolean } enabled  
 */
export const TermsBlockDTOSchema = z.object({ enabled: z.boolean().nullable() }).partial();
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
export const CutOffDatesBlockDTOSchema = z.object({ enabled: z.boolean().nullable(), position: z.number().gte(1).nullable(), billOfLadingFromCustomer: z.boolean().nullable(), billOfLadingToCarrier: z.boolean().nullable(), customsAMS: z.boolean().nullable(), vgmCustomer: z.boolean().nullable() }).partial();
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
export const TemplateBlocksResponseDTOSchema = z.object({ titleBlock: CommonModels.TitleBlockDTOSchema.nullable(), receiverBlock: CommonModels.ReceiverBlockDTOSchema.nullable(), ourInformationBlock: CommonModels.OurInformationBlockDTOSchema.nullable(), routeTableBlock: CommonModels.RouteTableBlockDTOSchema.nullable(), cargoTableBlock: CommonModels.CargoTableBlockDTOSchema.nullable(), cargoSummaryBlock: CommonModels.CargoSummaryBlockDTOSchema.nullable(), financeTableBlock: CommonModels.FinanceTableBlockDTOSchema.nullable(), remarkBlocks: z.array(CommonModels.RemarkBlockDTOSchema).nullable(), footerBlock: CommonModels.FooterBlockDTOSchema.nullable(), termsBlock: CommonModels.TermsBlockDTOSchema.nullable(), cutOffDatesBlock: CommonModels.CutOffDatesBlockDTOSchema.nullable() }).partial();
export type TemplateBlocksResponseDTO = z.infer<typeof TemplateBlocksResponseDTOSchema>;

/** 
 * RouteTableProviderDtoSchema 
 * @type { object }
 * @property { string } id Provider ID 
 * @property { string } name Provider name 
 */
export const RouteTableProviderDtoSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
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
export const RouteTablePointDtoSchema = z.object({ id: z.string(), type: z.string(), datetime: z.string().nullish(), secondaryDatetime: z.string().nullish(), address: z.string().nullish(), name: z.string().nullish(), reference: z.string().nullish(), provider: CommonModels.RouteTableProviderDtoSchema.nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), carrier: z.string().nullish() });
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
export const RouteTableBlockResponseDtoSchema = z.object({ selectedRouteId: z.string().nullish(), selectedRoutePointIds: z.array(z.string()), showReference: z.boolean(), showVesselVoyage: z.boolean(), showProvider: z.boolean(), points: z.array(CommonModels.RouteTablePointDtoSchema).nullish(), showAddress: z.boolean().nullish(), showDates: z.boolean(), showType: z.boolean(), showLocation: z.boolean(), showGrid: z.boolean(), suppressRoute: z.boolean() });
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
export const CargoSpecialtyDtoSchema = z.object({ name: CommonModels.PositionCargoPackageEnumSchema, unNumber: z.string().nullish(), IMOClass: z.string().nullish(), temperatureFrom: z.number().nullish(), temperatureUntil: z.number().nullish() });
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
export const CargoPackageDtoSchema = z.object({ id: z.string(), description: z.string().nullish(), weight: z.string().nullish(), hsCodes: z.string().nullish(), quantity: z.number().nullish(), width: z.number().nullish(), length: z.number().nullish(), height: z.number().nullish(), volume: z.number().nullish(), packageType: z.string().nullish(), caseMarks: z.string().nullish(), specialties: z.array(CommonModels.CargoSpecialtyDtoSchema).nullish(), chargeableWeight: z.number().nullish(), volumetricWeight: z.number().nullish() });
export type CargoPackageDto = z.infer<typeof CargoPackageDtoSchema>;

/** 
 * CargoItemRouteDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 * @property { RouteTablePointDto[] } points Route points 
 */
export const CargoItemRouteDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()), points: z.array(CommonModels.RouteTablePointDtoSchema).nullish() });
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
export const CargoItemDtoSchema = z.object({ cargoId: z.string(), cargoType: z.string(), containerNumber: z.string().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), vgm: z.string().nullish(), totalGrossWeight: z.number().nullish(), totalVolume: z.number().nullish(), chargeableWeight: z.number().nullish(), volumetricWeight: z.number().nullish(), packages: z.array(CommonModels.CargoPackageDtoSchema), selectedPackageIds: z.array(z.string()), route: CommonModels.CargoItemRouteDtoSchema.nullish() });
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
export const CargoTableBlockDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).nullish(), suppressWeight: z.boolean().nullish(), showGrid: z.boolean().nullish(), suppressVolume: z.boolean().nullish(), suppressSpecialities: z.boolean().nullish(), suppressDimensions: z.boolean().nullish(), suppressPackageVolume: z.boolean().nullish(), suppressPackageWeight: z.boolean().nullish(), showGrandTotal: z.boolean().nullish(), showTransportUnitTotal: z.boolean().nullish(), showRoute: z.boolean().nullish(), suppressCargo: z.boolean().nullish(), showTransportUnitChargeableWeight: z.boolean().nullish(), showTransportUnitVolumetricWeight: z.boolean().nullish(), showPackageChargeableWeight: z.boolean().nullish(), showPackageVolumetricWeight: z.boolean().nullish(), showPackageHSCodes: z.boolean().nullish(), showPackageType: z.boolean().nullish(), showPackageQuantity: z.boolean().nullish(), showPackageDescription: z.boolean().nullish(), showPackageCaseMarks: z.boolean().nullish(), showTransportUnitNumber: z.boolean().nullish(), showTransportUnitType: z.boolean().nullish(), showTransportUnitSeal1: z.boolean().nullish(), showTransportUnitSeal2: z.boolean().nullish(), items: z.array(CommonModels.CargoItemDtoSchema) });
export type CargoTableBlockDto = z.infer<typeof CargoTableBlockDtoSchema>;

/** 
 * SummaryCargoItemDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { number } quantity Count of cargos for this type 
 * @property { string } description Comma-joined transport unit numbers or custom description 
 */
export const SummaryCargoItemDtoSchema = z.object({ transportUnitType: z.string(), quantity: z.number(), description: z.string() });
export type SummaryCargoItemDto = z.infer<typeof SummaryCargoItemDtoSchema>;

/** 
 * SummaryCargoBlockResponseDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemDto[] } items  
 */
export const SummaryCargoBlockResponseDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemDtoSchema) });
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
export const FinanceRowDtoSchema = z.object({ id: z.string(), type: CommonModels.PositionAccountItemTypeEnumSchema, chargeType: z.string().nullish(), additionalText: z.string().nullish(), text: z.string().nullish(), buyAmount: z.number().nullish(), buyCurrencyNotation: z.string().nullish(), sellAmount: z.number().nullish(), sellCurrencyNotation: z.string().nullish(), buyBPName: z.string().nullish(), sellBPName: z.string().nullish(), sellExchangeRate: z.number().nullish(), buyExchangeRate: z.number().nullish(), quantity: z.number().nullish() });
export type FinanceRowDto = z.infer<typeof FinanceRowDtoSchema>;

/** 
 * FinanceTotalsDtoSchema 
 * @type { object }
 * @property { number } customerTotal Customer total 
 * @property { number } vendorTotal Vendor total 
 * @property { number } combinedTotal Combined total 
 * @property { string } currencyNotation Currency notation 
 */
export const FinanceTotalsDtoSchema = z.object({ customerTotal: z.number().nullable(), vendorTotal: z.number().nullable(), combinedTotal: z.number().nullable(), currencyNotation: z.string().nullable() }).partial();
export type FinanceTotalsDto = z.infer<typeof FinanceTotalsDtoSchema>;

/** 
 * FinanceTotalsByCurrencyDtoSchema 
 * @type { object }
 * @property { string } currencyNotation Currency notation 
 * @property { number } vendorTotal Total for vendor side in this currency 
 * @property { number } customerTotal Total for customer side in this currency 
 */
export const FinanceTotalsByCurrencyDtoSchema = z.object({ currencyNotation: z.string(), vendorTotal: z.number().nullish(), customerTotal: z.number().nullish() });
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
export const FinanceTablePositionDtoSchema = z.object({ rows: z.array(CommonModels.FinanceRowDtoSchema).nullable(), totals: CommonModels.FinanceTotalsDtoSchema.nullable(), selectedFinanceRowIds: z.array(z.string()).nullable(), positionId: z.string().nullable(), positionNumber: z.string().nullable(), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).nullable() }).partial();
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
export const FinanceTableBlockDtoSchema = z.object({ selectedBpId: z.string().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), suppressFinances: z.boolean().nullable(), suppressZeroLines: z.boolean().nullable(), showTotal: z.boolean().nullable(), showProfit: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), positions: z.array(CommonModels.FinanceTablePositionDtoSchema).nullable(), totals: CommonModels.FinanceTotalsDtoSchema.nullable(), totalsByCurrency: z.array(CommonModels.FinanceTotalsByCurrencyDtoSchema).nullable() }).partial();
export type FinanceTableBlockDto = z.infer<typeof FinanceTableBlockDtoSchema>;

/** 
 * RemarkBlockDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockDtoSchema = z.object({ id: z.string(), position: z.number().gte(1), content: CommonModels.EditorContentUpdateDtoSchema, enabled: z.boolean().nullish() });
export type RemarkBlockDto = z.infer<typeof RemarkBlockDtoSchema>;

/** 
 * ConfigBlockDtoSchema 
 * @type { object }
 * @property { string } footerImageUrl Footer image URL 
 * @property { string } headerImageUrl Header image URL 
 * @property { boolean } showWatermarkOnDocuments Show watermark on documents 
 * @property { LocaleEnum } locale  
 */
export const ConfigBlockDtoSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable(), showWatermarkOnDocuments: z.boolean().nullable(), locale: CommonModels.LocaleEnumSchema.nullable() }).partial();
export type ConfigBlockDto = z.infer<typeof ConfigBlockDtoSchema>;

/** 
 * TitleBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } value Title value 
 */
export const TitleBlockUpdateDtoSchema = z.object({ value: z.string().nullable() }).partial();
export type TitleBlockUpdateDto = z.infer<typeof TitleBlockUpdateDtoSchema>;

/** 
 * ReceiverBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } selectedBpId Receiver business partner ID 
 * @property { string } address Receiver address 
 */
export const ReceiverBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().nullable(), address: z.string().nullable() }).partial();
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
export const OurInformationBlockUpdateDtoSchema = z.object({ name: z.string().nullable(), phone: z.string().nullable(), date: z.string().nullable(), bookingNumber: z.string().nullable(), customerReference: z.string().nullable(), masterBillOfLadingNumber: z.string().nullable(), houseBillOfLadingNumber: z.string().nullable(), positionNumber: z.string().nullable() }).partial();
export type OurInformationBlockUpdateDto = z.infer<typeof OurInformationBlockUpdateDtoSchema>;

/** 
 * TermsBlockDtoSchema 
 * @type { object }
 * @property { string } termsImageUrl Terms image URL 
 */
export const TermsBlockDtoSchema = z.object({ termsImageUrl: z.string().nullable() }).partial();
export type TermsBlockDto = z.infer<typeof TermsBlockDtoSchema>;

/** 
 * CutOffDatesBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } billOfLadingFromCustomer Bill of lading from customer date 
 * @property { string } billOfLadingToCarrier Bill of lading to carrier date 
 * @property { string } customsAMS Customs AMS date 
 * @property { string } vgmCustomer VGM customer date 
 */
export const CutOffDatesBlockUpdateDtoSchema = z.object({ billOfLadingFromCustomer: z.string().nullable(), billOfLadingToCarrier: z.string().nullable(), customsAMS: z.string().nullable(), vgmCustomer: z.string().nullable() }).partial();
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
export const TemplatedDocumentDataDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.nullable(), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.nullable(), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.nullable(), routeTable: CommonModels.RouteTableBlockResponseDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockDtoSchema.nullable(), summaryCargo: CommonModels.SummaryCargoBlockResponseDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockDtoSchema.nullable(), remarks: z.array(CommonModels.RemarkBlockDtoSchema).nullable(), terms: CommonModels.TermsBlockDtoSchema.nullable(), config: CommonModels.ConfigBlockDtoSchema.nullable(), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.nullable() }).partial();
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
export const RouteTableUpdateBlockDtoSchema = z.object({ selectedRouteId: z.string().nullable(), selectedRoutePointIds: z.array(z.string()).nullable(), showReference: z.boolean().nullable(), showVesselVoyage: z.boolean().nullable(), showProvider: z.boolean().nullable(), points: z.array(CommonModels.RouteTablePointDtoSchema).nullable(), showAddress: z.boolean().nullable(), showDates: z.boolean().nullable(), showType: z.boolean().nullable(), showLocation: z.boolean().nullable(), showGrid: z.boolean().nullable(), suppressRoute: z.boolean().nullable() }).partial();
export type RouteTableUpdateBlockDto = z.infer<typeof RouteTableUpdateBlockDtoSchema>;

/** 
 * CargoItemRouteUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedRoutePointIds Selected route point IDs 
 */
export const CargoItemRouteUpdateDtoSchema = z.object({ selectedRoutePointIds: z.array(z.string()) });
export type CargoItemRouteUpdateDto = z.infer<typeof CargoItemRouteUpdateDtoSchema>;

/** 
 * CargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } cargoId Cargo ID to update packages for 
 * @property { string[] } selectedPackageIds Selected cargo package IDs 
 * @property { CargoItemRouteUpdateDto } route Cargo route (when routes are split) 
 */
export const CargoItemUpdateDtoSchema = z.object({ cargoId: z.string().nullable(), selectedPackageIds: z.array(z.string()).nullable(), route: CommonModels.CargoItemRouteUpdateDtoSchema.nullable() }).partial();
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
export const CargoTableBlockUpdateDtoSchema = z.object({ selectedCargoIds: z.array(z.string()).nullable(), items: z.array(CommonModels.CargoItemUpdateDtoSchema).nullable(), suppressWeight: z.boolean().nullable(), showGrid: z.boolean().nullable(), suppressVolume: z.boolean().nullable(), suppressSpecialities: z.boolean().nullable(), suppressDimensions: z.boolean().nullable(), suppressPackageVolume: z.boolean().nullable(), suppressPackageWeight: z.boolean().nullable(), showRoute: z.boolean().nullable(), showGrandTotal: z.boolean().nullable(), showTransportUnitTotal: z.boolean().nullable(), suppressCargo: z.boolean().nullable(), showTransportUnitChargeableWeight: z.boolean().nullable(), showTransportUnitVolumetricWeight: z.boolean().nullable(), showPackageChargeableWeight: z.boolean().nullable(), showPackageVolumetricWeight: z.boolean().nullable(), showPackageHSCodes: z.boolean().nullable(), showPackageType: z.boolean().nullable(), showPackageQuantity: z.boolean().nullable(), showPackageDescription: z.boolean().nullable(), showPackageCaseMarks: z.boolean().nullable(), showTransportUnitNumber: z.boolean().nullable(), showTransportUnitType: z.boolean().nullable(), showTransportUnitSeal1: z.boolean().nullable(), showTransportUnitSeal2: z.boolean().nullable() }).partial();
export type CargoTableBlockUpdateDto = z.infer<typeof CargoTableBlockUpdateDtoSchema>;

/** 
 * SummaryCargoItemUpdateDtoSchema 
 * @type { object }
 * @property { string } transportUnitType Cargo type name (transport unit type) 
 * @property { string } description Updated description for this cargo type 
 */
export const SummaryCargoItemUpdateDtoSchema = z.object({ transportUnitType: z.string(), description: z.string() });
export type SummaryCargoItemUpdateDto = z.infer<typeof SummaryCargoItemUpdateDtoSchema>;

/** 
 * SummaryCargoBlockUpdateDtoSchema 
 * @type { object }
 * @property { SummaryCargoItemUpdateDto[] } items  
 */
export const SummaryCargoBlockUpdateDtoSchema = z.object({ items: z.array(CommonModels.SummaryCargoItemUpdateDtoSchema) });
export type SummaryCargoBlockUpdateDto = z.infer<typeof SummaryCargoBlockUpdateDtoSchema>;

/** 
 * FinanceTablePositionUpdateDtoSchema 
 * @type { object }
 * @property { string[] } selectedFinanceRowIds Selected finance row IDs 
 * @property { string } positionId Position ID 
 */
export const FinanceTablePositionUpdateDtoSchema = z.object({ selectedFinanceRowIds: z.array(z.string()).nullable(), positionId: z.string().nullable() }).partial();
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
export const FinanceTableBlockUpdateDtoSchema = z.object({ selectedBpId: z.string().nullable(), showVendor: z.boolean().nullable(), showBuyRate: z.boolean().nullable(), showCustomer: z.boolean().nullable(), showSellRate: z.boolean().nullable(), showGrid: z.boolean().nullable(), showCharges: z.boolean().nullable(), showAdditionalText: z.boolean().nullable(), showQuantity: z.boolean().nullable(), showTotalsByCurrency: z.boolean().nullable(), suppressFinances: z.boolean().nullable(), suppressZeroLines: z.boolean().nullable(), showTotal: z.boolean().nullable(), showProfit: z.boolean().nullable(), showBuyRateExchangeRates: z.boolean().nullable(), showSellRateExchangeRates: z.boolean().nullable(), includeSubPositions: z.boolean().nullable(), subPositionTotals: z.boolean().nullable(), positions: z.array(CommonModels.FinanceTablePositionUpdateDtoSchema).nullable() }).partial();
export type FinanceTableBlockUpdateDto = z.infer<typeof FinanceTableBlockUpdateDtoSchema>;

/** 
 * RemarkBlockUpdateDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } position Minimum: `1` 
 * @property { EditorContentUpdateDto } content  
 * @property { boolean } enabled  
 */
export const RemarkBlockUpdateDtoSchema = z.object({ id: z.string(), position: z.number().gte(1).nullish(), content: CommonModels.EditorContentUpdateDtoSchema.nullish(), enabled: z.boolean().nullish() });
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
export const TemplatedDocumentDataUpdateDtoSchema = z.object({ title: CommonModels.TitleBlockUpdateDtoSchema.nullable(), receiver: CommonModels.ReceiverBlockUpdateDtoSchema.nullable(), ourInformation: CommonModels.OurInformationBlockUpdateDtoSchema.nullable(), routeTable: CommonModels.RouteTableUpdateBlockDtoSchema.nullable(), cargoTable: CommonModels.CargoTableBlockUpdateDtoSchema.nullable(), summaryCargo: CommonModels.SummaryCargoBlockUpdateDtoSchema.nullable(), financeTable: CommonModels.FinanceTableBlockUpdateDtoSchema.nullable(), remarks: z.array(CommonModels.RemarkBlockUpdateDtoSchema).nullable(), cutOffDates: CommonModels.CutOffDatesBlockUpdateDtoSchema.nullable() }).partial();
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
export const BusinessPartnerAddressCityDtoSchema = z.object({ id: z.string(), name: z.string() });
export type BusinessPartnerAddressCityDto = z.infer<typeof BusinessPartnerAddressCityDtoSchema>;

/** 
 * BusinessPartnerAddressCountryDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } isoCode2  
 * @property { string } isoCode3  
 */
export const BusinessPartnerAddressCountryDtoSchema = z.object({ id: z.string(), name: z.string(), isoCode2: z.string(), isoCode3: z.string() });
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
export const BusinessPartnerAddressResponseDTOSchema = z.object({ id: z.string(), street: z.string(), secondaryStreet: z.string(), zip: z.string(), city: CommonModels.BusinessPartnerAddressCityDtoSchema, district: z.string(), country: CommonModels.BusinessPartnerAddressCountryDtoSchema });
export type BusinessPartnerAddressResponseDTO = z.infer<typeof BusinessPartnerAddressResponseDTOSchema>;

/** 
 * EditorContentResponseDtoSchema 
 * @type { object }
 * @property { string } html HTML content 
 * @property { object } json JSON content 
 * @property { any } json.[key]  
 */
export const EditorContentResponseDtoSchema = z.object({ html: z.string().nullable(), json: z.object({}).catchall(z.any()).nullable() }).partial();
export type EditorContentResponseDto = z.infer<typeof EditorContentResponseDtoSchema>;

/** 
 * DunningSystemReferenceDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { boolean } isDefault  
 */
export const DunningSystemReferenceDTOSchema = z.object({ id: z.string(), name: z.string(), isDefault: z.boolean() });
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
export const InvolvedPartyBusinessPartnerResponseDTOSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), address: CommonModels.BusinessPartnerAddressResponseDTOSchema.nullish() });
export type InvolvedPartyBusinessPartnerResponseDTO = z.infer<typeof InvolvedPartyBusinessPartnerResponseDTOSchema>;

/** 
 * InvolvedPartyContactResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const InvolvedPartyContactResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
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
export const InvolvedPartyResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.PositionInvolvedPartyTypeEnumSchema, reference: z.string().nullish(), businessPartner: CommonModels.InvolvedPartyBusinessPartnerResponseDTOSchema.nullish(), contact: CommonModels.InvolvedPartyContactResponseDTOSchema.nullish() });
export type InvolvedPartyResponseDto = z.infer<typeof InvolvedPartyResponseDtoSchema>;

/** 
 * CreateInvolvedPartyRequestDtoSchema 
 * @type { object }
 * @property { PositionInvolvedPartyTypeEnum } type Type of the involved party to create 
 */
export const CreateInvolvedPartyRequestDtoSchema = z.object({ type: CommonModels.PositionInvolvedPartyTypeEnumSchema });
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
export const RoutePointLocationResponseDtoSchema = z.object({ id: z.string(), name: z.string(), type: CommonModels.RouteLocationTypeEnumSchema.nullable() });
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
export const RoutePointProviderResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
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
export const RoutePointResponseDtoSchema = z.object({ id: z.string(), type: CommonModels.RoutePointTypeEnumSchema, name: z.string(), sequenceNumber: z.number(), location: CommonModels.RoutePointLocationResponseDtoSchema.nullish(), estimatedTime: z.iso.datetime({ offset: true }).nullish(), secondaryEstimatedTime: z.iso.datetime({ offset: true }).nullish(), reference: z.string().nullish(), secondaryReference: z.string().nullish(), incoterm: CommonModels.IncotermsEnumSchema.nullish(), transportMode: CommonModels.PositionRouteTransportModeEnumSchema.nullish(), provider: CommonModels.RoutePointProviderResponseDtoSchema.nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), carrier: z.string().nullish() });
export type RoutePointResponseDto = z.infer<typeof RoutePointResponseDtoSchema>;

/** 
 * RouteResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } cargoId Cargo ID (sea positions only) 
 * @property { string } cargoNumber Cargo number (sea positions only) 
 * @property { RoutePointResponseDto[] } points  
 */
export const RouteResponseDtoSchema = z.object({ id: z.string(), cargoId: z.string().nullish(), cargoNumber: z.string().nullish(), points: z.array(CommonModels.RoutePointResponseDtoSchema) });
export type RouteResponseDto = z.infer<typeof RouteResponseDtoSchema>;

/** 
 * RouteListResponseDtoSchema 
 * @type { object }
 * @property { RouteResponseDto[] } routes  
 * @property { boolean } splitRoute Whether the position routes are split by cargo (sea positions only) 
 */
export const RouteListResponseDtoSchema = z.object({ routes: z.array(CommonModels.RouteResponseDtoSchema), splitRoute: z.boolean() });
export type RouteListResponseDto = z.infer<typeof RouteListResponseDtoSchema>;

/** 
 * CreateRoutePointRequestDtoSchema 
 * @type { object }
 * @property { RoutePointTypeEnum } type  
 */
export const CreateRoutePointRequestDtoSchema = z.object({ type: CommonModels.RoutePointTypeEnumSchema });
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
export const UpdateRoutePointRequestDtoSchema = z.object({ locationId: z.string().nullable(), locationType: CommonModels.RouteLocationTypeEnumSchema.nullable(), estimatedTime: z.iso.datetime({ offset: true }).nullable(), secondaryEstimatedTime: z.iso.datetime({ offset: true }).nullable(), reference: z.string().nullable(), secondaryReference: z.string().nullable(), incoterm: CommonModels.IncotermsEnumSchema.nullable(), transportMode: CommonModels.PositionRouteTransportModeEnumSchema.nullable(), providerId: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), carrier: z.string().nullable() }).partial();
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
export const PositionChargeDtoResponseSchema = z.object({ chargeType: z.object({ id: z.string(), name: z.string() }).nullish(), additionalText: z.string(), quantity: z.number().nullish(), buyRate: z.number().nullish(), buyCurrencyCode: z.string(), buyVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).nullish(), vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).nullish(), buyExchangeRate: z.number().nullish(), sellRate: z.number().nullish(), sellCurrencyCode: z.string(), sellVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string() }).nullish(), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish() }).nullish(), sellExchangeRate: z.number().nullish(), profit: z.number().nullish(), profitCurrencyCode: z.string().nullish() });
export type PositionChargeDtoResponse = z.infer<typeof PositionChargeDtoResponseSchema>;

/** 
 * PositionTextDtoResponseSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const PositionTextDtoResponseSchema = z.object({ content: z.string() });
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
export const PositionAccountItemDtoResponseSchema = z.object({ id: z.string(), outgoingInvoiceId: z.string().nullish(), registeredInvoiceId: z.string().nullish(), type: CommonModels.PositionAccountItemTypeEnumSchema, orderPosition: z.number(), charge: CommonModels.PositionChargeDtoResponseSchema.nullish(), text: CommonModels.PositionTextDtoResponseSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }) });
export type PositionAccountItemDtoResponse = z.infer<typeof PositionAccountItemDtoResponseSchema>;

/** 
 * UserPreviewDtoSchema 
 * @type { object }
 * @property { string } userId  
 * @property { string } name  
 */
export const UserPreviewDtoSchema = z.object({ userId: z.string(), name: z.string() });
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
export const HBLDocumentConfigDtoSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable(), blTermsAndConditionsImageUrl: z.string().nullable(), signatureImageUrl: z.string().nullable(), hasSignatureImage: z.boolean().nullable() }).partial();
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
export const PositionCargoPackageHazardousSpecialtyResponseDTOSchema = z.object({ totalLength: z.number().nullable(), totalWidth: z.number().nullable(), temperature: z.number().nullable(), unNumber: z.string().nullable(), IMOClass: z.string().nullable(), shippingName: z.string().nullable(), technicalName: z.string().nullable(), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema.nullable(), netWeight: z.number().nullable(), flashpoint: z.number().nullable(), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).nullable(), acceptanceNumber: z.string().nullable(), medGuide: z.string().nullable(), emergencyPhone: z.string().nullable(), emergencySchedule: z.string().nullable() }).partial();
export type PositionCargoPackageHazardousSpecialtyResponseDTO = z.infer<typeof PositionCargoPackageHazardousSpecialtyResponseDTOSchema>;

/** 
 * PositionCargoPackageTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionCargoPackageTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string() });
export type PositionCargoPackageTypeResponseDTO = z.infer<typeof PositionCargoPackageTypeResponseDTOSchema>;

/** 
 * HsCodeLabelDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const HsCodeLabelDtoSchema = z.object({ id: z.string(), label: z.string() });
export type HsCodeLabelDto = z.infer<typeof HsCodeLabelDtoSchema>;

/** 
 * PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema = z.object({ temperatureFrom: z.number().nullable(), temperatureUntil: z.number().nullable() }).partial();
export type PositionCargoPackageTemperatureControlledSpecialtyResponseDto = z.infer<typeof PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema>;

/** 
 * PositionCargoSourcePackageResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } positionNumber  
 */
export const PositionCargoSourcePackageResponseDTOSchema = z.object({ id: z.string(), positionId: z.string(), positionNumber: z.string() });
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
export const PositionCargoPackageResponseDTOSchema = z.object({ id: z.string(), cargoId: z.string(), rootFolderId: z.string().nullish(), quantity: z.number().nullish(), packageTypeId: z.string().nullish(), packageType: CommonModels.PositionCargoPackageTypeResponseDTOSchema.nullish(), length: z.number().nullish(), width: z.number().nullish(), height: z.number().nullish(), netWeight: z.number().nullish(), grossWeight: z.number().nullish(), chargeableWeight: z.number().nullish(), note: z.string().nullish(), name: z.string().nullish(), orderNumber: z.number().nullish(), volume: z.number().nullish(), volumetricWeight: z.number().nullish(), caseMarks: z.string().nullish(), description: z.string().nullish(), hsCodes: z.array(z.string()).nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).nullish(), customsRemarks: z.string().nullish(), loadMeter: z.number().nullish(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema), hazardousSpecialty: CommonModels.PositionCargoPackageHazardousSpecialtyResponseDTOSchema.nullish(), temperatureControlledSpecialty: CommonModels.PositionCargoPackageTemperatureControlledSpecialtyResponseDtoSchema.nullish(), sourcePackage: CommonModels.PositionCargoSourcePackageResponseDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), mrn: z.string().nullish(), exportPortFilling: z.string().nullish(), customsReleased: z.boolean().nullish(), importCustomsReleaseNumber: z.string().nullish(), portCustomsNumber: z.string().nullish() });
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
export const PackageTotalsDtoSchema = z.object({ quantity: z.number(), weightPerPiece: z.number(), volume: z.number(), chargeableWeight: z.number().nullish(), loadMeter: z.number().nullish() });
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
export const PackageSpecialtyTotalsResponseDtoSchema = z.object({ noSpecialties: CommonModels.PackageTotalsDtoSchema, hazardous: CommonModels.PackageTotalsDtoSchema, nonStackable: CommonModels.PackageTotalsDtoSchema, temperatureControlled: CommonModels.PackageTotalsDtoSchema, diplomatic: CommonModels.PackageTotalsDtoSchema, oversized: CommonModels.PackageTotalsDtoSchema, total: CommonModels.PackageTotalsDtoSchema });
export type PackageSpecialtyTotalsResponseDto = z.infer<typeof PackageSpecialtyTotalsResponseDtoSchema>;

/** 
 * PositionCargoCargoTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Cargo type ID. Example: `123e4567-e89b-12d3-a456-426614174000` 
 * @property { string } name Cargo type name. Example: `Electronics` 
 * @property { string } shortName Cargo type short name. Example: `ELEC` 
 */
export const PositionCargoCargoTypeResponseDTOSchema = z.object({ id: z.string(), name: z.string(), shortName: z.string().nullish() });
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
export const PositionCargoResponseDTOSchema = z.object({ id: z.string(), positionId: z.string().nullish(), quoteId: z.string().nullish(), rootFolderId: z.string().nullish(), cargoType: CommonModels.PositionCargoCargoTypeResponseDTOSchema.nullish(), autoCalculateTotals: z.boolean(), autoCalculateRates: z.boolean(), autoCalculateVgm: z.boolean(), transportUnitNumber: z.string().nullish(), seal1: z.string().nullish(), seal2: z.string().nullish(), rateOptions: z.string().nullish(), rateClass: z.string().nullish(), textForCustoms: z.string().nullish(), totalVolume: z.number().nullish(), totalGrossWeight: z.number().nullish(), totalNetWeight: z.number().nullish(), totalVolumetricWeight: z.number().nullish(), totalChargeableWeight: z.number().nullish(), totalLoadMeter: z.number().nullish(), ratePerKg: z.number().nullish(), totalRate: z.number().nullish(), tare: z.number().nullish(), vgm: z.number().nullish(), hsCodeLabels: z.array(CommonModels.HsCodeLabelDtoSchema).nullish(), note: z.string().nullish(), packages: z.array(CommonModels.PositionCargoPackageResponseDTOSchema).nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), completeWeight: z.number().nullish(), packageTotals: CommonModels.PackageSpecialtyTotalsResponseDtoSchema.nullish() });
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
export const HazardousSpecialtyDTOSchema = z.object({ totalLength: z.number().nullable(), totalWidth: z.number().nullable(), temperature: z.number().nullable(), unNumber: z.string().nullable(), IMOClass: z.string().nullable(), shippingName: z.string().nullable(), technicalName: z.string().nullable(), packagingGroup: CommonModels.HazardousPackingGroupEnumSchema.nullable(), netWeight: z.number().nullable(), flashpoint: z.number().nullable(), properties: z.array(CommonModels.HazardousSpecialtyEnumSchema).nullable(), acceptanceNumber: z.string().nullable(), medGuide: z.string().nullable(), emergencyPhone: z.string().nullable(), emergencySchedule: z.string().nullable() }).partial();
export type HazardousSpecialtyDTO = z.infer<typeof HazardousSpecialtyDTOSchema>;

/** 
 * TemperatureControlledSpecialtyDtoSchema 
 * @type { object }
 * @property { number } temperatureFrom  
 * @property { number } temperatureUntil  
 */
export const TemperatureControlledSpecialtyDtoSchema = z.object({ temperatureFrom: z.number().nullable(), temperatureUntil: z.number().nullable() }).partial();
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
export const CreatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().nullable(), packageTypeId: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), netWeight: z.number().nullable(), grossWeight: z.number().nullable(), loadMeter: z.number().nullable(), chargeableWeight: z.number().nullable(), volume: z.number().nullable(), volumetricWeight: z.number().nullable(), caseMarks: z.string().nullable(), note: z.string().nullable(), description: z.string().nullable(), hsCodes: z.array(z.string()).nullable(), customsRemarks: z.string().nullable(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).nullable(), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema.nullable(), temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema.nullable(), mrn: z.string().nullable(), exportPortFilling: z.string().nullable(), customsReleased: z.boolean().nullable(), importCustomsReleaseNumber: z.string().nullable(), portCustomsNumber: z.string().nullable() }).partial();
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
export const UpdatePositionCargoPackageDTOSchema = z.object({ quantity: z.number().nullable(), packageTypeId: z.string().nullable(), length: z.number().nullable(), width: z.number().nullable(), height: z.number().nullable(), netWeight: z.number().nullable(), grossWeight: z.number().nullable(), chargeableWeight: z.number().nullable(), note: z.string().nullable(), volume: z.number().nullable(), volumetricWeight: z.number().nullable(), orderNumber: z.number().nullable(), caseMarks: z.string().nullable(), description: z.string().nullable(), hsCodes: z.array(z.string()).nullable(), customsRemarks: z.string().nullable(), loadMeter: z.number().nullable(), specialties: z.array(CommonModels.PositionCargoPackageEnumSchema).nullable(), hazardousSpecialty: CommonModels.HazardousSpecialtyDTOSchema.nullable(), temperatureControlledSpecialty: CommonModels.TemperatureControlledSpecialtyDtoSchema.nullable(), mrn: z.string().nullable(), exportPortFilling: z.string().nullable(), customsReleased: z.boolean().nullable(), importCustomsReleaseNumber: z.string().nullable(), portCustomsNumber: z.string().nullable() }).partial();
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
export const DocumentConfigDTOSchema = z.object({ footerImageUrl: z.string().nullable(), headerImageUrl: z.string().nullable() }).partial();
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
export const EmployeeRoleResponseSchema = z.object({ id: z.string(), name: z.string(), color: z.string().nullish(), description: z.string().nullish(), context: CommonModels.EmployeeRoleContextSchema.nullish(), permissions: z.array(z.string()) });
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
export const EmploymentEmployeeResponseSchema = z.object({ id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), archived: z.boolean().nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).nullish() });
export type EmploymentEmployeeResponse = z.infer<typeof EmploymentEmployeeResponseSchema>;

/** 
 * EmployeeOfficeResponseSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeOfficeResponseSchema = z.object({ id: z.string(), name: z.string() });
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
export const EmploymentResponseSchema = z.object({ id: z.string(), officeId: z.string(), office: CommonModels.EmployeeOfficeResponseSchema.nullish(), employeeId: z.string(), employee: CommonModels.EmploymentEmployeeResponseSchema.nullish(), archived: z.boolean(), costCenter: z.string().nullish(), roles: z.array(CommonModels.EmployeeRoleResponseSchema).nullish() });
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
export const DateRangeDtoSchema = z.object({ start: z.iso.datetime({ offset: true }).nullable(), end: z.iso.datetime({ offset: true }).nullable() }).partial();
export type DateRangeDto = z.infer<typeof DateRangeDtoSchema>;

/** 
 * BusinessPartnerLabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 * @property { BusinessPartnerType[] } types Array of business partner types 
 */
export const BusinessPartnerLabelResponseDTOSchema = z.object({ id: z.string(), label: z.string(), types: z.array(CommonModels.BusinessPartnerTypeSchema) });
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
export const OfficeInvoiceFilterDtoSchema = z.object({ search: z.string().nullable(), issuingDate: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), invoiceDirection: z.array(CommonModels.InvoiceDirectionEnumSchema).nullable(), invoiceType: z.array(CommonModels.InvoiceTypeEnumSchema).nullable(), collective: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), amountMin: z.number().nullable(), amountMax: z.number().nullable(), currencyNotation: z.array(z.string()).nullable(), vatRule: z.array(z.string()).nullable(), dueDate: CommonModels.DateRangeDtoSchema.nullable(), status: z.array(CommonModels.InvoiceStatusEnumSchema).nullable(), receiver: z.array(z.string()).nullable(), receiverCountry: z.array(z.string()).nullable(), salesRep: z.array(z.string()).nullable(), positionNumbersString: z.string().nullable(), positionNumbers: z.array(z.string()).nullable(), invoiceNumbersString: z.string().nullable(), invoiceNumbers: z.array(z.string()).nullable(), bookkeepingExportStatus: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), dunningBlock: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceInReview: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isInvoiceOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isVatOk: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), invoiceNumberMin: z.number().nullable(), invoiceNumberMax: z.number().nullable(), internalNumberMin: z.number().nullable(), internalNumberMax: z.number().nullable(), externalSystemId: z.string().nullable(), hblNumber: z.string().nullable(), mblNumber: z.string().nullable(), bookingNumber: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), creditorId: z.string().nullable(), debtorId: z.string().nullable() }).partial();
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
export const PositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PositionCustomerDto = z.infer<typeof PositionCustomerDtoSchema>;

/** 
 * PositionQuoteDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PositionQuoteDtoSchema = z.object({ id: z.string(), number: z.string() });
export type PositionQuoteDto = z.infer<typeof PositionQuoteDtoSchema>;

/** 
 * ParentPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const ParentPositionDtoSchema = z.object({ id: z.string(), number: z.string() });
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
export const PositionProjectLiteDtoSchema = z.object({ id: z.string(), name: z.string() });
export type PositionProjectLiteDto = z.infer<typeof PositionProjectLiteDtoSchema>;

/** 
 * EmployeeDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const EmployeeDtoSchema = z.object({ id: z.string(), name: z.string() });
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
export const PositionCoreResponseDtoSchema = z.object({ id: z.string(), rootFolderId: z.string().nullish(), externalSystemId: z.string().nullish(), inttraTypeOfMove: CommonModels.MovementTypeEnumSchema.nullish(), customer: CommonModels.PositionCustomerDtoSchema.nullish(), isCancelled: z.boolean(), owningOfficeId: z.string(), originOfficeId: z.string().nullish(), quote: CommonModels.PositionQuoteDtoSchema.nullish(), number: z.string(), section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, statusDate: z.iso.datetime({ offset: true }), serviceDate: z.iso.datetime({ offset: true }).nullish(), dateOfDeparture: z.iso.datetime({ offset: true }).nullish(), dateOfArrival: z.iso.datetime({ offset: true }).nullish(), status: CommonModels.PositionStatusEnumSchema.nullish(), loadType: CommonModels.LoadTypeEnumSchema.nullish(), incoterms: CommonModels.IncotermsEnumSchema.nullish(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), parentPosition: CommonModels.ParentPositionDtoSchema.nullish(), buyRateReference: z.string().nullish(), frequency: CommonModels.FrequencyEnumSchema.nullish(), positionType: CommonModels.PositionTypeEnumSchema.nullish(), isParentPosition: z.boolean(), hasParentPosition: z.boolean().nullish(), hasChildPositions: z.boolean().nullish(), projectLite: CommonModels.PositionProjectLiteDtoSchema.nullish(), isExcludedFromStatistics: z.boolean(), salesRep: CommonModels.EmployeeDtoSchema.nullish(), fillingCompany: z.string().nullish(), sellingContract: z.string().nullish(), fillingScacCode: z.string().nullish(), serviceValidity: z.iso.datetime({ offset: true }).nullish(), ratesValidity: z.iso.datetime({ offset: true }).nullish(), responsibleEmployee: CommonModels.EmployeeDtoSchema.nullish(), receivedByEmployee: CommonModels.EmployeeDtoSchema.nullish(), team: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), notes: CommonModels.EditorContentResponseDtoSchema.nullish(), volumetricWeightModifier: z.number().nullish() });
export type PositionCoreResponseDto = z.infer<typeof PositionCoreResponseDtoSchema>;

/** 
 * VesselDtoSchema 
 * @type { object }
 * @property { string } name  
 * @property { number } imo  
 * @property { number } mmsi  
 */
export const VesselDtoSchema = z.object({ name: z.string(), imo: z.number().nullish(), mmsi: z.number().nullish() });
export type VesselDto = z.infer<typeof VesselDtoSchema>;

/** 
 * StatusResponseDtoSchema 
 * @type { object }
 * @property { string } status Status 
 * @property { string } message Message 
 * @property { string } code Alphanumeric code of the message type 
 */
export const StatusResponseDtoSchema = z.object({ status: z.string(), message: z.string(), code: z.string() });
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
export const PaginationDtoSchema = z.object({ items: z.array(z.string()), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type PaginationDto = z.infer<typeof PaginationDtoSchema>;

/** 
 * LabelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } label  
 */
export const LabelResponseDTOSchema = z.object({ id: z.string(), label: z.string() });
export type LabelResponseDTO = z.infer<typeof LabelResponseDTOSchema>;

/** 
 * GenerateWorkingDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 * @property { string } fileName  
 */
export const GenerateWorkingDocumentRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullish(), fileName: z.string() });
export type GenerateWorkingDocumentRequestDto = z.infer<typeof GenerateWorkingDocumentRequestDtoSchema>;

/** 
 * UpdateInvolvedPartyDtoSchema 
 * @type { object }
 * @property { string } reference  
 * @property { string } businessPartnerId  
 * @property { string } contactId  
 */
export const UpdateInvolvedPartyDtoSchema = z.object({ reference: z.string().nullable(), businessPartnerId: z.string().nullable(), contactId: z.string().nullable() }).partial();
export type UpdateInvolvedPartyDto = z.infer<typeof UpdateInvolvedPartyDtoSchema>;

/** 
 * MergeRoutesRequestDtoSchema 
 * @type { object }
 * @property { string } sourceCargoId Source cargo ID to merge from (sea positions only) 
 */
export const MergeRoutesRequestDtoSchema = z.object({ sourceCargoId: z.string().nullable() });
export type MergeRoutesRequestDto = z.infer<typeof MergeRoutesRequestDtoSchema>;

/** 
 * CopyRouteRequestDtoSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to copy to (sea positions only) 
 */
export const CopyRouteRequestDtoSchema = z.object({ targetCargoId: z.string().nullable() });
export type CopyRouteRequestDto = z.infer<typeof CopyRouteRequestDtoSchema>;

/** 
 * CargoSummaryResponseDTOSchema 
 * @type { object }
 * @property { string } transportUnitTypeName Transport unit type name (e.g., "40' DRY", "20'") 
 * @property { number } quantity Total quantity of this transport unit type 
 */
export const CargoSummaryResponseDTOSchema = z.object({ transportUnitTypeName: z.string(), quantity: z.number() });
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
export const CreatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().nullable(), note: z.string().nullable(), autoCalculateTotals: z.boolean().nullable(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean().nullable(), autoCalculateVgm: z.boolean().nullable() }).partial();
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
export const UpdatePositionCargoDTOSchema = z.object({ cargoTypeId: z.string().nullable(), note: z.string().nullable(), autoCalculateTotals: z.boolean().nullable(), transportUnitNumber: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), totalVolume: z.number().nullable(), totalGrossWeight: z.number().nullable(), totalNetWeight: z.number().nullable(), totalVolumetricWeight: z.number().nullable(), totalChargeableWeight: z.number().nullable(), totalLoadMeter: z.number().nullable(), rateOptions: CommonModels.RateOptionsEnumSchema.nullable(), rateClass: CommonModels.RateClassEnumSchema.nullable(), ratePerKg: z.number().nullable(), totalRate: z.number().nullable(), textForCustoms: z.string().nullable(), tare: z.number().nullable(), vgm: z.number().nullable(), autoCalculateRates: z.boolean().nullable(), autoCalculateVgm: z.boolean().nullable() }).partial();
export type UpdatePositionCargoDTO = z.infer<typeof UpdatePositionCargoDTOSchema>;

/** 
 * MovePositionCargoPackageRequestDTOSchema 
 * @type { object }
 * @property { string } targetCargoId Target cargo ID to move the package to 
 */
export const MovePositionCargoPackageRequestDTOSchema = z.object({ targetCargoId: z.string() });
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
