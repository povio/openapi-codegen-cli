import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionCargoModels {
/** 
 * ListCargosByPositionIdOrderParamSchema 
 * @type { array }
 */
export const ListCargosByPositionIdOrderParamSchema = z.array(CommonModels.PositionCargoPaginationOrderFieldSchema).nullish();
export type ListCargosByPositionIdOrderParam = z.infer<typeof ListCargosByPositionIdOrderParamSchema>;

/** 
 * ListCargosByPositionIdResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.PositionCargoResponseDTO[] } items  
 */
export const ListCargosByPositionIdResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.PositionCargoResponseDTOSchema).nullable() }).partial().shape });
export type ListCargosByPositionIdResponse = z.infer<typeof ListCargosByPositionIdResponseSchema>;

/** 
 * PositionCargoListCargoLabelsResponseSchema 
 * @type { array }
 */
export const PositionCargoListCargoLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema);
export type PositionCargoListCargoLabelsResponse = z.infer<typeof PositionCargoListCargoLabelsResponseSchema>;

/** 
 * PositionCargoGetCargoSummaryResponseSchema 
 * @type { array }
 */
export const PositionCargoGetCargoSummaryResponseSchema = z.array(CommonModels.CargoSummaryResponseDTOSchema);
export type PositionCargoGetCargoSummaryResponse = z.infer<typeof PositionCargoGetCargoSummaryResponseSchema>;

/** 
 * PositionCargoCreateBulkCargosResponseSchema 
 * @type { array }
 */
export const PositionCargoCreateBulkCargosResponseSchema = z.array(CommonModels.PositionCargoResponseDTOSchema);
export type PositionCargoCreateBulkCargosResponse = z.infer<typeof PositionCargoCreateBulkCargosResponseSchema>;

}
