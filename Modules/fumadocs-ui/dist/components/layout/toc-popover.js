'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { useI18n } from '../../contexts/i18n';
import * as Primitive from 'fumadocs-core/toc';
import { ChevronRight, Text } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, } from '../../components/ui/popover';
export const TocPopover = Popover;
export function TocPopoverTrigger({ items, ...props }) {
    const { text } = useI18n();
    const active = Primitive.useActiveAnchor();
    const current = useMemo(() => {
        return items.find((item) => active === item.url.slice(1))?.title;
    }, [items, active]);
    return (_jsxs(PopoverTrigger, { ...props, className: cn('inline-flex items-center gap-2 text-nowrap px-4 py-2 text-start', props.className), children: [_jsx(Text, { className: "size-4 shrink-0" }), text.toc, current ? (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { className: "-mx-1.5 size-4 shrink-0 text-fd-muted-foreground" }), _jsx("span", { className: "truncate text-fd-muted-foreground", children: current })] })) : null] }));
}
export function TocPopoverContent(props) {
    return (_jsx(PopoverContent, { hideWhenDetached: true, alignOffset: 16, align: "start", side: "bottom", "data-toc-popover": "", ...props, className: cn('flex max-h-[var(--radix-popover-content-available-height)] w-[260px] flex-col gap-4 p-3', props.className), children: props.children }));
}
