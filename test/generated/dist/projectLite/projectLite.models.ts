import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ProjectLiteModels {
  /**
   * ProjectLiteEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const ProjectLiteEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type ProjectLiteEmployeeDTO = z.infer<typeof ProjectLiteEmployeeDTOSchema>;

  /**
   * ProjectLiteResponseDTOSchema
   * @type { object }
   * @property { string } id Project ID
   * @property { string } name Project name
   * @property { string } officeId Office ID
   * @property { boolean } archived Is archived
   * @property { string } createdById ID of the employee who created this project
   * @property { ProjectLiteEmployeeDTO } createdBy Employee who created this project
   * @property { string } createdAt Created at
   * @property { string } updatedById ID of the employee who last updated this project
   * @property { ProjectLiteEmployeeDTO } updatedBy Employee who last updated this project
   * @property { string } updatedAt Updated at
   */
  export const ProjectLiteResponseDTOSchema = z
    .object({
      id: z.string().describe("Project ID"),
      name: z.string().describe("Project name"),
      officeId: z.string().describe("Office ID"),
      archived: z.boolean().describe("Is archived"),
      createdById: z.string().describe("ID of the employee who created this project").nullish(),
      createdBy: ProjectLiteEmployeeDTOSchema.describe("Employee who created this project").nullish(),
      createdAt: z.iso.datetime({ offset: true }).describe("Created at"),
      updatedById: z.string().describe("ID of the employee who last updated this project").nullish(),
      updatedBy: ProjectLiteEmployeeDTOSchema.describe("Employee who last updated this project").nullish(),
      updatedAt: z.iso.datetime({ offset: true }).describe("Updated at"),
    })
    .readonly();
  export type ProjectLiteResponseDTO = z.infer<typeof ProjectLiteResponseDTOSchema>;

  /**
   * CreateProjectLiteRequestDTOSchema
   * @type { object }
   * @property { string } name Project name
   */
  export const CreateProjectLiteRequestDTOSchema = z.object({ name: z.string().describe("Project name") }).readonly();
  export type CreateProjectLiteRequestDTO = z.infer<typeof CreateProjectLiteRequestDTOSchema>;

  /**
   * ProjectLiteFilterDtoSchema
   * @type { object }
   * @property { string } search
   * @property { boolean } archived
   */
  export const ProjectLiteFilterDtoSchema = z.object({ search: z.string(), archived: z.boolean() }).readonly();
  export type ProjectLiteFilterDto = z.infer<typeof ProjectLiteFilterDtoSchema>;

  /**
   * UpdateProjectLiteRequestDTOSchema
   * @type { object }
   * @property { string } name Project name
   */
  export const UpdateProjectLiteRequestDTOSchema = z.object({ name: z.string().describe("Project name") }).readonly();
  export type UpdateProjectLiteRequestDTO = z.infer<typeof UpdateProjectLiteRequestDTOSchema>;

  /**
   * ProjectLitePaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const ProjectLitePaginateOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type ProjectLitePaginateOrderParamEnum = z.infer<typeof ProjectLitePaginateOrderParamEnumSchema>;
  export const ProjectLitePaginateOrderParamEnum = ProjectLitePaginateOrderParamEnumSchema.enum;

  /**
   * ProjectLitePaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { ProjectLiteResponseDTO[] } items
   */
  export const ProjectLitePaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(ProjectLiteResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type ProjectLitePaginateResponse = z.infer<typeof ProjectLitePaginateResponseSchema>;

  /**
   * PaginateProjectLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const PaginateProjectLabelsOrderParamEnumSchema = z.enum([
    "name",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
  ]);
  export type PaginateProjectLabelsOrderParamEnum = z.infer<typeof PaginateProjectLabelsOrderParamEnumSchema>;
  export const PaginateProjectLabelsOrderParamEnum = PaginateProjectLabelsOrderParamEnumSchema.enum;

  /**
   * PaginateProjectLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const PaginateProjectLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type PaginateProjectLabelsResponse = z.infer<typeof PaginateProjectLabelsResponseSchema>;
}
