import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DepotsModels } from "./depots.models";
import { DepotsQueries } from "./depots.queries";
import { DepotsAcl } from "./depots.acl";

export namespace DepotsConfigs {
export const depotsConfig = {
    meta: {
        title: "Depots",
    },
    readAll: {
        acl: DepotsAcl.canUsePaginate,
        schema: DepotsModels.DepotResponseDTOSchema,
        paginated: DepotsQueries.usePaginate,
        infinite: DepotsQueries.usePaginateInfinite,
        filters: {
            schema: DepotsModels.DepotPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DepotsModels.DepotPaginationFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: DepotsModels.DepotResponseDTOSchema,
  options: {
    columns: {
      id: true,
      matchCode: true,
      name: true,
      shortName: true,
      additionalInformation: true,
      address: true,
      archived: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: DepotsModels.DepotsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: DepotsAcl.canUseFindById,
        schema: DepotsModels.DepotResponseDTOSchema,
        query: DepotsQueries.useFindById,
    },
    create: {
        acl: DepotsAcl.canUseCreate,
        schema: DepotsModels.CreateDepotRequestDTOSchema,
        mutation: DepotsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: DepotsModels.CreateDepotRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      shortName: true,
      additionalInformation: true,
      name: true,
      street: true,
      zip: true,
      district: true,
      cityId: true,
      countryId: true,
    },
  },
})
    },
    update: {
        acl: DepotsAcl.canUseUpdate,
        schema: DepotsModels.UpdateDepotRequestDTOSchema,
        mutation: DepotsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: DepotsModels.UpdateDepotRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      shortName: true,
      additionalInformation: true,
      name: true,
      street: true,
      zip: true,
      district: true,
      cityId: true,
      countryId: true,
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
        acl: DepotsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: DepotsQueries.usePaginateLabels,
        infinite: DepotsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: DepotsModels.DepotLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DepotsModels.DepotLabelFilterDtoSchema,
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
    sortable: DepotsModels.DepotsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
