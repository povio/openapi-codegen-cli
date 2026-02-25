import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeePermissionsModels } from "./employeePermissions.models";

export namespace EmployeePermissionsApi {
export const paginatePermissions = (limit: number, order?: string, filter?: EmployeePermissionsModels.EmployeePermissionFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsResponseSchema },
        `/employees/permissions`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(EmployeePermissionsModels.EmployeePermissionFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
export const findAll = (search?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: EmployeePermissionsModels.EmployeePermissionsFindAllResponseSchema },
        `/employees/permissions/labels`,
        {
            ...config,
            params: {
                search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
            },
        }
    )
};
}
