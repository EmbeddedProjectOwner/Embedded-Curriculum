import type { HTMLAttributes, ReactNode } from 'react';
export declare function Cards(props: HTMLAttributes<HTMLDivElement>): React.ReactElement;
export type CardProps = HTMLAttributes<HTMLElement> & {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    href?: string;
    external?: boolean;
};
export declare function Card({ icon, title, description, ...props }: CardProps): React.ReactElement;
//# sourceMappingURL=card.d.ts.map