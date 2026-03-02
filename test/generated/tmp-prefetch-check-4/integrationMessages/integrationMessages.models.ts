import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace IntegrationMessagesModels {
/** 
 * IntegrationMessageChannelResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const IntegrationMessageChannelResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type IntegrationMessageChannelResponseDto = z.infer<typeof IntegrationMessageChannelResponseDtoSchema>;

/** 
 * IntegrationMessageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { IntegrationMessageChannelResponseDto } integrationChannel  
 * @property { string } positionId  
 * @property { string } positionNumber  
 * @property { string } direction  
 * @property { string } format  
 * @property { string } status  
 * @property { string } rawContent  
 * @property { string } fileName  
 * @property { string } errorMessage  
 * @property { string } processedAt  
 * @property { string } sentAt  
 * @property { string } createdAt  
 */
export const IntegrationMessageResponseDtoSchema = z.object({ id: z.string(), integrationChannel: IntegrationMessageChannelResponseDtoSchema, positionId: z.string().nullish(), positionNumber: z.string().nullish(), direction: z.string(), format: z.string(), status: z.string(), rawContent: z.string(), fileName: z.string(), errorMessage: z.string().nullish(), processedAt: z.iso.datetime({ offset: true }).nullish(), sentAt: z.iso.datetime({ offset: true }).nullish(), createdAt: z.iso.datetime({ offset: true }) });
export type IntegrationMessageResponseDto = z.infer<typeof IntegrationMessageResponseDtoSchema>;

/** 
 * IntegrationMessageFilterDtoSchema 
 * @type { object }
 * @property { string[] } integrationChannelId  
 * @property { string } search  
 */
export const IntegrationMessageFilterDtoSchema = z.object({ integrationChannelId: z.array(z.uuid()).nullable(), search: z.string().nullable() }).partial();
export type IntegrationMessageFilterDto = z.infer<typeof IntegrationMessageFilterDtoSchema>;

/** 
 * IntegrationMessagesListOrderParamEnumSchema 
 * @type { enum }
 */
export const IntegrationMessagesListOrderParamEnumSchema = z.enum(["createdAt", "status", "direction", "format", "integrationChannel", "positionNumber"]);
export type IntegrationMessagesListOrderParamEnum = z.infer<typeof IntegrationMessagesListOrderParamEnumSchema>;
export const IntegrationMessagesListOrderParamEnum = IntegrationMessagesListOrderParamEnumSchema.enum;

/** 
 * IntegrationMessagesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { IntegrationMessageResponseDto[] } items  
 */
export const IntegrationMessagesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(IntegrationMessageResponseDtoSchema).nullable() }).partial().shape });
export type IntegrationMessagesListResponse = z.infer<typeof IntegrationMessagesListResponseSchema>;

}
