import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace BusinessPartnerContactsModels {
  /**
   * BusinessPartnerContactRoleEnumSchema
   * @type { enum }
   */
  export const BusinessPartnerContactRoleEnumSchema = z.enum([
    "General",
    "CommercialManager",
    "SystemEngineer",
    "TechnicalEngineer",
    "Logistics",
    "Operations",
    "Sales",
    "Accounting",
    "Invoice",
    "Dunnings",
    "Reclamations",
    "Management",
  ]);
  export type BusinessPartnerContactRoleEnum = z.infer<typeof BusinessPartnerContactRoleEnumSchema>;
  export const BusinessPartnerContactRoleEnum = BusinessPartnerContactRoleEnumSchema.enum;

  /**
   * BusinessPartnerContactResponseDTOSchema
   * @type { object }
   * @property { string } id Contact ID
   * @property { BusinessPartnerContactRoleEnum } role
   * @property { string } name Contact name
   * @property { string } email Contact email
   * @property { string } phone Contact phone
   */
  export const BusinessPartnerContactResponseDTOSchema = z
    .object({
      id: z.string().describe("Contact ID"),
      role: BusinessPartnerContactRoleEnumSchema.nullish(),
      name: z.string().describe("Contact name").nullish(),
      email: z.string().describe("Contact email").nullish(),
      phone: z.string().describe("Contact phone").nullish(),
    })
    .readonly();
  export type BusinessPartnerContactResponseDTO = z.infer<typeof BusinessPartnerContactResponseDTOSchema>;

  /**
   * BusinessPartnerContactListResponseDTOSchema
   * @type { object }
   * @property { BusinessPartnerContactResponseDTO[] } contacts List of contacts
   */
  export const BusinessPartnerContactListResponseDTOSchema = z
    .object({ contacts: z.array(BusinessPartnerContactResponseDTOSchema).readonly().describe("List of contacts") })
    .readonly();
  export type BusinessPartnerContactListResponseDTO = z.infer<typeof BusinessPartnerContactListResponseDTOSchema>;

  /**
   * CreateBusinessPartnerContactRequestDTOSchema
   * @type { object }
   * @property { BusinessPartnerContactRoleEnum } role
   * @property { string } name Contact name
   * @property { string } email Contact email
   * @property { string } phone Contact phone
   */
  export const CreateBusinessPartnerContactRequestDTOSchema = z
    .object({
      role: BusinessPartnerContactRoleEnumSchema,
      name: z.string().describe("Contact name"),
      email: z.string().describe("Contact email"),
      phone: z.string().describe("Contact phone"),
    })
    .readonly();
  export type CreateBusinessPartnerContactRequestDTO = z.infer<typeof CreateBusinessPartnerContactRequestDTOSchema>;

  /**
   * UpdateBusinessPartnerContactRequestDTOSchema
   * @type { object }
   * @property { BusinessPartnerContactRoleEnum } role
   * @property { string } name Contact name
   * @property { string } email Contact email
   * @property { string } phone Contact phone
   */
  export const UpdateBusinessPartnerContactRequestDTOSchema = z
    .object({
      role: BusinessPartnerContactRoleEnumSchema,
      name: z.string().describe("Contact name"),
      email: z.string().describe("Contact email"),
      phone: z.string().describe("Contact phone"),
    })
    .readonly();
  export type UpdateBusinessPartnerContactRequestDTO = z.infer<typeof UpdateBusinessPartnerContactRequestDTOSchema>;

  /**
   * BusinessPartnerContactFilterDtoSchema
   * @type { object }
   * @property { string } search Search by name, email, or phone
   */
  export const BusinessPartnerContactFilterDtoSchema = z
    .object({ search: z.string().describe("Search by name, email, or phone") })
    .readonly();
  export type BusinessPartnerContactFilterDto = z.infer<typeof BusinessPartnerContactFilterDtoSchema>;

  /**
   * PaginateContactLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const PaginateContactLabelsOrderParamEnumSchema = z.enum(["name", "role", "email", "createdAt", "updatedAt"]);
  export type PaginateContactLabelsOrderParamEnum = z.infer<typeof PaginateContactLabelsOrderParamEnumSchema>;
  export const PaginateContactLabelsOrderParamEnum = PaginateContactLabelsOrderParamEnumSchema.enum;

  /**
   * PaginateContactLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const PaginateContactLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PaginateContactLabelsResponse = z.infer<typeof PaginateContactLabelsResponseSchema>;
}
