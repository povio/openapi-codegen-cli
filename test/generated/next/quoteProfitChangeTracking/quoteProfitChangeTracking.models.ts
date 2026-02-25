import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteProfitChangeTrackingModels {
/** 
 * QuoteAccountProfitChangeGroupDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { CommonModels.UserPreviewDto[] } users  
 * @property { object } profit  
 * @property { number } profit.amount  
 * @property { string } profit.currencyCode  
 * @property { number } changeCount  
 */
export const QuoteAccountProfitChangeGroupDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), users: z.array(CommonModels.UserPreviewDtoSchema).readonly(), profit: z.object({ amount: z.number(), currencyCode: z.string() }).readonly(), changeCount: z.number() }).readonly();
export type QuoteAccountProfitChangeGroupDto = z.infer<typeof QuoteAccountProfitChangeGroupDtoSchema>;

/** 
 * QuoteAccountProfitChangeEntryDtoSchema 
 * @type { object }
 * @property { string } timestamp  
 * @property { CommonModels.UserPreviewDto } user  
 * @property { number } changeNumber  
 * @property { number } oldProfit  
 * @property { number } newProfit  
 * @property { string } currencyCode  
 */
export const QuoteAccountProfitChangeEntryDtoSchema = z.object({ timestamp: z.iso.datetime({ offset: true }), user: CommonModels.UserPreviewDtoSchema, changeNumber: z.number(), oldProfit: z.number(), newProfit: z.number(), currencyCode: z.string() }).readonly();
export type QuoteAccountProfitChangeEntryDto = z.infer<typeof QuoteAccountProfitChangeEntryDtoSchema>;

/** 
 * QuoteAccountProfitChangeGroupDetailDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } timestamp  
 * @property { string } currencyCode  
 * @property { QuoteAccountProfitChangeEntryDto[] } entries  
 */
export const QuoteAccountProfitChangeGroupDetailDtoSchema = z.object({ id: z.string(), timestamp: z.iso.datetime({ offset: true }), currencyCode: z.string(), entries: z.array(QuoteAccountProfitChangeEntryDtoSchema).readonly() }).readonly();
export type QuoteAccountProfitChangeGroupDetailDto = z.infer<typeof QuoteAccountProfitChangeGroupDetailDtoSchema>;

/** 
 * QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { QuoteAccountProfitChangeGroupDto[] } items  
 */
export const QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(QuoteAccountProfitChangeGroupDtoSchema).readonly() }).readonly().shape });
export type QuoteProfitChangeTrackingFindProfitChangeGroupsResponse = z.infer<typeof QuoteProfitChangeTrackingFindProfitChangeGroupsResponseSchema>;

}
