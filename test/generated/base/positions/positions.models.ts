import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionsModels {
/** 
 * PositionPreviewResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } externalSystemId  
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { string } createdAt  
 * @property { string } number  
 * @property { boolean } isCancelled  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { string } customer.phone  
 * @property { string } customer.email  
 * @property { string } customerReference  
 * @property { object } consignee  
 * @property { string } consignee.id  
 * @property { string } consignee.name  
 * @property { string } consignee.matchCode  
 * @property { string } consignee.label  
 * @property { string } consigneeReference  
 * @property { object } carrier  
 * @property { string } carrier.id  
 * @property { string } carrier.name  
 * @property { string } carrier.matchCode  
 * @property { string } carrier.label  
 * @property { string } carrierReference  
 * @property { number } positionNumber  
 * @property { string } hblNumber  
 * @property { string } mblNumber  
 * @property { string } bookingNumber  
 * @property { string } vessel  
 * @property { string } voyage  
 * @property { string } vesselCarrier Carrier name from route point (sea positions only) 
 * @property { object } origin  
 * @property { string } origin.id  
 * @property { string } origin.name  
 * @property { string } loadDate  
 * @property { object } loadingPort  
 * @property { string } loadingPort.id  
 * @property { string } loadingPort.name  
 * @property { object } dischargePort  
 * @property { string } dischargePort.id  
 * @property { string } dischargePort.name  
 * @property { object } destination  
 * @property { string } destination.id  
 * @property { string } destination.name  
 * @property { string } deliveryDate  
 * @property { string } equipment  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { object } destinationOffice  
 * @property { string } destinationOffice.id  
 * @property { string } destinationOffice.name  
 * @property { string } currency  
 * @property { number } profit  
 * @property { number } margin  
 * @property { object } employee  
 * @property { string } employee.id  
 * @property { string } employee.name  
 * @property { object } project  
 * @property { string } project.id  
 * @property { string } project.name  
 * @property { string } serviceDate  
 * @property { string } departureDate  
 * @property { string } arrivalDate  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { CommonModels.EditorContentResponseDto } notes Notes 
 * @property { boolean } isMasterPosition  
 * @property { boolean } hasInvoices Whether this position has at least one invoice 
 * @property { object } parentPosition  
 * @property { string } parentPosition.id  
 * @property { string } parentPosition.number  
 */
export const PositionPreviewResponseDtoSchema = z.object({ id: z.string(), externalSystemId: z.string().nullish(), transportMode: CommonModels.TransportModeEnumSchema, direction: CommonModels.DirectionEnumSchema, loadType: CommonModels.LoadTypeEnumSchema.nullish(), createdAt: z.iso.datetime({ offset: true }).nullish(), number: z.string(), isCancelled: z.boolean(), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string(), phone: z.string().nullish(), email: z.string().nullish() }), customerReference: z.string().nullish(), consignee: z.object({ id: z.string().nullable(), name: z.string().nullable(), matchCode: z.string().nullable(), label: z.string().nullable() }).nullish(), consigneeReference: z.string().nullish(), carrier: z.object({ id: z.string().nullable(), name: z.string().nullable(), matchCode: z.string().nullable(), label: z.string().nullable() }).nullish(), carrierReference: z.string().nullish(), positionNumber: z.number().nullish(), hblNumber: z.string().nullish(), mblNumber: z.string().nullish(), bookingNumber: z.string().nullish(), vessel: z.string().nullish(), voyage: z.string().nullish(), vesselCarrier: z.string().nullish(), origin: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), loadDate: z.iso.datetime({ offset: true }).nullish(), loadingPort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), dischargePort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), destination: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), deliveryDate: z.iso.datetime({ offset: true }).nullish(), equipment: z.string().nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), destinationOffice: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), currency: z.string().nullish(), profit: z.number().nullish(), margin: z.number().nullish(), employee: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), project: z.object({ id: z.string().nullable(), name: z.string().nullable() }).nullish(), serviceDate: z.iso.datetime({ offset: true }).nullish(), departureDate: z.iso.datetime({ offset: true }).nullish(), arrivalDate: z.iso.datetime({ offset: true }).nullish(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullish(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullish(), customsDate: z.iso.datetime({ offset: true }).nullish(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullish(), routing: CommonModels.SeaRoutingEnumSchema.nullish(), notes: CommonModels.EditorContentResponseDtoSchema.nullish(), isMasterPosition: z.boolean(), hasInvoices: z.boolean().nullish(), parentPosition: z.object({ id: z.string().nullable(), number: z.string().nullable() }).nullish() });
export type PositionPreviewResponseDto = z.infer<typeof PositionPreviewResponseDtoSchema>;

/** 
 * PositionFilterDtoSchema 
 * @type { object }
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { string[] } customerId  
 * @property { string[] } carrierId Filter positions by carrier IDs 
 * @property { string[] } consigneeId Filter positions by consignee IDs 
 * @property { boolean } isCancelled  
 * @property { CommonModels.PositionStatusEnum } status  
 * @property { string } number  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string[] } employee Filter positions by employee IDs 
 * @property { string } searchQuery  
 * @property { string } externalSystemId Filter positions by external system ID (substring match) 
 * @property { CommonModels.DateRangeDto } createdAt  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { CommonModels.DateRangeDto } departureDate  
 * @property { CommonModels.DateRangeDto } arrivalDate  
 * @property { CommonModels.DateRangeDto } blfromCostumerDate  
 * @property { CommonModels.DateRangeDto } blfromCarrierDate  
 * @property { CommonModels.DateRangeDto } customsDate  
 * @property { CommonModels.DateRangeDto } vgmCustomerDate  
 * @property { string } partnerNetworkId Filter positions by partner network ID 
 * @property { string[] } projectLiteId Filter positions by project IDs 
 * @property { string[] } checklistItemsDone Checklist item ids that must be completed 
 * @property { string[] } checklistItemsNotDone Checklist item ids that must be not completed 
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { CommonModels.BooleanFilterEnum[] } isExcludedFromStatistics  
 * @property { boolean } isMasterPosition  
 * @property { string[] } loadingPortId Filter positions by loading port/airport IDs (checks both sea port of loading and air airport of departure) 
 * @property { string[] } dischargePortId Filter positions by discharge port/airport IDs (checks both sea port of discharge and air destination airport) 
 * @property { string } customerReference Filter positions by customer reference 
 * @property { string } carrierReference Filter positions by carrier reference 
 * @property { string } consigneeReference Filter positions by consignee reference 
 * @property { string } hblNumber Filter positions by HBL/HAWB number 
 * @property { string } mblNumber Filter positions by MBL/MAWB number 
 * @property { string } bookingNumber Filter positions by booking number 
 * @property { string } vessel Filter positions by vessel name 
 * @property { string } voyage Filter positions by voyage number 
 * @property { string } vesselCarrier Filter positions by vessel or carrier name 
 */
export const PositionFilterDtoSchema = z.object({ transportMode: CommonModels.TransportModeEnumSchema.nullable(), customerId: z.array(z.string()).nullable(), carrierId: z.array(z.string()).nullable(), consigneeId: z.array(z.string()).nullable(), isCancelled: z.boolean().nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), number: z.string().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), employee: z.array(z.string()).nullable(), searchQuery: z.string().nullable(), externalSystemId: z.string().nullable(), createdAt: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), departureDate: CommonModels.DateRangeDtoSchema.nullable(), arrivalDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCostumerDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCarrierDate: CommonModels.DateRangeDtoSchema.nullable(), customsDate: CommonModels.DateRangeDtoSchema.nullable(), vgmCustomerDate: CommonModels.DateRangeDtoSchema.nullable(), partnerNetworkId: z.string().nullable(), projectLiteId: z.array(z.string()).nullable(), checklistItemsDone: z.array(z.string()).nullable(), checklistItemsNotDone: z.array(z.string()).nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).nullable(), isMasterPosition: z.boolean().nullable(), loadingPortId: z.array(z.string()).nullable(), dischargePortId: z.array(z.string()).nullable(), customerReference: z.string().nullable(), carrierReference: z.string().nullable(), consigneeReference: z.string().nullable(), hblNumber: z.string().nullable(), mblNumber: z.string().nullable(), bookingNumber: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), vesselCarrier: z.string().nullable() }).partial();
export type PositionFilterDto = z.infer<typeof PositionFilterDtoSchema>;

