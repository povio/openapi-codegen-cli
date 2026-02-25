import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { InttraShippingInstructionMessagesModels } from "./inttraShippingInstructionMessages.models";

export namespace InttraShippingInstructionMessagesApi {
export const list = (officeId: string, positionId: string, shippingInstructionsId: string, limit: number, page?: number, cursor?: string, filter?: InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDto, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InttraShippingInstructionMessagesModels.InttraShippingInstructionMessagesListResponseSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages`,
        {
            ...config,
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
                filter: ZodExtended.parse(InttraShippingInstructionMessagesModels.ShippingInstructionMessageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
            },
        }
    )
};
export const create = (officeId: string, positionId: string, shippingInstructionsId: string, data: InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages`,
        ZodExtended.parse(InttraShippingInstructionMessagesModels.CreateShippingInstructionMessageRequestDtoSchema, data),
        config
    )
};
export const getById = (officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages/${messageId}`,
        config
    )
};
export const update = (officeId: string, positionId: string, shippingInstructionsId: string, messageId: string, data: InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: InttraShippingInstructionMessagesModels.ShippingInstructionMessageResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/bl-instructions/${shippingInstructionsId}/messages/${messageId}`,
        ZodExtended.parse(InttraShippingInstructionMessagesModels.UpdateShippingInstructionMessageRequestDtoSchema, data),
        config
    )
};
}
