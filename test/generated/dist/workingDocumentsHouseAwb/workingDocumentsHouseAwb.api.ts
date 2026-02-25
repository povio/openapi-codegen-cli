import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsHouseAwbModels } from "./workingDocumentsHouseAwb.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseAwbApi {
  export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/hawbs`,
      undefined,
      config,
    );
  };
  export const getHouseAwbData = (
    positionId: string,
    hawbId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
      config,
    );
  };
  export const updateHouseAwbData = (
    positionId: string,
    hawbId: string,
    officeId: string,
    data: WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: WorkingDocumentsHouseAwbModels.HouseAwbDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
      ZodExtended.parse(WorkingDocumentsHouseAwbModels.UpdateHouseAwbDocumentRequestDTOSchema, data),
      config,
    );
  };
  export const deleteHouseAwb = (positionId: string, hawbId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}`,
      undefined,
      config,
    );
  };
  export const previewHouseAwb = (
    positionId: string,
    hawbId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/preview`,
      {
        ...config,
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
  export const generateHouseAwb = (
    positionId: string,
    hawbId: string,
    officeId: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/hawbs/${hawbId}/generate`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      config,
    );
  };
}
