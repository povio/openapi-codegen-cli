import { z } from "zod";

export namespace QuoteConversionModels {
/** 
 * ConvertQuoteToPositionRequestDtoSchema 
 * @type { object }
 * @property { string } estimatedServiceDate  
 */
export const ConvertQuoteToPositionRequestDtoSchema = z.object({ estimatedServiceDate: z.iso.datetime({ offset: true }) });
export type ConvertQuoteToPositionRequestDto = z.infer<typeof ConvertQuoteToPositionRequestDtoSchema>;

}
