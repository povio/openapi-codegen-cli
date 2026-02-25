import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace PackageTypesModels {
/** 
 * PackageTypeCodeEnumSchema 
 * @type { enum }
 */
export const PackageTypeCodeEnumSchema = z.enum(["1A", "1B", "1D", "1F", "1G", "1W", "2C", "3A", "3H", "43", "44", "4A", "4B", "4C", "4D", "4F", "4G", "4H", "5H", "5L", "5M", "6H", "6P", "7A", "7B", "8A", "8B", "8C", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AL", "AM", "AP", "AT", "AV", "B4", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DP", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EN", "FB", "FC", "FD", "FE", "FI", "FL", "FO", "FP", "FR", "FT", "FW", "FX", "GB", "GI", "GL", "GR", "GU", "GY", "GZ", "HA", "HB", "HC", "HG", "HN", "HR", "IA", "IB", "IC", "ID", "IE", "IF", "IG", "IH", "IK", "IL", "IN", "IZ", "JB", "JC", "JG", "JR", "JT", "JY", "KG", "KI", "LE", "LG", "LT", "LU", "LV", "LZ", "MA", "MB", "MC", "ME", "MR", "MS", "MT", "MW", "MX", "NA", "NE", "NF", "NG", "NS", "NT", "NU", "NV", "OA", "OB", "OC", "OD", "OE", "OF", "OK", "OT", "OU", "P2", "PA", "PB", "PC", "PD", "PE", "PF", "PG", "PH", "PI", "PJ", "PK", "PL", "PN", "PO", "PP", "PR", "PT", "PU", "PV", "PX", "PY", "PZ", "QA", "QB", "QC", "QD", "QF", "QG", "QH", "QJ", "QK", "QL", "QM", "QN", "QP", "QQ", "QR", "QS", "RD", "RG", "RJ", "RK", "RL", "RO", "RT", "RZ", "SA", "SB", "SC", "SD", "SE", "SH", "SI", "SK", "SL", "SM", "SO", "SP", "SS", "ST", "SU", "SV", "SW", "SY", "SZ", "T1", "TB", "TC", "TD", "TE", "TG", "TI", "TK", "TL", "TN", "TO", "TR", "TS", "TT", "TU", "TV", "TW", "TY", "TZ", "UC", "UN", "VA", "VG", "VI", "VK", "VL", "VO", "VP", "VQ", "VN", "VR", "VS", "VY", "WA", "WB", "WC", "WD", "WF", "WG", "WH", "WJ", "WK", "WL", "WM", "WN", "WP", "WQ", "WR", "WS", "WT", "WU", "WV", "WW", "WX", "WY", "WZ", "XA", "XB", "XC", "XD", "XF", "XG", "XH", "XJ", "XK", "YA", "YB", "YC", "YD", "YF", "YG", "YH", "YJ", "YK", "YL", "YM", "YN", "YP", "YQ", "YR", "YS", "YT", "YV", "YW", "YX", "YY", "YZ", "ZA", "ZB", "ZC", "ZD", "ZF", "ZG", "ZH", "ZJ", "ZK", "ZL", "ZM", "ZN", "ZP", "ZQ", "ZR", "ZS", "ZT", "ZU", "ZV", "ZW", "ZX", "ZY", "ZZ"]);
export type PackageTypeCodeEnum = z.infer<typeof PackageTypeCodeEnumSchema>;
export const PackageTypeCodeEnum = PackageTypeCodeEnumSchema.enum;

/** 
 * PackageTypeEmployeeDTOSchema 
 * @type { object }
 * @property { string } id  
 * @property { string } name  
 */
export const PackageTypeEmployeeDTOSchema = z.object({ id: z.string(), name: z.string() }).readonly();
export type PackageTypeEmployeeDTO = z.infer<typeof PackageTypeEmployeeDTOSchema>;

/** 
 * PackageTypeResponseDTOSchema 
 * @type { object }
 * @property { string } id Unique identifier for the package type 
 * @property { string } name Unique name for the package type 
 * @property { number } length Length of the package type 
 * @property { number } width Width of the package type 
 * @property { number } height Height of the package type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { boolean } archived Indicates if the package type is archived 
 * @property { PackageTypeCodeEnum } code  
 * @property { string } createdById  
 * @property { PackageTypeEmployeeDTO } createdBy  
 * @property { string } createdAt  
 * @property { string } updatedById  
 * @property { PackageTypeEmployeeDTO } updatedBy  
 * @property { string } updatedAt  
 */
export const PackageTypeResponseDTOSchema = z.object({ id: z.string().describe("Unique identifier for the package type"), name: z.string().describe("Unique name for the package type"), length: z.number().describe("Length of the package type").nullish(), width: z.number().describe("Width of the package type").nullish(), height: z.number().describe("Height of the package type").nullish(), unit: z.string().describe("Measurement unit for dimensions"), archived: z.boolean().describe("Indicates if the package type is archived"), code: PackageTypeCodeEnumSchema.nullish(), createdById: z.string().nullish(), createdBy: PackageTypeEmployeeDTOSchema.nullish(), createdAt: z.iso.datetime({ offset: true }), updatedById: z.string().nullish(), updatedBy: PackageTypeEmployeeDTOSchema.nullish(), updatedAt: z.iso.datetime({ offset: true }) }).readonly();
export type PackageTypeResponseDTO = z.infer<typeof PackageTypeResponseDTOSchema>;

/** 
 * CreatePackageTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Unique name for the package type 
 * @property { number } length Length of the package type 
 * @property { number } width Width of the package type 
 * @property { number } height Height of the package type 
 * @property { string } unit Measurement unit for dimensions 
 * @property { PackageTypeCodeEnum } code  
 */
export const CreatePackageTypeRequestDTOSchema = z.object({ name: z.string().describe("Unique name for the package type"), length: z.number().describe("Length of the package type").nullish(), width: z.number().describe("Width of the package type").nullish(), height: z.number().describe("Height of the package type").nullish(), unit: z.string().describe("Measurement unit for dimensions"), code: PackageTypeCodeEnumSchema.nullish() }).readonly();
export type CreatePackageTypeRequestDTO = z.infer<typeof CreatePackageTypeRequestDTOSchema>;

/** 
 * UpdatePackageTypeRequestDTOSchema 
 * @type { object }
 * @property { string } name Updated name for package type 
 * @property { number } length Updated length of the package type 
 * @property { number } width Updated width of the package type 
 * @property { number } height Updated height of the package type 
 * @property { string } unit Updated measurement unit for dimensions 
 * @property { PackageTypeCodeEnum } code  
 */
export const UpdatePackageTypeRequestDTOSchema = z.object({ name: z.string().describe("Updated name for package type"), length: z.number().describe("Updated length of the package type").nullable(), width: z.number().describe("Updated width of the package type").nullable(), height: z.number().describe("Updated height of the package type").nullable(), unit: z.string().describe("Updated measurement unit for dimensions"), code: PackageTypeCodeEnumSchema }).readonly();
export type UpdatePackageTypeRequestDTO = z.infer<typeof UpdatePackageTypeRequestDTOSchema>;

/** 
 * PackageTypePaginationFilterDtoSchema 
 * @type { object }
 * @property { boolean } archived Archived 
 * @property { string } search  
 */
export const PackageTypePaginationFilterDtoSchema = z.object({ archived: z.boolean().describe("Archived"), search: z.string() }).readonly();
export type PackageTypePaginationFilterDto = z.infer<typeof PackageTypePaginationFilterDtoSchema>;

/** 
 * PackageTypeLabelFilterDtoSchema 
 * @type { object }
 * @property { string } search  
 */
export const PackageTypeLabelFilterDtoSchema = z.object({ search: z.string() }).readonly();
export type PackageTypeLabelFilterDto = z.infer<typeof PackageTypeLabelFilterDtoSchema>;

/** 
 * PackageTypesPaginateOrderParamEnumSchema 
 * @type { enum }
 */
export const PackageTypesPaginateOrderParamEnumSchema = z.enum(["matchCode", "description", "length", "width", "height", "unit", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PackageTypesPaginateOrderParamEnum = z.infer<typeof PackageTypesPaginateOrderParamEnumSchema>;
export const PackageTypesPaginateOrderParamEnum = PackageTypesPaginateOrderParamEnumSchema.enum;

/** 
 * PackageTypesPaginateResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { PackageTypeResponseDTO[] } items  
 */
export const PackageTypesPaginateResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(PackageTypeResponseDTOSchema).readonly() }).readonly().shape });
export type PackageTypesPaginateResponse = z.infer<typeof PackageTypesPaginateResponseSchema>;

/** 
 * PackageTypesPaginateLabelsOrderParamEnumSchema 
 * @type { enum }
 */
export const PackageTypesPaginateLabelsOrderParamEnumSchema = z.enum(["matchCode", "description", "length", "width", "height", "unit", "name", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
export type PackageTypesPaginateLabelsOrderParamEnum = z.infer<typeof PackageTypesPaginateLabelsOrderParamEnumSchema>;
export const PackageTypesPaginateLabelsOrderParamEnum = PackageTypesPaginateLabelsOrderParamEnumSchema.enum;

/** 
 * PackageTypesPaginateLabelsResponseSchema 
 * @type { object }
 * @property { number } page 1-indexed page number to begin from 
 * @property { string } cursor ID of item to start after 
 * @property { string } nextCursor Cursor for next set of items 
 * @property { number } limit Items per response 
 * @property { number } totalItems Total available items 
 * @property { CommonModels.LabelResponseDTO[] } items  
 */
export const PackageTypesPaginateLabelsResponseSchema = z.object({ ...CommonModels.PaginationDtoSchema.shape, ...z.object({ items: z.array(CommonModels.LabelResponseDTOSchema).readonly() }).readonly().shape });
export type PackageTypesPaginateLabelsResponse = z.infer<typeof PackageTypesPaginateLabelsResponseSchema>;

}
