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
  export const PositionPreviewResponseDtoSchema = z
    .object({
      id: z.string(),
      externalSystemId: z.string().nullish(),
      transportMode: CommonModels.TransportModeEnumSchema,
      direction: CommonModels.DirectionEnumSchema,
      loadType: CommonModels.LoadTypeEnumSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }).nullish(),
      number: z.string(),
      isCancelled: z.boolean(),
      customer: z
        .object({
          id: z.string(),
          name: z.string(),
          matchCode: z.string(),
          label: z.string(),
          phone: z.string().nullish(),
          email: z.string().nullish(),
        })
        .readonly(),
      customerReference: z.string().nullish(),
      consignee: z
        .object({
          id: z.string().nullable(),
          name: z.string().nullable(),
          matchCode: z.string().nullable(),
          label: z.string().nullable(),
        })
        .readonly()
        .nullish(),
      consigneeReference: z.string().nullish(),
      carrier: z
        .object({
          id: z.string().nullable(),
          name: z.string().nullable(),
          matchCode: z.string().nullable(),
          label: z.string().nullable(),
        })
        .readonly()
        .nullish(),
      carrierReference: z.string().nullish(),
      positionNumber: z.number().nullish(),
      hblNumber: z.string().nullish(),
      mblNumber: z.string().nullish(),
      bookingNumber: z.string().nullish(),
      vessel: z.string().nullish(),
      voyage: z.string().nullish(),
      vesselCarrier: z.string().describe("Carrier name from route point (sea positions only)").nullish(),
      origin: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      loadDate: z.iso.datetime({ offset: true }).nullish(),
      loadingPort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      dischargePort: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      destination: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      deliveryDate: z.iso.datetime({ offset: true }).nullish(),
      equipment: z.string().nullish(),
      serviceType: CommonModels.ServiceTypeEnumSchema.nullish(),
      destinationOffice: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      currency: z.string().nullish(),
      profit: z.number().nullish(),
      margin: z.number().nullish(),
      employee: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      project: z.object({ id: z.string().nullable(), name: z.string().nullable() }).readonly().nullish(),
      serviceDate: z.iso.datetime({ offset: true }).nullish(),
      departureDate: z.iso.datetime({ offset: true }).nullish(),
      arrivalDate: z.iso.datetime({ offset: true }).nullish(),
      blfromCostumerDate: z.iso.datetime({ offset: true }).nullish(),
      blfromCarrierDate: z.iso.datetime({ offset: true }).nullish(),
      customsDate: z.iso.datetime({ offset: true }).nullish(),
      vgmCustomerDate: z.iso.datetime({ offset: true }).nullish(),
      routing: CommonModels.SeaRoutingEnumSchema.nullish(),
      notes: CommonModels.EditorContentResponseDtoSchema.describe("Notes").nullish(),
      isMasterPosition: z.boolean(),
      hasInvoices: z.boolean().describe("Whether this position has at least one invoice").nullish(),
      parentPosition: z.object({ id: z.string().nullable(), number: z.string().nullable() }).readonly().nullish(),
    })
    .readonly();
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
  export const PositionFilterDtoSchema = z
    .object({
      transportMode: CommonModels.TransportModeEnumSchema,
      customerId: z.array(z.string()).readonly(),
      carrierId: z.array(z.string()).readonly().describe("Filter positions by carrier IDs"),
      consigneeId: z.array(z.string()).readonly().describe("Filter positions by consignee IDs"),
      isCancelled: z.boolean(),
      status: CommonModels.PositionStatusEnumSchema,
      number: z.string(),
      direction: CommonModels.DirectionEnumSchema,
      loadType: CommonModels.LoadTypeEnumSchema,
      serviceType: CommonModels.ServiceTypeEnumSchema,
      employee: z.array(z.string()).readonly().describe("Filter positions by employee IDs"),
      searchQuery: z.string(),
      externalSystemId: z.string().describe("Filter positions by external system ID (substring match)"),
      createdAt: CommonModels.DateRangeDtoSchema,
      serviceDate: CommonModels.DateRangeDtoSchema,
      departureDate: CommonModels.DateRangeDtoSchema,
      arrivalDate: CommonModels.DateRangeDtoSchema,
      blfromCostumerDate: CommonModels.DateRangeDtoSchema,
      blfromCarrierDate: CommonModels.DateRangeDtoSchema,
      customsDate: CommonModels.DateRangeDtoSchema,
      vgmCustomerDate: CommonModels.DateRangeDtoSchema,
      partnerNetworkId: z.string().describe("Filter positions by partner network ID"),
      projectLiteId: z.array(z.string()).readonly().describe("Filter positions by project IDs"),
      checklistItemsDone: z.array(z.string()).readonly().describe("Checklist item ids that must be completed"),
      checklistItemsNotDone: z.array(z.string()).readonly().describe("Checklist item ids that must be not completed"),
      routing: CommonModels.SeaRoutingEnumSchema,
      isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).readonly(),
      isMasterPosition: z.boolean(),
      loadingPortId: z
        .array(z.string())
        .readonly()
        .describe(
          "Filter positions by loading port/airport IDs (checks both sea port of loading and air airport of departure)",
        ),
      dischargePortId: z
        .array(z.string())
        .readonly()
        .describe(
          "Filter positions by discharge port/airport IDs (checks both sea port of discharge and air destination airport)",
        ),
      customerReference: z.string().describe("Filter positions by customer reference"),
      carrierReference: z.string().describe("Filter positions by carrier reference"),
      consigneeReference: z.string().describe("Filter positions by consignee reference"),
      hblNumber: z.string().describe("Filter positions by HBL/HAWB number"),
      mblNumber: z.string().describe("Filter positions by MBL/MAWB number"),
      bookingNumber: z.string().describe("Filter positions by booking number"),
      vessel: z.string().describe("Filter positions by vessel name"),
      voyage: z.string().describe("Filter positions by voyage number"),
      vesselCarrier: z.string().describe("Filter positions by vessel or carrier name"),
    })
    .readonly();
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
  export const PositionExportFilterDtoSchema = z
    .object({
      transportMode: CommonModels.TransportModeEnumSchema,
      customerId: z.array(z.string()).readonly(),
      isCancelled: z.boolean(),
      status: CommonModels.PositionStatusEnumSchema,
      number: z.string(),
      direction: CommonModels.DirectionEnumSchema,
      loadType: CommonModels.LoadTypeEnumSchema,
      serviceType: CommonModels.ServiceTypeEnumSchema,
      responsibleEmployee: z.array(z.string()).readonly().describe("Filter positions by responsible employee IDs"),
      searchQuery: z.string(),
      externalSystemId: z.string().describe("Filter positions by external system ID (substring match)"),
      statusDate: CommonModels.DateRangeDtoSchema,
      serviceDate: CommonModels.DateRangeDtoSchema,
      dateOfDeparture: CommonModels.DateRangeDtoSchema,
      dateOfArrival: CommonModels.DateRangeDtoSchema,
      blfromCostumerDate: CommonModels.DateRangeDtoSchema,
      blfromCarrierDate: CommonModels.DateRangeDtoSchema,
      customsDate: CommonModels.DateRangeDtoSchema,
      vgmCustomerDate: CommonModels.DateRangeDtoSchema,
      partnerNetworkId: z.string().describe("Filter positions by partner network ID"),
      projectLiteId: z.array(z.string()).readonly().describe("Filter positions by project IDs"),
      checklistItemsDone: z.array(z.string()).readonly().describe("Checklist item ids that must be completed"),
      checklistItemsNotDone: z.array(z.string()).readonly().describe("Checklist item ids that must be not completed"),
      routing: CommonModels.SeaRoutingEnumSchema,
      isExcludedFromStatistics: z.array(CommonModels.BooleanFilterEnumSchema).readonly(),
    })
    .readonly();
  export type PositionExportFilterDto = z.infer<typeof PositionExportFilterDtoSchema>;

  /**
   * PositionExportColumnSchema
   * @type { enum }
   */
  export const PositionExportColumnSchema = z.enum([
    "id",
    "externalSystemId",
    "transportMode",
    "direction",
    "loadType",
    "createdAt",
    "number",
    "isCancelled",
    "customerName",
    "customerPhone",
    "customerEmail",
    "customerReference",
    "consigneeName",
    "consigneeReference",
    "carrierName",
    "carrierReference",
    "positionNumber",
    "hblNumber",
    "mblNumber",
    "bookingNumber",
    "vessel",
    "voyage",
    "originName",
    "loadDate",
    "loadingPortName",
    "dischargePortName",
    "destinationName",
    "deliveryDate",
    "equipment",
    "serviceTypeName",
    "departureDate",
    "arrivalDate",
    "destinationOfficeName",
    "currency",
    "profit",
    "margin",
    "employeeName",
    "projectName",
    "serviceDate",
    "routing",
    "notes",
    "blFromCustomerDate",
    "blFromCarrierDate",
    "customsDate",
    "vgmCustomerDate",
    "isMasterPosition",
    "parentPositionId",
    "parentPositionNumber",
  ]);
  export type PositionExportColumn = z.infer<typeof PositionExportColumnSchema>;
  export const PositionExportColumn = PositionExportColumnSchema.enum;

  /**
   * PositionExportRequestDtoSchema
   * @type { object }
   * @property { string } order Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition. Example: `number`
   * @property { PositionExportColumn[] } columns Min Items: `1`
   * @property { PositionExportFilterDto } filter
   */
  export const PositionExportRequestDtoSchema = z
    .object({
      order: z
        .string()
        .describe(
          "Order by fields (comma separated with +/- prefix): number, transportMode, isCancelled, direction, loadType, serviceDate, createdAt, departureDate, arrivalDate, blfromCostumerDate, blfromCarrierDate, customsDate, vgmCustomerDate, serviceType, externalSystemId, employee, project, profit, margin, isMasterPosition",
        ),
      columns: z.array(PositionExportColumnSchema).readonly().min(1),
      filter: PositionExportFilterDtoSchema,
    })
    .readonly();
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
  export const CreatePositionRequestDtoSchema = z
    .object({
      section: CommonModels.SectionEnumSchema,
      direction: CommonModels.DirectionEnumSchema,
      transportMode: CommonModels.TransportModeEnumSchema,
      loadType: CommonModels.LoadTypeEnumSchema,
      serviceType: CommonModels.ServiceTypeEnumSchema,
      estimatedServiceDate: z.iso.datetime({ offset: true }),
      customerBusinessPartnerId: z.string(),
    })
    .readonly();
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
  export const DuplicatePositionPackageInformationParametersDtoSchema = z
    .object({
      enabled: z.boolean(),
      packageType: z.boolean(),
      packageQuantity: z.boolean(),
      packageDescription: z.boolean(),
      packageHsCodes: z.boolean(),
      packageNetWeight: z.boolean(),
      packageGrossWeight: z.boolean(),
      packageCaseMark: z.boolean(),
      packageNote: z.boolean(),
      packageCustomsMark: z.boolean(),
    })
    .readonly();
  export type DuplicatePositionPackageInformationParametersDto = z.infer<
    typeof DuplicatePositionPackageInformationParametersDtoSchema
  >;

  /**
   * DuplicatePositionCargoParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { DuplicatePositionPackageInformationParametersDto } packageInformation
   */
  export const DuplicatePositionCargoParametersDtoSchema = z
    .object({ enabled: z.boolean(), packageInformation: DuplicatePositionPackageInformationParametersDtoSchema })
    .readonly();
  export type DuplicatePositionCargoParametersDto = z.infer<typeof DuplicatePositionCargoParametersDtoSchema>;

  /**
   * DuplicatePositionOverviewParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { boolean } quoteReference
   */
  export const DuplicatePositionOverviewParametersDtoSchema = z
    .object({ enabled: z.boolean(), quoteReference: z.boolean() })
    .readonly();
  export type DuplicatePositionOverviewParametersDto = z.infer<typeof DuplicatePositionOverviewParametersDtoSchema>;

  /**
   * DuplicatePositionInvolvedPartiesParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { boolean } involvedPartySection
   */
  export const DuplicatePositionInvolvedPartiesParametersDtoSchema = z
    .object({ enabled: z.boolean(), involvedPartySection: z.boolean() })
    .readonly();
  export type DuplicatePositionInvolvedPartiesParametersDto = z.infer<
    typeof DuplicatePositionInvolvedPartiesParametersDtoSchema
  >;

  /**
   * DuplicatePositionRoutesParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { boolean } routeDates
   * @property { boolean } routeLocation
   */
  export const DuplicatePositionRoutesParametersDtoSchema = z
    .object({ enabled: z.boolean(), routeDates: z.boolean(), routeLocation: z.boolean() })
    .readonly();
  export type DuplicatePositionRoutesParametersDto = z.infer<typeof DuplicatePositionRoutesParametersDtoSchema>;

  /**
   * DuplicatePositionFinanceAccountParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { boolean } exchangeRate
   */
  export const DuplicatePositionFinanceAccountParametersDtoSchema = z
    .object({ enabled: z.boolean(), exchangeRate: z.boolean() })
    .readonly();
  export type DuplicatePositionFinanceAccountParametersDto = z.infer<
    typeof DuplicatePositionFinanceAccountParametersDtoSchema
  >;

  /**
   * DuplicatePositionDocumentsParametersDtoSchema
   * @type { object }
   * @property { boolean } enabled
   * @property { boolean } hblWorkingDocument
   * @property { boolean } siWorkingDocument
   */
  export const DuplicatePositionDocumentsParametersDtoSchema = z
    .object({ enabled: z.boolean(), hblWorkingDocument: z.boolean(), siWorkingDocument: z.boolean() })
    .readonly();
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
  export const DuplicatePositionParametersDtoSchema = z
    .object({
      overview: DuplicatePositionOverviewParametersDtoSchema,
      involvedParties: DuplicatePositionInvolvedPartiesParametersDtoSchema,
      cargo: DuplicatePositionCargoParametersDtoSchema,
      routes: DuplicatePositionRoutesParametersDtoSchema,
      financeAccount: DuplicatePositionFinanceAccountParametersDtoSchema,
      documents: DuplicatePositionDocumentsParametersDtoSchema,
    })
    .readonly();
  export type DuplicatePositionParametersDto = z.infer<typeof DuplicatePositionParametersDtoSchema>;

  /**
   * DuplicatePositionDefaultParametersResponseDtoSchema
   * @type { object }
   * @property { string } estimatedServiceDate Suggested estimated service date for the duplicated position (ISO 8601)
   * @property { DuplicatePositionParametersDto } parameters Default duplication parameters with section and sub-parameter flags
   */
  export const DuplicatePositionDefaultParametersResponseDtoSchema = z
    .object({
      estimatedServiceDate: z
        .string()
        .describe("Suggested estimated service date for the duplicated position (ISO 8601)"),
      parameters: DuplicatePositionParametersDtoSchema.describe(
        "Default duplication parameters with section and sub-parameter flags",
      ),
    })
    .readonly();
  export type DuplicatePositionDefaultParametersResponseDto = z.infer<
    typeof DuplicatePositionDefaultParametersResponseDtoSchema
  >;

  /**
   * PositionSectionEnumSchema
   * @type { enum }
   */
  export const PositionSectionEnumSchema = z.enum([
    "overview",
    "involvedParties",
    "cargo",
    "financeAccount",
    "routes",
    "routeDates",
    "documents",
  ]);
  export type PositionSectionEnum = z.infer<typeof PositionSectionEnumSchema>;
  export const PositionSectionEnum = PositionSectionEnumSchema.enum;

  /**
   * DuplicatePositionRequestDtoSchema
   * @type { object }
   * @property { PositionSectionEnum[] } sections Legacy: sections to duplicate. Ignored when parameters is provided.
   * @property { DuplicatePositionParametersDto } parameters Nested parameters for duplication control. Preferred over sections.
   * @property { string } estimatedServiceDate
   */
  export const DuplicatePositionRequestDtoSchema = z
    .object({
      sections: z
        .array(PositionSectionEnumSchema)
        .readonly()
        .describe("Legacy: sections to duplicate. Ignored when parameters is provided.")
        .nullish(),
      parameters: DuplicatePositionParametersDtoSchema.describe(
        "Nested parameters for duplication control. Preferred over sections.",
      ).nullish(),
      estimatedServiceDate: z.iso.datetime({ offset: true }),
    })
    .readonly();
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
  export const UpdatePositionDtoSchema = z
    .object({
      externalSystemId: z.string(),
      statusDate: z.iso.datetime({ offset: true }),
      status: CommonModels.PositionStatusEnumSchema,
      loadType: CommonModels.LoadTypeEnumSchema,
      incoterms: CommonModels.IncotermsEnumSchema,
      secondIncoterms: CommonModels.IncotermsEnumSchema,
      fillingCompany: z.string(),
      sellingContract: z.string(),
      fillingScacCode: z.string(),
      serviceValidity: z.iso.datetime({ offset: true }),
      ratesValidity: z.iso.datetime({ offset: true }),
      serviceType: CommonModels.ServiceTypeEnumSchema,
      buyRateReference: z.string(),
      frequency: CommonModels.FrequencyEnumSchema,
      isParentPosition: z.boolean(),
      isExcludedFromStatistics: z.boolean(),
      team: z.string(),
      salesRepId: z.string(),
      responsibleEmployeeId: z.string(),
      receivedByEmployeeId: z.string(),
      originOfficeId: z.string(),
      projectLiteId: z.string(),
      notes: CommonModels.EditorContentUpdateDtoSchema.describe("Notes"),
      inttraTypeOfMove: CommonModels.MovementTypeEnumSchema,
      volumetricWeightModifier: z.number().describe("Volumetric weight modifier"),
    })
    .readonly();
  export type UpdatePositionDto = z.infer<typeof UpdatePositionDtoSchema>;

  /**
   * ChildPositionCustomerDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const ChildPositionCustomerDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type ChildPositionCustomerDto = z.infer<typeof ChildPositionCustomerDtoSchema>;

  /**
   * ChildPositionProfitDtoSchema
   * @type { object }
   * @property { number } amount
   * @property { string } currency
   */
  export const ChildPositionProfitDtoSchema = z.object({ amount: z.number(), currency: z.string() }).readonly();
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
  export const ChildPositionResponseDtoSchema = z
    .object({
      id: z.string(),
      number: z.string(),
      packages: z.number(),
      weight: z.number(),
      volume: z.number(),
      customer: ChildPositionCustomerDtoSchema,
      profit: ChildPositionProfitDtoSchema,
    })
    .readonly();
  export type ChildPositionResponseDto = z.infer<typeof ChildPositionResponseDtoSchema>;

  /**
   * PositionLabelsFilterDtoSchema
   * @type { object }
   * @property { string } search
   * @property { boolean } isParentPosition
   * @property { boolean } isLinkedPosition
   */
  export const PositionLabelsFilterDtoSchema = z
    .object({ search: z.string(), isParentPosition: z.boolean(), isLinkedPosition: z.boolean() })
    .readonly();
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
  export const PositionListResponseDtoSchema = z
    .object({
      items: z.array(z.string()).readonly().describe("Items"),
      totalProfit: z.number(),
      profitPerPosition: z.number(),
      page: z.number().describe("1-indexed page number to begin from").nullish(),
      cursor: z.string().describe("ID of item to start after").nullish(),
      nextCursor: z.string().describe("Cursor for next set of items").nullish(),
      limit: z.number().describe("Items per response"),
      totalItems: z.number().describe("Total available items"),
    })
    .readonly();
  export type PositionListResponseDto = z.infer<typeof PositionListResponseDtoSchema>;

  /**
   * LinkChildPositionsRequestDtoSchema
   * @type { object }
   * @property { string[] } childPositionIds
   */
  export const LinkChildPositionsRequestDtoSchema = z
    .object({ childPositionIds: z.array(z.string()).readonly() })
    .readonly();
  export type LinkChildPositionsRequestDto = z.infer<typeof LinkChildPositionsRequestDtoSchema>;

  /**
   * UnlinkChildPositionsRequestDtoSchema
   * @type { object }
   * @property { string[] } childPositionIds
   */
  export const UnlinkChildPositionsRequestDtoSchema = z
    .object({ childPositionIds: z.array(z.string()).readonly() })
    .readonly();
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
  export const PositionsFindAllResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PositionsFindAllResponse = z.infer<typeof PositionsFindAllResponseSchema>;

  /**
   * PositionsPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const PositionsPaginateOrderParamEnumSchema = z.enum([
    "number",
    "transportMode",
    "isCancelled",
    "direction",
    "loadType",
    "serviceDate",
    "createdAt",
    "departureDate",
    "arrivalDate",
    "blfromCostumerDate",
    "blfromCarrierDate",
    "customsDate",
    "vgmCustomerDate",
    "serviceType",
    "externalSystemId",
    "employee",
    "project",
    "profit",
    "margin",
    "isMasterPosition",
  ]);
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
  export const PositionsPaginateResponseSchema = z.object({
    ...PositionListResponseDtoSchema.shape,
    ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).readonly() }).readonly().shape,
  });
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
  export const TotalProfitResponseSchema = z.object({
    ...PositionListResponseDtoSchema.shape,
    ...z.object({ items: z.array(PositionPreviewResponseDtoSchema).readonly() }).readonly().shape,
  });
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
  export const PositionsListAvailablePartnersForResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PositionsListAvailablePartnersForResponse = z.infer<
    typeof PositionsListAvailablePartnersForResponseSchema
  >;

  /**
   * ListRouteLabelsResponseSchema
   * @type { array }
   */
  export const ListRouteLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema).readonly();
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
  export const ListChildResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(ChildPositionResponseDtoSchema).readonly() }).readonly().shape,
  });
  export type ListChildResponse = z.infer<typeof ListChildResponseSchema>;
}
