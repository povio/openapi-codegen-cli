import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerBookingsModels } from "./controlTowerBookings.models";

export namespace ControlTowerBookingsQueries {
const findAll = (limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string) => {
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
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerBookingsModels.BookingResponseDtoSchema },
    `/bookings/${id}`,
    
  );
};

const findPackageById = (packageId: string, bookingId: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerBookingsModels.PackageResponseDtoSchema },
    `/bookings/${bookingId}/packages/${packageId}`,
    
  );
};


export const moduleName = QueryModule.ControlTowerBookings;

export const keys = {
    all: [moduleName] as const,
    findAll: (limit?: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string) => [...keys.all, "/bookings", limit, order, filter, page, cursor] as const,
    findAllInfinite: (limit?: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string) => [...keys.all, "/bookings", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/bookings/:id", id] as const,
    findPackageById: (packageId: string, bookingId: string) => [...keys.all, "/bookings/:bookingId/packages/:packageId", packageId, bookingId] as const,
};

/** 
 * Query `useFindAll`
 * @summary Get all accessible bookings for the customer
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerBookingsModels.BookingFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.ControlTowerBookingsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findAll(limit, order, filter, page, cursor),
    queryFn: () => 
    findAll(limit, order, filter, page, cursor),
    ...options,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @summary Get all accessible bookings for the customer
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerBookingsModels.BookingFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ControlTowerBookingsModels.ControlTowerBookingsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    queryKey: keys.findAllInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    findAll(limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
  });
};

/** 
 * Query `useFindById`
 * @description Returns a booking with the specified id
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.BookingResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => 
    findById(id),
    ...options,
  });
};

/** 
 * Query `useFindPackageById`
 * @description Returns a package with the specified id
 * @param { string } packageId Path parameter
 * @param { string } bookingId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.PackageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindPackageById = <TData>({ packageId, bookingId }: { packageId: string, bookingId: string }, options?: AppQueryOptions<typeof findPackageById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findPackageById(packageId, bookingId),
    queryFn: () => 
    findPackageById(packageId, bookingId),
    ...options,
  });
};

}
