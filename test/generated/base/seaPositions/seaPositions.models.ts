import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace SeaPositionsModels {
/** 
 * SeaPositionResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } bookingMatchingCode  
 * @property { string } houseBillOfLadingNumber  
 * @property { string } masterBillOfLadingNumber  
 * @property { boolean } hblRequired  
 * @property { boolean } mblRequired  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { string } buyServiceContract  
 * @property { string } sellServiceContract  
 * @property { string } quoteReference  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { CommonModels.SeaRoutingEnum } routing  
 * @property { string } defaultBookingNumber Default booking number from the port of loading point of the default route 
 */
export const SeaPositionResponseDTOSchema = z.object({ id: z.string(), bookingMatchingCode: z.string().nullish(), houseBillOfLadingNumber: z.string().nullish(), masterBillOfLadingNumber: z.string().nullish(), hblRequired: z.boolean(), mblRequired: z.boolean(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullish(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullish(), customsDate: z.iso.datetime({ offset: true }).nullish(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullish(), buyServiceContract: z.string().nullish(), sellServiceContract: z.string().nullish(), quoteReference: z.string().nullish(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), routing: CommonModels.SeaRoutingEnumSchema.nullish(), defaultBookingNumber: z.string().nullish() });
export type SeaPositionResponseDTO = z.infer<typeof SeaPositionResponseDTOSchema>;

/** 
 * UpdateSeaPositionRequestDTOSchema 
 * @type { object }
 * @property { string } bookingMatchingCode  
 * @property { string } houseBillOfLadingNumber  
 * @property { boolean } mblRequired  
 * @property { boolean } hblRequired  
 * @property { string } masterBillOfLadingNumber  
 * @property { string } blfromCostumerDate  
 * @property { string } blfromCarrierDate  
 * @property { string } customsDate  
 * @property { string } vgmCustomerDate  
 * @property { string } buyServiceContract  
 * @property { string } quoteReference  
 * @property { string } sellServiceContract  
 * @property { CommonModels.SeaRoutingEnum } routing  
 */
export const UpdateSeaPositionRequestDTOSchema = z.object({ bookingMatchingCode: z.string().nullable(), houseBillOfLadingNumber: z.string().nullable(), mblRequired: z.boolean().nullable(), hblRequired: z.boolean().nullable(), masterBillOfLadingNumber: z.string().nullable(), blfromCostumerDate: z.iso.datetime({ offset: true }).nullable(), blfromCarrierDate: z.iso.datetime({ offset: true }).nullable(), customsDate: z.iso.datetime({ offset: true }).nullable(), vgmCustomerDate: z.iso.datetime({ offset: true }).nullable(), buyServiceContract: z.string().nullable(), quoteReference: z.string().nullable(), sellServiceContract: z.string().nullable(), routing: CommonModels.SeaRoutingEnumSchema.nullable() }).partial();
export type UpdateSeaPositionRequestDTO = z.infer<typeof UpdateSeaPositionRequestDTOSchema>;

}
