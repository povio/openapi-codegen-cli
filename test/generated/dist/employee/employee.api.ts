import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { EmployeeModels } from "./employee.models";
import { CommonModels } from "@/data/common/common.models";

export namespace EmployeeApi {
  export const paginate = (
    limit: number,
    order?: string,
    populate?: EmployeeModels.EmployeePaginatePopulateParam,
    filter?: EmployeeModels.EmployeeFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: EmployeeModels.EmployeePaginateResponseSchema }, `/employees`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(EmployeeModels.EmployeePaginateOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        populate: ZodExtended.parse(EmployeeModels.EmployeePaginatePopulateParamSchema.optional(), populate, {
          type: "query",
          name: "populate",
        }),
        filter: ZodExtended.parse(EmployeeModels.EmployeeFilterDtoSchema.optional(), filter, {
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
  export const create = (data: EmployeeModels.EmployeeCreateRequest, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/employees`,
      ZodExtended.parse(EmployeeModels.EmployeeCreateRequestSchema, data),
      config,
    );
  };
  export const singeStepCreate = (data: EmployeeModels.EmployeeOneStepCreateRequest, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/employees/one-step`,
      ZodExtended.parse(EmployeeModels.EmployeeOneStepCreateRequestSchema, data),
      config,
    );
  };
  export const findAll = (search?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get({ resSchema: EmployeeModels.EmployeeFindAllResponseSchema }, `/employees/labels`, {
      ...config,
      params: {
        search: ZodExtended.parse(z.string().nullish(), search, { type: "query", name: "search" }),
      },
    });
  };
  export const paginateLabels = (
    limit: number,
    order?: string,
    filter?: EmployeeModels.EmployeeLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: EmployeeModels.EmployeePaginateLabelsResponseSchema },
      `/employees/labels/paginate`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(EmployeeModels.EmployeePaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(EmployeeModels.EmployeeLabelFilterDtoSchema.optional(), filter, {
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
      },
    );
  };
  export const resendOnboarding = (employeeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.StatusResponseDtoSchema },
      `/employees/${employeeId}/resend-onboarding`,
      undefined,
      config,
    );
  };
  export const resendOnboardingWithOffice = (officeId: string, employeeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.StatusResponseDtoSchema },
      `/offices/${officeId}/employees/${employeeId}/resend-onboarding`,
      undefined,
      config,
    );
  };
  export const get = (
    employeeId: string,
    populate?: EmployeeModels.EmployeeGetPopulateParam,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: EmployeeModels.EmployeeResponseSchema }, `/employees/${employeeId}`, {
      ...config,
      params: {
        populate: ZodExtended.parse(EmployeeModels.EmployeeGetPopulateParamSchema.optional(), populate, {
          type: "query",
          name: "populate",
        }),
      },
    });
  };
  export const update = (
    employeeId: string,
    data: EmployeeModels.EmployeeUpdateRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/employees/${employeeId}`,
      ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
      config,
    );
  };
  export const getWithOffice = (
    officeId: string,
    employeeId: string,
    populate?: EmployeeModels.GetWithOfficePopulateParam,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/offices/${officeId}/employees/${employeeId}`,
      {
        ...config,
        params: {
          populate: ZodExtended.parse(EmployeeModels.GetWithOfficePopulateParamSchema.optional(), populate, {
            type: "query",
            name: "populate",
          }),
        },
      },
    );
  };
  export const updateWithOffice = (
    officeId: string,
    employeeId: string,
    data: EmployeeModels.EmployeeUpdateRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/offices/${officeId}/employees/${employeeId}`,
      ZodExtended.parse(EmployeeModels.EmployeeUpdateRequestSchema, data),
      config,
    );
  };
  export const listRoles = (employeeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmployeeModels.EmployeeListRolesResponseSchema },
      `/employees/${employeeId}/roles`,
      config,
    );
  };
  export const updateRoles = (
    employeeId: string,
    data: EmployeeModels.EmployeeRoleMembershipsUpdateRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: EmployeeModels.EmployeeUpdateRolesResponseSchema },
      `/employees/${employeeId}/roles`,
      ZodExtended.parse(EmployeeModels.EmployeeRoleMembershipsUpdateRequestSchema, data),
      config,
    );
  };
  export const archive = (employeeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/employees/${employeeId}/archive`,
      undefined,
      config,
    );
  };
  export const unarchive = (employeeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: EmployeeModels.EmployeeResponseSchema },
      `/employees/${employeeId}/unarchive`,
      undefined,
      config,
    );
  };
}
