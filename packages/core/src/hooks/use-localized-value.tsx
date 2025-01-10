import * as React from "react";
import { useTranslation, fallbackLng } from "@nrp-cz/internationalization";
import type { MultilingualValue } from "@nrp-cz/internationalization";

export type UseLocalizedValueProps = MultilingualValue;

/**
 * Returns a localized string from a `MultilingualValue` object corresponding to the current i18n language.
 * - If no match is found, tries to find match with `fallbackLng` option.
 * - If still no match, returns the first entry found
 * - Finally if it can't find anything, it returns undefined
 */
export function useLocalizedValue(
  value: UseLocalizedValueProps
): string | undefined {
  const { i18n } = useTranslation();

  const currentLanguageValue = value[i18n.language];
  const fallbackLanguage = i18n.options?.fallbackLng ?? fallbackLng;

  function findfallbackLngValue() {
    if (typeof fallbackLanguage === "string") {
      return value[fallbackLanguage];
    } else if (Array.isArray(fallbackLanguage)) {
      const matchingCode = fallbackLanguage.find(
        (lngCode) => value[lngCode]
      ) as string;
      if (matchingCode) {
        return value[matchingCode];
      }
    }
  }

  return (
    currentLanguageValue ||
    findfallbackLngValue() ||
    Object.values(value).shift()
  );
}

export default useLocalizedValue;
