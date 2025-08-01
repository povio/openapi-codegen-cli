import { OpenAPIV3 } from "openapi-types";
import { BrandEnum, BRANDS } from "src/generators/const/brands.const";
import { ZOD_UTILS } from "src/generators/const/deps.const";
import { GenerateOptions } from "src/generators/types/options";
import { isPrimitiveType } from "./openapi.utils";

export function getPrimitiveBrands() {
  return Object.values(BrandEnum).filter((brand) => isPrimitiveType(BRANDS[brand].type));
}

export function getOtherBrands() {
  return Object.values(BrandEnum).filter((brand) => !isPrimitiveType(BRANDS[brand].type));
}

export function matchesBrand(schema: OpenAPIV3.SchemaObject, brand: BrandEnum) {
  const brandSchema = BRANDS[brand];

  if (schema.type !== brandSchema.type || (brandSchema.format && schema.format !== brandSchema.format)) {
    return false;
  }

  const hasAllProperties = Object.entries(
    (brandSchema.properties as Record<string, OpenAPIV3.SchemaObject>) ?? {},
  ).every(([key, value]) => {
    const propertySchemaObj = schema.properties?.[key] as OpenAPIV3.SchemaObject | undefined;
    return propertySchemaObj && propertySchemaObj.type === value.type && propertySchemaObj.format === value.format;
  });

  if (!hasAllProperties) {
    return false;
  }

  return true;
}

export function wrapWithBrand(schema: string, brand: BrandEnum, options: GenerateOptions) {
  return options.branded ? `${ZOD_UTILS.namespace}.${ZOD_UTILS.exports.brand}(${schema}, "${brand}")` : schema;
}
