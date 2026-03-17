import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeModels } from "./employee.models";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeApi {
export const paginate = (limit: number, order?: string, populate?: EmployeeModels.EmployeePaginatePopulateParam, filter?: EmployeeModels.EmployeeFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeePaginateResponseSchema },
        `/employees`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmployeeModels.EmployeePaginateOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                populate: ZodExtended.parse(EmployeeModels.EmployeePaginatePopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
                filter: ZodExtended.parse(EmployeeModels.EmployeeFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: EmployeeModels.EmployeeCreateRequest, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees`,
        ZodExtended.parse(EmployeeModels.EmployeeCreateRequestSchema, data),
        
    )
};
export const singeStepCreate = (data: EmployeeModels.EmployeeOneStepCreateRequest, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees/one-step`,
        ZodExtended.parse(EmployeeModels.EmployeeOneStepCreateRequestSchema, data),
        
    )
};
export const findAll = (search?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeeFindAllResponseSchema },
        `/employees/labels`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
            },
        }
    )
};
export const paginateLabels = (limit: number, order?: string, filter?: EmployeeModels.EmployeeLabelFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeePaginateLabelsResponseSchema },
        `/employees/labels/paginate`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmployeeModels.EmployeePaginateLabelsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(EmployeeModels.EmployeeLabelFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const resendOnboarding = (employeeId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.StatusResponseDtoSchema },
        `/employees/${employeeId}/resend-onboarding`,
        
    )
};
export const resendOnboardingWithOffice = (officeId: string, employeeId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.StatusResponseDtoSchema },
        `/offices/${officeId}/employees/${employeeId}/resend-onboarding`,
        
    )
};
export const get = (employeeId: string, populate?: EmployeeModels.EmployeeGetPopulateParam, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees/${employeeId}`,
        {
            params: {
                populate: ZodExtended.parse(EmployeeModels.EmployeeGetPopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
            },
        }
    )
};
export const update = (employeeId: string, data: EmployeeModels.EmployeeUpdateRequest, ) => {
    return AppRestClient.put(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees/${employeeId}`,
        ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
        
    )
};
export const getWithOffice = (officeId: string, employeeId: string, populate?: EmployeeModels.GetWithOfficePopulateParam, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/offices/${officeId}/employees/${employeeId}`,
        {
            params: {
                populate: ZodExtended.parse(EmployeeModels.GetWithOfficePopulateParamSchema.optional(), populate, { type: "query", name: "populate" }),
            },
        }
    )
};
export const updateWithOffice = (officeId: string, employeeId: string, data: EmployeeModels.EmployeeUpdateRequest, ) => {
    return AppRestClient.put(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/offices/${officeId}/employees/${employeeId}`,
        ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
        
    )
};
export const listRoles = (employeeId: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeModels.EmployeeListRolesResponseSchema },
        `/employees/${employeeId}/roles`,
        
    )
};
export const updateRoles = (employeeId: string, data: EmployeeModels.EmployeeRoleMembershipsUpdateRequest, ) => {
    return AppRestClient.put(
        { resSchema: EmployeeModels.EmployeeUpdateRolesResponseSchema },
        `/employees/${employeeId}/roles`,
        ZodExtended.parse(EmployeeModels.EmployeeRoleMembershipsUpdateRequestSchema, data),
        
    )
};
export const archive = (employeeId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees/${employeeId}/archive`,
        
    )
};
export const unarchive = (employeeId: string, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeModels.EmployeeResponseSchema },
        `/employees/${employeeId}/unarchive`,
        
    )
};
}
