import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace QuotesModels {
/** 
 * QuoteStatusEnumSchema 
 * @type { enum }
 */
export const QuoteStatusEnumSchema = z.enum(["Pending", "Cancelled", "Converted"]);
export type QuoteStatusEnum = z.infer<typeof QuoteStatusEnumSchema>;
export const QuoteStatusEnum = QuoteStatusEnumSchema.enum;

/** 
 * QuoteCustomerResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label  
 * @property { string } phone The phone number of the customer 
 * @property { string } email The email of the customer 
 */
export const QuoteCustomerResponseDtoSchema = z.object({ id: z.string().describe("Unique identifier of the customer"), name: z.string(), matchCode: z.string(), label: z.string(), phone: z.string().describe("The phone number of the customer").nullish(), email: z.string().describe("The email of the customer").nullish() }).readonly();
export type QuoteCustomerResponseDto = z.infer<typeof QuoteCustomerResponseDtoSchema>;


/** 
 * QuoteNamedReferenceResponseDtoSchema 
 * @type { object }
 * @property { string } id Unique identifier of the entity 
 * @property { string } name Name of the entity 
 * @property { string } matchCode  
 * @property { string } label Display label (name or match code depending on office settings) 
 */
export const QuoteNamedReferenceResponseDtoSchema = z.object({ id: z.string().describe("Unique identifier of the entity").nullable(), name: z.string().describe("Name of the entity").nullable(), matchCode: z.string().nullable(), label: z.string().describe("Display label (name or match code depending on office settings)").nullable() }).readonly();
export type QuoteNamedReferenceResponseDto = z.infer<typeof QuoteNamedReferenceResponseDtoSchema>;


/** 
 * QuotePreviewResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the quote 
 * @property { CommonModels.TransportModeEnum } transportMode Transport mode 
 * @property { string } statusDate The date of the quote status 
 * @property { string } createdAt The date when the quote was created 
 * @property { string } number The quote number 
 * @property { QuoteStatusEnum } status Status of the quote 
 * @property { CommonModels.DirectionEnum } direction Direction of the quote 
 * @property { CommonModels.LoadTypeEnum } loadType Load type 
 * @property { QuoteCustomerResponseDto } customer The customer information 
 * @property { string } customerReference Customer reference number 
 * @property { QuoteNamedReferenceResponseDto } consignee Consignee information 
 * @property { string } consigneeReference Consignee reference number 
 * @property { QuoteNamedReferenceResponseDto } carrier The carrier 
 * @property { string } carrierReference Carrier reference number 
 * @property { QuoteNamedReferenceResponseDto } employee Responsible employee 
 * @property { QuoteNamedReferenceResponseDto } origin Origin location 
 * @property { QuoteNamedReferenceResponseDto } destination Destination location 
 * @property { QuoteNamedReferenceResponseDto } portOfLoading Port of loading 
 * @property { QuoteNamedReferenceResponseDto } dischargePort Discharge port 
 * @property { string } bookingNumber Booking reference number 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } vesselCarrier Carrier name from route point (sea positions only) 
 * @property { string } equipment Equipment summary (e.g., "2x20DC, 1x40HC") 
 * @property { CommonModels.ServiceTypeEnum } serviceType Service type 
 * @property { string } currency Currency code 
 * @property { number } profit Total profit 
 * @property { number } margin Profit margin percentage 
 * @property { number } numberOfConvertedPositions Number of positions converted from this quote 
 * @property { string } departureDate Departure date 
 * @property { string } arrivalDate Arrival date 
 * @property { CommonModels.SeaRoutingEnum } routing Sea routing type 
 */
export const QuotePreviewResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the quote"), transportMode: CommonModels.TransportModeEnumSchema.describe("Transport mode"), statusDate: z.iso.datetime({ offset: true }).describe("The date of the quote status").nullable(), createdAt: z.iso.datetime({ offset: true }).describe("The date when the quote was created"), number: z.string().describe("The quote number"), status: QuoteStatusEnumSchema.describe("Status of the quote"), direction: CommonModels.DirectionEnumSchema.describe("Direction of the quote"), loadType: CommonModels.LoadTypeEnumSchema.describe("Load type").nullish(), customer: QuoteCustomerResponseDtoSchema.describe("The customer information"), customerReference: z.string().describe("Customer reference number").nullish(), consignee: QuoteNamedReferenceResponseDtoSchema.describe("Consignee information").nullish(), consigneeReference: z.string().describe("Consignee reference number").nullish(), carrier: QuoteNamedReferenceResponseDtoSchema.describe("The carrier").nullish(), carrierReference: z.string().describe("Carrier reference number").nullish(), employee: QuoteNamedReferenceResponseDtoSchema.describe("Responsible employee").nullish(), origin: QuoteNamedReferenceResponseDtoSchema.describe("Origin location"), destination: QuoteNamedReferenceResponseDtoSchema.describe("Destination location"), portOfLoading: QuoteNamedReferenceResponseDtoSchema.describe("Port of loading").nullish(), dischargePort: QuoteNamedReferenceResponseDtoSchema.describe("Discharge port").nullish(), bookingNumber: z.string().describe("Booking reference number").nullish(), vessel: z.string().describe("Vessel name").nullish(), voyage: z.string().describe("Voyage number").nullish(), vesselCarrier: z.string().describe("Carrier name from route point (sea positions only)").nullish(), equipment: z.string().describe("Equipment summary (e.g., "2x20DC, 1x40HC")").nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.describe("Service type").nullish(), currency: z.string().describe("Currency code").nullish(), profit: z.number().describe("Total profit").nullish(), margin: z.number().describe("Profit margin percentage").nullish(), numberOfConvertedPositions: z.number().describe("Number of positions converted from this quote"), departureDate: z.iso.datetime({ offset: true }).describe("Departure date").nullish(), arrivalDate: z.iso.datetime({ offset: true }).describe("Arrival date").nullish(), routing: CommonModels.SeaRoutingEnumSchema.describe("Sea routing type").nullish() }).readonly();
export type QuotePreviewResponseDTO = z.infer<typeof QuotePreviewResponseDTOSchema>;


/** 
 * QuoteFilterDtoSchema 
 * @type { object }
 * @property { CommonModels.DateRangeDto } statusDate  
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { QuoteStatusEnum[] } status  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { CommonModels.LoadTypeEnum } loadType  
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string[] } carrierId Filter quotes by carrier IDs 
 * @property { string[] } consigneeId Filter quotes by consignee IDs 
 * @property { string[] } employee Filter quotes by employee IDs 
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { string } number Filter quotes by quote number 
 * @property { CommonModels.DateRangeDto } createdAt  
 * @property { string } vesselCarrier Filter quotes by carrier name from route point 
 * @property { string } searchQuery  
 * @property { string[] } customer  
 */
export const QuoteFilterDtoSchema = z.object({ statusDate: CommonModels.DateRangeDtoSchema, transportMode: CommonModels.TransportModeEnumSchema, status: z.array(QuoteStatusEnumSchema).readonly(), direction: CommonModels.DirectionEnumSchema, loadType: CommonModels.LoadTypeEnumSchema, serviceType: CommonModels.ServiceTypeEnumSchema, carrierId: z.array(z.string()).readonly().describe("Filter quotes by carrier IDs"), consigneeId: z.array(z.string()).readonly().describe("Filter quotes by consignee IDs"), employee: z.array(z.string()).readonly().describe("Filter quotes by employee IDs"), routing: CommonModels.SeaRoutingEnumSchema, number: z.string().describe("Filter quotes by quote number"), createdAt: CommonModels.DateRangeDtoSchema, vesselCarrier: z.string().describe("Filter quotes by carrier name from route point"), searchQuery: z.string(), customer: z.array(z.string()).readonly() }).readonly();
export type QuoteFilterDto = z.infer<typeof QuoteFilterDtoSchema>;


/** 
 * QuoteExportFilterDtoSchema 
 * @type { object }
 * @property { CommonModels.DateRangeDto } statusDate  
 * @property { CommonModels.TransportModeEnum } transportMode  
 * @property { QuoteStatusEnum[] } status  
 * @property { CommonModels.DirectionEnum } direction  
 * @property { string } searchQuery  
 * @property { string[] } customer  
 */
export const QuoteExportFilterDtoSchema = z.object({ statusDate: CommonModels.DateRangeDtoSchema, transportMode: CommonModels.TransportModeEnumSchema, status: z.array(QuoteStatusEnumSchema).readonly(), direction: CommonModels.DirectionEnumSchema, searchQuery: z.string(), customer: z.array(z.string()).readonly() }).readonly();
export type QuoteExportFilterDto = z.infer<typeof QuoteExportFilterDtoSchema>;


/** 
 * QuoteExportColumnSchema 
 * @type { enum }
 */
export const QuoteExportColumnSchema = z.enum(["id", "transportMode", "statusDate", "createdAt", "number", "status", "direction", "loadType", "serviceType", "customerId", "customerName", "customerPhone", "customerEmail", "customerReference", "consigneeId", "consigneeName", "consigneeReference", "carrierId", "carrierName", "carrierReference", "responsibleEmployeeName", "originLocationId", "originLocationName", "destinationLocationId", "destinationLocationName", "portOfLoadingId", "portOfLoadingName", "dischargePortId", "dischargePortName", "bookingNumber", "vessel", "voyage", "equipment", "departureDate", "arrivalDate", "routing", "currency", "profit", "margin"]);
export type QuoteExportColumn = z.infer<typeof QuoteExportColumnSchema>;
export const QuoteExportColumn = QuoteExportColumnSchema.enum;

/** 
 * QuoteExportRequestDtoSchema 
 * @type { object }
 * @property { QuoteExportColumn[] } columns Min Items: `1` 
 * @property { string[] } order  
 * @property { QuoteExportFilterDto } filter  
 */
export const QuoteExportRequestDtoSchema = z.object({ columns: z.array(QuoteExportColumnSchema).readonly().min(1), order: z.array(z.string()).readonly(), filter: QuoteExportFilterDtoSchema }).readonly();
export type QuoteExportRequestDto = z.infer<typeof QuoteExportRequestDtoSchema>;


/** 
 * CreateQuoteRequestDTOSchema 
 * @type { object }
 * @property { CommonModels.SectionEnum } section The section of the quote 
 * @property { CommonModels.DirectionEnum } direction The direction of the quote 
 * @property { CommonModels.TransportModeEnum } transportMode The mode of transport for the quote 
 * @property { CommonModels.LoadTypeEnum } loadType The load type for the quote 
 * @property { CommonModels.ServiceTypeEnum } serviceType The service type for the quote 
 * @property { string } customerBusinessPartnerId The ID of the business partner that is the customer 
 */
export const CreateQuoteRequestDTOSchema = z.object({ section: CommonModels.SectionEnumSchema.describe("The section of the quote"), direction: CommonModels.DirectionEnumSchema.describe("The direction of the quote"), transportMode: CommonModels.TransportModeEnumSchema.describe("The mode of transport for the quote"), loadType: CommonModels.LoadTypeEnumSchema.describe("The load type for the quote"), serviceType: CommonModels.ServiceTypeEnumSchema.describe("The service type for the quote"), customerBusinessPartnerId: z.string().describe("The ID of the business partner that is the customer") }).readonly();
export type CreateQuoteRequestDTO = z.infer<typeof CreateQuoteRequestDTOSchema>;


/** 
 * QuoteCustomerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const QuoteCustomerDtoSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type QuoteCustomerDto = z.infer<typeof QuoteCustomerDtoSchema>;


/** 
 * QuoteEmployeeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the employee 
 * @property { string } name Name of the employee 
 */
export const QuoteEmployeeResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the employee"), name: z.string().describe("Name of the employee") }).readonly();
export type QuoteEmployeeResponseDTO = z.infer<typeof QuoteEmployeeResponseDTOSchema>;


/** 
 * CargoTypeEnumSchema 
 * @type { enum }
 */
export const CargoTypeEnumSchema = z.enum(["Trailer", "Container", "BreakBulk", "Roro", "Project"]);
export type CargoTypeEnum = z.infer<typeof CargoTypeEnumSchema>;
export const CargoTypeEnum = CargoTypeEnumSchema.enum;

/** 
 * QuoteTypeEnumSchema 
 * @type { enum }
 */
export const QuoteTypeEnumSchema = z.enum(["Sea", "Road", "Air"]);
export type QuoteTypeEnum = z.infer<typeof QuoteTypeEnumSchema>;
export const QuoteTypeEnum = QuoteTypeEnumSchema.enum;

/** 
 * QuoteConvertedPositionDtoSchema 
 * @type { object }
 * @property { string } positionId  
 * @property { string } positionNumber  
 */
export const QuoteConvertedPositionDtoSchema = z.object({ positionId: z.string(), positionNumber: z.string() }).readonly();
export type QuoteConvertedPositionDto = z.infer<typeof QuoteConvertedPositionDtoSchema>;


/** 
 * QuoteCoreResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the quote 
 * @property { string } rootFolderId Root folder identifier bound to this quote 
 * @property { QuoteCustomerDto } customer  
 * @property { QuoteStatusEnum } status Current status of the quote 
 * @property { string } responsibleEmployeeId Unique identifier of the responsible employee 
 * @property { string } receivedByEmployeeId Unique identifier of the employee receiving the quote 
 * @property { CommonModels.ServiceTypeEnum } serviceType  
 * @property { string } salesRepId Unique identifier of the sales rep 
 * @property { QuoteEmployeeResponseDTO } responsibleEmployee The responsible employee 
 * @property { QuoteEmployeeResponseDTO } receivedByEmployee The employee who received the quote 
 * @property { string } owningOfficeId ID of the office owning the quote 
 * @property { string } name Name of the quote 
 * @property { string } number Quote number 
 * @property { CommonModels.SectionEnum } section Section of the quote 
 * @property { CommonModels.DirectionEnum } direction Direction of the quote 
 * @property { CommonModels.TransportModeEnum } transportMode Mode of transport 
 * @property { string } statusDate Date of the quote status 
 * @property { CargoTypeEnum } cargoType Type of cargo 
 * @property { CommonModels.IncotermsEnum } incoterms Incoterms for the quote 
 * @property { CommonModels.IncotermsEnum } secondIncoterms Second incoterms for the quote 
 * @property { string } buyRateReference Reference for buy rate 
 * @property { CommonModels.FrequencyEnum } frequency Frequency of the quote 
 * @property { string } transitDurationInDays Transit duration in days 
 * @property { QuoteTypeEnum } quoteType Type of quote 
 * @property { string } defaultCurrencyId Default currency 
 * @property { QuoteEmployeeResponseDTO } salesRep The sales rep for the quote 
 * @property { string } team Team 
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { QuoteConvertedPositionDto[] } convertedPositions Positions converted from this quote. Default: `` 
 * @property { CommonModels.LoadTypeEnum } loadType Load type of quote 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 */
export const QuoteCoreResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier of the quote"), rootFolderId: z.string().describe("Root folder identifier bound to this quote").nullish(), customer: QuoteCustomerDtoSchema.nullish(), status: QuoteStatusEnumSchema.describe("Current status of the quote"), responsibleEmployeeId: z.string().describe("Unique identifier of the responsible employee").nullish(), receivedByEmployeeId: z.string().describe("Unique identifier of the employee receiving the quote").nullish(), serviceType: CommonModels.ServiceTypeEnumSchema.nullish(), salesRepId: z.string().describe("Unique identifier of the sales rep").nullish(), responsibleEmployee: QuoteEmployeeResponseDTOSchema.describe("The responsible employee").nullish(), receivedByEmployee: QuoteEmployeeResponseDTOSchema.describe("The employee who received the quote").nullish(), owningOfficeId: z.string().describe("ID of the office owning the quote"), name: z.string().describe("Name of the quote"), number: z.string().describe("Quote number"), section: CommonModels.SectionEnumSchema.describe("Section of the quote"), direction: CommonModels.DirectionEnumSchema.describe("Direction of the quote"), transportMode: CommonModels.TransportModeEnumSchema.describe("Mode of transport"), statusDate: z.iso.datetime({ offset: true }).describe("Date of the quote status"), cargoType: CargoTypeEnumSchema.describe("Type of cargo").nullish(), incoterms: CommonModels.IncotermsEnumSchema.describe("Incoterms for the quote").nullish(), secondIncoterms: CommonModels.IncotermsEnumSchema.describe("Second incoterms for the quote").nullish(), buyRateReference: z.string().describe("Reference for buy rate").nullish(), frequency: CommonModels.FrequencyEnumSchema.describe("Frequency of the quote").nullish(), transitDurationInDays: z.string().describe("Transit duration in days").nullish(), quoteType: QuoteTypeEnumSchema.describe("Type of quote").nullish(), defaultCurrencyId: z.string().describe("Default currency").nullish(), salesRep: QuoteEmployeeResponseDTOSchema.describe("The sales rep for the quote").nullish(), team: z.string().describe("Team").nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), convertedPositions: z.array(QuoteConvertedPositionDtoSchema).readonly().describe("Positions converted from this quote").default([]), loadType: CommonModels.LoadTypeEnumSchema.describe("Load type of quote").nullish(), volumetricWeightModifier: z.number().describe("Volumetric weight modifier").nullish() }).readonly();
export type QuoteCoreResponseDTO = z.infer<typeof QuoteCoreResponseDTOSchema>;


/** 
 * UpdateQuoteRequestDTOSchema 
 * @type { object }
 * @property { string } number The quote number 
 * @property { string } statusDate The date of the quote status 
 * @property { CargoTypeEnum } cargoType The type of cargo for the quote 
 * @property { CommonModels.LoadTypeEnum } loadType The load type for the quote 
 * @property { CommonModels.IncotermsEnum } incoterms The incoterms for the quote 
 * @property { CommonModels.IncotermsEnum } secondIncoterms The second incoterms for the quote 
 * @property { CommonModels.ServiceTypeEnum } serviceType The type of service for the quote 
 * @property { string } buyRateReference The reference for the buy rate 
 * @property { CommonModels.FrequencyEnum } frequency The frequency of the quote 
 * @property { string } transitDurationInDays The transit duration in days 
 * @property { QuoteTypeEnum } quoteType The type of quote 
 * @property { string } defaultCurrencyId The default currency for the quote 
 * @property { string } salesRepId The sales representative for the quote 
 * @property { string } responsibleEmployeeId The responsible employee for the quote 
 * @property { string } receivedByEmployeeId The employee who receieved the quote 
 * @property { string } team The team responsible for the quote 
 * @property { number } volumetricWeightModifier Volumetric weight modifier 
 */
export const UpdateQuoteRequestDTOSchema = z.object({ number: z.string().describe("The quote number"), statusDate: z.iso.datetime({ offset: true }).describe("The date of the quote status"), cargoType: CargoTypeEnumSchema.describe("The type of cargo for the quote"), loadType: CommonModels.LoadTypeEnumSchema.describe("The load type for the quote"), incoterms: CommonModels.IncotermsEnumSchema.describe("The incoterms for the quote"), secondIncoterms: CommonModels.IncotermsEnumSchema.describe("The second incoterms for the quote"), serviceType: CommonModels.ServiceTypeEnumSchema.describe("The type of service for the quote"), buyRateReference: z.string().describe("The reference for the buy rate"), frequency: CommonModels.FrequencyEnumSchema.describe("The frequency of the quote"), transitDurationInDays: z.string().describe("The transit duration in days").nullable(), quoteType: QuoteTypeEnumSchema.describe("The type of quote"), defaultCurrencyId: z.string().describe("The default currency for the quote"), salesRepId: z.string().describe("The sales representative for the quote"), responsibleEmployeeId: z.string().describe("The responsible employee for the quote"), receivedByEmployeeId: z.string().describe("The employee who receieved the quote"), team: z.string().describe("The team responsible for the quote"), volumetricWeightModifier: z.number().describe("Volumetric weight modifier") }).readonly();
export type UpdateQuoteRequestDTO = z.infer<typeof UpdateQuoteRequestDTOSchema>;


/** 
 * QuoteSectionEnumSchema 
 * @type { enum }
 */
export const QuoteSectionEnumSchema = z.enum(["Customer", "Overview", "Cargo", "Finances", "Documents"]);
export type QuoteSectionEnum = z.infer<typeof QuoteSectionEnumSchema>;
export const QuoteSectionEnum = QuoteSectionEnumSchema.enum;

/** 
 * DuplicateQuoteRequestDtoSchema 
 * @type { object }
 * @property { QuoteSectionEnum[] } sections The sections to duplicate. Min Items: `1` 
 */
export const DuplicateQuoteRequestDtoSchema = z.object({ sections: z.array(QuoteSectionEnumSchema).readonly().min(1).describe("The sections to duplicate") }).readonly();
export type DuplicateQuoteRequestDto = z.infer<typeof DuplicateQuoteRequestDtoSchema>;


/** 
 * QuoteListResponseDtoSchema 
 * @type { object }
 * @property { string[] } items Items 
 * @property { number } totalProfit  
 * @property { number } profitPerQuote  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 */
export const QuoteListResponseDtoSchema = z.object({ items: z.array(z.string()).readonly().describe("Items"), totalProfit: z.number(), profitPerQuote: z.number(), page: z.number().describe("1-indexed page number to begin from").nullish(), cursor: z.string().describe("ID of item to start after").nullish(), nextCursor: z.string().describe("Cursor for next set of items").nullish(), limit: z.number().describe("Items per response"), totalItems: z.number().describe("Total available items") }).readonly();
export type QuoteListResponseDto = z.infer<typeof QuoteListResponseDtoSchema>;


/** 
 * QuotesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const QuotesPaginateOrderParamEnumSchema = z.enum(["number", "statusDate", "transportMode", "status", "direction", "loadType", "serviceType", "createdAt", "employee", "profit"]);
export type QuotesPaginateOrderParamEnum = z.infer<typeof QuotesPaginateOrderParamEnumSchema>;
export const QuotesPaginateOrderParamEnum = QuotesPaginateOrderParamEnumSchema.enum;

/** 
 * QuotesPaginateResponseSchema 
 * @type { object }
 * @property { number } totalProfit  
 * @property { number } profitPerQuote  
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { QuotePreviewResponseDTO[] } items  
 */
export const QuotesPaginateResponseSchema = z.object({ ...QuoteListResponseDtoSchema.shape, ...z.object({ items: z.array(QuotePreviewResponseDTOSchema).readonly() }).readonly().shape });
export type QuotesPaginateResponse = z.infer<typeof QuotesPaginateResponseSchema>;


/** 
 * QuotesListAvailablePartnersForResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.BusinessPartnerLabelResponseDTO[] } items  
 */
export const QuotesListAvailablePartnersForResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.BusinessPartnerLabelResponseDTOSchema).readonly() }).readonly().shape });
export type QuotesListAvailablePartnersForResponse = z.infer<typeof QuotesListAvailablePartnersForResponseSchema>;


/** 
 * GetInvolvedPartiesResponseSchema 
 * @type { array }
 */
export const GetInvolvedPartiesResponseSchema = z.array(CommonModels.InvolvedPartyResponseDtoSchema).readonly();
export type GetInvolvedPartiesResponse = z.infer<typeof GetInvolvedPartiesResponseSchema>;


}
