import { JSXElementConstructor, ReactElement, ReactNode } from "react";

export type ReactTag =
  | keyof React.JSX.IntrinsicElements
  | JSXElementConstructor<any>;

export type ComponentProps<ExtraProps = {}> = {
  children?: ReactNode;
  testId?: string;
} & ExtraProps;
