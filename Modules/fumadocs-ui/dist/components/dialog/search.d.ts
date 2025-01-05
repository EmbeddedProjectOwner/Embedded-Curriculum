import type { SortedResult } from 'fumadocs-core/server';
import { type ReactNode } from 'react';
export type SearchLink = [name: string, href: string];
export interface SharedProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Custom links to be displayed if search is empty
     */
    links?: SearchLink[];
}
export type SearchDialogProps = SharedProps & SearchValueProps & Omit<SearchResultProps, 'items'> & {
    results: SortedResult[] | 'empty';
    footer?: ReactNode;
};
interface SearchValueProps {
    search: string;
    onSearchChange: (v: string) => void;
    isLoading?: boolean;
}
interface SearchResultProps {
    items: SortedResult[];
    hideResults?: boolean;
}
export declare function SearchDialog({ open, onOpenChange, footer, links, ...props }: SearchDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=search.d.ts.map