import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PortsModels } from "./ports.models";
import { PortsQueries } from "./ports.queries";
import { PortsAcl } from "./ports.acl";

export namespace PortsConfigs {
export const portsConfig = {
    meta: {
        title: "Ports",
    },
    readAll: {
        acl: PortsAcl.canUsePaginate,
        schema: PortsModels.PortResponseDTOSchema,
        paginated: PortsQueries.usePaginate,
        infinite: PortsQueries.usePaginateInfinite,
        filters: {
            schema: PortsModels.PortPaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PortsModels.PortPaginationFilterDtoSchema,
  options: {
    inputs: {
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: PortsModels.PortResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      matchCode: true,
      address: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: PortsModels.PortsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: PortsAcl.canUseFindById,
        schema: PortsModels.PortResponseDTOSchema,
        query: PortsQueries.useFindById,
    },
    create: {
        acl: PortsAcl.canUseCreate,
        schema: PortsModels.CreatePortRequestDTOSchema,
        mutation: PortsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: PortsModels.CreatePortRequestDTOSchema,
  options: {
    inputs: {
      name: true,
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
        acl: PortsAcl.canUseUpdate,
        schema: PortsModels.UpdatePortRequestDTOSchema,
        mutation: PortsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: PortsModels.UpdatePortRequestDTOSchema,
  options: {
    inputs: {
      name: true,
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

export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: PortsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: PortsQueries.usePaginateLabels,
        infinite: PortsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: PortsModels.PortLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PortsModels.PortLabelFilterDtoSchema,
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
    sortable: PortsModels.PortsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
