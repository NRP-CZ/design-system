import { JSXElementConstructor, ReactNode } from "react";

export type ReactTag =
  | keyof React.JSX.IntrinsicElements
  | JSXElementConstructor<any>;

/**
 * Commonly shared UI component properties
 */
export type ComponentProps<ExtraProps = {}> = {
  children?: ReactNode;
  testId?: string;
} & ExtraProps;

export type * from "./requests";
