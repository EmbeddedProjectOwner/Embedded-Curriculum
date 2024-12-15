import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
interface BaseItem {
    /**
     * Restrict where the item is displayed
     *
     * @defaultValue 'all'
     */
    on?: 'menu' | 'nav' | 'all';
}
export interface BaseLinkType extends BaseItem {
    url: string;
    /**
     * When the item is marked as active
     *
     * @defaultValue 'url'
     */
    active?: 'url' | 'nested-url' | 'none';
    external?: boolean;
}
export interface MainItemType extends BaseLinkType {
    type?: 'main';
    icon?: ReactNode;
    text: ReactNode;
    description?: ReactNode;
}
export interface IconItemType extends BaseLinkType {
    type: 'icon';
    /**
     * `aria-label` of icon button
     */
    label?: string;
    icon: ReactNode;
    text: ReactNode;
    /**
     * @defaultValue true
     */
    secondary?: boolean;
}
interface ButtonItem extends BaseLinkType {
    type: 'button';
    icon?: ReactNode;
    text: ReactNode;
    /**
     * @defaultValue false
     */
    secondary?: boolean;
}
export interface MenuItemType extends BaseItem {
    type: 'menu';
    icon?: ReactNode;
    text: ReactNode;
    url?: string;
    items: ((MainItemType & {
        /**
         * Options when displayed on navigation menu
         */
        menu?: HTMLAttributes<HTMLElement> & {
            banner?: ReactNode;
            footer?: ReactNode;
        };
    }) | CustomItem)[];
    /**
     * @defaultValue false
     */
    secondary?: boolean;
}
interface CustomItem extends BaseItem {
    type: 'custom';
    /**
     * @defaultValue false
     */
    secondary?: boolean;
    children: ReactNode;
}
export type LinkItemType = MainItemType | IconItemType | ButtonItem | MenuItemType | CustomItem;
export declare const BaseLinkItem: import("react").ForwardRefExoticComponent<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    item: BaseLinkType;
} & import("react").RefAttributes<HTMLAnchorElement>>;
export {};
//# sourceMappingURL=links.d.ts.map