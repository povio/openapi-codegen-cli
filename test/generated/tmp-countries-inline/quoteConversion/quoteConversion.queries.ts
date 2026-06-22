import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteConversionAcl } from "./quoteConversion.acl";
import { OpenApiQueryConfig, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { CommonModels } from "@/data/common/common.models";
import { QuoteConversionModels } from "./quoteConversion.models";

export namespace QuoteConversionQueries {
const convertQuoteToPosition = (officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto) => {
  return AppRestClient.post(
    { resSchema: QuoteConversionModels.PositionCoreResponseDtoSchema },
    `/offices/${officeId}/quotes/${quoteId}/convert`,
    ZodExtended.parse(QuoteConversionModels.ConvertQuoteToPositionRequestDtoSchema, data),
    
  );
};


export const moduleName = QueryModule.QuoteConversion;



/** 
 * Mutation `useConvertQuoteToPosition`
 * @summary Convert quote to position
 * @permission Requires `canUseConvertQuoteToPosition` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteConversionModels.ConvertQuoteToPositionRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<QuoteConversionModels.PositionCoreResponseDto> } Quote converted to position successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useConvertQuoteToPosition = (options?: AppMutationOptions<typeof convertQuoteToPosition, { officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteConversion>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteConversionAcl.canUseConvertQuoteToPosition({ officeId } ));
      return convertQuoteToPosition(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
