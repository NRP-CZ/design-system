import * as React from 'react'
import { ComponentProps, useButton } from '@repo/core';
import { translated, TranslatedProps } from '@nrp-cz/internationalization';


export type LocalizedStringProps = ComponentProps<{
    value: object;
}> & TranslatedProps

function LocalizedStringFn (props: LocalizedStringProps): JSX.Element {
    const { as, onClick, disabled, testId, label, t, primary } = props
    const { handleClick, isPressed } = useButton({ onClick, disabled });
    
    return <React.Fragment as={as}>{localizedValue}</React.Fragment => ;
};



export const LocalizedString: React.FC<LocalizedStringProps> = ({ value, testId }) => {

};
