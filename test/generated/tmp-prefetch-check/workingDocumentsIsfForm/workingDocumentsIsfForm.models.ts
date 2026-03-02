import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsIsfFormModels {
/** 
 * IsfDocumentCargoCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const IsfDocumentCargoCountryResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type IsfDocumentCargoCountryResponseDTO = z.infer<typeof IsfDocumentCargoCountryResponseDTOSchema>;

/** 
 * IsfDocumentCargoResponseDTOSchema 
 * @type { object }
 * @property { string } productCode Product code of the cargo 
 * @property { string } descriptionOfGoods Description of goods 
 * @property { string } htsCode HTS code of the cargo 
 * @property { string } manufacturerSupplier Manufacturer supplier of the cargo 
 * @property { string } seal1 Seal number 1 of the cargo 
 * @property { string } seal2 Seal number 2 of the cargo 
 * @property { IsfDocumentCargoCountryResponseDTO } countryOfOrigin Country of origin of the cargo 
 */
export const IsfDocumentCargoResponseDTOSchema = z.object({ productCode: z.string().nullable(), descriptionOfGoods: z.string().nullable(), htsCode: z.string().nullable(), manufacturerSupplier: z.string().nullable(), seal1: z.string().nullable(), seal2: z.string().nullable(), countryOfOrigin: IsfDocumentCargoCountryResponseDTOSchema.nullable() }).partial();
export type IsfDocumentCargoResponseDTO = z.infer<typeof IsfDocumentCargoResponseDTOSchema>;

/** 
 * IsfDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const IsfDocumentPortResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable() }).partial();
export type IsfDocumentPortResponseDTO = z.infer<typeof IsfDocumentPortResponseDTOSchema>;

/** 
 * IsfDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 * @property { string } number Number of the business partner 
 */
export const IsfDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable(), number: z.string().nullable() }).partial();
export type IsfDocumentBusinessPartnerResponseDTO = z.infer<typeof IsfDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * IsfDocumentContainerLocationResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the container location 
 * @property { string } name Name of the container location 
 * @property { string } address Address of the container location 
 */
export const IsfDocumentContainerLocationResponseDTOSchema = z.object({ id: z.string().nullable(), name: z.string().nullable(), address: z.string().nullable() }).partial();
export type IsfDocumentContainerLocationResponseDTO = z.infer<typeof IsfDocumentContainerLocationResponseDTOSchema>;

/** 
 * IsfDocumentResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the document 
 * @property { string } name Name of the document 
 * @property { string } nameSuffix Name suffix of the document 
 * @property { string } defaultFileName  
 * @property { string } positionId Position ID 
 * @property { string } positionNumber Position number 
 * @property { number } versionNumber Version number of the document 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } hBLNumber HBL number 
 * @property { string } mBLNumber MBL number 
 * @property { string } scacCodeHBL SCAC code for HBL 
 * @property { string } scacCodeMBL SCAC code for MBL 
 * @property { IsfDocumentPortResponseDTO } portOfDischarge Port of discharge 
 * @property { string } issueLocation Issue location 
 * @property { string } issueDate Issue date 
 * @property { string } companyName Company name 
 * @property { object } completedBy  
 * @property { string } completedBy.name  
 * @property { string } completedBy.email  
 * @property { object } container  
 * @property { string } container.id  
 * @property { string } container.name  
 * @property { IsfDocumentBusinessPartnerResponseDTO } consignee Consignee information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } manufacturer Manufacturer information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } seller Seller information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } buyer Buyer information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } consolidator Consolidator information 
 * @property { IsfDocumentContainerLocationResponseDTO } containerLocation Container location information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } shipTo Ship to information 
 * @property { IsfDocumentBusinessPartnerResponseDTO } importer Importer information 
 * @property { IsfDocumentCargoResponseDTO[] } cargo List of cargo information 
 * @property { CommonModels.HBLDocumentConfigDto } config Configuration settings for the document 
 * @property { CommonModels.EditorContentResponseDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentResponseDto } footerRemarks Footer remarks 
 */
