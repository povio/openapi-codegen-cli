import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { EmployeeModels } from "./employee.models";
import { EmployeeQueries } from "./employee.queries";
import { EmployeeAcl } from "./employee.acl";

export namespace EmployeeConfigs {
export const employeesConfig = {
    meta: {
        title: "Employees",
    },
    readAll: {
        acl: EmployeeAcl.canUsePaginate,
        schema: EmployeeModels.EmployeeResponseSchema,
        paginated: EmployeeQueries.usePaginate,
        infinite: EmployeeQueries.usePaginateInfinite,
        filters: {
            schema: EmployeeModels.EmployeeFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: EmployeeModels.EmployeeFilterDtoSchema,
  options: {
    inputs: {
      office: true,
      roles: true,
      primaryOfficeId: true,
      firstName: true,
      lastName: true,
      email: true,
      ids: true,
      archived: true,
      search: true,
      officeRole: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: EmployeeModels.EmployeeResponseSchema,
  options: {
    columns: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      locale: true,
      phone: true,
      archived: true,
      primaryOfficeId: true,
      primaryOffice: true,
      employments: true,
      roles: true,
      createdAt: true,
      updatedAt: true,
    },
    sortable: EmployeeModels.EmployeePaginateOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: EmployeeAcl.canUseGet,
        schema: EmployeeModels.EmployeeResponseSchema,
        query: EmployeeQueries.useGet,
    },
    create: {
        acl: EmployeeAcl.canUseCreate,
        schema: EmployeeModels.EmployeeCreateRequestSchema,
        mutation: EmployeeQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: EmployeeModels.EmployeeCreateRequestSchema,
  options: {
    inputs: {
      firstName: true,
      lastName: true,
      email: true,
      locale: true,
      primaryOfficeId: true,
      phone: true,
    },
  },
})
    },
    update: {
        acl: EmployeeAcl.canUseUpdate,
        schema: EmployeeModels.EmployeeUpdateRequestSchema,
        mutation: EmployeeQueries.useUpdate,
        inputDefs: dynamicInputs({
  schema: EmployeeModels.EmployeeUpdateRequestSchema,
  options: {
    inputs: {
      firstName: true,
      lastName: true,
      phone: true,
      locale: true,
      primaryOfficeId: true,
    },
  },
})
    },
};

export const paginateConfig = {
    meta: {
        title: "Paginate",
    },
    readAll: {
        acl: EmployeeAcl.canUsePaginateLabels,
        schema: CommonModels.LabelResponseDTOSchema,
        paginated: EmployeeQueries.usePaginateLabels,
        infinite: EmployeeQueries.usePaginateLabelsInfinite,
        filters: {
            schema: EmployeeModels.EmployeeLabelFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: EmployeeModels.EmployeeLabelFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      officeId: true,
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
    sortable: EmployeeModels.EmployeePaginateLabelsOrderParamEnumSchema,
  },
}),
    },
};

}
