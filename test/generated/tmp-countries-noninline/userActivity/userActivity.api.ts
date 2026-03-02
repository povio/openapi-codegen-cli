import { AppRestClient } from "@/data/app-rest-client";
import { z } from "zod";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { UserActivityModels } from "./userActivity.models";

export namespace UserActivityApi {
export const get = (officeId: string, entityType: string, entityId: string, activeThresholdMinutes?: number, ) => {
    return AppRestClient.get(
        { resSchema: UserActivityModels.UserActivityResponseDtoSchema },
        `/offices/${officeId}/${entityType}/${entityId}/activity`,
        {
            params: {
                activeThresholdMinutes: ZodExtended.parse(z.number().gte(1).nullish(), activeThresholdMinutes, { type: "query", name: "activeThresholdMinutes" }),
            },
        }
    )
};
}
