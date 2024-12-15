import { G as GenerateDocumentationOptions, a as GeneratedDoc, D as DocEntry } from './base-BltLCalB.js';
export { b as GenerateOptions, d as generate, c as generateDocumentation, g as getProject } from './base-BltLCalB.js';
import fg from 'fast-glob';
import { Nodes } from 'hast';
import 'ts-morph';

interface Templates {
    block: (doc: GeneratedDoc, children: string) => string;
    property: (entry: DocEntry) => string;
}
interface GenerateMDXOptions extends GenerateDocumentationOptions {
    /**
     * a root directory to resolve relative file paths
     */
    basePath?: string;
    templates?: Partial<Templates>;
}
declare function generateMDX(source: string, { basePath, templates: overrides, ...rest }?: GenerateMDXOptions): string;

interface GenerateFilesOptions {
    input: string | string[];
    /**
     * Output directory, or a function that returns the output path
     */
    output: string | ((inputPath: string) => string);
    globOptions?: fg.Options;
    options?: GenerateMDXOptions;
    /**
     * @returns New content
     */
    transformOutput?: (path: string, content: string) => string;
}
declare function generateFiles(options: GenerateFilesOptions): Promise<void>;

declare function renderMarkdownToHast(md: string): Promise<Nodes>;

export { DocEntry, GenerateDocumentationOptions, type GenerateFilesOptions, type GenerateMDXOptions, GeneratedDoc, generateFiles, generateMDX, renderMarkdownToHast };
