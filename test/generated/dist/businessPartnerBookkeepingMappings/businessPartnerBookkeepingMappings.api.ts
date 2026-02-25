import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnerBookkeepingMappingsModels } from "./businessPartnerBookkeepingMappings.models";

export namespace BusinessPartnerBookkeepingMappingsApi {
  export const getBookkeepingMappings = (officeId: string, businessPartnerId: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
      { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingsResponseDtoSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
      config,
    );
  };
  export const createBookkeepingMapping = (
    officeId: string,
    businessPartnerId: string,
    data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.post(
      { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
      ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDtoSchema, data),
      config,
    );
  };
  export const updateBookkeepingMapping = (
    officeId: string,
    businessPartnerId: string,
    data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingResponseSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
      ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDtoSchema, data),
      config,
    );
  };
  export const updateBookkeepingMappingById = (
    officeId: string,
    businessPartnerId: string,
    id: string,
    data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.patch(
      { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
      `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
      ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDtoSchema, data),
      config,
    );
  };
  export const deleteBookkeepingMapping = (
    officeId: string,
    businessPartnerId: string,
    id: string,
    config?: AxiosRequestConfig,
  ) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
      undefined,
      config,
    );
  };
}
