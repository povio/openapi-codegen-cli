import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { useMutationEffects, type MutationEffectsOptions } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
import { QuoteConversionAcl } from "./quoteConversion.acl";
import { OpenApiQueryConfig, type AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteConversionModels } from "./quoteConversion.models";
import { QuoteConversionApi } from "./quoteConversion.api";

export namespace QuoteConversionQueries {
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
export const useConvertQuoteToPosition = (options?: AppMutationOptions<typeof QuoteConversionApi.convertQuoteToPosition, { officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteConversion>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteConversionAcl.canUseConvertQuoteToPosition({ officeId } ));
      return QuoteConversionApi.convertQuoteToPosition(officeId, quoteId, data)
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
