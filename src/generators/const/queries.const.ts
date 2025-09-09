import { Import } from "src/generators/types/generate";

export const QUERY_HOOKS = {
  query: "useQuery",
  infiniteQuery: "useInfiniteQuery",
  mutation: "useMutation",
};
export const QUERY_IMPORT: Import = {
  bindings: [QUERY_HOOKS.query, QUERY_HOOKS.infiniteQuery, QUERY_HOOKS.mutation],
  from: "@tanstack/react-query",
};

export const QUERIES_MODULE_NAME = "moduleName";
