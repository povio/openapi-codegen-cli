import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";
import { EmploymentModels } from "./employment.models";

export namespace EmploymentApi {
export const create = (data: EmploymentModels.EmploymentCreateRequest, ) => {
    return AppRestClient.post(
        { resSchema: EmploymentModels.EmploymentResponseSchema },
        `/employees/employments`,
        ZodExtended.parse(EmploymentModels.EmploymentCreateRequestSchema, data),
        
    )
};
export const list = (limit: number, order?: string, populate?: EmploymentModels.EmploymentListPopulateParam, filter?: EmploymentModels.EmploymentFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmploymentModels.EmploymentListResponseSchema },
        `/employees/employments`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmploymentModels.EmploymentListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                populate: ZodExtended.parse(EmploymentModels.EmploymentListPopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
                filter: ZodExtended.parse(EmploymentModels.EmploymentFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const listRoles = (officeId: string, employmentId: string, ) => {
    return AppRestClient.get(
        { resSchema: EmploymentModels.EmploymentListRolesResponseSchema },
        `/offices/${officeId}/employments/${employmentId}/roles`,
        
    )
};
export const updateRoles = (officeId: string, employmentId: string, data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest, ) => {
    return AppRestClient.put(
        { resSchema: EmploymentModels.EmploymentUpdateRolesResponseSchema },
        `/offices/${officeId}/employments/${employmentId}/roles`,
        ZodExtended.parse(EmploymentModels.EmploymentRoleMembershipsUpdateRequestSchema, data),
        
    )
};
export const update = (officeId: string, employmentId: string, data: EmploymentModels.UpdateEmploymentRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: EmploymentModels.EmploymentResponseSchema },
        `/offices/${officeId}/employments/${employmentId}`,
        ZodExtended.parse(EmploymentModels.UpdateEmploymentRequestDtoSchema, data),
        
    )
};
export const archive = (officeId: string, employmentId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmploymentModels.EmploymentResponseSchema },
        `/offices/${officeId}/employments/${employmentId}/archive`,
        
    )
};
export const unarchive = (officeId: string, employmentId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmploymentModels.EmploymentResponseSchema },
        `/offices/${officeId}/employments/${employmentId}/unarchive`,
        
    )
};
}
