import * as React from 'react'
import "semantic-ui-css/semantic.min.css";
import { initializeI18next, TranslationsProvider } from "@nrp-cz/internationalization"

const i18n = await initializeI18next()

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on.*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    decorators: [
      (Story) => (
        <TranslationsProvider i18n={i18n}><Story /></TranslationsProvider>
      )
    ]
  },
};

export default preview;
