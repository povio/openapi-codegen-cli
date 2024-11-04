export const isValidPropertyName = (str: string) => /^(?:[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+)$/.test(str);

export const invalidVariableNameCharactersToCamel = (str: string) =>
  str.replace(/[^a-zA-Z0-9_$]+(\w)?/g, (_, char) => char?.toUpperCase() ?? "");
