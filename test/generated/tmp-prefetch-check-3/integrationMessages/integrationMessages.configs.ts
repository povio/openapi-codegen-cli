import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { IntegrationMessagesModels } from "./integrationMessages.models";
import { IntegrationMessagesQueries } from "./integrationMessages.queries";
import { IntegrationMessagesAcl } from "./integrationMessages.acl";

export namespace IntegrationMessagesConfigs {
export const integrationMessagesConfig = {
    meta: {
        title: "Integration Messages",
    },
    readAll: {
        acl: IntegrationMessagesAcl.canUseList,
        schema: IntegrationMessagesModels.IntegrationMessageResponseDtoSchema,
        paginated: IntegrationMessagesQueries.useList,
        infinite: IntegrationMessagesQueries.useListInfinite,
        filters: {
            schema: IntegrationMessagesModels.IntegrationMessageFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: IntegrationMessagesModels.IntegrationMessageFilterDtoSchema,
  options: {
    inputs: {
      integrationChannelId: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: IntegrationMessagesModels.IntegrationMessageResponseDtoSchema,
  options: {
    columns: {
      id: true,
      integrationChannel: true,
      positionId: true,
      positionNumber: true,
      direction: true,
      format: true,
      status: true,
      rawContent: true,
      fileName: true,
      errorMessage: true,
      processedAt: true,
      sentAt: true,
      createdAt: true,
    },
    sortable: IntegrationMessagesModels.IntegrationMessagesListOrderParamEnumSchema,
  },
}),
    },
};

}
