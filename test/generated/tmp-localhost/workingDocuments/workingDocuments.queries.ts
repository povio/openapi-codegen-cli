import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useAclCheck } from "@/data/acl/useAclCheck";
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

/** 
 * Query `useList`
 * @summary List working documents
 * @permission Requires `canUseList` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): NAME, TYPE, CREATED_AT, UPDATED_AT. Example: `NAME`
 * @param { WorkingDocumentsModels.WorkingDocumentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsModels.WorkingDocumentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useList = <TData>({ positionId, officeId, limit, order, filter, page, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, page?: number, cursor?: string }, options?: AppQueryOptions<typeof WorkingDocumentsApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.list(positionId, officeId, limit, order, filter, page, cursor),
    queryFn: () => { 
    checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
    return WorkingDocumentsApi.list(positionId, officeId, limit, order, filter, page, cursor) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Infinite query `useListInfinite
 * @summary List working documents
 * @permission Requires `canUseList` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.officeId Path parameter
 * @param { number } object.limit Query parameter. Items per response. Minimum: `1`. Maximum: `100`. Default: `20`
 * @param { string } object.order Query parameter. Order by fields (comma separated with +/- prefix): NAME, TYPE, CREATED_AT, UPDATED_AT. Example: `NAME`
 * @param { WorkingDocumentsModels.WorkingDocumentFilterDto } object.filter Query parameter
 * @param { number } object.page Query parameter. 1-indexed page number to begin from
 * @param { string } object.cursor Query parameter. ID of item to start after
 * @param { AppInfiniteQueryOptions } options Infinite query options
 * @returns { UseInfiniteQueryResult<WorkingDocumentsModels.WorkingDocumentsListResponse> } 
 * @statusCodes [200, 401]
 */
export const useListInfinite = <TData>({ positionId, officeId, limit, order, filter, cursor }: { positionId: string, officeId: string, limit: number, order?: string, filter?: WorkingDocumentsModels.WorkingDocumentFilterDto, cursor?: string }, options?: AppInfiniteQueryOptions<typeof WorkingDocumentsApi.list, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();

  return useInfiniteQuery({
    queryKey: keys.listInfinite(positionId, officeId, limit, order, filter, cursor),
    queryFn: ({ pageParam }) => { 
    checkAcl(WorkingDocumentsAcl.canUseList({ officeId } ));
    return WorkingDocumentsApi.list(positionId, officeId, limit, order, filter, pageParam, cursor) },
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
 * @summary Get working document by ID
 * @permission Requires `canUseFindById` ability 
 * @param { string } object.positionId Path parameter
 * @param { string } object.id Path parameter
 * @param { string } object.officeId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<WorkingDocumentsModels.WorkingDocumentResponseDTO> } 
 * @statusCodes [200, 401, 404]
 */
export const useFindById = <TData>({ positionId, id, officeId }: { positionId: string, id: string, officeId: string }, options?: AppQueryOptions<typeof WorkingDocumentsApi.findById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.findById(positionId, id, officeId),
    queryFn: () => { 
    checkAcl(WorkingDocumentsAcl.canUseFindById({ officeId } ));
    return WorkingDocumentsApi.findById(positionId, id, officeId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

}
