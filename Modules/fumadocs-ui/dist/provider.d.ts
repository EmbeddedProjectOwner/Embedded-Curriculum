import { ThemeProvider } from 'next-themes';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import type { DefaultSearchDialogProps } from './components/dialog/search-default';
import { type SearchProviderProps } from './contexts/search';
interface SearchOptions extends Omit<SearchProviderProps, 'options' | 'children'> {
    options?: Partial<DefaultSearchDialogProps> | SearchProviderProps['options'];
    /**
     * Enable search functionality
     *
     * @defaultValue `true`
     */
    enabled?: boolean;
}
export interface RootProviderProps {
    /**
     * `dir` option for Radix UI
     */
    dir?: 'rtl' | 'ltr';
    /**
     * @remarks `SearchProviderProps`
     */
    search?: Partial<SearchOptions>;
    /**
     * Customise options of `next-themes`
     */
    theme?: Partial<ComponentPropsWithoutRef<typeof ThemeProvider>> & {
        /**
         * Enable `next-themes`
         *
         * @defaultValue true
         */
        enabled?: boolean;
    };
    children: ReactNode;
}
export declare function RootProvider({ children, dir, theme: { enabled, ...theme }, search, }: RootProviderProps): React.ReactElement;
export { useI18n, I18nLabel } from './contexts/i18n';
export { SearchProvider, SearchOnly, useSearchContext, type SearchProviderProps, } from './contexts/search';
export { SidebarProvider, useSidebar } from './contexts/sidebar';
export { useTreePath, useTreeContext, TreeContextProvider, } from './contexts/tree';
//# sourceMappingURL=provider.d.ts.map