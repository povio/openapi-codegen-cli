import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PositionAccountItemsModels {
/** 
 * CreatePositionChargeDataRequestDtoSchema 
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
export const CreatePositionChargeDataRequestDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type CreatePositionChargeDataRequestDto = z.infer<typeof CreatePositionChargeDataRequestDtoSchema>;

/** 
 * CreatePositionTextDataRequestDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const CreatePositionTextDataRequestDtoSchema = z.object({ content: z.string().nullable() }).partial();
export type CreatePositionTextDataRequestDto = z.infer<typeof CreatePositionTextDataRequestDtoSchema>;

/** 
 * CreatePositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { CommonModels.PositionAccountItemTypeEnum } type Item type 
 * @property { CreatePositionChargeDataRequestDto } charge Charge data if type is CHARGE 
 * @property { CreatePositionTextDataRequestDto } text Text data if type is TEXT 
 */
export const CreatePositionAccountItemRequestDtoSchema = z.object({ type: CommonModels.PositionAccountItemTypeEnumSchema, charge: CreatePositionChargeDataRequestDtoSchema.nullish(), text: CreatePositionTextDataRequestDtoSchema.nullish() });
export type CreatePositionAccountItemRequestDto = z.infer<typeof CreatePositionAccountItemRequestDtoSchema>;

/** 
 * CreatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { CreatePositionAccountItemRequestDto[] } items Array of items to create. All items in a single request must be of the same type (CHARGE, TEXT, or DIVIDER) 
 */
export const CreatePositionAccountItemsRequestDtoSchema = z.object({ items: z.array(CreatePositionAccountItemRequestDtoSchema) });
export type CreatePositionAccountItemsRequestDto = z.infer<typeof CreatePositionAccountItemsRequestDtoSchema>;

/** 
 * UpdatePositionChargeDataRequestDtoSchema 
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
export const UpdatePositionChargeDataRequestDtoSchema = z.object({ chargeTypeId: z.string().nullable(), additionalText: z.string().nullable(), quantity: z.number().gte(1).nullable(), buyRate: z.number().nullable(), buyCurrencyCode: z.string().nullable(), buyVatRuleId: z.string().nullable(), vendorId: z.string().nullable(), buyExchangeRate: z.number().nullable(), sellRate: z.number().nullable(), sellCurrencyCode: z.string().nullable(), sellVatRuleId: z.string().nullable(), customerId: z.string().nullable(), sellExchangeRate: z.number().nullable() }).partial();
export type UpdatePositionChargeDataRequestDto = z.infer<typeof UpdatePositionChargeDataRequestDtoSchema>;

/** 
 * UpdatePositionTextDataRequestDtoSchema 
 * @type { object }
 * @property { string } content Text content 
 */
export const UpdatePositionTextDataRequestDtoSchema = z.object({ content: z.string() });
export type UpdatePositionTextDataRequestDto = z.infer<typeof UpdatePositionTextDataRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { CommonModels.PositionAccountItemTypeEnum } type Item type 
 * @property { UpdatePositionChargeDataRequestDto } charge Charge data if type is CHARGE 
 * @property { UpdatePositionTextDataRequestDto } text Text data if type is TEXT 
 */
export const UpdatePositionAccountItemRequestDtoSchema = z.object({ type: CommonModels.PositionAccountItemTypeEnumSchema, charge: UpdatePositionChargeDataRequestDtoSchema.nullish(), text: UpdatePositionTextDataRequestDtoSchema.nullish() });
export type UpdatePositionAccountItemRequestDto = z.infer<typeof UpdatePositionAccountItemRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemWithIdRequestDtoSchema 
 * @type { object }
 * @property { string } id ID of the item to update 
 * @property { UpdatePositionAccountItemRequestDto } data Data to update 
 */
export const UpdatePositionAccountItemWithIdRequestDtoSchema = z.object({ id: z.string(), data: UpdatePositionAccountItemRequestDtoSchema });
export type UpdatePositionAccountItemWithIdRequestDto = z.infer<typeof UpdatePositionAccountItemWithIdRequestDtoSchema>;

/** 
 * UpdatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { UpdatePositionAccountItemWithIdRequestDto[] } items Array of items to update 
 */
export const UpdatePositionAccountItemsRequestDtoSchema = z.object({ items: z.array(UpdatePositionAccountItemWithIdRequestDtoSchema) });
export type UpdatePositionAccountItemsRequestDto = z.infer<typeof UpdatePositionAccountItemsRequestDtoSchema>;

/** 
 * DeletePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to delete 
 */
export const DeletePositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()) });
export type DeletePositionAccountItemsRequestDto = z.infer<typeof DeletePositionAccountItemsRequestDtoSchema>;

/** 
 * DuplicatePositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to duplicate 
 */
export const DuplicatePositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()) });
export type DuplicatePositionAccountItemsRequestDto = z.infer<typeof DuplicatePositionAccountItemsRequestDtoSchema>;

/** 
 * ReassignPositionAccountItemsRequestDtoSchema 
 * @type { object }
 * @property { string[] } ids Array of item IDs to reassign 
 * @property { string } targetPositionId Target position ID to reassign items to 
 */
export const ReassignPositionAccountItemsRequestDtoSchema = z.object({ ids: z.array(z.string()), targetPositionId: z.string() });
export type ReassignPositionAccountItemsRequestDto = z.infer<typeof ReassignPositionAccountItemsRequestDtoSchema>;

/** 
 * ReorderPositionAccountItemRequestDtoSchema 
 * @type { object }
 * @property { number } orderPosition New order position for the item 
 */
export const ReorderPositionAccountItemRequestDtoSchema = z.object({ orderPosition: z.number() });
export type ReorderPositionAccountItemRequestDto = z.infer<typeof ReorderPositionAccountItemRequestDtoSchema>;

/** 
 * PositionAccountItemsCreateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsCreateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsCreateResponse = z.infer<typeof PositionAccountItemsCreateResponseSchema>;

/** 
 * PositionAccountItemsUpdateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsUpdateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsUpdateResponse = z.infer<typeof PositionAccountItemsUpdateResponseSchema>;

/** 
 * PositionAccountItemsDuplicateResponseSchema 
 * @type { array }
 */
export const PositionAccountItemsDuplicateResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type PositionAccountItemsDuplicateResponse = z.infer<typeof PositionAccountItemsDuplicateResponseSchema>;

/** 
 * ReassignResponseSchema 
 * @type { array }
 */
export const ReassignResponseSchema = z.array(CommonModels.PositionAccountItemDtoResponseSchema);
export type ReassignResponse = z.infer<typeof ReassignResponseSchema>;

}
