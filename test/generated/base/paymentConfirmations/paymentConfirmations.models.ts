import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PaymentConfirmationsModels {
/** 
 * PaymentConfirmationPositionDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } number  
 */
export const PaymentConfirmationPositionDtoSchema = z.object({ id: z.string(), number: z.string() });
export type PaymentConfirmationPositionDto = z.infer<typeof PaymentConfirmationPositionDtoSchema>;

/** 
 * PaymentConfirmationItemDtoSchema 
 * @type { object }
 * @property { string } invoiceId Invoice ID 
 * @property { string } invoiceNumber Invoice number 
 * @property { string } invoiceDate Invoice date 
 * @property { number } invoiceAmount Invoice amount 
 * @property { number } amount Payment amount 
 * @property { string } currencyNotation Currency notation 
 * @property { string } reference Reference 
 * @property { PaymentConfirmationPositionDto } position Position information 
 * @property { string } paymentDate Payment date 
 */
export const PaymentConfirmationItemDtoSchema = z.object({ invoiceId: z.string(), invoiceNumber: z.string(), invoiceDate: z.iso.datetime({ offset: true }), invoiceAmount: z.number(), amount: z.number(), currencyNotation: z.string(), reference: z.string().nullish(), position: PaymentConfirmationPositionDtoSchema, paymentDate: z.iso.datetime({ offset: true }) });
export type PaymentConfirmationItemDto = z.infer<typeof PaymentConfirmationItemDtoSchema>;

/** 
 * PaymentConfirmationItemFilterDtoSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner ID 
 * @property { string } paymentDate Payment date 
 */
export const PaymentConfirmationItemFilterDtoSchema = z.object({ businessPartnerId: z.string(), paymentDate: z.iso.datetime({ offset: true }) });
export type PaymentConfirmationItemFilterDto = z.infer<typeof PaymentConfirmationItemFilterDtoSchema>;

/** 
 * GeneratePaymentConfirmationRequestDtoSchema 
 * @type { object }
 * @property { string } businessPartnerId Business partner ID 
 * @property { string } paymentDate Payment date 
 * @property { string } positionId Position ID (optional) 
 */
export const GeneratePaymentConfirmationRequestDtoSchema = z.object({ businessPartnerId: z.string(), paymentDate: z.iso.datetime({ offset: true }), positionId: z.string().nullish() });
export type GeneratePaymentConfirmationRequestDto = z.infer<typeof GeneratePaymentConfirmationRequestDtoSchema>;

/** 
 * PaymentConfirmationsGetOrderParamEnumSchema 
 * @type { enum }
 */
export const PaymentConfirmationsGetOrderParamEnumSchema = z.enum(["paymentDate", "invoiceNumber", "amount"]);
export type PaymentConfirmationsGetOrderParamEnum = z.infer<typeof PaymentConfirmationsGetOrderParamEnumSchema>;
export const PaymentConfirmationsGetOrderParamEnum = PaymentConfirmationsGetOrderParamEnumSchema.enum;

/** 
 * PaymentConfirmationsGetResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PaymentConfirmationItemDto[] } items  
 */
export const PaymentConfirmationsGetResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PaymentConfirmationItemDtoSchema).nullable() }).partial().shape });
export type PaymentConfirmationsGetResponse = z.infer<typeof PaymentConfirmationsGetResponseSchema>;

}
