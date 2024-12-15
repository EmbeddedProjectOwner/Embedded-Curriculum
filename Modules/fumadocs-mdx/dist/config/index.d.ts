import { F as FileInfo, G as GlobalConfig, M as MarkdownProps, B as BaseCollectionEntry } from '../types-BOXkLY5B.js';
export { C as CollectionEntry, D as DefaultMDXOptions, b as GetOutput, I as InferSchema, a as InferSchemaType, g as getDefaultMDXOptions } from '../types-BOXkLY5B.js';
import { z, ZodTypeAny } from 'zod';
import { ProcessorOptions } from '@mdx-js/mdx';
import 'mdx/types';
import 'fumadocs-core/mdx-plugins';
import 'fumadocs-core/server';
import 'unified';

interface MDXOptions extends ProcessorOptions {
    /**
     * Name of collection
     */
    collection?: string;
    /**
     * Specify a file path for source
     */
    filePath?: string;
    frontmatter?: Record<string, unknown>;
    /**
     * Custom Vfile data
     */
    data?: Record<string, unknown>;
}

declare const metaSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    pages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodString>;
    root: z.ZodOptional<z.ZodBoolean>;
    defaultOpen: z.ZodOptional<z.ZodBoolean>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    root?: boolean | undefined;
    title?: string | undefined;
    icon?: string | undefined;
    pages?: string[] | undefined;
    description?: string | undefined;
    defaultOpen?: boolean | undefined;
}, {
    root?: boolean | undefined;
    title?: string | undefined;
    icon?: string | undefined;
    pages?: string[] | undefined;
    description?: string | undefined;
    defaultOpen?: boolean | undefined;
}>;
declare const frontmatterSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    full: z.ZodOptional<z.ZodBoolean>;
    _openapi: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    icon?: string | undefined;
    description?: string | undefined;
    full?: boolean | undefined;
    _openapi?: z.objectOutputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    title: string;
    icon?: string | undefined;
    description?: string | undefined;
    full?: boolean | undefined;
    _openapi?: z.objectInputType<{}, z.ZodTypeAny, "passthrough"> | undefined;
}>;

interface TransformContext {
    path: string;
    source: string;
    /**
     * Compile MDX to JavaScript
     */
    buildMDX: (source: string, options?: ProcessorOptions) => Promise<string>;
}
interface BaseCollection<Schema> {
    /**
     * Directories to scan
     */
    dir: string | string[];
    /**
     * what files to include/exclude (glob patterns)
     *
     * Include all files if not specified
     */
    files?: string[];
    schema?: Schema | ((ctx: TransformContext) => Schema);
}
interface MetaCollection<Schema extends ZodTypeAny = ZodTypeAny, TransformOutput = unknown> extends BaseCollection<Schema> {
    type: 'meta';
    /**
     * Do transformation in runtime.
     *
     * This cannot be optimized by bundlers/loaders, avoid expensive calculations here.
     */
    transform?: (entry: {
        data: z.output<Schema>;
        file: FileInfo;
    }, globalConfig?: GlobalConfig) => TransformOutput | Promise<TransformOutput>;
}
interface DocCollection<Schema extends ZodTypeAny = ZodTypeAny, Async extends boolean = boolean, TransformOutput = unknown> extends BaseCollection<Schema> {
    type: 'doc';
    /**
     * Do transformation in runtime.
     *
     * This cannot be optimized by bundlers/loaders, avoid expensive calculations here.
     */
    transform?: (entry: {
        data: z.output<Schema>;
        file: FileInfo;
        mdx: Async extends true ? MarkdownProps : never;
    }, globalConfig?: GlobalConfig) => TransformOutput | Promise<TransformOutput>;
    mdxOptions?: MDXOptions;
    /**
     * Load files with async
     */
    async?: Async;
}
declare function defineCollections<T extends 'doc' | 'meta', Schema extends ZodTypeAny = ZodTypeAny, Async extends boolean = false, TransformOutput = unknown>(options: {
    type: T;
} & (T extends 'doc' ? DocCollection<Schema, Async, TransformOutput> : MetaCollection<Schema, TransformOutput>)): {
    _doc: 'collections';
    type: T;
    _type: {
        async: Async;
        transform: TransformOutput;
        runtime: T extends 'doc' ? Async extends true ? z.infer<Schema> & BaseCollectionEntry & {
            load: () => Promise<MarkdownProps>;
        } : Omit<MarkdownProps, keyof z.infer<Schema>> & z.infer<Schema> & BaseCollectionEntry : typeof options extends MetaCollection ? z.infer<Schema> & BaseCollectionEntry : never;
    };
};
declare function defineDocs<DocData extends ZodTypeAny = typeof frontmatterSchema, MetaData extends ZodTypeAny = typeof metaSchema, DocAsync extends boolean = false, DocOut = unknown, MetaOut = unknown>(options?: {
    /**
     * The directory to scan files
     *
     *  @defaultValue 'content/docs'
     */
    dir?: string | string[];
    docs?: Partial<DocCollection<DocData, DocAsync, DocOut>>;
    meta?: Partial<MetaCollection<MetaData, MetaOut>>;
}): {
    docs: ReturnType<typeof defineCollections<'doc', DocData, DocAsync, DocOut>>;
    meta: ReturnType<typeof defineCollections<'meta', MetaData, false, MetaOut>>;
};
declare function defineConfig(config?: GlobalConfig): GlobalConfig;

export { type BaseCollection, BaseCollectionEntry, type DocCollection, FileInfo, GlobalConfig, MarkdownProps, type MetaCollection, type TransformContext, defineCollections, defineConfig, defineDocs, frontmatterSchema, metaSchema };
