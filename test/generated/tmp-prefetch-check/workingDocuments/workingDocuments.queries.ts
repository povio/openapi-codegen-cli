import { QueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { WorkingDocumentsAcl } from "./workingDocuments.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppInfiniteQueryOptions } from "@povio/openapi-codegen-cli";
import { WorkingDocumentsModels } from "./workingDocuments.models";
import { WorkingDocumentsApi } from "./workingDocuments.api";

export namespace WorkingDocumentsQueries {
export const moduleName = QueryModule.WorkingDocuments;

export const keys = {
    all: [moduleName] as const,
    list: (positionId: string, officeId: string, limit?: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents", positionId, officeId, limit, order, filter, page, cursor] as const,
    listInfinite: (positionId: string, officeId: string, limit?: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents", "infinite", positionId, officeId, limit, order, filter, cursor] as const,
    findById: (positionId: string, id: string, officeId: string) => [...keys.all, "/offices/:officeId/positions/:positionId/working-documents/:id", positionId, id, officeId] as const,
};

export const getListQueryOptions = ({ positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }) => ({
  queryKey: keys.list(positionId, officeId, limit, order, filter, page, cursor),
  queryFn: () => WorkingDocumentsApi.list(positionId, officeId, limit, order, filter, page, cursor),
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
export const useList = <TData>({ positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof WorkingDocumentsApi.list, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getListQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
      return getListQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }).queryFn();
    },
    ...options,
  });
};

export const prefetchList = (queryClient: QueryClient, { positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getListQueryOptions({ positionId, officeId, limit, order, filter, page, cursor }), ...options });
};

export const getListInfiniteQueryOptions = ({ positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }) => ({
  queryKey: keys.listInfinite(positionId, officeId, limit, order, filter, cursor),
  queryFn: ({ pageParam }: { pageParam: number }) => WorkingDocumentsApi.list(positionId, officeId, limit, order, filter, pageParam, cursor),
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
export const useListInfinite = <TData>({ positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof WorkingDocumentsApi.list, TData>) => {
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    ...getListInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }),
    queryFn: async ({ pageParam }) => {
      checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
      return getListInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }).queryFn({ pageParam });
    },
    ...options,
  });
};

export const prefetchListInfinite = (queryClient: QueryClient, { positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }, options?: Omit<Parameters<QueryClient["prefetchInfiniteQuery"]>[0], "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">) => {
  return queryClient.prefetchInfiniteQuery({ ...getListInfiniteQueryOptions({ positionId, officeId, limit, order, filter, cursor }), ...options });
};

export const getFindByIdQueryOptions = ({ positionId, id, officeId }: { positionId: string, id: string, officeId: string }) => ({
  queryKey: keys.findById(positionId, id, officeId),
  queryFn: () => WorkingDocumentsApi.findById(positionId, id, officeId),
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
export const useFindById = <TData>({ positionId, id, officeId }: { positionId: string, id: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsApi.findById, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getFindByIdQueryOptions({ positionId, id, officeId }),
    queryFn: async () => {
    checkAcl(WorkingDocumentsAcl.canUseFindById({ officeId } ));
      return getFindByIdQueryOptions({ positionId, id, officeId }).queryFn();
    },
    ...options,
  });
};

export const prefetchFindById = (queryClient: QueryClient, { positionId, id, officeId }: { positionId: string, id: string, officeId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getFindByIdQueryOptions({ positionId, id, officeId }), ...options });
};

}
