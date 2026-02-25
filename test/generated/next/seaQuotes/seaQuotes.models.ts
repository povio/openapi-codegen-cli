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
export const SeaQuoteResponseDTOSchema = z.object({ id: z.string(), bookingMatchingCode: z.string(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string(), sellServiceContract: z.string(), routing: CommonModels.SeaRoutingEnumSchema.nullish(), splitRoute: z.boolean().nullish() });
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
export const UpdateSeaQuoteRequestDTOSchema = z.object({ bookingMatchingCode: z.string().nullable(), validFrom: z.iso.datetime({ offset: true }).nullable(), validUntil: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), sellServiceContract: z.string().nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable() }).partial();
export type UpdateSeaQuoteRequestDTO = z.infer<typeof UpdateSeaQuoteRequestDTOSchema>;

}
