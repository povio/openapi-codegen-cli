import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { DunningLevelsModels } from "./dunningLevels.models";
import { CommonModels } from "@/data/common/common.models";
import { DunningLevelsQueries } from "./dunningLevels.queries";
import { DunningLevelsAcl } from "./dunningLevels.acl";

export namespace DunningLevelsConfigs {
  export const dunningLevelsConfig = {
    meta: {
      title: "Dunning Levels",
    },
    readAll: {
      acl: DunningLevelsAcl.canUseList,
      schema: DunningLevelsModels.DunningLevelResponseDTOSchema,
      paginated: DunningLevelsQueries.useList,
      infinite: DunningLevelsQueries.useListInfinite,
      filters: {
        schema: DunningLevelsModels.DunningLevelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: DunningLevelsModels.DunningLevelFilterDtoSchema,
          options: {
            inputs: {
              dunningSystemId: true,
              search: true,
              archived: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: DunningLevelsModels.DunningLevelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            level: true,
            daysOverdue: true,
            dunningFee: true,
            interestRate: true,
            usedInOfficeId: true,
            usedInOffice: true,
            dunningSystem: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
            archived: true,
            bodyRemarks: true,
            footerRemarks: true,
          },
          sortable: DunningLevelsModels.DunningLevelsListOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: DunningLevelsAcl.canUseFindById,
      schema: DunningLevelsModels.DunningLevelResponseDTOSchema,
      query: DunningLevelsQueries.useFindById,
    },
    create: {
      acl: DunningLevelsAcl.canUseCreate,
      schema: DunningLevelsModels.CreateDunningLevelRequestDTOSchema,
      mutation: DunningLevelsQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: DunningLevelsModels.CreateDunningLevelRequestDTOSchema,
        options: {
          inputs: {
            level: true,
            daysOverdue: true,
            dunningFee: true,
            dunningSystemId: true,
            interestRate: true,
            bodyRemarks: true,
            footerRemarks: true,
          },
        },
      }),
    },
    update: {
      acl: DunningLevelsAcl.canUseUpdate,
      schema: DunningLevelsModels.UpdateDunningLevelRequestDTOSchema,
      mutation: DunningLevelsQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: DunningLevelsModels.UpdateDunningLevelRequestDTOSchema,
        options: {
          inputs: {
            level: true,
            daysOverdue: true,
            dunningFee: true,
            interestRate: true,
            dunningSystemId: true,
            bodyRemarks: true,
            footerRemarks: true,
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
      acl: DunningLevelsAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: DunningLevelsQueries.usePaginateLabels,
      infinite: DunningLevelsQueries.usePaginateLabelsInfinite,
      filters: {
        schema: DunningLevelsModels.DunningLevelLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: DunningLevelsModels.DunningLevelLabelFilterDtoSchema,
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
          sortable: DunningLevelsModels.DunningLevelsPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
