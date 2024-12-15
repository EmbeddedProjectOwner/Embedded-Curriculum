import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { BaseLinkItem } from '../../layouts/links';
import { SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarItem, } from '../../layouts/docs/sidebar';
import { cn } from '../../utils/cn';
import { buttonVariants } from '../../components/ui/button';
import { getSidebarTabs } from '../../utils/get-sidebar-tabs';
export function SidebarLinkItem({ item }) {
    if (item.type === 'menu')
        return (_jsxs(SidebarFolder, { children: [item.url ? (_jsxs(SidebarFolderLink, { href: item.url, children: [item.icon, item.text] })) : (_jsxs(SidebarFolderTrigger, { children: [item.icon, item.text] })), _jsx(SidebarFolderContent, { children: item.items.map((child, i) => (_jsx(SidebarLinkItem, { item: child }, i))) })] }));
    if (item.type === 'button') {
        return (_jsxs(BaseLinkItem, { item: item, className: cn(buttonVariants({
                color: 'secondary',
                className: 'gap-1.5 [&_svg]:size-4',
            })), children: [item.icon, item.text] }));
    }
    if (item.type === 'custom')
        return item.children;
    return (_jsx(SidebarItem, { href: item.url, icon: item.icon, external: item.external, children: item.text }));
}
export function getSidebarTabsFromOptions(options, tree) {
    if (Array.isArray(options)) {
        return options;
    }
    else if (typeof options === 'object') {
        return getSidebarTabs(tree, options);
    }
    else if (options !== false) {
        return getSidebarTabs(tree);
    }
}
