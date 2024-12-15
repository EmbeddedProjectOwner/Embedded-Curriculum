import { type LinkItemType } from '../../layouts/links';
import { type SidebarProps } from '../../layouts/docs/sidebar';
import type { PageTree } from 'fumadocs-core/server';
import { type TabOptions } from '../../utils/get-sidebar-tabs';
import type { FC, ReactNode } from 'react';
import type { Option } from '../../components/layout/root-toggle';
export interface SidebarOptions extends SidebarProps {
    enabled: boolean;
    component: ReactNode;
    collapsible?: boolean;
    components?: Partial<SidebarComponents>;
    /**
     * Root Toggle options
     */
    tabs?: Option[] | TabOptions | false;
    banner?: ReactNode;
    footer?: ReactNode;
    /**
     * Hide search trigger
     *
     * @defaultValue false
     */
    hideSearch?: boolean;
}
export interface SidebarComponents {
    Item: FC<{
        item: PageTree.Item;
    }>;
    Folder: FC<{
        item: PageTree.Folder;
        level: number;
    }>;
    Separator: FC<{
        item: PageTree.Separator;
    }>;
}
export declare function SidebarLinkItem({ item }: {
    item: LinkItemType;
}): string | number | bigint | boolean | Iterable<ReactNode> | Promise<import("react").AwaitedReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
export declare function getSidebarTabsFromOptions(options: SidebarOptions['tabs'], tree: PageTree.Root): Option[] | undefined;
//# sourceMappingURL=shared.d.ts.map