import type { AnchorHTMLAttributes, FC, HTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes } from 'react';
import { Card, Cards } from './components/card';
declare function Image(props: ImgHTMLAttributes<HTMLImageElement>): import("react/jsx-runtime").JSX.Element;
declare function Table(props: TableHTMLAttributes<HTMLTableElement>): import("react/jsx-runtime").JSX.Element;
declare const defaultMdxComponents: {
    pre: FC<HTMLAttributes<HTMLPreElement>>;
    Card: typeof Card;
    Cards: typeof Cards;
    a: FC<AnchorHTMLAttributes<HTMLAnchorElement>>;
    img: typeof Image;
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    h4: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    h5: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    h6: (props: HTMLAttributes<HTMLHeadingElement>) => import("react/jsx-runtime").JSX.Element;
    table: typeof Table;
    Callout: import("react").ForwardRefExoticComponent<Omit<HTMLAttributes<HTMLDivElement>, "title" | "type" | "icon"> & {
        title?: import("react").ReactNode;
        type?: "info" | "warn" | "error";
        icon?: import("react").ReactNode;
    } & import("react").RefAttributes<HTMLDivElement>>;
};
/**
 * **Server Component Only**
 *
 * Sometimes, if you directly pass a client component to MDX Components, it will throw an error
 *
 * To solve this, you can re-create the component in a server component like: `(props) => <Component {...props} />`
 *
 * This function does that for you
 *
 * @param c - MDX Components
 * @returns MDX Components with re-created client components
 * @deprecated no longer used
 */
export declare function createComponents<Components extends Record<string, FC<unknown>>>(c: Components): Components;
export { defaultMdxComponents as default };
//# sourceMappingURL=mdx.d.ts.map