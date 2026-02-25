import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerCalendarModels } from "./controlTowerCalendar.models";

export namespace ControlTowerCalendarApi {
export const getCalendar = (from: string, to: string, type: ControlTowerCalendarModels.CalendarTypeEnum, search?: string, poNumbers?: ControlTowerCalendarModels.GetCalendarPoNumbersParam, containerNumbers?: ControlTowerCalendarModels.GetCalendarContainerNumbersParam, bookingNumbers?: ControlTowerCalendarModels.GetCalendarBookingNumbersParam, ) => {
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
    )
};
}
