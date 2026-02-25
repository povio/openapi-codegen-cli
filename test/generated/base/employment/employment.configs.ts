import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { CommonModels } from "@/data/common/common.models";
import { EmploymentModels } from "./employment.models";
import { EmploymentQueries } from "./employment.queries";
import { EmploymentAcl } from "./employment.acl";

export namespace EmploymentConfigs {
export const employmentsConfig = {
    meta: {
        title: "Employments",
    },
    readAll: {
        acl: EmploymentAcl.canUseList,
        schema: CommonModels.EmploymentResponseSchema,
        paginated: EmploymentQueries.useList,
        infinite: EmploymentQueries.useListInfinite,
        filters: {
            schema: EmploymentModels.EmploymentFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: EmploymentModels.EmploymentFilterDtoSchema,
  options: {
    inputs: {
      officeId: true,
      employeeId: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: CommonModels.EmploymentResponseSchema,
  options: {
    columns: {
      id: true,
      officeId: true,
      office: true,
      employeeId: true,
      employee: true,
      archived: true,
      costCenter: true,
      roles: true,
    },
    sortable: EmploymentModels.EmploymentListOrderParamEnumSchema,
  },
}),
    },
    create: {
        acl: EmploymentAcl.canUseCreate,
        schema: EmploymentModels.EmploymentCreateRequestSchema,
        mutation: EmploymentQueries.useCreate,
        inputDefs: dynamicInputs({
  schema: EmploymentModels.EmploymentCreateRequestSchema,
  options: {
    inputs: {
      officeId: true,
      employeeId: true,
    },
  },
})
    },
};

}
