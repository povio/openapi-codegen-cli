import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace TeamsModels {
/** 
 * TeamEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const TeamEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() });
export type TeamEmployeeDTO = z.infer<typeof TeamEmployeeDTOSchema>;

/** 
 * TeamMemberResponseDTOSchema 
 * @type { object }
 * @property { string } employeeId Employee id 
 * @property { string } name Employee name 
 */
export const TeamMemberResponseDTOSchema = z.object({ employeeId: z.string(), name: z.string().nullish() });
export type TeamMemberResponseDTO = z.infer<typeof TeamMemberResponseDTOSchema>;

/** 
 * TeamResponseDTOSchema 
 * @type { object }
 * @property { string } id Team id 
 * @property { string } name Team name 
 * @property { string } officeId Office id 
 * @property { boolean } archived Is archived 
 * @property { string } archivedAt Archived at 
 * @property { string } createdById ID of the employee who created this team 
 * @property { TeamEmployeeDTO } createdBy Employee who created this team 
 * @property { string } createdAt Created at 
 * @property { string } updatedById ID of the employee who last updated this team 
 * @property { TeamEmployeeDTO } updatedBy Employee who last updated this team 
 * @property { string } updatedAt Updated at 
 * @property { TeamMemberResponseDTO[] } members Team members ordered by name ascending 
 */
export const TeamResponseDTOSchema = z.object({ id: z.string(), name: z.string(), officeId: z.string(), archived: z.boolean(), archivedAt: z.iso.datetime({ offset: true }).nullish(), createdById: z.string().nullish(), createdBy: TeamEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: TeamEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), members: z.array(TeamMemberResponseDTOSchema) });
export type TeamResponseDTO = z.infer<typeof TeamResponseDTOSchema>;

/** 
 * CreateTeamRequestDTOSchema 
 * @type { object }
 * @property { string } name Team name. Min Length: `3`. Max Length: `120` 
 */
export const CreateTeamRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type CreateTeamRequestDTO = z.infer<typeof CreateTeamRequestDTOSchema>;

/** 
 * TeamLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const TeamLabelFilterDtoSchema = z.object({ search: z.string().nullable() }).partial();
export type TeamLabelFilterDto = z.infer<typeof TeamLabelFilterDtoSchema>;

/** 
 * TeamFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 * @property { boolean } archived  
 */
export const TeamFilterDtoSchema = z.object({ search: z.string().nullable(), archived: z.boolean().nullable() }).partial();
export type TeamFilterDto = z.infer<typeof TeamFilterDtoSchema>;

/** 
 * UpdateTeamRequestDTOSchema 
 * @type { object }
 * @property { string } name Team name. Min Length: `3`. Max Length: `120` 
 */
export const UpdateTeamRequestDTOSchema = z.object({ name: z.string().min(3).max(120) });
export type UpdateTeamRequestDTO = z.infer<typeof UpdateTeamRequestDTOSchema>;

/** 
 * BulkAddTeamMembersRequestDTOSchema 
 * @type { object }
 * @property { string[] } employeeIds Employee ids to add to team 
 */
export const BulkAddTeamMembersRequestDTOSchema = z.object({ employeeIds: z.array(z.uuid()) });
export type BulkAddTeamMembersRequestDTO = z.infer<typeof BulkAddTeamMembersRequestDTOSchema>;

/** 
 * BulkRemoveTeamMembersRequestDTOSchema 
 * @type { object }
 * @property { string[] } employeeIds Employee ids to remove from team 
 */
export const BulkRemoveTeamMembersRequestDTOSchema = z.object({ employeeIds: z.array(z.uuid()) });
export type BulkRemoveTeamMembersRequestDTO = z.infer<typeof BulkRemoveTeamMembersRequestDTOSchema>;

/** 
 * TeamsPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const TeamsPaginateOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TeamsPaginateOrderParamEnum = z.infer<typeof TeamsPaginateOrderParamEnumSchema>;
export const TeamsPaginateOrderParamEnum = TeamsPaginateOrderParamEnumSchema.enum;

/** 
 * TeamsPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { TeamResponseDTO[] } items  
 */
export const TeamsPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(TeamResponseDTOSchema).nullable() }).partial().shape });
export type TeamsPaginateResponse = z.infer<typeof TeamsPaginateResponseSchema>;

/** 
 * TeamsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const TeamsPaginateLabelsOrderParamEnumSchema = z.enum(["name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type TeamsPaginateLabelsOrderParamEnum = z.infer<typeof TeamsPaginateLabelsOrderParamEnumSchema>;
export const TeamsPaginateLabelsOrderParamEnum = TeamsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * TeamsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const TeamsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).nullable() }).partial().shape });
export type TeamsPaginateLabelsResponse = z.infer<typeof TeamsPaginateLabelsResponseSchema>;

}
