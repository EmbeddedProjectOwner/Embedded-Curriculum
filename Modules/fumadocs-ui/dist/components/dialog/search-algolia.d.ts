import { type AlgoliaOptions } from 'fumadocs-core/search/client';
import { type ReactNode } from 'react';
import { type SharedProps } from './search';
import { type TagItem } from './tag-list';
export interface AlgoliaSearchDialogProps extends SharedProps {
    index: AlgoliaOptions['index'];
    searchOptions?: Omit<AlgoliaOptions, 'index'>;
    footer?: ReactNode;
    defaultTag?: string;
    tags?: TagItem[];
    /**
     * Add the "Powered by Algolia" label, this is useful for free tier users
     *
     * @defaultValue false
     */
    showAlgolia?: boolean;
    /**
     * Allow to clear tag filters
     *
     * @defaultValue false
     */
    allowClear?: boolean;
}
export default function AlgoliaSearchDialog({ index, searchOptions, tags, defaultTag, showAlgolia, allowClear, ...props }: AlgoliaSearchDialogProps): ReactNode;
//# sourceMappingURL=search-algolia.d.ts.map