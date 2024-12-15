'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useSidebar } from '../../contexts/sidebar';
import { useNav } from '../../components/layout/nav';
import { cn } from '../../utils/cn';
import { SidebarTrigger } from 'fumadocs-core/sidebar';
import { buttonVariants } from '../../components/ui/button';
import { Menu, X } from 'lucide-react';
export function Navbar(props) {
    const { open } = useSidebar();
    const { isTransparent } = useNav();
    return (_jsx("header", { ...props, className: cn('sticky top-[var(--fd-banner-height)] z-30 flex flex-row items-center border-b border-fd-foreground/10 px-4 transition-colors', (!isTransparent || open) && 'bg-fd-background/80 backdrop-blur-lg', props.className), children: props.children }));
}
export function NavbarSidebarTrigger(props) {
    const { open } = useSidebar();
    return (_jsx(SidebarTrigger, { ...props, className: cn(buttonVariants({
            color: 'ghost',
            size: 'icon',
        }), props.className), children: open ? _jsx(X, {}) : _jsx(Menu, {}) }));
}
