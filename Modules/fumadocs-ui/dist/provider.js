'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import { DirectionProvider } from '@radix-ui/react-direction';
import { SidebarProvider } from './contexts/sidebar';
import { SearchProvider } from './contexts/search';
const DefaultSearchDialog = dynamic(() => import('./components/dialog/search-default'), { ssr: false });
export function RootProvider({ children, dir, theme: { enabled = true, ...theme } = {}, search, }) {
    let body = children;
    if (search?.enabled !== false)
        body = (_jsx(SearchProvider, { SearchDialog: DefaultSearchDialog, ...search, children: body }));
    if (enabled)
        body = (_jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, ...theme, children: body }));
    return (_jsx(DirectionProvider, { dir: dir ?? 'ltr', children: _jsx(SidebarProvider, { children: body }) }));
}
export { useI18n, I18nLabel } from './contexts/i18n';
export { SearchProvider, SearchOnly, useSearchContext, } from './contexts/search';
export { SidebarProvider, useSidebar } from './contexts/sidebar';
export { useTreePath, useTreeContext, TreeContextProvider, } from './contexts/tree';
