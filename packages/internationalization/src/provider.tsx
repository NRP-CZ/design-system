import * as React from 'react'
import { I18nextProvider } from 'react-i18next';
import type { I18nextProviderProps } from 'react-i18next';

export const TranslationsProvider: React.FC<I18nextProviderProps> = ({ children, ...props }) => <I18nextProvider {...props} >{children}</I18nextProvider>;
