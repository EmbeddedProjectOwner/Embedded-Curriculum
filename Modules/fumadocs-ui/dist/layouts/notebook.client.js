'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { useSidebar } from '../contexts/sidebar';
export function LayoutBody(props) {
    const { collapsed } = useSidebar();
    return (_jsx("main", { id: "nd-docs-layout", ...props, className: cn('flex w-full flex-1 flex-row', props.className), style: {
            ...props.style,
            '--fd-content-width': collapsed
                ? '100vw'
                : 'calc(min(100vw, var(--fd-layout-width)) - var(--fd-sidebar-width))',
        }, children: props.children }));
}
