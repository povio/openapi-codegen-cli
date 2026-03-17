import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningManagementModels {
/** 
 * DunningPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } matchCode  
 * @property { string } label Display label: matchCode when office.usePartnerMatchCodes, else name 
 */
export const DunningPartnerDtoSchema = z.object({ id: z.string(), name: z.string(), matchCode: z.string(), label: z.string() });
export type DunningPartnerDto = z.infer<typeof DunningPartnerDtoSchema>;

/** 
 * DunningConfirmedByDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningConfirmedByDtoSchema = z.object({ id: z.string(), name: z.string() });
export type DunningConfirmedByDto = z.infer<typeof DunningConfirmedByDtoSchema>;

/** 
 * DunningStatusSchema 
 * @type { enum }
 */
export const DunningStatusSchema = z.enum(["PREPARED", "ISSUED"]);
export type DunningStatus = z.infer<typeof DunningStatusSchema>;
export const DunningStatus = DunningStatusSchema.enum;

/** 
 * DunningResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { DunningPartnerDto } partner  
 * @property { number } level  
 * @property { string } dunningLevelId  
 * @property { string } status  
 * @property { number } invoiceCount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 * @property { number } daysOverdue  
 * @property { number } dunningFee  
 * @property { string } createdAt  
 * @property { string } statusChangedOn  
 * @property { DunningConfirmedByDto } confirmedBy  
 * @property { string } documentUrl  
 */
export const DunningResponseDtoSchema = z.object({ id: z.string(), partner: DunningPartnerDtoSchema, level: z.number(), dunningLevelId: z.string().nullish(), status: DunningStatusSchema, invoiceCount: z.number(), outstandingAmount: z.number(), currencyNotation: z.string(), daysOverdue: z.number(), dunningFee: z.number(), createdAt: z.iso.datetime({ offset: true }), statusChangedOn: z.iso.datetime({ offset: true }), confirmedBy: DunningConfirmedByDtoSchema.nullish(), documentUrl: z.string().nullish() });
export type DunningResponseDto = z.infer<typeof DunningResponseDtoSchema>;

/** 
 * DunningFilterDtoSchema 
 * @type { object }
 * @property { DunningStatus[] } status  
 * @property { string } partnerId Partner ID to filter by 
 * @property { array[] } level Dunning level(s) to filter by 
 * @property { number } outstandingAmountMin Minimum outstanding amount 
 * @property { number } outstandingAmountMax Maximum outstanding amount 
 * @property { string } createdFrom Created from (ISO date string) 
 * @property { string } createdTo Created to (ISO date string) 
 * @property { string } confirmedBy Confirmed by employee ID 
 */
export const DunningFilterDtoSchema = z.object({ status: z.array(DunningStatusSchema).nullable(), partnerId: z.string().nullable(), level: z.array(z.array(z.any())).nullable(), outstandingAmountMin: z.number().nullable(), outstandingAmountMax: z.number().nullable(), createdFrom: z.iso.datetime({ offset: true }).nullable(), createdTo: z.iso.datetime({ offset: true }).nullable(), confirmedBy: z.string().nullable() }).partial();
export type DunningFilterDto = z.infer<typeof DunningFilterDtoSchema>;

/** 
 * DunningPdfConfigDTOSchema 
 * @type { object }
 * @property { string } headerImageUrl  
 * @property { string } footerImageUrl  
 * @property { boolean } showWatermarkOnDocuments  
 * @property { CommonModels.LocaleEnum } locale  
 */
export const DunningPdfConfigDTOSchema = z.object({ headerImageUrl: z.string(), footerImageUrl: z.string(), showWatermarkOnDocuments: z.boolean(), locale: CommonModels.LocaleEnumSchema.nullish() });
export type DunningPdfConfigDTO = z.infer<typeof DunningPdfConfigDTOSchema>;

/** 
 * DunningPdfBusinessPartnerDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } address  
 * @property { string } referenceNumber  
 */
export const DunningPdfBusinessPartnerDTOSchema = z.object({ id: z.string(), name: z.string(), address: z.string(), referenceNumber: z.string().nullish() });
export type DunningPdfBusinessPartnerDTO = z.infer<typeof DunningPdfBusinessPartnerDTOSchema>;

/** 
 * DunningPdfInvoiceDTOSchema 
 * @type { object }
 * @property { string } invoiceNumber  
 * @property { string } issuingDate  
 * @property { string } dueDate  
 * @property { number } daysOverdue  
 * @property { number } dunningLevel  
 * @property { number } invoiceAmount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 * @property { number } interest  
 */
export const DunningPdfInvoiceDTOSchema = z.object({ invoiceNumber: z.string(), issuingDate: z.iso.datetime({ offset: true }), dueDate: z.iso.datetime({ offset: true }).nullish(), daysOverdue: z.number(), dunningLevel: z.number(), invoiceAmount: z.number(), outstandingAmount: z.number(), currencyNotation: z.string(), interest: z.number().nullish() });
export type DunningPdfInvoiceDTO = z.infer<typeof DunningPdfInvoiceDTOSchema>;

/** 
 * DunningPdfTotalDTOSchema 
 * @type { object }
 * @property { number } invoicesSum  
 * @property { number } dunningFee  
 * @property { number } interest  
 * @property { string } currencyNotation  
 */
export const DunningPdfTotalDTOSchema = z.object({ invoicesSum: z.number(), dunningFee: z.number(), interest: z.number(), currencyNotation: z.string() });
export type DunningPdfTotalDTO = z.infer<typeof DunningPdfTotalDTOSchema>;

/** 
 * DunningPdfBankAccountDTOSchema 
 * @type { object }
 * @property { string } displayValue  
 * @property { string } iban  
 * @property { string } bankName  
 * @property { string } swiftBic  
 */
export const DunningPdfBankAccountDTOSchema = z.object({ displayValue: z.string(), iban: z.string(), bankName: z.string(), swiftBic: z.string() });
export type DunningPdfBankAccountDTO = z.infer<typeof DunningPdfBankAccountDTOSchema>;

/** 
 * DunningPdfUpcomingInvoiceDTOSchema 
 * @type { object }
 * @property { string } number  
 * @property { string } issuingDate  
 * @property { string } dueDate  
 * @property { number } dueDays  
 * @property { number } invoiceAmount  
 * @property { number } outstandingAmount  
 * @property { string } currencyNotation  
 */
export const DunningPdfUpcomingInvoiceDTOSchema = z.object({ number: z.string(), issuingDate: z.iso.datetime({ offset: true }).nullish(), dueDate: z.iso.datetime({ offset: true }).nullish(), dueDays: z.number().nullish(), invoiceAmount: z.number().nullish(), outstandingAmount: z.number().nullish(), currencyNotation: z.string().nullish() });
export type DunningPdfUpcomingInvoiceDTO = z.infer<typeof DunningPdfUpcomingInvoiceDTOSchema>;

/** 
 * DunningPdfPayloadDTOSchema 
 * @type { object }
 * @property { string } dunningId  
 * @property { number } dunningLevel  
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 * @property { DunningPdfBusinessPartnerDTO } businessPartner  
 * @property { DunningPdfInvoiceDTO[] } invoices  
 * @property { DunningPdfTotalDTO } total  
 * @property { DunningPdfBankAccountDTO } bankAccount  
 * @property { string } employeeName  
 * @property { DunningPdfConfigDTO } config  
 * @property { CommonModels.LanguageEnum } language  
 * @property { DunningPdfUpcomingInvoiceDTO[] } upcomingInvoices  
 */
export const DunningPdfPayloadDTOSchema = z.object({ dunningId: z.string(), dunningLevel: z.number(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), businessPartner: DunningPdfBusinessPartnerDTOSchema, invoices: z.array(DunningPdfInvoiceDTOSchema), total: DunningPdfTotalDTOSchema, bankAccount: DunningPdfBankAccountDTOSchema, employeeName: z.string().nullable(), config: DunningPdfConfigDTOSchema, language: CommonModels.LanguageEnumSchema.nullish(), upcomingInvoices: z.array(DunningPdfUpcomingInvoiceDTOSchema).nullish() });
export type DunningPdfPayloadDTO = z.infer<typeof DunningPdfPayloadDTOSchema>;

/** 
 * CreateDunningWithInvoicesRequestDTOSchema 
 * @type { object }
 * @property { string[] } invoiceIds Array of outstanding invoice IDs to include in the dunning. Example: `123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001` 
 * @property { string } dunningLevelId The ID of the dunning level to use for this dunning. Example: `123e4567-e89b-12d3-a456-426614174002` 
 * @property { number } dunningFee Optional dunning fee to use. If not provided, the fee from the dunning level will be used. Minimum: `0`. Example: `25.5` 
 * @property { number } interestRate Minimum: `0`. Maximum: `100`. Example: `25.5` 
 * @property { boolean } includeUpcomingInvoices  
 */
export const CreateDunningWithInvoicesRequestDTOSchema = z.object({ invoiceIds: z.array(z.string()), dunningLevelId: z.string(), dunningFee: z.number().gte(0).nullish(), interestRate: z.number().gte(0).lte(100).nullish(), includeUpcomingInvoices: z.boolean().nullish() });
export type CreateDunningWithInvoicesRequestDTO = z.infer<typeof CreateDunningWithInvoicesRequestDTOSchema>;

/** 
 * ListDunningsOrderParamEnumSchema 
 * @type { enum }
 */
export const ListDunningsOrderParamEnumSchema = z.enum(["createdAt", "level", "outstandingAmount", "statusChangedOn"]);
export type ListDunningsOrderParamEnum = z.infer<typeof ListDunningsOrderParamEnumSchema>;
export const ListDunningsOrderParamEnum = ListDunningsOrderParamEnumSchema.enum;

/** 
 * ListDunningsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningResponseDto[] } items  
 */
export const ListDunningsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningResponseDtoSchema).nullable() }).partial().shape });
export type ListDunningsResponse = z.infer<typeof ListDunningsResponseSchema>;

}
