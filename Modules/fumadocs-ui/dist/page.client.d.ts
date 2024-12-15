import { type HTMLAttributes } from 'react';
import { type BreadcrumbOptions } from 'fumadocs-core/breadcrumb';
export declare function PageContainer(props: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function PageHeader(props: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function LastUpdate(props: {
    date: Date;
}): import("react/jsx-runtime").JSX.Element;
export interface FooterProps {
    /**
     * Items including information for the next and previous page
     */
    items?: {
        previous?: {
            name: string;
            url: string;
        };
        next?: {
            name: string;
            url: string;
        };
    };
}
export declare function Footer({ items }: FooterProps): import("react/jsx-runtime").JSX.Element;
export type BreadcrumbProps = BreadcrumbOptions;
export declare function Breadcrumb(options: BreadcrumbProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=page.client.d.ts.map