export { a as TOCItemType, T as TableOfContents, g as getTableOfContents } from '../get-toc-Dm1yr2Gr.js';
import { N as Node, I as Item, R as Root } from '../page-tree-r8qjoUla.js';
export { p as PageTree } from '../page-tree-r8qjoUla.js';
export { S as SortedResult } from '../types-Ch8gnVgO.js';
import { Metadata } from 'next';
import { NextRequest } from 'next/server';
import { LoaderOutput, LoaderConfig, InferPageType } from '../source/index.js';
export { H as HighlightOptions, c as createStyleTransformer, d as defaultThemes, h as highlight } from '../shiki-FJwEmGMA.js';
import 'react';
import '../config-inq6kP6y.js';
import 'shiki';
import 'shiki/themes';
import 'hast-util-to-jsx-runtime';

/**
 * Flatten tree to an array of page nodes
 */
declare function flattenTree(tree: Node[]): Item[];
/**
 * Get neighbours of a page, useful for implementing "previous & next" buttons
 */
declare function findNeighbour(tree: Root, url: string): {
    previous?: Item;
    next?: Item;
};
/**
 * Separate the folder nodes of a root into multiple roots
 */
declare function separatePageTree(pageTree: Root): Root[];

interface GetGithubLastCommitOptions {
    /**
     * Repository name, like "fumadocs"
     */
    repo: string;
    /** Owner of repository */
    owner: string;
    /**
     * Path to file
     */
    path: string;
    /**
     * GitHub access token
     */
    token?: string;
    /**
     * SHA or ref (branch or tag) name.
     */
    sha?: string;
    /**
     * Custom query parameters
     */
    params?: Record<string, string>;
    options?: RequestInit;
}
/**
 * Get the last edit time of a file using GitHub API
 *
 * By default, this will cache the result forever.
 * Set `options.next.revalidate` to customise this.
 */
declare function getGithubLastEdit({ repo, token, owner, path, sha, options, params: customParams, }: GetGithubLastCommitOptions): Promise<Date | null>;

interface ImageMeta {
    alt: string;
    url: string;
    width: number;
    height: number;
}
declare function createMetadataImage<S extends LoaderOutput<LoaderConfig>>(options: {
    source: S;
    /**
     * the route of your OG image generator.
     *
     * @example '/docs-og'
     * @defaultValue '/docs-og'
     */
    imageRoute?: string;
    /**
     * The filename of generated OG Image
     *
     * @defaultValue 'image.png'
     */
    filename?: string;
}): {
    getImageMeta: (slugs: string[]) => ImageMeta;
    /**
     * Add image meta tags to metadata
     */
    withImage: (slugs: string[], metadata?: Metadata) => Metadata;
    /**
     * Generate static params for OG Image Generator
     */
    generateParams: () => {
        slug: string[];
        lang?: string;
    }[];
    /**
     * create route handler for OG Image Generator
     */
    createAPI: (handler: (page: InferPageType<S>, request: NextRequest, options: {
        params: {
            slug: string[];
            lang?: string;
        } | Promise<{
            slug: string[];
            lang?: string;
        }>;
    }) => Response | Promise<Response>) => (request: NextRequest, options: any) => Response | Promise<Response>;
};

export { type GetGithubLastCommitOptions, createMetadataImage, findNeighbour, flattenTree, getGithubLastEdit, separatePageTree };
