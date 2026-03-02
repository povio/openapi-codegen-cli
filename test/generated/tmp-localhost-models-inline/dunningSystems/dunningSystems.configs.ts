import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DunningSystemsModels } from "./dunningSystems.models";
import { DunningSystemsQueries } from "./dunningSystems.queries";
import { DunningSystemsAcl } from "./dunningSystems.acl";

export namespace DunningSystemsConfigs {
export const dunningSystemsConfig = {
    meta: {
        title: "Dunning Systems",
    },
    readAll: {
        acl: DunningSystemsAcl.canUsePaginate,
        schema: DunningSystemsModels.DunningSystemResponseDTOSchema,
        paginated: DunningSystemsQueries.usePaginate,
        infinite: DunningSystemsQueries.usePaginateInfinite,
        filters: {
            schema: DunningSystemsModels.DunningSystemFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DunningSystemsModels.DunningSystemFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
      isDefault: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: DunningSystemsModels.DunningSystemResponseDTOSchema,
  options: {
    columns: {
      id: true,
      officeId: true,
      name: true,
      isDefault: true,
      archived: true,
      archivedAt: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: DunningSystemsModels.DunningSystemsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: DunningSystemsAcl.canUseFindById,
        schema: DunningSystemsModels.DunningSystemResponseDTOSchema,
        query: DunningSystemsQueries.useFindById,
    },
    create: {
        acl: DunningSystemsAcl.canUseCreate,
        schema: DunningSystemsModels.CreateDunningSystemRequestDTOSchema,
        mutation: DunningSystemsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: DunningSystemsModels.CreateDunningSystemRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      isDefault: true,
    },
  },
})
    },
    update: {
        acl: DunningSystemsAcl.canUseUpdate,
        schema: DunningSystemsModels.UpdateDunningSystemRequestDTOSchema,
        mutation: DunningSystemsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: DunningSystemsModels.UpdateDunningSystemRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      isDefault: true,
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
        acl: DunningSystemsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: DunningSystemsQueries.usePaginateLabels,
        infinite: DunningSystemsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: DunningSystemsModels.DunningSystemLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: DunningSystemsModels.DunningSystemLabelFilterDtoSchema,
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
    sortable: DunningSystemsModels.DunningSystemsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
