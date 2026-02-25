import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { BookkeepingExportModels } from "./bookkeepingExport.models";
import { BookkeepingExportQueries } from "./bookkeepingExport.queries";
import { BookkeepingExportAcl } from "./bookkeepingExport.acl";

export namespace BookkeepingExportConfigs {
  export const bookkeepingExportsConfig = {
    meta: {
      title: "Bookkeeping Exports",
    },
    readAll: {
      acl: BookkeepingExportAcl.canUsePaginateBatches,
      schema: BookkeepingExportModels.BookkeepingExportBatchPreviewDtoSchema,
      paginated: BookkeepingExportQueries.usePaginateBatches,
      infinite: BookkeepingExportQueries.usePaginateBatchesInfinite,
      filters: {
        schema: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: BookkeepingExportModels.BookkeepingExportBatchPreviewFilterDtoSchema,
          options: {
            inputs: {
              createdDate: true,
              status: true,
              format: true,
              createdBy: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: BookkeepingExportModels.BookkeepingExportBatchPreviewDtoSchema,
        options: {
          columns: {
            id: true,
            format: true,
            status: true,
            totalInvoiceCount: true,
            exportedInvoiceCount: true,
            createdBy: true,
            createdAt: true,
            exportedAt: true,
            revertedAt: true,
            files: true,
          },
          sortable: BookkeepingExportModels.PaginateBatchesOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: BookkeepingExportAcl.canUseGetBatch,
      schema: BookkeepingExportModels.BookkeepingExportBatchDetailsDtoSchema,
      query: BookkeepingExportQueries.useGetBatch,
    },
    create: {
      acl: BookkeepingExportAcl.canUseCreateBatch,
      schema: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDtoSchema,
      mutation: BookkeepingExportQueries.useCreateBatch,
      inputDefs: dynamicInputs({
        schema: BookkeepingExportModels.CreateBookkeepingExportBatchRequestDtoSchema,
        options: {
          inputs: {
            format: true,
            invoiceFilters: true,
          },
        },
      }),
    },
    update: {
      acl: BookkeepingExportAcl.canUseUpdateBatchFormat,
      schema: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDtoSchema,
      mutation: BookkeepingExportQueries.useUpdateBatchFormat,
      inputDefs: dynamicInputs({
        schema: BookkeepingExportModels.UpdateBookkeepingExportBatchRequestDtoSchema,
        options: {
          inputs: {
            format: true,
          },
        },
      }),
    },
  };

  export const itemsConfig = {
    meta: {
      title: "Items",
    },
    readAll: {
      acl: BookkeepingExportAcl.canUsePaginateBatchItems,
      schema: BookkeepingExportModels.BookkeepingExportItemDetailDtoSchema,
      paginated: BookkeepingExportQueries.usePaginateBatchItems,
      infinite: BookkeepingExportQueries.usePaginateBatchItemsInfinite,
      filters: {
        schema: BookkeepingExportModels.BookkeepingExportItemDetailFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: BookkeepingExportModels.BookkeepingExportItemDetailFilterDtoSchema,
          options: {
            inputs: {
              status: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: BookkeepingExportModels.BookkeepingExportItemDetailDtoSchema,
        options: {
          columns: {
            id: true,
            invoiceId: true,
            status: true,
            includedInExport: true,
            validationIssues: true,
            invoice: true,
            receiver: true,
            comments: true,
          },
          sortable: BookkeepingExportModels.PaginateBatchItemsOrderParamEnumSchema,
        },
      }),
    },
  };
}
