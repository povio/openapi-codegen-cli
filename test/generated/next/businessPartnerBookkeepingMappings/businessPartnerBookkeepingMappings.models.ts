import { z } from "zod";

export namespace BusinessPartnerBookkeepingMappingsModels {
/** 
 * BusinessPartnerBookkeepingMappingResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { string } businessPartnerId  
 * @property { boolean } paysTaxInEurForFactoring  
 */
export const BusinessPartnerBookkeepingMappingResponseDtoSchema = z.object({ id: z.string(), debtorId: z.string().nullish(), creditorId: z.string().nullish(), currencyNotation: z.string().nullish(), businessPartnerId: z.string(), paysTaxInEurForFactoring: z.boolean().nullish() }).readonly();
export type BusinessPartnerBookkeepingMappingResponseDto = z.infer<typeof BusinessPartnerBookkeepingMappingResponseDtoSchema>;

/** 
 * BusinessPartnerBookkeepingMappingsResponseDtoSchema 
 * @type { object }
 * @property { BusinessPartnerBookkeepingMappingResponseDto[] } bookkeepingMappings  
 */
export const BusinessPartnerBookkeepingMappingsResponseDtoSchema = z.object({ bookkeepingMappings: z.array(BusinessPartnerBookkeepingMappingResponseDtoSchema).readonly() }).readonly();
export type BusinessPartnerBookkeepingMappingsResponseDto = z.infer<typeof BusinessPartnerBookkeepingMappingsResponseDtoSchema>;

/** 
 * UpdateBookkeepingMappingDtoSchema 
 * @type { object }
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { boolean } paysTaxInEurForFactoring Pays tax in EUR for factoring (Logvin case) 
 */
export const UpdateBookkeepingMappingDtoSchema = z.object({ debtorId: z.string(), creditorId: z.string(), currencyNotation: z.string(), paysTaxInEurForFactoring: z.boolean().describe("Pays tax in EUR for factoring (Logvin case)") }).readonly();
export type UpdateBookkeepingMappingDto = z.infer<typeof UpdateBookkeepingMappingDtoSchema>;

/** 
 * UpdateBookkeepingMappingRequestDtoSchema 
 * @type { object }
 * @property { UpdateBookkeepingMappingDto[] } bookkeepingMappings  
 */
export const UpdateBookkeepingMappingRequestDtoSchema = z.object({ bookkeepingMappings: z.array(UpdateBookkeepingMappingDtoSchema).readonly() }).readonly();
export type UpdateBookkeepingMappingRequestDto = z.infer<typeof UpdateBookkeepingMappingRequestDtoSchema>;

/** 
 * CreateBookkeepingMappingDtoSchema 
 * @type { object }
 * @property { string } debtorId  
 * @property { string } creditorId  
 * @property { string } currencyNotation  
 * @property { boolean } paysTaxInEurForFactoring Pays tax in EUR for factoring (Logvin case) 
 */
export const CreateBookkeepingMappingDtoSchema = z.object({ debtorId: z.string(), creditorId: z.string(), currencyNotation: z.string(), paysTaxInEurForFactoring: z.boolean().describe("Pays tax in EUR for factoring (Logvin case)") }).readonly();
export type CreateBookkeepingMappingDto = z.infer<typeof CreateBookkeepingMappingDtoSchema>;

/** 
 * UpdateBookkeepingMappingResponseSchema 
 * @type { array }
 */
export const UpdateBookkeepingMappingResponseSchema = z.array(BusinessPartnerBookkeepingMappingResponseDtoSchema).readonly();
export type UpdateBookkeepingMappingResponse = z.infer<typeof UpdateBookkeepingMappingResponseSchema>;

}
