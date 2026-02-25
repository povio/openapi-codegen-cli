import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace QuoteCargoModels {
/** 
 * ListCargosByQuoteIdOrderParamSchema 
 * @type { array }
 * @description Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt
 */
export const ListCargosByQuoteIdOrderParamSchema = z.array(CommonModels.PositionCargoPaginationOrderFieldSchema).readonly().describe("Order fields. Prefix with - for descending order. Example: -createdAt,updatedAt").nullish();
export type ListCargosByQuoteIdOrderParam = z.infer<typeof ListCargosByQuoteIdOrderParamSchema>;

/** 
 * ListCargosByQuoteIdResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.PositionCargoResponseDTO[] } items  
 */
export const ListCargosByQuoteIdResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.PositionCargoResponseDTOSchema).readonly() }).readonly().shape });
export type ListCargosByQuoteIdResponse = z.infer<typeof ListCargosByQuoteIdResponseSchema>;

/** 
 * QuoteCargoListCargoLabelsResponseSchema 
 * @type { array }
 */
export const QuoteCargoListCargoLabelsResponseSchema = z.array(CommonModels.LabelResponseDTOSchema).readonly();
export type QuoteCargoListCargoLabelsResponse = z.infer<typeof QuoteCargoListCargoLabelsResponseSchema>;

/** 
 * QuoteCargoGetCargoSummaryResponseSchema 
 * @type { array }
 */
export const QuoteCargoGetCargoSummaryResponseSchema = z.array(CommonModels.CargoSummaryResponseDTOSchema).readonly();
export type QuoteCargoGetCargoSummaryResponse = z.infer<typeof QuoteCargoGetCargoSummaryResponseSchema>;

/** 
 * QuoteCargoCreateBulkCargosResponseSchema 
 * @type { array }
 */
export const QuoteCargoCreateBulkCargosResponseSchema = z.array(CommonModels.PositionCargoResponseDTOSchema).readonly();
export type QuoteCargoCreateBulkCargosResponse = z.infer<typeof QuoteCargoCreateBulkCargosResponseSchema>;

}
