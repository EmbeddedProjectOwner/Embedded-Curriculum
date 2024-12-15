import { type ComponentProps, type HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { type LinkProps } from 'fumadocs-core/link';
import { BaseLinkItem } from '../../layouts/links';
import type { NavigationMenuContentProps, NavigationMenuTriggerProps } from '@radix-ui/react-navigation-menu';
export declare function Navbar(props: HTMLAttributes<HTMLElement>): import("react/jsx-runtime").JSX.Element;
export declare const NavbarMenu: import("react").ForwardRefExoticComponent<import("@radix-ui/react-navigation-menu").NavigationMenuItemProps & import("react").RefAttributes<HTMLLIElement>>;
export declare function NavbarMenuContent(props: NavigationMenuContentProps): import("react/jsx-runtime").JSX.Element;
export declare function NavbarMenuTrigger(props: NavigationMenuTriggerProps): import("react/jsx-runtime").JSX.Element;
declare const linkVariants: (props?: ({
    variant?: "button" | "main" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare function NavbarLink({ item, variant, ...props }: ComponentProps<typeof BaseLinkItem> & VariantProps<typeof linkVariants>): import("react/jsx-runtime").JSX.Element;
export declare function NavbarMenuItem(props: LinkProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=navbar.d.ts.map