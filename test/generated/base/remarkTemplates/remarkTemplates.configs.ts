import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { RemarkTemplatesModels } from "./remarkTemplates.models";
import { RemarkTemplatesQueries } from "./remarkTemplates.queries";
import { RemarkTemplatesAcl } from "./remarkTemplates.acl";

export namespace RemarkTemplatesConfigs {
  export const remarkTemplatesConfig = {
    meta: {
      title: "Remark Templates",
    },
    readAll: {
      acl: RemarkTemplatesAcl.canUseList,
      schema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema,
      paginated: RemarkTemplatesQueries.useList,
      infinite: RemarkTemplatesQueries.useListInfinite,
      filters: {
        schema: RemarkTemplatesModels.RemarkTemplateFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: RemarkTemplatesModels.RemarkTemplateFilterDtoSchema,
          options: {
            inputs: {
              archived: true,
              search: true,
              onlyUsedFor: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema,
        options: {
          columns: {
            id: true,
            officeId: true,
            name: true,
            content: true,
            onlyUsedFor: true,
            archived: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: RemarkTemplatesModels.RemarkTemplatesListOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: RemarkTemplatesAcl.canUseFindById,
      schema: RemarkTemplatesModels.RemarkTemplateResponseDTOSchema,
      query: RemarkTemplatesQueries.useFindById,
    },
    create: {
      acl: RemarkTemplatesAcl.canUseCreate,
      schema: RemarkTemplatesModels.CreateRemarkTemplateRequestDTOSchema,
      mutation: RemarkTemplatesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: RemarkTemplatesModels.CreateRemarkTemplateRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            content: true,
            onlyUsedFor: true,
          },
        },
      }),
    },
    update: {
      acl: RemarkTemplatesAcl.canUseUpdate,
      schema: RemarkTemplatesModels.UpdateRemarkTemplateRequestDTOSchema,
      mutation: RemarkTemplatesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: RemarkTemplatesModels.UpdateRemarkTemplateRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            content: true,
            onlyUsedFor: true,
            archived: true,
          },
        },
      }),
    },
  };

  export const labelsConfig = {
    meta: {
      title: "Labels",
    },
    readAll: {
      acl: RemarkTemplatesAcl.canUsePaginateLabels,
      schema: RemarkTemplatesModels.RemarkTemplateLabelResponseDTOSchema,
      paginated: RemarkTemplatesQueries.usePaginateLabels,
      infinite: RemarkTemplatesQueries.usePaginateLabelsInfinite,
      filters: {
        schema: RemarkTemplatesModels.RemarkTemplateLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: RemarkTemplatesModels.RemarkTemplateLabelFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: RemarkTemplatesModels.RemarkTemplateLabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
            content: true,
          },
          sortable: RemarkTemplatesModels.RemarkTemplatesPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
