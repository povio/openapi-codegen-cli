import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsAcl } from "./workingDocuments.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsModels } from "./workingDocuments.models";

export namespace WorkingDocumentsQueries {
const list = (positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsModels.WorkingDocumentsListResponseSchema },
    `/offices/${officeId}/positions/${positionId}/working-documents`,
    {
      params: {
        order: ZodExtended.parse(ZodExtended.sortExp(WorkingDocumentsModels.WorkingDocumentsListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
        filter: ZodExtended.parse(WorkingDocumentsModels.WorkingDocumentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
        page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
        cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
      },
    }
  );
};

const findById = (positionId: string, id: string, officeId: string) => {
  return AppRestClient.get(
    { resSchema: WorkingDocumentsModels.WorkingDocumentResponseDTOSchema },
    `/offices/${officeId}/positions/${positionId}/working-documents/${id}`,
    
  );
};


export const moduleName = QueryModule.WorkingDocuments;

export const keys = {
    all: [moduleName] as const,
    list: (positionId: string, officeId: string, limit?: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents", positionId, officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (positionId: string, officeId: string, limit?: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents", "infinite", positionId, officeId, limit, order, filter, cursor] as const,
    findById: (positionId: string, id: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents/:id", positionId, id, officeId] as const,
};

export const listQueryOptions = ({ positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(positionId, officeId, limit, order, filter, page, cursor),
  queryFn: () => list(positionId, officeId, limit, order, filter, page, cursor),
});

/** 
 * Query `useList`
 * @summary List working documents
 * @permission Requires `canUseList` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): NAME, TYPE, CREATED_AT, UPDATED_AT. Example: `NAME`
 * @param { WorkingDocumentsModels.WorkingDocumentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsModels.WorkingDocumentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...listQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
      return listQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchList = (queryClient: QueryClient, { positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...listQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }), ...options });
};

export const listInfiniteQueryOptions = ({ positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(positionId, officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => list(positionId, officeId, limit, order, filter, pageParam, cursor),
  initialPageParam: 1,
  getNextPageParam: ({ page, totalItems, limit: limitParam }) => {
    const pageParam = page ?? 1;
    return pageParam * limitParam < totalItems ? pageParam + 1 : null;
  },
});

/** 
 * Infinite query `useListInfinite
 * @summary List working documents
 * @permission Requires `canUseList` ability 
 * @param { string } positionId Path parameter
 * @param { string } officeId Path parameter
 * @param { number } limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } order Query parameter. Order by fields (comma separated with +/- prefix): NAME, TYPE, CREATED_AT, UPDATED_AT. Example: `NAME`
 * @param { WorkingDocumentsModels.WorkingDocumentFilterDto } filter Query parameter
 * @param { number } page Query parameter. 1-indexed page number to begin from
 * @param { string } cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<WorkingDocumentsModels.WorkingDocumentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...listInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
      return listInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...listInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }), ...options });
};

export const findByIdQueryOptions = ({ positionId, id, officeId }: { positionId: string, id: string, officeId: string }) => ({
  queryKey: keys.findById(positionId, id, officeId),
  queryFn: () => findById(positionId, id, officeId),
});

/** 
 * Query `useFindById`
 * @summary Get working document by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } positionId Path parameter
 * @param { string } id Path parameter
 * @param { string } officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsModels.WorkingDocumentResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ positionId, id, officeId }: { positionId: string, id: string, officeId: string }, options?: AppQueryOptions<typeof findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...findByIdQueryOptions({ positionId, id, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsAcl.canUseFindById({ officeId } ));
      return findByIdQueryOptions({ positionId, id, officeId }).queryFn();
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { positionId, id, officeId }: { positionId: string, id: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...findByIdQueryOptions({ positionId, id, officeId }), ...options });
};

}
