import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { IntegrationChannelsModels } from "./integrationChannels.models";
import { IntegrationChannelsQueries } from "./integrationChannels.queries";
import { IntegrationChannelsAcl } from "./integrationChannels.acl";

export namespace IntegrationChannelsConfigs {
export const integrationChannelsConfig = {
    meta: {
        title: "Integration Channels",
    },
    readAll: {
        acl: IntegrationChannelsAcl.canUseList,
        schema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema,
        paginated: IntegrationChannelsQueries.useList,
        infinite: IntegrationChannelsQueries.useListInfinite,
        filters: {
            schema: IntegrationChannelsModels.IntegrationChannelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: IntegrationChannelsModels.IntegrationChannelFilterDtoSchema,
  options: {
    inputs: {
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema,
  options: {
    columns: {
      id: true,
      officeId: true,
      businessPartnerId: true,
      businessPartner: true,
      employeeId: true,
      name: true,
      archived: true,
      sftpHost: true,
      sftpPort: true,
      sftpUsername: true,
      inboundPath: true,
      outboundPath: true,
      pollingFrequencyMinutes: true,
      lastPolledAt: true,
      createdAt: true,
      createdById: true,
      createdBy: true,
      updatedAt: true,
      updatedById: true,
      updatedBy: true,
    },
    sortable: IntegrationChannelsModels.IntegrationChannelsListOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: IntegrationChannelsAcl.canUseFindById,
        schema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema,
        query: IntegrationChannelsQueries.useFindById,
    },
    create: {
        acl: IntegrationChannelsAcl.canUseCreate,
        schema: IntegrationChannelsModels.CreateIntegrationChannelRequestDtoSchema,
        mutation: IntegrationChannelsQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: IntegrationChannelsModels.CreateIntegrationChannelRequestDtoSchema,
  options: {
    inputs: {
      businessPartnerId: true,
      employeeId: true,
      name: true,
      sftpHost: true,
      sftpPort: true,
      sftpUsername: true,
      sftpPassword: true,
      inboundPath: true,
      outboundPath: true,
      pollingFrequencyMinutes: true,
    },
  },
})
    },
    update: {
        acl: IntegrationChannelsAcl.canUseUpdate,
        schema: IntegrationChannelsModels.UpdateIntegrationChannelRequestDtoSchema,
        mutation: IntegrationChannelsQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: IntegrationChannelsModels.UpdateIntegrationChannelRequestDtoSchema,
  options: {
    inputs: {
      businessPartnerId: true,
      employeeId: true,
      name: true,
      sftpHost: true,
      sftpPort: true,
      sftpUsername: true,
      sftpPassword: true,
      inboundPath: true,
      outboundPath: true,
      pollingFrequencyMinutes: true,
    },
  },
})
    },
};

export const messagesConfig = {
    meta: {
        title: "Messages",
    },
    readAll: {
        acl: IntegrationChannelsAcl.canUseListMessages,
        schema: IntegrationChannelsModels.IntegrationMessageResponseDtoSchema,
        paginated: IntegrationChannelsQueries.useListMessages,
        infinite: IntegrationChannelsQueries.useListMessagesInfinite,
        filters: {
            schema: IntegrationChannelsModels.IntegrationMessageFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: IntegrationChannelsModels.IntegrationMessageFilterDtoSchema,
  options: {
    inputs: {
      direction: true,
      format: true,
      status: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: IntegrationChannelsModels.IntegrationMessageResponseDtoSchema,
  options: {
    columns: {
      id: true,
      integrationChannelId: true,
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
    sortable: IntegrationChannelsModels.ListMessagesOrderParamEnumSchema,
  },
}),
    },
};

}
