import type { QueryClient, QueryKey } from "@tanstack/react-query";

const CROSS_TAB_INVALIDATE_KEY = "__rq_invalidate__";

/**
 * Broadcasts a query invalidation event to all other open tabs via localStorage.
 *
 * @param queryKeys - An array of query keys to invalidate (array of arrays).
 *
 * NOTE: The `storage` event only fires in *other* tabs — the calling tab
 * must invalidate its own queryClient separately if needed.
 */
export const broadcastQueryInvalidation = (queryKeys: QueryKey[]) => {
  localStorage.setItem(CROSS_TAB_INVALIDATE_KEY, JSON.stringify({ keys: queryKeys, timestamp: Date.now() }));
};

/**
 * Registers a one-time global `storage` event listener that reacts to
 * cross-tab invalidation broadcasts. Safe to call from multiple hooks —
 * only the first call sets up the listener.
 */
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
