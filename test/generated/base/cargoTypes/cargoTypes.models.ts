import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CargoTypesModels {
  /**
   * CargoTypeEmployeeDTOSchema
   * @type { object }
   * @property { string } id
   * @property { string } name
   */
  export const CargoTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
  export type CargoTypeEmployeeDTO = z.infer<typeof CargoTypeEmployeeDTOSchema>;

  /**
   * CargoTypeResponseDTOSchema
   * @type { object }
   * @property { string } id Unique identifier for the cargo type
   * @property { string } name Name of the cargo type
   * @property { string } shortName Short name of the cargo type
   * @property { number } length Length of the cargo type
   * @property { number } width Width of the cargo type
   * @property { number } height Height of the cargo type
   * @property { string } unit Measurement unit for dimensions
   * @property { number } emptyWeight Empty weight of the cargo container
   * @property { string } containerIsoCode Container ISO code
   * @property { boolean } isContainer Whether this cargo type is a container
   * @property { CommonModels.TransportModeEnum[] } modules Transport modules applicable to the cargo type
   * @property { boolean } archived Indicates if the cargo type is archived
   * @property { string } createdById
   * @property { CargoTypeEmployeeDTO } createdBy
   * @property { string } createdAt
   * @property { string } updatedById
   * @property { CargoTypeEmployeeDTO } updatedBy
   * @property { string } updatedAt
   */
  export const CargoTypeResponseDTOSchema = z
    .object({
      id: z.string().describe("Unique identifier for the cargo type"),
      name: z.string().describe("Name of the cargo type"),
      shortName: z.string().describe("Short name of the cargo type").nullish(),
      length: z.number().describe("Length of the cargo type").nullish(),
      width: z.number().describe("Width of the cargo type").nullish(),
      height: z.number().describe("Height of the cargo type").nullish(),
      unit: z.string().describe("Measurement unit for dimensions"),
      emptyWeight: z.number().describe("Empty weight of the cargo container").nullish(),
      containerIsoCode: z.string().describe("Container ISO code").nullish(),
      isContainer: z.boolean().describe("Whether this cargo type is a container").nullish(),
      modules: z
        .array(CommonModels.TransportModeEnumSchema)
        .readonly()
        .describe("Transport modules applicable to the cargo type"),
      archived: z.boolean().describe("Indicates if the cargo type is archived"),
      createdById: z.string().nullish(),
      createdBy: CargoTypeEmployeeDTOSchema.nullish(),
      createdAt: z.iso.datetime({ offset: true }),
      updatedById: z.string().nullish(),
      updatedBy: CargoTypeEmployeeDTOSchema.nullish(),
      updatedAt: z.iso.datetime({ offset: true }),
    })
    .readonly();
  export type CargoTypeResponseDTO = z.infer<typeof CargoTypeResponseDTOSchema>;

  /**
   * TransportModuleEnumSchema
   * @type { enum }
   */
  export const TransportModuleEnumSchema = z.enum(["Air", "Sea", "Road"]);
  export type TransportModuleEnum = z.infer<typeof TransportModuleEnumSchema>;
  export const TransportModuleEnum = TransportModuleEnumSchema.enum;

  /**
   * CargoTypePaginationFilterDtoSchema
   * @type { object }
   * @property { TransportModuleEnum } module
   * @property { boolean } archived Archived status filter
   * @property { string } search
   */
  export const CargoTypePaginationFilterDtoSchema = z
    .object({
      module: TransportModuleEnumSchema,
      archived: z.boolean().describe("Archived status filter"),
      search: z.string(),
    })
    .readonly();
  export type CargoTypePaginationFilterDto = z.infer<typeof CargoTypePaginationFilterDtoSchema>;

  /**
   * CreateCargoTypeRequestDTOSchema
   * @type { object }
   * @property { string } name Name of the cargo type
   * @property { string } shortName Short name of the cargo type
   * @property { number } length Length of the cargo type
   * @property { number } width Width of the cargo type
   * @property { number } height Height of the cargo type
   * @property { number } emptyWeight Empty weight of the cargo container
   * @property { string } containerIsoCode Container ISO code
   * @property { boolean } isContainer Whether this cargo type is a container
   * @property { string } unit Measurement unit for dimensions
   * @property { CommonModels.TransportModeEnum[] } modules Transport modes applicable to the cargo type
   */
  export const CreateCargoTypeRequestDTOSchema = z
    .object({
      name: z.string().describe("Name of the cargo type"),
      shortName: z.string().describe("Short name of the cargo type").nullish(),
      length: z.number().describe("Length of the cargo type").nullish(),
      width: z.number().describe("Width of the cargo type").nullish(),
      height: z.number().describe("Height of the cargo type").nullish(),
      emptyWeight: z.number().describe("Empty weight of the cargo container").nullish(),
      containerIsoCode: z.string().describe("Container ISO code").nullish(),
      isContainer: z.boolean().describe("Whether this cargo type is a container").nullish(),
      unit: z.string().describe("Measurement unit for dimensions"),
      modules: z
        .array(CommonModels.TransportModeEnumSchema)
        .readonly()
        .describe("Transport modes applicable to the cargo type"),
    })
    .readonly();
  export type CreateCargoTypeRequestDTO = z.infer<typeof CreateCargoTypeRequestDTOSchema>;

  /**
   * UpdateCargoTypeRequestDTOSchema
   * @type { object }
   * @property { string } name Name of the cargo type
   * @property { string } shortName Short name of the cargo type
   * @property { number } length Length of the cargo type
   * @property { number } width Width of the cargo type
   * @property { number } height Height of the cargo type
   * @property { number } emptyWeight Empty weight of the cargo container
   * @property { string } containerIsoCode Container ISO code
   * @property { boolean } isContainer Whether this cargo type is a container
   * @property { string } unit Measurement unit for dimensions
   * @property { CommonModels.TransportModeEnum[] } modules Transport modules applicable to the cargo type
   */
  export const UpdateCargoTypeRequestDTOSchema = z
    .object({
      name: z.string().describe("Name of the cargo type"),
      shortName: z.string().describe("Short name of the cargo type"),
      length: z.number().describe("Length of the cargo type").nullable(),
      width: z.number().describe("Width of the cargo type").nullable(),
      height: z.number().describe("Height of the cargo type").nullable(),
      emptyWeight: z.number().describe("Empty weight of the cargo container").nullable(),
      containerIsoCode: z.string().describe("Container ISO code").nullable(),
      isContainer: z.boolean().describe("Whether this cargo type is a container").nullable(),
      unit: z.string().describe("Measurement unit for dimensions"),
      modules: z
        .array(CommonModels.TransportModeEnumSchema)
        .readonly()
        .describe("Transport modules applicable to the cargo type"),
    })
    .readonly();
  export type UpdateCargoTypeRequestDTO = z.infer<typeof UpdateCargoTypeRequestDTOSchema>;

  /**
   * CargoTypeLabelFilterDtoSchema
   * @type { object }
   * @property { string } search
   */
  export const CargoTypeLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
  export type CargoTypeLabelFilterDto = z.infer<typeof CargoTypeLabelFilterDtoSchema>;

  /**
   * CargoTypesPaginateOrderParamEnumSchema
   * @type { enum }
   */
  export const CargoTypesPaginateOrderParamEnumSchema = z.enum([
    "matchcode",
    "description",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
    "name",
  ]);
  export type CargoTypesPaginateOrderParamEnum = z.infer<typeof CargoTypesPaginateOrderParamEnumSchema>;
  export const CargoTypesPaginateOrderParamEnum = CargoTypesPaginateOrderParamEnumSchema.enum;

  /**
   * CargoTypesPaginateResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CargoTypeResponseDTO[] } items
   */
  export const CargoTypesPaginateResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CargoTypeResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type CargoTypesPaginateResponse = z.infer<typeof CargoTypesPaginateResponseSchema>;

  /**
   * CargoTypesPaginateLabelsOrderParamEnumSchema
   * @type { enum }
   */
  export const CargoTypesPaginateLabelsOrderParamEnumSchema = z.enum([
    "matchcode",
    "description",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
    "name",
  ]);
  export type CargoTypesPaginateLabelsOrderParamEnum = z.infer<typeof CargoTypesPaginateLabelsOrderParamEnumSchema>;
  export const CargoTypesPaginateLabelsOrderParamEnum = CargoTypesPaginateLabelsOrderParamEnumSchema.enum;

  /**
   * CargoTypesPaginateLabelsResponseSchema
   * @type { object }
   * @property { number } page 1-indexed page number to begin from
   * @property { string } cursor ID of item to start after
   * @property { string } nextCursor Cursor for next set of items
   * @property { number } limit Items per response
   * @property { number } totalItems Total available items
   * @property { CommonModels.LabelResponseDTO[] } items
   */
  export const CargoTypesPaginateLabelsResponseSchema = z.object({
    ...CommonModels.PaginationDtoSchema.shape,
    ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape,
  });
  export type CargoTypesPaginateLabelsResponse = z.infer<typeof CargoTypesPaginateLabelsResponseSchema>;
}
