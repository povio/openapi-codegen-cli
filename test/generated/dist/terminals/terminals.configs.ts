import { dynamicInputs } from "@povio/ui";
import { dynamicColumns } from "@povio/ui";
import { TerminalsModels } from "./terminals.models";
import { CommonModels } from "@/data/common/common.models";
import { TerminalsQueries } from "./terminals.queries";
import { TerminalsAcl } from "./terminals.acl";

export namespace TerminalsConfigs {
  export const terminalsConfig = {
    meta: {
      title: "Terminals",
    },
    readAll: {
      acl: TerminalsAcl.canUsePaginate,
      schema: TerminalsModels.TerminalResponseDTOSchema,
      paginated: TerminalsQueries.usePaginate,
      infinite: TerminalsQueries.usePaginateInfinite,
      filters: {
        schema: TerminalsModels.TerminalPaginationFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: TerminalsModels.TerminalPaginationFilterDtoSchema,
          options: {
            inputs: {
              search: true,
              archived: true,
              type: true,
            },
          },
        }),
      },
      columns: dynamicColumns({
        schema: TerminalsModels.TerminalResponseDTOSchema,
        options: {
          columns: {
            id: true,
            matchCode: true,
            name: true,
            type: true,
            airport: true,
            port: true,
            archived: true,
            shortName: true,
            address: true,
            additionalInformation: true,
            createdById: true,
            createdBy: true,
            createdAt: true,
            updatedById: true,
            updatedBy: true,
            updatedAt: true,
          },
          sortable: TerminalsModels.TerminalsPaginateOrderParamEnumSchema,
        },
      }),
    },
    read: {
      acl: TerminalsAcl.canUseGetById,
      schema: TerminalsModels.TerminalResponseDTOSchema,
      query: TerminalsQueries.useGetById,
    },
    create: {
      acl: TerminalsAcl.canUseCreate,
      schema: TerminalsModels.CreateTerminalRequestDTOSchema,
      mutation: TerminalsQueries.useCreate,
      inputDefs: dynamicInputs({
        schema: TerminalsModels.CreateTerminalRequestDTOSchema,
        options: {
          inputs: {
            matchCode: true,
            shortName: true,
            name: true,
            type: true,
            portId: true,
            airportId: true,
            street: true,
            secondaryStreet: true,
            zip: true,
            district: true,
            cityId: true,
            countryId: true,
            additionalInformation: true,
          },
        },
      }),
    },
    update: {
      acl: TerminalsAcl.canUseUpdate,
      schema: TerminalsModels.UpdateTerminalRequestDTOSchema,
      mutation: TerminalsQueries.useUpdate,
      inputDefs: dynamicInputs({
        schema: TerminalsModels.UpdateTerminalRequestDTOSchema,
        options: {
          inputs: {
            matchCode: true,
            shortName: true,
            name: true,
            type: true,
            portId: true,
            airportId: true,
            street: true,
            secondaryStreet: true,
            zip: true,
            district: true,
            cityId: true,
            countryId: true,
            additionalInformation: true,
          },
        },
      }),
    },
  };

  export const labelsConfig = {
    meta: {
      title: "Labels",
    },
    readAll: {
      acl: TerminalsAcl.canUsePaginateLabels,
      schema: CommonModels.LabelResponseDTOSchema,
      paginated: TerminalsQueries.usePaginateLabels,
      infinite: TerminalsQueries.usePaginateLabelsInfinite,
      filters: {
        schema: TerminalsModels.TerminalLabelFilterDtoSchema,
        filterDefs: dynamicInputs({
          schema: TerminalsModels.TerminalLabelFilterDtoSchema,
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
          sortable: TerminalsModels.TerminalsPaginateLabelsOrderParamEnumSchema,
        },
      }),
    },
  };
}
