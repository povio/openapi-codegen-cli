import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ControlTowerBookingsModels } from "./controlTowerBookings.models";

export namespace ControlTowerBookingsApi {
export const findAll = (limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerBookingsModels.ControlTowerBookingsFindAllResponseSchema },
        `/bookings`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerBookingsModels.ControlTowerBookingsFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ControlTowerBookingsModels.BookingFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerBookingsModels.BookingResponseDtoSchema },
        `/bookings/${id}`,
        
    )
};
export const findPackageById = (packageId: string, bookingId: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerBookingsModels.PackageResponseDtoSchema },
        `/bookings/${bookingId}/packages/${packageId}`,
        
    )
};
}
