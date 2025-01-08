import * as React from 'react'
import "semantic-ui-css/semantic.min.css";
import { initializeI18next, I18nextProvider, languages } from "@nrp-cz/internationalization"

const i18n = await initializeI18next()

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: languages.map(code => ({ value: code, title: code.toUpperCase() })),
      showName: true,
    },
  },
};


const withI18next = (Story, context) => {
  const { locale } = context.globals;

  // When the locale global changes
  // Set the new locale in i18n
  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <React.Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </React.Suspense>
  );
};


export const decorators = [withI18next];

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    i18n,
    actions: { argTypesRegex: "^on.*" },
    docs: {
      toc: true, // 👈 Enables the table of contents
    },
  },
  tags: ['autodocs'],
};

export default preview;
