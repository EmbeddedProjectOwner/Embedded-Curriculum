'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import Link from 'fumadocs-core/link';
import { usePathname } from 'next/navigation';
import { forwardRef, } from 'react';
import { isActive } from '../utils/is-active';
export const BaseLinkItem = forwardRef(({ item, ...props }, ref) => {
    const pathname = usePathname();
    const activeType = item.active ?? 'url';
    const active = activeType !== 'none' &&
        isActive(item.url, pathname, activeType === 'nested-url');
    return (_jsx(Link, { ref: ref, href: item.url, external: item.external, ...props, "data-active": active, children: props.children }));
});
BaseLinkItem.displayName = 'BaseLinkItem';
