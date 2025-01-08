import * as React from 'react'
import "semantic-ui-css/semantic.min.css";
import { initializeI18next, TranslationsProvider } from "@nrp-cz/internationalization"

const i18n = await initializeI18next()

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    i18n,
    actions: { argTypesRegex: "^on.*" },
  },
};

export default preview;
