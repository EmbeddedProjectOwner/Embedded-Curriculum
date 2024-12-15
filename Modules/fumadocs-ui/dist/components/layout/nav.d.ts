import { type LinkProps } from 'fumadocs-core/link';
import { type ReactNode } from 'react';
export interface NavProviderProps {
    /**
     * Use transparent background
     *
     * @defaultValue none
     */
    transparentMode?: 'always' | 'top' | 'none';
}
export interface TitleProps {
    title?: ReactNode;
    /**
     * Redirect url of title
     * @defaultValue '/'
     */
    url?: string;
}
interface NavContextType {
    isTransparent: boolean;
}
export declare function NavProvider({ transparentMode, children, }: NavProviderProps & {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNav(): NavContextType;
export declare function Title({ title, url, ...props }: TitleProps & Omit<LinkProps, 'title'>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=nav.d.ts.map