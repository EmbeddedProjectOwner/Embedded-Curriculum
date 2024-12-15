'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from 'react';
const SearchContext = createContext({
    enabled: false,
    hotKey: [],
    setOpenSearch: () => undefined,
});
export function useSearchContext() {
    return useContext(SearchContext);
}
function MetaOrControl() {
    const [key, setKey] = useState('⌘');
    useEffect(() => {
        const isWindows = window.navigator.userAgent.includes('Windows');
        if (isWindows)
            setKey('Ctrl');
    }, []);
    return key;
}
export function SearchProvider({ SearchDialog, children, preload = true, options, hotKey = [
    {
        key: (e) => e.metaKey || e.ctrlKey,
        display: _jsx(MetaOrControl, {}),
    },
    {
        key: 'k',
        display: 'K',
    },
], links, }) {
    const [isOpen, setIsOpen] = useState(preload ? false : undefined);
    useEffect(() => {
        const handler = (e) => {
            if (hotKey.every((v) => typeof v.key === 'string' ? e.key === v.key : v.key(e))) {
                setIsOpen(true);
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [hotKey]);
    return (_jsxs(SearchContext.Provider, { value: useMemo(() => ({ enabled: true, hotKey, setOpenSearch: setIsOpen }), [hotKey]), children: [isOpen !== undefined && (_jsx(SearchDialog, { open: isOpen, onOpenChange: setIsOpen, links: links, ...options })), children] }));
}
/**
 * Show children only when search is enabled via React Context
 */
export function SearchOnly({ children }) {
    const search = useSearchContext();
    if (search.enabled)
        return children;
}
