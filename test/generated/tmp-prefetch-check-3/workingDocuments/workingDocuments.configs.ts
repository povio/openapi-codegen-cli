import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { WorkingDocumentsModels } from "./workingDocuments.models";
import { WorkingDocumentsQueries } from "./workingDocuments.queries";
import { WorkingDocumentsAcl } from "./workingDocuments.acl";

export namespace WorkingDocumentsConfigs {
export const workingDocumentsConfig = {
    meta: {
        title: "Working Documents",
    },
    readAll: {
        acl: WorkingDocumentsAcl.canUseList,
        schema: WorkingDocumentsModels.WorkingDocumentResponseDTOSchema,
        paginated: WorkingDocumentsQueries.useList,
        infinite: WorkingDocumentsQueries.useListInfinite,
        filters: {
            schema: WorkingDocumentsModels.WorkingDocumentFilterDtoSchema,
            filterDefs: dynamicInputs({
  schema: WorkingDocumentsModels.WorkingDocumentFilterDtoSchema,
  options: {
    inputs: {
      search: true,
      type: true,
    },
  },
})
        },
        columns: dynamicColumns({
  schema: WorkingDocumentsModels.WorkingDocumentResponseDTOSchema,
  options: {
    columns: {
      id: true,
      positionId: true,
      name: true,
      nameSuffix: true,
      type: true,
      referenceTable: true,
      referenceId: true,
      createdById: true,
      createdAt: true,
      createdBy: true,
    },
    sortable: WorkingDocumentsModels.WorkingDocumentsListOrderParamEnumSchema,
  },
}),
    },
    read: {
        acl: WorkingDocumentsAcl.canUseFindById,
        schema: WorkingDocumentsModels.WorkingDocumentResponseDTOSchema,
        query: WorkingDocumentsQueries.useFindById,
    },
};

}
