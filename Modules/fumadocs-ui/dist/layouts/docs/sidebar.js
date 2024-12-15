'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ExternalLink, SidebarIcon } from 'lucide-react';
import * as Base from 'fumadocs-core/sidebar';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useRef, useState, } from 'react';
import Link from 'fumadocs-core/link';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { cn } from '../../utils/cn';
import { ScrollArea, ScrollViewport } from '../../components/ui/scroll-area';
import { isActive } from '../../utils/is-active';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '../../components/ui/collapsible';
import { useSidebar } from '../../contexts/sidebar';
import { buttonVariants } from '../../components/ui/button';
import { cva } from 'class-variance-authority';
import { useTreeContext, useTreePath } from '../../contexts/tree';
const itemVariants = cva('flex flex-row items-center gap-2 rounded-md px-3 py-2 text-fd-muted-foreground transition-colors duration-100 [overflow-wrap:anywhere] md:px-2 md:py-1.5 [&_svg]:size-4', {
    variants: {
        active: {
            true: 'bg-fd-primary/10 font-medium text-fd-primary',
            false: 'hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
        },
    },
});
const Context = createContext(undefined);
const FolderContext = createContext(undefined);
export function CollapsibleSidebar(props) {
    const { collapsed } = useSidebar();
    const [hover, setHover] = useState(false);
    const timerRef = useRef(0);
    const closeTimeRef = useRef(0);
    useOnChange(collapsed, () => {
        setHover(false);
        closeTimeRef.current = Date.now() + 150;
    });
    const onEnter = useCallback((e) => {
        if (e.pointerType === 'touch' || closeTimeRef.current > Date.now())
            return;
        window.clearTimeout(timerRef.current);
        setHover(true);
    }, []);
    const onLeave = useCallback((e) => {
        if (e.pointerType === 'touch')
            return;
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setHover(false);
            closeTimeRef.current = Date.now() + 150;
        }, Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
            ? 0
            : 500);
    }, []);
    return (_jsx(Sidebar, { ...props, onPointerEnter: onEnter, onPointerLeave: onLeave, "data-collapsed": collapsed, className: cn('transition-[flex,margin,opacity,transform]', collapsed &&
            'md:-me-[var(--fd-sidebar-width)] md:flex-initial md:translate-x-[calc(var(--fd-sidebar-offset)*-1)] rtl:md:translate-x-[var(--fd-sidebar-offset)]', collapsed && hover && 'z-50 md:translate-x-0', collapsed && !hover && 'md:opacity-0', props.className), style: {
            '--fd-sidebar-offset': 'calc(var(--fd-sidebar-width) - 20px)',
        } }));
}
export function Sidebar({ defaultOpenLevel = 0, prefetch = true, inner, ...props }) {
    const context = useMemo(() => {
        return {
            defaultOpenLevel,
            prefetch,
        };
    }, [defaultOpenLevel, prefetch]);
    return (_jsx(Context.Provider, { value: context, children: _jsx(Base.SidebarList, { id: "nd-sidebar", blockScrollingWidth: 768, ...props, className: cn('fixed top-fd-layout-top z-30 bg-fd-card text-sm md:sticky md:h-[var(--fd-sidebar-height)] md:flex-1', 'max-md:inset-x-0 max-md:bottom-0 max-md:bg-fd-background/80 max-md:text-[15px] max-md:backdrop-blur-lg max-md:data-[open=false]:invisible', props.className), style: {
                ...props.style,
                '--fd-sidebar-height': 'calc(100dvh - var(--fd-banner-height) - var(--fd-nav-height))',
            }, children: _jsx("div", { ...inner, className: cn('flex size-full max-w-full flex-col pt-2 md:ms-auto md:w-[var(--fd-sidebar-width)] md:border-e md:pt-4', inner?.className), children: props.children }) }) }));
}
export function SidebarHeader(props) {
    return (_jsx("div", { ...props, className: cn('flex flex-col gap-2 px-4 empty:hidden md:px-3', props.className), children: props.children }));
}
export function SidebarFooter(props) {
    return (_jsx("div", { ...props, className: cn('flex flex-col border-t px-4 py-3 empty:hidden', props.className), children: props.children }));
}
export function SidebarViewport(props) {
    return (_jsx(ScrollArea, { ...props, className: cn('h-full', props.className), children: _jsx(ScrollViewport, { style: {
                maskImage: 'linear-gradient(to bottom, transparent 2px, white 16px)',
            }, children: props.children }) }));
}
export function SidebarSeparator(props) {
    return (_jsx("p", { ...props, className: cn('mb-2 mt-8 px-3 text-sm font-medium first:mt-0 md:px-2', props.className), children: props.children }));
}
export function SidebarItem({ icon, ...props }) {
    const pathname = usePathname();
    const active = props.href !== undefined && isActive(props.href, pathname, false);
    const { prefetch } = useInternalContext();
    return (_jsxs(Link, { ...props, "data-active": active, className: cn(itemVariants({ active })), prefetch: prefetch, children: [icon ?? (props.external ? _jsx(ExternalLink, {}) : null), props.children] }));
}
export function SidebarFolder({ defaultOpen = false, ...props }) {
    const [open, setOpen] = useState(defaultOpen);
    useOnChange(defaultOpen, (v) => {
        if (v)
            setOpen(v);
    });
    return (_jsx(Collapsible, { open: open, onOpenChange: setOpen, children: _jsx(FolderContext.Provider, { value: useMemo(() => ({ open, setOpen }), [open]), children: props.children }) }));
}
export function SidebarFolderTrigger(props) {
    const { open } = useFolderContext();
    return (_jsxs(CollapsibleTrigger, { ...props, className: cn(itemVariants({ active: false }), 'w-full pe-3.5 md:pe-1.5'), children: [props.children, _jsx(ChevronDown, { "data-icon": true, className: cn('ms-auto transition-transform', !open && '-rotate-90') })] }));
}
export function SidebarFolderLink(props) {
    const { open, setOpen } = useFolderContext();
    const { prefetch } = useInternalContext();
    const pathname = usePathname();
    const active = props.href !== undefined && isActive(props.href, pathname, false);
    return (_jsxs(Link, { ...props, "data-active": active, className: cn(itemVariants({ active }), 'w-full pe-3.5 md:pe-1.5', props.className), onClick: (e) => {
            setOpen((prev) => !active || !prev);
            if (e.target.hasAttribute('data-icon')) {
                e.preventDefault();
            }
        }, prefetch: prefetch, children: [props.children, _jsx(ChevronDown, { "data-icon": true, className: cn('ms-auto transition-transform', !open && '-rotate-90') })] }));
}
export function SidebarFolderContent(props) {
    return (_jsx(CollapsibleContent, { ...props, children: _jsx("div", { className: "ms-3 border-s py-1.5 ps-1.5 md:ms-2 md:ps-2", children: props.children }) }));
}
export function SidebarCollapseTrigger(props) {
    const { collapsed, setCollapsed } = useSidebar();
    return (_jsx("button", { type: "button", "aria-label": "Collapse Sidebar", "data-collapsed": collapsed, ...props, className: cn(buttonVariants({
            color: 'ghost',
            size: 'icon',
        }), props.className), onClick: () => {
            setCollapsed((prev) => !prev);
        }, children: props.children ?? _jsx(SidebarIcon, {}) }));
}
function useFolderContext() {
    const ctx = useContext(FolderContext);
    if (!ctx)
        throw new Error('Missing sidebar folder');
    return ctx;
}
function useInternalContext() {
    const ctx = useContext(Context);
    if (!ctx)
        throw new Error('<Sidebar /> component required.');
    return ctx;
}
/**
 * Render sidebar items from page tree
 */
