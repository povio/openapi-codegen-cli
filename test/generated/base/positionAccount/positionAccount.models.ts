import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionAccountModels {
/** 
 * PositionAccountTotalsResponseDtoSchema 
 * @type { object }
 * @property { number } totalBuyRates Total buy rates 
 * @property { number } totalSellRates Total sell rates 
 * @property { number } totalProfit Total profit 
 * @property { number } margin Margin percentage 
 * @property { number } displayAmount Display amount 
 * @property { string } displayCurrencyCode Display currency code 
 */
export const PositionAccountTotalsResponseDtoSchema = z.object({ totalBuyRates: z.number(), totalSellRates: z.number(), totalProfit: z.number(), margin: z.number().nullish(), displayAmount: z.number(), displayCurrencyCode: z.string() });
export type PositionAccountTotalsResponseDto = z.infer<typeof PositionAccountTotalsResponseDtoSchema>;

/** 
 * PositionAccountMasterTotalsDtoSchema 
 * @type { object }
 * @property { PositionAccountTotalsResponseDto } totals  
 * @property { PositionAccountTotalsResponseDto[] } totalsPerCurrency  
 */
export const PositionAccountMasterTotalsDtoSchema = z.object({ totals: PositionAccountTotalsResponseDtoSchema, totalsPerCurrency: z.array(PositionAccountTotalsResponseDtoSchema) });
export type PositionAccountMasterTotalsDto = z.infer<typeof PositionAccountMasterTotalsDtoSchema>;

/** 
 * ChildPositionAccountReferenceDtoSchema 
 * @type { object }
 * @property { string } positionId  
 * @property { string } positionNumber  
 * @property { string } accountId  
 */
export const ChildPositionAccountReferenceDtoSchema = z.object({ positionId: z.string().nullish(), positionNumber: z.string(), accountId: z.string() });
export type ChildPositionAccountReferenceDto = z.infer<typeof ChildPositionAccountReferenceDtoSchema>;

/** 
 * PositionAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id Account ID 
 * @property { string } positionId Position ID 
 * @property { string } invoiceId Invoice ID 
 * @property { CommonModels.PositionAccountItemDtoResponse[] } items Account items 
 * @property { PositionAccountTotalsResponseDto } totals  
 * @property { PositionAccountTotalsResponseDto[] } totalsPerCurrency  
 * @property { PositionAccountMasterTotalsDto } masterTotals  
 * @property { ChildPositionAccountReferenceDto[] } childPositionAccounts  
 */
export const PositionAccountResponseDtoSchema = z.object({ id: z.string(), positionId: z.string().nullish(), invoiceId: z.string().nullish(), items: z.array(CommonModels.PositionAccountItemDtoResponseSchema), totals: PositionAccountTotalsResponseDtoSchema, totalsPerCurrency: z.array(PositionAccountTotalsResponseDtoSchema), masterTotals: PositionAccountMasterTotalsDtoSchema.nullish(), childPositionAccounts: z.array(ChildPositionAccountReferenceDtoSchema).nullish() });
export type PositionAccountResponseDto = z.infer<typeof PositionAccountResponseDtoSchema>;

}
