import { LoaderContext } from 'webpack';
import { StructuredData } from 'fumadocs-core/mdx-plugins';

interface Options {
    /**
     * @internal
     */
    _ctx: {
        configPath: string;
    };
}
interface MetaFile {
    path: string;
    data: {
        frontmatter: Record<string, unknown>;
        structuredData?: StructuredData;
        [key: string]: unknown;
    };
}
/**
 * Load MDX/markdown files
 *
 * it supports frontmatter by parsing and injecting the data in `vfile.data.frontmatter`
 */
declare function loader(this: LoaderContext<Options>, source: string, callback: LoaderContext<Options>['callback']): Promise<void>;

export { type MetaFile, type Options, loader as default };
