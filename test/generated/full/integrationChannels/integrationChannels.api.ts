import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { IntegrationChannelsModels } from "./integrationChannels.models";

export namespace IntegrationChannelsApi {
export const list = (officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.IntegrationChannelsListResponseSchema },
        `/offices/${officeId}/integration-channels`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.IntegrationChannelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationChannelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels`,
        ZodExtended.parse(IntegrationChannelsModels.CreateIntegrationChannelRequestDtoSchema, data),
        config
    )
};
export const findById = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}`,
        config
    )
};
export const update = (officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}`,
        ZodExtended.parse(IntegrationChannelsModels.UpdateIntegrationChannelRequestDtoSchema, data),
        config
    )
};
export const archive = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/archive`,
        undefined,
        config
    )
};
export const unarchive = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/unarchive`,
        undefined,
        config
    )
};
export const testConnection = (officeId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.TestConnectionResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/test-connection`,
        undefined,
        config
    )
};
export const listMessages = (officeId: string, id: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationMessageFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.ListMessagesResponseSchema },
        `/offices/${officeId}/integration-channels/${id}/messages`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.ListMessagesOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationMessageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
