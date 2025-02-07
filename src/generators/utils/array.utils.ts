export const getUniqueArray = <T>(...arrs: T[][]): T[] => [...new Set(arrs.flat())];
