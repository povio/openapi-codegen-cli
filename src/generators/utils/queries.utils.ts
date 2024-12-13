import { Endpoint } from "../types/endpoint";

export const isQuery = (endpoint: Endpoint) => endpoint.method === "get";

export const isMutation = (endpoint: Endpoint) => endpoint.method !== "get";
