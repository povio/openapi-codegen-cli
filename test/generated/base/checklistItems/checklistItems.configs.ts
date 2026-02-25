import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ChecklistItemsModels } from "./checklistItems.models";
import { CommonModels } from "@/data/common/common.models";
import { ChecklistItemsQueries } from "./checklistItems.queries";
import { ChecklistItemsAcl } from "./checklistItems.acl";

export namespace ChecklistItemsConfigs {
  export const checklistItemsConfig = {
    meta: {
      title: "Checklist Items",
    },
    readAll: {
      acl: ChecklistItemsAcl.canUsePaginate,
      schema: ChecklistItemsModels.ChecklistItemResponseDTOSchema,
      paginated: ChecklistItemsQueries.usePaginate,
      infinite: ChecklistItemsQueries.usePaginateInfinite,
      filters: {
        schema: ChecklistItemsModels.ChecklistItemFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: ChecklistItemsModels.ChecklistItemFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              archived: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: ChecklistItemsModels.ChecklistItemResponseDTOSchema,
        options: {
          columns: {
            id: true,
            name: true,
            officeId: true,
            archived: true,
            archivedAt: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: ChecklistItemsModels.ChecklistItemsPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: ChecklistItemsAcl.canUseFindById,
      schema: ChecklistItemsModels.ChecklistItemResponseDTOSchema,
      query: ChecklistItemsQueries.useFindById,
    },
    create: {
      acl: ChecklistItemsAcl.canUseCreate,
      schema: ChecklistItemsModels.CreateChecklistItemRequestDTOSchema,
      mutation: ChecklistItemsQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: ChecklistItemsModels.CreateChecklistItemRequestDTOSchema,
        options: {
          inputs: {
            name: true,
          },
        },
      }),
    },
    update: {
      acl: ChecklistItemsAcl.canUseUpdate,
      schema: ChecklistItemsModels.UpdateChecklistItemRequestDTOSchema,
      mutation: ChecklistItemsQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: ChecklistItemsModels.UpdateChecklistItemRequestDTOSchema,
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
      acl: ChecklistItemsAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: ChecklistItemsQueries.usePaginateLabels,
      infinite: ChecklistItemsQueries.usePaginateLabelsInfinite,
      filters: {
        schema: ChecklistItemsModels.ChecklistItemLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: ChecklistItemsModels.ChecklistItemLabelFilterDtoSchema,
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
          sortable: ChecklistItemsModels.ChecklistItemsPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
