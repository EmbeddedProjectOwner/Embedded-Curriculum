import {
  removeUndefined
} from "../chunk-2V6SCS43.js";
import {
  resolvePath,
  slash,
  splitPath
} from "../chunk-SHGL6VBO.js";
import {
  __export
} from "../chunk-MLKGABMK.js";
import matter from "gray-matter";

// src/source/page-tree-builder.ts
var group = /^\((?<name>.+)\)$/;
var link = /^(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
var separator = /^---(?<name>.*?)---$/;
var rest = "...";
var extractPrefix = "...";
var excludePrefix = "!";
function buildAll(nodes, ctx, skipIndex) {
  const output = [];
  const folders = [];
  for (const node of [...nodes].sort(
    (a, b) => a.file.name.localeCompare(b.file.name)
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
      folders.push(buildFolderNode(node, false, ctx));
    }
  }
  output.push(...folders);
  return output;
}
function resolveFolderItem(folder, item, ctx, addedNodePaths) {
  if (item === rest) return "...";
  const separateResult = separator.exec(item);
  if (separateResult?.groups) {
    const node = {
      type: "separator",
      name: separateResult.groups.name
    };
    return [ctx.options.attachSeparator?.(node) ?? node];
  }
  const linkResult = link.exec(item);
  if (linkResult?.groups) {
    const { icon, url, name } = linkResult.groups;
    const isRelative = url.startsWith("/") || url.startsWith("#") || url.startsWith(".");
    const node = {
      type: "page",
      icon: ctx.options.resolveIcon?.(icon),
      name,
      url,
      external: !isRelative
    };
    return [removeUndefined(ctx.options.attachFile?.(node) ?? node)];
  }
  const isExcept = item.startsWith(excludePrefix), isExtract = item.startsWith(extractPrefix);
  let filename = item;
  if (isExcept) {
    filename = item.slice(excludePrefix.length);
  } else if (isExtract) {
    filename = item.slice(extractPrefix.length);
  }
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
  let meta = ctx.storage.read(metaPath, "meta");
  meta = findLocalizedFile(metaPath, "meta", ctx) ?? meta;
  const indexFile = ctx.storage.read(
    resolvePath(folder.file.flattenedPath, "index"),
    "page"
  );
  const metadata = meta?.data;
  const index = indexFile ? buildFileNode(indexFile, ctx) : void 0;
  let children;
  if (!meta) {
    children = buildAll(folder.children, ctx, !isGlobalRoot);
  } else {
    const isRoot = metadata?.root ?? isGlobalRoot;
    const addedNodePaths = /* @__PURE__ */ new Set();
    const resolved = metadata?.pages?.flatMap((item) => {
      return resolveFolderItem(folder, item, ctx, addedNodePaths);
    });
    const restNodes = buildAll(
      folder.children.filter((node2) => !addedNodePaths.has(node2.file.path)),
      ctx,
      !isRoot
    );
    const nodes = resolved?.flatMap((item) => {
      if (item === "...") {
        return restNodes;
      }
      return item;
    });
    children = nodes ?? restNodes;
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
    $ref: !ctx.options.noRef ? {
      metaFile: meta?.file.path
    } : void 0
  };
  return removeUndefined(
    ctx.options.attachFolder?.(node, folder, meta) ?? node
  );
}
function buildFileNode(file, ctx) {
  const localized = findLocalizedFile(file.file.flattenedPath, "page", ctx) ?? file;
  const item = {
    type: "page",
    name: localized.data.data.title,
    icon: ctx.options.resolveIcon?.(localized.data.data.icon),
    url: ctx.options.getUrl(localized.data.slugs, ctx.lang),
    $ref: !ctx.options.noRef ? {
      file: localized.file.path
    } : void 0
  };
  return removeUndefined(ctx.options.attachFile?.(item, file) ?? item);
}
function build(ctx) {
  const root = ctx.storage.root();
  const folder = buildFolderNode(root, true, ctx);
  return {
    name: folder.name,
    children: folder.children
  };
}
function createPageTreeBuilder() {
  return {
    build(options) {
      return build({
        options,
        builder: this,
        storage: options.storage
      });
    },
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
function findLocalizedFile(path, format, ctx) {
  if (!ctx.lang) return;
  return ctx.storage.read(`${path}.${ctx.lang}`, format);
}
function pathToName(name, resolveGroup = false) {
  const resolved = resolveGroup ? group.exec(name)?.[1] ?? name : name;
  const result = [];
  for (const c of resolved) {
    if (result.length === 0) result.push(c.toLocaleUpperCase());
    else if (c === "-") result.push(" ");
    else result.push(c);
  }
  return result.join("");
}

// src/source/path.ts
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
  if (segments[0] === "." || segments[0] === "..")
    throw new Error("It must not start with './' or '../'");
  return segments.join("/");
}

// src/source/file-system.ts
var file_system_exports = {};
__export(file_system_exports, {
  Storage: () => Storage
});
var Storage = class {
  constructor() {
    this.files = /* @__PURE__ */ new Map();
    this.folders = /* @__PURE__ */ new Map();
    this.rootFolder = {
      file: parseFolderPath(""),
      children: []
    };
    this.folders.set("", this.rootFolder);
  }
  /**
   * @param path - flattened path
   * @param format - file format
   */
  read(path, format) {
    return this.files.get(`${path}.${format}`);
  }
  readDir(path) {
    return this.folders.get(path);
  }
  root() {
    return this.rootFolder;
  }
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
  list() {
    return [...this.files.values()];
  }
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
};

// src/source/load-files.ts
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
      storage.write(relativePath, file.type, {
        slugs,
        data: file.data
      });
    }
    if (file.type === "meta") {
      storage.write(relativePath, file.type, file.data);
    }
  }
  for (const transformer of transformers) {
    transformer({
      storage,
      options
    });
  }
  return storage;
}

