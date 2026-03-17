import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { AirportsModels } from "./airports.models";
import { AirportsQueries } from "./airports.queries";
import { AirportsAcl } from "./airports.acl";

export namespace AirportsConfigs {
export const airportsConfig = {
    meta: {
        title: "Airports",
    },
    readAll: {
        acl: AirportsAcl.canUsePaginate,
        schema: AirportsModels.AirportResponseDTOSchema,
        paginated: AirportsQueries.usePaginate,
        infinite: AirportsQueries.usePaginateInfinite,
        filters: {
            schema: AirportsModels.AirportPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: AirportsModels.AirportPaginationFilterDtoSchema,
  options: {
    inputs: {
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: AirportsModels.AirportResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      matchCode: true,
      iataCode: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: AirportsModels.AirportsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: AirportsAcl.canUseFindById,
        schema: AirportsModels.AirportResponseDTOSchema,
        query: AirportsQueries.useFindById,
    },
    create: {
        acl: AirportsAcl.canUseCreate,
        schema: AirportsModels.CreateAirportRequestDTOSchema,
        mutation: AirportsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: AirportsModels.CreateAirportRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      matchCode: true,
      iataCode: true,
    },
  },
})
    },
    update: {
        acl: AirportsAcl.canUseUpdate,
        schema: AirportsModels.UpdateAirportRequestDTOSchema,
        mutation: AirportsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: AirportsModels.UpdateAirportRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      matchCode: true,
      iataCode: true,
    },
  },
})
    },
};

export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: AirportsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: AirportsQueries.usePaginateLabels,
        infinite: AirportsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: AirportsModels.AirportLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: AirportsModels.AirportLabelFilterDtoSchema,
  options: {
    inputs: {
      search: true,
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
    sortable: AirportsModels.AirportsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
