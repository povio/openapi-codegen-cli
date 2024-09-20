import { ObjectLiteral } from "../types/types";

/** @see https://gist.github.com/RubyTuesdayDONO/5006455 */
export function topologicalSort(graph: Record<string, Set<string>>) {
  const sorted: string[] = []; // sorted list of IDs ( returned value )
  const visited: Record<string, boolean> = {}; // hash: id of already visited node => true

  function visit(name: string, ancestors: string[]) {
    if (!Array.isArray(ancestors)) {
      ancestors = [];
    }
    ancestors.push(name);
    visited[name] = true;

    if (graph[name]) {
      graph[name]!.forEach((dep) => {
        // if already in ancestors, a closed chain (recursive relation) exists
        if (ancestors.includes(dep)) {
          return;
        }
        // if already exists, do nothing
        if (visited[dep]) {
          return;
        }
        visit(dep, ancestors.slice(0)); // recursive call
      });
    }

    if (!sorted.includes(name)) {
      sorted.push(name);
    }
  }

  Object.keys(graph).forEach((name) => visit(name, []));

  return sorted;
}

/** Sort object keys using a reference order array, sort keys not in reference order in lasts positions */
export function sortObjKeysFromArray<T extends ObjectLiteral>(obj: T, orderedKeys: Array<keyof T>) {
  const entries = Object.entries(obj) as Array<[keyof T, T[keyof T]]>;

  const sortedEntries = entries
    .filter(([key]) => orderedKeys.includes(key))
    .sort(([a], [b]) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b))
    .concat(entries.filter(([key]) => !orderedKeys.includes(key)));
  return Object.fromEntries(sortedEntries);
}
