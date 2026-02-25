import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerBookingsModels } from "./controlTowerBookings.models";

export namespace ControlTowerBookingsApi {
  export const findAll = (
    limit: number,
    order?: string,
    filter?: ControlTowerBookingsModels.BookingFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: ControlTowerBookingsModels.ControlTowerBookingsFindAllResponseSchema },
      `/bookings`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(ControlTowerBookingsModels.ControlTowerBookingsFindAllOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(ControlTowerBookingsModels.BookingFilterDtoSchema.optional(), filter, {
            type: "query",
            name: "filter",
          }),
          limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, {
            type: "query",
            name: "limit",
          }),
          page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, {
            type: "query",
            name: "page",
          }),
          cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, {
            type: "query",
            name: "cursor",
          }),
        },
      },
    );
  };

  export const findById = (id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: ControlTowerBookingsModels.BookingResponseDtoSchema },
      `/bookings/${id}`,
      config,
    );
  };

  export const findPackageById = (packageId: string, bookingId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: ControlTowerBookingsModels.PackageResponseDtoSchema },
      `/bookings/${bookingId}/packages/${packageId}`,
      config,
    );
  };
}
