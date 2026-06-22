import type { QueryClient, QueryKey } from "@tanstack/react-query";

const CROSS_TAB_INVALIDATE_KEY = "__rq_invalidate__";

export const broadcastQueryInvalidation = (queryKeys: QueryKey[]) => {
  localStorage.setItem(CROSS_TAB_INVALIDATE_KEY, JSON.stringify({ keys: queryKeys, timestamp: Date.now() }));
};

let isListenerSetUp = false;

export const setupCrossTabListener = (queryClient: QueryClient) => {
  if (isListenerSetUp) return;
  isListenerSetUp = true;

  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key !== CROSS_TAB_INVALIDATE_KEY || !e.newValue) return;

    try {
      const { keys } = JSON.parse(e.newValue) as { keys: QueryKey[] };
      for (const queryKey of keys) {
        queryClient.invalidateQueries({ queryKey });
      }
    } catch {
      // Ignore malformed payloads
    }
  });
};
