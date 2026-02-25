import { AppRestClient } from "@/data/app-rest-client";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { ZodExtended } from "@/data/zod.extended";
import { ControlTowerPackagesModels } from "./controlTowerPackages.models";

export namespace ControlTowerPackagesApi {
export const findAll = (limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string, config?: AxiosRequestConfig) => {
    return AppRestClient.get(
        { resSchema: ControlTowerPackagesModels.ControlTowerPackagesFindAllResponseSchema },
        `/packages`,
        {
            ...config,
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerPackagesModels.ControlTowerPackagesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ControlTowerPackagesModels.PackageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).describe("Items per response").default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().describe("1-indexed page number to begin from").nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().describe("ID of item to start after").nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
