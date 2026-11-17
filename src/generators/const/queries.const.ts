import { Import } from "@/generators/types/generate";

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

/** Last query key element of cursor paginated infinite queries, separating their pages from page-number ones. */
export const CURSOR_INFINITE_QUERY_KEY = "cursor-v1";
