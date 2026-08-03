import { ObjectLiteral } from "@/generators/types/common";

/** @see https://gist.github.com/RubyTuesdayDONO/5006455 */
export function topologicalSort(graph: Record<string, Set<string>>) {
  const sorted: string[] = [];
  const sortedNames = new Set<string>();
  const visited = new Set<string>();

  function visit(name: string, ancestors: Set<string>) {
    ancestors.add(name);
    visited.add(name);

    if (graph[name]) {
      graph[name].forEach((dep) => {
        // if already in ancestors, a closed chain (recursive relation) exists
        if (ancestors.has(dep)) {
          return;
        }
        // if already exists, do nothing
        if (visited.has(dep)) {
          return;
        }
        visit(dep, ancestors);
      });
    }
    ancestors.delete(name);

    if (!sortedNames.has(name)) {
      sortedNames.add(name);
      sorted.push(name);
    }
  }

  Object.keys(graph).forEach((name) => visit(name, new Set()));

  return sorted;
}

/** Sort object keys using a reference order array, sort keys not in reference order in lasts positions */
export function sortObjKeysFromArray<T extends ObjectLiteral>(obj: T, orderedKeys: Array<keyof T>) {
  const entries = Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
  const keyRanks = new Map(orderedKeys.map((key, index) => [key, index]));
  const orderedEntries: Array<[keyof T, T[keyof T]]> = [];
  const remainingEntries: Array<[keyof T, T[keyof T]]> = [];
  for (const entry of entries) {
    (keyRanks.has(entry[0]) ? orderedEntries : remainingEntries).push(entry);
  }

  orderedEntries.sort(([a], [b]) => keyRanks.get(a)! - keyRanks.get(b)!);
  return Object.fromEntries(orderedEntries.concat(remainingEntries));
}
