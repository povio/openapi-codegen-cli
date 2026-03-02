import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteRoutesApi {
export const listRoutes = (officeId: string, quoteId: string, ) => {
    return AppRestClient.get(
        { resSchema: QuoteRoutesModels.RouteListResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes`,
        
    )
};
export const createRoutePoint = (officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CreateRoutePointRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: QuoteRoutesModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points`,
        ZodExtended.parse(QuoteRoutesModels.CreateRoutePointRequestDtoSchema, data),
        
    )
};
export const updateRoutePoint = (officeId: string, quoteId: string, routeId: string, pointId: string, data: QuoteRoutesModels.UpdateRoutePointRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: QuoteRoutesModels.RoutePointResponseDtoSchema },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/route-points/${pointId}`,
        ZodExtended.parse(QuoteRoutesModels.UpdateRoutePointRequestDtoSchema, data),
        
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
export const mergeRoutes = (officeId: string, quoteId: string, data: QuoteRoutesModels.MergeRoutesRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/merge`,
        ZodExtended.parse(QuoteRoutesModels.MergeRoutesRequestDtoSchema, data),
        
    )
};
export const copyRoute = (officeId: string, quoteId: string, routeId: string, data: QuoteRoutesModels.CopyRouteRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/quotes/${quoteId}/routes/${routeId}/copy`,
        ZodExtended.parse(QuoteRoutesModels.CopyRouteRequestDtoSchema, data),
        
    )
};
}
