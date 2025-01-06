import type { InitOptions } from "i18next";

export const fallbackLng = "en";
export const languages = [fallbackLng, "cs"];
export const defaultNS = "translation";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
): InitOptions {
  return {
    debug: process.env.NODE_ENV === "development",
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS: Array.isArray(ns) ? ns[0] : ns,
    ns,
    // saves all keys unable to resolve during runtime using the attached backend
    saveMissing: true,
    react: {
      // Set empty - to allow html tags convert to trans tags
      // HTML TAG | Trans TAG
      //  <span>  | <1>
      transKeepBasicHtmlNodesFor: [],
    },
  };
}
