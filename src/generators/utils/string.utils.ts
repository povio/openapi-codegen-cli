export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const decapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

export const kebabToCamel = (str: string) => str.replace(/(-\w)/g, (group) => group[1].toUpperCase());

export const snakeToCamel = (str: string) => str.replace(/(_\w)/g, (group) => group[1].toUpperCase());

export const nonWordCharactersToCamel = (str: string) =>
  str.replace(/[\W_]+(\w)?/g, (_, char) => char?.toUpperCase() ?? "");

export const suffixIfNeeded = (text: string, suffix = "") => (text.endsWith(suffix) ? text : `${text}${suffix}`);

export const removeSuffix = (text: string, suffix: string) => text.replace(new RegExp(`${suffix}$`), "");

export const getLongestMostCommon = (strs: string[]): string | undefined => {
  const counter = strs.reduce((acc, str) => ({ ...acc, [str]: (acc[str] ?? 0) + 1 }), {} as Record<string, number>);
  const sortedEntries = Object.entries(counter).sort((a, b) => {
    if (a[1] === b[1]) {
      return b[0].length - a[0].length;
    }
    return b[1] - a[1];
  });
  return sortedEntries[0]?.[0];
};

export const getMostCommonAdjacentCombinationSplit = (strs: string[]): string | undefined => {
  const splits = strs
    .map(capitalize)
    .map(splitByUppercase)
    .map((split) => getAdjacentStringCombinations(split))
    .flat();
  return getLongestMostCommon(splits);
};

export const splitByUppercase = (str: string): string[] => {
  return str.split(/(?<![A-Z])(?=[A-Z])/).filter(Boolean);
};

export const camelToSpaceSeparated = (text: string) => splitByUppercase(text).join(" ");

export const getAdjacentStringCombinations = (
  strs: string[],
  ignoreStrs = ["dto", "by", "for", "of", "in", "to", "and", "with"],
): string[] => {
  const combinations = [];
  for (let i = 0; i < strs.length; i++) {
    if (ignoreStrs.includes(strs[i].toLowerCase())) {
      continue;
    }
    for (let j = i + 1; j <= strs.length; j++) {
      if (ignoreStrs.includes(strs[j - 1]?.toLowerCase())) {
        continue;
      }
      combinations.push(strs.slice(i, j).join(""));
    }
  }
  return combinations;
};

export const removeWord = (source: string, wordToRemove: string) => {
  const singularWordToRemove = wordToRemove.replace(/es$|s$/g, "");
  const pattern = new RegExp(
    `(${decapitalize(singularWordToRemove)}|${capitalize(singularWordToRemove)})[a-z]*(?=$|[A-Z])`,
    "g",
  );
  return source.replace(pattern, "");
};

export const isString = (str: string | undefined): str is string => str !== undefined;
