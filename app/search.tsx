'use client';

import { OramaClient } from '@oramacloud/client';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama';
import { useMode } from '@/app/layout.client';

const client = new OramaClient({
    endpoint: 'https://cloud.orama.run/v1/indexes/docs-fk97oe',
    api_key: process.env.ORAMA_API_KEY as string,
});

export default function CustomSearchDialog(
    props: SharedProps,
): React.ReactElement {
    return (
        <SearchDialog
            {...props}
            defaultTag={useMode() ?? 'ui'}
            allowClear
            tags={[
                {
                    name: 'Course 1',
                    value: 'course1',
                },
                {
                    name: 'Course 2',
                    value: 'ui',
                },
            ]}
            client={client}
            showOrama
        />
    );
}