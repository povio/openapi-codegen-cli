import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeRolesModels } from "./employeeRoles.models";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeRolesApi {
  export const list = (
    limit: number,
    order?: string,
    filter?: EmployeeRolesModels.EmployeeRolePaginationFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: EmployeeRolesModels.EmployeeRolesListResponseSchema }, `/employees/roles`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(EmployeeRolesModels.EmployeeRolesListOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        filter: ZodExtended.parse(EmployeeRolesModels.EmployeeRolePaginationFilterDtoSchema.optional(), filter, {
          type: "query",
          name: "filter",
        }),
        limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, {
          type: "query",
          name: "limit",
        }),
        page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, {
          type: "query",
          name: "page",
        }),
        cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, {
          type: "query",
          name: "cursor",
        }),
      },
    });
  };

  export const create = (data: EmployeeRolesModels.EmployeeRoleCreateRequest, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.EmployeeRoleResponseSchema },
      `/employees/roles`,
      ZodExtended.parse(EmployeeRolesModels.EmployeeRoleCreateRequestSchema, data),
      config,
    );
  };

  export const labels = (search?: string, context?: CommonModels.EmployeeRoleContext, config?: AxiosRequestConfig) => {
    return AppRestClient.get({ resSchema: EmployeeRolesModels.LabelsResponseSchema }, `/employees/roles/labels`, {
      ...config,
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
        context: ZodExtended.parse(CommonModels.EmployeeRoleContextSchema.optional(), context, {
          type: "query",
          name: "context",
        }),
      },
    });
  };

  export const find = (roleId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: CommonModels.EmployeeRoleResponseSchema },
      `/employees/roles/${roleId}`,
      config,
    );
  };

  export const update = (
    roleId: string,
    data: EmployeeRolesModels.EmployeeRoleUpdateRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: CommonModels.EmployeeRoleResponseSchema },
      `/employees/roles/${roleId}`,
      ZodExtended.parse(EmployeeRolesModels.EmployeeRoleUpdateRequestSchema, data),
      config,
    );
  };

  export const deleteEmployeesRolesByRoleId = (roleId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
      { resSchema: CommonModels.StatusResponseDtoSchema },
      `/employees/roles/${roleId}`,
      undefined,
      config,
    );
  };

  export const paginatePermissions = (roleId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmployeeRolesModels.EmployeeRolesPaginatePermissionsResponseSchema },
      `/employees/roles/${roleId}/permissions`,
      config,
    );
  };

  export const togglePermission = (
    roleId: string,
    permission: string,
    data: EmployeeRolesModels.EmployeeRoleTogglePermissionRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/employees/roles/${roleId}/permissions/${permission}/toggle`,
      ZodExtended.parse(EmployeeRolesModels.EmployeeRoleTogglePermissionRequestSchema, data),
      config,
    );
  };

  export const copy = (roleId: string, data: EmployeeRolesModels.CopyEmployeeRoleDto, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.EmployeeRoleResponseSchema },
      `/employees/roles/${roleId}/copy`,
      ZodExtended.parse(EmployeeRolesModels.CopyEmployeeRoleDtoSchema, data),
      config,
    );
  };
}
