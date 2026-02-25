import { z } from "zod";

export namespace CustomerAccountModels {
  /**
   * CustomerCompanyDtoSchema
   * @type { object }
   * @property { string } id Company ID
   * @property { string } name Company name
   */
  export const CustomerCompanyDtoSchema = z
    .object({ id: z.string().describe("Company ID"), name: z.string().describe("Company name").nullish() })
    .readonly();
  export type CustomerCompanyDto = z.infer<typeof CustomerCompanyDtoSchema>;

  /**
   * CustomerBusinessPartnerDtoSchema
   * @type { object }
   * @property { string } id Company ID
   * @property { string } name Company name
   */
  export const CustomerBusinessPartnerDtoSchema = z
    .object({ id: z.string().describe("Company ID"), name: z.string().describe("Company name") })
    .readonly();
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
  export const CustomerAccountDtoSchema = z
    .object({
      aclRules: z.array(z.array(z.any()).readonly()).readonly().describe("Can hold any type of value"),
      id: z.string().describe("Customer ID"),
      email: z.email().describe("Email"),
      firstName: z.string().describe("First name"),
      lastName: z.string().describe("Last name"),
      phone: z.string().describe("Phone number").nullish(),
      company: CustomerCompanyDtoSchema.describe("Company").nullish(),
      businessPartner: CustomerBusinessPartnerDtoSchema.nullish(),
    })
    .readonly();
  export type CustomerAccountDto = z.infer<typeof CustomerAccountDtoSchema>;
}
