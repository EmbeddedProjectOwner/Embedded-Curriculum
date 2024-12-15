import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { replaceOrDefault } from '../layouts/shared';
import { cn } from '../utils/cn';
import { getLinks } from './shared';
import { NavProvider, Title } from '../components/layout/nav';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, } from '../components/ui/navigation-menu';
import { Navbar, NavbarLink, NavbarMenu, NavbarMenuContent, NavbarMenuItem, NavbarMenuTrigger, } from '../layouts/home/navbar';
import { LargeSearchToggle, SearchToggle, } from '../components/layout/search-toggle';
import { ThemeToggle } from '../components/layout/theme-toggle';
import { LanguageToggle, LanguageToggleText, } from '../components/layout/language-toggle';
import { ChevronDown, Languages } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';
import { SearchOnly } from '../contexts/search';
import Link from 'fumadocs-core/link';
import { MenuLinkItem } from '../layouts/home/menu';
export function HomeLayout({ nav: { transparentMode, enableSearch = true, ...nav } = {}, links = [], githubUrl, i18n = false, disableThemeSwitch, ...props }) {
    const finalLinks = getLinks(links, githubUrl);
    const navItems = finalLinks.filter((item) => ['nav', 'all'].includes(item.on ?? 'all'));
    const menuItems = finalLinks.filter((item) => ['menu', 'all'].includes(item.on ?? 'all'));
    return (_jsx(NavProvider, { transparentMode: transparentMode, children: _jsxs("main", { id: "nd-home-layout", ...props, className: cn('flex flex-1 flex-col pt-[var(--fd-nav-height)] [--fd-nav-height:56px]', props.className), children: [replaceOrDefault(nav, _jsxs(_Fragment, { children: [_jsx("div", { "aria-hidden": "true", className: "fixed inset-x-0 top-[var(--fd-banner-height)] z-40 h-6 bg-fd-background", style: {
                                maskImage: 'linear-gradient(to bottom,white,transparent)',
                            } }), _jsxs(Navbar, { children: [_jsx(Title, { title: nav.title, url: nav.url }), nav.children, _jsx(NavigationMenuList, { className: "flex flex-row items-center gap-2 max-sm:hidden", children: navItems
                                        .filter((item) => !isSecondary(item))
                                        .map((item, i) => (_jsx(NavbarLinkItem, { item: item, className: "text-sm" }, i))) }), _jsxs("div", { className: "flex flex-1 flex-row items-center justify-end lg:gap-1.5", children: [enableSearch ? (_jsxs(SearchOnly, { children: [_jsx(SearchToggle, { className: "lg:hidden" }), _jsx(LargeSearchToggle, { className: "w-full max-w-[240px] max-lg:hidden" })] })) : null, !disableThemeSwitch ? (_jsx(ThemeToggle, { className: "max-lg:hidden" })) : null, i18n ? (_jsx(LanguageToggle, { className: "-me-1.5 max-lg:hidden", children: _jsx(Languages, { className: "size-5" }) })) : null, navItems.filter(isSecondary).map((item, i) => (_jsx(NavbarLinkItem, { item: item, className: "-me-1.5 list-none max-lg:hidden" }, i))), _jsxs(NavigationMenuItem, { className: "list-none lg:hidden", children: [_jsx(NavigationMenuTrigger, { className: cn(buttonVariants({
                                                        size: 'icon',
                                                        color: 'ghost',
                                                    }), 'group -me-2'), children: _jsx(ChevronDown, { className: "size-3 transition-transform duration-300 group-data-[state=open]:rotate-180" }) }), _jsxs(NavigationMenuContent, { className: "flex flex-col p-4 sm:flex-row sm:items-center sm:justify-end", children: [menuItems
                                                            .filter((item) => !isSecondary(item))
                                                            .map((item, i) => (_jsx(MenuLinkItem, { item: item, className: "sm:hidden" }, i))), _jsxs("div", { className: "-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2", children: [menuItems.filter(isSecondary).map((item, i) => (_jsx(MenuLinkItem, { item: item, className: "-me-1.5" }, i))), _jsx("div", { role: "separator", className: "flex-1" }), i18n ? (_jsxs(LanguageToggle, { children: [_jsx(Languages, { className: "size-5" }), _jsx(LanguageToggleText, {}), _jsx(ChevronDown, { className: "size-3 text-fd-muted-foreground" })] })) : null, !disableThemeSwitch ? _jsx(ThemeToggle, {}) : null] })] })] })] })] })] }), {
                    items: finalLinks,
                    i18n,
                    enableSearch,
                    disableThemeSwitch,
                    ...nav,
                }), props.children] }) }));
}
function NavbarLinkItem({ item, ...props }) {
    if (item.type === 'custom')
        return _jsx("div", { ...props, children: item.children });
    if (item.type === 'menu') {
        return (_jsxs(NavbarMenu, { children: [_jsx(NavbarMenuTrigger, { ...props, children: item.url ? _jsx(Link, { href: item.url, children: item.text }) : item.text }), _jsx(NavbarMenuContent, { children: item.items.map((child, j) => {
                        if (child.type === 'custom')
                            return _jsx("div", { children: child.children }, j);
                        const { banner, footer, ...rest } = child.menu ?? {};
                        return (_jsxs(NavbarMenuItem, { href: child.url, ...rest, children: [banner ??
                                    (child.icon ? (_jsx("div", { className: "w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4", children: child.icon })) : null), _jsx("p", { className: "-mb-1 text-sm font-medium", children: child.text }), child.description ? (_jsx("p", { className: "text-[13px] text-fd-muted-foreground", children: child.description })) : null, footer] }, j));
                    }) })] }));
    }
    return (_jsx(NavbarLink, { ...props, item: item, variant: item.type, "aria-label": item.type === 'icon' ? item.label : undefined, children: item.type === 'icon' ? item.icon : item.text }));
}
function isSecondary(item) {
    return (('secondary' in item && item.secondary === true) || item.type === 'icon');
}
