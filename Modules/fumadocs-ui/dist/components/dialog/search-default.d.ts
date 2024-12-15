import { type ReactNode } from 'react';
import { type SharedProps } from './search';
import { type TagItem } from './tag-list';
export interface DefaultSearchDialogProps extends SharedProps {
    /**
     * @defaultValue 'fetch'
     */
    type?: 'fetch' | 'static';
    defaultTag?: string;
    tags?: TagItem[];
    /**
     * Search API URL
     */
    api?: string;
    /**
     * The debounced delay for performing a search.
     */
    delayMs?: number;
    footer?: ReactNode;
    /**
     * Allow to clear tag filters
     *
     * @defaultValue false
     */
    allowClear?: boolean;
}
export default function DefaultSearchDialog({ defaultTag, tags, api, delayMs, type, allowClear, ...props }: DefaultSearchDialogProps): ReactNode;
//# sourceMappingURL=search-default.d.ts.map