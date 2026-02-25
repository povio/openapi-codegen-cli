import { AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@/data/useMutationEffects";
import { AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeProfileModels } from "./employeeProfile.models";
import { EmployeeProfileApi } from "./employeeProfile.api";

export namespace EmployeeProfileQueries {
  export const moduleName = QueryModule.EmployeeProfile;

  export const keys = {
    all: [moduleName] as const,
    getProfile: () => [...keys.all, "/employee-profile"] as const,
  };

  /**
   * Query `useGetProfile`
   * @summary Get employee profile
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<EmployeeProfileModels.EmployeeProfileResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useGetProfile = <TData>(
    options?: AppQueryOptions<typeof EmployeeProfileApi.getProfile, TData>,
    config?: AxiosRequestConfig,
  ) => {
    return useQuery({
      queryKey: keys.getProfile(),
      queryFn: () => EmployeeProfileApi.getProfile(config),
      ...options,
    });
  };

  /**
   * Mutation `useUpdateProfile`
   * @summary Update employee profile
   * @param { EmployeeProfileModels.UpdateEmployeeProfileRequestDTO } mutation.data Body parameter
   * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
   * @returns { UseMutationResult<EmployeeProfileModels.EmployeeProfileResponseDTO> }
   * @statusCodes [200, 401]
   */
  export const useUpdateProfile = (
    options?: AppMutationOptions<
      typeof EmployeeProfileApi.updateProfile,
      { data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO }
    > &
      MutationEffectsOptions,
    config?: AxiosRequestConfig,
  ) => {
    const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

    return useMutation({
      mutationFn: ({ data }) => EmployeeProfileApi.updateProfile(data, config),
      ...options,
      onSuccess: async (resData, variables, onMutateResult, context) => {
        const updateKeys = [keys.getProfile()];
        await runMutationEffects(resData, variables, options, updateKeys);
        options?.onSuccess?.(resData, variables, onMutateResult, context);
      },
    });
  };
}