/** 
 * PositionExportFilterDtoSchema 
 * @type { object }
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { string[] } customerId  
 * @property { boolean } isCancelled  
 * @property { CommonModels.PositionStatusEnum } status  
 * @property { string } number  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string[] } responsibleEmployee Filter positions by responsible employee IDs 
 * @property { string } searchQuery  
 * @property { string } externalSystemId Filter positions by external system ID (substring match) 
 * @property { CommonModels.DateRangeDto } statusDate  
 * @property { CommonModels.DateRangeDto } serviceDate  
 * @property { CommonModels.DateRangeDto } dateOfDeparture  
 * @property { CommonModels.DateRangeDto } dateOfArrival  
 * @property { CommonModels.DateRangeDto } blfromCostumerDate  
 * @property { CommonModels.DateRangeDto } blfromCarrierDate  
 * @property { CommonModels.DateRangeDto } customsDate  
 * @property { CommonModels.DateRangeDto } vgmCustomerDate  
 * @property { string } partnerNetworkId Filter positions by partner network ID 
 * @property { string[] } projectLiteId Filter positions by project IDs 
 * @property { string[] } checklistItemsDone Checklist item ids that must be completed 
 * @property { string[] } checklistItemsNotDone Checklist item ids that must be not completed 
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { CommonModels.BooleanFilterEnum[] } isExcludedFromStatistics  
 */
