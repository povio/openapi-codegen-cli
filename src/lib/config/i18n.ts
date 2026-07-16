import translationEN from "../assets/locales/en/translation.json";
import translationSL from "../assets/locales/sl/translation.json";

export const ns = "openapi";
export const resources = {
  en: {
    [ns]: translationEN,
  },
  sl: {
    [ns]: translationSL,
  },
} as const;

export type TranslateFunction = (key: string, options?: { ns?: string }) => string;

let getT: (() => TranslateFunction) | null = null;

export function configureTranslations<T>(getter: () => T) {
  getT = () => getter() as TranslateFunction;
}

export function resolveT(): TranslateFunction {
  if (!getT) {
    throw new Error("Translations not configured. Call configureTranslations() at app startup.");
  }
  return getT();
}
