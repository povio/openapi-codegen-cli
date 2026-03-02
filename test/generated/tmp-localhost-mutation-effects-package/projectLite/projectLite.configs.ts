import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { ProjectLiteModels } from "./projectLite.models";
import { ProjectLiteQueries } from "./projectLite.queries";
import { ProjectLiteAcl } from "./projectLite.acl";

export namespace ProjectLiteConfigs {
export const projectLiteConfig = {
    meta: {
        title: "Project Lite",
    },
    readAll: {
        acl: ProjectLiteAcl.canUsePaginate,
        schema: ProjectLiteModels.ProjectLiteResponseDTOSchema,
        paginated: ProjectLiteQueries.usePaginate,
        infinite: ProjectLiteQueries.usePaginateInfinite,
        filters: {
            schema: ProjectLiteModels.ProjectLiteFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ProjectLiteModels.ProjectLiteFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: ProjectLiteModels.ProjectLiteResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      officeId: true,
      archived: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: ProjectLiteModels.ProjectLitePaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: ProjectLiteAcl.canUseFindById,
        schema: ProjectLiteModels.ProjectLiteResponseDTOSchema,
        query: ProjectLiteQueries.useFindById,
    },
    create: {
        acl: ProjectLiteAcl.canUseCreate,
        schema: ProjectLiteModels.CreateProjectLiteRequestDTOSchema,
        mutation: ProjectLiteQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: ProjectLiteModels.CreateProjectLiteRequestDTOSchema,
  options: {
    inputs: {
      name: true,
    },
  },
})
    },
    update: {
        acl: ProjectLiteAcl.canUseUpdate,
        schema: ProjectLiteModels.UpdateProjectLiteRequestDTOSchema,
        mutation: ProjectLiteQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: ProjectLiteModels.UpdateProjectLiteRequestDTOSchema,
  options: {
    inputs: {
      name: true,
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
        acl: ProjectLiteAcl.canUsePaginateProjectLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: ProjectLiteQueries.usePaginateProjectLabels,
        infinite: ProjectLiteQueries.usePaginateProjectLabelsInfinite,
        filters: {
            schema: ProjectLiteModels.ProjectLiteFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: ProjectLiteModels.ProjectLiteFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
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
    sortable: ProjectLiteModels.PaginateProjectLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
