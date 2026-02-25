import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace InttraShippingInstructionMessagesModels {
/** 
 * InttraShippingInstructionStatusEnumSchema 
 * @type { enum }
 */
export const InttraShippingInstructionStatusEnumSchema = z.enum(["PendingUpload", "Uploaded", "ContrlAccepted", "ContrlRejected", "AperakAccepted", "AperakRejected", "FailedUpload"]);
export type InttraShippingInstructionStatusEnum = z.infer<typeof InttraShippingInstructionStatusEnumSchema>;
export const InttraShippingInstructionStatusEnum = InttraShippingInstructionStatusEnumSchema.enum;

/** 
 * ShippingInstructionMessageListItemResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } shippingInstructionsId  
 * @property { string } positionId  
 * @property { string } createdByUserId  
 * @property { InttraShippingInstructionStatusEnum } status  
 * @property { string } fileName  
 * @property { string } sftpPath  
 * @property { string } sentAt  
 * @property { number } uploadAttemptCount  
 * @property { string } lastUploadError  
 * @property { string } notes  
 * @property { string } contrlStatus  
 * @property { string } contrlReceivedAt  
 * @property { string } contrlRaw  
 * @property { string } aperakStatus  
 * @property { string } aperakReceivedAt  
 * @property { string } aperakRaw  
 */
export const ShippingInstructionMessageListItemResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), shippingInstructionsId: z.string(), positionId: z.string(), createdByUserId: z.string(), status: InttraShippingInstructionStatusEnumSchema, fileName: z.string(), sftpPath: z.string(), sentAt: z.iso.datetime({ offset: true }), uploadAttemptCount: z.number(), lastUploadError: z.string().nullish(), notes: z.string().nullish(), contrlStatus: z.string().nullish(), contrlReceivedAt: z.iso.datetime({ offset: true }).nullish(), contrlRaw: z.string().nullish(), aperakStatus: z.string().nullish(), aperakReceivedAt: z.iso.datetime({ offset: true }).nullish(), aperakRaw: z.string().nullish() }).readonly();
export type ShippingInstructionMessageListItemResponseDto = z.infer<typeof ShippingInstructionMessageListItemResponseDtoSchema>;

/** 
 * ShippingInstructionMessageFilterDtoSchema 
 * @type { object }
 * @property { InttraShippingInstructionStatusEnum[] } status  
 */
export const ShippingInstructionMessageFilterDtoSchema = z.object({ status: z.array(InttraShippingInstructionStatusEnumSchema).readonly() }).readonly();
export type ShippingInstructionMessageFilterDto = z.infer<typeof ShippingInstructionMessageFilterDtoSchema>;

/** 
 * ShippingInstructionMessageResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } shippingInstructionsId  
 * @property { string } positionId  
 * @property { string } createdByUserId  
 * @property { InttraShippingInstructionStatusEnum } status  
 * @property { object } shippingInstructionSnapshot  
 * @property { string } renderedRequestPayload  
 * @property { string } fileName  
 * @property { string } sftpPath  
 * @property { string } sentAt  
 * @property { number } uploadAttemptCount  
 * @property { string } lastUploadError  
 * @property { string } notes  
 * @property { string } contrlStatus  
 * @property { string } contrlReceivedAt  
 * @property { string } contrlRaw  
 * @property { string } aperakStatus  
 * @property { string } aperakReceivedAt  
 * @property { string } aperakRaw  
 */
export const ShippingInstructionMessageResponseDtoSchema = z.object({ id: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), shippingInstructionsId: z.string(), positionId: z.string(), createdByUserId: z.string(), status: InttraShippingInstructionStatusEnumSchema, shippingInstructionSnapshot: z.object({}).readonly(), renderedRequestPayload: z.string(), fileName: z.string(), sftpPath: z.string(), sentAt: z.iso.datetime({ offset: true }), uploadAttemptCount: z.number(), lastUploadError: z.string().nullish(), notes: z.string().nullish(), contrlStatus: z.string().nullish(), contrlReceivedAt: z.iso.datetime({ offset: true }).nullish(), contrlRaw: z.string().nullish(), aperakStatus: z.string().nullish(), aperakReceivedAt: z.iso.datetime({ offset: true }).nullish(), aperakRaw: z.string().nullish() }).readonly();
export type ShippingInstructionMessageResponseDto = z.infer<typeof ShippingInstructionMessageResponseDtoSchema>;

/** 
 * UpdateShippingInstructionMessageRequestDtoSchema 
 * @type { object }
 * @property { string } notes  
 */
export const UpdateShippingInstructionMessageRequestDtoSchema = z.object({ notes: z.string() }).readonly();
export type UpdateShippingInstructionMessageRequestDto = z.infer<typeof UpdateShippingInstructionMessageRequestDtoSchema>;

/** 
 * CreateShippingInstructionMessageRequestDtoSchema 
 * @type { object }
 * @property { boolean } isAmendment Default: `false` 
 */
export const CreateShippingInstructionMessageRequestDtoSchema = z.object({ isAmendment: z.boolean().default(false) }).readonly();
export type CreateShippingInstructionMessageRequestDto = z.infer<typeof CreateShippingInstructionMessageRequestDtoSchema>;

/** 
 * InttraShippingInstructionMessagesListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { ShippingInstructionMessageListItemResponseDto[] } items  
 */
export const InttraShippingInstructionMessagesListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ShippingInstructionMessageListItemResponseDtoSchema).readonly() }).readonly().shape });
export type InttraShippingInstructionMessagesListResponse = z.infer<typeof InttraShippingInstructionMessagesListResponseSchema>;

}
