import { type ReactNode } from 'react';
import { type Translations, type LocaleItem } from './contexts/i18n';
interface I18nProviderProps {
    /**
     * Current locale
     */
    locale: string;
    /**
     * Translations of current locale
     */
    translations?: Partial<Translations>;
    /**
     * Available languages
     */
    locales?: LocaleItem[];
    /**
     * Handle changes to the locale, redirect user when not specified.
     */
    onChange?: (v: string) => void;
    children: ReactNode;
}
export declare function I18nProvider({ locales, locale, ...props }: I18nProviderProps): import("react/jsx-runtime").JSX.Element;
export { type Translations };
//# sourceMappingURL=i18n.d.ts.map