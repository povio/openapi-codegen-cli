import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace DunningLevelsModels {
/** 
 * DunningLevelOfficeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 * @property { string } currencyNotation  
 */
export const DunningLevelOfficeDTOSchema = z.object({ id: z.string(), name: z.string(), currencyNotation: z.string() }).readonly();
export type DunningLevelOfficeDTO = z.infer<typeof DunningLevelOfficeDTOSchema>;

/** 
 * DunningLevelEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const DunningLevelEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type DunningLevelEmployeeDTO = z.infer<typeof DunningLevelEmployeeDTOSchema>;

/** 
 * DunningLevelResponseDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { number } level  
 * @property { number } daysOverdue  
 * @property { number } dunningFee  
 * @property { number } interestRate  
 * @property { string } usedInOfficeId  
 * @property { DunningLevelOfficeDTO } usedInOffice  
 * @property { CommonModels.DunningSystemReferenceDTO } dunningSystem  
 * @property { string } createdById  
 * @property { DunningLevelEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { DunningLevelEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 * @property { boolean } archived  
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks  
 * @property { CommonModels.EditorContentResponseDto } footerRemarks  
 */
export const DunningLevelResponseDTOSchema = z.object({ id: z.string(), level: z.number(), daysOverdue: z.number(), dunningFee: z.number(), interestRate: z.number().nullish(), usedInOfficeId: z.string(), usedInOffice: DunningLevelOfficeDTOSchema.nullish(), dunningSystem: CommonModels.DunningSystemReferenceDTOSchema.nullish(), createdById: z.string().nullish(), createdBy: DunningLevelEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: DunningLevelEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }), archived: z.boolean(), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish() }).readonly();
export type DunningLevelResponseDTO = z.infer<typeof DunningLevelResponseDTOSchema>;

/** 
 * CreateDunningLevelRequestDTOSchema 
 * @type { object }
 * @property { number } level Dunning level number. Minimum: `1` 
 * @property { number } daysOverdue Days overdue before this level applies. Minimum: `1` 
 * @property { number } dunningFee Fee amount for this dunning level. Minimum: `0` 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { number } interestRate Minimum: `0`. Maximum: `100` 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const CreateDunningLevelRequestDTOSchema = z.object({ level: z.number().gte(1).describe("Dunning level number"), daysOverdue: z.number().gte(1).describe("Days overdue before this level applies"), dunningFee: z.number().gte(0).describe("Fee amount for this dunning level"), dunningSystemId: z.string().describe("Dunning system ID").nullish(), interestRate: z.number().gte(0).lte(100).nullish(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks").nullish(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks").nullish() }).readonly();
export type CreateDunningLevelRequestDTO = z.infer<typeof CreateDunningLevelRequestDTOSchema>;

/** 
 * UpdateDunningLevelRequestDTOSchema 
 * @type { object }
 * @property { number } level Dunning level number. Minimum: `1` 
 * @property { number } daysOverdue Days overdue before this level applies. Minimum: `1` 
 * @property { number } dunningFee Fee amount for this dunning level. Minimum: `0` 
 * @property { number } interestRate Minimum: `0`. Maximum: `100` 
 * @property { string } dunningSystemId Dunning system ID 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateDunningLevelRequestDTOSchema = z.object({ level: z.number().gte(1).describe("Dunning level number"), daysOverdue: z.number().gte(1).describe("Days overdue before this level applies"), dunningFee: z.number().gte(0).describe("Fee amount for this dunning level"), interestRate: z.number().gte(0).lte(100), dunningSystemId: z.string().describe("Dunning system ID"), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks") }).readonly();
export type UpdateDunningLevelRequestDTO = z.infer<typeof UpdateDunningLevelRequestDTOSchema>;

/** 
 * DunningLevelLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const DunningLevelLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type DunningLevelLabelFilterDto = z.infer<typeof DunningLevelLabelFilterDtoSchema>;

/** 
 * DunningLevelFilterDtoSchema 
 * @type { object }
 * @property { string } dunningSystemId Dunning system ID to filter by 
 * @property { string } search Search to filter by 
 * @property { boolean } archived Filter by archived status 
 */
export const DunningLevelFilterDtoSchema = z.object({ dunningSystemId: z.string().describe("Dunning system ID to filter by"), search: z.string().describe("Search to filter by"), archived: z.boolean().describe("Filter by archived status") }).readonly();
export type DunningLevelFilterDto = z.infer<typeof DunningLevelFilterDtoSchema>;

/** 
 * DunningLevelsPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningLevelsPaginateLabelsOrderParamEnumSchema = z.enum(["level", "daysOverdue", "dunningFee", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DunningLevelsPaginateLabelsOrderParamEnum = z.infer<typeof DunningLevelsPaginateLabelsOrderParamEnumSchema>;
export const DunningLevelsPaginateLabelsOrderParamEnum = DunningLevelsPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * DunningLevelsPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const DunningLevelsPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type DunningLevelsPaginateLabelsResponse = z.infer<typeof DunningLevelsPaginateLabelsResponseSchema>;

/** 
 * DunningLevelsListOrderParamEnumSchema 
 * @type { enum }
 */
export const DunningLevelsListOrderParamEnumSchema = z.enum(["level", "daysOverdue", "dunningFee", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type DunningLevelsListOrderParamEnum = z.infer<typeof DunningLevelsListOrderParamEnumSchema>;
export const DunningLevelsListOrderParamEnum = DunningLevelsListOrderParamEnumSchema.enum;

/** 
 * DunningLevelsListResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { DunningLevelResponseDTO[] } items  
 */
export const DunningLevelsListResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(DunningLevelResponseDTOSchema).readonly() }).readonly().shape });
export type DunningLevelsListResponse = z.infer<typeof DunningLevelsListResponseSchema>;

}
