import * as React from 'react'
import "semantic-ui-css/semantic.min.css";
import { initializeI18next, languages } from "@nrp-cz/internationalization"
import { initialize, mswLoader } from 'msw-storybook-addon';

import type { Preview } from '@storybook/react'


const i18n = await initializeI18next()

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  // decorators: [withI18next],
  initialGlobals: {
    locale: 'en',
    locales: languages.reduce((o, code) => ({ ...o, [code]: { title: code.toUpperCase() } }), {})

  },
  parameters: {
    i18n,
    actions: { argTypesRegex: "^on.*" },
    docs: {
      toc: true, // 👈 Enables the table of contents
    },
  },
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
  tags: ['autodocs'],
};

export default preview;

