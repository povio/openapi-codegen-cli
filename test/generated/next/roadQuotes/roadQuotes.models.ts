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
export const RoadQuoteResponseDTOSchema = z.object({ id: z.string(), bookingMatchingCode: z.string(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string(), sellServiceContract: z.string() });
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
export const UpdateRoadQuoteRequestDTOSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable() }).partial();
export type UpdateRoadQuoteRequestDTO = z.infer<typeof UpdateRoadQuoteRequestDTOSchema>;

}
