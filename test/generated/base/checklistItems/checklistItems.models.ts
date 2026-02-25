import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ChecklistItemsModels {
  /**
   * ChecklistItemEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const ChecklistItemEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type ChecklistItemEmployeeDTO = z.infer<typeof ChecklistItemEmployeeDTOSchema>;

  /**
   * ChecklistItemResponseDTOSchema
   * @type { object }
   * @property { string } id Checklist item ID
   * @property { string } name Checklist item name
   * @property { string } officeId Office ID
   * @property { boolean } archived Is archived
   * @property { string } archivedAt Archived at
   * @property { string } createdById ID of the employee who created this checklist item
   * @property { ChecklistItemEmployeeDTO } createdBy Employee who created this checklist item
   * @property { string } createdAt Created at
   * @property { string } updatedById ID of the employee who last updated this checklist item
   * @property { ChecklistItemEmployeeDTO } updatedBy Employee who last updated this checklist item
   * @property { string } updatedAt Updated at
   */
  export const ChecklistItemResponseDTOSchema = z
    .object({
      id: z.string().describe("Checklist item ID"),
      name: z.string().describe("Checklist item name"),
      officeId: z.string().describe("Office ID"),
      archived: z.boolean().describe("Is archived"),
      archivedAt: z.iso.datetime({ offset: true }).describe("Archived at").nullish(),
      createdById: z.string().describe("ID of the employee who created this checklist item").nullish(),
      createdBy: ChecklistItemEmployeeDTOSchema.describe("Employee who created this checklist item").nullish(),
      createdAt: z.iso.datetime({ offset: true }).describe("Created at"),
      updatedById: z.string().describe("ID of the employee who last updated this checklist item").nullish(),
      updatedBy: ChecklistItemEmployeeDTOSchema.describe("Employee who last updated this checklist item").nullish(),
      updatedAt: z.iso.datetime({ offset: true }).describe("Updated at"),
    })
    .readonly();
  export type ChecklistItemResponseDTO = z.infer<typeof ChecklistItemResponseDTOSchema>;

  /**
   * CreateChecklistItemRequestDTOSchema
   * @type { object }
   * @property { string } name Checklist item name. Min Length: `3`. Max Length: `256`
   */
  export const CreateChecklistItemRequestDTOSchema = z
    .object({ name: z.string().min(3).max(256).describe("Checklist item name") })
    .readonly();
  export type CreateChecklistItemRequestDTO = z.infer<typeof CreateChecklistItemRequestDTOSchema>;

  /**
   * ChecklistItemLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const ChecklistItemLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type ChecklistItemLabelFilterDto = z.infer<typeof ChecklistItemLabelFilterDtoSchema>;

  /**
   * ChecklistItemFilterDtoSchema
   * @type { object }
   * @property { string } search
   * @property { boolean } archived
   */
  export const ChecklistItemFilterDtoSchema = z.object({ search: z.string(), archived: z.boolean() }).readonly();
  export type ChecklistItemFilterDto = z.infer<typeof ChecklistItemFilterDtoSchema>;

  /**
   * UpdateChecklistItemRequestDTOSchema
   * @type { object }
   * @property { string } name Checklist item name. Min Length: `3`. Max Length: `256`
   */
  export const UpdateChecklistItemRequestDTOSchema = z
    .object({ name: z.string().min(3).max(256).describe("Checklist item name") })
    .readonly();
  export type UpdateChecklistItemRequestDTO = z.infer<typeof UpdateChecklistItemRequestDTOSchema>;

  /**
   * ChecklistItemsPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const ChecklistItemsPaginateOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type ChecklistItemsPaginateOrderParamEnum = z.infer<typeof ChecklistItemsPaginateOrderParamEnumSchema>;
  export const ChecklistItemsPaginateOrderParamEnum = ChecklistItemsPaginateOrderParamEnumSchema.enum;

  /**
   * ChecklistItemsPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { ChecklistItemResponseDTO[] } items
   */
  export const ChecklistItemsPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(ChecklistItemResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type ChecklistItemsPaginateResponse = z.infer<typeof ChecklistItemsPaginateResponseSchema>;

  /**
   * ChecklistItemsPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const ChecklistItemsPaginateLabelsOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type ChecklistItemsPaginateLabelsOrderParamEnum = z.infer<
    typeof ChecklistItemsPaginateLabelsOrderParamEnumSchema
  >;
  export const ChecklistItemsPaginateLabelsOrderParamEnum = ChecklistItemsPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * ChecklistItemsPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const ChecklistItemsPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type ChecklistItemsPaginateLabelsResponse = z.infer<typeof ChecklistItemsPaginateLabelsResponseSchema>;
}
