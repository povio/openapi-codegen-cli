import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "../queryModules";
import { MutationEffectsOptions, useMutationEffects } from "../useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { StoreModels } from "./store.models";
import { StoreApi } from "./store.api";

export namespace StoreQueries {
export const moduleName = QueryModule.store;

export const keys = {
    all: [moduleName] as const,
    getInventory: () => [...keys.all, "/store/inventory", ] as const,
    getOrderById: (orderId: number) => [...keys.all, "/store/order/:orderId", orderId] as const,
};

/** 
 * Query `useGetInventory`
 * @summary Returns pet inventories by status
 * @description Returns a map of status codes to quantities
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<StoreModels.GetInventoryResponse> } Successful operation
 * @statusCodes [200]
 */
export const useGetInventory = <TData>(options?: AppQueryOptions<typeof StoreApi.getInventory, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getInventory(),
    queryFn: StoreApi.getInventory,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `usePlaceOrder`
 * @summary Place an order for a pet
 * @description Place a new order in the store
 * @param { StoreModels.Order } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<StoreModels.Order> } Successful operation
 * @statusCodes [200, 405]
 */
export const usePlaceOrder = (options?: AppMutationOptions<typeof StoreApi.placeOrder, { data: StoreModels.Order }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      StoreApi.placeOrder(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Query `useGetOrderById`
 * @summary Find purchase order by ID
 * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
 * @param { number } object.orderId Path parameter. ID of order that needs to be fetched
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<StoreModels.Order> } Successful operation
 * @statusCodes [200, 400, 404]
 */
export const useGetOrderById = <TData>({ orderId }: { orderId: number }, options?: AppQueryOptions<typeof StoreApi.getOrderById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getOrderById(orderId),
    queryFn: () => 
    StoreApi.getOrderById(orderId),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useDeleteOrder`
 * @summary Delete purchase order by ID
 * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
 * @param { number } mutation.orderId Path parameter. ID of the order that needs to be deleted
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [400, 404]
 */
export const useDeleteOrder = (options?: AppMutationOptions<typeof StoreApi.deleteOrder, { orderId: number }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ orderId }) => 
      StoreApi.deleteOrder(orderId)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      await runMutationEffects(resData, variables, options);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
