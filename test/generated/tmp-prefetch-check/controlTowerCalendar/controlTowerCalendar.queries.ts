import { QueryClient, useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerCalendarModels } from "./controlTowerCalendar.models";
import { ControlTowerCalendarApi } from "./controlTowerCalendar.api";

export namespace ControlTowerCalendarQueries {
export const moduleName = QueryModule.ControlTowerCalendar;

export const keys = {
    all: [moduleName] as const,
    getCalendar: (from?: string, to?: string, type?: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam) => [...keys.all, "/calendar", from, to, type, search, poNumbers, containerNumbers, bookingNumbers] as const,
};

export const getGetCalendarQueryOptions = ({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }: { from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam }) => ({
  queryKey: keys.getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers),
  queryFn: () => ControlTowerCalendarApi.getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers),
});

/** 
 * Query `useGetCalendar`
 * @param { string } from Query parameter
 * @param { string } to Query parameter
 * @param { ControlTowerCalendarModels.CalendarTypeEnum } type Query parameter
 * @param { string } search Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarPoNumbersParam } poNumbers Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarContainerNumbersParam } containerNumbers Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarBookingNumbersParam } bookingNumbers Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerCalendarModels.CalendarResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetCalendar = <TData>({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }: { from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam }, options?: AppQueryOptions<typeof ControlTowerCalendarApi.getCalendar, TData>) => {
  
  return useQuery({
    ...getGetCalendarQueryOptions({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }),
    ...options,
  });
};

export const prefetchGetCalendar = (queryClient: QueryClient, { from, to, type, search, poNumbers, containerNumbers, bookingNumbers }: { from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">) => {
  return queryClient.prefetchQuery({ ...getGetCalendarQueryOptions({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }), ...options });
};

}
