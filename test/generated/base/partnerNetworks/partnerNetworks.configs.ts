import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PartnerNetworksModels } from "./partnerNetworks.models";
import { CommonModels } from "@/data/common/common.models";
import { PartnerNetworksQueries } from "./partnerNetworks.queries";
import { PartnerNetworksAcl } from "./partnerNetworks.acl";

export namespace PartnerNetworksConfigs {
  export const partnerNetworksConfig = {
    meta: {
      title: "Partner Networks",
    },
    readAll: {
      acl: PartnerNetworksAcl.canUsePaginate,
      schema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema,
      paginated: PartnerNetworksQueries.usePaginate,
      infinite: PartnerNetworksQueries.usePaginateInfinite,
      filters: {
        schema: PartnerNetworksModels.PartnerNetworkPaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: PartnerNetworksModels.PartnerNetworkPaginationFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              archived: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema,
        options: {
          columns: {
            id: true,
            name: true,
            archived: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: PartnerNetworksModels.PartnerNetworksPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: PartnerNetworksAcl.canUseFindById,
      schema: PartnerNetworksModels.PartnerNetworkResponseDTOSchema,
      query: PartnerNetworksQueries.useFindById,
    },
    create: {
      acl: PartnerNetworksAcl.canUseCreate,
      schema: PartnerNetworksModels.CreatePartnerNetworkRequestDTOSchema,
      mutation: PartnerNetworksQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: PartnerNetworksModels.CreatePartnerNetworkRequestDTOSchema,
        options: {
          inputs: {
            name: true,
          },
        },
      }),
    },
    update: {
      acl: PartnerNetworksAcl.canUseUpdate,
      schema: PartnerNetworksModels.UpdatePartnerNetworkRequestDTOSchema,
      mutation: PartnerNetworksQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: PartnerNetworksModels.UpdatePartnerNetworkRequestDTOSchema,
        options: {
          inputs: {
            name: true,
          },
        },
      }),
    },
  };

  export const paginateConfig = {
    meta: {
      title: "Paginate",
    },
    readAll: {
      acl: PartnerNetworksAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: PartnerNetworksQueries.usePaginateLabels,
      infinite: PartnerNetworksQueries.usePaginateLabelsInfinite,
      filters: {
        schema: PartnerNetworksModels.PartnerNetworkLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: PartnerNetworksModels.PartnerNetworkLabelFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CommonModels.LabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
          },
          sortable: PartnerNetworksModels.PartnerNetworksPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
