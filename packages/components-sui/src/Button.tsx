import React, { ElementType } from 'react';
import { ComponentProps, useButton } from '@repo/core';
import { Button as SemanticButton, StrictButtonProps } from 'semantic-ui-react'
import { translated, TranslatedProps } from '@nrp-cz/internationalization';


export type ButtonProps = ComponentProps<{
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}> & TranslatedProps & StrictButtonProps

function ButtonFn (props: ButtonProps): JSX.Element {
    const { as, onClick, disabled, testId, label, t, primary } = props
    const { handleClick, isPressed } = useButton({ onClick, disabled });

    return (
        <SemanticButton
            as={as}
            className={`px-4 py-2 ${isPressed ? 'bg-blue-700' : 'bg-blue-500'} text-white`}
            data-testid={testId}
            disabled={disabled}
            onClick={onClick}
            primary={primary}
        >
            {t(label)}
        </SemanticButton>
    );
};

export const Button = translated(ButtonFn)