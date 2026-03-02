import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { InttraShippingInstructionMessagesModels } from "./inttraShippingInstructionMessages.models";
import { InttraShippingInstructionMessagesQueries } from "./inttraShippingInstructionMessages.queries";
import { InttraShippingInstructionMessagesAcl } from "./inttraShippingInstructionMessages.acl";

export namespace InttraShippingInstructionMessagesConfigs {
export const messagesConfig = {
    meta: {
        title: "Messages",
    },
    readAll: {
        acl: InttraShippingInstructionMessagesAcl.canUseList,
        schema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageListItemResponseDtoSchema,
        paginated: InttraShippingInstructionMessagesQueries.useList,
        infinite: InttraShippingInstructionMessagesQueries.useListInfinite,
        filters: {
            schema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDtoSchema,
  options: {
    inputs: {
      status: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageListItemResponseDtoSchema,
  options: {
    columns: {
      id: true,
      createdAt: true,
      updatedAt: true,
      shippingInstructionsId: true,
      positionId: true,
      createdByUserId: true,
      status: true,
      fileName: true,
      sftpPath: true,
      sentAt: true,
      uploadAttemptCount: true,
      lastUploadError: true,
      notes: true,
      contrlStatus: true,
      contrlReceivedAt: true,
      contrlRaw: true,
      aperakStatus: true,
      aperakReceivedAt: true,
      aperakRaw: true,
    },
  },
}),
    },
    read: {
        acl: InttraShippingInstructionMessagesAcl.canUseGetById,
        schema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema,
        query: InttraShippingInstructionMessagesQueries.useGetById,
    },
    create: {
        acl: InttraShippingInstructionMessagesAcl.canUseCreate,
        schema: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDtoSchema,
        mutation: InttraShippingInstructionMessagesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDtoSchema,
  options: {
    inputs: {
      isAmendment: true,
    },
  },
})
    },
    update: {
        acl: InttraShippingInstructionMessagesAcl.canUseUpdate,
        schema: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDtoSchema,
        mutation: InttraShippingInstructionMessagesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDtoSchema,
  options: {
    inputs: {
      notes: true,
    },
  },
})
    },
};

}
