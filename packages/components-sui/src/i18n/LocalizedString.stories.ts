import type { Meta, StoryObj } from "@storybook/react";
import { LocalizedString } from "./LocalizedString";

/**
 * A simple element that tries to display the string-based value in user's current locale.
 *
 * This component utilizes the `useLocalizedValue` hook to resolve the appropriate string
 * from a `MultilingualValue` object for the current i18n language. It also supports fallback
 * languages and gracefully handles missing values.
 *
 */
const meta: Meta<typeof LocalizedString> = {
  title: "🌐 i18n/LocalizedString",
  component: LocalizedString,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LocalizedString>;

/**
 * Detects and uses the current browser locale.
 */
export const CurrentLocale: Story = {
  args: {
    value: {
      en: "Hello",
      cs: "Ahoj",
      de: "Hallo",
    },
  },
};

/**
 * Uses value matching the i18next `fallbackLng` option
 */
export const FallbackLng: Story = {
  args: {
    value: {
      es: "Hola",
      en: "Hello",
    },
  },
};

/**
 * Uses first available value if both current locale & `fallbackLng` doesn't match
 */
export const FallbackToGerman: Story = {
  args: {
    value: {
      de: "Hallo",
      es: "Hola",
    },
  },
};

/**
 * Renders empty element
 */
export const NoValueAvailable: Story = {
  args: {
    value: {},
  },
};

/**
 * Render as a heading element
 */
export const CustomElement: Story = {
  args: {
    value: {
      en: "Hello",
      cs: "Ahoj",
    },
    as: "h1",
  },
};