export const IsfDocumentResponseDTOSchema = z.object({ id: z.string(), name: z.string(), nameSuffix: z.string().nullish(), defaultFileName: z.string(), positionId: z.string(), positionNumber: z.string(), versionNumber: z.number(), vessel: z.string().nullish(), voyage: z.string().nullish(), hBLNumber: z.string().nullish(), mBLNumber: z.string().nullish(), scacCodeHBL: z.string().nullish(), scacCodeMBL: z.string().nullish(), portOfDischarge: IsfDocumentPortResponseDTOSchema.nullish(), issueLocation: z.string().nullish(), issueDate: z.iso.datetime({ offset: true }).nullish(), companyName: z.string().nullish(), completedBy: z.object({ name: z.string(), email: z.string() }).nullish(), container: z.object({ id: z.string(), name: z.string() }).nullish(), consignee: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), manufacturer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), seller: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), buyer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), consolidator: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), containerLocation: IsfDocumentContainerLocationResponseDTOSchema.nullish(), shipTo: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), importer: IsfDocumentBusinessPartnerResponseDTOSchema.nullish(), cargo: z.array(IsfDocumentCargoResponseDTOSchema).nullish(), config: CommonModels.HBLDocumentConfigDtoSchema, bodyRemarks: CommonModels.EditorContentResponseDtoSchema.nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.nullish() });
export type IsfDocumentResponseDTO = z.infer<typeof IsfDocumentResponseDTOSchema>;

/** 
 * UpdateIsfDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 * @property { string } number Business partner number 
 */
export const UpdateIsfDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().nullable(), address: z.string().nullable(), number: z.string().nullable() }).partial();
export type UpdateIsfDocumentBusinessPartnerRequestDTO = z.infer<typeof UpdateIsfDocumentBusinessPartnerRequestDTOSchema>;

/** 
 * UpdateIsfDocumentCargoRequestDTOSchema 
 * @type { object }
 * @property { string } productCode Product code 
 * @property { string } descriptionOfGoods Description of goods 
 * @property { string } htsCode HTS code 
 * @property { string } manufacturerSupplier Manufacturer supplier 
 * @property { string } countryOfOriginId Country of origin ID 
 */
export const UpdateIsfDocumentCargoRequestDTOSchema = z.object({ productCode: z.string().nullable(), descriptionOfGoods: z.string().nullable(), htsCode: z.string().nullable(), manufacturerSupplier: z.string().nullable(), countryOfOriginId: z.string().nullable() }).partial();
export type UpdateIsfDocumentCargoRequestDTO = z.infer<typeof UpdateIsfDocumentCargoRequestDTOSchema>;

/** 
 * UpdateIsfDocumentRequestDTOSchema 
 * @type { object }
 * @property { string } nameSuffix Name suffix 
 * @property { string } vessel Vessel name 
 * @property { string } voyage Voyage number 
 * @property { string } hBLNumber HBL number 
 * @property { string } mBLNumber MBL number 
 * @property { string } scacCodeHBL SCAC code for HBL 
 * @property { string } scacCodeMBL SCAC code for MBL 
 * @property { string } portOfDischargeId Port of discharge Id 
 * @property { string } issueLocation Issue location 
 * @property { string } issueDate Issue date 
 * @property { string } companyName Company name 
 * @property { string } completedByName Completed by name 
 * @property { string } completedByEmail Completed by email 
 * @property { string } containerId Container ID 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } consignee Consignee information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } manufacturer Manufacturer information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } seller Seller information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } buyer Buyer information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } consolidator Consolidator information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } containerLocation Container location information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } shipTo Ship to information 
 * @property { UpdateIsfDocumentBusinessPartnerRequestDTO } importer Importer information 
 * @property { UpdateIsfDocumentCargoRequestDTO[] } cargo Cargo information 
 * @property { CommonModels.EditorContentUpdateDto } bodyRemarks Body remarks 
 * @property { CommonModels.EditorContentUpdateDto } footerRemarks Footer remarks 
 */
export const UpdateIsfDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().nullable(), vessel: z.string().nullable(), voyage: z.string().nullable(), hBLNumber: z.string().nullable(), mBLNumber: z.string().nullable(), scacCodeHBL: z.string().nullable(), scacCodeMBL: z.string().nullable(), portOfDischargeId: z.string().nullable(), issueLocation: z.string().nullable(), issueDate: z.iso.datetime({ offset: true }).nullable(), companyName: z.string().nullable(), completedByName: z.string().nullable(), completedByEmail: z.string().nullable(), containerId: z.string().nullable(), consignee: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), manufacturer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), seller: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), buyer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), consolidator: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), containerLocation: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), shipTo: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), importer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.nullable(), cargo: z.array(UpdateIsfDocumentCargoRequestDTOSchema).nullable(), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable(), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.nullable() }).partial();
export type UpdateIsfDocumentRequestDTO = z.infer<typeof UpdateIsfDocumentRequestDTOSchema>;

}
