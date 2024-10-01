import { Import } from "../types/generate";

export const QUERY_HOOKS = {
  query: "useQuery",
  mutation: "useMutation",
};

export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_HOOKS.mutation],
  from: "@tanstack/react-query",
};
