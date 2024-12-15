import type { ReactNode } from 'react';
export declare function Info({ children }: {
    children: ReactNode;
}): ReactNode;
interface ObjectType {
    /**
     * Additional description of the field
     */
    description?: ReactNode;
    type: string;
    typeDescription?: ReactNode;
    /**
     * Optional link to the type
     */
    typeDescriptionLink?: string;
    default?: string;
}
export declare function TypeTable({ type }: {
    type: Record<string, ObjectType>;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=type-table.d.ts.map