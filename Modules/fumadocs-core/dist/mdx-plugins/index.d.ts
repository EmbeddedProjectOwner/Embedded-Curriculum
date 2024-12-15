export { Options as RemarkGfmOptions, default as remarkGfm } from 'remark-gfm';
import { Root } from 'hast';
import { RehypeShikiOptions } from '@shikijs/rehype';
import { Processor, Transformer } from 'unified';
import { ShikiTransformer } from 'shiki';
import { Root as Root$1 } from 'mdast';
export { a as StructureOptions, S as StructuredData, r as remarkStructure, s as structure } from '../remark-structure-mP51W1AN.js';
export { R as RemarkHeadingOptions, r as remarkHeading } from '../remark-heading-BPCoYwjn.js';
import 'unist-util-visit';

interface CodeBlockIcon {
    viewBox: string;
    fill: string;
    d: string;
}
interface IconOptions {
    shortcuts?: Record<string, string>;
    extend?: Record<string, CodeBlockIcon>;
}
/**
 * Inject icons to `icon` property (as HTML)
 */
declare function transformerIcon(options?: IconOptions): ShikiTransformer;

declare const rehypeCodeDefaultOptions: RehypeCodeOptions;
type RehypeCodeOptions = RehypeShikiOptions & {
    /**
     * Filter meta string before processing
     */
    filterMetaString?: (metaString: string) => string;
    /**
     * Add icon to code blocks
     */
    icon?: IconOptions | false;
    /**
     * Wrap code blocks in `<Tab>` component when "tab" meta string presents
     *
     * @defaultValue true
     */
    tab?: false;
    /**
     * Enable Shiki's experimental JS engine
     *
     * @defaultValue false
     */
    experimentalJSEngine?: boolean;
};
/**
 * Handle codeblocks
 */
declare function rehypeCode(this: Processor, options?: Partial<RehypeCodeOptions>): Transformer<Root, Root>;
declare function transformerTab(): ShikiTransformer;

interface RemarkImageOptions {
    /**
     * Directory or base URL to resolve absolute image paths
     */
    publicDir?: string;
    /**
     * Preferred placeholder type
     *
     * @defaultValue 'blur'
     */
    placeholder?: 'blur' | 'none';
    /**
     * Import images in the file, and let bundlers handle it.
     *
     * ```tsx
     * import MyImage from "./public/img.png";
     *
     * <img src={MyImage} />
     * ```
     *
     * When disabled, `placeholder` will be ignored.
     *
     * @defaultValue true
     */
    useImport?: boolean;
    /**
     * Fetch image size of external URLs
     *
     * @defaultValue true
     */
    external?: boolean;
}
/**
 * Turn images into Next.js Image compatible usage.
 */
declare function remarkImage({ placeholder, external, useImport, publicDir, }?: RemarkImageOptions): Transformer<Root$1, Root$1>;

interface RemarkAdmonitionOptions {
    tag?: string;
    types?: string[];
    /**
     * Map type to another type
     */
    typeMap?: Record<string, string>;
}
/**
 * Remark Plugin to support Admonition syntax
 *
 * Useful when Migrating from Docusaurus
 */
declare function remarkAdmonition(options?: RemarkAdmonitionOptions): Transformer<Root$1, Root$1>;

interface RehypeTocOptions {
    /**
     * Export generated toc as a variable
     *
     * @defaultValue true
     */
    exportToc?: boolean;
}
declare function rehypeToc(this: Processor, { exportToc }?: RehypeTocOptions): Transformer<Root, Root>;

export { type CodeBlockIcon, type RehypeCodeOptions, type RehypeTocOptions, type RemarkAdmonitionOptions, type RemarkImageOptions, rehypeCode, rehypeCodeDefaultOptions, rehypeToc, remarkAdmonition, remarkImage, transformerIcon, transformerTab };
