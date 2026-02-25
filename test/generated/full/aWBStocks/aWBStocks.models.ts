import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace AWBStocksModels {
/** 
 * AWBStockBusinessPartnerPreviewDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } name Business partner name 
 * @property { string } carrierPrefix Carrier prefix (3 digits) 
 */
export const AWBStockBusinessPartnerPreviewDTOSchema = z.object({ id: z.string().describe("Business partner ID"), name: z.string().describe("Business partner name"), carrierPrefix: z.string().describe("Carrier prefix (3 digits)") }).readonly();
export type AWBStockBusinessPartnerPreviewDTO = z.infer<typeof AWBStockBusinessPartnerPreviewDTOSchema>;

/** 
 * AWBStockEmployeePreviewDTOSchema 
 * @type { object }
 * @property { string } id Employee ID 
 * @property { string } email Employee email 
 */
export const AWBStockEmployeePreviewDTOSchema = z.object({ id: z.string().describe("Employee ID"), email: z.string().describe("Employee email") }).readonly();
export type AWBStockEmployeePreviewDTO = z.infer<typeof AWBStockEmployeePreviewDTOSchema>;

/** 
 * AWBStockResponseDTOSchema 
 * @type { object }
 * @property { string } id AWB stock ID 
 * @property { AWBStockBusinessPartnerPreviewDTO } carrier Carrier business partner 
 * @property { number } startNumber Start number 
 * @property { number } lastUsedNumber Last used number 
 * @property { number } stock Stock size 
 * @property { number } usedCodes Used codes count 
 * @property { number } priority Priority 
 * @property { boolean } archived Is archived 
 * @property { string } comments Comments 
 * @property { string } createdAt Created at 
 * @property { string } updatedAt Updated at 
 * @property { AWBStockEmployeePreviewDTO } createdBy User who created the stock 
 * @property { AWBStockEmployeePreviewDTO } updatedBy User who updated the stock 
 * @property { string } officeId Office ID 
 */
export const AWBStockResponseDTOSchema = z.object({ id: z.string().describe("AWB stock ID"), carrier: AWBStockBusinessPartnerPreviewDTOSchema.describe("Carrier business partner"), startNumber: z.number().describe("Start number"), lastUsedNumber: z.number().describe("Last used number").nullish(), stock: z.number().describe("Stock size"), usedCodes: z.number().describe("Used codes count"), priority: z.number().describe("Priority"), archived: z.boolean().describe("Is archived"), comments: z.string().describe("Comments").nullish(), createdAt: z.iso.datetime({ offset: true }).describe("Created at"), updatedAt: z.iso.datetime({ offset: true }).describe("Updated at"), createdBy: AWBStockEmployeePreviewDTOSchema.describe("User who created the stock"), updatedBy: AWBStockEmployeePreviewDTOSchema.describe("User who updated the stock").nullish(), officeId: z.string().describe("Office ID") }).readonly();
export type AWBStockResponseDTO = z.infer<typeof AWBStockResponseDTOSchema>;

/** 
 * AWBStockFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived  
 * @property { string } carrierId  
 * @property { string } searchQuery  
 * @property { boolean } used  
 */
export const AWBStockFilterDtoSchema = z.object({ archived: z.boolean(), carrierId: z.string(), searchQuery: z.string(), used: z.boolean() }).readonly();
export type AWBStockFilterDto = z.infer<typeof AWBStockFilterDtoSchema>;

/** 
 * CreateAWBStockRequestDTOSchema 
 * @type { object }
 * @property { string } carrierId Carrier business partner ID 
 * @property { number } startNumber Start number. Minimum: `0` 
 * @property { number } stock Stock size 
 * @property { number } priority Priority 
 * @property { string } comments Comments 
 * @property { string } officeId Office ID 
 */
export const CreateAWBStockRequestDTOSchema = z.object({ carrierId: z.string().describe("Carrier business partner ID"), startNumber: z.number().gte(0).describe("Start number"), stock: z.number().describe("Stock size"), priority: z.number().describe("Priority"), comments: z.string().describe("Comments").nullish(), officeId: z.string().describe("Office ID") }).readonly();
export type CreateAWBStockRequestDTO = z.infer<typeof CreateAWBStockRequestDTOSchema>;

/** 
 * GenerateAWBNumberRequestDTOSchema 
 * @type { object }
 * @property { string } carrierId Carrier ID. Example: `e847c7dd-a364-4488-bed6-1e5878aff022` 
 */
export const GenerateAWBNumberRequestDTOSchema = z.object({ carrierId: z.string().describe("Carrier ID") }).readonly();
export type GenerateAWBNumberRequestDTO = z.infer<typeof GenerateAWBNumberRequestDTOSchema>;

/** 
 * GenerateAWBNumberResponseDTOSchema 
 * @type { object }
 * @property { string } formattedAwbNumber Generated AWB number. Example: `123-45678901` 
 */
export const GenerateAWBNumberResponseDTOSchema = z.object({ formattedAwbNumber: z.string().describe("Generated AWB number") }).readonly();
export type GenerateAWBNumberResponseDTO = z.infer<typeof GenerateAWBNumberResponseDTOSchema>;

/** 
 * UpdateAWBStockRequestDTOSchema 
 * @type { object }
 * @property { string } comments Comments 
 */
export const UpdateAWBStockRequestDTOSchema = z.object({ comments: z.string().describe("Comments") }).readonly();
export type UpdateAWBStockRequestDTO = z.infer<typeof UpdateAWBStockRequestDTOSchema>;

/** 
 * AWBStocksPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const AWBStocksPaginateOrderParamEnumSchema = z.enum(["createdAt", "updatedAt", "createdBy", "updatedBy", "carrierName", "startNumber", "priority"]);
export type AWBStocksPaginateOrderParamEnum = z.infer<typeof AWBStocksPaginateOrderParamEnumSchema>;
export const AWBStocksPaginateOrderParamEnum = AWBStocksPaginateOrderParamEnumSchema.enum;

/** 
 * AWBStocksPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { AWBStockResponseDTO[] } items  
 */
export const AWBStocksPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(AWBStockResponseDTOSchema).readonly() }).readonly().shape });
export type AWBStocksPaginateResponse = z.infer<typeof AWBStocksPaginateResponseSchema>;

}
