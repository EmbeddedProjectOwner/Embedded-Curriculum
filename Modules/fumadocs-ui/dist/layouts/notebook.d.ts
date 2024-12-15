import { type HTMLAttributes, type ReactNode } from 'react';
import { type BaseLayoutProps } from '../layouts/shared';
import { type SidebarOptions } from '../layouts/docs/shared';
import type { PageTree } from 'fumadocs-core/server';
export interface DocsLayoutProps extends BaseLayoutProps {
    tree: PageTree.Root;
    sidebar?: Omit<Partial<SidebarOptions>, 'component' | 'enabled'>;
    containerProps?: HTMLAttributes<HTMLDivElement>;
}
export declare function DocsLayout({ nav: { transparentMode, ...nav }, sidebar: { collapsible: sidebarCollapsible, tabs: tabOptions, banner: sidebarBanner, footer: sidebarFooter, components: sidebarComponents, ...sidebar }, i18n, ...props }: DocsLayoutProps): ReactNode;
//# sourceMappingURL=notebook.d.ts.map