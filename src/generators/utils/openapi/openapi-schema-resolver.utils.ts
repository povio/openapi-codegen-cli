import { OpenAPIV3 } from "openapi-types";
import { getNested } from "../object.utils";
import { normalizeString } from "./openapi.utils";

type RefInfo = {
  ref: string;
  name: string;
  normalized: string;
};

export type OpenAPISchemaResolver = {
  getSchemaByRef: (ref: string) => OpenAPIV3.SchemaObject;
  resolveRef: (ref: string) => RefInfo;
  resolveSchemaName: (normalized: string) => RefInfo;
};

export const getOpenAPISchemaResolver = (openApiDoc: OpenAPIV3.Document): OpenAPISchemaResolver => {
  // both used for debugging purpose
  // eslint-disable-next-line sonarjs/no-unused-collection
  const nameByRef = new Map<string, string>();
  // eslint-disable-next-line sonarjs/no-unused-collection
  const refByName = new Map<string, string>();

  const byRef = new Map<string, RefInfo>();
  const byNormalized = new Map<string, RefInfo>();

  const getSchemaByRef = (ref: string) => {
    // #components -> #/components
    const correctRef = autocorrectRef(ref);
    const split = correctRef.split("/");

    // "#/components/schemas/Something.jsonld" -> #/components/schemas
    const path = split.slice(1, -1).join("/")!;
    const map = getNested(openApiDoc, path.replace("#/", "").replace("#", "").replaceAll("/", ".")) ?? ({} as any);

    // "#/components/schemas/Something.jsonld" -> "Something.jsonld"
    const name = split[split.length - 1]!;
    const normalized = normalizeString(name);

    nameByRef.set(correctRef, normalized);
    refByName.set(normalized, correctRef);

    const infos = { ref: correctRef, name, normalized };
    byRef.set(infos.ref, infos);
    byNormalized.set(infos.normalized, infos);

    // doc.components.schemas["Something.jsonld"]
    return map[name] as OpenAPIV3.SchemaObject;
  };

  return {
    getSchemaByRef,
    resolveRef: (ref: string) => byRef.get(autocorrectRef(ref))!,
    resolveSchemaName: (normalized: string) => byNormalized.get(normalized)!,
  };
};

const autocorrectRef = (ref: string) => (ref[1] === "/" ? ref : "#/" + ref.slice(1));
