import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { IntegrationChannelsModels } from "./integrationChannels.models";

export namespace IntegrationChannelsApi {
export const list = (officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.IntegrationChannelsListResponseSchema },
        `/offices/${officeId}/integration-channels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.IntegrationChannelsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationChannelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: IntegrationChannelsModels.CreateIntegrationChannelRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels`,
        ZodExtended.parse(IntegrationChannelsModels.CreateIntegrationChannelRequestDtoSchema, data),
        
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: IntegrationChannelsModels.IntegrationChannelLabelsFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.IntegrationChannelsPaginateLabelsResponseSchema },
        `/offices/${officeId}/integration-channels/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(IntegrationChannelsModels.IntegrationChannelsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(IntegrationChannelsModels.IntegrationChannelLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (officeId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}`,
        
    )
};
export const update = (officeId: string, id: string, data: IntegrationChannelsModels.UpdateIntegrationChannelRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}`,
        ZodExtended.parse(IntegrationChannelsModels.UpdateIntegrationChannelRequestDtoSchema, data),
        
    )
};
export const archive = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/archive`,
        
    )
};
export const unarchive = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.IntegrationChannelResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/unarchive`,
        
    )
};
export const testConnection = (officeId: string, id: string, ) => {
    return AppRestClient.post(
        { resSchema: IntegrationChannelsModels.TestConnectionResponseDtoSchema },
        `/offices/${officeId}/integration-channels/${id}/test-connection`,
        
    )
};
}