export const PositionExportFilterDtoSchema = z.object({ transportMode: CommonModels.TransportModeEnumSchema.nullable(), customerId: z.array(z.string()).nullable(), isCancelled: z.boolean().nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), number: z.string().nullable(), direction: CommonModels.DirectionEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), responsibleEmployee: z.array(z.string()).nullable(), searchQuery: z.string().nullable(), externalSystemId: z.string().nullable(), statusDate: CommonModels.DateRangeDtoSchema.nullable(), serviceDate: CommonModels.DateRangeDtoSchema.nullable(), dateOfDeparture: CommonModels.DateRangeDtoSchema.nullable(), dateOfArrival: CommonModels.DateRangeDtoSchema.nullable(), blfromCostumerDate: CommonModels.DateRangeDtoSchema.nullable(), blfromCarrierDate: CommonModels.DateRangeDtoSchema.nullable(), customsDate: CommonModels.DateRangeDtoSchema.nullable(), vgmCustomerDate: CommonModels.DateRangeDtoSchema.nullable(), partnerNetworkId: z.string().nullable(), projectLiteId: z.array(z.string()).nullable(), checklistItemsDone: z.array(z.string()).nullable(), checklistItemsNotDone: z.array(z.string()).nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable(), isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).nullable() }).partial();
export type PositionExportFilterDto = z.infer<typeof PositionExportFilterDtoSchema>;

/** 
 * PositionExportColumnSchema 
 * @type { enum }
 */
export const PositionExportColumnSchema = z.enum(["id", "externalSystemId", "transportMode", "direction", "loadType", "createdAt", "number", "isCancelled", "customerName", "customerPhone", "customerEmail", "customerReference", "consigneeName", "consigneeReference", "carrierName", "carrierReference", "positionNumber", "hblNumber", "mblNumber", "bookingNumber", "vessel", "voyage", "originName", "loadDate", "loadingPortName", "dischargePortName", "destinationName", "deliveryDate", "equipment", "serviceTypeName", "departureDate", "arrivalDate", "destinationOfficeName", "currency", "profit", "margin", "employeeName", "projectName", "serviceDate", "routing", "notes", "blFromCustomerDate", "blFromCarrierDate", "customsDate", "vgmCustomerDate", "isMasterPosition", "parentPositionId", "parentPositionNumber"]);
export type PositionExportColumn = z.infer<typeof PositionExportColumnSchema>;
export const PositionExportColumn = PositionExportColumnSchema.enum;

