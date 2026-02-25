import { AxiosRequestConfig } from "axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerBookingsModels } from "./controlTowerBookings.models";
import { ControlTowerBookingsApi } from "./controlTowerBookings.api";

export namespace ControlTowerBookingsQueries {
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
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerBookingsModels.BookingFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.ControlTowerBookingsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findAll, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.findAll(limit, order, filter, page, cursor),
    queryFn: () => 
    ControlTowerBookingsApi.findAll(limit, order, filter, page, cursor, config),
    ...options,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @summary Get all accessible bookings for the customer
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerBookingsModels.BookingFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ControlTowerBookingsModels.ControlTowerBookingsFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ControlTowerBookingsApi.findAll, TData>, config?: AxiosRequestConfig) => {

  return useInfiniteQuery({
    queryKey: keys.findAllInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    ControlTowerBookingsApi.findAll(limit, order, filter, pageParam, cursor, config),
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
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.BookingResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findById, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => 
    ControlTowerBookingsApi.findById(id, config),
    ...options,
  });
};

/** 
 * Query `useFindPackageById`
 * @description Returns a package with the specified id
 * @param { string } object.packageId Path parameter
 * @param { string } object.bookingId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.PackageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindPackageById = <TData>({ packageId, bookingId }: { packageId: string, bookingId: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findPackageById, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.findPackageById(packageId, bookingId),
    queryFn: () => 
    ControlTowerBookingsApi.findPackageById(packageId, bookingId, config),
    ...options,
  });
};

}
