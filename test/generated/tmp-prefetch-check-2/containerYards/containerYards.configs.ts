import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ContainerYardsModels } from "./containerYards.models";
import { CommonModels } from "@/data/common/common.models";
import { ContainerYardsQueries } from "./containerYards.queries";
import { ContainerYardsAcl } from "./containerYards.acl";

export namespace ContainerYardsConfigs {
export const containerYardsConfig = {
    meta: {
        title: "Container Yards",
    },
    readAll: {
        acl: ContainerYardsAcl.canUsePaginate,
        schema: ContainerYardsModels.ContainerYardResponseDTOSchema,
        paginated: ContainerYardsQueries.usePaginate,
        infinite: ContainerYardsQueries.usePaginateInfinite,
        filters: {
            schema: ContainerYardsModels.ContainerYardFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ContainerYardsModels.ContainerYardFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: ContainerYardsModels.ContainerYardResponseDTOSchema,
  options: {
    columns: {
      id: true,
      matchCode: true,
      shortName: true,
      name: true,
      archived: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      city: true,
      country: true,
      district: true,
      additionalInformation: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: ContainerYardsModels.ContainerYardsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: ContainerYardsAcl.canUseFindById,
        schema: ContainerYardsModels.ContainerYardResponseDTOSchema,
        query: ContainerYardsQueries.useFindById,
    },
    create: {
        acl: ContainerYardsAcl.canUseCreate,
        schema: ContainerYardsModels.CreateContainerYardRequestDTOSchema,
        mutation: ContainerYardsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: ContainerYardsModels.CreateContainerYardRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      name: true,
      shortName: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      cityId: true,
      countryId: true,
      district: true,
      additionalInformation: true,
    },
  },
})
    },
    update: {
        acl: ContainerYardsAcl.canUseUpdate,
        schema: ContainerYardsModels.UpdateContainerYardRequestDTOSchema,
        mutation: ContainerYardsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: ContainerYardsModels.UpdateContainerYardRequestDTOSchema,
  options: {
    inputs: {
      matchCode: true,
      name: true,
      shortName: true,
      addressId: true,
      street: true,
      secondaryStreet: true,
      zip: true,
      cityId: true,
      countryId: true,
      district: true,
      additionalInformation: true,
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
        acl: ContainerYardsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: ContainerYardsQueries.usePaginateLabels,
        infinite: ContainerYardsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: ContainerYardsModels.ContainerYardLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ContainerYardsModels.ContainerYardLabelFilterDtoSchema,
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
    sortable: ContainerYardsModels.ContainerYardsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
