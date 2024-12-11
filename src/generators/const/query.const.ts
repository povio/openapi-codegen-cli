import { Import } from "../types/generate";

export const QUERY_HOOKS = {
  query: "useQuery",
  mutation: "useMutation",
};
export const QUERY_OPTIONS_TYPES = {
  query: "UseQueryOptions",
  mutation: "UseMutationOptions",
};
export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_OPTIONS_TYPES.query, QUERY_HOOKS.mutation, QUERY_OPTIONS_TYPES.mutation],
  from: "@tanstack/react-query",
};
