import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { DocumentTemplatesModels } from "./documentTemplates.models";

export namespace DocumentTemplatesApi {
  export const paginateLabels = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: DocumentTemplatesModels.DocumentTemplateLabelFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: DocumentTemplatesModels.DocumentTemplatesPaginateLabelsResponseSchema },
      `/offices/${officeId}/document-templates/paginate/labels`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(DocumentTemplatesModels.DocumentTemplatesPaginateLabelsOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(DocumentTemplatesModels.DocumentTemplateLabelFilterDtoSchema.optional(), filter, {
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

  export const list = (
    officeId: string,
    limit: number,
    order?: string,
    filter?: DocumentTemplatesModels.DocumentTemplateFilterDto,
    page?: number,
    cursor?: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: DocumentTemplatesModels.DocumentTemplatesListResponseSchema },
      `/offices/${officeId}/document-templates`,
      {
        ...config,
        params: {
          order: ZodExtended.parse(
            ZodExtended.sortExp(DocumentTemplatesModels.DocumentTemplatesListOrderParamEnumSchema).optional(),
            order,
            { type: "query", name: "order" },
          ),
          filter: ZodExtended.parse(DocumentTemplatesModels.DocumentTemplateFilterDtoSchema.optional(), filter, {
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

  export const create = (
    officeId: string,
    data: DocumentTemplatesModels.CreateDocumentTemplateRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates`,
      ZodExtended.parse(DocumentTemplatesModels.CreateDocumentTemplateRequestDTOSchema, data),
      config,
    );
  };

  export const findById = (documentTemplateId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}`,
      config,
    );
  };

  export const update = (
    documentTemplateId: string,
    officeId: string,
    data: DocumentTemplatesModels.UpdateDocumentTemplateRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}`,
      ZodExtended.parse(DocumentTemplatesModels.UpdateDocumentTemplateRequestDTOSchema, data),
      config,
    );
  };

  export const addRemarkBlock = (
    documentTemplateId: string,
    officeId: string,
    data: DocumentTemplatesModels.CreateRemarkBlockRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}/remark-blocks`,
      ZodExtended.parse(DocumentTemplatesModels.CreateRemarkBlockRequestDTOSchema, data),
      config,
    );
  };

  export const deleteRemarkBlock = (
    documentTemplateId: string,
    remarkBlockId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}/remark-blocks/${remarkBlockId}`,
      undefined,
      config,
    );
  };

  export const archive = (documentTemplateId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}/archive`,
      undefined,
      config,
    );
  };

  export const unarchive = (documentTemplateId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: DocumentTemplatesModels.DocumentTemplateResponseDTOSchema },
      `/offices/${officeId}/document-templates/${documentTemplateId}/unarchive`,
      undefined,
      config,
    );
  };
}
