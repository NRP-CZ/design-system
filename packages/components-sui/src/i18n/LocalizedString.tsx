import * as React from 'react'
import { type ComponentProps, useLocalizedValue } from "@repo/core";
import type { MultilingualValue } from '@nrp-cz/internationalization';


export type LocalizedStringProps<T extends React.ElementType = 'span'> = ComponentProps<{
    as?: T;
    value: MultilingualValue;
}>

/**
 * A simple element that tries to display the string-based value in user's current locale.
 *
 * This component utilizes the `useLocalizedValue` hook to resolve the appropriate string
 * from a `MultilingualValue` object for the current i18n language. It also supports fallback
 * languages and gracefully handles missing values.
 *
 */
export function LocalizedString<T extends React.ElementType = 'span'> (props: LocalizedStringProps<T>): JSX.Element {
    const { as: Component = 'span', value, ...rest } = props
    const localizedValue = useLocalizedValue(value)

    return <Component {...rest}>{localizedValue}</Component>;
};
