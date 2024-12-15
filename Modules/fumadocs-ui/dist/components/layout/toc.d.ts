import type { TOCItemType } from 'fumadocs-core/server';
import { type HTMLAttributes, type ReactNode } from 'react';
export interface TOCProps {
    /**
     * Custom content in TOC container, before the main TOC
     */
    header?: ReactNode;
    /**
     * Custom content in TOC container, after the main TOC
     */
    footer?: ReactNode;
    children: ReactNode;
}
export declare function Toc(props: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function TocItemsEmpty(): import("react/jsx-runtime").JSX.Element;
export declare function TOCItems({ items, isMenu, }: {
    items: TOCItemType[];
    isMenu?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=toc.d.ts.map