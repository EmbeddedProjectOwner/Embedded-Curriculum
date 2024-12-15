'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useState } from 'react';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { useI18n } from '../../contexts/i18n';
import { SearchDialog } from './search';
import { TagsList } from './tag-list';
export default function DefaultSearchDialog({ defaultTag, tags, api, delayMs, type = 'fetch', allowClear = false, ...props }) {
    const { locale } = useI18n();
    const [tag, setTag] = useState(defaultTag);
    const { search, setSearch, query } = useDocsSearch(type === 'fetch'
        ? {
            type: 'fetch',
            api,
        }
        : {
            type: 'static',
            from: api,
        }, locale, tag, delayMs);
    useOnChange(defaultTag, (v) => {
        setTag(v);
    });
    return (_jsx(SearchDialog, { search: search, onSearchChange: setSearch, isLoading: query.isLoading, results: query.data ?? [], ...props, footer: tags ? (_jsxs(_Fragment, { children: [_jsx(TagsList, { tag: tag, onTagChange: setTag, items: tags, allowClear: allowClear }), props.footer] })) : (props.footer) }));
}
