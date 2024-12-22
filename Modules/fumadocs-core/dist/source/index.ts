import { removeUndefined } from "../chunk-2V6SCS43.js";
import { resolvePath, slash, splitPath } from "../chunk-SHGL6VBO.js";
import { __export } from "../chunk-MLKGABMK.js";
import matter from "gray-matter";
import { ReactElement } from 'react';
import { I as I18nConfig } from '../config-inq6kP6y.js';
import { R as Root, I as Item, F as Folder$1, S as Separator } from '../page-tree-r8qjoUla.js';
import { StructuredData } from "../mdx-plugins/index.js";

interface FileInfo {
    locale?: string;
    path: string;
    flattenedPath: string;
    name: string;
    dirname: string;
}


interface LoadOptions {
    transformers?: Transformer[];
    rootDir?: string;
    getSlugs: (info: FileInfo) => string[];
}

interface VirtualFile {
    path: string;
    type: 'page' | 'meta';
    slugs?: string[];
    data: [] | any;
}

type Transformer = (context: {
    storage: Storage;
    options: LoadOptions;
}) => void;


interface LoaderConfig {
    source: SourceConfig;
    i18n: boolean;
}

interface SourceConfig {
    pageData: PageData;
    metaData: MetaData;
}

interface LoaderOptions {
    rootDir?: string;
    baseUrl?: string;
    icon?: NonNullable<BuildPageTreeOptions['resolveIcon']>;
    slugs?: LoadOptions['getSlugs'];
    url?: UrlFn;
    source: Source<any>;
    transformers?: Transformer[];
    pageTree?: Partial<Omit<BuildPageTreeOptions, 'storage' | 'getUrl'>>;
    i18n?: I18nConfig;
}

interface Source<Config extends SourceConfig> {
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
    getPages: (language?: string) => Page<Config['source']['pageData']>[];
    getLanguages: () => LanguageEntry<Config['source']['pageData']>[];
    getPage: (slugs: string[] | undefined, language?: string) => Page<Config['source']['pageData']> | undefined;
    getNodePage: (node: Item) => Page<Config['source']['pageData']> | undefined;
    getNodeMeta: (node: Folder$1) => Meta<Config['source']['metaData']> | undefined;
    generateParams: <TSlug extends string = 'slug', TLang extends string = 'lang'>(slug?: TSlug, lang?: TLang) => (Record<TSlug, string[]> & Record<TLang, string>)[];
}



type InferSourceConfig<T> = T extends Source<infer Config> ? Config : never;


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
    children: (Folder | File)[];
}