/** 
 * PositionExportRequestDtoSchema 
 * @type { object }
 * @property { string } order Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number` 
 * @property { PositionExportColumn[] } columns Min Items: `1` 
 * @property { PositionExportFilterDto } filter  
 */
export const PositionExportRequestDtoSchema = z.object({ order: z.string().nullable(), columns: z.array(PositionExportColumnSchema).min(1).nullable(), filter: PositionExportFilterDtoSchema.nullable() }).partial();
export type PositionExportRequestDto = z.infer<typeof PositionExportRequestDtoSchema>;

/** 
 * CreatePositionRequestDtoSchema 
 * @type { object }
 * @property { CommonModels.SectionEnum } section  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string } estimatedServiceDate  
 * @property { string } customerBusinessPartnerId  
 */
export const CreatePositionRequestDtoSchema = z.object({ section: CommonModels.SectionEnumSchema, direction: CommonModels.DirectionEnumSchema, transportMode: CommonModels.TransportModeEnumSchema, loadType: CommonModels.LoadTypeEnumSchema, serviceType: CommonModels.ServiceTypeEnumSchema, estimatedServiceDate: z.iso.datetime({ offset: true }), customerBusinessPartnerId: z.string() });
export type CreatePositionRequestDto = z.infer<typeof CreatePositionRequestDtoSchema>;

/** 
 * DuplicatePositionPackageInformationParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } packageType  
 * @property { boolean } packageQuantity  
 * @property { boolean } packageDescription  
 * @property { boolean } packageHsCodes  
 * @property { boolean } packageNetWeight  
 * @property { boolean } packageGrossWeight  
 * @property { boolean } packageCaseMark  
 * @property { boolean } packageNote  
 * @property { boolean } packageCustomsMark  
 */
export const DuplicatePositionPackageInformationParametersDtoSchema = z.object({ enabled: z.boolean(), packageType: z.boolean(), packageQuantity: z.boolean(), packageDescription: z.boolean(), packageHsCodes: z.boolean(), packageNetWeight: z.boolean(), packageGrossWeight: z.boolean(), packageCaseMark: z.boolean(), packageNote: z.boolean(), packageCustomsMark: z.boolean() });
export type DuplicatePositionPackageInformationParametersDto = z.infer<typeof DuplicatePositionPackageInformationParametersDtoSchema>;

/** 
 * DuplicatePositionCargoParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { DuplicatePositionPackageInformationParametersDto } packageInformation  
 */
export const DuplicatePositionCargoParametersDtoSchema = z.object({ enabled: z.boolean(), packageInformation: DuplicatePositionPackageInformationParametersDtoSchema });
export type DuplicatePositionCargoParametersDto = z.infer<typeof DuplicatePositionCargoParametersDtoSchema>;

/** 
 * DuplicatePositionOverviewParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } quoteReference  
 */
export const DuplicatePositionOverviewParametersDtoSchema = z.object({ enabled: z.boolean(), quoteReference: z.boolean() });
export type DuplicatePositionOverviewParametersDto = z.infer<typeof DuplicatePositionOverviewParametersDtoSchema>;

/** 
 * DuplicatePositionInvolvedPartiesParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } involvedPartySection  
 */
export const DuplicatePositionInvolvedPartiesParametersDtoSchema = z.object({ enabled: z.boolean(), involvedPartySection: z.boolean() });
export type DuplicatePositionInvolvedPartiesParametersDto = z.infer<typeof DuplicatePositionInvolvedPartiesParametersDtoSchema>;

