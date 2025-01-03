import React from 'react';
import { useButton } from '@repo/core';
import { Button as SemanticButton } from 'semantic-ui-react'

export interface ButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    testId?: string;
}
export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, testId }) => {
    const { handleClick, isPressed } = useButton({ onClick, disabled });
    return (
        <SemanticButton
            className={`px-4 py-2 ${isPressed ? 'bg-blue-700' : 'bg-blue-500'} text-white`}
            data-testid={testId}
            disabled={disabled}
            onClick={onClick}
            primary={false}
        >
            {label}
        </SemanticButton>
    );
};
