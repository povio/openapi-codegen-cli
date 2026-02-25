import { dynamicColumns } from "@povio/ui";
import { QuoteProfitChangeTrackingModels } from "./quoteProfitChangeTracking.models";
import { QuoteProfitChangeTrackingQueries } from "./quoteProfitChangeTracking.queries";
import { QuoteProfitChangeTrackingAcl } from "./quoteProfitChangeTracking.acl";

export namespace QuoteProfitChangeTrackingConfigs {
  export const profitChangeGroupsConfig = {
    meta: {
      title: "Profit Change Groups",
    },
    readAll: {
      acl: QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroups,
      schema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDtoSchema,
      paginated: QuoteProfitChangeTrackingQueries.useFindProfitChangeGroups,
      infinite: QuoteProfitChangeTrackingQueries.useFindProfitChangeGroupsInfinite,
      columns: dynamicColumns({
        schema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDtoSchema,
        options: {
          columns: {
            id: true,
            timestamp: true,
            users: true,
            profit: true,
            changeCount: true,
          },
        },
      }),
    },
    read: {
      acl: QuoteProfitChangeTrackingAcl.canUseFindProfitChangeGroupDetail,
      schema: QuoteProfitChangeTrackingModels.QuoteAccountProfitChangeGroupDetailDtoSchema,
      query: QuoteProfitChangeTrackingQueries.useFindProfitChangeGroupDetail,
    },
  };
}
