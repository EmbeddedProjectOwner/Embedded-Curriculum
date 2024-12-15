'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Primitive from 'fumadocs-core/toc';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TocThumb } from '../../components/layout/toc-thumb';
import { ScrollArea, ScrollViewport } from '../ui/scroll-area';
import { TocItemsEmpty } from '../../components/layout/toc';
export default function ClerkTOCItems({ items, isMenu = false, }) {
    const viewRef = useRef(null);
    const containerRef = useRef(null);
    const [svg, setSvg] = useState();
    useEffect(() => {
        if (!containerRef.current)
            return;
        const container = containerRef.current;
        function onResize() {
            if (container.clientHeight === 0)
                return;
            let w = 0, h = 0;
            const d = [];
            for (let i = 0; i < items.length; i++) {
                const element = container.querySelector(`a[href="#${items[i].url.slice(1)}"]`);
                if (!element)
                    continue;
                const styles = getComputedStyle(element);
                const offset = getLineOffset(items[i].depth) + 1, top = element.offsetTop + parseFloat(styles.paddingTop), bottom = element.offsetTop +
                    element.clientHeight -
                    parseFloat(styles.paddingBottom);
                w = Math.max(offset, w);
                h = Math.max(h, bottom);
                d.push(`${i === 0 ? 'M' : 'L'}${offset} ${top}`);
                d.push(`L${offset} ${bottom}`);
            }
            setSvg({
                path: d.join(' '),
                width: w + 1,
                height: h,
            });
        }
        const observer = new ResizeObserver(onResize);
        onResize();
        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [items]);
    if (items.length === 0)
        return _jsx(TocItemsEmpty, {});
    return (_jsx(ScrollArea, { className: cn('flex flex-col', isMenu && '-ms-3'), children: _jsxs(ScrollViewport, { className: "relative min-h-0", ref: viewRef, children: [svg ? (_jsx("div", { className: "absolute start-0 top-0 rtl:-scale-x-100", style: {
                        width: svg.width,
                        height: svg.height,
                        maskImage: `url("data:image/svg+xml,${
                        // Inline SVG
                        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`)}")`,
                    }, children: _jsx(TocThumb, { containerRef: containerRef, className: "mt-[var(--fd-top)] h-[var(--fd-height)] bg-fd-primary transition-all" }) })) : null, _jsx(Primitive.ScrollProvider, { containerRef: viewRef, children: _jsx("div", { className: "flex flex-col", ref: containerRef, children: items.map((item, i) => (_jsx(TOCItem, { item: item, upper: items[i - 1]?.depth, lower: items[i + 1]?.depth }, item.url))) }) })] }) }));
}
function getItemOffset(depth) {
    if (depth <= 2)
        return 14;
    if (depth === 3)
        return 26;
    return 36;
}
function getLineOffset(depth) {
    return depth >= 3 ? 10 : 0;
}
function TOCItem({ item, upper = item.depth, lower = item.depth, }) {
    const offset = getLineOffset(item.depth), upperOffset = getLineOffset(upper), lowerOffset = getLineOffset(lower);
    return (_jsxs(Primitive.TOCItem, { href: item.url, style: {
            paddingInlineStart: getItemOffset(item.depth),
        }, className: "prose relative py-1.5 text-sm text-fd-muted-foreground transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-fd-primary", children: [offset !== upperOffset ? (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16", className: "absolute -top-1.5 start-0 size-4 rtl:-scale-x-100", children: _jsx("line", { x1: upperOffset, y1: "0", x2: offset, y2: "12", className: "stroke-fd-foreground/10", strokeWidth: "1" }) })) : null, _jsx("div", { className: cn('absolute inset-y-0 w-px bg-fd-foreground/10', offset !== upperOffset && 'top-1.5', offset !== lowerOffset && 'bottom-1.5'), style: {
                    insetInlineStart: offset,
                } }), item.title] }));
}
