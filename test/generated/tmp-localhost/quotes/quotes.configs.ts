import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { QuotesModels } from "./quotes.models";
import { QuotesQueries } from "./quotes.queries";
import { QuotesAcl } from "./quotes.acl";

export namespace QuotesConfigs {
export const quotesConfig = {
    meta: {
        title: "Quotes",
    },
    readAll: {
        acl: QuotesAcl.canUsePaginate,
        schema: QuotesModels.QuotePreviewResponseDTOSchema,
        paginated: QuotesQueries.usePaginate,
        infinite: QuotesQueries.usePaginateInfinite,
        filters: {
            schema: QuotesModels.QuoteFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: QuotesModels.QuoteFilterDtoSchema,
  options: {
    inputs: {
      statusDate: true,
      transportMode: true,
      status: true,
      direction: true,
      loadType: true,
      serviceType: true,
      carrierId: true,
      consigneeId: true,
      employee: true,
      routing: true,
      number: true,
      createdAt: true,
      vesselCarrier: true,
      searchQuery: true,
      customer: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: QuotesModels.QuotePreviewResponseDTOSchema,
  options: {
    columns: {
      id: true,
      transportMode: true,
      statusDate: true,
      createdAt: true,
      number: true,
      status: true,
      direction: true,
      loadType: true,
      customer: true,
      customerReference: true,
      consignee: true,
      consigneeReference: true,
      carrier: true,
      carrierReference: true,
      employee: true,
      origin: true,
      destination: true,
      portOfLoading: true,
      dischargePort: true,
      bookingNumber: true,
      vessel: true,
      voyage: true,
      vesselCarrier: true,
      equipment: true,
      serviceType: true,
      currency: true,
      profit: true,
      margin: true,
      numberOfConvertedPositions: true,
      departureDate: true,
      arrivalDate: true,
      routing: true,
    },
    sortable: QuotesModels.QuotesPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: QuotesAcl.canUseGetById,
        schema: QuotesModels.QuoteCoreResponseDTOSchema,
        query: QuotesQueries.useGetById,
    },
    create: {
        acl: QuotesAcl.canUseCreate,
        schema: QuotesModels.CreateQuoteRequestDTOSchema,
        mutation: QuotesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: QuotesModels.CreateQuoteRequestDTOSchema,
  options: {
    inputs: {
      section: true,
      direction: true,
      transportMode: true,
      loadType: true,
      serviceType: true,
      customerBusinessPartnerId: true,
    },
  },
})
    },
    update: {
        acl: QuotesAcl.canUseUpdate,
        schema: QuotesModels.UpdateQuoteRequestDTOSchema,
        mutation: QuotesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: QuotesModels.UpdateQuoteRequestDTOSchema,
  options: {
    inputs: {
      number: true,
      statusDate: true,
      cargoType: true,
      loadType: true,
      incoterms: true,
      secondIncoterms: true,
      serviceType: true,
      buyRateReference: true,
      frequency: true,
      transitDurationInDays: true,
      quoteType: true,
      defaultCurrencyId: true,
      salesRepId: true,
      responsibleEmployeeId: true,
      receivedByEmployeeId: true,
      team: true,
      volumetricWeightModifier: true,
      roadDetails: true,
      airDetails: true,
      seaDetails: true,
    },
  },
})
    },
};

}
