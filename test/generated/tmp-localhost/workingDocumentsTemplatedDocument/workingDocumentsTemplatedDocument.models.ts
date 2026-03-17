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
export const TemplatedDocumentBlueprintDtoSchema = z.object({ templateId: z.string(), templateName: z.string(), capturedAt: z.string(), blocks: CommonModels.TemplateBlocksResponseDTOSchema });
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
export const TemplatedDocumentResponseDtoSchema = z.object({ id: z.string(), positionId: z.string(), officeId: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), versionNumber: z.number(), blueprint: TemplatedDocumentBlueprintDtoSchema, data: CommonModels.TemplatedDocumentDataDtoSchema, createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }), issuedAt: z.iso.datetime({ offset: true }).nullish() });
export type TemplatedDocumentResponseDto = z.infer<typeof TemplatedDocumentResponseDtoSchema>;

/** 
 * UpdateTemplatedDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } nameSuffix Optional suffix for the document name 
 * @property { CommonModels.TemplatedDocumentDataUpdateDto } data Partial document data to update 
 */
export const UpdateTemplatedDocumentRequestDtoSchema = z.object({ nameSuffix: z.string().nullable(), data: CommonModels.TemplatedDocumentDataUpdateDtoSchema.nullable() }).partial();
export type UpdateTemplatedDocumentRequestDto = z.infer<typeof UpdateTemplatedDocumentRequestDtoSchema>;

/** 
 * CreateTemplatedDocumentRequestDtoSchema 
 * @type { object }
 * @property { string } templateId Template ID to use for creating the document 
 * @property { string } nameSuffix Optional suffix for the document name 
 */
export const CreateTemplatedDocumentRequestDtoSchema = z.object({ templateId: z.string(), nameSuffix: z.string().nullish() });
export type CreateTemplatedDocumentRequestDto = z.infer<typeof CreateTemplatedDocumentRequestDtoSchema>;

/** 
 * GenerateWorkingDocumentPreviewRequestDtoSchema 
 * @type { object }
 * @property { string } issuedAt  
 */
export const GenerateWorkingDocumentPreviewRequestDtoSchema = z.object({ issuedAt: z.iso.datetime({ offset: true }).nullable() }).partial();
export type GenerateWorkingDocumentPreviewRequestDto = z.infer<typeof GenerateWorkingDocumentPreviewRequestDtoSchema>;

}
