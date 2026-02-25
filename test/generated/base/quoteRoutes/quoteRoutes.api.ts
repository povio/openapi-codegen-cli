import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteRoutesApi {
export const listRoutes = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: CommonModels.RouteListResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes`,
        
    )
};
export const createRoutePoint = (officeId: string, quoteId: string, routeId: string, data: CommonModels.CreateRoutePointRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: CommonModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points`,
        ZodExtended.parse(CommonModels.CreateRoutePointRequestDtoSchema, data),
        
    )
};
export const updateRoutePoint = (officeId: string, quoteId: string, routeId: string, pointId: string, data: CommonModels.UpdateRoutePointRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: CommonModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points/${pointId}`,
        ZodExtended.parse(CommonModels.UpdateRoutePointRequestDtoSchema, data),
        
    )
};
export const deleteRoutePoint = (officeId: string, quoteId: string, routeId: string, pointId: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points/${pointId}`,
        
    )
};
export const splitRoutes = (officeId: string, quoteId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/split`,
        
    )
};
export const mergeRoutes = (officeId: string, quoteId: string, data: CommonModels.MergeRoutesRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/merge`,
        ZodExtended.parse(CommonModels.MergeRoutesRequestDtoSchema, data),
        
    )
};
export const copyRoute = (officeId: string, quoteId: string, routeId: string, data: CommonModels.CopyRouteRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/copy`,
        ZodExtended.parse(CommonModels.CopyRouteRequestDtoSchema, data),
        
    )
};
}
