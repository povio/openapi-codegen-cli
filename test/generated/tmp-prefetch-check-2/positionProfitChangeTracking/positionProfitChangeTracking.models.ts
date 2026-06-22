import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionProfitChangeTrackingModels {
/** 
 * PositionAccountProfitChangeGroupDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { CommonModels.UserPreviewDto[] } users  
 * @property { object } profit  
 * @property { number } profit.amount  
 * @property { string } profit.currencyCode  
 * @property { number } changeCount  
 */
export const PositionAccountProfitChangeGroupDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), users: z.array(CommonModels.UserPreviewDtoSchema), profit: z.object({ amount: z.number(), currencyCode: z.string() }), changeCount: z.number() });
export type PositionAccountProfitChangeGroupDto = z.infer<typeof PositionAccountProfitChangeGroupDtoSchema>;

/** 
 * PositionAccountProfitChangeEntryDtoSchema 
 * @type { object }
 * @property { string } timestamp  
 * @property { CommonModels.UserPreviewDto } user  
 * @property { number } changeNumber  
 * @property { number } oldProfit  
 * @property { number } newProfit  
 * @property { string } currencyCode  
 */
export const PositionAccountProfitChangeEntryDtoSchema = z.object({ timestamp: z.iso.datetime({ offset: true }), user: CommonModels.UserPreviewDtoSchema, changeNumber: z.number(), oldProfit: z.number(), newProfit: z.number(), currencyCode: z.string() });
export type PositionAccountProfitChangeEntryDto = z.infer<typeof PositionAccountProfitChangeEntryDtoSchema>;

/** 
 * PositionAccountProfitChangeGroupDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { string } currencyCode  
 * @property { PositionAccountProfitChangeEntryDto[] } entries  
 */
export const PositionAccountProfitChangeGroupDetailDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), currencyCode: z.string(), entries: z.array(PositionAccountProfitChangeEntryDtoSchema) });
export type PositionAccountProfitChangeGroupDetailDto = z.infer<typeof PositionAccountProfitChangeGroupDetailDtoSchema>;

/** 
 * PositionProfitChangeTrackingFilterDtoSchema 
 * @type { object }
 * @property { string } userId User IDs who made the changes 
 * @property { string } dateFrom Date range start 
 * @property { string } dateTo Date range end 
 */
export const PositionProfitChangeTrackingFilterDtoSchema = z.object({ userId: z.string().nullable(), dateFrom: z.string().nullable(), dateTo: z.string().nullable() }).partial();
export type PositionProfitChangeTrackingFilterDto = z.infer<typeof PositionProfitChangeTrackingFilterDtoSchema>;

/** 
 * PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema 
 * @type { enum }
 */
export const PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema = z.enum(["timestamp", "profitAmount", "changeCount"]);
export type PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnum = z.infer<typeof PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema>;
export const PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnum = PositionProfitChangeTrackingFindProfitChangeGroupsOrderParamEnumSchema.enum;

/** 
 * PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PositionAccountProfitChangeGroupDto[] } items  
 */
export const PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PositionAccountProfitChangeGroupDtoSchema).nullable() }).partial().shape });
export type PositionProfitChangeTrackingFindProfitChangeGroupsResponse = z.infer<typeof PositionProfitChangeTrackingFindProfitChangeGroupsResponseSchema>;

}
