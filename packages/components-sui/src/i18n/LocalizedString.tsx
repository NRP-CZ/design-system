import * as React from 'react'
// import { i18next } from '@translations/oarepo_ui/i18next'


export interface LocalizedStringProps {
    value: object;
    testId?: string;
}

export const LocalizedString: React.FC<LocalizedStringProps> = ({ value, testId }) => {
    const localizedValue =
        value[i18next.language] ||
        value[i18next.options.fallbackLng] ||
        Object.values(value).shift();

    return <>{localizedValue}</>;
};
