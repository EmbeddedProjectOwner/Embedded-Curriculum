'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import Link from 'fumadocs-core/link';
import { cn } from '../../utils/cn';
import { BaseLinkItem } from '../../layouts/links';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuViewport, } from '../../components/ui/navigation-menu';
import { useNav } from '../../components/layout/nav';
import { buttonVariants } from '../../components/ui/button';
const navItemVariants = cva('inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4');
export function Navbar(props) {
    const [value, setValue] = useState('');
    const { isTransparent } = useNav();
    return (_jsx(NavigationMenu, { value: value, onValueChange: setValue, asChild: true, children: _jsxs("header", { id: "nd-nav", ...props, className: cn('fixed left-1/2 top-[var(--fd-banner-height)] z-40 w-full max-w-fd-container -translate-x-1/2 border-b border-fd-foreground/10 transition-colors lg:mt-2 lg:w-[calc(100%-1rem)] lg:rounded-2xl lg:border', value.length > 0 ? 'shadow-lg' : 'shadow-sm', (!isTransparent || value.length > 0) &&
                'bg-fd-background/80 backdrop-blur-lg', props.className), children: [_jsx("nav", { className: "flex h-14 w-full flex-row items-center gap-6 px-4 lg:h-12", children: props.children }), _jsx(NavigationMenuViewport, {})] }) }));
}
export const NavbarMenu = NavigationMenuItem;
export function NavbarMenuContent(props) {
    return (_jsx(NavigationMenuContent, { ...props, className: cn('grid grid-cols-1 gap-3 px-4 pb-4 md:grid-cols-2 lg:grid-cols-3', props.className), children: props.children }));
}
export function NavbarMenuTrigger(props) {
    return (_jsx(NavigationMenuTrigger, { ...props, className: cn(navItemVariants(), 'rounded-md', props.className), children: props.children }));
}
const linkVariants = cva(undefined, {
    variants: {
        variant: {
            main: navItemVariants(),
            button: buttonVariants({
                color: 'secondary',
                className: 'gap-1.5 [&_svg]:size-4',
            }),
            icon: buttonVariants({
                color: 'ghost',
                size: 'icon',
            }),
        },
    },
    defaultVariants: {
        variant: 'main',
    },
});
export function NavbarLink({ item, variant, ...props }) {
    return (_jsx(NavigationMenuItem, { className: "list-none", children: _jsx(NavigationMenuLink, { asChild: true, children: _jsx(BaseLinkItem, { ...props, item: item, className: cn(linkVariants({ variant }), props.className), children: props.children }) }) }));
}
export function NavbarMenuItem(props) {
    return (_jsx(NavigationMenuLink, { asChild: true, children: _jsx(Link, { ...props, className: cn('flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground', props.className) }) }));
}
