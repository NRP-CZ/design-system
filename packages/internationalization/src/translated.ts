import { withTranslation } from "react-i18next";
import { defaultNS } from "./options";

import type { TFunction, WithTranslation } from "react-i18next";

export type TranslatedProps = WithTranslation;

export const defaultT: TFunction = (key: string) => key;

export function translated(
  Component: React.ComponentType<any>,
  namespace: string = defaultNS
): any {
  return withTranslation(namespace)(Component);
}
