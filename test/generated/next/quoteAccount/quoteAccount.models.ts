import { z } from "zod";

export namespace QuoteAccountModels {
/** 
 * QuoteAccountItemTypeEnumSchema 
 * @type { enum }
 */
export const QuoteAccountItemTypeEnumSchema = z.enum(["CHARGE", "TEXT", "DIVIDER"]);
export type QuoteAccountItemTypeEnum = z.infer<typeof QuoteAccountItemTypeEnumSchema>;
export const QuoteAccountItemTypeEnum = QuoteAccountItemTypeEnumSchema.enum;

/** 
 * QuoteChargeDtoResponseSchema 
 * @type { object }
 * @property { object } chargeType  
 * @property { string } chargeType.id  
 * @property { string } chargeType.name  
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { object } buyVatRule  
 * @property { string } buyVatRule.id  
 * @property { string } buyVatRule.name  
 * @property { string } buyVatRule.matchcode  
 * @property { string } buyVatRule.printCode  
 * @property { object } vendor  
 * @property { string } vendor.id  
 * @property { string } vendor.name  
 * @property { string } vendor.matchCode  
 * @property { string } vendor.label  
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { object } sellVatRule  
 * @property { string } sellVatRule.id  
 * @property { string } sellVatRule.name  
 * @property { string } sellVatRule.matchcode  
 * @property { string } sellVatRule.printCode  
 * @property { object } customer  
 * @property { string } customer.id  
 * @property { string } customer.name  
 * @property { string } customer.matchCode  
 * @property { string } customer.label  
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 * @property { number } profit Profit amount 
 */
export const QuoteChargeDtoResponseSchema = z.object({ chargeType: z.object({ id: z.string(), name: z.string() }), additionalText: z.string(), quantity: z.number().nullish(), buyRate: z.number().nullish(), buyCurrencyCode: z.string(), buyVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() }), vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }), buyExchangeRate: z.number().nullish(), sellRate: z.number().nullish(), sellCurrencyCode: z.string(), sellVatRule: z.object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() }), customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }), sellExchangeRate: z.number().nullish(), profit: z.number().nullish() });
export type QuoteChargeDtoResponse = z.infer<typeof QuoteChargeDtoResponseSchema>;

/** 
 * QuoteTextDtoResponseSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const QuoteTextDtoResponseSchema = z.object({ content: z.string() });
export type QuoteTextDtoResponse = z.infer<typeof QuoteTextDtoResponseSchema>;

/** 
 * QuoteAccountItemDtoResponseSchema 
 * @type { object }
 * @property { string } id Item ID 
 * @property { QuoteAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { QuoteChargeDtoResponse } charge Charge data if type is CHARGE 
 * @property { QuoteTextDtoResponse } text Text data if type is TEXT 
 */
export const QuoteAccountItemDtoResponseSchema = z.object({ id: z.string(), type: QuoteAccountItemTypeEnumSchema, orderPosition: z.number(), charge: QuoteChargeDtoResponseSchema.nullish(), text: QuoteTextDtoResponseSchema.nullish() });
export type QuoteAccountItemDtoResponse = z.infer<typeof QuoteAccountItemDtoResponseSchema>;

/** 
 * QuoteAccountResponseDtoSchema 
 * @type { object }
 * @property { string } id Account ID 
 * @property { string } quoteId Quote ID 
 * @property { QuoteAccountItemDtoResponse[] } items Account items 
 * @property { object } totals Account totals 
 * @property { number } totals.totalBuyRates  
 * @property { number } totals.totalSellRates  
 * @property { number } totals.totalProfit  
 * @property { number } totals.displayAmount  
 * @property { string } totals.displayCurrencyCode  
 * @property { object[] } totalsPerCurrency Account totals per currency 
 * @property { number } totalsPerCurrency.[0].totalBuyRates  
 * @property { number } totalsPerCurrency.[0].totalSellRates  
 * @property { number } totalsPerCurrency.[0].totalProfit  
 * @property { number } totalsPerCurrency.[0].displayAmount  
 * @property { string } totalsPerCurrency.[0].displayCurrencyCode  
 */
