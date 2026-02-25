import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { PositionsModels } from "./positions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionsApi {
export const findAll = (officeId: string, limit: number, filter?: PositionsModels.PositionLabelsFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.PositionsFindAllResponseSchema },
        `/offices/${officeId}/positions/labels`,
        {
            params: {
                filter: ZodExtended.parse(PositionsModels.PositionLabelsFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: PositionsModels.PositionFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.PositionsPaginateResponseSchema },
        `/offices/${officeId}/positions`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(PositionsModels.PositionsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(PositionsModels.PositionFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (officeId: string, data: PositionsModels.CreatePositionRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions`,
        ZodExtended.parse(PositionsModels.CreatePositionRequestDtoSchema, data),
        
    )
};
export const totalProfit = (officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.TotalProfitResponseSchema },
        `/offices/${officeId}/positions/fake-total-profit`,
        
    )
};
export const listAvailablePartnersFor = (officeId: string, positionId: string, search?: string, useCase?: CommonModels.PositionAvailablePartnersUseCase, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.PositionsListAvailablePartnersForResponseSchema },
        `/offices/${officeId}/positions/${positionId}/available-partners`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                useCase: ZodExtended.parse(CommonModels.PositionAvailablePartnersUseCaseSchema.optional(), useCase, { type: "query", name: "useCase" }),
            },
        }
    )
};
export const exportPositions = (officeId: string, data: PositionsModels.PositionExportRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/exports`,
        ZodExtended.parse(PositionsModels.PositionExportRequestDtoSchema, data),
        {
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const get = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}`,
        
    )
};
export const update = (officeId: string, positionId: string, data: PositionsModels.UpdatePositionDto, ) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}`,
        ZodExtended.parse(PositionsModels.UpdatePositionDtoSchema, data),
        
    )
};
export const listRouteLabels = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.ListRouteLabelsResponseSchema },
        `/offices/${officeId}/positions/${positionId}/routes/labels`,
        
    )
};
export const getDuplicateDefaultParameters = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.DuplicatePositionDefaultParametersResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/duplicate/default-parameters`,
        
    )
};
export const duplicate = (officeId: string, positionId: string, data: PositionsModels.DuplicatePositionRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/duplicate`,
        ZodExtended.parse(PositionsModels.DuplicatePositionRequestDtoSchema, data),
        
    )
};
export const cancel = (officeId: string, positionId: string, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/cancel`,
        
    )
};
export const revertCancel = (officeId: string, positionId: string, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.PositionCoreResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/uncancel`,
        
    )
};
export const linkChild = (officeId: string, positionId: string, data: PositionsModels.LinkChildPositionsRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/children`,
        ZodExtended.parse(PositionsModels.LinkChildPositionsRequestDtoSchema, data),
        
    )
};
export const unlinkChild = (officeId: string, positionId: string, data: PositionsModels.UnlinkChildPositionsRequestDto, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/children`,
        ZodExtended.parse(PositionsModels.UnlinkChildPositionsRequestDtoSchema, data),
        
    )
};
export const listChild = (officeId: string, positionId: string, limit: number, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionsModels.ListChildResponseSchema },
        `/offices/${officeId}/positions/${positionId}/children`,
        {
            params: {
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
