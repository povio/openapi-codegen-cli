import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PositionProfitChangeTrackingModels } from "./positionProfitChangeTracking.models";
import { PositionProfitChangeTrackingQueries } from "./positionProfitChangeTracking.queries";
import { PositionProfitChangeTrackingAcl } from "./positionProfitChangeTracking.acl";

export namespace PositionProfitChangeTrackingConfigs {
  export const profitChangeGroupsConfig = {
    meta: {
      title: "Profit Change Groups",
    },
    readAll: {
      acl: PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroups,
      schema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDtoSchema,
      paginated: PositionProfitChangeTrackingQueries.useFindProfitChangeGroups,
      infinite: PositionProfitChangeTrackingQueries.useFindProfitChangeGroupsInfinite,
      filters: {
        schema: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFilterDtoSchema,
          options: {
            inputs: {
              userId: true,
              dateFrom: true,
              dateTo: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDtoSchema,
        options: {
          columns: {
            id: true,
            timestamp: true,
            users: true,
            profit: true,
            changeCount: true,
          },
          sortable:
            PositionProfitChangeTrackingModels.PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: PositionProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail,
      schema: PositionProfitChangeTrackingModels.PositionAccountProfitChangeGroupDetailDtoSchema,
      query: PositionProfitChangeTrackingQueries.useFindProfitChangeGroupDetail,
    },
  };
}
