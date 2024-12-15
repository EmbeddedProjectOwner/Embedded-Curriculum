import type { ReactNode } from 'react';
import type { LinkItemType } from '../layouts/links';
import type { NavProviderProps, TitleProps } from '../components/layout/nav';
export interface NavOptions extends SharedNavProps {
    enabled: boolean;
    component: ReactNode;
}
export interface SharedNavProps extends TitleProps, NavProviderProps {
    /**
     * Show/hide search toggle
     *
     * Note: Enable/disable search from root provider instead
     */
    enableSearch?: boolean;
    children?: ReactNode;
}
export interface BaseLayoutProps {
    /**
     * Remove theme switcher component
     */
    disableThemeSwitch?: boolean;
    /**
     * Enable Language Switch
     *
     * @defaultValue false
     */
    i18n?: boolean;
    /**
     * GitHub url
     */
    githubUrl?: string;
    links?: LinkItemType[];
    /**
     * Replace or disable navbar
     */
    nav?: Partial<NavOptions>;
    children?: ReactNode;
}
/**
 * Get Links Items with shortcuts
 */
export declare function getLinks(links?: LinkItemType[], githubUrl?: string): LinkItemType[];
export declare function replaceOrDefault(obj: {
    enabled?: boolean;
    component?: ReactNode;
} | undefined, def: ReactNode, customComponentProps?: object, disabled?: ReactNode): ReactNode;
//# sourceMappingURL=shared.d.ts.map