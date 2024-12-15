import { type OramaCloudOptions } from 'fumadocs-core/search/client';
import { type ReactNode } from 'react';
import { type SharedProps } from './search';
import { type TagItem } from './tag-list';
export interface OramaSearchDialogProps extends SharedProps {
    client: OramaCloudOptions['client'];
    searchOptions?: OramaCloudOptions['params'];
    footer?: ReactNode;
    defaultTag?: string;
    tags?: TagItem[];
    /**
     * Add the "Powered by Orama" label
     *
     * @defaultValue false
     */
    showOrama?: boolean;
    /**
     * Allow to clear tag filters
     *
     * @defaultValue false
     */
    allowClear?: boolean;
}
/**
 * Orama Cloud integration
 */
export default function OramaSearchDialog({ client, searchOptions, tags, defaultTag, showOrama, allowClear, ...props }: OramaSearchDialogProps): ReactNode;
//# sourceMappingURL=search-orama.d.ts.map