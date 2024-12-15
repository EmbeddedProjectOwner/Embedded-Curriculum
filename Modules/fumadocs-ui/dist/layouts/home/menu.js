'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BaseLinkItem } from '../../layouts/links';
import { cn } from '../../utils/cn';
import { NavigationMenuLink } from '../../components/ui/navigation-menu';
import Link from 'fumadocs-core/link';
import { cva } from 'class-variance-authority';
import { buttonVariants } from '../../components/ui/button';
const menuItemVariants = cva('', {
    variants: {
        variant: {
            main: 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4',
            icon: buttonVariants({
                size: 'icon',
                color: 'ghost',
            }),
            button: buttonVariants({
                color: 'secondary',
                className: 'gap-1.5 [&_svg]:size-4',
            }),
        },
    },
    defaultVariants: {
        variant: 'main',
    },
});
export function MenuLinkItem({ item, ...props }) {
    if (item.type === 'custom')
        return _jsx("div", { className: cn('grid', props.className), children: item.children });
    if (item.type === 'menu')
        return (_jsxs("div", { className: cn('mb-4 flex flex-col', props.className), children: [_jsx("p", { className: "mb-1 text-sm text-fd-muted-foreground", children: item.url ? (_jsx(NavigationMenuLink, { asChild: true, children: _jsxs(Link, { href: item.url, children: [item.icon, item.text] }) })) : (_jsxs(_Fragment, { children: [item.icon, item.text] })) }), item.items.map((child, i) => (_jsx(MenuLinkItem, { item: child }, i)))] }));
    return (_jsx(NavigationMenuLink, { asChild: true, children: _jsxs(BaseLinkItem, { item: item, className: cn(menuItemVariants({ variant: item.type }), props.className), "aria-label": item.type === 'icon' ? item.label : undefined, children: [item.icon, item.type === 'icon' ? undefined : item.text] }) }));
}
