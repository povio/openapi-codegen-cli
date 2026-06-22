import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { UserActivityModels } from "./userActivity.models";

export namespace UserActivityQueries {
const get = (officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number) => {
  return AppRestClient.get(
    { resSchema: UserActivityModels.UserActivityResponseDtoSchema },
    `/offices/${officeId}/${entityType}/${entityId}/activity`,
    {
      params: {
        activeThresholdMinutes: ZodExtended.parse(z.number().gte(1).nullish(), activeThresholdMinutes, { type: "query", name: "activeThresholdMinutes" }),
      },
    }
  );
};


export const moduleName = QueryModule.UserActivity;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number) => [...keys.all, "/offices/:officeId/:entityType/:entityId/activity", officeId, entityType, entityId, activeThresholdMinutes] as const,
};

export const getQueryOptions = ({ officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }) => ({
  queryKey: keys.get(officeId, entityType, entityId, activeThresholdMinutes),
  queryFn: () => get(officeId, entityType, entityId, activeThresholdMinutes),
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
export const useGet = <TData>({ officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }, options?: AppQueryOptions<typeof get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    ...getQueryOptions({ officeId, entityType, entityId, activeThresholdMinutes }),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

export const prefetchGet = (queryClient: QueryClient, { officeId, entityType, entityId, activeThresholdMinutes }: { officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getQueryOptions({ officeId, entityType, entityId, activeThresholdMinutes }), ...options });
};

}
