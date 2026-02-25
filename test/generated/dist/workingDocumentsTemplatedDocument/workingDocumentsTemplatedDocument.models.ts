import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsTemplatedDocumentModels {
  /**
   * TemplatedDocumentBlueprintDtoSchema
   * @type { object }
   * @property { string } templateId
   * @property { string } templateName
   * @property { string } capturedAt
   * @property { CommonModels.TemplateBlocksResponseDTO } blocks
   */
  export const TemplatedDocumentBlueprintDtoSchema = z
    .object({
      templateId: z.string(),
      templateName: z.string(),
      capturedAt: z.string(),
      blocks: CommonModels.TemplateBlocksResponseDTOSchema,
    })
    .readonly();
  export type TemplatedDocumentBlueprintDto = z.infer<typeof TemplatedDocumentBlueprintDtoSchema>;

  /**
   * TemplatedDocumentResponseDtoSchema
   * @type { object }
   * @property { string } id
   * @property { string } positionId
   * @property { string } officeId
   * @property { string } name
   * @property { string } nameSuffix
   * @property { string } defaultFileName
   * @property { number } versionNumber
   * @property { TemplatedDocumentBlueprintDto } blueprint Captured template blueprint
   * @property { CommonModels.TemplatedDocumentDataDto } data Document data
   * @property { string } createdAt
   * @property { string } updatedAt
   * @property { string } issuedAt
   */
  export const TemplatedDocumentResponseDtoSchema = z
    .object({
      id: z.string(),
      positionId: z.string(),
      officeId: z.string(),
      name: z.string(),
      nameSuffix: z.string().nullish(),
      defaultFileName: z.string(),
      versionNumber: z.number(),
      blueprint: TemplatedDocumentBlueprintDtoSchema.describe("Captured template blueprint"),
      data: CommonModels.TemplatedDocumentDataDtoSchema.describe("Document data"),
      createdAt: z.iso.datetime({ offset: true }),
      updatedAt: z.iso.datetime({ offset: true }),
      issuedAt: z.iso.datetime({ offset: true }).nullish(),
    })
    .readonly();
  export type TemplatedDocumentResponseDto = z.infer<typeof TemplatedDocumentResponseDtoSchema>;

  /**
   * UpdateTemplatedDocumentRequestDtoSchema
   * @type { object }
   * @property { string } nameSuffix Optional suffix for the document name
   * @property { CommonModels.TemplatedDocumentDataUpdateDto } data Partial document data to update
   */
  export const UpdateTemplatedDocumentRequestDtoSchema = z
    .object({
      nameSuffix: z.string().describe("Optional suffix for the document name"),
      data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.describe("Partial document data to update"),
    })
    .readonly();
  export type UpdateTemplatedDocumentRequestDto = z.infer<typeof UpdateTemplatedDocumentRequestDtoSchema>;

  /**
   * CreateTemplatedDocumentRequestDtoSchema
   * @type { object }
   * @property { string } templateId Template ID to use for creating the document
   * @property { string } nameSuffix Optional suffix for the document name
   */
  export const CreateTemplatedDocumentRequestDtoSchema = z
    .object({
      templateId: z.string().describe("Template ID to use for creating the document"),
      nameSuffix: z.string().describe("Optional suffix for the document name").nullish(),
    })
    .readonly();
  export type CreateTemplatedDocumentRequestDto = z.infer<typeof CreateTemplatedDocumentRequestDtoSchema>;

  /**
   * GenerateWorkingDocumentPreviewRequestDtoSchema
   * @type { object }
   * @property { string } issuedAt
   */
  export const GenerateWorkingDocumentPreviewRequestDtoSchema = z
    .object({ issuedAt: z.iso.datetime({ offset: true }) })
    .readonly();
  export type GenerateWorkingDocumentPreviewRequestDto = z.infer<typeof GenerateWorkingDocumentPreviewRequestDtoSchema>;
}