/** 
 * DuplicatePositionRoutesParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } routeDates  
 * @property { boolean } routeLocation  
 */
export const DuplicatePositionRoutesParametersDtoSchema = z.object({ enabled: z.boolean(), routeDates: z.boolean(), routeLocation: z.boolean() });
export type DuplicatePositionRoutesParametersDto = z.infer<typeof DuplicatePositionRoutesParametersDtoSchema>;

/** 
 * DuplicatePositionFinanceAccountParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } exchangeRate  
 */
export const DuplicatePositionFinanceAccountParametersDtoSchema = z.object({ enabled: z.boolean(), exchangeRate: z.boolean() });
export type DuplicatePositionFinanceAccountParametersDto = z.infer<typeof DuplicatePositionFinanceAccountParametersDtoSchema>;

/** 
 * DuplicatePositionDocumentsParametersDtoSchema 
 * @type { object }
 * @property { boolean } enabled  
 * @property { boolean } hblWorkingDocument  
 * @property { boolean } siWorkingDocument  
 */
export const DuplicatePositionDocumentsParametersDtoSchema = z.object({ enabled: z.boolean(), hblWorkingDocument: z.boolean(), siWorkingDocument: z.boolean() });
export type DuplicatePositionDocumentsParametersDto = z.infer<typeof DuplicatePositionDocumentsParametersDtoSchema>;

/** 
 * DuplicatePositionParametersDtoSchema 
 * @type { object }
 * @property { DuplicatePositionOverviewParametersDto } overview  
 * @property { DuplicatePositionInvolvedPartiesParametersDto } involvedParties  
 * @property { DuplicatePositionCargoParametersDto } cargo  
 * @property { DuplicatePositionRoutesParametersDto } routes  
 * @property { DuplicatePositionFinanceAccountParametersDto } financeAccount  
 * @property { DuplicatePositionDocumentsParametersDto } documents  
 */
export const DuplicatePositionParametersDtoSchema = z.object({ overview: DuplicatePositionOverviewParametersDtoSchema, involvedParties: DuplicatePositionInvolvedPartiesParametersDtoSchema, cargo: DuplicatePositionCargoParametersDtoSchema, routes: DuplicatePositionRoutesParametersDtoSchema, financeAccount: DuplicatePositionFinanceAccountParametersDtoSchema, documents: DuplicatePositionDocumentsParametersDtoSchema });
export type DuplicatePositionParametersDto = z.infer<typeof DuplicatePositionParametersDtoSchema>;

/** 
 * DuplicatePositionDefaultParametersResponseDtoSchema 
 * @type { object }
 * @property { string } estimatedServiceDate Suggested estimated service date for the duplicated position (ISO 8601) 
 * @property { DuplicatePositionParametersDto } parameters Default duplication parameters with section and sub-parameter flags 
 */
export const DuplicatePositionDefaultParametersResponseDtoSchema = z.object({ estimatedServiceDate: z.string(), parameters: DuplicatePositionParametersDtoSchema });
export type DuplicatePositionDefaultParametersResponseDto = z.infer<typeof DuplicatePositionDefaultParametersResponseDtoSchema>;

/** 
 * PositionSectionEnumSchema 
 * @type { enum }
 */
export const PositionSectionEnumSchema = z.enum(["overview", "involvedParties", "cargo", "financeAccount", "routes", "routeDates", "documents"]);
export type PositionSectionEnum = z.infer<typeof PositionSectionEnumSchema>;
export const PositionSectionEnum = PositionSectionEnumSchema.enum;

/** 
 * DuplicatePositionRequestDtoSchema 
 * @type { object }
 * @property { PositionSectionEnum[] } sections Legacy: sections to duplicate. Ignored when parameters is provided. 
 * @property { DuplicatePositionParametersDto } parameters Nested parameters for duplication control. Preferred over sections. 
 * @property { string } estimatedServiceDate  
 */
