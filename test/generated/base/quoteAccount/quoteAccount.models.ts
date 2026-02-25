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
  export const QuoteChargeDtoResponseSchema = z
    .object({
      chargeType: z.object({ id: z.string(), name: z.string() }).readonly(),
      additionalText: z.string().describe("Additional text for the charge"),
      quantity: z.number().describe("Quantity of the charge").nullish(),
      buyRate: z.number().describe("Buy rate amount").nullish(),
      buyCurrencyCode: z.string().describe("Buy rate currency code"),
      buyVatRule: z
        .object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() })
        .readonly(),
      vendor: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }).readonly(),
      buyExchangeRate: z.number().describe("Buy exchange rate with up to 4 decimal places accuracy").nullish(),
      sellRate: z.number().describe("Sell rate amount").nullish(),
      sellCurrencyCode: z.string().describe("Sell rate currency code"),
      sellVatRule: z
        .object({ id: z.string(), name: z.string(), matchcode: z.string(), printCode: z.string().nullish() })
        .readonly(),
      customer: z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() }).readonly(),
      sellExchangeRate: z.number().describe("Sell exchange rate with up to 4 decimal places accuracy").nullish(),
      profit: z.number().describe("Profit amount").nullish(),
    })
    .readonly();
  export type QuoteChargeDtoResponse = z.infer<typeof QuoteChargeDtoResponseSchema>;

  /**
   * QuoteTextDtoResponseSchema
   * @type { object }
   * @property { string } content Text content
   */
  export const QuoteTextDtoResponseSchema = z.object({ content: z.string().describe("Text content") }).readonly();
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
  export const QuoteAccountItemDtoResponseSchema = z
    .object({
      id: z.string().describe("Item ID"),
      type: QuoteAccountItemTypeEnumSchema.describe("Item type"),
      orderPosition: z.number().describe("Order position of the item"),
      charge: QuoteChargeDtoResponseSchema.describe("Charge data if type is CHARGE").nullish(),
      text: QuoteTextDtoResponseSchema.describe("Text data if type is TEXT").nullish(),
    })
    .readonly();
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
  export const QuoteAccountResponseDtoSchema = z
    .object({
      id: z.string().describe("Account ID"),
      quoteId: z.string().describe("Quote ID"),
      items: z.array(QuoteAccountItemDtoResponseSchema).readonly().describe("Account items"),
      totals: z
        .object({
          totalBuyRates: z.number(),
          totalSellRates: z.number(),
          totalProfit: z.number(),
          displayAmount: z.number(),
          displayCurrencyCode: z.string(),
        })
        .readonly()
        .describe("Account totals"),
      totalsPerCurrency: z
        .array(
          z
            .object({
              totalBuyRates: z.number(),
              totalSellRates: z.number(),
              totalProfit: z.number(),
              displayAmount: z.number(),
              displayCurrencyCode: z.string(),
            })
            .readonly(),
        )
        .readonly()
        .describe("Account totals per currency"),
    })
    .readonly();
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
  export const CreateQuoteChargeDataDtoSchema = z
    .object({
      chargeTypeId: z.string().describe("Charge type ID"),
      additionalText: z.string().describe("Additional text for the charge"),
      quantity: z.number().gte(1).describe("Quantity of the charge").default(1),
      buyRate: z.number().describe("Buy rate amount"),
      buyCurrencyCode: z.string().describe("Buy rate currency code").default("EUR"),
      buyVatRuleId: z.string().describe("Buy VAT rule ID"),
      vendorId: z.string().describe("Vendor ID"),
      buyExchangeRate: z.number().describe("Buy exchange rate with up to 4 decimal places accuracy"),
      sellRate: z.number().describe("Sell rate amount"),
      sellCurrencyCode: z.string().describe("Sell rate currency code").default("EUR"),
      sellVatRuleId: z.string().describe("Sell VAT rule ID"),
      customerId: z.string().describe("Customer ID"),
      sellExchangeRate: z.number().describe("Sell exchange rate with up to 4 decimal places accuracy"),
    })
    .readonly();
  export type CreateQuoteChargeDataDto = z.infer<typeof CreateQuoteChargeDataDtoSchema>;

  /**
   * CreateQuoteTextDataDtoSchema
   * @type { object }
   * @property { string } content Text content
   */
  export const CreateQuoteTextDataDtoSchema = z.object({ content: z.string().describe("Text content") }).readonly();
  export type CreateQuoteTextDataDto = z.infer<typeof CreateQuoteTextDataDtoSchema>;

  /**
   * CreateQuoteAccountItemRequestDtoSchema
   * @type { object }
   * @property { QuoteAccountItemTypeEnum } type Item type
   * @property { number } orderPosition Order position of the item
   * @property { CreateQuoteChargeDataDto } charge Charge data if type is CHARGE
   * @property { CreateQuoteTextDataDto } text Text data if type is TEXT
   */
  export const CreateQuoteAccountItemRequestDtoSchema = z
    .object({
      type: QuoteAccountItemTypeEnumSchema.describe("Item type"),
      orderPosition: z.number().describe("Order position of the item").nullish(),
      charge: CreateQuoteChargeDataDtoSchema.describe("Charge data if type is CHARGE").nullish(),
      text: CreateQuoteTextDataDtoSchema.describe("Text data if type is TEXT").nullish(),
    })
    .readonly();
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
  export const UpdateQuoteChargeDataDtoSchema = z
    .object({
      chargeTypeId: z.string().describe("Charge type ID"),
      additionalText: z.string().describe("Additional text for the charge"),
      quantity: z.number().gte(1).describe("Quantity of the charge"),
      buyRate: z.number().describe("Buy rate amount").nullable(),
      buyCurrencyCode: z.string().describe("Buy rate currency code"),
      buyVatRuleId: z.string().describe("Buy VAT rule ID").nullable(),
      vendorId: z.string().describe("Vendor ID").nullable(),
      buyExchangeRate: z.number().describe("Buy exchange rate with up to 4 decimal places accuracy"),
      sellRate: z.number().describe("Sell rate amount").nullable(),
      sellCurrencyCode: z.string().describe("Sell rate currency code"),
      sellVatRuleId: z.string().describe("Sell VAT rule ID").nullable(),
      customerId: z.string().describe("Customer ID").nullable(),
      sellExchangeRate: z.number().describe("Sell exchange rate with up to 4 decimal places accuracy"),
    })
    .readonly();
  export type UpdateQuoteChargeDataDto = z.infer<typeof UpdateQuoteChargeDataDtoSchema>;

  /**
   * UpdateQuoteTextDataDtoSchema
   * @type { object }
   * @property { string } content Text content
   */
  export const UpdateQuoteTextDataDtoSchema = z.object({ content: z.string().describe("Text content") }).readonly();
  export type UpdateQuoteTextDataDto = z.infer<typeof UpdateQuoteTextDataDtoSchema>;

  /**
   * UpdateQuoteAccountItemRequestDtoSchema
   * @type { object }
   * @property { number } orderPosition Order position of the item
   * @property { UpdateQuoteChargeDataDto } charge Charge data if type is CHARGE
   * @property { UpdateQuoteTextDataDto } text Text data if type is TEXT
   */
  export const UpdateQuoteAccountItemRequestDtoSchema = z
    .object({
      orderPosition: z.number().describe("Order position of the item"),
      charge: UpdateQuoteChargeDataDtoSchema.describe("Charge data if type is CHARGE"),
      text: UpdateQuoteTextDataDtoSchema.describe("Text data if type is TEXT"),
    })
    .readonly();
  export type UpdateQuoteAccountItemRequestDto = z.infer<typeof UpdateQuoteAccountItemRequestDtoSchema>;
}
