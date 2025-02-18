import type { HTMLAttributes } from 'react';
export interface TagItem {
    name: string;
    value: string | undefined;
    props?: HTMLAttributes<HTMLButtonElement>;
    subTags?: TagItem[]
}
export interface TagsListProps extends HTMLAttributes<HTMLDivElement> {
    tag?: string;
    onTagChange: (tag: string | undefined) => void;
    allowClear?: boolean;
    items: TagItem[];
}
export declare function TagsList({ tag, onTagChange, items, allowClear, ...props }: TagsListProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tag-list.d.ts.map