declare class StorageClass {
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

// Main Code Implementation



const group = /^\((?<name>.+)\)$/;
const link = /^(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
const separator = /^---(?<name>.*?)---$/;
const REST_NODE = "...";
const EXTRACT_PREFIX = "...";
const EXCLUDE_PREFIX = "!";


class Storage {
    files: Map<string, File>;
    folders: Map<string, Folder>;
    private rootFolder: Folder;

    constructor() {
        this.files = new Map();
        this.folders = new Map();
        this.rootFolder = {
            file: parseFolderPath(""),
            children: []
        };
        this.folders.set("", this.rootFolder);
    }

    read<F extends File['format']>(path: string, format: F): Extract<File, {
        format: F;
    }> | undefined {
        return this.files.get(`${path}.${format}`) as Extract<File, {format: F}>;
    }

    readDir(path: string): Folder | undefined {
        return this.folders.get(path);
    }

    root(): Folder {
        return this.rootFolder;
    }

    write<F extends File['format']>(path: string, format: F, data: Extract<File, {
        format: F;
    }>['data']): void {
        const node : File = {
            format,
            file: parseFilePath(path),
            data,
            
        } as File;
        this.makeDir(node.file.dirname);
        this.readDir(node.file.dirname)?.children.push(node);
        this.files.set(`${node.file.flattenedPath}.${node.format}`, node);
    }

    list(): File[] {
        return [...this.files.values()];
    }

    makeDir(path: string): void {
        const segments = splitPath(path);
        for (let i = 0; i < segments.length; i++) {
            const segment = segments.slice(0, i + 1).join("/");
            if (this.folders.has(segment)) continue;

            const folder = {
                file: parseFolderPath(segment),
                children: []
            };
            this.folders.set(folder.file.path, folder);
            this.readDir(folder.file.dirname)?.children.push(folder);
        }
    }
}

function buildAll(nodes: File[], ctx: any, skipIndex: boolean): any[] {
    const output: any[] = [];
    const folders: any[] = [];

    for (const node of [...nodes].sort((a, b) =>
      a.file.name.localeCompare(b.file.name)
    )) {
      if ("data" in node && node.format === "page" && !node.file.locale) {
        const treeNode = buildFileNode(node, ctx);
        if (node.file.name === "index") {
          if (!skipIndex) output.unshift(treeNode);
          continue;
        }
        output.push(treeNode);
      }
      if ("children" in node) {
        folders.push(buildFolderNode(node as Folder, false, ctx));
      }
    }

    return [...output, ...folders];
}

function resolveFolderItem(folder: Folder, item: string, ctx: any, addedNodePaths: Set<string>): any[] {
    if (item === REST_NODE) return [REST_NODE];

    const separatorMatch = separator.exec(item);
    if (separatorMatch?.groups) {
        const node = {
            type: "separator",
            name: separatorMatch.groups.name,
        };
        return [ctx.options.attachSeparator?.(node) ?? node];
    }

    const linkMatch = link.exec(item);
    if (linkMatch?.groups) {
        const { icon, url, name } = linkMatch.groups;
        const isRelative = url.startsWith("/") || url.startsWith("#") || url.startsWith(".");
        const node = {
            type: "page",
            icon: ctx.options.resolveIcon?.(icon),
            name,
            url,
            external: !isRelative,
        };
        return [removeUndefined(ctx.options.attachFile?.(node) ?? node)];
    }

    const isExcept = item.startsWith(EXCLUDE_PREFIX);
    const isExtract = item.startsWith(EXTRACT_PREFIX);
    let filename = item.slice(isExcept ? EXCLUDE_PREFIX.length : isExtract ? EXTRACT_PREFIX.length : 0);
    
    const path = resolvePath(folder.file.path, filename);
    const itemNode = ctx.storage.readDir(path) ?? ctx.storage.read(path, "page");

    if (!itemNode) return [];
    addedNodePaths.add(itemNode.file.path);

    if (isExcept) return [];
    if ("children" in itemNode) {
        const node = buildFolderNode(itemNode, false, ctx);
        return isExtract ? node.children : [node];
    }

    return [buildFileNode(itemNode, ctx)];
}

function buildFolderNode(folder: Folder, isGlobalRoot: boolean, ctx: any): any {
    const metaPath = resolvePath(folder.file.path, "meta");
    let meta = findLocalizedFile(metaPath, "meta", ctx) ?? ctx.storage.read(metaPath, "meta");

    const indexFile = ctx.storage.read(resolvePath(folder.file.flattenedPath, "index"), "page");
    const metadata = meta?.data;
    const index = indexFile ? buildFileNode(indexFile, ctx) : undefined;
    let children;

    if (!meta) {
        children = buildAll((folder.children as unknown) as File[], ctx, !isGlobalRoot);
    } else {
        const isRoot = metadata?.root ?? isGlobalRoot;
        const addedNodePaths = new Set<string>();

        const resolved = metadata?.pages?.flatMap((item: string) => resolveFolderItem(folder, item, ctx, addedNodePaths));
        const restNodes = buildAll(folder.children.filter((node) => !addedNodePaths.has(node.file.path)) as File[], ctx, !isRoot);

        children = resolved?.flatMap((item: string) => (item === REST_NODE ? restNodes : item)) ?? restNodes;
    }

    const node = {
        type: "folder",
        name: metadata?.title ?? index?.name ?? pathToName(folder.file.name, true),
        icon: ctx.options.resolveIcon?.(metadata?.icon) ?? index?.icon,
        root: metadata?.root,
        defaultOpen: metadata?.defaultOpen,
        description: metadata?.description,
        index,
        children,
        $ref: ctx.options.noRef ? undefined : { metaFile: meta?.file.path },
    };

    return removeUndefined(ctx.options.attachFolder?.(node, folder, meta) ?? node);
}

function buildFileNode(file: PageFile, ctx: any): any {
    const localized = findLocalizedFile(file.file.flattenedPath, "page", ctx) ?? file;
    const item = {
        type: "page",
        name: localized.data.data.title,
        icon: ctx.options.resolveIcon?.(localized.data.data.icon),
        url: ctx.options.getUrl(localized.data.slugs, ctx.lang),
        $ref: ctx.options.noRef ? undefined : { file: localized.file.path },
    };
    return removeUndefined(ctx.options.attachFile?.(item, file) ?? item);
}

/**
 * Constructs a tree structure starting from the root folder in the storage.
 * 
 * @param {Object} ctx - Context object containing storage and additional options.
 * @returns {Object} - The tree structure with the root folder's name and children.
 */
function build(ctx: any): any {
    const root = ctx.storage.root();
    const folder = buildFolderNode(root, true, ctx);

    return {
        name: folder.name,
        children: folder.children
    };
}

function findLocalizedFile(path: string, format: string, ctx: any) {
    return ctx.lang ? ctx.storage.read(`${path}.${ctx.lang}`, format) : undefined;
}

function pathToName(name: string, resolveGroup = false): string {
    const resolved = resolveGroup ? group.exec(name)?.[1] ?? name : name;
    return resolved.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function parseFilePath(path: string): FileInfo {
    const segments = splitPath(slash(path));
    const dirname = segments.slice(0, -1).join("/");
    const base = segments.at(-1) ?? "";
    const dotIdx = base.lastIndexOf(".");
    const nameWithLocale = dotIdx !== -1 ? base.slice(0, dotIdx) : base;
    const flattenedPath = [dirname, nameWithLocale].filter((p) => p.length > 0).join("/");
    const [name, locale] = getLocale(nameWithLocale);

    return {
        dirname,
        name,
        flattenedPath,
        locale,
        path: segments.join("/")
    };
}

function parseFolderPath(path: string): FileInfo {
    const segments = splitPath(slash(path));
    const base = segments.at(-1) ?? "";
    const [name, locale] = getLocale(base);
    const flattenedPath = segments.join("/");

    return {
        dirname: segments.slice(0, -1).join("/"),
        name,
        flattenedPath,
        locale,
        path: flattenedPath
    };
}

function getLocale(name: string): [string, string?] {
    const sep = name.lastIndexOf(".");
    if (sep === -1) return [name];
    const locale = name.slice(sep + 1);
    if (/\d+/.exec(locale)) return [name];
    return [name.slice(0, sep), locale];
}

function normalizePath(path: string): string {
    const segments = splitPath(slash(path));
    if (segments[0] === "." || segments[0] === "..") {
        throw new Error("Path must not start with './' or '../'");
    }
    return segments.join("/");
}

function loadFiles(files: VirtualFile[], options: LoadOptions): Storage {
    const { transformers = [] } = options;
    const storage = new Storage();
    const rootDir = normalizePath(options.rootDir ?? "");

    for (const file of files) {
        const normalizedPath = normalizePath(file.path);
        if (!normalizedPath.startsWith(rootDir)) continue;

        const relativePath = normalizedPath.slice(rootDir.length);
        if (file.type === "page") {
            const slugs = file.slugs ?? options.getSlugs(parseFilePath(relativePath));
            storage.write(relativePath, file.type, { slugs, data: file.data });
        }

        if (file.type === "meta") {
            storage.write(relativePath, file.type, file.data);
        }
    }

    for (const transformer of transformers) {
        transformer({ storage, options });
    }

    return storage;
}

/**
 * Creates a page tree builder with methods for building and internationalized (i18n) tree structures.
 */
function createPageTreeBuilder(): any {
    return {
        build(options: BuildPageTreeOptions): any {
            return build({
                options,
                builder: this,
                storage: options.storage
            });
        },
        buildI18n({ i18n, ...options }: { i18n: I18nConfig; }): Record<string, any> {
            const entries = i18n.languages.map((lang: string) => {
                const tree = build({
                    lang,
                    options,
                    builder: this,
                    storage: (options as any).storage,
                    i18n
                });
                return [lang, tree];
            });

            return Object.fromEntries(entries);
        }
    };
}

function indexPages(storage: Storage, getUrl: UrlFn, languages: string[] = []): any {
    const i18n = new Map<string, Map<string, any>>();
    const pages = new Map<string, any>();
    const metas = new Map<string, any>();
    const defaultMap = new Map<string, any>();
    i18n.set("", defaultMap);

    for (const file of storage.list()) {
        if (file.format === "meta") metas.set(file.file.path, fileToMeta(file));

        if (file.format === "page") {
            const page = fileToPage(file, getUrl, file.file.locale);
            pages.set(file.file.path, page);

            if (file.file.locale) continue;

            defaultMap.set(page.slugs.join("/"), page);

            for (const lang of languages) {
                const langMap = i18n.get(lang) ?? new Map<string, any>();
                const localized = storage.read(`${file.file.flattenedPath}.${lang}`, "page");
                const localizedPage = fileToPage(localized ?? file, getUrl, lang);
                langMap.set(localizedPage.slugs.join("/"), localizedPage);
                i18n.set(lang, langMap);
            }
        }
    }

    return {
        i18n,
        pathToPage: pages,
        pathToMeta: metas,
    };
}

function createGetUrl(baseUrl: string, i18n?: I18nConfig): UrlFn {
    return (slugs, locale) => {
        const hideLocale = i18n?.hideLocale ?? "never";
        let urlLocale;

        if (hideLocale === "never") {
            urlLocale = locale;
        } else if (hideLocale === "default-locale" && locale !== i18n?.defaultLanguage) {
            urlLocale = locale;
        }

        const paths = urlLocale
            ? [urlLocale, ...baseUrl.split("/"), ...slugs]
            : [...baseUrl.split("/"), ...slugs];

        return `/${paths.filter((v) => v.length > 0).join("/")}`;
    };
}

function getSlugs(info: FileInfo): string[] {
    return [...info.dirname.split("/"), info.name].filter(
        (v, i, arr) => {
            if (v.length === 0) return false;
            return i === arr.length - 1 ? v !== "index" : !/^\(.+\)$/.test(v);
        }
    );
}

function loader<Options extends LoaderOptions>(options: Options): any {
    return createOutput(options);
}

function createOutput(options: LoaderOptions): any {
    const {
        source,
        rootDir = "",
        baseUrl = "/",
        slugs: slugsFn = getSlugs,
        url: getUrl = createGetUrl(baseUrl, options.i18n),
    } = options;

    const storage = loadFiles(
        typeof source.files === "function" ? source.files(rootDir) : source.files,
        {
            transformers: options.transformers,
            rootDir,
            getSlugs: slugsFn,
        }
    );

    const walker = indexPages(storage, getUrl, options.i18n?.languages);

    const builder = createPageTreeBuilder();
    const pageTree =
        options.i18n === void 0
            ? builder.build({
                storage,
                resolveIcon: options.icon,
                getUrl,
                ...options.pageTree,
            })
            : builder.buildI18n({
                storage,
                resolveIcon: options.icon,
                getUrl,
                i18n: options.i18n,
                ...options.pageTree,
            });

    return {
        _i18n: options.i18n,
        pageTree,
        getPages(language = options.i18n?.defaultLanguage ?? "") {
            return Array.from(walker.i18n.get(language)?.values() ?? []);
        },
        getLanguages() {
            const list: LanguageEntry<any>[] = [];
            for (const [language, pages] of walker.i18n) {
                if (language === "") continue;
                list.push({
                    language,
                    pages: Array.from(pages.values()),
                });
            }
            return list;
        },
        getPage(slugs: string[] = [], language = options.i18n?.defaultLanguage ?? "") {
            return walker.i18n.get(language)?.get(slugs.join("/"));
        },
        getNodeMeta(node: any) {
            if (!node.$ref?.metaFile) return;
            return walker.pathToMeta.get(node.$ref.metaFile);
        },
        getNodePage(node: any) {
            if (!node.$ref?.file) return;
            return walker.pathToPage.get(node.$ref.file);
        },
        generateParams(slug?: string, lang?: string) {
            if (options.i18n) {
                return this.getLanguages().flatMap((entry: { pages: any[]; language: any; }) =>
                    entry.pages.map((page: { slugs: any; }) => ({
                        [slug ?? "slug"]: page.slugs,
                        [lang ?? "lang"]: entry.language,
                    }))
                );
            }
            return Array.from(walker.i18n.get("")?.values() ?? []).map((page : any)  => ({
                [slug ?? "slug"]: page.slugs,
            }));
        },
    };
}

function fileToMeta(file: MetaFile): Meta<any> {
    return {
        file: file.file,
        data: file.data,
    };
}

function fileToPage(file: PageFile, getUrl: UrlFn, locale: string | undefined): Page<any> {
    const page: Page<any> = {
        file: file.file,
        url: getUrl(file.data.slugs, locale),
        slugs: file.data.slugs,
        data: file.data.data,
        tags: [],
        locale,
    };

    if (page.file?.path) {
        const matterRead = matter.read(`content/docs/${page.file.path}`);
        const matterData = matterRead.data;

        if (matterData?.slug) {
            const newSlug = matterData.slug;
            const urlSplit = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${page.url}`).pathname.split('/');
            const urlManip = urlSplit[urlSplit.length - 1];

            if (urlManip === page.file.name) {
                if (page.slugs[page.slugs.length - 1] === page.file.name) {
                    page.slugs.splice(page.slugs.length - 1, 1);
                    if (newSlug.includes("/")) {
                        page.slugs.push(...newSlug.split('/').filter(Boolean));
                    } else {
                        page.slugs.push(newSlug);
                        page.url = `${page.url.split(urlManip)[0] + newSlug}`;
                    }
                }
            }
        }

        if (matterData?.tags) {
            matterData.tags.forEach((tag: string) => {
                page.tags.push(tag);
            });
        } else if (page.tags.length === 0) {
            page.tags.push(page.slugs[0]);
        }
    }

    return page;
}

export {
    Storage as FileSystem_Storage,
    createGetUrl,
    createPageTreeBuilder,
    getSlugs,
    loadFiles,
    loader,
    parseFilePath,
    parseFolderPath, type LoaderOptions,
};

