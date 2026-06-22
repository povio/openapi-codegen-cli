import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { PackageTypesModels } from "./packageTypes.models";
import { PackageTypesQueries } from "./packageTypes.queries";
import { PackageTypesAcl } from "./packageTypes.acl";

export namespace PackageTypesConfigs {
export const packageTypesConfig = {
    meta: {
        title: "Package Types",
    },
    readAll: {
        acl: PackageTypesAcl.canUsePaginate,
        schema: PackageTypesModels.PackageTypeResponseDTOSchema,
        paginated: PackageTypesQueries.usePaginate,
        infinite: PackageTypesQueries.usePaginateInfinite,
        filters: {
            schema: PackageTypesModels.PackageTypePaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PackageTypesModels.PackageTypePaginationFilterDtoSchema,
  options: {
    inputs: {
      archived: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: PackageTypesModels.PackageTypeResponseDTOSchema,
  options: {
    columns: {
      id: true,
      name: true,
      length: true,
      width: true,
      height: true,
      unit: true,
      archived: true,
      code: true,
      createdById: true,
      createdBy: true,
      createdAt: true,
      updatedById: true,
      updatedBy: true,
      updatedAt: true,
    },
    sortable: PackageTypesModels.PackageTypesPaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: PackageTypesAcl.canUseFindById,
        schema: PackageTypesModels.PackageTypeResponseDTOSchema,
        query: PackageTypesQueries.useFindById,
    },
    create: {
        acl: PackageTypesAcl.canUseCreate,
        schema: PackageTypesModels.CreatePackageTypeRequestDTOSchema,
        mutation: PackageTypesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: PackageTypesModels.CreatePackageTypeRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      length: true,
      width: true,
      height: true,
      unit: true,
      code: true,
    },
  },
})
    },
    update: {
        acl: PackageTypesAcl.canUseUpdate,
        schema: PackageTypesModels.UpdatePackageTypeRequestDTOSchema,
        mutation: PackageTypesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: PackageTypesModels.UpdatePackageTypeRequestDTOSchema,
  options: {
    inputs: {
      name: true,
      length: true,
      width: true,
      height: true,
      unit: true,
      code: true,
    },
  },
})
    },
};

export const labelsConfig = {
    meta: {
        title: "Labels",
    },
    readAll: {
        acl: PackageTypesAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: PackageTypesQueries.usePaginateLabels,
        infinite: PackageTypesQueries.usePaginateLabelsInfinite,
        filters: {
            schema: PackageTypesModels.PackageTypeLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: PackageTypesModels.PackageTypeLabelFilterDtoSchema,
  options: {
    inputs: {
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CommonModels.LabelResponseDTOSchema,
  options: {
    columns: {
      id: true,
      label: true,
    },
    sortable: PackageTypesModels.PackageTypesPaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
