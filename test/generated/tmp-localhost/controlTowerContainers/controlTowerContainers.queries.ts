import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerContainersModels } from "./controlTowerContainers.models";
import { ControlTowerContainersApi } from "./controlTowerContainers.api";

export namespace ControlTowerContainersQueries {
export const moduleName = QueryModule.ControlTowerContainers;

export const keys = {
    all: [moduleName] as const,
    findAll: (limit?: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string) => [...keys.all, "/containers", limit, order, filter, page, cursor] as const,
    findAllInfinite: (limit?: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, cursor?: string) => [...keys.all, "/containers", "infinite", limit, order, filter, cursor] as const,
    findById: (id: string) => [...keys.all, "/containers/:id", id] as const,
    getJourney: (id: string) => [...keys.all, "/containers/:id/journey", id] as const,
};

/** 
 * Query `useFindAll`
 * @description Lists containers
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerContainersModels.ContainerFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ControlTowerContainersFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof ControlTowerContainersApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findAll(limit, order, filter, page, cursor),
    queryFn: () => 
    ControlTowerContainersApi.findAll(limit, order, filter, page, cursor),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @description Lists containers
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerContainersModels.ContainerFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ControlTowerContainersModels.ControlTowerContainersFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof ControlTowerContainersApi.findAll, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();

  return useInfiniteQuery({
    queryKey: keys.findAllInfinite(limit, order, filter, cursor),
    queryFn: ({ pageParam }) => 
    ControlTowerContainersApi.findAll(limit, order, filter, pageParam, cursor),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
      const pageParam = page ?? 1;
      return pageParam * limitParam < totalItems ? pageParam + 1 : null;
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useFindById`
 * @description Returns a container with the specified id
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ContainerResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ControlTowerContainersApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => 
    ControlTowerContainersApi.findById(id),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useGetJourney`
 * @description Returns the journey and package numbers of a container with the specified id
 * @param { string } object.id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ContainerJourneyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetJourney = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof ControlTowerContainersApi.getJourney, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getJourney(id),
    queryFn: () => 
    ControlTowerContainersApi.getJourney(id),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
