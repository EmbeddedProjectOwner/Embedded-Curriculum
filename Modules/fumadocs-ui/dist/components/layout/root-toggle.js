'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/cn';
import { isActive } from '../../utils/is-active';
import { useSidebar } from '../../contexts/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useTreePath } from '../../contexts/tree';
export function RootToggle({ options, ...props }) {
    const [open, setOpen] = useState(false);
    const { closeOnRedirect } = useSidebar();
    const pathname = usePathname();
    const path = useTreePath();
    const selected = useMemo(() => {
        return options.findLast((item) => item.folder
            ? path.includes(item.folder)
            : isActive(item.url, pathname, true));
    }, [path, options, pathname]);
    const onClick = () => {
        closeOnRedirect.current = false;
        setOpen(false);
    };
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsxs(PopoverTrigger, { ...props, className: cn('flex flex-row items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-fd-accent/50 hover:text-fd-accent-foreground', props.className), children: [selected ? _jsx(Item, { ...selected }) : null, _jsx(ChevronDown, { className: "me-1.5 size-4 text-fd-muted-foreground" })] }), _jsx(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] overflow-hidden p-0", children: options.map((item) => (_jsx(Link, { href: item.url, onClick: onClick, ...item.props, className: cn('flex w-full flex-row items-center gap-2 px-2 py-1.5', selected === item
                        ? 'bg-fd-accent text-fd-accent-foreground'
                        : 'hover:bg-fd-accent/50', item.props?.className), children: _jsx(Item, { ...item }) }, item.url))) })] }));
}
function Item(props) {
    return (_jsxs(_Fragment, { children: [props.icon, _jsxs("div", { className: "flex-1 text-start", children: [_jsx("p", { className: "text-sm font-medium", children: props.title }), props.description ? (_jsx("p", { className: "text-xs text-fd-muted-foreground", children: props.description })) : null] })] }));
}
