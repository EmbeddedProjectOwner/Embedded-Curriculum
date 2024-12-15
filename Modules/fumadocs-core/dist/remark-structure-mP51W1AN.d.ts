import { Root } from 'mdast';
import { Transformer, PluggableList } from 'unified';
import { Test } from 'unist-util-visit';

interface Heading {
    id: string;
    content: string;
}
interface Content {
    heading: string | undefined;
    content: string;
}
interface StructuredData {
    headings: Heading[];
    /**
     * Refer to paragraphs, a heading may contain multiple contents as well
     */
    contents: Content[];
}
interface StructureOptions {
    /**
     * Types to be scanned.
     *
     * @defaultValue ['paragraph', 'blockquote', 'heading', 'tableCell']
     */
    types?: Test;
}
/**
 * Attach structured data to VFile, you can access via `vfile.data.structuredData`.
 */
declare function remarkStructure({ types, }?: StructureOptions): Transformer<Root, Root>;
/**
 * Extract data from markdown/mdx content
 */
declare function structure(content: string, remarkPlugins?: PluggableList, options?: StructureOptions): StructuredData;

export { type StructuredData as S, type StructureOptions as a, remarkStructure as r, structure as s };
