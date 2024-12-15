'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import { createContext, useContext, useMemo, useRef, } from 'react';
import { searchPath } from 'fumadocs-core/breadcrumb';
const TreeContext = createContext(undefined);
const PathContext = createContext([]);
export function TreeContextProvider({ children, tree, }) {
    const pathname = usePathname();
    const path = useMemo(() => searchPath(tree.children, pathname) ?? [], [pathname, tree]);
    const root = (path.findLast((item) => item.type === 'folder' && item.root) ??
        tree);
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;
    return (_jsx(TreeContext.Provider, { value: useMemo(() => ({ root }), [root]), children: _jsx(PathContext.Provider, { value: path, children: children }) }));
}
export function useTreePath() {
    return useContext(PathContext);
}
export function useTreeContext() {
    const ctx = useContext(TreeContext);
    if (!ctx)
        throw new Error('You must wrap this component under <DocsLayout />');
    return ctx;
}
