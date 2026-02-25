import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DocumentTemplatesModels } from "./documentTemplates.models";
import { CommonModels } from "@/data/common/common.models";
import { DocumentTemplatesQueries } from "./documentTemplates.queries";
import { DocumentTemplatesAcl } from "./documentTemplates.acl";

export namespace DocumentTemplatesConfigs {
  export const documentTemplatesConfig = {
    meta: {
      title: "Document Templates",
    },
    readAll: {
      acl: DocumentTemplatesAcl.canUseList,
      schema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema,
      paginated: DocumentTemplatesQueries.useList,
      infinite: DocumentTemplatesQueries.useListInfinite,
      filters: {
        schema: DocumentTemplatesModels.DocumentTemplateFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: DocumentTemplatesModels.DocumentTemplateFilterDtoSchema,
          options: {
            inputs: {
              isArchived: true,
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema,
        options: {
          columns: {
            id: true,
            officeId: true,
            name: true,
            isArchived: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
            blocks: true,
          },
          sortable: DocumentTemplatesModels.DocumentTemplatesListOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: DocumentTemplatesAcl.canUseFindById,
      schema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema,
      query: DocumentTemplatesQueries.useFindById,
    },
    create: {
      acl: DocumentTemplatesAcl.canUseCreate,
      schema: DocumentTemplatesModels.CreateDocumentTemplateRequestDTOSchema,
      mutation: DocumentTemplatesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: DocumentTemplatesModels.CreateDocumentTemplateRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            blocks: true,
          },
        },
      }),
    },
    update: {
      acl: DocumentTemplatesAcl.canUseUpdate,
      schema: DocumentTemplatesModels.UpdateDocumentTemplateRequestDTOSchema,
      mutation: DocumentTemplatesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: DocumentTemplatesModels.UpdateDocumentTemplateRequestDTOSchema,
        options: {
          inputs: {
            name: true,
            isArchived: true,
            blocks: true,
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
      acl: DocumentTemplatesAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: DocumentTemplatesQueries.usePaginateLabels,
      infinite: DocumentTemplatesQueries.usePaginateLabelsInfinite,
      filters: {
        schema: DocumentTemplatesModels.DocumentTemplateLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: DocumentTemplatesModels.DocumentTemplateLabelFilterDtoSchema,
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
          sortable: DocumentTemplatesModels.DocumentTemplatesPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
