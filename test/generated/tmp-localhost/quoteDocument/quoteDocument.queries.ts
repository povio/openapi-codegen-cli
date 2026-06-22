import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { useAclCheck } from "@/data/acl/useAclCheck";
import { QuoteDocumentAcl } from "./quoteDocument.acl";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { QuoteDocumentModels } from "./quoteDocument.models";
import { QuoteDocumentApi } from "./quoteDocument.api";

export namespace QuoteDocumentQueries {
export const moduleName = QueryModule.QuoteDocument;

export const keys = {
    all: [moduleName] as const,
    get: (officeId: string, quoteId: string) => [...keys.all, "/offices/:officeId/quotes/:quoteId/document", officeId, quoteId] as const,
};

/** 
 * Query `useGet`
 * @summary Get quote document
 * @permission Requires `canUseGet` ability 
 * @param { string } object.officeId Path parameter
 * @param { string } object.quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteDocumentModels.QuoteDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteDocumentApi.get, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    queryKey: keys.get(officeId, quoteId),
    queryFn: () => { 
    checkAcl(QuoteDocumentAcl.canUseGet({ officeId } ));
    return QuoteDocumentApi.get(officeId, quoteId) },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update quote document
 * @permission Requires `canUseUpdate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuoteDocumentModels.UpdateQuoteDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof QuoteDocumentApi.update, { officeId: string, quoteId: string, data: QuoteDocumentModels.UpdateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteDocumentAcl.canUseUpdate({ officeId } ));
      return QuoteDocumentApi.update(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGetPreview` - recommended when file should not be cached
 * @summary Get quote document pdf preview
 * @permission Requires `canUseGetPreview` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGetPreview = (options?: AppMutationOptions<typeof QuoteDocumentApi.getPreview, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteDocumentAcl.canUseGetPreview({ officeId } ));
      return QuoteDocumentApi.getPreview(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerate`
 * @summary Get quote document pdf preview
 * @permission Requires `canUseGenerate` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof QuoteDocumentApi.generate, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteDocumentAcl.canUseGenerate({ officeId } ));
      return QuoteDocumentApi.generate(officeId, quoteId, data)
    },
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useGenerateEml` - recommended when file should not be cached
 * @summary Generate quote document and return EML file
 * @permission Requires `canUseGenerateEml` ability 
 * @param { string } mutation.officeId Path parameter
 * @param { string } mutation.quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentRequestDto } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateEml = (options?: AppMutationOptions<typeof QuoteDocumentApi.generateEml, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ officeId, quoteId, data }) => { 
      checkAcl(QuoteDocumentAcl.canUseGenerateEml({ officeId } ));
      return QuoteDocumentApi.generateEml(officeId, quoteId, data)
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
