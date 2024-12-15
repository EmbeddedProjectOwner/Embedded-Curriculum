import { S as SortedResult } from '../types-Ch8gnVgO.js';
import { SearchOptions } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch/lite';
import { OramaClient, ClientSearchParams } from '@oramacloud/client';

interface FetchOptions {
    /**
     * API route for search endpoint
     */
    api?: string;
}

interface StaticOptions {
    /**
     * Where to download exported search indexes (URL)
     */
    from?: string;
}

interface AlgoliaOptions extends SearchOptions {
    index: SearchIndex;
}

interface OramaCloudOptions {
    client: OramaClient;
    params?: ClientSearchParams;
}

interface UseDocsSearch {
    search: string;
    setSearch: (v: string) => void;
    query: {
        isLoading: boolean;
        data?: SortedResult[] | 'empty';
        error?: Error;
    };
}
type Client = ({
    type: 'fetch';
} & FetchOptions) | ({
    type: 'static';
} & StaticOptions) | ({
    type: 'algolia';
} & AlgoliaOptions) | ({
    type: 'orama-cloud';
} & OramaCloudOptions);
/**
 * @param client - search client
 * @param locale - Filter with locale
 * @param tag - Filter with specific tag
 * @param delayMs - The debounced delay for performing a search.
 * @param allowEmpty - still perform search even if query is empty
 * @param key - cache key
 */
declare function useDocsSearch(client: Client, locale?: string, tag?: string, delayMs?: number, allowEmpty?: boolean, key?: string): UseDocsSearch;

export { type AlgoliaOptions, type FetchOptions, type OramaCloudOptions, type StaticOptions, useDocsSearch };
