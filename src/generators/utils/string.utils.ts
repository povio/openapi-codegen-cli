export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const kebabToCamel = (str: string) => str.replace(/(-\w)/g, (group) => group[1].toUpperCase());

export const snakeToCamel = (str: string) => str.replace(/(_\w)/g, (group) => group[1].toUpperCase());
