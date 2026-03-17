import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerContainersModels } from "./controlTowerContainers.models";

export namespace ControlTowerContainersQueries {
const findAll = (limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerContainersModels.ControlTowerContainersFindAllResponseSchema },
    `/containers`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerContainersModels.ControlTowerContainersFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(ControlTowerContainersModels.ContainerFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (id: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerContainersModels.ContainerResponseDtoSchema },
    `/containers/${id}`,
    
  );
};

const getJourney = (id: string) => {
  return AppRestClient.get(
    { resSchema: ControlTowerContainersModels.ContainerJourneyResponseDtoSchema },
    `/containers/${id}/journey`,
    
  );
};


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
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerContainersModels.ContainerFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ControlTowerContainersFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAll = <TData>({ limit, order, filter, page, cursor }: { limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof findAll, TData>) => {
  
  return useQuery({
    queryKey: keys.findAll(limit, order, filter, page, cursor),
    queryFn: () => 
    findAll(limit, order, filter, page, cursor),
    ...options,
  });
};

/** 
 * Infinite query `useFindAllInfinite
 * @description Lists containers
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): Eta, createdAt. Example: `Eta`
 * @param { ControlTowerContainersModels.ContainerFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<ControlTowerContainersModels.ControlTowerContainersFindAllResponse> } 
 * @statusCodes [200, 401]
 */
export const useFindAllInfinite = <TData>({ limit, order, filter, cursor }: { limit: number, order?: string, filter?: ControlTowerContainersModels.ContainerFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof findAll, TData>) => {

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
 * @description Returns a container with the specified id
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ContainerResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useFindById = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  
  return useQuery({
    queryKey: keys.findById(id),
    queryFn: () => 
    findById(id),
    ...options,
  });
};

/** 
 * Query `useGetJourney`
 * @description Returns the journey and package numbers of a container with the specified id
 * @param { string } id Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerContainersModels.ContainerJourneyResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetJourney = <TData>({ id }: { id: string }, options?: AppQueryOptions<typeof getJourney, TData>) => {
  
  return useQuery({
    queryKey: keys.getJourney(id),
    queryFn: () => 
    getJourney(id),
    ...options,
  });
};

}
