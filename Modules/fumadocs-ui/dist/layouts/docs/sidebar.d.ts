import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { type LinkProps } from 'fumadocs-core/link';
import { type ScrollAreaProps } from '@radix-ui/react-scroll-area';
import type { CollapsibleContentProps, CollapsibleTriggerProps } from '@radix-ui/react-collapsible';
import type { SidebarComponents } from '../../layouts/docs/shared';
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
    /**
     * Open folders by default if their level is lower or equal to a specific level
     * (Starting from 1)
     *
     * @defaultValue 0
     */
    defaultOpenLevel?: number;
    /**
     * Prefetch links
     *
     * @defaultValue true
     */
    prefetch?: boolean;
}
export declare function CollapsibleSidebar(props: SidebarProps): import("react/jsx-runtime").JSX.Element;
export declare function Sidebar({ defaultOpenLevel, prefetch, inner, ...props }: SidebarProps & {
    inner?: HTMLAttributes<HTMLDivElement>;
}): import("react/jsx-runtime").JSX.Element;
export declare function SidebarHeader(props: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFooter(props: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function SidebarViewport(props: ScrollAreaProps): import("react/jsx-runtime").JSX.Element;
export declare function SidebarSeparator(props: HTMLAttributes<HTMLParagraphElement>): import("react/jsx-runtime").JSX.Element;
export declare function SidebarItem({ icon, ...props }: LinkProps & {
    icon?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFolder({ defaultOpen, ...props }: {
    children: ReactNode;
    defaultOpen?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFolderTrigger(props: CollapsibleTriggerProps): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFolderLink(props: LinkProps): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFolderContent(props: CollapsibleContentProps): import("react/jsx-runtime").JSX.Element;
export declare function SidebarCollapseTrigger(props: ButtonHTMLAttributes<HTMLButtonElement>): import("react/jsx-runtime").JSX.Element;
/**
 * Render sidebar items from page tree
 */
export declare function SidebarPageTree(props: {
    components?: Partial<SidebarComponents>;
}): ReactNode[];
//# sourceMappingURL=sidebar.d.ts.map