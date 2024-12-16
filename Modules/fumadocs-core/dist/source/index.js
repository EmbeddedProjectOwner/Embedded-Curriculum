import { removeUndefined } from "../chunk-2V6SCS43.js";
import { resolvePath, slash, splitPath } from "../chunk-SHGL6VBO.js";
import { __export } from "../chunk-MLKGABMK.js";
import matter from "gray-matter";


const group = /^\((?<name>.+)\)$/;
const link = /^(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
const separator = /^---(?<name>.*?)---$/;
const REST_NODE = "...";
const EXTRACT_PREFIX = "...";
const EXCLUDE_PREFIX = "!";

function buildAll(nodes, ctx, skipIndex) {
  const output = [];
  const folders = [];

  for (const node of [...nodes].sort((a, b) => a.file.name.localeCompare(b.file.name))) {
    if ("data" in node && node.format === "page" && !node.file.locale) {
      const treeNode = buildFileNode(node, ctx);
      if (node.file.name === "index") {
        if (!skipIndex) output.unshift(treeNode);
        continue;
      }
      output.push(treeNode);
    }
    if ("children" in node) {
      folders.push(buildFolderNode(node, false, ctx));
    }
  }

  return [...output, ...folders];
}

function resolveFolderItem(folder, item, ctx, addedNodePaths) {
  if (item === REST_NODE) return REST_NODE;

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

function buildFolderNode(folder, isGlobalRoot, ctx) {
  const metaPath = resolvePath(folder.file.path, "meta");
  let meta = findLocalizedFile(metaPath, "meta", ctx) ?? ctx.storage.read(metaPath, "meta");

  const indexFile = ctx.storage.read(resolvePath(folder.file.flattenedPath, "index"), "page");
  const metadata = meta?.data;
  const index = indexFile ? buildFileNode(indexFile, ctx) : undefined;
  let children;

  if (!meta) {
    children = buildAll(folder.children, ctx, !isGlobalRoot);
  } else {
    const isRoot = metadata?.root ?? isGlobalRoot;
    const addedNodePaths = new Set();

    const resolved = metadata?.pages?.flatMap((item) => resolveFolderItem(folder, item, ctx, addedNodePaths));
    const restNodes = buildAll(folder.children.filter((node) => !addedNodePaths.has(node.file.path)), ctx, !isRoot);

    children = resolved?.flatMap((item) => (item === REST_NODE ? restNodes : item)) ?? restNodes;
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

function buildFileNode(file, ctx) {
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
 * @param {Object} ctx.storage - Storage object with a `root()` method to access the root folder.
 * @returns {Object} - The tree structure with the root folder's name and children.
 */
function build(ctx) {
  // Retrieve the root folder from storage
  const root = ctx.storage.root();

  // Recursively build the folder node structure
  const folder = buildFolderNode(root, true, ctx);

  // Return the tree structure with the root folder's name and its children
  return {
    name: folder.name,
    children: folder.children
  };
}

function findLocalizedFile(path, format, ctx) {
  return ctx.lang ? ctx.storage.read(`${path}.${ctx.lang}`, format) : undefined;
}

function pathToName(name, resolveGroup = false) {
  const resolved = resolveGroup ? group.exec(name)?.[1] ?? name : name;
  return resolved.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}


function parseFilePath(path) {
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

function parseFolderPath(path) {
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

function getLocale(name) {
  const sep = name.lastIndexOf(".");
  if (sep === -1) return [name];
  const locale = name.slice(sep + 1);
  if (/\d+/.exec(locale)) return [name];
  return [name.slice(0, sep), locale];
}

function normalizePath(path) {
  const segments = splitPath(slash(path));
  if (segments[0] === "." || segments[0] === "..") {
    throw new Error("Path must not start with './' or '../'");
  }
  return segments.join("/");
}


const file_system_exports = {};
Object.assign(file_system_exports, {
  Storage: () => Storage
});

class Storage {
  constructor() {
    this.files = new Map();
    this.folders = new Map();
    this.rootFolder = {
      file: parseFolderPath(""),
      children: []
    };
    this.folders.set("", this.rootFolder);
  }

  /**
   * Reads a file based on path and format.
   * @param {string} path - Flattened file path.
   * @param {string} format - File format.
   */
  read(path, format) {
    return this.files.get(`${path}.${format}`);
  }

  /**
   * Reads a directory based on path.
   * @param {string} path - Directory path.
   */
  readDir(path) {
    return this.folders.get(path);
  }

  /**
   * Returns the root folder.
   */
  root() {
    return this.rootFolder;
  }

  /**
   * Writes a file to the storage.
   * @param {string} path - File path.
   * @param {string} format - File format.
   * @param {any} data - File data.
   */
  write(path, format, data) {
    const node = {
      format,
      file: parseFilePath(path),
      data
    };
    this.makeDir(node.file.dirname);
    this.readDir(node.file.dirname)?.children.push(node);
    this.files.set(`${node.file.flattenedPath}.${node.format}`, node);
  }

  /**
   * Lists all stored files.
   */
  list() {
    return [...this.files.values()];
  }

  /**
   * Creates a directory and its parent directories if needed.
   * @param {string} path - Directory path.
   */
  makeDir(path) {
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


function loadFiles(files, options) {
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
function createPageTreeBuilder() {
  return {
    /**
     * Builds a page tree based on the provided options.
     * @param {Object} options - Configuration options for building the tree.
     * @returns {Object} - The built page tree.
     */
    build(options) {
      return build({
        options,
        builder: this,
        storage: options.storage
      });
    },

    /**
     * Builds a page tree for multiple languages (i18n support).
     * @param {Object} params - Configuration options including i18n details.
     * @param {Object} params.i18n - Internationalization details.
     * @param {Array} params.i18n.languages - Array of language codes.
     * @param {Object} options - Additional configuration options.
     * @returns {Object} - A mapping of language codes to their respective page trees.
     */
    buildI18n({ i18n, ...options }) {
      const entries = i18n.languages.map((lang) => {
        const tree = build({
          lang,
          options,
          builder: this,
          storage: options.storage,
          i18n
        });
        return [lang, tree];
      });

      return Object.fromEntries(entries);
    }
  };
}


function indexPages(storage, getUrl, languages = []) {
  const i18n = /* @__PURE__ */ new Map();
  const pages = /* @__PURE__ */ new Map();
  const metas = /* @__PURE__ */ new Map();
  const defaultMap = /* @__PURE__ */ new Map();
  i18n.set("", defaultMap);

  for (const file of storage.list()) {
    if (file.format === "meta") metas.set(file.file.path, fileToMeta(file));

    if (file.format === "page") {
      const page = fileToPage(file, getUrl, file.file.locale);
      pages.set(file.file.path, page);

      if (file.file.locale) continue;

      defaultMap.set(page.slugs.join("/"), page);

      for (const lang of languages) {
        const langMap = i18n.get(lang) ?? /* @__PURE__ */ new Map();
        const localized = storage.read(
          `${file.file.flattenedPath}.${lang}`,
          "page"
        );
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

function createGetUrl(baseUrl, i18n) {
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

function getSlugs(info) {
  return [...info.dirname.split("/"), info.name].filter(
    (v, i, arr) => {
      if (v.length === 0) return false;
      return i === arr.length - 1 ? v !== "index" : !/^\(.+\)$/.test(v);
    }
  );
}

function loader(options) {
  return createOutput(options);
}

function createOutput(options) {
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
      const list = [];
      for (const [language, pages] of walker.i18n) {
        if (language === "") continue;
        list.push({
          language,
          pages: Array.from(pages.values()),
        });
      }
      return list;
    },
    getPage(slugs = [], language = options.i18n?.defaultLanguage ?? "") {
      return walker.i18n.get(language)?.get(slugs.join("/"));
    },
    getNodeMeta(node) {
      if (!node.$ref?.metaFile) return;
      return walker.pathToMeta.get(node.$ref.metaFile);
    },
    getNodePage(node) {
      if (!node.$ref?.file) return;
      return walker.pathToPage.get(node.$ref.file);
    },
    generateParams(slug, lang) {
      if (options.i18n) {
        return this.getLanguages().flatMap((entry) =>
          entry.pages.map((page) => ({
            [slug ?? "slug"]: page.slugs,
            [lang ?? "lang"]: entry.language,
          }))
        );
      }
      return Array.from(walker.i18n.get("")?.values() ?? []).map((page) => ({
        [slug ?? "slug"]: page.slugs,
      }));
    },
  };
}

function fileToMeta(file) {
  return {
    file: file.file,
    data: file.data,
  };
}

function fileToPage(file, getUrl, locale) {
  const page = {
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
      matterData.tags.forEach((tag) => {
        page.tags.push(tag)
      })
    } else if (page.tags.length == 0 ) {
      page.tags.push(page.slugs[0])
    }
  }

  return page;
}

export {
  file_system_exports as FileSystem,
  createGetUrl,
  createPageTreeBuilder,
  getSlugs,
  loadFiles,
  loader,
  parseFilePath,
  parseFolderPath,
};

