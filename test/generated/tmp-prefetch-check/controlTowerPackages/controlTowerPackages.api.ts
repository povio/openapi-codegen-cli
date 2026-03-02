import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { ControlTowerPackagesModels } from "./controlTowerPackages.models";

export namespace ControlTowerPackagesApi {
export const findAll = (limit: number, order?: string, filter?: ControlTowerPackagesModels.PackageFilterDto, page?: number, cursor?: string, ) => {
    return AppRestClient.get(
        { resSchema: ControlTowerPackagesModels.ControlTowerPackagesFindAllResponseSchema },
        `/packages`,
        {
            params: {
                order: ZodExtended.parse(ZodExtended.sortExp(ControlTowerPackagesModels.ControlTowerPackagesFindAllOrderParamEnumSchema).optional(), order, { type: "query", name: "order" }),
                filter: ZodExtended.parse(ControlTowerPackagesModels.PackageFilterDtoSchema.optional(), filter, { type: "query", name: "filter" }),
                limit: ZodExtended.parse(z.number().gte(1).lte(100).default(20), limit, { type: "query", name: "limit" }),
                page: ZodExtended.parse(z.number().nullish(), page, { type: "query", name: "page" }),
                cursor: ZodExtended.parse(z.string().nullish(), cursor, { type: "query", name: "cursor" }),
            },
        }
    )
};
}