// src/source/loader.ts
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
    pathToMeta: metas
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
    const paths = urlLocale ? [urlLocale, ...baseUrl.split("/"), ...slugs] : [...baseUrl.split("/"), ...slugs];
    return `/${paths.filter((v) => v.length > 0).join("/")}`;
  };
}
function getSlugs(info) {
  return [...info.dirname.split("/"), info.name].filter(
    // filter empty folder names and file groups like (group_name)
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
    url: getUrl = createGetUrl(baseUrl, options.i18n)
  } = options;
  const storage = loadFiles(
    typeof source.files === "function" ? source.files(rootDir) : source.files,
    {
      transformers: options.transformers,
      rootDir,
      getSlugs: slugsFn
    }
  );
  const walker = indexPages(storage, getUrl, options.i18n?.languages);
 /* walker.i18n.forEach((key) => {
    key.forEach((page) => {
      if (page && page.file && page.file.path) {
        const matterRead = matter.read(`content/docs/${page.file.path}`)
        const matterData = matterRead.data

        if (matterData && matterData.slug) {
            const newSlug = matterData.slug
            const urlManip = (() => {
                console.log()
                var urlSplit = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${page.url}`).pathname.split('/')
                console.log(urlSplit, urlSplit.length, urlSplit[5])
                return urlSplit[urlSplit.length - 1]
            })()

            if (urlManip == page.file.name) {
                if (page.slugs[page.slugs.length - 1] == page.file.name) {

                    page.slugs[page.slugs.length - 1] == null
                    console.log("OldSlug", page.slugs[page.slugs.length - 1])
                    if (newSlug.includes("/")) {
                        var splitSlug = newSlug.split('/')
                        for (let i = 0; i < splitSlug.length; i++) {

                            if (splitSlug[i] == '') {
                                splitSlug[i] == null
                            } else {
                                page.slugs.push(splitSlug[i])
                            }
                        }

                    } else {
                        page.slugs.push(newSlug)
                        page.url = `${page.url.split(urlManip)[0] + newSlug}`
                       console.log("NewSlug", page)
                    }
                }
            }
        }
    }
    })
  })*/
  console.log("hi")
  const builder = createPageTreeBuilder();
  const pageTree = options.i18n === void 0 ? builder.build({
    storage,
    resolveIcon: options.icon,
    getUrl,
    ...options.pageTree
  }) : builder.buildI18n({
    storage,
    resolveIcon: options.icon,
    getUrl,
    i18n: options.i18n,
    ...options.pageTree
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
          pages: Array.from(pages.values())
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
    // @ts-expect-error -- ignore this
    generateParams(slug, lang) {
      if (options.i18n) {
        return this.getLanguages().flatMap(
          (entry) => entry.pages.map((page) => ({
            [slug ?? "slug"]: page.slugs,
            [lang ?? "lang"]: entry.language
          }))
        );
      }
      return Array.from(walker.i18n.get("")?.values() ?? []).map((page) => ({
        [slug ?? "slug"]: page.slugs
      }));
    }
  };
}
function fileToMeta(file) {
  return {
    file: file.file,
    data: file.data
  };
}
function fileToPage(file, getUrl, locale) {
  var page = {
    file: file.file,
    url: getUrl(file.data.slugs, locale),
    slugs: file.data.slugs,
    data: file.data.data,
    locale
  };

  if (page && page.file && page.file.path) {
    const matterRead = matter.read(`content/docs/${page.file.path}`)
    const matterData = matterRead.data

    if (matterData && matterData.slug) {
        const newSlug = matterData.slug
        const urlManip = (() => {
            console.log()
            var urlSplit = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/${page.url}`).pathname.split('/')
            console.log(urlSplit, urlSplit.length, urlSplit[5])
            return urlSplit[urlSplit.length - 1]
        })()

        if (urlManip == page.file.name) {
            if (page.slugs[page.slugs.length - 1] == page.file.name) {

                console.log("OldSlug", page.slugs[page.slugs.length - 1])
                page.slugs.splice(page.slugs.length - 1, 1)
                console.log("OldSlug", page.slugs[page.slugs.length - 1])
                if (newSlug.includes("/")) {
                    var splitSlug = newSlug.split('/')
                    for (let i = 0; i < splitSlug.length; i++) {

                        if (splitSlug[i] == '') {
                            splitSlug[i] == null
                        } else {
                            page.slugs.push(splitSlug[i])
                        }
                    }

                } else {
                    page.slugs.push(newSlug)
                    page.url = `${page.url.split(urlManip)[0] + newSlug}`
                   console.log("NewSlug", page)
                }
            }
        }
    }
  }

  return page
}
export {
  file_system_exports as FileSystem,
  createGetUrl,
  createPageTreeBuilder,
  getSlugs,
  loadFiles,
  loader,
  parseFilePath,
  parseFolderPath
};
