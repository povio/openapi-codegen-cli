import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { CommonModels } from "@/data/common/common.models";
import { EmploymentModels } from "./employment.models";

export namespace EmploymentApi {
  export const create = (data: EmploymentModels.EmploymentCreateRequest, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.EmploymentResponseSchema },
      `/employees/employments`,
      ZodExtended.parse(EmploymentModels.EmploymentCreateRequestSchema, data),
      config,
    );
  };

  export const list = (
    limit: number,
    order?: string,
    populate?: EmploymentModels.EmploymentListPopulateParam,
    filter?: EmploymentModels.EmploymentFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get({ resSchema: EmploymentModels.EmploymentListResponseSchema }, `/employees/employments`, {
      ...config,
      params: {
        order: ZodExtended.parse(
          ZodExtended.sortExp(EmploymentModels.EmploymentListOrderParamEnumSchema).optional(),
          order,
          { type: "query", name: "order" },
        ),
        populate: ZodExtended.parse(EmploymentModels.EmploymentListPopulateParamSchema.optional(), populate, {
          type: "query",
          name: "populate",
        }),
        filter: ZodExtended.parse(EmploymentModels.EmploymentFilterDtoSchema.optional(), filter, {
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

  export const listRoles = (officeId: string, employmentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: EmploymentModels.EmploymentListRolesResponseSchema },
      `/offices/${officeId}/employments/${employmentId}/roles`,
      config,
    );
  };

  export const updateRoles = (
    officeId: string,
    employmentId: string,
    data: EmploymentModels.EmploymentRoleMembershipsUpdateRequest,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.put(
      { resSchema: EmploymentModels.EmploymentUpdateRolesResponseSchema },
      `/offices/${officeId}/employments/${employmentId}/roles`,
      ZodExtended.parse(EmploymentModels.EmploymentRoleMembershipsUpdateRequestSchema, data),
      config,
    );
  };

  export const update = (
    officeId: string,
    employmentId: string,
    data: EmploymentModels.UpdateEmploymentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: CommonModels.EmploymentResponseSchema },
      `/offices/${officeId}/employments/${employmentId}`,
      ZodExtended.parse(EmploymentModels.UpdateEmploymentRequestDtoSchema, data),
      config,
    );
  };

  export const archive = (officeId: string, employmentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.EmploymentResponseSchema },
      `/offices/${officeId}/employments/${employmentId}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (officeId: string, employmentId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: CommonModels.EmploymentResponseSchema },
      `/offices/${officeId}/employments/${employmentId}/unarchive`,
      undefined,
      config,
    );
  };
}
