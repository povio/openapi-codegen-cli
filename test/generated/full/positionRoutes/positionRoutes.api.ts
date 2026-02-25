import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionRoutesApi {
export const listRoutes = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: CommonModels.RouteListResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes`,
        config
    )
};
export const createRoutePoint = (officeId: string, positionId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: CommonModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points`,
        ZodExtended.parse(CommonModels.CreateRoutePointRequestDtoSchema, data),
        config
    )
};
export const updateRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
        ZodExtended.parse(CommonModels.UpdateRoutePointRequestDtoSchema, data),
        config
    )
};
export const deleteRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
        undefined,
        config
    )
};
export const splitRoutes = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/split`,
        undefined,
        config
    )
};
export const mergeRoutes = (officeId: string, positionId: string, data: CommonModels.MergeRoutesRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/merge`,
        ZodExtended.parse(CommonModels.MergeRoutesRequestDtoSchema, data),
        config
    )
};
export const copyRoute = (officeId: string, positionId: string, routeId: string, data: CommonModels.CopyRouteRequestDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/copy`,
        ZodExtended.parse(CommonModels.CopyRouteRequestDtoSchema, data),
        config
    )
};
}
