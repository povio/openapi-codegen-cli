import i18next from "i18next";

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

const defaultLanguage = "en";

const i18n = i18next.createInstance();
i18n.init({
  compatibilityJSON: "v4",
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  resources,
  ns: Object.keys(resources.en),
  defaultNS: ns,
  interpolation: {
    escapeValue: false,
  },
});

export const defaultT = i18n.t.bind(i18n);
