import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
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

export const getFindAllQueryOptions = ({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.findAll(limit, order, filter, page, cursor),
  queryFn: () => ControlTowerBookingsApi.findAll(limit, order, filter, page, cursor),
});

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
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findAll, TData>) => {
  
  return useQuery({
    ...getFindAllQueryOptions({ limit, order, filter, page, cursor }),
    ...options,
  });
};

export const prefetchFindAll = (queryClient: QueryClient, { limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getFindAllQueryOptions({ limit, order, filter, page, cursor }), ...options });
};

export const getFindAllInfiniteQueryOptions = ({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string }) => ({
  queryKey: keys.findAllInfinite(limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => ControlTowerBookingsApi.findAll(limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

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
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ControlTowerBookingsApi.findAll, TData>) => {

  return useInfiniteQuery({
    ...getFindAllInfiniteQueryOptions({ limit, order, filter, cursor }),
    ...options,
  });
};

export const prefetchFindAllInfinite = (queryClient: QueryClient, { limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerBookingsModels.BookingFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getFindAllInfiniteQueryOptions({ limit, order, filter, cursor }), ...options });
};

export const getFindByIdQueryOptions = ({ id }: { id: string }) => ({
  queryKey: keys.findById(id),
  queryFn: () => ControlTowerBookingsApi.findById(id),
});

/** 
 * Query `useFindById`
 * @description Returns a booking with the specified id
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.BookingResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findById, TData>) => {
  
  return useQuery({
    ...getFindByIdQueryOptions({ id }),
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { id }: { id: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getFindByIdQueryOptions({ id }), ...options });
};

export const getFindPackageByIdQueryOptions = ({ packageId, bookingId }: { packageId: string, bookingId: string }) => ({
  queryKey: keys.findPackageById(packageId, bookingId),
  queryFn: () => ControlTowerBookingsApi.findPackageById(packageId, bookingId),
});

/** 
 * Query `useFindPackageById`
 * @description Returns a package with the specified id
 * @param { string } packageId Path parameter
 * @param { string } bookingId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerBookingsModels.PackageResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindPackageById = <TData>({ packageId, bookingId }: { packageId: string, bookingId: string }, options?: AppQueryOptions<typeof ControlTowerBookingsApi.findPackageById, TData>) => {
  
  return useQuery({
    ...getFindPackageByIdQueryOptions({ packageId, bookingId }),
    ...options,
  });
};

export const prefetchFindPackageById = (queryClient: QueryClient, { packageId, bookingId }: { packageId: string, bookingId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getFindPackageByIdQueryOptions({ packageId, bookingId }), ...options });
};

}
