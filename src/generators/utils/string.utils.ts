export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const decapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

export const kebabToCamel = (str: string) => str.replace(/(-\w)/g, (group) => group[1].toUpperCase());

export const snakeToCamel = (str: string) => str.replace(/(_\w)/g, (group) => group[1].toUpperCase());

export const suffixIfNeeded = (text: string, suffix = "") => (text.endsWith(suffix) ? text : `${text}${suffix}`);

export const removeSuffix = (text: string, suffix: string) => text.replace(new RegExp(`${suffix}$`), "");
