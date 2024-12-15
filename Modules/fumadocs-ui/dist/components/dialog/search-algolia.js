'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocsSearch, } from 'fumadocs-core/search/client';
import { useState } from 'react';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { SearchDialog } from './search';
import { TagsList } from './tag-list';
export default function AlgoliaSearchDialog({ index, searchOptions, tags, defaultTag, showAlgolia = false, allowClear = false, ...props }) {
    const [tag, setTag] = useState(defaultTag);
    const { search, setSearch, query } = useDocsSearch({
        type: 'algolia',
        index,
        ...searchOptions,
    }, undefined, tag);
    useOnChange(defaultTag, (v) => {
        setTag(v);
    });
    return (_jsx(SearchDialog, { search: search, onSearchChange: setSearch, results: query.data ?? [], isLoading: query.isLoading, ...props, footer: tags ? (_jsxs(_Fragment, { children: [_jsx(TagsList, { tag: tag, onTagChange: setTag, items: tags, allowClear: allowClear, children: showAlgolia ? _jsx(AlgoliaTitle, {}) : null }), props.footer] })) : (props.footer) }));
}
function AlgoliaTitle() {
    return (_jsx("a", { href: "https://algolia.com", rel: "noreferrer noopener", className: "ms-auto text-xs text-fd-muted-foreground", children: "Search powered by Algolia" }));
}
