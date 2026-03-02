import { AppRestClient } from "@/data/app-rest-client";
import { ZodExtended } from "@povio/openapi-codegen-cli/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "@/data/queryModules";
import { MutationEffectsOptions, useMutationEffects } from "@povio/openapi-codegen-cli";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { EmployeeProfileModels } from "./employeeProfile.models";

export namespace EmployeeProfileQueries {
const getProfile = () => {
  return AppRestClient.get(
    { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
    `/employee-profile`,
    
  );
};

const updateProfile = (data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO) => {
  return AppRestClient.patch(
    { resSchema: EmployeeProfileModels.EmployeeProfileResponseDTOSchema },
    `/employee-profile`,
    ZodExtended.parse(EmployeeProfileModels.UpdateEmployeeProfileRequestDTOSchema, data),
    
  );
};


export const moduleName = QueryModule.EmployeeProfile;

export const keys = {
    all: [moduleName] as const,
    getProfile: () => [...keys.all, "/employee-profile", ] as const,
};

/** 
 * Query `useGetProfile`
 * @summary Get employee profile
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<EmployeeProfileModels.EmployeeProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useGetProfile = <TData>(options?: AppQueryOptions<typeof getProfile, TData>) => {
  
  return useQuery({
    queryKey: keys.getProfile(),
    queryFn: getProfile,
    ...options,
  });
};

/** 
 * Mutation `useUpdateProfile`
 * @summary Update employee profile
 * @param { EmployeeProfileModels.UpdateEmployeeProfileRequestDTO } data Body parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<EmployeeProfileModels.EmployeeProfileResponseDTO> } 
 * @statusCodes [200, 401]
 */
export const useUpdateProfile = (options?: AppMutationOptions<typeof updateProfile, { data: EmployeeProfileModels.UpdateEmployeeProfileRequestDTO }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects<typeof QueryModule.EmployeeProfile>({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      updateProfile(data)
,
    ...options,
    onError: options?.onError ?? queryConfig.onError,
    onSuccess: async (resData, variables, onMutateResult, context) => {
      const updateKeys = [keys.getProfile()];
      await runMutationEffects(resData, variables, options, updateKeys);
      options?.onSuccess?.(resData, variables, onMutateResult, context);
    },
  });
};

}
