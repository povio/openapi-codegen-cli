import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ShippingInstructionsModels } from "./shippingInstructions.models";
import { CommonModels } from "@/data/common/common.models";

export namespace ShippingInstructionsApi {
export const create = (officeId: string, positionId: string, ) => {
    return AppRestClient.post(
        { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions`,
        
    )
};
export const get = (officeId: string, positionId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
        
    )
};
export const update = (officeId: string, positionId: string, id: string, data: ShippingInstructionsModels.UpdateShippingInstructionsRequestDto, ) => {
    return AppRestClient.patch(
        { resSchema: ShippingInstructionsModels.ShippingInstructionsResponseDtoSchema },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
        ZodExtended.parse(ShippingInstructionsModels.UpdateShippingInstructionsRequestDtoSchema, data),
        
    )
};
export const deleteOfficesPositionsShippingInstructionsById = (officeId: string, positionId: string, id: string, ) => {
    return AppRestClient.delete(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}`,
        
    )
};
export const preview = (officeId: string, positionId: string, id: string, ) => {
    return AppRestClient.get(
        { resSchema: z.instanceof(Blob) },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/preview`,
        {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: "blob",
            rawResponse: true,
        }
    )
};
export const generate = (officeId: string, positionId: string, id: string, data: ShippingInstructionsModels.GenerateWorkingDocumentRequestDto, ) => {
    return AppRestClient.post(
        { resSchema: z.void() },
        `/offices/${officeId}/positions/${positionId}/shipping-instructions/${id}/generate`,
        ZodExtended.parse(ShippingInstructionsModels.GenerateWorkingDocumentRequestDtoSchema, data),
        
    )
};
}
