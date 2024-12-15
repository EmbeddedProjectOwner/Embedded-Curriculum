import {
  searchAdvanced,
  searchSimple
} from "../chunk-2ZSMGYVH.js";
import "../chunk-2V6SCS43.js";
import "../chunk-MLKGABMK.js";

// src/search/server.ts
import {
  save
} from "@orama/orama";

// src/search/create-endpoint.ts
function createEndpoint(server) {
  const { search } = server;
  return {
    ...server,
    async staticGET() {
      return Response.json(await server.export());
    },
    async GET(request) {
      const query = request.nextUrl.searchParams.get("query");
      if (!query) return Response.json([]);
      return Response.json(
        await search(query, {
          tag: request.nextUrl.searchParams.get("tag") ?? void 0,
          locale: request.nextUrl.searchParams.get("locale") ?? void 0
        })
      );
    }
  };
}

// src/search/create-db.ts
import {
  create,
  insertMultiple
} from "@orama/orama";
var advancedSchema = {
  content: "string",
  page_id: "string",
  type: "string",
  keywords: "string",
  tag: "string",
  url: "string"
};
async function createDB({
  indexes,
  tokenizer,
  search: _,
  ...rest
}) {
  const items = typeof indexes === "function" ? await indexes() : indexes;
  const db = create({
    ...rest,
    schema: advancedSchema,
    components: {
      tokenizer
    }
  });
  const mapTo = [];
  items.forEach((page) => {
    const data = page.structuredData;
    let id = 0;
    mapTo.push({
      id: page.id,
      page_id: page.id,
      type: "page",
      content: page.title,
      keywords: page.keywords,
      tag: page.tag,
      url: page.url
    });
    if (page.description) {
      mapTo.push({
        id: `${page.id}-${(id++).toString()}`,
        page_id: page.id,
        tag: page.tag,
        type: "text",
        url: page.url,
        content: page.description
      });
    }
    for (const heading of data.headings) {
      mapTo.push({
        id: `${page.id}-${(id++).toString()}`,
        page_id: page.id,
        type: "heading",
        tag: page.tag,
        url: `${page.url}#${heading.id}`,
        content: heading.content
      });
    }
    for (const content of data.contents) {
      mapTo.push({
        id: `${page.id}-${(id++).toString()}`,
        page_id: page.id,
        tag: page.tag,
        type: "text",
        url: content.heading ? `${page.url}#${content.heading}` : page.url,
        content: content.content
      });
    }
  });
  await insertMultiple(db, mapTo);
  return db;
}

// src/search/create-db-simple.ts
import {
  create as create2,
  insertMultiple as insertMultiple2
} from "@orama/orama";
async function createDBSimple({
  indexes,
  language
}) {
  const items = typeof indexes === "function" ? await indexes() : indexes;
  const db = create2({
    language,
    schema: {
      url: "string",
      title: "string",
      description: "string",
      content: "string",
      keywords: "string"
    }
  });
  await insertMultiple2(
    db,
    items.map((page) => ({
      title: page.title,
      description: page.description,
      url: page.url,
      content: page.content,
      keywords: page.keywords
    }))
  );
  return db;
}

// src/search/create-from-source.ts
function defaultToIndex(page) {
  if (!("structuredData" in page.data)) {
    throw new Error(
      "Cannot find structured data from page, please define the page to index function."
    );
  }
  return {
    title: page.data.title,
    description: "description" in page.data ? page.data.description : void 0,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData
  };
}
function createFromSource(source, pageToIndex = defaultToIndex, options = {}) {
  if (source._i18n) {
    return createI18nSearchAPI("advanced", {
      ...options,
      i18n: source._i18n,
      indexes: source.getLanguages().flatMap((entry) => {
        return entry.pages.map((page) => {
          return {
            ...pageToIndex(page),
            locale: entry.language
          };
        });
      })
    });
  }
  return createSearchAPI("advanced", {
    ...options,
    indexes: source.getPages().map((page) => {
      return pageToIndex(page);
    })
  });
}

