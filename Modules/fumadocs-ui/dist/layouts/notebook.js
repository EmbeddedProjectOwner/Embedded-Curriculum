import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { getLinks, } from '../layouts/shared';
import { CollapsibleSidebar, Sidebar, SidebarCollapseTrigger, SidebarFooter, SidebarHeader, SidebarViewport, SidebarPageTree, } from '../layouts/docs/sidebar';
import { notFound } from 'next/navigation';
import { RootToggle } from '../components/layout/root-toggle';
import { TreeContextProvider } from '../contexts/tree';
import { NavProvider, Title } from '../components/layout/nav';
import { Navbar, NavbarSidebarTrigger } from '../layouts/docs/navbar';
import { SearchOnly } from '../contexts/search';
import { LargeSearchToggle, SearchToggle, } from '../components/layout/search-toggle';
import { cn } from '../utils/cn';
import Link from 'next/link';
import { buttonVariants } from '../components/ui/button';
import { ChevronDown, Languages } from 'lucide-react';
import { BaseLinkItem } from '../layouts/links';
import { LanguageToggle } from '../components/layout/language-toggle';
import { ThemeToggle } from '../components/layout/theme-toggle';
import { Popover, PopoverContent, PopoverTrigger, } from '../components/ui/popover';
import { getSidebarTabsFromOptions, SidebarLinkItem, } from '../layouts/docs/shared';
import { LayoutBody } from './notebook.client';
export function DocsLayout({ nav: { transparentMode, ...nav } = {}, sidebar: { collapsible: sidebarCollapsible = true, tabs: tabOptions, banner: sidebarBanner, footer: sidebarFooter, components: sidebarComponents, ...sidebar } = {}, i18n = false, ...props }) {
    const links = getLinks(props.links ?? [], props.githubUrl);
    const Aside = sidebarCollapsible ? CollapsibleSidebar : Sidebar;
    if (props.tree === undefined)
        notFound();
    const tabs = getSidebarTabsFromOptions(tabOptions, props.tree) ?? [];
    return (_jsx(TreeContextProvider, { tree: props.tree, children: _jsx(NavProvider, { transparentMode: transparentMode, children: _jsxs(LayoutBody, { ...props.containerProps, className: cn('[--fd-nav-height:3.5rem] md:[--fd-sidebar-width:260px] lg:[--fd-toc-width:260px] [&_#nd-toc]:max-lg:hidden [&_#nd-tocnav]:lg:hidden', props.containerProps?.className), children: [_jsxs(Aside, { ...sidebar, className: cn('md:[--fd-nav-height:0px]', sidebar.className), children: [_jsxs(SidebarHeader, { children: [_jsxs(SidebarHeaderItems, { nav: nav, links: links, children: [nav.children, sidebarCollapsible ? (_jsx(SidebarCollapseTrigger, { className: "ms-auto text-fd-muted-foreground" })) : null] }), sidebarBanner, tabs.length > 0 ? (_jsx(RootToggle, { options: tabs, className: "md:-mx-2" })) : null] }), _jsxs(SidebarViewport, { children: [_jsx("div", { className: "px-4 pt-4 empty:hidden md:px-3 lg:hidden", children: links.map((item, i) => (_jsx(SidebarLinkItem, { item: item }, i))) }), _jsx("div", { className: "p-4 md:px-3", children: _jsx(SidebarPageTree, { components: sidebarComponents }) })] }), _jsx(SidebarFooter, { children: sidebarFooter })] }), _jsxs("div", { className: "w-full min-w-0 max-w-[var(--fd-content-width)] [--fd-nav-height:3.5rem]", children: [_jsx(DocsNavbar, { nav: nav, links: links, i18n: i18n, sidebarCollapsible: sidebarCollapsible }), _jsx("div", { className: "flex flex-row", children: props.children })] }), _jsx("div", { className: "min-w-[var(--fd-sidebar-width)] flex-1", style: {
                            marginInlineStart: 'calc(var(--fd-sidebar-width) * -1)',
                        } })] }) }) }));
}
function DocsNavbar({ sidebarCollapsible, links, nav = {}, i18n, }) {
    return (_jsxs(Navbar, { id: "nd-subnav", className: "h-14 md:gap-1.5", children: [sidebarCollapsible ? (_jsx(SidebarCollapseTrigger, { className: "-ms-1.5 text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden" })) : null, _jsx(SearchOnly, { children: _jsx(LargeSearchToggle, { className: "w-full max-w-[240px] rounded-lg max-md:hidden" }) }), _jsx(Title, { url: nav.url, title: nav.title, className: "md:hidden" }), _jsxs("div", { className: "flex flex-1 flex-row items-center gap-6 px-2", children: [links
                        .filter((item) => item.type !== 'icon')
                        .map((item, i) => (_jsx(NavbarLinkItem, { item: item, className: "text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground max-lg:hidden" }, i))), nav.children] }), _jsx(SearchOnly, { children: _jsx(SearchToggle, { className: "md:hidden" }) }), _jsx(NavbarSidebarTrigger, { className: "-me-1.5 md:hidden" }), _jsx("div", { className: "flex flex-row items-center empty:hidden max-lg:hidden", children: links
                    .filter((item) => item.type === 'icon')
                    .map((item, i) => (_jsx(BaseLinkItem, { item: item, className: cn(buttonVariants({ size: 'icon', color: 'ghost' }), 'text-fd-muted-foreground'), "aria-label": item.label, children: item.icon }, i))) }), i18n ? (_jsx(LanguageToggle, { children: _jsx(Languages, { className: "size-5" }) })) : null, _jsx(ThemeToggle, { className: "p-0 max-md:hidden" })] }));
}
function NavbarLinkItem({ item, ...props }) {
    if (item.type === 'menu') {
        return (_jsxs(Popover, { children: [_jsxs(PopoverTrigger, { ...props, className: cn('inline-flex items-center gap-1.5', props.className), children: [item.text, _jsx(ChevronDown, { className: "size-3" })] }), _jsx(PopoverContent, { className: "flex flex-col", children: item.items.map((child, i) => {
                        if (child.type === 'custom')
                            return _jsx(Fragment, { children: child.children }, i);
                        return (_jsxs(BaseLinkItem, { item: child, className: "inline-flex items-center gap-2 rounded-md p-2 text-start hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4", children: [child.icon, child.text] }, i));
                    }) })] }));
    }
    if (item.type === 'custom')
        return item.children;
    return (_jsx(BaseLinkItem, { item: item, ...props, children: item.text }));
}
function SidebarHeaderItems({ links, nav = {}, children, }) {
    const isEmpty = !nav.title && !nav.children && links.length === 0;
    if (isEmpty)
        return null;
    return (_jsxs("div", { className: "flex flex-row items-center max-md:hidden", children: [nav.title ? (_jsx(Link, { href: nav.url ?? '/', className: "inline-flex items-center gap-2.5 py-1 font-medium", children: nav.title })) : null, children] }));
}
