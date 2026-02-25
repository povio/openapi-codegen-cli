import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ShippingInstructionsModels } from "./shippingInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace ShippingInstructionsApi {
  export const create = (officeId: string, positionId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.post(
      { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions`,
      undefined,
      config,
    );
  };
  export const get = (officeId: string, positionId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
      config,
    );
  };
  export const update = (
    officeId: string,
    positionId: string,
    id: string,
    data: ShippingInstructionsModels.UpdateShippingInstructionsRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
      ZodExtended.parse(ShippingInstructionsModels.UpdateShippingInstructionsRequestDtoSchema, data),
      config,
    );
  };
  export const deleteOfficesPositionsShippingInstructionsById = (
    officeId: string,
    positionId: string,
    id: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
      undefined,
      config,
    );
  };
  export const preview = (officeId: string, positionId: string, id: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/preview`,
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
  export const generate = (
    officeId: string,
    positionId: string,
    id: string,
    data: CommonModels.GenerateWorkingDocumentRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: z.void() },
      `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/generate`,
      ZodExtended.parse(CommonModels.GenerateWorkingDocumentRequestDtoSchema, data),
      config,
    );
  };
}
