import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { InttraShippingInstructionMessagesModels } from "./inttraShippingInstructionMessages.models";

export namespace InttraShippingInstructionMessagesApi {
export const list = (officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto, ) => {
    return AppRestClient.get(
        { resSchema: InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponseSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages`,
        {
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
                filter: ZodExtended.parse(InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
            },
        }
    )
};
export const create = (officeId: string, positionId: string, shippingInstructionsId: string, data: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages`,
        ZodExtended.parse(InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDtoSchema, data),
        
    )
};
export const getById = (officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, ) => {
    return AppRestClient.get(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages/${messageId}`,
        
    )
};
export const update = (officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, data: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages/${messageId}`,
        ZodExtended.parse(InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDtoSchema, data),
        
    )
};
}
