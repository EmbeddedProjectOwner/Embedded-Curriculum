import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Languages, MoreHorizontal } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cn } from '../utils/cn';
import { buttonVariants } from '../components/ui/button';
import { CollapsibleSidebar, Sidebar, SidebarFooter, SidebarHeader, SidebarCollapseTrigger, SidebarViewport, SidebarPageTree, } from '../layouts/docs/sidebar';
import { replaceOrDefault } from '../layouts/shared';
import { BaseLinkItem, } from '../layouts/links';
import { getSidebarTabs } from '../utils/get-sidebar-tabs';
import { RootToggle } from '../components/layout/root-toggle';
import { getLinks } from './shared';
import { LanguageToggle, LanguageToggleText, } from '../components/layout/language-toggle';
import { LinksMenu } from '../layouts/docs.client';
import { TreeContextProvider } from '../contexts/tree';
import { NavProvider, Title } from '../components/layout/nav';
import { ThemeToggle } from '../components/layout/theme-toggle';
import { Navbar, NavbarSidebarTrigger } from '../layouts/docs/navbar';
import { LargeSearchToggle, SearchToggle, } from '../components/layout/search-toggle';
import { SearchOnly } from '../contexts/search';
import { getSidebarTabsFromOptions, SidebarLinkItem, } from '../layouts/docs/shared';
export function DocsLayout({ nav: { enabled: navEnabled = true, component: navReplace, transparentMode, ...nav } = {}, sidebar: { enabled: sidebarEnabled = true, collapsible = true, component: sidebarReplace, tabs: tabOptions, banner: sidebarBanner, footer: sidebarFooter, components: sidebarComponents, ...sidebar } = {}, i18n = false, ...props }) {
    const links = getLinks(props.links ?? [], props.githubUrl);
    const Aside = collapsible ? CollapsibleSidebar : Sidebar;
    if (props.tree === undefined)
        notFound();
    const tabs = getSidebarTabsFromOptions(tabOptions, props.tree) ?? [];
    return (_jsx(TreeContextProvider, { tree: props.tree, children: _jsxs(NavProvider, { transparentMode: transparentMode, children: [replaceOrDefault({ enabled: navEnabled, component: navReplace }, _jsxs(Navbar, { id: "nd-subnav", className: "h-14 md:hidden", children: [_jsx(Title, { url: nav.url, title: nav.title }), _jsx("div", { className: "flex flex-1 flex-row items-center gap-1", children: nav.children }), _jsx(SearchOnly, { children: _jsx(SearchToggle, {}) }), _jsx(NavbarSidebarTrigger, { className: "-me-2 md:hidden" })] }), nav), _jsxs("main", { id: "nd-docs-layout", ...props.containerProps, className: cn('flex flex-1 flex-row md:[--fd-sidebar-width:260px] xl:[--fd-toc-width:260px] [&_#nd-toc]:max-xl:hidden [&_#nd-tocnav]:xl:hidden max-xl:[&_article]:mx-0', !navReplace && navEnabled
                        ? '[--fd-nav-height:3.5rem] md:[--fd-nav-height:0px]'
                        : null, props.containerProps?.className), children: [collapsible ? (_jsx(SidebarCollapseTrigger, { className: "fixed bottom-3 start-2 z-40 transition-opacity data-[collapsed=false]:pointer-events-none data-[collapsed=false]:opacity-0 max-md:hidden" })) : null, replaceOrDefault({ enabled: sidebarEnabled, component: sidebarReplace }, _jsxs(Aside, { ...sidebar, children: [_jsxs(SidebarHeader, { children: [_jsx(SidebarHeaderItems, { ...nav, links: links }), sidebarBanner, tabs.length > 0 ? (_jsx(RootToggle, { options: tabs, className: "-mx-2" })) : null, _jsx(SearchOnly, { children: _jsx(LargeSearchToggle, { className: "rounded-lg max-md:hidden" }) })] }), _jsxs(SidebarViewport, { children: [_jsx("div", { className: "px-2 pt-4 empty:hidden md:hidden", children: links
                                                .filter((v) => v.type !== 'icon')
                                                .map((item, i) => (_jsx(SidebarLinkItem, { item: item }, i))) }), _jsx("div", { className: "px-2 py-4 md:px-3", children: _jsx(SidebarPageTree, { components: sidebarComponents }) })] }), _jsxs(SidebarFooter, { children: [_jsx(SidebarFooterItems, { sidebarCollapsible: collapsible, i18n: i18n, disableThemeSwitch: props.disableThemeSwitch ?? false, iconItems: links.filter((v) => v.type === 'icon') }), sidebarFooter] })] }), {
                            ...sidebar,
                            tabs,
                        }), props.children] })] }) }));
}
function SidebarHeaderItems({ links, ...props }) {
    const isEmpty = !props.title && !props.children && links.length === 0;
    if (isEmpty)
        return null;
    return (_jsxs("div", { className: "flex flex-row items-center max-md:hidden", children: [props.title ? (_jsx(Link, { href: props.url ?? '/', className: "inline-flex items-center gap-2.5 py-1 font-medium", children: props.title })) : null, props.children, links.length > 0 ? (_jsx(LinksMenu, { items: links, className: cn(buttonVariants({
                    size: 'icon',
                    color: 'ghost',
                }), 'ms-auto'), children: _jsx(MoreHorizontal, {}) })) : null] }));
}
function SidebarFooterItems({ iconItems, i18n, sidebarCollapsible, disableThemeSwitch, }) {
    // empty footer items
    if (iconItems.length === 0 &&
        !i18n &&
        disableThemeSwitch &&
        !sidebarCollapsible)
        return null;
    return (_jsxs("div", { className: "flex flex-row items-center", children: [iconItems.map((item, i) => (_jsx(BaseLinkItem, { item: item, className: cn(buttonVariants({ size: 'icon', color: 'ghost' }), 'text-fd-muted-foreground md:hidden'), "aria-label": item.label, children: item.icon }, i))), _jsx("div", { role: "separator", className: "flex-1" }), i18n ? (_jsxs(LanguageToggle, { className: "me-1.5", children: [_jsx(Languages, { className: "size-5" }), _jsx(LanguageToggleText, { className: "md:hidden" })] })) : null, !disableThemeSwitch ? (_jsx(ThemeToggle, { className: "p-0 md:order-first" })) : null, sidebarCollapsible ? (_jsx(SidebarCollapseTrigger, { className: "-me-1.5 max-md:hidden" })) : null] }));
}
export { getSidebarTabs };
