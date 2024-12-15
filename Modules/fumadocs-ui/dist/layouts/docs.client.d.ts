import { type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { type LinkItemType } from '../layouts/links';
interface LinksMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    items: LinkItemType[];
}
export declare function LinksMenu({ items, ...props }: LinksMenuProps): import("react/jsx-runtime").JSX.Element;
interface MenuItemProps extends HTMLAttributes<HTMLElement> {
    item: LinkItemType;
}
export declare function MenuItem({ item, ...props }: MenuItemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=docs.client.d.ts.map