// src/search/_stemmers.ts
var STEMMERS = {
  arabic: "ar",
  armenian: "am",
  bulgarian: "bg",
  danish: "dk",
  dutch: "nl",
  english: "en",
  finnish: "fi",
  french: "fr",
  german: "de",
  greek: "gr",
  hungarian: "hu",
  indian: "in",
  indonesian: "id",
  irish: "ie",
  italian: "it",
  lithuanian: "lt",
  nepali: "np",
  norwegian: "no",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "rs",
  slovenian: "ru",
  spanish: "es",
  swedish: "se",
  tamil: "ta",
  turkish: "tr",
  ukrainian: "uk",
  sanskrit: "sk"
};

// src/search/i18n-api.ts
function defaultLocaleMap(locale) {
  const map = STEMMERS;
  return Object.keys(map).find((lang) => map[lang] === locale) ?? locale;
}
async function initSimple(options) {
  const map = /* @__PURE__ */ new Map();
  if (options.i18n.languages.length === 0) {
    return map;
  }
  const indexes = typeof options.indexes === "function" ? await options.indexes() : options.indexes;
  for (const locale of options.i18n.languages) {
    const localeIndexes = indexes.filter((index) => index.locale === locale);
    const searchLocale = options.localeMap?.[locale] ?? defaultLocaleMap(locale);
    map.set(
      locale,
      typeof searchLocale === "object" ? initSimpleSearch({
        ...options,
        ...searchLocale,
        indexes: localeIndexes
      }) : initSimpleSearch({
        ...options,
        language: searchLocale,
        indexes: localeIndexes
      })
    );
  }
  return map;
}
async function initAdvanced(options) {
  const map = /* @__PURE__ */ new Map();
  if (options.i18n.languages.length === 0) {
    return map;
  }
  const indexes = typeof options.indexes === "function" ? await options.indexes() : options.indexes;
  for (const locale of options.i18n.languages) {
    const localeIndexes = indexes.filter((index) => index.locale === locale);
    const searchLocale = options.localeMap?.[locale] ?? defaultLocaleMap(locale);
    map.set(
      locale,
      typeof searchLocale === "object" ? initAdvancedSearch({
        ...options,
        indexes: localeIndexes,
        ...searchLocale
      }) : initAdvancedSearch({
        ...options,
        language: searchLocale,
        indexes: localeIndexes
      })
    );
  }
  return map;
}
function createI18nSearchAPI(type, options) {
  const get = type === "simple" ? initSimple(options) : initAdvanced(options);
  return createEndpoint({
    async export() {
      const map = await get;
      const entries = Object.entries(map).map(async ([k, v]) => [
        k,
        await v.export()
      ]);
      return {
        type: "i18n",
        data: Object.fromEntries(await Promise.all(entries))
      };
    },
    search: async (query, searchOptions) => {
      const map = await get;
      const locale = searchOptions?.locale ?? options.i18n.defaultLanguage;
      const handler = map.get(locale);
      if (handler) return handler.search(query, searchOptions);
      return [];
    }
  });
}

// src/search/server.ts
function createSearchAPI(type, options) {
  if (type === "simple") {
    return createEndpoint(initSimpleSearch(options));
  }
  return createEndpoint(initAdvancedSearch(options));
}
function initSimpleSearch(options) {
  const doc = createDBSimple(options);
  return {
    async export() {
      return {
        type: "simple",
        ...save(await doc)
      };
    },
    search: async (query) => {
      const db = await doc;
      return searchSimple(db, query, options.search);
    }
  };
}
function initAdvancedSearch(options) {
  const get = createDB(options);
  return {
    async export() {
      return {
        type: "advanced",
        ...save(await get)
      };
    },
    search: async (query, searchOptions) => {
      const db = await get;
      return searchAdvanced(db, query, searchOptions?.tag, options.search);
    }
  };
}
export {
  createFromSource,
  createI18nSearchAPI,
  createSearchAPI,
  initAdvancedSearch,
  initSimpleSearch
};
