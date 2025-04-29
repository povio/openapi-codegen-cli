import { Import } from "../types/generate";

export const QUERY_HOOKS = {
  query: "useQuery",
  infiniteQuery: "useInfiniteQuery",
  mutation: "useMutation",
  queryClient: "useQueryClient",
};
export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_HOOKS.infiniteQuery, QUERY_HOOKS.mutation, QUERY_HOOKS.queryClient],
  from: "@tanstack/react-query",
};

export const INFINITE_QUERY_PARAMS = {
  pageParamName: "page",
};
export const INFINITE_QUERY_RESPONSE_PARAMS = {
  pageParamName: "page",
  totalItemsName: "totalItems",
  limitParamName: "limit",
};

export const QUERIES_MODULE_NAME = "moduleName";
