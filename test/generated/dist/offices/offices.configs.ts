import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { OfficesModels } from "./offices.models";
import { CommonModels } from "@/data/common/common.models";
import { OfficesQueries } from "./offices.queries";
import { OfficesAcl } from "./offices.acl";

export namespace OfficesConfigs {
  export const officesConfig = {
    meta: {
      title: "Offices",
    },
    readAll: {
      schema: OfficesModels.OfficeListItemResponseSchema,
      paginated: OfficesQueries.usePaginate,
      infinite: OfficesQueries.usePaginateInfinite,
      filters: {
        schema: OfficesModels.OfficeFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: OfficesModels.OfficeFilterDtoSchema,
          options: {
            inputs: {
              name: true,
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: OfficesModels.OfficeListItemResponseSchema,
        options: {
          columns: {
            id: true,
            name: true,
            numberOfEmployees: true,
          },
          sortable: OfficesModels.OfficesPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: OfficesAcl.canUseGet,
      schema: OfficesModels.OfficeDetailResponseDtoSchema,
      query: OfficesQueries.useGet,
    },
    create: {
      acl: OfficesAcl.canUseCreate,
      schema: OfficesModels.CreateOfficeRequestSchema,
      mutation: OfficesQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: OfficesModels.CreateOfficeRequestSchema,
        options: {
          inputs: {
            name: true,
          },
        },
      }),
    },
    update: {
      acl: OfficesAcl.canUseUpdate,
      schema: OfficesModels.UpdateOfficeRequestSchema,
      mutation: OfficesQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: OfficesModels.UpdateOfficeRequestSchema,
        options: {
          inputs: {
            name: true,
            symbol: true,
            invoicePrefix: true,
            autoClosePositionsAfterDays: true,
            defaultLanguage: true,
            locale: true,
            vatId: true,
            taxNumber: true,
            termsExport: true,
            termsImport: true,
            showPaymentInstructions: true,
            showCompanyRegistrationNumber: true,
            reportInvoicesToHungarianTaxAuthority: true,
            restrictPositionInvolvedParties: true,
            showWatermarkOnDocuments: true,
            showInvoiceVatLinesInOfficeCurrency: true,
            usePartnerMatchCodes: true,
            restrictFinancePartnersToRelationship: true,
            costCenterId: true,
            minimumOutgoingInvoiceDate: true,
            minimumOutgoingInvoiceServiceDate: true,
            minimumIncomingInvoiceDate: true,
            minimumIncomingInvoiceServiceDate: true,
            countryId: true,
            defaultCurrencyId: true,
            representingBusinessPartnerId: true,
            availableCurrencyIds: true,
            generalLedgerSystem: true,
            factoringReportingEnabled: true,
            bankAccountCurrencyMapping: true,
          },
        },
      }),
    },
  };

  export const paginateConfig = {
    meta: {
      title: "Paginate",
    },
    readAll: {
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: OfficesQueries.usePaginateLabels,
      infinite: OfficesQueries.usePaginateLabelsInfinite,
      filters: {
        schema: OfficesModels.OfficeLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: OfficesModels.OfficeLabelFilterDtoSchema,
          options: {
            inputs: {
              search: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: CommonModels.LabelResponseDTOSchema,
        options: {
          columns: {
            id: true,
            label: true,
          },
          sortable: OfficesModels.OfficesPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
