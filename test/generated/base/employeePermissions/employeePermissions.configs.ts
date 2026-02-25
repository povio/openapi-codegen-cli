import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { EmployeePermissionsModels } from "./employeePermissions.models";
import { EmployeePermissionsQueries } from "./employeePermissions.queries";
import { EmployeePermissionsAcl } from "./employeePermissions.acl";

export namespace EmployeePermissionsConfigs {
export const permissionsConfig = {
    meta: {
        title: "Permissions",
    },
    readAll: {
        acl: EmployeePermissionsAcl.canUsePaginatePermissions,
        schema: EmployeePermissionsModels.EmployeePermissionResponseSchema,
        paginated: EmployeePermissionsQueries.usePaginatePermissions,
        infinite: EmployeePermissionsQueries.usePaginatePermissionsInfinite,
        filters: {
            schema: EmployeePermissionsModels.EmployeePermissionFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: EmployeePermissionsModels.EmployeePermissionFilterDtoSchema,
  options: {
    inputs: {
      context: true,
      ids: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: EmployeePermissionsModels.EmployeePermissionResponseSchema,
  options: {
    columns: {
      id: true,
      label: true,
      group: true,
      description: true,
      context: true,
    },
    sortable: EmployeePermissionsModels.EmployeePermissionsPaginatePermissionsOrderParamEnumSchema,
  },
}),
    },
};

}
