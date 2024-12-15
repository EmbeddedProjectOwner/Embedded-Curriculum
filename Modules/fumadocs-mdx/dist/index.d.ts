import { PageData, MetaData, Source } from 'fumadocs-core/source';
import { F as FileInfo, B as BaseCollectionEntry } from './types-BOXkLY5B.js';
import { MetaFile } from './loader-mdx.js';
import 'zod';
import 'mdx/types';
import 'fumadocs-core/mdx-plugins';
import 'fumadocs-core/server';
import '@mdx-js/mdx';
import 'unified';
import 'webpack';

declare function toRuntime(type: 'doc' | 'meta', file: Record<string, unknown>, info: FileInfo): unknown;
declare function toRuntimeAsync(frontmatter: Record<string, unknown>, load: () => Promise<Record<string, unknown>>, info: FileInfo): unknown;
declare function createMDXSource<Doc extends PageData & BaseCollectionEntry, Meta extends MetaData & BaseCollectionEntry>(docs: Doc[], meta: Meta[]): Source<{
    pageData: Doc;
    metaData: Meta;
}>;

interface Manifest {
    files: (MetaFile & {
        collection: string;
    })[];
}

export { type Manifest, createMDXSource, toRuntime, toRuntimeAsync };