export const QuoteAccountResponseDtoSchema = z.object({ id: z.string(), quoteId: z.string(), items: z.array(QuoteAccountItemDtoResponseSchema), totals: z.object({ totalBuyRates: z.number().nullable(), totalSellRates: z.number().nullable(), totalProfit: z.number().nullable(), displayAmount: z.number().nullable(), displayCurrencyCode: z.string().nullable() }).partial(), totalsPerCurrency: z.array(z.object({ totalBuyRates: z.number().nullable(), totalSellRates: z.number().nullable(), totalProfit: z.number().nullable(), displayAmount: z.number().nullable(), displayCurrencyCode: z.string().nullable() }).partial()) });
export type QuoteAccountResponseDto = z.infer<typeof QuoteAccountResponseDtoSchema>;

/** 
 * CreateQuoteChargeDataDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1`. Default: `1` 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code. Default: `EUR` 
 * @property { string } buyVatRuleId Buy VAT rule ID 
 * @property { string } vendorId Vendor ID 
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code. Default: `EUR` 
 * @property { string } sellVatRuleId Sell VAT rule ID 
 * @property { string } customerId Customer ID 
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 */
export const CreateQuoteChargeDataDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable().default(1), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable().default("EUR"), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable().default("EUR"), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type CreateQuoteChargeDataDto = z.infer<typeof CreateQuoteChargeDataDtoSchema>;

/** 
 * CreateQuoteTextDataDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const CreateQuoteTextDataDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type CreateQuoteTextDataDto = z.infer<typeof CreateQuoteTextDataDtoSchema>;

/** 
 * CreateQuoteAccountItemRequestDtoSchema 
 * @type { object }
 * @property { QuoteAccountItemTypeEnum } type Item type 
 * @property { number } orderPosition Order position of the item 
 * @property { CreateQuoteChargeDataDto } charge Charge data if type is CHARGE 
 * @property { CreateQuoteTextDataDto } text Text data if type is TEXT 
 */
export const CreateQuoteAccountItemRequestDtoSchema = z.object({ type: QuoteAccountItemTypeEnumSchema, orderPosition: z.number().nullish(), charge: CreateQuoteChargeDataDtoSchema.nullish(), text: CreateQuoteTextDataDtoSchema.nullish() });
export type CreateQuoteAccountItemRequestDto = z.infer<typeof CreateQuoteAccountItemRequestDtoSchema>;

/** 
 * UpdateQuoteChargeDataDtoSchema 
 * @type { object }
 * @property { string } chargeTypeId Charge type ID 
 * @property { string } additionalText Additional text for the charge 
 * @property { number } quantity Quantity of the charge. Minimum: `1` 
 * @property { number } buyRate Buy rate amount 
 * @property { string } buyCurrencyCode Buy rate currency code 
 * @property { string } buyVatRuleId Buy VAT rule ID 
 * @property { string } vendorId Vendor ID 
 * @property { number } buyExchangeRate Buy exchange rate with up to 4 decimal places accuracy 
 * @property { number } sellRate Sell rate amount 
 * @property { string } sellCurrencyCode Sell rate currency code 
 * @property { string } sellVatRuleId Sell VAT rule ID 
 * @property { string } customerId Customer ID 
 * @property { number } sellExchangeRate Sell exchange rate with up to 4 decimal places accuracy 
 */
export const UpdateQuoteChargeDataDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type UpdateQuoteChargeDataDto = z.infer<typeof UpdateQuoteChargeDataDtoSchema>;

/** 
 * UpdateQuoteTextDataDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const UpdateQuoteTextDataDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type UpdateQuoteTextDataDto = z.infer<typeof UpdateQuoteTextDataDtoSchema>;

/** 
 * UpdateQuoteAccountItemRequestDtoSchema 
 * @type { object }
 * @property { number } orderPosition Order position of the item 
 * @property { UpdateQuoteChargeDataDto } charge Charge data if type is CHARGE 
 * @property { UpdateQuoteTextDataDto } text Text data if type is TEXT 
 */
export const UpdateQuoteAccountItemRequestDtoSchema = z.object({ orderPosition: z.number().nullable(), charge: UpdateQuoteChargeDataDtoSchema.nullable(), text: UpdateQuoteTextDataDtoSchema.nullable() }).partial();
export type UpdateQuoteAccountItemRequestDto = z.infer<typeof UpdateQuoteAccountItemRequestDtoSchema>;

}
