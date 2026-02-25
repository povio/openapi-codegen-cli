import { AxiosRequestConfig } from "axios";
import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { AppQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerCalendarModels } from "./controlTowerCalendar.models";
import { ControlTowerCalendarApi } from "./controlTowerCalendar.api";

export namespace ControlTowerCalendarQueries {
export const moduleName = QueryModule.ControlTowerCalendar;

export const keys = {
    all: [moduleName] as const,
    getCalendar: (from?: string, to?: string, type?: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam) => [...keys.all, "/calendar", from, to, type, search, poNumbers, containerNumbers, bookingNumbers] as const,
};

/** 
 * Query `useGetCalendar`
 * @param { string } object.from Query parameter
 * @param { string } object.to Query parameter
 * @param { ControlTowerCalendarModels.CalendarTypeEnum } object.type Query parameter
 * @param { string } object.search Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarPoNumbersParam } object.poNumbers Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarContainerNumbersParam } object.containerNumbers Query parameter
 * @param { ControlTowerCalendarModels.GetCalendarBookingNumbersParam } object.bookingNumbers Query parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<ControlTowerCalendarModels.CalendarResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGetCalendar = <TData>({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }: { from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam }, options?: AppQueryOptions<typeof ControlTowerCalendarApi.getCalendar, TData>, config?: AxiosRequestConfig) => {
  
  return useQuery({
    queryKey: keys.getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers),
    queryFn: () => 
    ControlTowerCalendarApi.getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers, config),
    ...options,
  });
};

}