export const DuplicatePositionRequestDtoSchema = z.object({ sections: z.array(PositionSectionEnumSchema).nullish(), parameters: DuplicatePositionParametersDtoSchema.nullish(), estimatedServiceDate: z.iso.datetime({ offset: true }) });
export type DuplicatePositionRequestDto = z.infer<typeof DuplicatePositionRequestDtoSchema>;

/** 
 * UpdatePositionDtoSchema 
 * @type { object }
 * @property { string } externalSystemId  
 * @property { string } statusDate  
 * @property { CommonModels.PositionStatusEnum } status  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { CommonModels.IncotermsEnum } incoterms  
 * @property { CommonModels.IncotermsEnum } secondIncoterms  
 * @property { string } fillingCompany  
 * @property { string } sellingContract  
 * @property { string } fillingScacCode  
 * @property { string } serviceValidity  
 * @property { string } ratesValidity  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string } buyRateReference  
 * @property { CommonModels.FrequencyEnum } frequency  
 * @property { boolean } isParentPosition  
 * @property { boolean } isExcludedFromStatistics  
 * @property { string } team  
 * @property { string } salesRepId  
 * @property { string } responsibleEmployeeId  
 * @property { string } receivedByEmployeeId  
 * @property { string } originOfficeId  
 * @property { string } projectLiteId  
 * @property { CommonModels.EditorContentUpdateDto } notes Notes 
 * @property { CommonModels.MovementTypeEnum } inttraTypeOfMove  
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 */
export const UpdatePositionDtoSchema = z.object({ externalSystemId: z.string().nullable(), statusDate: z.iso.datetime({ offset: true }).nullable(), status: CommonModels.PositionStatusEnumSchema.nullable(), loadType: CommonModels.LoadTypeEnumSchema.nullable(), incoterms: CommonModels.IncotermsEnumSchema.nullable(), secondIncoterms: CommonModels.IncotermsEnumSchema.nullable(), fillingCompany: z.string().nullable(), sellingContract: z.string().nullable(), fillingScacCode: z.string().nullable(), serviceValidity: z.iso.datetime({ offset: true }).nullable(), ratesValidity: z.iso.datetime({ offset: true }).nullable(), serviceType: CommonModels.ServiceTypeEnumSchema.nullable(), buyRateReference: z.string().nullable(), frequency: CommonModels.FrequencyEnumSchema.nullable(), isParentPosition: z.boolean().nullable(), isExcludedFromStatistics: z.boolean().nullable(), team: z.string().nullable(), salesRepId: z.string().nullable(), responsibleEmployeeId: z.string().nullable(), receivedByEmployeeId: z.string().nullable(), originOfficeId: z.string().nullable(), projectLiteId: z.string().nullable(), notes: CommonModels.EditorContentUpdateDtoSchema.nullable(), inttraTypeOfMove: CommonModels.MovementTypeEnumSchema.nullable(), volumetricWeightModifier: z.number().nullable() }).partial();
export type UpdatePositionDto = z.infer<typeof UpdatePositionDtoSchema>;

/** 
 * ChildPositionCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ChildPositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type ChildPositionCustomerDto = z.infer<typeof ChildPositionCustomerDtoSchema>;

/** 
 * ChildPositionProfitDtoSchema 
 * @type { object }
 * @property { number } amount  
 * @property { string } currency  
 */
export const ChildPositionProfitDtoSchema = z.object({ amount: z.number(), currency: z.string() });
export type ChildPositionProfitDto = z.infer<typeof ChildPositionProfitDtoSchema>;

/** 
 * ChildPositionResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 * @property { number } packages  
 * @property { number } weight  
 * @property { number } volume  
 * @property { ChildPositionCustomerDto } customer  
 * @property { ChildPositionProfitDto } profit  
 */
export const ChildPositionResponseDtoSchema = z.object({ id: z.string(), number: z.string(), packages: z.number(), weight: z.number(), volume: z.number(), customer: ChildPositionCustomerDtoSchema, profit: ChildPositionProfitDtoSchema });
export type ChildPositionResponseDto = z.infer<typeof ChildPositionResponseDtoSchema>;

