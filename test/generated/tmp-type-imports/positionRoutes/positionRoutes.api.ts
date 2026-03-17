import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionRoutesApi {
export const listRoutes = (officeId: string, positionId: string, ) => {
    return AppRestClient.get(
        { resSchema: PositionRoutesModels.RouteListResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes`,
        
    )
};
export const createRoutePoint = (officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CreateRoutePointRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: PositionRoutesModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points`,
        ZodExtended.parse(PositionRoutesModels.CreateRoutePointRequestDtoSchema, data),
        
    )
};
export const updateRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, data: PositionRoutesModels.UpdateRoutePointRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: PositionRoutesModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
        ZodExtended.parse(PositionRoutesModels.UpdateRoutePointRequestDtoSchema, data),
        
    )
};
export const deleteRoutePoint = (officeId: string, positionId: string, routeId: string, pointId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/route-points/${pointId}`,
        
    )
};
export const splitRoutes = (officeId: string, positionId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/split`,
        
    )
};
export const mergeRoutes = (officeId: string, positionId: string, data: PositionRoutesModels.MergeRoutesRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/merge`,
        ZodExtended.parse(PositionRoutesModels.MergeRoutesRequestDtoSchema, data),
        
    )
};
export const copyRoute = (officeId: string, positionId: string, routeId: string, data: PositionRoutesModels.CopyRouteRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/routes/${routeId}/copy`,
        ZodExtended.parse(PositionRoutesModels.CopyRouteRequestDtoSchema, data),
        
    )
};
}
