import { ReactNode } from 'react';

interface TOCItemType {
    title: ReactNode;
    url: string;
    depth: number;
}
type TableOfContents = TOCItemType[];
/**
 * Get Table of Contents from markdown/mdx document (using remark)
 *
 * @param content - Markdown content
 */
declare function getTableOfContents(content: string): TableOfContents;

export { type TableOfContents as T, type TOCItemType as a, getTableOfContents as g };
