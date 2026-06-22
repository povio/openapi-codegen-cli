import { z } from "zod";

export namespace FactoringExportModels {
/** 
 * FactoringExportBatchStatusEnumSchema 
 * @type { enum }
 */
export const FactoringExportBatchStatusEnumSchema = z.enum(["Initializing", "Preparing", "Exported", "Failed"]);
export type FactoringExportBatchStatusEnum = z.infer<typeof FactoringExportBatchStatusEnumSchema>;
export const FactoringExportBatchStatusEnum = FactoringExportBatchStatusEnumSchema.enum;

/** 
 * FactoringExportBatchResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } officeId  
 * @property { FactoringExportBatchStatusEnum } status  
 * @property { number } totalInvoices  
 * @property { number } totalAmount  
 * @property { string } currencyNotation  
 * @property { string } jobId  
 * @property { string } eurFileUrl  
 * @property { string } usdFileUrl  
 * @property { string } createdById  
 * @property { string } createdAt  
 * @property { string } updatedAt  
 * @property { string } exportedAt  
 */
export const FactoringExportBatchResponseDtoSchema = z.object({ id: z.string(), officeId: z.string(), status: FactoringExportBatchStatusEnumSchema, totalInvoices: z.number(), totalAmount: z.number(), currencyNotation: z.string(), jobId: z.string().nullish(), eurFileUrl: z.string().nullish(), usdFileUrl: z.string().nullish(), createdById: z.string(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), exportedAt: z.iso.datetime({ offset: true }).nullish() });
export type FactoringExportBatchResponseDto = z.infer<typeof FactoringExportBatchResponseDtoSchema>;

/** 
 * CreateFactoringExportRequestDtoSchema 
 * @type { object }
 * @property { string } invoiceDateFrom Invoice date from 
 * @property { string } invoiceDateUntil Invoice date until 
 */
export const CreateFactoringExportRequestDtoSchema = z.object({ invoiceDateFrom: z.iso.datetime({ offset: true }), invoiceDateUntil: z.iso.datetime({ offset: true }) });
export type CreateFactoringExportRequestDto = z.infer<typeof CreateFactoringExportRequestDtoSchema>;

}