export function SidebarPageTree(props) {
    const { root } = useTreeContext();
    return useMemo(() => {
        const { Separator, Item, Folder } = props.components ?? {};
        function renderSidebarList(items, level) {
            return items.map((item, i) => {
                const id = `${item.type}_${i.toString()}`;
                switch (item.type) {
                    case 'separator':
                        if (Separator)
                            return _jsx(Separator, { item: item }, id);
                        return _jsx(SidebarSeparator, { children: item.name }, id);
                    case 'folder':
                        if (Folder)
                            return _jsx(Folder, { item: item, level: level }, id);
                        return (_jsx(PageTreeFolder, { item: item, level: level, children: renderSidebarList(item.children, level + 1) }, id));
                    default:
                        if (Item)
                            return _jsx(Item, { item: item }, item.url);
                        return (_jsx(SidebarItem, { href: item.url, external: item.external, icon: item.icon, children: item.name }, item.url));
                }
            });
        }
        return renderSidebarList(root.children, 1);
    }, [root, props.components]);
}
function PageTreeFolder({ item, children, level, }) {
    const { defaultOpenLevel } = useInternalContext();
    const path = useTreePath();
    return (_jsxs(SidebarFolder, { defaultOpen: (item.defaultOpen ?? defaultOpenLevel >= level) || path.includes(item), children: [item.index ? (_jsxs(SidebarFolderLink, { href: item.index.url, external: item.index.external, children: [item.icon, item.name] })) : (_jsxs(SidebarFolderTrigger, { children: [item.icon, item.name] })), _jsx(SidebarFolderContent, { children: children })] }));
}
