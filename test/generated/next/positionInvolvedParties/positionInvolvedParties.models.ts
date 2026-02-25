import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionInvolvedPartiesModels {
/** 
 * FindByPositionIdResponseSchema 
 * @type { array }
 */
export const FindByPositionIdResponseSchema = z.array(CommonModels.InvolvedPartyResponseDtoSchema).readonly();
export type FindByPositionIdResponse = z.infer<typeof FindByPositionIdResponseSchema>;

}
