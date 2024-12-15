'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Primitive from 'fumadocs-core/toc';
import { useRef } from 'react';
import { cn } from '../../utils/cn';
import { useI18n } from '../../contexts/i18n';
import { TocThumb } from '../../components/layout/toc-thumb';
import { ScrollArea, ScrollViewport } from '../ui/scroll-area';
export function Toc(props) {
    return (_jsx("div", { ...props, "data-toc": "", className: cn('sticky top-fd-layout-top h-[var(--fd-toc-height)] flex-1 pb-2 pt-12', props.className), style: {
            ...props.style,
            '--fd-toc-height': 'calc(100dvh - var(--fd-banner-height) - var(--fd-nav-height))',
        }, children: props.children }));
}
export function TocItemsEmpty() {
    const { text } = useI18n();
    return (_jsx("div", { className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground", children: text.tocNoHeadings }));
}
export function TOCItems({ items, isMenu = false, }) {
    const containerRef = useRef(null);
    const viewRef = useRef(null);
    if (items.length === 0)
        return _jsx(TocItemsEmpty, {});
    return (_jsx(ScrollArea, { className: cn('flex flex-col', isMenu && '-ms-3'), children: _jsx(Primitive.ScrollProvider, { containerRef: viewRef, children: _jsxs(ScrollViewport, { className: "relative min-h-0 text-sm", ref: viewRef, children: [_jsx(TocThumb, { containerRef: containerRef, className: "absolute start-0 mt-[var(--fd-top)] h-[var(--fd-height)] w-px bg-fd-primary transition-all" }), _jsx("div", { ref: containerRef, className: cn('flex flex-col', !isMenu && 'border-s border-fd-foreground/10'), children: items.map((item) => (_jsx(TOCItem, { item: item }, item.url))) })] }) }) }));
}
function TOCItem({ item }) {
    return (_jsx(Primitive.TOCItem, { href: item.url, className: cn('prose py-1.5 text-sm text-fd-muted-foreground transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-fd-primary', item.depth <= 2 && 'ps-3.5', item.depth === 3 && 'ps-6', item.depth >= 4 && 'ps-8'), children: item.title }));
}
