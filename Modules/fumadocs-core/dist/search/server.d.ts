import { TypedDocument, Orama, Language, SorterConfig, Tokenizer, DefaultTokenizerConfig, OramaPlugin, SearchParams } from '@orama/orama';
import { NextRequest } from 'next/server';
import { S as StructuredData } from '../remark-structure-mP51W1AN.js';
import { S as SortedResult } from '../types-Ch8gnVgO.js';
import { I as I18nConfig } from '../config-inq6kP6y.js';
import { LoaderOutput, LoaderConfig, InferPageType } from '../source/index.js';
import 'mdast';
import 'unified';
import 'unist-util-visit';
import 'react';
import '../page-tree-r8qjoUla.js';

type AdvancedDocument = TypedDocument<Orama<typeof advancedSchema>>;
declare const advancedSchema: {
    readonly content: "string";
    readonly page_id: "string";
    readonly type: "string";
    readonly keywords: "string";
    readonly tag: "string";
    readonly url: "string";
};

type SimpleDocument = TypedDocument<Orama<typeof schema>>;
declare const schema: {
    readonly url: "string";
    readonly title: "string";
    readonly description: "string";
    readonly content: "string";
    readonly keywords: "string";
};

type LocaleMap<O> = Record<string, Language | O>;
type Options$1<O extends SimpleOptions | AdvancedOptions, Idx> = Omit<O, 'language' | 'indexes'> & {
    i18n: I18nConfig;
    /**
     * Map locale name from i18n config to Orama compatible `language` or options
     */
    localeMap?: LocaleMap<Partial<O>>;
    indexes: WithLocale<Idx>[] | Dynamic<WithLocale<Idx>>;
};
type I18nSimpleOptions = Options$1<SimpleOptions, Index>;
type I18nAdvancedOptions = Options$1<AdvancedOptions, AdvancedIndex>;
type WithLocale<T> = T & {
    locale: string;
};
declare function createI18nSearchAPI<T extends 'simple' | 'advanced'>(type: T, options: T extends 'simple' ? I18nSimpleOptions : I18nAdvancedOptions): SearchAPI;

type Options = Omit<AdvancedOptions, 'language' | 'indexes'> & {
    localeMap?: LocaleMap<Partial<AdvancedOptions>>;
};
declare function createFromSource<S extends LoaderOutput<LoaderConfig>>(source: S, pageToIndex?: (page: InferPageType<S>) => AdvancedIndex, options?: Options): SearchAPI;

interface SearchServer {
    search: (query: string, options?: {
        locale?: string;
        tag?: string;
    }) => Promise<SortedResult[]>;
    /**
     * Export the database
     *
     * You can reference the exported database to implement client-side search
     */
    export: () => Promise<unknown>;
}
interface SearchAPI extends SearchServer {
    GET: (request: NextRequest) => Promise<Response>;
    /**
     * `GET` route handler that exports search indexes for static search.
     */
    staticGET: () => Promise<Response>;
}
/**
 * Resolve indexes dynamically
 */
type Dynamic<T> = () => T[] | Promise<T[]>;
interface SharedOptions {
    language?: string;
    sort?: SorterConfig;
    tokenizer?: Tokenizer | DefaultTokenizerConfig;
    plugins?: OramaPlugin[];
}
interface SimpleOptions extends SharedOptions {
    indexes: Index[] | Dynamic<Index>;
    /**
     * Customise search options on server
     */
    search?: Partial<SearchParams<Orama<typeof schema>, SimpleDocument>>;
}
interface AdvancedOptions extends SharedOptions {
    indexes: AdvancedIndex[] | Dynamic<AdvancedIndex>;
    /**
     * Customise search options on server
     */
    search?: Partial<SearchParams<Orama<typeof advancedSchema>, AdvancedDocument>>;
}
declare function createSearchAPI<T extends 'simple' | 'advanced'>(type: T, options: T extends 'simple' ? SimpleOptions : AdvancedOptions): SearchAPI;
interface Index {
    title: string;
    description?: string;
    content: string;
    url: string;
    keywords?: string;
}
declare function initSimpleSearch(options: SimpleOptions): SearchServer;
interface AdvancedIndex {
    id: string;
    title: string;
    description?: string;
    keywords?: string;
    /**
     * Required if tag filter is enabled
     */
    tag?: string;
    /**
     * preprocess mdx content with `structure`
     */
    structuredData: StructuredData;
    url: string;
}
declare function initAdvancedSearch(options: AdvancedOptions): SearchServer;

export { type AdvancedIndex, type AdvancedOptions, type Dynamic, type Index, type SearchAPI, type SearchServer, type SimpleOptions, createFromSource, createI18nSearchAPI, createSearchAPI, initAdvancedSearch, initSimpleSearch };
