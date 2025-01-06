import { WithTranslation, withTranslation } from "react-i18next";
import { defaultNS } from "./options";

export type TranslatedProps = WithTranslation;

export function translated(
  Component: React.ComponentType<any>,
  namespace: string = defaultNS
): any {
  return withTranslation(namespace)(Component);
}
