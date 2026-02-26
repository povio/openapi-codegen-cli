import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "../queryModules";
import { MutationEffectsOptions, useMutationEffects } from "../useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { UserModels } from "./user.models";
import { UserApi } from "./user.api";

export namespace UserQueries {
export const moduleName = QueryModule.user;

export const keys = {
    all: [moduleName] as const,
    login: (username?: string, password?: string) => [...keys.all, "/user/login", username, password] as const,
    logout: () => [...keys.all, "/user/logout", ] as const,
    getByName: (username: string) => [...keys.all, "/user/:username", username] as const,
};

/** 
 * Mutation `useCreate`
 * @summary Create user
 * @description This can only be done by the logged in user.
 * @param { UserModels.User } mutation.data Body parameter. Created user object
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [default]
 */
export const useCreate = (options?: AppMutationOptions<typeof UserApi.create, { data: UserModels.User }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      UserApi.create(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const updateKeys = [keys.logout()];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useCreateWithListInput`
 * @summary Creates list of users with given input array
 * @description Creates list of users with given input array
 * @param { UserModels.CreateWithListInputBody } mutation.data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<UserModels.User> } Successful operation
 * @statusCodes [200, default]
 */
export const useCreateWithListInput = (options?: AppMutationOptions<typeof UserApi.createWithListInput, { data: UserModels.CreateWithListInputBody }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      UserApi.createWithListInput(data)
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
 * Query `useLogin`
 * @summary Logs user into the system
 * @param { string } object.username Query parameter. The user name for login
 * @param { string } object.password Query parameter. The password for login in clear text
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<z.string()> } Successful operation
 * @statusCodes [200, 400]
 */
export const useLogin = <TData>({ username, password }: { username?: string, password?: string }, options?: AppQueryOptions<typeof UserApi.login, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.login(username, password),
    queryFn: () => 
    UserApi.login(username, password),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useLogout`
 * @summary Logs out current logged in user session
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<void> } 
 * @statusCodes [default]
 */
export const useLogout = <TData>(options?: AppQueryOptions<typeof UserApi.logout, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.logout(),
    queryFn: UserApi.logout,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useGetByName`
 * @summary Get user by user name
 * @param { string } object.username Path parameter. The name that needs to be fetched. Use user1 for testing. 
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<UserModels.User> } Successful operation
 * @statusCodes [200, 400, 404]
 */
export const useGetByName = <TData>({ username }: { username: string }, options?: AppQueryOptions<typeof UserApi.getByName, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getByName(username),
    queryFn: () => 
    UserApi.getByName(username),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdate`
 * @summary Update user
 * @description This can only be done by the logged in user.
 * @param { string } mutation.username Path parameter. name that need to be deleted
 * @param { UserModels.User } mutation.data Body parameter. Update an existent user in the store
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [default]
 */
export const useUpdate = (options?: AppMutationOptions<typeof UserApi.update, { username: string, data: UserModels.User }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ username, data }) => 
      UserApi.update(username, data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const updateKeys = [keys.logout()];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

/** 
 * Mutation `useDeleteUser`
 * @summary Delete user
 * @description This can only be done by the logged in user.
 * @param { string } mutation.username Path parameter. The name that needs to be deleted
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [400, 404]
 */
export const useDeleteUser = (options?: AppMutationOptions<typeof UserApi.deleteUser, { username: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ username }) => 
      UserApi.deleteUser(username)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const updateKeys = [keys.logout()];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
