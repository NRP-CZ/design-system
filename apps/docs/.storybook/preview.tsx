import * as React from 'react'
import "semantic-ui-css/semantic.min.css";
import { initializeI18next, I18nextProvider, languages } from "@nrp-cz/internationalization"
import type { Preview } from '@storybook/react'

const i18n = await initializeI18next()


// const withI18next = (Story: any, context: any) => {
//   const { locale } = context.globals;
//   // When the locale global changes
//   // Set the new locale in i18n
//   React.useEffect(() => {
//     i18n.changeLanguage(locale);
//   }, [locale]);

//   return (
//     <React.Suspense fallback={<div>loading translations...</div>}>
//       <I18nextProvider i18n={i18n}>
//         <Story />
//       </I18nextProvider>
//     </React.Suspense>
//   );
// };

// export const decorators = [withI18next]

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
  tags: ['autodocs'],
};

export default preview;
console.log(preview.initialGlobals!.locales)

