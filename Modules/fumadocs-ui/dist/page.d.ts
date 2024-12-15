import { type PageTree, type TableOfContents } from 'fumadocs-core/server';
import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import type { LoaderConfig, LoaderOutput, Page } from 'fumadocs-core/source';
import { type AnchorProviderProps } from 'fumadocs-core/toc';
import { type FooterProps, type BreadcrumbProps } from './page.client';
import { type TOCProps } from './components/layout/toc';
type TableOfContentOptions = Omit<TOCProps, 'items' | 'children'> & Pick<AnchorProviderProps, 'single'> & {
    enabled: boolean;
    component: ReactNode;
    /**
     * @defaultValue 'normal'
     */
    style?: 'normal' | 'clerk';
};
type TableOfContentPopoverOptions = Omit<TableOfContentOptions, 'single'>;
interface EditOnGitHubOptions extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
    owner: string;
    repo: string;
    /**
     * SHA or ref (branch or tag) name.
     *
     * @defaultValue main
     */
    sha?: string;
    /**
     * File path in the repo
     */
    path: string;
}
interface BreadcrumbOptions extends BreadcrumbProps {
    enabled: boolean;
    component: ReactNode;
    /**
     * Show the full path to the current page
     *
     * @defaultValue false
     * @deprecated use `includePage` instead
     */
    full?: boolean;
}
interface FooterOptions extends FooterProps {
    enabled: boolean;
    component: ReactNode;
}
export interface DocsPageProps {
    toc?: TableOfContents;
    /**
     * Extend the page to fill all available space
     *
     * @defaultValue false
     */
    full?: boolean;
    tableOfContent?: Partial<TableOfContentOptions>;
    tableOfContentPopover?: Partial<TableOfContentPopoverOptions>;
    /**
     * Replace or disable breadcrumb
     */
    breadcrumb?: Partial<BreadcrumbOptions>;
    /**
     * Footer navigation, you can disable it by passing `false`
     */
    footer?: Partial<FooterOptions>;
    editOnGithub?: EditOnGitHubOptions;
    lastUpdate?: Date | string | number;
    children: ReactNode;
}
export declare function DocsPage({ toc, breadcrumb, full, footer, tableOfContentPopover: { enabled: tocPopoverEnabled, component: tocPopoverReplace, ...tocPopoverOptions }, tableOfContent: { enabled: tocEnabled, component: tocReplace, ...tocOptions }, ...props }: DocsPageProps): ReactNode;
/**
 * Add typography styles
 */
export declare const DocsBody: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
export declare const DocsDescription: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLParagraphElement> & import("react").RefAttributes<HTMLParagraphElement>>;
export declare const DocsTitle: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLHeadingElement> & import("react").RefAttributes<HTMLHeadingElement>>;
export declare function DocsCategory({ page, from, tree: forcedTree, ...props }: HTMLAttributes<HTMLDivElement> & {
    page: Page;
    from: LoaderOutput<LoaderConfig>;
    tree?: PageTree.Root;
}): import("react/jsx-runtime").JSX.Element | null;
/**
 * For separate MDX page
 */
export declare function withArticle({ children }: {
    children: ReactNode;
}): ReactNode;
export {};
//# sourceMappingURL=page.d.ts.map