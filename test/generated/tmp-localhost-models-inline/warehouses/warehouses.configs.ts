import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { WarehousesModels } from "./warehouses.models";
import { WarehousesQueries } from "./warehouses.queries";
import { WarehousesAcl } from "./warehouses.acl";

export namespace WarehousesConfigs {
export const warehousesConfig = {
    meta: {
        title: "Warehouses",
    },
    readAll: {
        acl: WarehousesAcl.canUsePaginate,
        schema: WarehousesModels.WarehouseResponseDTOSchema,
        paginated: WarehousesQueries.usePaginate,
        infinite: WarehousesQueries.usePaginateInfinite,
        filters: {
            schema: WarehousesModels.WarehouseFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: WarehousesModels.WarehouseFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: WarehousesModels.WarehouseResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      shortName: true,
      additionalInformation: true,
      matchCode: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      city: true,
      country: true,
      district: true,
      archived: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: WarehousesModels.WarehousesPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: WarehousesAcl.canUseFindById,
        schema: WarehousesModels.WarehouseResponseDTOSchema,
        query: WarehousesQueries.useFindById,
    },
    create: {
        acl: WarehousesAcl.canUseCreate,
        schema: WarehousesModels.CreateWarehouseRequestDTOSchema,
        mutation: WarehousesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: WarehousesModels.CreateWarehouseRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      shortName: true,
      additionalInformation: true,
      matchCode: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      cityId: true,
      countryId: true,
      district: true,
    },
  },
})
    },
    update: {
        acl: WarehousesAcl.canUseUpdate,
        schema: WarehousesModels.UpdateWarehouseRequestDTOSchema,
        mutation: WarehousesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: WarehousesModels.UpdateWarehouseRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      shortName: true,
      additionalInformation: true,
      matchCode: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      cityId: true,
      countryId: true,
      district: true,
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
        acl: WarehousesAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: WarehousesQueries.usePaginateLabels,
        infinite: WarehousesQueries.usePaginateLabelsInfinite,
        filters: {
            schema: WarehousesModels.WarehouseLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: WarehousesModels.WarehouseLabelFilterDtoSchema,
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
    sortable: WarehousesModels.WarehousesPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
