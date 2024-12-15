import { type HTMLAttributes, type ReactNode } from 'react';
import type { PageTree } from 'fumadocs-core/server';
export interface Option {
    /**
     * Redirect URL of the folder, usually the index page
     */
    url: string;
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /**
     * Detect from page tree nodes
     */
    folder?: PageTree.Folder;
    props?: HTMLAttributes<HTMLElement>;
}
export declare function RootToggle({ options, ...props }: {
    options: Option[];
} & HTMLAttributes<HTMLButtonElement>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=root-toggle.d.ts.map