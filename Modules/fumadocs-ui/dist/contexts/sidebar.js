import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useMemo, useRef, } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider as BaseProvider } from 'fumadocs-core/sidebar';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
const SidebarContext = createContext(undefined);
export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx)
        throw new Error('Missing root provider');
    return ctx;
}
export function SidebarProvider({ children, }) {
    const closeOnRedirect = useRef(true);
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    useOnChange(pathname, () => {
        if (closeOnRedirect.current) {
            setOpen(false);
        }
        closeOnRedirect.current = true;
    });
    return (_jsx(SidebarContext.Provider, { value: useMemo(() => ({
            open,
            setOpen,
            collapsed,
            setCollapsed,
            closeOnRedirect,
        }), [open, collapsed]), children: _jsx(BaseProvider, { open: open, onOpenChange: setOpen, children: children }) }));
}
