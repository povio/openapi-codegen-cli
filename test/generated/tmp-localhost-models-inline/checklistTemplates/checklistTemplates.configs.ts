import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ChecklistTemplatesModels } from "./checklistTemplates.models";
import { ChecklistTemplatesQueries } from "./checklistTemplates.queries";
import { ChecklistTemplatesAcl } from "./checklistTemplates.acl";

export namespace ChecklistTemplatesConfigs {
export const checklistTemplatesConfig = {
    meta: {
        title: "Checklist Templates",
    },
    readAll: {
        acl: ChecklistTemplatesAcl.canUsePaginate,
        schema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema,
        paginated: ChecklistTemplatesQueries.usePaginate,
        infinite: ChecklistTemplatesQueries.usePaginateInfinite,
        filters: {
            schema: ChecklistTemplatesModels.ChecklistTemplateFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ChecklistTemplatesModels.ChecklistTemplateFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema,
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
      items: true,
    },
    sortable: ChecklistTemplatesModels.ChecklistTemplatesPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: ChecklistTemplatesAcl.canUseFindById,
        schema: ChecklistTemplatesModels.ChecklistTemplateResponseDTOSchema,
        query: ChecklistTemplatesQueries.useFindById,
    },
    create: {
        acl: ChecklistTemplatesAcl.canUseCreate,
        schema: ChecklistTemplatesModels.CreateChecklistTemplateRequestDTOSchema,
        mutation: ChecklistTemplatesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: ChecklistTemplatesModels.CreateChecklistTemplateRequestDTOSchema,
  options: {
    inputs: {
      name: true,
    },
  },
})
    },
    update: {
        acl: ChecklistTemplatesAcl.canUseUpdate,
        schema: ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTOSchema,
        mutation: ChecklistTemplatesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: ChecklistTemplatesModels.UpdateChecklistTemplateRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      items: true,
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
        acl: ChecklistTemplatesAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: ChecklistTemplatesQueries.usePaginateLabels,
        infinite: ChecklistTemplatesQueries.usePaginateLabelsInfinite,
        filters: {
            schema: ChecklistTemplatesModels.ChecklistTemplateLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ChecklistTemplatesModels.ChecklistTemplateLabelFilterDtoSchema,
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
    sortable: ChecklistTemplatesModels.ChecklistTemplatesPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
