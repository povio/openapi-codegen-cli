import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { UserActivityApi } from "./userActivity.api";

export namespace UserActivityQueries {
export const moduleName = QueryModule.UserActivity;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number) => [...keys.all, "/offices/:officeId/:entityType/:entityId/activity", officeId, entityType, entityId, activeThresholdMinutes] as const,
};

export const getGetQueryOptions = ({ officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }) => ({
  queryKey: keys.get(officeId, entityType, entityId, activeThresholdMinutes),
  queryFn: () => UserActivityApi.get(officeId, entityType, entityId, activeThresholdMinutes),
});

/** 
 * Query `useGet`
 * @summary Get user activity for an entity
 * @param { string } officeId Path parameter
 * @param { string } entityType Path parameter
 * @param { string } entityId Path parameter
 * @param { number } activeThresholdMinutes Query parameter. Active threshold in minutes. Minimum: `1`
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<UserActivityModels.UserActivityResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }, options?: AppQueryOptions<typeof UserActivityApi.get, TData>) => {
  
  return useQuery({
    ...getGetQueryOptions({ officeId, entityType, entityId, activeThresholdMinutes }),
    ...options,
  });
};

export const prefetchGet = (queryClient: QueryClient, { officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetQueryOptions({ officeId, entityType, entityId, activeThresholdMinutes }), ...options });
};

}
