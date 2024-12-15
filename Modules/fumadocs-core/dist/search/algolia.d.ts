import { SearchClient, SearchIndex } from 'algoliasearch';
import { S as StructuredData } from '../remark-structure-mP51W1AN.js';
import 'mdast';
import 'unified';
import 'unist-util-visit';

interface DocumentRecord {
    /**
     * The ID of document, must be unique
     */
    _id: string;
    title: string;
    description?: string;
    /**
     * URL to the page
     */
    url: string;
    structured: StructuredData;
    /**
     * Tag to filter results
     */
    tag?: string;
    /**
     * Data to be added to each section index
     */
    extra_data?: object;
}
interface SyncOptions {
    /**
     * Index Name for documents
     */
    document?: string;
    /**
     * Search indexes
     */
    documents: DocumentRecord[];
}
/**
 * Update index settings and replace all objects
 *
 * @param client - Algolia Admin Client
 * @param options - Index Options
 */
declare function sync(client: SearchClient, options: SyncOptions): Promise<void>;
declare function setIndexSettings(index: SearchIndex): Promise<void>;
declare function updateDocuments(index: SearchIndex, documents: DocumentRecord[]): Promise<void>;
interface BaseIndex {
    objectID: string;
    title: string;
    url: string;
    tag?: string;
    /**
     * The id of page, used for distinct
     */
    page_id: string;
    /**
     * Heading content
     */
    section?: string;
    /**
     * Heading (anchor) id
     */
    section_id?: string;
    content: string;
}

export { type BaseIndex, type DocumentRecord, type SyncOptions, setIndexSettings, sync, updateDocuments };
