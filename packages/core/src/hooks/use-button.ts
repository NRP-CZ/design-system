import { useState } from "react";

export interface UseButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}
export const useButton = ({ onClick, disabled }: UseButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = () => !disabled && setIsPressed(true);
  const handlePressOut = () => !disabled && setIsPressed(false);
  const handleClick = () => !disabled && onClick?.();
  return {
    isPressed,
    handlePressIn,
    handlePressOut,
    handleClick,
  };
};
