import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "@nrp-cz/internationalization";
import { useLocalizedValue } from "./use-localized-value";

jest.mock("@nrp-cz/internationalization", () => ({
  useTranslation: jest.fn(),
  fallbackLng: "en",
}));

describe("useLocalizedValue", () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the value for the current language if it exists", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "en", options: {} },
    });

    const value = {
      en: "Hello",
      cs: "Ahoj",
    };

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBe("Hello");
  });

  it("falls back to fallbackLng if current language value does not exist", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "fr", options: {} },
    });

    const value = {
      en: "Hello",
      cs: "Ahoj",
    };

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBe("Hello");
  });

  it("falls back to the first available value if neither current nor fallbackLng value exists", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "fr", options: {} },
    });

    const value = {
      cs: "Ahoj",
    };

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBe("Ahoj");
  });

  it("returns undefined if no values exist in the MultilingualValue object", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "en", options: {} },
    });

    const value = {};

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBeUndefined();
  });

  it("handles fallbackLng as an array", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "fr", options: { fallbackLng: ["cs", "en"] } },
    });

    const value = {
      en: "Hello",
      cs: "Ahoj",
    };

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBe("Ahoj");
  });

  it("returns the first fallbackLng value if multiple fallbackLngs match", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "fr", options: { fallbackLng: ["en", "cs"] } },
    });

    const value = {
      en: "Hello",
      cs: "Ahoj",
    };

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBe("Hello");
  });

  it("returns false if fallbackLng is not a string or array", () => {
    mockUseTranslation.mockReturnValue({
      i18n: { language: "fr", options: { fallbackLng: 1 } },
    });

    const value = {};

    const { result } = renderHook(() => useLocalizedValue({ value }));

    expect(result.current).toBeFalsy(); // Should return undefined as fallbackLng is invalid
  });
});
