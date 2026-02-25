import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { WorkingDocumentsHouseBlModels } from "./workingDocumentsHouseBl.models";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsHouseBlApi {
  export const create = (positionId: string, officeId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/house-bls`,
      undefined,
      config,
    );
  };
  export const getHouseBlData = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
      config,
    );
  };
  export const updateHouseBlData = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    data: WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTO,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: WorkingDocumentsHouseBlModels.HouseBlDocumentResponseDTOSchema },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
      ZodExtended.parse(WorkingDocumentsHouseBlModels.UpdateHouseBlDocumentRequestDTOSchema, data),
      config,
    );
  };
  export const deleteHouseBl = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}`,
      undefined,
      config,
    );
  };
  export const previewHouseBl = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview`,
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
  export const previewHouseBlEml = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/preview/eml`,
      {
        ...config,
        headers: {
          Accept: "application/octet-stream",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
  export const generateHouseBl = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/generate`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      config,
    );
  };
  export const generateDocumentEml = (
    positionId: string,
    houseBlId: string,
    officeId: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/house-bls/${houseBlId}/eml`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      {
        ...config,
        headers: {
          Accept: "application/octet-stream",
        },
        responseType: "blob",
        rawResponse: true,
      },
    );
  };
}
