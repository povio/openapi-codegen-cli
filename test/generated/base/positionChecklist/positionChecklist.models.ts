import { z } from "zod";

export namespace PositionChecklistModels {
/** 
 * PositionChecklistCompletedByResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PositionChecklistCompletedByResponseDtoSchema = z.object({ id: z.string(), name: z.string().nullable() });
export type PositionChecklistCompletedByResponseDto = z.infer<typeof PositionChecklistCompletedByResponseDtoSchema>;

/** 
 * PositionChecklistItemResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } positionId  
 * @property { string } checklistItemId  
 * @property { string } templateId  
 * @property { number } order  
 * @property { boolean } completed  
 * @property { string } completedAt  
 * @property { PositionChecklistCompletedByResponseDto } completedBy  
 * @property { string } notes  
 * @property { string } name  
 */
export const PositionChecklistItemResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), checklistItemId: z.string(), templateId: z.string().nullable(), order: z.number(), completed: z.boolean(), completedAt: z.iso.datetime({ offset: true }).nullable(), completedBy: PositionChecklistCompletedByResponseDtoSchema.nullable(), notes: z.string().nullable(), name: z.string().nullable() });
export type PositionChecklistItemResponseDto = z.infer<typeof PositionChecklistItemResponseDtoSchema>;

/** 
 * PositionChecklistResponseDtoSchema 
 * @type { object }
 * @property { PositionChecklistItemResponseDto[] } items  
 * @property { string[] } appliedTemplateIds  
 */
export const PositionChecklistResponseDtoSchema = z.object({ items: z.array(PositionChecklistItemResponseDtoSchema), appliedTemplateIds: z.array(z.string()) });
export type PositionChecklistResponseDto = z.infer<typeof PositionChecklistResponseDtoSchema>;

/** 
 * ApplyTemplatesRequestDtoSchema 
 * @type { object }
 * @property { string[] } templateIds  
 */
export const ApplyTemplatesRequestDtoSchema = z.object({ templateIds: z.array(z.string()) });
export type ApplyTemplatesRequestDto = z.infer<typeof ApplyTemplatesRequestDtoSchema>;

/** 
 * UpdatePositionChecklistItemDtoSchema 
 * @type { object }
 * @property { string } notes Max Length: `512` 
 */
export const UpdatePositionChecklistItemDtoSchema = z.object({ notes: z.string().max(512).nullable() }).partial();
export type UpdatePositionChecklistItemDto = z.infer<typeof UpdatePositionChecklistItemDtoSchema>;

/** 
 * ReorderPositionChecklistDtoSchema 
 * @type { object }
 * @property { string[] } itemIds  
 */
export const ReorderPositionChecklistDtoSchema = z.object({ itemIds: z.array(z.string()) });
export type ReorderPositionChecklistDto = z.infer<typeof ReorderPositionChecklistDtoSchema>;

/** 
 * ApplyTemplatesResponseSchema 
 * @type { array }
 */
export const ApplyTemplatesResponseSchema = z.array(PositionChecklistItemResponseDtoSchema);
export type ApplyTemplatesResponse = z.infer<typeof ApplyTemplatesResponseSchema>;

/** 
 * PositionChecklistReorderResponseSchema 
 * @type { array }
 */
export const PositionChecklistReorderResponseSchema = z.array(PositionChecklistItemResponseDtoSchema);
export type PositionChecklistReorderResponse = z.infer<typeof PositionChecklistReorderResponseSchema>;

}
