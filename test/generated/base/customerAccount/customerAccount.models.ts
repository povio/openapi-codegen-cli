import { z } from "zod";

export namespace CustomerAccountModels {
/** 
 * CustomerCompanyDtoSchema 
 * @type { object }
 * @property { string } id Company ID 
 * @property { string } name Company name 
 */
export const CustomerCompanyDtoSchema = z.object({ id: z.string(), name: z.string().nullish() });
export type CustomerCompanyDto = z.infer<typeof CustomerCompanyDtoSchema>;

/** 
 * CustomerBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id Company ID 
 * @property { string } name Company name 
 */
export const CustomerBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerBusinessPartnerDto = z.infer<typeof CustomerBusinessPartnerDtoSchema>;

/** 
 * CustomerAccountDtoSchema 
 * @type { object }
 * @property { array[] } aclRules Can hold any type of value 
 * @property { string } id Customer ID 
 * @property { string } email Email 
 * @property { string } firstName First name 
 * @property { string } lastName Last name 
 * @property { string } phone Phone number 
 * @property { CustomerCompanyDto } company Company 
 * @property { CustomerBusinessPartnerDto } businessPartner  
 */
export const CustomerAccountDtoSchema = z.object({ aclRules: z.array(z.array(z.any())), id: z.string(), email: z.email(), firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), company: CustomerCompanyDtoSchema.nullish(), businessPartner: CustomerBusinessPartnerDtoSchema.nullish() });
export type CustomerAccountDto = z.infer<typeof CustomerAccountDtoSchema>;

}
