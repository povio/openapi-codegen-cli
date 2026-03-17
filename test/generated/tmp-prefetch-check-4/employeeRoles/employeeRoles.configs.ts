import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { EmployeeRolesModels } from "./employeeRoles.models";
import { CommonModels } from "@/data/common/common.models";
import { EmployeeRolesQueries } from "./employeeRoles.queries";
import { EmployeeRolesAcl } from "./employeeRoles.acl";

export namespace EmployeeRolesConfigs {
export const rolesConfig = {
    meta: {
        title: "Roles",
    },
    readAll: {
        acl: EmployeeRolesAcl.canUseList,
        schema: EmployeeRolesModels.EmployeeRoleListItemResponseSchema,
        paginated: EmployeeRolesQueries.useList,
        infinite: EmployeeRolesQueries.useListInfinite,
        filters: {
            schema: EmployeeRolesModels.EmployeeRolePaginationFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: EmployeeRolesModels.EmployeeRolePaginationFilterDtoSchema,
  options: {
    inputs: {
      name: true,
      context: true,
      search: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: EmployeeRolesModels.EmployeeRoleListItemResponseSchema,
  options: {
    columns: {
      id: true,
      name: true,
      color: true,
      description: true,
      context: true,
      permissions: true,
      numberOfUsers: true,
    },
    sortable: EmployeeRolesModels.EmployeeRolesListOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: EmployeeRolesAcl.canUseFind,
        schema: CommonModels.EmployeeRoleResponseSchema,
        query: EmployeeRolesQueries.useFind,
    },
    create: {
        acl: EmployeeRolesAcl.canUseCreate,
        schema: EmployeeRolesModels.EmployeeRoleCreateRequestSchema,
        mutation: EmployeeRolesQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: EmployeeRolesModels.EmployeeRoleCreateRequestSchema,
  options: {
    inputs: {
      name: true,
      color: true,
      description: true,
      context: true,
      permissions: true,
    },
  },
})
    },
    update: {
        acl: EmployeeRolesAcl.canUseUpdate,
        schema: EmployeeRolesModels.EmployeeRoleUpdateRequestSchema,
        mutation: EmployeeRolesQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: EmployeeRolesModels.EmployeeRoleUpdateRequestSchema,
  options: {
    inputs: {
      name: true,
      color: true,
      description: true,
    },
  },
})
    },
    delete: {
        acl: EmployeeRolesAcl.canUseDeleteEmployeesRolesByRoleId,
        mutation: EmployeeRolesQueries.useDeleteEmployeesRolesByRoleId,
    },
};

}
