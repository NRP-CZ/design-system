export const useTranslation = jest.fn(() => ({
  t: (key: string): string => key, // basic implementation for demonstration
  i18n: {
    language: "en",
  },
}));

export const fallbackLng = "en";
