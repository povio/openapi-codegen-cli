import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryModule } from "../queryModules";
import { MutationEffectsOptions, useMutationEffects } from "../useMutationEffects";
import { OpenApiQueryConfig, AppQueryOptions, AppMutationOptions } from "@povio/openapi-codegen-cli";
import { PetModels } from "./pet.models";
import { PetApi } from "./pet.api";

export namespace PetQueries {
export const moduleName = QueryModule.pet;

export const keys = {
    all: [moduleName] as const,
    findByStatus: (status?: PetModels.FindByStatusStatusParam) => [...keys.all, "/pet/findByStatus", status] as const,
    findByTags: (tags?: PetModels.FindByTagsTagsParam) => [...keys.all, "/pet/findByTags", tags] as const,
    getById: (petId: number) => [...keys.all, "/pet/:petId", petId] as const,
};

/** 
 * Mutation `useUpdate`
 * @summary Update an existing pet
 * @description Update an existing pet by Id
 * @param { PetModels.Pet } mutation.data Body parameter. Update an existent pet in the store
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PetModels.Pet> } Successful operation
 * @statusCodes [200, 400, 404, 405]
 */
export const useUpdate = (options?: AppMutationOptions<typeof PetApi.update, { data: PetModels.Pet }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      PetApi.update(data)
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
 * Mutation `useAdd`
 * @summary Add a new pet to the store
 * @description Add a new pet to the store
 * @param { PetModels.Pet } mutation.data Body parameter. Create a new pet in the store
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PetModels.Pet> } Successful operation
 * @statusCodes [200, 405]
 */
export const useAdd = (options?: AppMutationOptions<typeof PetApi.add, { data: PetModels.Pet }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ data }) => 
      PetApi.add(data)
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
 * Query `useFindByStatus`
 * @summary Finds Pets by status
 * @description Multiple status values can be provided with comma separated strings
 * @param { PetModels.FindByStatusStatusParam } object.status Query parameter. Status values that need to be considered for filter. Default: `available`
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PetModels.FindByStatusResponse> } Successful operation
 * @statusCodes [200, 400]
 */
export const useFindByStatus = <TData>({ status }: { status?: PetModels.FindByStatusStatusParam }, options?: AppQueryOptions<typeof PetApi.findByStatus, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findByStatus(status),
    queryFn: () => 
    PetApi.findByStatus(status),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useFindByTags`
 * @summary Finds Pets by tags
 * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 * @param { PetModels.FindByTagsTagsParam } object.tags Query parameter. Tags to filter by
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PetModels.FindByTagsResponse> } Successful operation
 * @statusCodes [200, 400]
 */
export const useFindByTags = <TData>({ tags }: { tags?: PetModels.FindByTagsTagsParam }, options?: AppQueryOptions<typeof PetApi.findByTags, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.findByTags(tags),
    queryFn: () => 
    PetApi.findByTags(tags),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Query `useGetById`
 * @summary Find pet by ID
 * @description Returns a single pet
 * @param { number } object.petId Path parameter. ID of pet to return
 * @param { AppQueryOptions } options Query options
 * @returns { UseQueryResult<PetModels.Pet> } Successful operation
 * @statusCodes [200, 400, 404]
 */
export const useGetById = <TData>({ petId }: { petId: number }, options?: AppQueryOptions<typeof PetApi.getById, TData>) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  
  return useQuery({
    queryKey: keys.getById(petId),
    queryFn: () => 
    PetApi.getById(petId),
    ...options,
    onError: options?.onError ?? queryConfig.onError,
  });
};

/** 
 * Mutation `useUpdateWithForm`
 * @summary Updates a pet in the store with form data
 * @param { number } mutation.petId Path parameter. ID of pet that needs to be updated
 * @param { string } mutation.name Query parameter. Name of pet that needs to be updated
 * @param { string } mutation.status Query parameter. Status of pet that needs to be updated
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [405]
 */
export const useUpdateWithForm = (options?: AppMutationOptions<typeof PetApi.updateWithForm, { petId: number, name: string, status: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ petId, name, status }) => 
      PetApi.updateWithForm(petId, name, status)
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
 * Mutation `useDeletePet`
 * @summary Deletes a pet
 * @description delete a pet
 * @param { number } mutation.petId Path parameter. Pet id to delete
 * @param { string } mutation.api_key Header parameter
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<void> } 
 * @statusCodes [400]
 */
export const useDeletePet = (options?: AppMutationOptions<typeof PetApi.deletePet, { petId: number, api_key?: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ petId, api_key }) => 
      PetApi.deletePet(petId, api_key)
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
 * Mutation `useUploadFile`
 * @summary uploads an image
 * @param { number } mutation.petId Path parameter. ID of pet to update
 * @param { string } mutation.data Body parameter
 * @param { string } mutation.additionalMetadata Query parameter. Additional Metadata
 * @param { AppMutationOptions & MutationEffectsOptions } options Mutation options
 * @returns { UseMutationResult<PetModels.ApiResponse> } Successful operation
 * @statusCodes [200]
 */
export const useUploadFile = (options?: AppMutationOptions<typeof PetApi.uploadFile, { petId: number, data: string, additionalMetadata?: string }> & MutationEffectsOptions) => {
  const queryConfig = OpenApiQueryConfig.useConfig();
  const { runMutationEffects } = useMutationEffects({ currentModule: moduleName });

  return useMutation({
    mutationFn: ({ petId, data, additionalMetadata }) => 
      PetApi.uploadFile(petId, data, additionalMetadata)
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
