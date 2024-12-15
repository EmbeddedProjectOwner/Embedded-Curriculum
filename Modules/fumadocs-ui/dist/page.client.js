'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useState, } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { cn } from './utils/cn';
import { useI18n } from './contexts/i18n';
import { useTreeContext, useTreePath } from './contexts/tree';
import { useSidebar } from './contexts/sidebar';
import { usePathname } from 'next/navigation';
import { useNav } from './components/layout/nav';
import { getBreadcrumbItemsFromPath, } from 'fumadocs-core/breadcrumb';
export function PageContainer(props) {
    const { collapsed } = useSidebar();
    return (_jsx("div", { ...props, className: cn('flex w-full min-w-0 max-w-[var(--fd-page-width)] flex-col md:transition-[max-width]', props.className), style: {
            ...props.style,
            '--fd-page-width': collapsed
                ? '100vw'
                : 'calc(min(100vw, var(--fd-layout-width)) - var(--fd-sidebar-width) - var(--fd-toc-width))',
        }, children: props.children }));
}
export function PageHeader(props) {
    const { open } = useSidebar();
    const { isTransparent } = useNav();
    return (_jsx("header", { ...props, className: cn('sticky top-fd-layout-top z-10 flex flex-row items-center border-b border-fd-foreground/10 text-sm transition-colors', !isTransparent && 'bg-fd-background/80 backdrop-blur-md', open && 'opacity-0', props.className), style: {
            ...props.style,
            '--fd-toc-top-with-offset': 'calc(4px + var(--fd-banner-height) + var(--fd-nav-height))',
        }, children: props.children }));
}
export function LastUpdate(props) {
    const { text } = useI18n();
    const [date, setDate] = useState('');
    useEffect(() => {
        // to the timezone of client
        setDate(props.date.toLocaleDateString());
    }, [props.date]);
    return (_jsxs("p", { className: "text-sm text-fd-muted-foreground", children: [text.lastUpdate, " ", date] }));
}
const itemVariants = cva('flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground');
const itemLabel = cva('inline-flex items-center gap-0.5 text-fd-muted-foreground');
function scanNavigationList(tree) {
    const list = [];
    tree.forEach((node) => {
        if (node.type === 'folder') {
            if (node.index) {
                list.push(node.index);
            }
            list.push(...scanNavigationList(node.children));
            return;
        }
        if (node.type === 'page' && !node.external) {
            list.push(node);
        }
    });
    return list;
}
const listCache = new WeakMap();
export function Footer({ items }) {
    const { root } = useTreeContext();
    const { text } = useI18n();
    const pathname = usePathname();
    const { previous, next } = useMemo(() => {
        if (items)
            return items;
        const cached = listCache.get(root);
        const list = cached ?? scanNavigationList(root.children);
        listCache.set(root, list);
        const idx = list.findIndex((item) => item.url === pathname);
        if (idx === -1)
            return {};
        return {
            previous: list[idx - 1],
            next: list[idx + 1],
        };
    }, [items, pathname, root]);
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4 pb-6", children: [previous ? (_jsxs(Link, { href: previous.url, className: cn(itemVariants()), children: [_jsxs("div", { className: cn(itemLabel()), children: [_jsx(ChevronLeft, { className: "-ms-1 size-4 shrink-0 rtl:rotate-180" }), _jsx("p", { children: text.previousPage })] }), _jsx("p", { className: "font-medium", children: previous.name })] })) : null, next ? (_jsxs(Link, { href: next.url, className: cn(itemVariants({ className: 'col-start-2 text-end' })), children: [_jsxs("div", { className: cn(itemLabel({ className: 'flex-row-reverse' })), children: [_jsx(ChevronRight, { className: "-me-1 size-4 shrink-0 rtl:rotate-180" }), _jsx("p", { children: text.nextPage })] }), _jsx("p", { className: "font-medium", children: next.name })] })) : null] }));
}
export function Breadcrumb(options) {
    const path = useTreePath();
    const { root } = useTreeContext();
    const items = useMemo(() => {
        return getBreadcrumbItemsFromPath(root, path, {
            includePage: options.includePage ?? false,
            ...options,
        });
    }, [options, path, root]);
    if (items.length === 0)
        return null;
    return (_jsx("div", { className: "-mb-3 flex flex-row items-center gap-1 text-sm font-medium text-fd-muted-foreground", children: items.map((item, i) => (_jsxs(Fragment, { children: [i !== 0 && (_jsx(ChevronRight, { className: "size-4 shrink-0 rtl:rotate-180" })), item.url ? (_jsx(Link, { href: item.url, className: "truncate hover:text-fd-accent-foreground", children: item.name })) : (_jsx("span", { className: "truncate", children: item.name }))] }, i))) }));
}
