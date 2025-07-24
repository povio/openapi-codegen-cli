import { OpenAPIV3 } from "openapi-types";

const DATETIME_SCHEMA: OpenAPIV3.SchemaObject = { type: "string", format: "date-time" };

const EMAIL_SCHEMA: OpenAPIV3.SchemaObject = { type: "string", format: "email" };

const DATE_RANGE_SCHEMA: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    start: { type: "string", format: "date-time" },
    end: { type: "string", format: "date-time" },
  },
};

const TEXT_EDITOR_SCHEMA: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    html: { type: "string" },
    json: { type: "object" },
  },
};

export enum BrandEnum {
  datetime = "datetime",
  email = "email",
  dateRange = "dateRange",
  textEditor = "textEditor",
}

export const BRANDS: Record<BrandEnum, OpenAPIV3.SchemaObject> = {
  [BrandEnum.datetime]: DATETIME_SCHEMA,
  [BrandEnum.email]: EMAIL_SCHEMA,
  [BrandEnum.dateRange]: DATE_RANGE_SCHEMA,
  [BrandEnum.textEditor]: TEXT_EDITOR_SCHEMA,
};
