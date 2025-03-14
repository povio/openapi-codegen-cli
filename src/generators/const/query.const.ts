import { Import } from "../types/generate";

export const QUERY_HOOKS = {
  query: "useQuery",
  mutation: "useMutation",
  queryClient: "useQueryClient",
};
export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_HOOKS.mutation, QUERY_HOOKS.queryClient],
  from: "@tanstack/react-query",
};
