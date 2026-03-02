import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { TeamsModels } from "./teams.models";
import { CommonModels } from "@/data/common/common.models";
import { TeamsQueries } from "./teams.queries";
import { TeamsAcl } from "./teams.acl";

export namespace TeamsConfigs {
export const teamsConfig = {
    meta: {
        title: "Teams",
    },
    readAll: {
        acl: TeamsAcl.canUsePaginate,
        schema: TeamsModels.TeamResponseDTOSchema,
        paginated: TeamsQueries.usePaginate,
        infinite: TeamsQueries.usePaginateInfinite,
        filters: {
            schema: TeamsModels.TeamFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: TeamsModels.TeamFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      archived: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: TeamsModels.TeamResponseDTOSchema,
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
      members: true,
    },
    sortable: TeamsModels.TeamsPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: TeamsAcl.canUseFindById,
        schema: TeamsModels.TeamResponseDTOSchema,
        query: TeamsQueries.useFindById,
    },
    create: {
        acl: TeamsAcl.canUseCreate,
        schema: TeamsModels.CreateTeamRequestDTOSchema,
        mutation: TeamsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: TeamsModels.CreateTeamRequestDTOSchema,
  options: {
    inputs: {
      name: true,
    },
  },
})
    },
    update: {
        acl: TeamsAcl.canUseUpdate,
        schema: TeamsModels.UpdateTeamRequestDTOSchema,
        mutation: TeamsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: TeamsModels.UpdateTeamRequestDTOSchema,
  options: {
    inputs: {
      name: true,
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
        acl: TeamsAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: TeamsQueries.usePaginateLabels,
        infinite: TeamsQueries.usePaginateLabelsInfinite,
        filters: {
            schema: TeamsModels.TeamLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: TeamsModels.TeamLabelFilterDtoSchema,
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
    sortable: TeamsModels.TeamsPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
