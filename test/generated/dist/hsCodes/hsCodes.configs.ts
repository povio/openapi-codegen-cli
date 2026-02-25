import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { HsCodesModels } from "./hsCodes.models";
import { CommonModels } from "@/data/common/common.models";
import { HsCodesQueries } from "./hsCodes.queries";
import { HsCodesAcl } from "./hsCodes.acl";

export namespace HsCodesConfigs {
  export const hsCodesConfig = {
    meta: {
      title: "Hs Codes",
    },
    readAll: {
      acl: HsCodesAcl.canUsePaginate,
      schema: HsCodesModels.HsCodeResponseDTOSchema,
      paginated: HsCodesQueries.usePaginate,
      infinite: HsCodesQueries.usePaginateInfinite,
      filters: {
        schema: HsCodesModels.HsCodePaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: HsCodesModels.HsCodePaginationFilterDtoSchema,
          options: {
            inputs: {
              archived: true,
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: HsCodesModels.HsCodeResponseDTOSchema,
        options: {
          columns: {
            id: true,
            name: true,
            description: true,
            customArea: true,
            archived: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: HsCodesModels.HsCodesPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: HsCodesAcl.canUseFindById,
      schema: HsCodesModels.HsCodeResponseDTOSchema,
      query: HsCodesQueries.useFindById,
    },
    create: {
      acl: HsCodesAcl.canUseCreate,
      schema: HsCodesModels.CreateHsCodeRequestDTOSchema,
      mutation: HsCodesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: HsCodesModels.CreateHsCodeRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            description: true,
            customArea: true,
          },
        },
      }),
    },
    update: {
      acl: HsCodesAcl.canUseUpdate,
      schema: HsCodesModels.UpdateHsCodeRequestDTOSchema,
      mutation: HsCodesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: HsCodesModels.UpdateHsCodeRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            description: true,
            customArea: true,
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
      acl: HsCodesAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: HsCodesQueries.usePaginateLabels,
      infinite: HsCodesQueries.usePaginateLabelsInfinite,
      filters: {
        schema: HsCodesModels.HsCodeLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: HsCodesModels.HsCodeLabelFilterDtoSchema,
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
          sortable: HsCodesModels.HsCodesPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
