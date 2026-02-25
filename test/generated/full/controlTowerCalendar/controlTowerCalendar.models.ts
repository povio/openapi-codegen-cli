import { z } from "zod";

export namespace ControlTowerCalendarModels {
/** 
 * EventRelationTypeEnumSchema 
 * @type { enum }
 */
export const EventRelationTypeEnumSchema = z.enum(["Booking", "Container", "PurchaseOrder"]);
export type EventRelationTypeEnum = z.infer<typeof EventRelationTypeEnumSchema>;
export const EventRelationTypeEnum = EventRelationTypeEnumSchema.enum;

/** 
 * CalendarEventRelationDtoSchema 
 * @type { object }
 * @property { EventRelationTypeEnum } type  
 * @property { string } id  
 * @property { string } number  
 */
export const CalendarEventRelationDtoSchema = z.object({ type: EventRelationTypeEnumSchema, id: z.string(), number: z.string() }).readonly();
export type CalendarEventRelationDto = z.infer<typeof CalendarEventRelationDtoSchema>;

/** 
 * CalendarTypeEnumSchema 
 * @type { enum }
 */
export const CalendarTypeEnumSchema = z.enum(["PurchaseOrder", "Booking", "Container", "Package"]);
export type CalendarTypeEnum = z.infer<typeof CalendarTypeEnumSchema>;
export const CalendarTypeEnum = CalendarTypeEnumSchema.enum;

/** 
 * CalendarEventDtoSchema 
 * @type { object }
 * @property { string } entityId  
 * @property { string } entityNumber  
 * @property { CalendarTypeEnum } entityType  
 * @property { string } date  
 * @property { string } title  
 * @property { CalendarEventRelationDto[] } relations  
 */
export const CalendarEventDtoSchema = z.object({ entityId: z.string(), entityNumber: z.string(), entityType: CalendarTypeEnumSchema, date: z.iso.datetime({ offset: true }), title: z.string(), relations: z.array(CalendarEventRelationDtoSchema).readonly() }).readonly();
export type CalendarEventDto = z.infer<typeof CalendarEventDtoSchema>;

/** 
 * FiltersDtoSchema 
 * @type { object }
 * @property { string[] } poNumbers  
 * @property { string[] } bookingNumbers  
 * @property { string[] } containerNumbers  
 */
export const FiltersDtoSchema = z.object({ poNumbers: z.array(z.string()).readonly(), bookingNumbers: z.array(z.string()).readonly(), containerNumbers: z.array(z.string()).readonly() }).readonly();
export type FiltersDto = z.infer<typeof FiltersDtoSchema>;

/** 
 * CalendarDtoSchema 
 * @type { object }
 * @property { CalendarEventDto[] } events  
 * @property { FiltersDto } filters  
 */
export const CalendarDtoSchema = z.object({ events: z.array(CalendarEventDtoSchema).readonly(), filters: FiltersDtoSchema }).readonly();
export type CalendarDto = z.infer<typeof CalendarDtoSchema>;

/** 
 * CalendarResponseDtoSchema 
 * @type { object }
 * @property { CalendarDto } data  
 */
export const CalendarResponseDtoSchema = z.object({ data: CalendarDtoSchema }).readonly();
export type CalendarResponseDto = z.infer<typeof CalendarResponseDtoSchema>;

/** 
 * GetCalendarPoNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarPoNumbersParamSchema = z.array(z.string()).readonly().nullish();
export type GetCalendarPoNumbersParam = z.infer<typeof GetCalendarPoNumbersParamSchema>;

/** 
 * GetCalendarContainerNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarContainerNumbersParamSchema = z.array(z.string()).readonly().nullish();
export type GetCalendarContainerNumbersParam = z.infer<typeof GetCalendarContainerNumbersParamSchema>;

/** 
 * GetCalendarBookingNumbersParamSchema 
 * @type { array }
 */
export const GetCalendarBookingNumbersParamSchema = z.array(z.string()).readonly().nullish();
export type GetCalendarBookingNumbersParam = z.infer<typeof GetCalendarBookingNumbersParamSchema>;

}
