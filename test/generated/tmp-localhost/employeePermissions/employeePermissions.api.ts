import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeePermissionsModels } from "./employeePermissions.models";

export namespace EmployeePermissionsApi {
export const paginatePermissions = (limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponseSchema },
        `/employees/permissions`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(EmployeePermissionsModels.EmployeePermissionFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findAll = (search?: string, ) => {
    return AppRestClient.get(
        { resSchema: EmployeePermissionsModels.EmployeePermissionsFindAllResponseSchema },
        `/employees/permissions/labels`,
        {
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
            },
        }
    )
};
}
