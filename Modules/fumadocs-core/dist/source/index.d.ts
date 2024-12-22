// index.d.ts
import { ReactElement } from 'react';
import { I as I18nConfig } from '../config-inq6kP6y.js';
import { R as Root, I as Item, F as Folder$1, S as Separator } from '../page-tree-r8qjoUla.js';
import { StructuredData } from "../mdx-plugins/index.js";

interface FileInfo {
    /**
     * The locale extension of file
     */
    locale?: string;
    /**
     * Original path of file
     */
    path: string;
    /**
     * File path without extension
     */
    flattenedPath: string;
    /**
     * File name without locale and extension
     */
    name: string;
    dirname: string;
}
declare function parseFilePath(path: string): FileInfo;
declare function parseFolderPath(path: string): FileInfo;

interface LoadOptions {
    transformers?: Transformer[];
    rootDir?: string;
    getSlugs: (info: FileInfo) => string[];
}
interface VirtualFile {
    /**
     * Relative path
     *
     * @example `docs/page.mdx`
     */
    path: string;
    type: 'page' | 'meta';
    /**
     * Specified Slugs for page
     */
    slugs?: string[];
    data: unknown;
}
type Transformer = (context: {
    storage: Storage;
    options: LoadOptions;
}) => void;
declare function loadFiles(files: VirtualFile[], options: LoadOptions): Storage;

interface LoaderConfig {
    source: SourceConfig;
    i18n: boolean;
}
interface SourceConfig {
    pageData: PageData;
    metaData: MetaData;
}
interface LoaderOptions {
    /**
     * @defaultValue `''`
     */
    rootDir?: string;
    /**
     * @defaultValue `'/'`
     */
    baseUrl?: string;
    icon?: NonNullable<BuildPageTreeOptions['resolveIcon']>;
    slugs?: LoadOptions['getSlugs'];
    url?: UrlFn;
    source: Source<any>;
    transformers?: Transformer[];
    /**
     * Additional options for page tree builder
     */
    pageTree?: Partial<Omit<BuildPageTreeOptions, 'storage' | 'getUrl'>>;
    /**
     * Configure i18n
     */
    i18n?: I18nConfig;
}
interface Source<Config extends SourceConfig> {
    /**
     * @internal
     */
    _config?: Config;
    files: VirtualFile[] | ((rootDir: string) => VirtualFile[]);
}
interface Page<Data = PageData> {
    file: FileInfo;
    slugs: string[];
    tags: string[];
    url: string;
    data: Data;
    locale?: string | undefined;
}
interface Meta<Data = MetaData> {
    file: FileInfo;
    data: Data;
}
interface LanguageEntry<Data = PageData> {
    language: string;
    pages: Page<Data>[];
}
interface LoaderOutput<Config extends LoaderConfig> {
    pageTree: Config['i18n'] extends true ? Record<string, Root> : Root;
    _i18n?: I18nConfig;
    /**
     * Get list of pages from language, empty if language hasn't specified
     *
     * @param language - If empty, the default language will be used
     */
    getPages: (language?: string) => Page<Config['source']['pageData']>[];
    getLanguages: () => LanguageEntry<Config['source']['pageData']>[];
    /**
     * @param language - If empty, the default language will be used
     */
    getPage: (slugs: string[] | undefined, language?: string) => Page<Config['source']['pageData']> | undefined;
    getNodePage: (node: Item) => Page<Config['source']['pageData']> | undefined;
    getNodeMeta: (node: Folder$1) => Meta<Config['source']['metaData']> | undefined;
    /**
     * generate static params for Next.js SSG
     */
    generateParams: <TSlug extends string = 'slug', TLang extends string = 'lang'>(slug?: TSlug, lang?: TLang) => (Record<TSlug, string[]> & Record<TLang, string>)[];
}
declare function createGetUrl(baseUrl: string, i18n?: I18nConfig): UrlFn;
declare function getSlugs(info: FileInfo): string[];
type InferSourceConfig<T> = T extends Source<infer Config> ? Config : never;
declare function loader<Options extends LoaderOptions>(options: Options): LoaderOutput<{
    source: InferSourceConfig<Options['source']>;
    i18n: Options['i18n'] extends I18nConfig ? true : false;
}>;

interface MetaData {
    icon?: string | undefined;
    title?: string | undefined;
    root?: boolean | undefined;
    pages?: string[] | undefined;
    defaultOpen?: boolean | undefined;
    description?: string | undefined;
}
interface PageData {
    structuredData: StructuredData;
    icon?: string | undefined;
    title: string;
    description?: string;
}
type InferPageType<Utils extends LoaderOutput<any>> = Utils extends LoaderOutput<infer Config> ? Page<Config['source']['pageData']> : never;
type InferMetaType<Utils extends LoaderOutput<any>> = Utils extends LoaderOutput<infer Config> ? Meta<Config['source']['metaData']> : never;
/**
 * @internal
 */
type UrlFn = (slugs: string[], locale?: string) => string;

interface MetaFile {
    file: FileInfo;
    format: 'meta';
    data: MetaData;
}
interface PageFile {
    file: FileInfo;
    format: 'page';
    data: {
        slugs: string[];
        data: PageData;
    };
}
type File = MetaFile | PageFile;
interface Folder {
    file: FileInfo;
    children: (File | Folder)[];
}
/**
 * A virtual file system that solves inconsistent behaviours
 *
 * Some source providers may not provide the full file structure, this will cause inconsistent outputs for page builder and other transformers
 */
declare class Storage {
    files: Map<string, File>;
    folders: Map<string, Folder>;
    private rootFolder;
    constructor();
    /**
     * @param path - flattened path
     * @param format - file format
     */
    read<F extends File['format']>(path: string, format: F): Extract<File, {
        format: F;
    }> | undefined;
    readDir(path: string): Folder | undefined;
    root(): Folder;
    write<F extends File['format']>(path: string, format: F, data: Extract<File, {
        format: F;
    }>['data']): void;
    list(): File[];
    makeDir(path: string): void;
}

type fileSystem_File = File;
type fileSystem_Folder = Folder;
type fileSystem_MetaFile = MetaFile;
type fileSystem_PageFile = PageFile;
type fileSystem_Storage = Storage;
declare const fileSystem_Storage: typeof Storage;
declare namespace fileSystem {
  export { type fileSystem_File as File, type fileSystem_Folder as Folder, type fileSystem_MetaFile as MetaFile, type fileSystem_PageFile as PageFile, fileSystem_Storage as Storage };
}

interface BuildPageTreeOptions {
    /**
     * Remove references to the file path of original nodes (`$ref`)
     *
     * @defaultValue false
     */
    noRef?: boolean;
    attachFile?: (node: Item, file?: PageFile) => Item;
    attachFolder?: (node: Folder$1, folder: Folder, meta?: MetaFile) => Folder$1;
    attachSeparator?: (node: Separator) => Separator;
    storage: Storage;
    getUrl: UrlFn;
    resolveIcon?: (icon: string | undefined) => ReactElement | undefined;
}
interface BuildPageTreeOptionsWithI18n extends BuildPageTreeOptions {
    i18n: I18nConfig;
}
interface PageTreeBuilder {
    build: (options: BuildPageTreeOptions) => Root;
    /**
     * Build page tree and fallback to the default language if the localized page doesn't exist
     */
    buildI18n: (options: BuildPageTreeOptionsWithI18n) => Record<string, Root>;
}
declare function createPageTreeBuilder(): PageTreeBuilder;

