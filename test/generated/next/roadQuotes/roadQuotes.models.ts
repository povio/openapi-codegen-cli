import { z } from "zod";

export namespace RoadQuotesModels {
/** 
 * RoadQuoteResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the road quote 
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 */
export const RoadQuoteResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier for the road quote"), bookingMatchingCode: z.string().describe("Code for matching bookings"), validFrom: z.iso.datetime({ offset: true }).describe("Start date of quote validity").nullable(), validUntil: z.iso.datetime({ offset: true }).describe("End date of quote validity").nullable(), buyServiceContract: z.string().describe("Service contract for buying"), sellServiceContract: z.string().describe("Service contract for selling") }).readonly();
export type RoadQuoteResponseDTO = z.infer<typeof RoadQuoteResponseDTOSchema>;

/** 
 * UpdateRoadQuoteRequestDTOSchema 
 * @type { object }
 * @property { string } bookingMatchingCode Code for matching bookings 
 * @property { string } validFrom Start date of quote validity 
 * @property { string } validUntil End date of quote validity 
 * @property { string } buyServiceContract Service contract for buying 
 * @property { string } sellServiceContract Service contract for selling 
 */
export const UpdateRoadQuoteRequestDTOSchema = z.object({ bookingMatchingCode: z.string().describe("Code for matching bookings"), validFrom: z.iso.datetime({ offset: true }).describe("Start date of quote validity"), validUntil: z.iso.datetime({ offset: true }).describe("End date of quote validity"), buyServiceContract: z.string().describe("Service contract for buying"), sellServiceContract: z.string().describe("Service contract for selling") }).readonly();
export type UpdateRoadQuoteRequestDTO = z.infer<typeof UpdateRoadQuoteRequestDTOSchema>;

}
