import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace WorkingDocumentsIsfFormModels {
/** 
 * IsfDocumentCargoCountryResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the country 
 * @property { string } name Name of the country 
 */
export const IsfDocumentCargoCountryResponseDTOSchema = z.object({ id: z.string().describe("ID of the country"), name: z.string().describe("Name of the country") }).readonly();
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
export const IsfDocumentCargoResponseDTOSchema = z.object({ productCode: z.string().describe("Product code of the cargo"), descriptionOfGoods: z.string().describe("Description of goods"), htsCode: z.string().describe("HTS code of the cargo"), manufacturerSupplier: z.string().describe("Manufacturer supplier of the cargo"), seal1: z.string().describe("Seal number 1 of the cargo"), seal2: z.string().describe("Seal number 2 of the cargo"), countryOfOrigin: IsfDocumentCargoCountryResponseDTOSchema.describe("Country of origin of the cargo") }).readonly();
export type IsfDocumentCargoResponseDTO = z.infer<typeof IsfDocumentCargoResponseDTOSchema>;

/** 
 * IsfDocumentPortResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the port 
 * @property { string } name Name of the port 
 */
export const IsfDocumentPortResponseDTOSchema = z.object({ id: z.string().describe("ID of the port"), name: z.string().describe("Name of the port") }).readonly();
export type IsfDocumentPortResponseDTO = z.infer<typeof IsfDocumentPortResponseDTOSchema>;

/** 
 * IsfDocumentBusinessPartnerResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the business partner 
 * @property { string } name Name of the business partner 
 * @property { string } address Address of the business partner 
 * @property { string } number Number of the business partner 
 */
export const IsfDocumentBusinessPartnerResponseDTOSchema = z.object({ id: z.string().describe("ID of the business partner"), name: z.string().describe("Name of the business partner"), address: z.string().describe("Address of the business partner"), number: z.string().describe("Number of the business partner") }).readonly();
export type IsfDocumentBusinessPartnerResponseDTO = z.infer<typeof IsfDocumentBusinessPartnerResponseDTOSchema>;

/** 
 * IsfDocumentContainerLocationResponseDTOSchema 
 * @type { object }
 * @property { string } id ID of the container location 
 * @property { string } name Name of the container location 
 * @property { string } address Address of the container location 
 */
export const IsfDocumentContainerLocationResponseDTOSchema = z.object({ id: z.string().describe("ID of the container location"), name: z.string().describe("Name of the container location"), address: z.string().describe("Address of the container location") }).readonly();
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
export const IsfDocumentResponseDTOSchema = z.object({ id: z.string().describe("ID of the document"), name: z.string().describe("Name of the document"), nameSuffix: z.string().describe("Name suffix of the document").nullish(), defaultFileName: z.string(), positionId: z.string().describe("Position ID"), positionNumber: z.string().describe("Position number"), versionNumber: z.number().describe("Version number of the document"), vessel: z.string().describe("Vessel name").nullish(), voyage: z.string().describe("Voyage number").nullish(), hBLNumber: z.string().describe("HBL number").nullish(), mBLNumber: z.string().describe("MBL number").nullish(), scacCodeHBL: z.string().describe("SCAC code for HBL").nullish(), scacCodeMBL: z.string().describe("SCAC code for MBL").nullish(), portOfDischarge: IsfDocumentPortResponseDTOSchema.describe("Port of discharge").nullish(), issueLocation: z.string().describe("Issue location").nullish(), issueDate: z.iso.datetime({ offset: true }).describe("Issue date").nullish(), companyName: z.string().describe("Company name").nullish(), completedBy: z.object({ name: z.string(), email: z.string() }).readonly().nullish(), container: z.object({ id: z.string(), name: z.string() }).readonly().nullish(), consignee: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Consignee information").nullish(), manufacturer: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Manufacturer information").nullish(), seller: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Seller information").nullish(), buyer: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Buyer information").nullish(), consolidator: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Consolidator information").nullish(), containerLocation: IsfDocumentContainerLocationResponseDTOSchema.describe("Container location information").nullish(), shipTo: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Ship to information").nullish(), importer: IsfDocumentBusinessPartnerResponseDTOSchema.describe("Importer information").nullish(), cargo: z.array(IsfDocumentCargoResponseDTOSchema).readonly().describe("List of cargo information").nullish(), config: CommonModels.HBLDocumentConfigDtoSchema.describe("Configuration settings for the document"), bodyRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Body remarks").nullish(), footerRemarks: CommonModels.EditorContentResponseDtoSchema.describe("Footer remarks").nullish() }).readonly();
export type IsfDocumentResponseDTO = z.infer<typeof IsfDocumentResponseDTOSchema>;

/** 
 * UpdateIsfDocumentBusinessPartnerRequestDTOSchema 
 * @type { object }
 * @property { string } id Business partner ID 
 * @property { string } address Business partner address 
 * @property { string } number Business partner number 
 */
export const UpdateIsfDocumentBusinessPartnerRequestDTOSchema = z.object({ id: z.string().describe("Business partner ID"), address: z.string().describe("Business partner address"), number: z.string().describe("Business partner number") }).readonly();
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
export const UpdateIsfDocumentCargoRequestDTOSchema = z.object({ productCode: z.string().describe("Product code"), descriptionOfGoods: z.string().describe("Description of goods"), htsCode: z.string().describe("HTS code"), manufacturerSupplier: z.string().describe("Manufacturer supplier"), countryOfOriginId: z.string().describe("Country of origin ID") }).readonly();
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
export const UpdateIsfDocumentRequestDTOSchema = z.object({ nameSuffix: z.string().describe("Name suffix"), vessel: z.string().describe("Vessel name"), voyage: z.string().describe("Voyage number"), hBLNumber: z.string().describe("HBL number"), mBLNumber: z.string().describe("MBL number"), scacCodeHBL: z.string().describe("SCAC code for HBL"), scacCodeMBL: z.string().describe("SCAC code for MBL"), portOfDischargeId: z.string().describe("Port of discharge Id"), issueLocation: z.string().describe("Issue location"), issueDate: z.iso.datetime({ offset: true }).describe("Issue date"), companyName: z.string().describe("Company name"), completedByName: z.string().describe("Completed by name"), completedByEmail: z.string().describe("Completed by email"), containerId: z.string().describe("Container ID"), consignee: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Consignee information"), manufacturer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Manufacturer information"), seller: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Seller information"), buyer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Buyer information"), consolidator: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Consolidator information"), containerLocation: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Container location information"), shipTo: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Ship to information"), importer: UpdateIsfDocumentBusinessPartnerRequestDTOSchema.describe("Importer information"), cargo: z.array(UpdateIsfDocumentCargoRequestDTOSchema).readonly().describe("Cargo information"), bodyRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Body remarks"), footerRemarks: CommonModels.EditorContentUpdateDtoSchema.describe("Footer remarks") }).readonly();
export type UpdateIsfDocumentRequestDTO = z.infer<typeof UpdateIsfDocumentRequestDTOSchema>;

}
