import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { EmployeeRolesModels } from "./employeeRoles.models";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeRolesApi {
export const list = (limit: number, order?: string, filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeRolesModels.EmployeeRolesListResponseSchema },
        `/employees/roles`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmployeeRolesModels.EmployeeRolesListOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(EmployeeRolesModels.EmployeeRolePaginationFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const create = (data: EmployeeRolesModels.EmployeeRoleCreateRequest, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
        `/employees/roles`,
        ZodExtended.parse(EmployeeRolesModels.EmployeeRoleCreateRequestSchema, data),
        
    )
};
export const labels = (search?: string, context?: EmployeeRolesModels.EmployeeRoleContext, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeRolesModels.LabelsResponseSchema },
        `/employees/roles/labels`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
                context: ZodExtended.parse(EmployeeRolesModels.EmployeeRoleContextSchema.optional(), context, { type: "query", name: "context" }),
            },
        }
    )
};
export const find = (roleId: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
        `/employees/roles/${roleId}`,
        
    )
};
export const update = (roleId: string, data: EmployeeRolesModels.EmployeeRoleUpdateRequest, ) => {
    return AppRestClient.put(
        { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
        `/employees/roles/${roleId}`,
        ZodExtended.parse(EmployeeRolesModels.EmployeeRoleUpdateRequestSchema, data),
        
    )
};
export const deleteEmployeesRolesByRoleId = (roleId: string, ) => {
    return AppRestClient.delete(
        { resSchema: EmployeeRolesModels.StatusResponseDtoSchema },
        `/employees/roles/${roleId}`,
        
    )
};
export const paginatePermissions = (roleId: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeeRolesModels.EmployeeRolesPaginatePermissionsResponseSchema },
        `/employees/roles/${roleId}/permissions`,
        
    )
};
export const togglePermission = (roleId: string, permission: string, data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/employees/roles/${roleId}/permissions/${permission}/toggle`,
        ZodExtended.parse(EmployeeRolesModels.EmployeeRoleTogglePermissionRequestSchema, data),
        
    )
};
export const copy = (roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto, ) => {
    return AppRestClient.post(
        { resSchema: EmployeeRolesModels.EmployeeRoleResponseSchema },
        `/employees/roles/${roleId}/copy`,
        ZodExtended.parse(EmployeeRolesModels.CopyEmployeeRoleDtoSchema, data),
        
    )
};
}
