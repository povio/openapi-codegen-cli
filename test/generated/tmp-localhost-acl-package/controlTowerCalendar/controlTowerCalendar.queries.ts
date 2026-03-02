import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { useQuery } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { OpenApiQueryConfig, AppQueryOptions } from "@povio/openapi-codegen-cli";
import { ControlTowerCalendarModels } from "./controlTowerCalendar.models";

export namespace ControlTowerCalendarQueries {
const getCalendar = (from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam) => {
  return AppRestClient.get(
    { resSchema: ControlTowerCalendarModels.CalendarResponseDtoSchema },
    `/calendar`,
    {
      params: {
        from: ZodExtended.parse(z.iso.datetime({ offset: true }), from, { type: "query", name: "from" }),
        to: ZodExtended.parse(z.iso.datetime({ offset: true }), to, { type: "query", name: "to" }),
        type: ZodExtended.parse(ControlTowerCalendarModels.CalendarTypeEnumSchema, type, { type: "query", name: "type" }),
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        poNumbers: ZodExtended.parse(ControlTowerCalendarModels.GetCalendarPoNumbersParamSchema.optional(), poNumbers, { type: "query", name: "poNumbers" }),
        containerNumbers: ZodExtended.parse(ControlTowerCalendarModels.GetCalendarContainerNumbersParamSchema.optional(), containerNumbers, { type: "query", name: "containerNumbers" }),
        bookingNumbers: ZodExtended.parse(ControlTowerCalendarModels.GetCalendarBookingNumbersParamSchema.optional(), bookingNumbers, { type: "query", name: "bookingNumbers" }),
      },
    }
  );
};


export const moduleName = QueryModule.ControlTowerCalendar;

export const keys = {
    all: [moduleName] as const,
    getCalendar: (from?: string, to?: string, type?: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam) => [...keys.all, "/calendar", from, to, type, search, poNumbers, containerNumbers, bookingNumbers] as const,
};

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
export const useGetCalendar = <TData>({ from, to, type, search, poNumbers, containerNumbers, bookingNumbers }: { from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam }, options?: AppQueryOptions<typeof getCalendar, TData>) => {
  
  return useQuery({
    queryKey: keys.getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers),
    queryFn: () => 
    getCalendar(from, to, type, search, poNumbers, containerNumbers, bookingNumbers),
    ...options,
  });
};

}
