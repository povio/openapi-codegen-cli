import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ProjectLiteModels {
/** 
 * ProjectLiteEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const ProjectLiteEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
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
export const ProjectLiteResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), createdById: z.string().nullish(), createdBy: ProjectLiteEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: ProjectLiteEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) });
export type ProjectLiteResponseDTO = z.infer<typeof ProjectLiteResponseDTOSchema>;

/** 
 * CreateProjectLiteRequestDTOSchema 
 * @type { object }
 * @property { string } name Project name 
 */
export const CreateProjectLiteRequestDTOSchema = z.object({ name: z.string() });
export type CreateProjectLiteRequestDTO = z.infer<typeof CreateProjectLiteRequestDTOSchema>;

/** 
 * ProjectLiteFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const ProjectLiteFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type ProjectLiteFilterDto = z.infer<typeof ProjectLiteFilterDtoSchema>;

/** 
 * UpdateProjectLiteRequestDTOSchema 
 * @type { object }
 * @property { string } name Project name 
 */
export const UpdateProjectLiteRequestDTOSchema = z.object({ name: z.string().nullable() }).partial();
export type UpdateProjectLiteRequestDTO = z.infer<typeof UpdateProjectLiteRequestDTOSchema>;

/** 
 * ProjectLitePaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const ProjectLitePaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
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
export const ProjectLitePaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(ProjectLiteResponseDTOSchema).nullable() }).partial().shape });
export type ProjectLitePaginateResponse = z.infer<typeof ProjectLitePaginateResponseSchema>;

/** 
 * PaginateProjectLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PaginateProjectLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
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
export const PaginateProjectLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type PaginateProjectLabelsResponse = z.infer<typeof PaginateProjectLabelsResponseSchema>;

}
