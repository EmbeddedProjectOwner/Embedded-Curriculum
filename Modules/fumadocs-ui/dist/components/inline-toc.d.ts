import type { TOCItemType } from 'fumadocs-core/server';
export interface InlineTocProps {
    items: TOCItemType[];
    defaultOpen?: boolean;
    action?: () => void
}

export declare function InlineTOC({ items, defaultOpen, action}: InlineTocProps): React.ReactElement;
//# sourceMappingURL=inline-toc.d.ts.map