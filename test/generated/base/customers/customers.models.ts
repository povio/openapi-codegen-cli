import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CustomersModels {
/** 
 * CustomerProfileBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerProfileBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerProfileBusinessPartnerDto = z.infer<typeof CustomerProfileBusinessPartnerDtoSchema>;

/** 
 * CustomerProfileResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 * @property { CustomerProfileBusinessPartnerDto } businessPartner  
 */
export const CustomerProfileResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), businessPartner: CustomerProfileBusinessPartnerDtoSchema.nullish() });
export type CustomerProfileResponseDTO = z.infer<typeof CustomerProfileResponseDTOSchema>;

/** 
 * CustomerBusinessPartnerResponseDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerBusinessPartnerResponseDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerBusinessPartnerResponseDto = z.infer<typeof CustomerBusinessPartnerResponseDtoSchema>;

/** 
 * CustomerResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company Id of the customer 
 * @property { string } businessPartnerId Business partner Id of the customer 
 * @property { boolean } archived Wether the customer is archived 
 * @property { CustomerBusinessPartnerResponseDto } businessPartner  
 */
export const CustomerResponseDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), archived: z.boolean(), businessPartner: CustomerBusinessPartnerResponseDtoSchema.nullish() });
export type CustomerResponseDTO = z.infer<typeof CustomerResponseDTOSchema>;

/** 
 * CustomerListItemBusinessPartnerDtoSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const CustomerListItemBusinessPartnerDtoSchema = z.object({ id: z.string(), name: z.string() });
export type CustomerListItemBusinessPartnerDto = z.infer<typeof CustomerListItemBusinessPartnerDtoSchema>;

/** 
 * CustomerListItemDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier of the customer 
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 * @property { CustomerListItemBusinessPartnerDto } businessPartner  
 */
export const CustomerListItemDTOSchema = z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), email: z.string(), phone: z.string(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish(), businessPartner: CustomerListItemBusinessPartnerDtoSchema.nullish() });
export type CustomerListItemDTO = z.infer<typeof CustomerListItemDTOSchema>;

/** 
 * CreateCustomerDTOSchema 
 * @type { object }
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } email Email of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 */
export const CreateCustomerDTOSchema = z.object({ firstName: z.string(), lastName: z.string(), email: z.email(), phone: z.string().nullish(), companyId: z.string().nullish(), businessPartnerId: z.string().nullish() });
export type CreateCustomerDTO = z.infer<typeof CreateCustomerDTOSchema>;

/** 
 * CustomerPaginationFilterDtoSchema 
 * @type { object }
 * @property { string } firstName  
 * @property { string } lastName  
 * @property { string } email  
 * @property { string } companyId  
 * @property { string } businessPartnerId  
 * @property { string } search  
 */
export const CustomerPaginationFilterDtoSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), email: z.string().nullable(), companyId: z.string().nullable(), businessPartnerId: z.string().nullable(), search: z.string().nullable() }).partial();
export type CustomerPaginationFilterDto = z.infer<typeof CustomerPaginationFilterDtoSchema>;

/** 
 * UpdateCustomerDTOSchema 
 * @type { object }
 * @property { string } firstName First name of the customer 
 * @property { string } lastName Last name of the customer 
 * @property { string } phone Phone number of the customer 
 * @property { string } companyId Company id of the customer 
 * @property { string } businessPartnerId Business partner id of the customer 
 */
export const UpdateCustomerDTOSchema = z.object({ firstName: z.string().nullable(), lastName: z.string().nullable(), phone: z.string().nullable(), companyId: z.string().nullable(), businessPartnerId: z.string().nullable() }).partial();
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerDTOSchema>;

/** 
 * CustomersListOrderParamEnumSchema 
 * @type { enum }
 */
export const CustomersListOrderParamEnumSchema = z.enum(["firstName", "lastName", "email", "createdAt"]);
export type CustomersListOrderParamEnum = z.infer<typeof CustomersListOrderParamEnumSchema>;
export const CustomersListOrderParamEnum = CustomersListOrderParamEnumSchema.enum;

/** 
 * CustomersListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CustomerListItemDTO[] } items  
 */
export const CustomersListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CustomerListItemDTOSchema).nullable() }).partial().shape });
export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

}
