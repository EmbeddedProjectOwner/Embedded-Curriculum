'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { useState, } from 'react';
import { usePathname } from 'next/navigation';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { cn } from '../utils/cn';
import { Popover, PopoverContent, PopoverTrigger, } from '../components/ui/popover';
import { BaseLinkItem } from '../layouts/links';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '../components/ui/collapsible';
import { cva } from 'class-variance-authority';
import { buttonVariants } from '../components/ui/button';
const itemVariants = cva('flex flex-row items-center gap-2 rounded-md px-3 py-2.5 text-fd-muted-foreground transition-colors duration-100 [overflow-wrap:anywhere] hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none md:px-2 md:py-1.5 [&_svg]:size-4');
export function LinksMenu({ items, ...props }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    useOnChange(pathname, () => {
        setOpen(false);
    });
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { ...props }), _jsx(PopoverContent, { className: "flex flex-col p-1", children: items.map((item, i) => (_jsx(MenuItem, { item: item }, i))) })] }));
}
export function MenuItem({ item, ...props }) {
    if (item.type === 'custom')
        return (_jsx("div", { ...props, className: cn('grid', props.className), children: item.children }));
    if (item.type === 'menu') {
        return (_jsxs(Collapsible, { className: "flex flex-col", children: [_jsxs(CollapsibleTrigger, { ...props, className: cn(itemVariants(), 'group/link', props.className), children: [item.icon, item.text, _jsx(ChevronDown, { className: "ms-auto transition-transform group-data-[state=closed]/link:-rotate-90" })] }), _jsx(CollapsibleContent, { children: _jsx("div", { className: "flex flex-col py-2 ps-2", children: item.items.map((child, i) => (_jsx(MenuItem, { item: child }, i))) }) })] }));
    }
    return (_jsxs(BaseLinkItem, { item: item, ...props, className: cn(item.type === 'button'
            ? buttonVariants({
                color: 'secondary',
                className: 'gap-1.5 [&_svg]:size-4',
            })
            : itemVariants(), props.className), children: [item.icon, item.text] }));
}
