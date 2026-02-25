import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { BusinessPartnerBookkeepingMappingsModels } from "./businessPartnerBookkeepingMappings.models";

export namespace BusinessPartnerBookkeepingMappingsApi {
export const getBookkeepingMappings = (officeId: string, businessPartnerId: string, ) => {
    return AppRestClient.get(
        { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingsResponseDtoSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
        
    )
};
export const createBookkeepingMapping = (officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDto, ) => {
    return AppRestClient.post(
        { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
        ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.CreateBookkeepingMappingDtoSchema, data),
        
    )
};
export const updateBookkeepingMapping = (officeId: string, businessPartnerId: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingResponseSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings`,
        ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingRequestDtoSchema, data),
        
    )
};
export const updateBookkeepingMappingById = (officeId: string, businessPartnerId: string, id: string, data: BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDto, ) => {
    return AppRestClient.patch(
        { resSchema: BusinessPartnerBookkeepingMappingsModels.BusinessPartnerBookkeepingMappingResponseDtoSchema },
        `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
        ZodExtended.parse(BusinessPartnerBookkeepingMappingsModels.UpdateBookkeepingMappingDtoSchema, data),
        
    )
};
export const deleteBookkeepingMapping = (officeId: string, businessPartnerId: string, id: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/business-partners/${businessPartnerId}/bookkeeping-mappings/${id}`,
        
    )
};
}
