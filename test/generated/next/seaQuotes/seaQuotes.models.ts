import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace SeaQuotesModels {
/** 
 * SeaQuoteResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the sea quote 
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { boolean } splitRoute Indicates if the route is split 
 */
export const SeaQuoteResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier for the sea quote"), bookingMatchingCode: z.string().describe("Code for matching bookings"), validFrom: z.iso.datetime({ offset: true }).describe("Start date of quote validity").nullable(), validUntil: z.iso.datetime({ offset: true }).describe("End date of quote validity").nullable(), buyServiceContract: z.string().describe("Service contract for buying"), sellServiceContract: z.string().describe("Service contract for selling"), routing: CommonModels.SeaRoutingEnumSchema.nullish(), splitRoute: z.boolean().describe("Indicates if the route is split").nullish() }).readonly();
export type SeaQuoteResponseDTO = z.infer<typeof SeaQuoteResponseDTOSchema>;

/** 
 * UpdateSeaQuoteRequestDTOSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 * @property { CommonModels.SeaRoutingEnum } routing  
 */
export const UpdateSeaQuoteRequestDTOSchema = z.object({ bookingMatchingCode: z.string().describe("Code for matching bookings"), validFrom: z.iso.datetime({ offset: true }).describe("Start date of quote validity"), validUntil: z.iso.datetime({ offset: true }).describe("End date of quote validity"), buyServiceContract: z.string().describe("Service contract for buying"), sellServiceContract: z.string().describe("Service contract for selling"), routing: CommonModels.SeaRoutingEnumSchema }).readonly();
export type UpdateSeaQuoteRequestDTO = z.infer<typeof UpdateSeaQuoteRequestDTOSchema>;

}
