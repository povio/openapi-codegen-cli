import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { useAclCheck } from "@povio/openapi-codegen-cli/acl";
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

const getQueryOptions = ({ officeId, quoteId }: { officeId: string, quoteId: string }) => ({
  queryKey: keys.get(officeId, quoteId),
  queryFn: () => QuoteDocumentApi.get(officeId, quoteId),
});

/** 
 * Query `useGet`
 * @summary Get quote document
 * @permission Requires `canUseGet` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<QuoteDocumentModels.QuoteDocumentResponseDto> } 
 * @statusCodes [200, 401]
 */
export const useGet = <TData>({ officeId, quoteId }: { officeId: string, quoteId: string }, options?: AppQueryOptions<typeof QuoteDocumentApi.get, TData>) => {
  const { checkAcl } = useAclCheck();
  
  return useQuery({
    ...getQueryOptions({ officeId, quoteId }),
    queryFn: async () => {
    checkAcl(QuoteDocumentAcl.canUseGet({ officeId } ));
      return getQueryOptions({ officeId, quoteId }).queryFn();
    },
    ...options,
  });
};

export const prefetchGet = (queryClient: QueryClient, { officeId, quoteId }: { officeId: string, quoteId: string }, options?: Omit<Parameters<QueryClient["prefetchQuery"]>[0], "queryKey" | "queryFn">): void => {
  void queryClient.prefetchQuery({ ...getQueryOptions({ officeId, quoteId }), ...options });
};

/** 
 * Mutation `useUpdate`
 * @summary Update quote document
 * @permission Requires `canUseUpdate` ability 
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteDocumentModels.UpdateQuoteDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [200, 401]
 */
export const useUpdate = (options?: AppMutationOptions<typeof QuoteDocumentApi.update, { officeId: string, quoteId: string, data: QuoteDocumentModels.UpdateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteDocument>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 201, 401]
 */
export const useGetPreview = (options?: AppMutationOptions<typeof QuoteDocumentApi.getPreview, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentPreviewRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteDocument>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [201, 401]
 */
export const useGenerate = (options?: AppMutationOptions<typeof QuoteDocumentApi.generate, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteDocument>({ currentModule: moduleName });

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
 * @param { string } officeId Path parameter
 * @param { string } quoteId Path parameter
 * @param { QuoteDocumentModels.GenerateQuoteDocumentRequestDto } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<AxiosResponse<z.instanceof(Blob)>> } 
 * @statusCodes [200, 401]
 */
export const useGenerateEml = (options?: AppMutationOptions<typeof QuoteDocumentApi.generateEml, { officeId: string, quoteId: string, data: QuoteDocumentModels.GenerateQuoteDocumentRequestDto }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { checkAcl } = useAclCheck();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.QuoteDocument>({ currentModule: moduleName });

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