/** 
 * PositionLabelsFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } isParentPosition  
 * @property { boolean } isLinkedPosition  
 */
export const PositionLabelsFilterDtoSchema = z.object({ search: z.string().nullable(), isParentPosition: z.boolean().nullable(), isLinkedPosition: z.boolean().nullable() }).partial();
export type PositionLabelsFilterDto = z.infer<typeof PositionLabelsFilterDtoSchema>;

/** 
 * PositionListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const PositionListResponseDtoSchema = z.object({ items: z.array(z.string()), totalProfit: z.number(), profitPerPosition: z.number(), page: z.number().nullish(), cursor: z.string().nullish(), nextCursor: z.string().nullish(), limit: z.number(), totalItems: z.number() });
export type PositionListResponseDto = z.infer<typeof PositionListResponseDtoSchema>;

/** 
 * LinkChildPositionsRequestDtoSchema 
 * @type { object }
 * @property { string[] } childPositionIds  
 */
export const LinkChildPositionsRequestDtoSchema = z.object({ childPositionIds: z.array(z.string()) });
export type LinkChildPositionsRequestDto = z.infer<typeof LinkChildPositionsRequestDtoSchema>;

/** 
 * UnlinkChildPositionsRequestDtoSchema 
 * @type { object }
 * @property { string[] } childPositionIds  
 */
export const UnlinkChildPositionsRequestDtoSchema = z.object({ childPositionIds: z.array(z.string()) });
export type UnlinkChildPositionsRequestDto = z.infer<typeof UnlinkChildPositionsRequestDtoSchema>;

/** 
 * PositionsFindAllResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PositionsFindAllResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PositionsFindAllResponse = z.infer<typeof PositionsFindAllResponseSchema>;

/** 
 * PositionsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PositionsPaginateOrderParamEnumSchema = z.enum(["number", "transportMode", "isCancelled", "direction", "loadType", "serviceDate", "createdAt", "departureDate", "arrivalDate", "blfromCostumerDate", "blfromCarrierDate", "customsDate", "vgmCustomerDate", "serviceType", "externalSystemId", "employee", "project", "profit", "margin", "isMasterPosition"]);
export type PositionsPaginateOrderParamEnum = z.infer<typeof PositionsPaginateOrderParamEnumSchema>;
export const PositionsPaginateOrderParamEnum = PositionsPaginateOrderParamEnumSchema.enum;

/** 
 * PositionsPaginateResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionPreviewResponseDto[] } items  
 */
export const PositionsPaginateResponseSchema = z.object({ ...PositionListResponseDtoSchema.shape, ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).nullable() }).partial().shape });
export type PositionsPaginateResponse = z.infer<typeof PositionsPaginateResponseSchema>;

/** 
 * TotalProfitResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerPosition  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionPreviewResponseDto[] } items  
 */
export const TotalProfitResponseSchema = z.object({ ...PositionListResponseDtoSchema.shape, ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).nullable() }).partial().shape });
export type TotalProfitResponse = z.infer<typeof TotalProfitResponseSchema>;

/** 
 * PositionsListAvailablePartnersForResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.BusinessPartnerLabelResponseDTO[] } items  
 */
export const PositionsListAvailablePartnersForResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).nullable() }).partial().shape });
export type PositionsListAvailablePartnersForResponse = z.infer<typeof PositionsListAvailablePartnersForResponseSchema>;

/** 
 * ListRouteLabelsResponseSchema 
 * @type { array }
 */
export const ListRouteLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type ListRouteLabelsResponse = z.infer<typeof ListRouteLabelsResponseSchema>;

/** 
 * ListChildResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ChildPositionResponseDto[] } items  
 */
export const ListChildResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ChildPositionResponseDtoSchema).nullable() }).partial().shape });
export type ListChildResponse = z.infer<typeof ListChildResponseSchema>;

}
