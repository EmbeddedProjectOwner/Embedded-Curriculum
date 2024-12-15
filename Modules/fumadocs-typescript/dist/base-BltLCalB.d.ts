import { Project, ExportedDeclarations, Type, Symbol } from 'ts-morph';

interface TypescriptConfig {
    files?: string[];
    tsconfigPath?: string;
    /** A root directory to resolve relative path entries in the config file to. e.g. outDir */
    basePath?: string;
}
declare function getProject(options?: TypescriptConfig): Project;

interface GeneratedDoc {
    name: string;
    description: string;
    entries: DocEntry[];
}
interface DocEntry {
    name: string;
    description: string;
    type: string;
    tags: Record<string, string>;
}
interface EntryContext {
    program: Project;
    transform?: Transformer;
    type: Type;
    declaration: ExportedDeclarations;
}
type Transformer = (this: EntryContext, entry: DocEntry, propertyType: Type, propertySymbol: Symbol) => void;
interface GenerateOptions {
    /**
     * Allow fields with `@internal` tag
     *
     * @defaultValue false
     */
    allowInternal?: boolean;
    /**
     * Modify output property entry
     */
    transform?: Transformer;
}
interface GenerateDocumentationOptions extends GenerateOptions {
    /**
     * Typescript configurations
     */
    config?: TypescriptConfig;
    project?: Project;
}
/**
 * Generate documentation for properties in an exported type/interface
 */
declare function generateDocumentation(file: string, name: string | undefined, content: string, options?: GenerateDocumentationOptions): GeneratedDoc[];
declare function generate(program: Project, name: string, declaration: ExportedDeclarations, { allowInternal, transform }: GenerateOptions): GeneratedDoc;

export { type DocEntry as D, type GenerateDocumentationOptions as G, type GeneratedDoc as a, type GenerateOptions as b, generateDocumentation as c, generate as d, getProject as g };
