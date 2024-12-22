'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocsSearch, } from 'fumadocs-core/search/client';
import { useState } from 'react';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { SearchDialog } from './search';
import { TagsList } from './tag-list';
/**
 * Orama Cloud integration
 */
export default function OramaSearchDialog({ client, searchOptions, tags, defaultTag, showOrama = false, allowClear = false, ...props }) {
    "use cache"
    const [tag, setTag] = useState(defaultTag);
    const { search, setSearch, query } = useDocsSearch({
        type: 'orama-cloud',
        client,
        params: searchOptions,
    }, undefined, tag);
    useOnChange(defaultTag, (v) => {
        setTag(v);
    });
    return (_jsx(SearchDialog, { search: search, onSearchChange: setSearch, results: query.data ?? [], isLoading: query.isLoading, ...props, footer: tags ? (_jsxs(_Fragment, { children: [_jsx(TagsList, { tag: tag, onTagChange: setTag, items: tags, allowClear: allowClear, children: showOrama ? _jsx(Label, {}) : null }), props.footer] })) : (props.footer) }));
}
function Label() {
    return (_jsx("a", { href: "https://orama.com", rel: "noreferrer noopener", className: "ms-auto text-xs text-fd-muted-foreground", children: "Search powered by Orama" }));
}
