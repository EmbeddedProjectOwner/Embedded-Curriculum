import type { PageTree } from 'fumadocs-core/server';
import { type ReactNode, type HTMLAttributes } from 'react';
import { type LinkItemType } from '../layouts/links';
import { getSidebarTabs, type TabOptions } from '../utils/get-sidebar-tabs';
import { type BaseLayoutProps } from './shared';
import { type SidebarOptions } from '../layouts/docs/shared';
export interface DocsLayoutProps extends BaseLayoutProps {
    tree: PageTree.Root;
    sidebar?: Partial<SidebarOptions>;
    containerProps?: HTMLAttributes<HTMLDivElement>;
}
export declare function DocsLayout({ nav: { enabled: navEnabled, component: navReplace, transparentMode, ...nav }, sidebar: { enabled: sidebarEnabled, collapsible, component: sidebarReplace, tabs: tabOptions, banner: sidebarBanner, footer: sidebarFooter, components: sidebarComponents, ...sidebar }, i18n, ...props }: DocsLayoutProps): ReactNode;
export { getSidebarTabs, type TabOptions, type LinkItemType };
//# sourceMappingURL=docs.d.ts.map