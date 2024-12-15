import { G as GenerateDocumentationOptions } from '../base-BltLCalB.js';
import 'ts-morph';

interface AutoTypeTableProps {
    /**
     * The path to source TypeScript file.
     */
    path?: string;
    /**
     * Exported type name to generate from.
     */
    name?: string;
    /**
     * Set the type to generate from.
     *
     * When used with `name`, it generates the type with `name` as export name.
     *
     * ```ts
     * export const myName = MyType;
     * ```
     *
     * When `type` contains multiple lines, `export const` is not added.
     * You need to export it manually, and specify the type name with `name`.
     *
     * ```tsx
     * <AutoTypeTable
     *   path="./file.ts"
     *   type={`import { ReactNode } from "react"
     *   export const MyName = ReactNode`}
     *   name="MyName"
     * />
     * ```
     */
    type?: string;
    options?: GenerateDocumentationOptions;
}
declare function createTypeTable(options?: GenerateDocumentationOptions): {
    AutoTypeTable: (props: Omit<AutoTypeTableProps, 'options'>) => React.ReactNode;
};
/**
 * **Server Component Only**
 *
 * Display properties in an exported interface via Type Table
 */
declare function AutoTypeTable({ path, name, type, options, }: AutoTypeTableProps): Promise<React.ReactElement>;

export { AutoTypeTable, type AutoTypeTableProps, createTypeTable };
