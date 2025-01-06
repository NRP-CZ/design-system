import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import type { i18n as I18N } from "i18next";
import { getOptions } from "./options";

export const initializeI18next = async (): Promise<I18N> => {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(),
      lng: undefined, // let detect the language on client side
      detection: {
        order: ["htmlTag"],
      },
      preload: [],
    });
  return i18next;
};
