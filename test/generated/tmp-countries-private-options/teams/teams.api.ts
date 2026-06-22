import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { TeamsModels } from "./teams.models";

export namespace TeamsApi {
export const create = (officeId: string, data: TeamsModels.CreateTeamRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: TeamsModels.TeamResponseDTOSchema },
        `/offices/${officeId}/teams`,
        ZodExtended.parse(TeamsModels.CreateTeamRequestDTOSchema, data),
        
    )
};
export const paginate = (officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: TeamsModels.TeamsPaginateResponseSchema },
        `/offices/${officeId}/teams`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TeamsModels.TeamsPaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TeamsModels.TeamFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const paginateLabels = (officeId: string, limit: number, order?: string, filter?: TeamsModels.TeamLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: TeamsModels.TeamsPaginateLabelsResponseSchema },
        `/offices/${officeId}/teams/paginate/labels`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(TeamsModels.TeamsPaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(TeamsModels.TeamLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findById = (id: string, officeId: string, ) => {
    return AppRestClient.get(
        { resSchema: TeamsModels.TeamResponseDTOSchema },
        `/offices/${officeId}/teams/${id}`,
        
    )
};
export const update = (id: string, officeId: string, data: TeamsModels.UpdateTeamRequestDTO, ) => {
    return AppRestClient.put(
        { resSchema: TeamsModels.TeamResponseDTOSchema },
        `/offices/${officeId}/teams/${id}`,
        ZodExtended.parse(TeamsModels.UpdateTeamRequestDTOSchema, data),
        
    )
};
export const bulkAddMembers = (id: string, officeId: string, data: TeamsModels.BulkAddTeamMembersRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: TeamsModels.TeamResponseDTOSchema },
        `/offices/${officeId}/teams/${id}/members/bulk-add`,
        ZodExtended.parse(TeamsModels.BulkAddTeamMembersRequestDTOSchema, data),
        
    )
};
export const bulkRemoveMembers = (id: string, officeId: string, data: TeamsModels.BulkRemoveTeamMembersRequestDTO, ) => {
    return AppRestClient.post(
        { resSchema: TeamsModels.TeamResponseDTOSchema },
        `/offices/${officeId}/teams/${id}/members/bulk-remove`,
        ZodExtended.parse(TeamsModels.BulkRemoveTeamMembersRequestDTOSchema, data),
        
    )
};
export const archive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/teams/${id}/archive`,
        
    )
};
export const unarchive = (id: string, officeId: string, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/teams/${id}/unarchive`,
        
    )
};
}
