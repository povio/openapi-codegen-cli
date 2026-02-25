import { useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteConversionAcl } from "./quoteConversion.acl";
import { AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteConversionModels } from "./quoteConversion.models";
import { QuoteConversionApi } from "./quoteConversion.api";

export namespace QuoteConversionQueries {
export const moduleName = QueryModule.QuoteConversion;



/** 
 * Mutation `useConvertQuoteToPosition`
 * @summary Convert quote to position
 * @permission Requires `canUseConvertQuoteToPosition` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuoteConversionModels.ConvertQuoteToPositionRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<CommonModels.PositionCoreResponseDto> } Quote converted to position successfully
 * @statusCodes [201, 400, 401, 404]
 */
export const useConvertQuoteToPosition = (options?: AppMutationOptions<typeof QuoteConversionApi.convertQuoteToPosition, { officeId: string, quoteId: string, data: QuoteConversionModels.ConvertQuoteToPositionRequestDto }> & MutationEffectsOptions) => {
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteConversionAcl.canUseConvertQuoteToPosition({ officeId } ));
      return QuoteConversionApi.convertQuoteToPosition(officeId, quoteId, data)
    },
    ...options,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
