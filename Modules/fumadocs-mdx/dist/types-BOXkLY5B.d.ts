import { AnyZodObject, z } from 'zod';
import { MDXProps } from 'mdx/types';
import { StructureOptions, RemarkHeadingOptions, RemarkImageOptions, RehypeCodeOptions, StructuredData } from 'fumadocs-core/mdx-plugins';
import { TableOfContents } from 'fumadocs-core/server';
import { ProcessorOptions } from '@mdx-js/mdx';
import { Pluggable } from 'unified';

type ResolvePlugins = Pluggable[] | ((v: Pluggable[]) => Pluggable[]);
type DefaultMDXOptions = Omit<NonNullable<ProcessorOptions>, 'rehypePlugins' | 'remarkPlugins' | '_ctx'> & {
    rehypePlugins?: ResolvePlugins;
    remarkPlugins?: ResolvePlugins;
    /**
     * Properties to export from `vfile.data`
     */
    valueToExport?: string[];
    remarkStructureOptions?: StructureOptions | false;
    remarkHeadingOptions?: RemarkHeadingOptions;
    remarkImageOptions?: RemarkImageOptions | false;
    rehypeCodeOptions?: Partial<RehypeCodeOptions> | false;
};
declare function getDefaultMDXOptions({ valueToExport, rehypeCodeOptions, remarkImageOptions, remarkHeadingOptions, remarkStructureOptions, ...mdxOptions }: DefaultMDXOptions): ProcessorOptions;

interface GlobalConfig {
    /**
     * Configure global MDX options
     */
    mdxOptions?: DefaultMDXOptions;
    /**
     * Fetch last modified time with specified version control
     * @defaultValue 'none'
     */
    lastModifiedTime?: 'git' | 'none';
    /**
     * Generate manifest file on build mode
     *
     * @defaultValue false
     */
    generateManifest?: boolean;
}
type InferSchema<CollectionOut> = CollectionOut extends {
    _type: {
        schema: infer T;
    };
} ? T : never;
type InferSchemaType<C> = InferSchema<C> extends AnyZodObject ? z.output<InferSchema<C>> : never;
interface FileInfo {
    path: string;
    absolutePath: string;
}
interface MarkdownProps {
    body: (props: MDXProps) => React.ReactElement;
    structuredData: StructuredData;
    toc: TableOfContents;
    _exports: Record<string, unknown>;
    /**
     * Only available when `lastModifiedTime` is enabled on MDX loader
     */
    lastModified?: Date;
}
type CollectionEntry<CollectionOut extends {
    _type: {
        runtime: unknown;
    };
}> = CollectionOut['_type']['runtime'];
interface BaseCollectionEntry {
    _file: FileInfo;
}
/**
 * Get output type of collections
 */
type GetOutput<C extends {
    _type: {
        runtime: unknown;
    };
}> = CollectionEntry<C>[];

export { type BaseCollectionEntry as B, type CollectionEntry as C, type DefaultMDXOptions as D, type FileInfo as F, type GlobalConfig as G, type InferSchema as I, type MarkdownProps as M, type InferSchemaType as a, type GetOutput as b, getDefaultMDXOptions as g };
