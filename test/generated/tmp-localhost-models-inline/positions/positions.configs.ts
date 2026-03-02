import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PositionsModels } from "./positions.models";
import { PositionsQueries } from "./positions.queries";
import { PositionsAcl } from "./positions.acl";

export namespace PositionsConfigs {
export const positionsConfig = {
    meta: {
        title: "Positions",
    },
    readAll: {
        acl: PositionsAcl.canUsePaginate,
        schema: PositionsModels.PositionPreviewResponseDtoSchema,
        paginated: PositionsQueries.usePaginate,
        infinite: PositionsQueries.usePaginateInfinite,
        filters: {
            schema: PositionsModels.PositionFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PositionsModels.PositionFilterDtoSchema,
  options: {
    inputs: {
      transportMode: true,
      customerId: true,
      carrierId: true,
      consigneeId: true,
      isCancelled: true,
      status: true,
      number: true,
      direction: true,
      loadType: true,
      serviceType: true,
      employee: true,
      searchQuery: true,
      externalSystemId: true,
      createdAt: true,
      serviceDate: true,
      departureDate: true,
      arrivalDate: true,
      blfromCostumerDate: true,
      blfromCarrierDate: true,
      customsDate: true,
      vgmCustomerDate: true,
      partnerNetworkId: true,
      projectLiteId: true,
      checklistItemsDone: true,
      checklistItemsNotDone: true,
      routing: true,
      isExcludedFromStatistics: true,
      isMasterPosition: true,
      loadingPortId: true,
      dischargePortId: true,
      customerReference: true,
      carrierReference: true,
      consigneeReference: true,
      hblNumber: true,
      mblNumber: true,
      bookingNumber: true,
      vessel: true,
      voyage: true,
      vesselCarrier: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: PositionsModels.PositionPreviewResponseDtoSchema,
  options: {
    columns: {
      id: true,
      externalSystemId: true,
      transportMode: true,
      direction: true,
      loadType: true,
      createdAt: true,
      number: true,
      isCancelled: true,
      customer: true,
      customerReference: true,
      consignee: true,
      consigneeReference: true,
      carrier: true,
      carrierReference: true,
      positionNumber: true,
      hblNumber: true,
      mblNumber: true,
      bookingNumber: true,
      vessel: true,
      voyage: true,
      vesselCarrier: true,
      origin: true,
      loadDate: true,
      loadingPort: true,
      dischargePort: true,
      destination: true,
      deliveryDate: true,
      equipment: true,
      serviceType: true,
      destinationOffice: true,
      currency: true,
      profit: true,
      margin: true,
      employee: true,
      project: true,
      serviceDate: true,
      departureDate: true,
      arrivalDate: true,
      blfromCostumerDate: true,
      blfromCarrierDate: true,
      customsDate: true,
      vgmCustomerDate: true,
      routing: true,
      notes: true,
      isMasterPosition: true,
      hasInvoices: true,
      parentPosition: true,
    },
    sortable: PositionsModels.PositionsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: PositionsAcl.canUseGet,
        schema: CommonModels.PositionCoreResponseDtoSchema,
        query: PositionsQueries.useGet,
    },
    create: {
        acl: PositionsAcl.canUseCreate,
        schema: PositionsModels.CreatePositionRequestDtoSchema,
        mutation: PositionsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: PositionsModels.CreatePositionRequestDtoSchema,
  options: {
    inputs: {
      section: true,
      direction: true,
      transportMode: true,
      loadType: true,
      serviceType: true,
      estimatedServiceDate: true,
      customerBusinessPartnerId: true,
    },
  },
})
    },
    update: {
        acl: PositionsAcl.canUseUpdate,
        schema: PositionsModels.UpdatePositionDtoSchema,
        mutation: PositionsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: PositionsModels.UpdatePositionDtoSchema,
  options: {
    inputs: {
      externalSystemId: true,
      statusDate: true,
      status: true,
      loadType: true,
      incoterms: true,
      secondIncoterms: true,
      fillingCompany: true,
      sellingContract: true,
      fillingScacCode: true,
      serviceValidity: true,
      ratesValidity: true,
      serviceType: true,
      buyRateReference: true,
      frequency: true,
      isParentPosition: true,
      isExcludedFromStatistics: true,
      team: true,
      salesRepId: true,
      responsibleEmployeeId: true,
      receivedByEmployeeId: true,
      originOfficeId: true,
      projectLiteId: true,
      notes: true,
      inttraTypeOfMove: true,
      volumetricWeightModifier: true,
      airDetails: true,
      seaDetails: true,
    },
  },
})
    },
};

export const labelsConfig = {
    meta: {
        title: "Labels",
    },
    readAll: {
        acl: PositionsAcl.canUseFindAll,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: PositionsQueries.useFindAll,
        infinite: PositionsQueries.useFindAllInfinite,
        filters: {
            schema: PositionsModels.PositionLabelsFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PositionsModels.PositionLabelsFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      isParentPosition: true,
      isLinkedPosition: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CommonModels.LabelResponseDTOSchema,
  options: {
    columns: {
      id: true,
      label: true,
    },
  },
}),
    },
};

export const childrenConfig = {
    meta: {
        title: "Children",
    },
    readAll: {
        acl: PositionsAcl.canUseListChild,
        schema: PositionsModels.ChildPositionResponseDtoSchema,
        paginated: PositionsQueries.useListChild,
        infinite: PositionsQueries.useListChildInfinite,
        columns: dynamicColumns({
  schema: PositionsModels.ChildPositionResponseDtoSchema,
  options: {
    columns: {
      id: true,
      number: true,
      packages: true,
      weight: true,
      volume: true,
      customer: true,
      profit: true,
    },
  },
}),
    },
    create: {
        acl: PositionsAcl.canUseLinkChild,
        schema: PositionsModels.LinkChildPositionsRequestDtoSchema,
        mutation: PositionsQueries.useLinkChild,
        inputDefs: dynamicInputs({
  schema: PositionsModels.LinkChildPositionsRequestDtoSchema,
  options: {
    inputs: {
      childPositionIds: true,
    },
  },
})
    },
};

}
